import { Book, CatalogData, Folder, ItemType } from '../types';
import { uploadFileOptimized, UploadOptions, UploadResult } from '../utils/uploader';
import { storage } from './storage';
import type { TopicRequestWithReply } from './topicRequests';

const ADMIN_TOKEN_KEY = 'khafi_admin_token';

function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setAdminToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  const headers: Record<string, string> = { ...extraHeaders };
  if (token) {
    headers['x-admin-token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Safely parse JSON from a fetch Response, handling empty bodies, HTML error pages,
 * and malformed responses without throwing "Unexpected end of JSON input".
 */
async function safeParseJson<T = any>(res: Response): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  let text = '';
  try {
    text = await res.text();
  } catch (err: any) {
    return { ok: false, status: res.status, data: null, error: err.message || 'Failed to read response body.' };
  }

  if (!text || text.trim() === '') {
    if (res.ok) {
      return { ok: true, status: res.status, data: {} as T };
    }
    return { ok: false, status: res.status, data: null, error: `Server returned an empty response (HTTP ${res.status}).` };
  }

  try {
    const json = JSON.parse(text);
    return {
      ok: res.ok,
      status: res.status,
      data: json,
      error: !res.ok ? (json?.error || json?.message || `Request failed with HTTP status ${res.status}`) : undefined,
    };
  } catch {
    // Response was not valid JSON (e.g. HTML 404/502/504 page from Cloudflare or reverse proxy)
    const preview = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 120);
    return {
      ok: false,
      status: res.status,
      data: null,
      error: preview ? `Server error (${res.status}): ${preview}` : `Server returned non-JSON response (HTTP ${res.status}).`,
    };
  }
}

let cachedCatalog: CatalogData | null = null;

try {
  const stored = sessionStorage.getItem('khafi_last_catalog');
  if (stored) {
    cachedCatalog = JSON.parse(stored);
  }
} catch {}

/**
 * Helper to execute fetch with retry for transient network hiccups or server restarts
 */
async function fetchWithRetry(url: string, options?: RequestInit, retries = 2, delayMs = 300): Promise<Response> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || (res.status !== 502 && res.status !== 503 && res.status !== 504)) {
        return res;
      }
      // If server returned 502/503/504, wait and retry
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    if (i < retries) {
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastError;
}

import { EMPTY_PAYMENT_SETTINGS, PaymentSettings } from '../types';

// Gate key (follow gate): the key is shared by the admin in the Instagram
// broadcast channel and checked server-side. The browser never sees it.
export const DEFAULT_BROADCAST_CHANNEL_URL = 'https://www.instagram.com/channel/ZKdxHLW9r2VpKow7/';

export interface GateSettings {
  gateKey: string;
  channelUrl: string;
}

export const EMPTY_GATE_SETTINGS: GateSettings = {
  gateKey: '',
  channelUrl: DEFAULT_BROADCAST_CHANNEL_URL,
};

export interface GateStatus {
  keySet: boolean;
  channelUrl: string;
}

export interface GateSettingsAdmin {
  keySet: boolean;
  channelUrl: string;
}

export function isGateKeySet(status: GateStatus | null | undefined): boolean {
  return Boolean(status?.keySet);
}

// Follow-unlock header: the library gate flag. A visitor who unlocked
// the library gate (follow tap or gate key) sends this header with
// catalog and file requests. TRUST-BASED, exactly like the gate itself —
// the header carries only the boolean unlock flag, never the gate key or
// any secret. One helper, used by every catalog/file call (catalog fetch
// here, file downloads in utils/fileUtils, and the in-app viewers). The
// flag opens the library and free books. A paid book needs its own key:
// a visitor holding a book's own unlock key sends that too (see
// BOOK_KEYS_HEADER below) — only that opens the book, and there is no
// payment step anywhere.
export const FOLLOW_UNLOCK_HEADER = 'x-follow-unlocked';

export function getFollowUnlockHeaders(): Record<string, string> {
  return storage.hasFollowUnlocked() ? { [FOLLOW_UNLOCK_HEADER]: '1' } : {};
}

// Paid-book keys header: the browser sends the keys it holds (one per
// paid book, { bookId: key }) as base64url JSON, so the server can check
// them and expose that book's links / files. A key unlocks ONE book only.
// The keys are stored on this device only (see storage.ts).
export const BOOK_KEYS_HEADER = 'x-book-keys';

