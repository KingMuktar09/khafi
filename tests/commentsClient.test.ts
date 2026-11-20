import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  submitTopicRequest,
  fetchVisibleTopicRequestsPage,
  isInstagramHandle,
  instagramDmUrl,
  MAX_TOPIC_MESSAGE_LENGTH,
  MAX_INSTAGRAM_NAME_LENGTH,
} from '../src/services/topicRequests';
import { api } from '../src/services/api';
import { I18N_TOPICS } from '../src/data/i18n-topics';

// Client-side comment-flow fixes (audit F2, F3, F5, F6, F8, F10, F11):
// validation + cooldown + failure reasons on submit, pagination on the
// public list, reserved names, ig.me DM links, and the inbox 503
// surfacing as notConfigured instead of a false zero.

function readSource(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf8');
}

const realFetch = globalThis.fetch;
const realLocalStorage = (globalThis as any).localStorage;
let store: Record<string, string> = {};

function stubLocalStorage() {
  store = {};
  (globalThis as any).localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
  };
}

beforeEach(() => {
  stubLocalStorage();
});

afterEach(() => {
  globalThis.fetch = realFetch;
  (globalThis as any).localStorage = realLocalStorage;
  store = {};
  vi.restoreAllMocks();
});

describe('submitTopicRequest validation (F3, F6)', () => {
  it('the enforced limits match the form caps (2000 message, 30 name)', () => {
    expect(MAX_TOPIC_MESSAGE_LENGTH).toBe(2000);
    expect(MAX_INSTAGRAM_NAME_LENGTH).toBe(30);
  });

  it('rejects a message over 2000 chars before any fetch', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true }) as Response);
    globalThis.fetch = fetchMock as typeof fetch;
    const result = await submitTopicRequest({
      instagramName: 'tester',
      kind: 'comment',
      topic: 'general',
      message: 'x'.repeat(MAX_TOPIC_MESSAGE_LENGTH + 1),
    });
    expect(result.stored).toBe(false);
    expect(result.error).toMatch(/too long/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a name over 30 chars before any fetch', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true }) as Response);
    globalThis.fetch = fetchMock as typeof fetch;
    const result = await submitTopicRequest({
      instagramName: 'a'.repeat(MAX_INSTAGRAM_NAME_LENGTH + 1),
      kind: 'comment',
      topic: 'general',
      message: 'Hello',
    });
    expect(result.stored).toBe(false);
    expect(result.error).toMatch(/too long/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reserves anonymous and guest as handles (F6)', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true }) as Response);
    globalThis.fetch = fetchMock as typeof fetch;
    for (const name of ['anonymous', 'Anonymous', 'guest', 'Guest', '@guest']) {
      const result = await submitTopicRequest({
        instagramName: name,
        kind: 'comment',
        topic: 'general',
        message: 'Hello',
      });
      // 'Anonymous' with no flag is the legacy anonymous marker; the
      // rest are typed names claiming a reserved word.
      if (name === 'Anonymous') {
        expect(result.stored).toBe(true);
      } else {
        expect(result.stored, name).toBe(false);
        expect(result.error).toMatch(/reserved/i);
      }
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('accepts a real anonymous post and strips a leading @ from names', async () => {
    const calls: { body: string }[] = [];
    globalThis.fetch = (async (_url: unknown, init?: { body?: unknown }) => {
      calls.push({ body: String(init?.body ?? '') });
      return { ok: true } as Response;
    }) as typeof fetch;
    const result = await submitTopicRequest({
      instagramName: '@tester',
      kind: 'comment',
      topic: 'general',
      message: 'Hello',
    });
    expect(result.stored).toBe(true);
    expect(JSON.parse(calls[0].body).instagram_name).toBe('tester');
  });
});

describe('submitTopicRequest cooldown (F2)', () => {
  it('blocks a second submit within 30 seconds without a fetch', async () => {
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      return { ok: true } as Response;
    }) as typeof fetch;
    const input = { instagramName: 'tester', kind: 'comment' as const, topic: 'general', message: 'Hello' };
    expect((await submitTopicRequest(input)).stored).toBe(true);
    const second = await submitTopicRequest(input);
    expect(second.stored).toBe(false);
    expect(second.cooldown).toBe(true);
    expect(calls).toBe(1);
  });
});

describe('submitTopicRequest failure reasons (F5)', () => {
  it('returns the HTTP status when the save is rejected', async () => {
    globalThis.fetch = (async () => ({ ok: false, status: 403 }) as Response) as typeof fetch;
    const result = await submitTopicRequest({
      instagramName: 'tester',
      kind: 'request',
      topic: 'general',
      message: 'A test topic',
    });
    expect(result.stored).toBe(false);
    expect(result.status).toBe(403);
    expect(result.error).toBeTruthy();
  });

  it('returns status 0 on a network failure, without throwing', async () => {
    globalThis.fetch = (async () => {
      throw new Error('no network');
    }) as typeof fetch;
    const result = await submitTopicRequest({
      instagramName: 'tester',
      kind: 'request',
      topic: 'general',
      message: 'A test topic',
    });
    expect(result.stored).toBe(false);
    expect(result.status).toBe(0);
    expect(result.error).toBeTruthy();
  });
});