export function getBookKeyHeaders(): Record<string, string> {
  const keys = storage.getBookKeys();
  const ids = Object.keys(keys);
  if (ids.length === 0) return {};
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(keys))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return { [BOOK_KEYS_HEADER]: encoded };
  } catch {
    return {};
  }
}

/** Catalog + file headers: admin token, gate flag, and any paid-book keys. */
export function getPaidBookHeaders(): Record<string, string> {
  return { ...getFollowUnlockHeaders(), ...getBookKeyHeaders() };
}

let inFlightCatalogPromise: Promise<CatalogData> | null = null;
let inFlightCheckAdminPromise: Promise<{ authenticated: boolean; username?: string }> | null = null;

// Where the catalog in hand came from: 'live' (the API), 'static' (the
// build-time public/catalog.json fallback, whose paid-book links are
// always stripped), or 'cached' (this browser session's last copy).
// Views use it to tell an unlocked follower honestly when a paid book's
// link is missing only because the live catalog did not load.
let lastCatalogSource: 'live' | 'static' | 'cached' | 'none' = 'none';

export const api = {
  /** Where the current catalog came from (see lastCatalogSource). */
  getCatalogSource(): 'live' | 'static' | 'cached' | 'none' {
    return lastCatalogSource;
  },

  /** Drop the in-flight / cached catalog promise so the next getCatalog()
   *  re-requests the live API (used by the "retry" action when the live
   *  catalog failed and only the stripped static copy is in hand). */
  async reloadCatalog(): Promise<CatalogData> {
    inFlightCatalogPromise = null;
    return this.getCatalog();
  },

  async getCatalog(): Promise<CatalogData> {
    if (inFlightCatalogPromise) {
      return inFlightCatalogPromise;
    }

    inFlightCatalogPromise = (async () => {
      // 1) Live API first: this is the only source that reflects admin
      // edits, paid marks and Drive sync made after this build.
      try {
        const res = await fetchWithRetry('/api/catalog', {
          headers: getAuthHeaders(getPaidBookHeaders()),
        });
        const parsed = await safeParseJson<CatalogData>(res);
        if (parsed.ok && parsed.data && (parsed.data.books?.length || parsed.data.folders?.length)) {
          cachedCatalog = parsed.data;
          lastCatalogSource = 'live';
          try {
            sessionStorage.setItem('khafi_last_catalog', JSON.stringify(parsed.data));
          } catch {}
          return parsed.data;
        }
        console.warn('API catalog empty or failed, falling back to static catalog:', parsed.error || res.status);
      } catch (err) {
        console.warn('API catalog unreachable, falling back to static catalog:', err);
      }

      // 2) Static fallback: public/catalog.json, copied from
      // data/catalog.json at build time (scripts/copy-catalog.mjs) and
      // served as a plain file, so the library still shows all 173 books
      // on a static-only deploy where /api/catalog 404s (Vercel Drop
      // deploy without the serverless api/index.ts). It is a snapshot
      // from build time, and paid-book links are stripped in the copy,
      // exactly as the API does for locked visitors. That means an
      // unlocked follower on this fallback sees paid books WITHOUT their
      // links: the book page says so honestly and offers a retry instead
      // of silently showing a lock screen. The static copy is never
      // "fixed up" with links client-side.
      try {
        const staticRes = await fetch('/catalog.json', { cache: 'no-cache' });
        const staticParsed = await safeParseJson<CatalogData>(staticRes);
        if (staticParsed.ok && staticParsed.data && (staticParsed.data.books?.length || staticParsed.data.folders?.length)) {
          cachedCatalog = staticParsed.data;
          lastCatalogSource = 'static';
          try {
            sessionStorage.setItem('khafi_last_catalog', JSON.stringify(staticParsed.data));
          } catch {}
          return staticParsed.data;
        }
        console.error('Static catalog fallback failed:', staticParsed.error || staticRes.status);
      } catch (err) {
        console.error('Static catalog fallback unreachable:', err);
      }

      // 3) Last resort: the catalog cached in this browser session.
      if (cachedCatalog && (cachedCatalog.folders?.length > 0 || cachedCatalog.books?.length > 0)) {
        lastCatalogSource = 'cached';
        return cachedCatalog;
      }
      return { folders: [], books: [] };
    })();

    return inFlightCatalogPromise;
  },

  async getPaymentSettings(): Promise<PaymentSettings> {
    try {
      const res = await fetch('/api/payment-settings');
      const parsed = await safeParseJson<PaymentSettings>(res);
      if (parsed.ok && parsed.data) {
        return {
          upiId: parsed.data.upiId || '',
          upiQrUrl: parsed.data.upiQrUrl || '',
          displayName: parsed.data.displayName || '',
        };
      }
    } catch (err) {
      console.error('Failed to load payment settings:', err);
    }
    return { ...EMPTY_PAYMENT_SETTINGS };
  },

  /** Public site settings: maintenance flag + message only. */
  async getSiteSettings(): Promise<{ maintenance: { enabled: boolean; message: string } }> {
    try {
      const res = await fetch('/api/site-settings');
      const parsed = await safeParseJson<{ maintenance?: { enabled?: boolean; message?: string } }>(res);
      if (parsed.ok && parsed.data?.maintenance) {
        return {
          maintenance: {
            enabled: Boolean(parsed.data.maintenance.enabled),
            message: parsed.data.maintenance.message || '',
          },
        };
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    }
    return { maintenance: { enabled: false, message: '' } };
  },

  async saveSiteSettings(settings: { maintenance: { enabled: boolean; message: string } }): Promise<{ success: boolean; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(settings),
      });
      const parsed = await safeParseJson<{ success: boolean; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok) return { success: false, error: parsed.error || 'Failed to save site settings.' };
      return { success: true, durable: parsed.data?.durable, durableWarning: parsed.data?.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save site settings.' };
    }
  },

  /** Key unlock: check a key for one paid book. On success the caller
   *  stores the key on the device (storage.saveBookKey) and reloads the
   *  catalog so that book's links appear. */
  async verifyBookKey(bookId: string, key: string): Promise<{ ok: boolean; usesLeft?: number; maxUses?: number; error?: string }> {
    try {
      const res = await fetch('/api/book-keys/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, key }),
      });
      const parsed = await safeParseJson<{ ok?: boolean; usesLeft?: number; maxUses?: number; error?: string }>(res);
      if (parsed.ok && parsed.data?.ok) {
        return { ok: true, usesLeft: parsed.data.usesLeft, maxUses: parsed.data.maxUses };
      }
      return { ok: false, error: parsed.error || parsed.data?.error || 'Wrong key. Check the key and try again.' };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Failed to check the key.' };
    }
  },

  /** Admin: list all book keys + monitor totals (no plain keys, no hashes). */
  async getBookKeys(): Promise<{ keys: any[]; totals: any | null }> {
    try {
      const res = await fetch('/api/admin/book-keys', { headers: getAuthHeaders() });
      const parsed = await safeParseJson<{ keys?: any[]; totals?: any }>(res);
      if (parsed.ok && parsed.data) return { keys: parsed.data.keys || [], totals: parsed.data.totals || null };
    } catch (err) {
      console.error('Failed to load book keys:', err);
    }
    return { keys: [], totals: null };
  },

  /** Admin: generate a key for one paid book. Returns the plain key ONCE —
   *  copy it and share it with the follower now; it cannot be shown again. */
  async generateBookKey(bookId: string, maxUses: number, label?: string): Promise<{ success: boolean; plainKey?: string; key?: any; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/book-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ bookId, maxUses, label: label || '' }),
      });
      const parsed = await safeParseJson<{ success?: boolean; plainKey?: string; key?: any; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data?.success) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to generate key.' };
      }
      return { success: true, plainKey: parsed.data.plainKey, key: parsed.data.key, durable: parsed.data.durable, durableWarning: parsed.data.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to generate key.' };
    }
  },

  async revokeBookKey(keyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/book-keys/${encodeURIComponent(keyId)}/revoke`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const parsed = await safeParseJson<{ success?: boolean; error?: string }>(res);
      if (!parsed.ok || !parsed.data?.success) return { success: false, error: parsed.error || parsed.data?.error || 'Failed to revoke key.' };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to revoke key.' };
    }
  },

  async deleteBookKey(keyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/book-keys/${encodeURIComponent(keyId)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const parsed = await safeParseJson<{ success?: boolean; error?: string }>(res);
      if (!parsed.ok || !parsed.data?.success) return { success: false, error: parsed.error || parsed.data?.error || 'Failed to delete key.' };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete key.' };
    }
  },

  /** Public library status: whether live Drive sync is configured. */
  async getLibraryStatus(): Promise<{ driveConfigured: boolean; mode: string; books: number; paidBooks: number }> {
    try {
      const res = await fetch('/api/library-status');
      const parsed = await safeParseJson<{ driveConfigured?: boolean; mode?: string; books?: number; paidBooks?: number }>(res);
      if (parsed.ok && parsed.data) {
        return {
          driveConfigured: Boolean(parsed.data.driveConfigured),
          mode: parsed.data.mode || '',
          books: parsed.data.books || 0,
          paidBooks: parsed.data.paidBooks || 0,
        };
      }
    } catch (err) {
      console.error('Failed to load library status:', err);
    }
    return { driveConfigured: false, mode: '', books: 0, paidBooks: 0 };
  },

  async savePaymentSettings(settings: PaymentSettings): Promise<{ success: boolean; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(settings),
      });
      const parsed = await safeParseJson<{ success: boolean; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok) return { success: false, error: parsed.error || 'Failed to save payment settings.' };
      return { success: true, durable: parsed.data?.durable, durableWarning: parsed.data?.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save payment settings.' };
    }
  },

  /** Public gate status: whether a key is set, plus the broadcast channel link. */
  async getGateStatus(): Promise<GateStatus> {
    try {
      const res = await fetch('/api/gate/status');
      const parsed = await safeParseJson<GateStatus>(res);
      if (parsed.ok && parsed.data) {
        return {
          keySet: Boolean(parsed.data.keySet),
          channelUrl: parsed.data.channelUrl || DEFAULT_BROADCAST_CHANNEL_URL,
        };
      }
    } catch (err) {
      console.error('Failed to load gate status:', err);
    }
    return { keySet: false, channelUrl: DEFAULT_BROADCAST_CHANNEL_URL };
  },

  /** Check a gate key server-side. The key is never compared in the browser. */
  async unlockGate(key: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/gate/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const parsed = await safeParseJson<{ ok?: boolean; error?: string }>(res);
      if (parsed.ok && parsed.data?.ok) return { ok: true };
      return { ok: false, error: parsed.error || parsed.data?.error || 'Wrong key. Try again.' };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Failed to check the key.' };
    }
  },

  /** Admin inbox: every visitor message (comment / request / question),
   *  newest first, each with its latest admin reply. When the service key
   *  is not set up yet the server answers 503 — `notConfigured` is true
   *  and the inbox shows the plain setup message instead of failing. */
  async getTopicRequests(): Promise<{ items: TopicRequestWithReply[]; error?: string; notConfigured?: boolean }> {
    try {
      const res = await fetch('/api/admin/topic-requests', { headers: getAuthHeaders() });
      const parsed = await safeParseJson<{ items?: TopicRequestWithReply[]; error?: string }>(res);
      if (parsed.status === 503) return { items: [], error: parsed.error || 'Replies are not set up yet.', notConfigured: true };
      if (parsed.ok && parsed.data) return { items: parsed.data.items || [] };
      return { items: [], error: parsed.error || 'Could not load messages.' };
    } catch (err: any) {
      return { items: [], error: err.message || 'Could not load messages.' };
    }
  },

  /** Admin inbox: how many messages are still new — the bell badge count. */
  async getTopicRequestsUnread(): Promise<{ unread: number }> {
    try {
      const res = await fetch('/api/admin/topic-requests/unread', { headers: getAuthHeaders() });
      const parsed = await safeParseJson<{ unread?: number }>(res);
      if (parsed.ok && parsed.data) return { unread: Number(parsed.data.unread) || 0 };
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
    return { unread: 0 };
  },

  /** Admin inbox: approve one message so it shows on the public site. */
  async approveTopicRequest(id: number | string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/topic-requests/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const parsed = await safeParseJson<{ success?: boolean; error?: string }>(res);
      if (!parsed.ok) return { success: false, error: parsed.error || 'Could not approve this message.' };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Could not approve this message.' };
    }
  },

  /** Admin inbox: send a reply to one message. */
  async replyToTopicRequest(id: number | string, reply: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/topic-requests/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ reply }),
      });
      const parsed = await safeParseJson<{ success?: boolean; error?: string }>(res);
      if (!parsed.ok) return { success: false, error: parsed.error || 'Could not send the reply.' };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Could not send the reply.' };
    }
  },

  /** Admin gate settings (keySet only — the key value is never sent). */
  async getGateSettings(): Promise<GateSettingsAdmin> {
    try {
      const res = await fetch('/api/admin/gate-settings', { headers: getAuthHeaders() });
      const parsed = await safeParseJson<GateSettingsAdmin>(res);
      if (parsed.ok && parsed.data) {
        return {
          keySet: Boolean(parsed.data.keySet),
          channelUrl: parsed.data.channelUrl || DEFAULT_BROADCAST_CHANNEL_URL,
        };
      }
    } catch (err) {
      console.error('Failed to load gate settings:', err);
    }
    return { keySet: false, channelUrl: DEFAULT_BROADCAST_CHANNEL_URL };
  },

  async saveGateSettings(input: { gateKey?: string; channelUrl?: string; removeKey?: boolean }): Promise<{ success: boolean; durable?: boolean; durableWarning?: string; keySet?: boolean; channelUrl?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/gate-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(input),
      });
      const parsed = await safeParseJson<{ success: boolean; durable?: boolean; durableWarning?: string; keySet?: boolean; channelUrl?: string; error?: string }>(res);
      if (!parsed.ok) return { success: false, error: parsed.error || 'Failed to save gate settings.' };
      return {
        success: true,
        durable: parsed.data?.durable,
        durableWarning: parsed.data?.durableWarning,
        keySet: parsed.data?.keySet,
        channelUrl: parsed.data?.channelUrl,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save gate settings.' };
    }
  },

  async checkAdminAuth(): Promise<{ authenticated: boolean; username?: string }> {
    if (inFlightCheckAdminPromise) {
      return inFlightCheckAdminPromise;
    }

    inFlightCheckAdminPromise = (async () => {
      try {
        const res = await fetch('/api/admin/me', {
          headers: getAuthHeaders(),
        });
        const parsed = await safeParseJson<{ authenticated: boolean; username?: string }>(res);
        if (!parsed.ok || !parsed.data) {
          return { authenticated: false };
        }
        return parsed.data;
      } catch {
        return { authenticated: false };
      } finally {
        inFlightCheckAdminPromise = null;
      }
    })();

    return inFlightCheckAdminPromise;
  },

  async loginAdmin(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const parsed = await safeParseJson<{ success?: boolean; token?: string; username?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data || parsed.data.success === false) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Login failed.' };
      }
      if (parsed.data.token) {
        setAdminToken(parsed.data.token);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during admin login.' };
    }
  },

  async logoutAdmin(): Promise<void> {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    } finally {
      setAdminToken(null);
    }
  },

  async addBook(book: Partial<Book>): Promise<{ success: boolean; book?: Book; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(book),
      });
      const parsed = await safeParseJson<{ success: boolean; book?: Book; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data || !parsed.data.success) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to add book.' };
      }
      return { success: true, book: parsed.data.book, durable: parsed.data.durable, durableWarning: parsed.data.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to add book.' };
    }
  },

  async updateBook(id: string, book: Partial<Book>): Promise<{ success: boolean; book?: Book; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch(`/api/admin/books/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(book),
      });
      const parsed = await safeParseJson<{ success: boolean; book?: Book; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data || !parsed.data.success) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to update book.' };
      }
      return { success: true, book: parsed.data.book, durable: parsed.data.durable, durableWarning: parsed.data.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update book.' };
    }
  },

  async reorderBooks(payload: {
    bookOrders: Array<{ id: string; sortOrder?: number; topic?: string; category?: string; isAuthentic?: boolean }>;
    categoryOrder?: string[];
    topicOrder?: string[];
  }): Promise<{ success: boolean; updated?: number; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      const parsed = await safeParseJson<{ success: boolean; updated?: number; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data || !parsed.data.success) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to save the new order.' };
      }
      return { success: true, updated: parsed.data.updated, durable: parsed.data.durable, durableWarning: parsed.data.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save the new order.' };
    }
  },

  async deleteBook(id: string): Promise<{ success: boolean; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch(`/api/admin/books/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const parsed = await safeParseJson<{ success: boolean; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data || !parsed.data.success) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to delete book.' };
      }
      return { success: true, durable: parsed.data.durable, durableWarning: parsed.data.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete book.' };
    }
  },

  async addFolder(folder: Partial<Folder>): Promise<{ success: boolean; folder?: Folder; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/folders', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(folder),
      });
      const parsed = await safeParseJson<{ success: boolean; folder?: Folder; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data || !parsed.data.success) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to add folder.' };
      }
      return { success: true, folder: parsed.data.folder, durable: parsed.data.durable, durableWarning: parsed.data.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to add folder.' };
    }
  },

  async updateFolder(id: string, folder: Partial<Folder>): Promise<{ success: boolean; folder?: Folder; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch(`/api/admin/folders/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(folder),
      });
      const parsed = await safeParseJson<{ success: boolean; folder?: Folder; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data || !parsed.data.success) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to update folder.' };
      }
      return { success: true, folder: parsed.data.folder, durable: parsed.data.durable, durableWarning: parsed.data.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update folder.' };
    }
  },

  async deleteFolder(id: string): Promise<{ success: boolean; durable?: boolean; durableWarning?: string; error?: string }> {
    try {
      const res = await fetch(`/api/admin/folders/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const parsed = await safeParseJson<{ success: boolean; durable?: boolean; durableWarning?: string; error?: string }>(res);
      if (!parsed.ok || !parsed.data || !parsed.data.success) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to delete folder.' };
      }
      return { success: true, durable: parsed.data.durable, durableWarning: parsed.data.durableWarning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete folder.' };
    }
  },

  async uploadFile(
    file: File,
    onProgress?: (progress: { loadedBytes: number; totalBytes: number; percentage: number; speedBytesPerSec?: number }) => void,
    signal?: AbortSignal,
    folderId?: string
  ): Promise<UploadResult> {
    try {
      const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB limit
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return { success: false, error: 'File is too large. Maximum file size is 500 MB.' };
      }

      return await uploadFileOptimized({ file, folderId, onProgress, signal });
    } catch (err: any) {
      return { success: false, error: err.message || 'File upload failed.' };
    }
  },

  async probeImportUrl(url: string, signal?: AbortSignal): Promise<{
    success: boolean;
    url?: string;
    finalUrl?: string;
    filename?: string;
    title?: string;
    author?: string;
    mimeType?: string;
    fileType?: ItemType;
    sizeBytes?: number;
    fileSize?: string;
    supportsRanges?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/admin/import-url/probe', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ url }),
        signal,
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data || parsed.data.success === false) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to inspect URL.' };
      }
      return parsed.data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Inspection request cancelled.' };
      }
      return { success: false, error: err.message || 'Network error inspecting remote URL.' };
    }
  },

  async importFromUrl(
    payload: {
      url: string;
      filename?: string;
      title?: string;
      author?: string;
      description?: string;
      folderId: string;
      subfolderId?: string | null;
      tags?: string[];
      visible?: boolean;
    },
    signal?: AbortSignal
  ): Promise<{
    success: boolean;
    book?: Book;
    folderName?: string;
    durable?: boolean;
    durableWarning?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/admin/import-url', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
        signal,
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data || parsed.data.success === false) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to import file from URL.' };
      }
      return parsed.data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Import process cancelled by user.' };
      }
      return { success: false, error: err.message || 'Network error importing file from URL.' };
    }
  },

  // AI Organizer (NVIDIA NIM Muse Glimmer 30B & Nemotron Embed 1B)
  async getAiOrganizerStatus(): Promise<{
    success: boolean;
    configured: boolean;
    organizerModel: string;
    embeddingModel: string;
    pendingCount: number;
    message?: string;
  }> {
    try {
      const res = await fetch('/api/admin/ai/status', { headers: getAuthHeaders() });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data) {
        return {
          success: false,
          configured: false,
          organizerModel: 'meta/muse-glimmer-30b',
          embeddingModel: 'nvidia/nemotron-3-embed-1b',
          pendingCount: 0,
        };
      }
      return parsed.data;
    } catch {
      return {
        success: false,
        configured: false,
        organizerModel: 'meta/muse-glimmer-30b',
        embeddingModel: 'nvidia/nemotron-3-embed-1b',
        pendingCount: 0,
      };
    }
  },

  async getNvidiaDiagnostic(): Promise<{
    success: boolean;
    NVIDIA_MUSE_API?: any;
    NVIDIA_EMBEDDING_API?: any;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/admin/ai/diagnostic', { headers: getAuthHeaders() });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data) {
        return { success: false, error: parsed.error || 'Failed to execute diagnostic test.' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Diagnostic network request failed.' };
    }
  },

  async getDriveDiagnostic(): Promise<{
    success: boolean;
    googleDriveConfigured: boolean;
    sharedDriveConfigured: boolean;
    rootFolderConfigured: boolean;
    sharedDriveAccessible: boolean;
    rootFolderAccessible: boolean;
    serviceAccountAuthenticated: boolean;
    error?: string;
    sharedDriveName?: string;
    rootFolderName?: string;
  }> {
    try {
      const res = await fetch('/api/admin/drive/diagnostic', { headers: getAuthHeaders() });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data) {
        return {
          success: false,
          googleDriveConfigured: false,
          sharedDriveConfigured: false,
          rootFolderConfigured: false,
          sharedDriveAccessible: false,
          rootFolderAccessible: false,
          serviceAccountAuthenticated: false,
          error: parsed.error || 'Failed to execute Google Drive diagnostic test.',
        };
      }
      return parsed.data;
    } catch (err: any) {
      return {
        success: false,
        googleDriveConfigured: false,
        sharedDriveConfigured: false,
        rootFolderConfigured: false,
        sharedDriveAccessible: false,
        rootFolderAccessible: false,
        serviceAccountAuthenticated: false,
        error: err.message || 'Drive diagnostic network request failed.',
      };
    }
  },

  async syncWithDrive(): Promise<{
    success: boolean;
    configured?: boolean;
    folders?: number;
    books?: number;
    categories?: number;
    addedBooks?: number;
    removedBooks?: number;
    addedFolders?: number;
    removedFolders?: number;
    savedLocally?: boolean;
    durable?: boolean;
    durableWarning?: string;
    syncedAt?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST', headers: getAuthHeaders() });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data) {
        return { success: false, error: parsed.error || 'Drive sync request failed.' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Drive sync network request failed.' };
    }
  },

  async getAiPendingProposals(): Promise<{ success: boolean; proposals: any[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/ai/pending', { headers: getAuthHeaders() });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data) {
        return { success: false, proposals: [], error: parsed.error || 'Failed to fetch proposals' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, proposals: [], error: err.message };
    }
  },

  async getAllAiProposals(): Promise<{ success: boolean; proposals: any[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/ai/proposals', { headers: getAuthHeaders() });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data) {
        return { success: false, proposals: [], error: parsed.error || 'Failed to fetch proposal history' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, proposals: [], error: err.message };
    }
  },

  async analyzeWithAi(payload: {
    bookIds?: string[];
    bookId?: string;
    driveFileIds?: string[];
    driveFileId?: string;
    unorganizedOnly?: boolean;
  }): Promise<{ success: boolean; proposals?: any[]; errors?: any[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/ai/analyze', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data || parsed.data.success === false) {
        return { success: false, error: parsed.error || parsed.data?.error || 'AI Analysis failed.' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during AI analysis.' };
    }
  },

  async calculateAiSimilarity(payload: {
    textA: string;
    textB?: string;
    compareWithFolders?: boolean;
    compareWithBooks?: boolean;
  }): Promise<{
    success: boolean;
    similarity?: number;
    folderRankings?: Array<{ id: string; name: string; similarity: number }>;
    bookRankings?: Array<{ id: string; title: string; author: string; similarity: number }>;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/admin/ai/similarity', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data || parsed.data.success === false) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Similarity check failed.' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error calculating similarity.' };
    }
  },

  async approveAiProposal(
    proposalId: string,
    edits?: any
  ): Promise<{ success: boolean; book?: Book; error?: string }> {
    try {
      const res = await fetch('/api/admin/ai/approve', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ proposalId, edits }),
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data || parsed.data.success === false) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to approve proposal.' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error approving proposal.' };
    }
  },

  async rejectAiProposal(proposalId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/ai/reject', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ proposalId }),
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data || parsed.data.success === false) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Failed to reject proposal.' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error rejecting proposal.' };
    }
  },

  async bulkAiAction(
    action: 'approve-selected' | 'reject-selected' | 'approve-all-high-confidence',
    proposalIds?: string[],
    minConfidence?: number
  ): Promise<{ success: boolean; action?: string; processed?: number; results?: any[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/ai/bulk-action', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ action, proposalIds, minConfidence }),
      });
      const parsed = await safeParseJson(res);
      if (!parsed.ok || !parsed.data || parsed.data.success === false) {
        return { success: false, error: parsed.error || parsed.data?.error || 'Bulk action failed.' };
      }
      return parsed.data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during bulk action.' };
    }
  },
};