describe('fetchVisibleTopicRequestsPage pagination and errors (F5, F8)', () => {
  it('sends limit and offset so the page can show more', async () => {
    const calls: string[] = [];
    globalThis.fetch = (async (url: unknown) => {
      calls.push(String(url));
      const body = String(url).includes('/topic_replies') ? [] : [];
      return { ok: true, json: async () => body } as Response;
    }) as typeof fetch;
    const page = await fetchVisibleTopicRequestsPage('ruh-and-soul', { limit: 20, offset: 20 });
    expect(page.comments).toEqual([]);
    expect(page.error).toBeUndefined();
    expect(calls[0]).toContain('limit=20');
    expect(calls[0]).toContain('offset=20');
  });

  it('reports the error instead of an empty list when the load fails', async () => {
    globalThis.fetch = (async () => ({ ok: false, status: 500 }) as Response) as typeof fetch;
    const page = await fetchVisibleTopicRequestsPage('ruh-and-soul');
    expect(page.comments).toEqual([]);
    expect(page.error).toBe('HTTP 500');
  });
});

describe('isInstagramHandle and instagramDmUrl (F6, F11)', () => {
  it('accepts real handles only, never reserved words or spaces', () => {
    expect(isInstagramHandle('some.one_2')).toBe(true);
    expect(isInstagramHandle('@someone')).toBe(true);
    expect(isInstagramHandle('anonymous')).toBe(false);
    expect(isInstagramHandle('guest')).toBe(false);
    expect(isInstagramHandle('not a handle')).toBe(false);
    expect(isInstagramHandle('')).toBe(false);
  });

  it('points DM links at ig.me/m, not the profile page', () => {
    expect(instagramDmUrl('someone')).toBe('https://ig.me/m/someone');
    expect(instagramDmUrl('Anonymous')).toBeNull();
  });
});

describe('api.getTopicRequestsUnread surfaces setup-missing (F10)', () => {
  it('returns notConfigured on 503 instead of a false zero', async () => {
    globalThis.fetch = (async () => ({
      ok: false,
      status: 503,
      text: async () => JSON.stringify({ error: 'Replies are not set up yet.' }),
    }) as unknown) as typeof fetch;
    const result = await api.getTopicRequestsUnread();
    expect(result).toEqual({ unread: 0, notConfigured: true });
  });

  it('returns the real count on success', async () => {
    globalThis.fetch = (async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ unread: 3 }),
    }) as unknown) as typeof fetch;
    const result = await api.getTopicRequestsUnread();
    expect(result).toEqual({ unread: 3 });
  });
});

describe('api.deleteTopicRequest (F2 inbox delete)', () => {
  it('sends DELETE to the admin endpoint', async () => {
    let seen: { url: string; init?: any } | null = null;
    globalThis.fetch = (async (url: string, init?: any) => {
      seen = { url, init };
      return { ok: true, status: 200, text: async () => JSON.stringify({ success: true }) } as Response;
    }) as typeof fetch;
    const result = await api.deleteTopicRequest(7);
    expect(result).toEqual({ success: true });
    expect(seen?.url).toBe('/api/admin/topic-requests/7');
    expect(seen?.init?.method).toBe('DELETE');
  });
});

describe('comment copy no longer promises a public listing (F4)', () => {
  it('requests and questions are read privately and answered on Instagram', () => {
    // The old copy promised the request/question would be added to the
    // page (in order, or "here too"). The new copy says neither.
    for (const lang of ['en', 'hi', 'bn', 'ur'] as const) {
      expect(I18N_TOPICS[lang]['sendbox.requestDone']).not.toContain('in the order they were made');
      expect(I18N_TOPICS[lang]['sendbox.requestDone']).not.toContain('usi tartib mein');
      expect(I18N_TOPICS[lang]['sendbox.requestDone']).not.toContain('সেই ক্রমে');
      expect(I18N_TOPICS[lang]['sendbox.requestDone']).not.toContain('اسی ترتیب سے');
      expect(I18N_TOPICS[lang]['sendbox.askDone']).not.toContain('added here');
      expect(I18N_TOPICS[lang]['sendbox.askDone']).not.toContain('yahan bhi');
      expect(I18N_TOPICS[lang]['sendbox.askDone']).not.toContain('এখানেও');
      expect(I18N_TOPICS[lang]['sendbox.askDone']).not.toContain('یہاں بھی');
      expect(I18N_TOPICS[lang]['sendbox.commentNote']).not.toContain('wants');
      expect(I18N_TOPICS[lang]['sendbox.commentNote']).not.toContain('chahat');
      expect(I18N_TOPICS[lang]['sendbox.commentNote']).not.toContain('চাওয়া');
    }
  });

  it('the new error, retry and show-more strings exist in all four languages', () => {
    for (const lang of ['en', 'hi', 'bn', 'ur'] as const) {
      for (const key of ['sendbox.saveFailed', 'sendbox.retry', 'sendbox.copyAndOpenDm', 'topics.commentsLoadFailed', 'topics.showMore']) {
        expect(I18N_TOPICS[lang][key], `${lang} ${key}`).toBeTruthy();
      }
    }
  });
});

describe('InstagramSendBox guards (F2, F3, F7)', () => {
  it('has the ref double-submit guard, the honeypot, and the length caps', () => {
    const box = readSource('src/views/topics/InstagramSendBox.tsx');
    expect(box).toContain('sendingRef');
    expect(box).toContain('useRef(false)');
    expect(box).toContain('honeypot');
    expect(box).toContain('maxLength={2000}');
    expect(box).toContain('maxLength={30}');
    expect(box).toContain('save-failed');
    expect(box).toContain("tt('sendbox.retry'");
  });
});
