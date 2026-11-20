// Per-book unlock keys for PAID books only. Free books never need a key.
//
// How it works (Muktar's flow):
//   1. Muktar generates a key for a paid book in Admin mode and shares
//      it with a follower who needs that book. The books are free — no
//      money anywhere, no payment step. A follower who unlocked the
//      library gate (follow tap or gate key) already opens paid books
//      free; the per-book key is a second way in, for a follower who
//      has the key for that one book.
//   2. The follower enters the key on the paid book's lock screen. The
//      server checks the key against the stored HASH (never the plain
//      key), and if it matches and the key still has uses left, that use
//      is counted and the book unlocks on that device only.
//   3. One key belongs to ONE paid book only — it can never unlock a
//      different paid book. One key can be used up to the limit Muktar sets
//      when he generates it (default 100 uses). After the limit it stops
//      working. Admin can also revoke a key at any time.
//
// Security:
//   - Keys are 20 random characters (letters + digits + symbols), in 4
//     groups of 5, from crypto.randomBytes — no sequential keys, no book
//     title or date as a key. Guessing one is infeasible (~120 bits).
//   - Only a salted SHA-256 hash of a key is ever stored (data/book-keys.json
//     holds hashes only). The plain key is shown to the admin ONCE, at
//     generation time, so he can copy and share it; after that it is gone
//     from the server. The plain key is never in the public catalog, never
//     in client code, and never returned by any list endpoint.
//   - Key comparison uses timingSafeEqual on the hashes, and a wrong key
//     always gets the same generic "Wrong key" answer — nothing reveals
//     whether it was close, for the wrong book, or used up.
//   - Wrong-key attempts are rate-limited per IP + book (see
//     server/app.ts), so brute force is throttled as well.
//
// Storage: the durable copy is data/book-keys.json in the repo (hashes
// only). The Express server reads it at startup and writes it back on
// every change, and commits it to GitHub when GITHUB_SYNC_TOKEN is set,
// exactly like the catalog. The Cloudflare worker has no disk, so it
// bundles the same file at build time and keeps usage counts in memory
// per isolate — key verification works there, but the usage monitor's
// totals on Pages are best-effort; the Vercel/Express totals are the
// authoritative ones. See server/cf-api-handler.ts.

import { randomBytes, createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export interface BookKeyRecord {
  /** Stable id, e.g. "k_9f2c…". Never the key itself. */
  id: string;
  /** Catalog book id this key unlocks — and ONLY this book. */
  bookId: string;
  /** Admin's own note, e.g. "Batch 1 — WhatsApp followers". Optional. */
  label?: string;
  /** Random per-key salt (hex). Stored, not secret by itself. */
  salt: string;
  /** SHA-256 hex of `${salt}:${normalizedKey}`. The plain key is never stored. */
  keyHash: string;
  /** Max successful uses Muktar set when generating the key (default 100). */
  maxUses: number;
  /** Successful uses so far (each key entry that unlocked the book). */
  uses: number;
  createdAt: string;
  /** ISO time of the last successful use, or null if never used. */
  lastUsedAt: string | null;
  /** Revoked keys never unlock, even with uses left. */
  revoked: boolean;
}

export interface BookKeyStore {
  keys: BookKeyRecord[];
}

export const DEFAULT_KEY_MAX_USES = 100;
export const MIN_KEY_MAX_USES = 1;
export const MAX_KEY_MAX_USES = 10000;

/** Characters a key is drawn from: letters + digits + symbols, with the
 *  easily-confused 0/O, 1/I/l left out so a shared key is still readable. */
const KEY_ALPHABET =
  'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';

export function normalizeBookKey(raw: unknown): string {
  return String(raw ?? '')
    .replace(/[\s-]/g, '')
    .trim();
}

/** Generate one strong key: 20 random chars, shown as 4 groups of 5. */
export function generateBookKey(): string {
  const bytes = randomBytes(20);
  const chars = Array.from(bytes, (b) => KEY_ALPHABET[b % KEY_ALPHABET.length]);
  return [0, 1, 2, 3].map((g) => chars.slice(g * 5, g * 5 + 5).join('')).join('-');
}

export function hashBookKey(key: string, salt: string): string {
  return createHash('sha256')
    .update(`${salt}:${normalizeBookKey(key)}`)
    .digest('hex');
}

/** Constant-time check of a candidate key against a stored record. */
export function verifyBookKey(record: BookKeyRecord, candidate: unknown): boolean {
  const normalized = normalizeBookKey(candidate);
  if (!normalized || !record?.keyHash || !record?.salt) return false;
  const candidateHash = hashBookKey(normalized, record.salt);
  const a = Buffer.from(candidateHash, 'utf8');
  const b = Buffer.from(record.keyHash, 'utf8');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** A key can unlock only while it is not revoked and has uses left. */
export function isKeyUsable(record: BookKeyRecord): boolean {
  return Boolean(record) && !record.revoked && record.uses < record.maxUses;
}

export function keyUsesLeft(record: BookKeyRecord): number {
  return Math.max(0, record.maxUses - record.uses);
}

export function createBookKeyRecord(
  bookId: string,
  maxUses: number,
  label?: string
): { record: BookKeyRecord; plainKey: string } {
  const safeMax = Number.isFinite(maxUses)
    ? Math.min(MAX_KEY_MAX_USES, Math.max(MIN_KEY_MAX_USES, Math.floor(maxUses)))
    : DEFAULT_KEY_MAX_USES;
  const plainKey = generateBookKey();
  const salt = randomBytes(16).toString('hex');
  const record: BookKeyRecord = {
    id: `k_${randomBytes(8).toString('hex')}`,
    bookId,
    label: (label || '').trim().slice(0, 120) || undefined,
    salt,
    keyHash: hashBookKey(plainKey, salt),
    maxUses: safeMax,
    uses: 0,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revoked: false,
  };
  return { record, plainKey };
}

/** Public view of a key for the admin monitor: everything EXCEPT the hash
 *  and salt (the admin never needs them, and they must not leak). */
export function publicKeyView(record: BookKeyRecord): Record<string, unknown> {
  return {
    id: record.id,
    bookId: record.bookId,
    label: record.label || '',
    maxUses: record.maxUses,
    uses: record.uses,
    usesLeft: keyUsesLeft(record),
    createdAt: record.createdAt,
    lastUsedAt: record.lastUsedAt,
    revoked: record.revoked,
    usable: isKeyUsable(record),
  };
}

/** Monitor totals across keys: how many people entered through any key. */
export function keyMonitorTotals(keys: BookKeyRecord[]): {
  totalKeys: number;
  activeKeys: number;
  revokedKeys: number;
  totalUses: number;
  totalUsesLeft: number;
  byBook: Record<string, { keys: number; uses: number; usesLeft: number }>;
} {
  const byBook: Record<string, { keys: number; uses: number; usesLeft: number }> = {};
  let totalUses = 0;
  let totalUsesLeft = 0;
  let activeKeys = 0;
  let revokedKeys = 0;
  for (const k of keys) {
    if (k.revoked) revokedKeys++;
    else activeKeys++;
    totalUses += k.uses;
    totalUsesLeft += keyUsesLeft(k);
    const entry = byBook[k.bookId] || { keys: 0, uses: 0, usesLeft: 0 };
    entry.keys++;
    entry.uses += k.uses;
    entry.usesLeft += keyUsesLeft(k);
    byBook[k.bookId] = entry;
  }
  return { totalKeys: keys.length, activeKeys, revokedKeys, totalUses, totalUsesLeft, byBook };
}

export function loadBookKeyStore(filePath: string): BookKeyStore {
  try {
    if (!existsSync(filePath)) return { keys: [] };
    const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
    const keys = Array.isArray(parsed?.keys) ? parsed.keys : [];
    return {
      keys: keys
        .filter((k: any) => k && typeof k.id === 'string' && typeof k.bookId === 'string' && typeof k.keyHash === 'string')
        .map((k: any) => ({
          id: k.id,
          bookId: k.bookId,
          label: typeof k.label === 'string' ? k.label : undefined,
          salt: typeof k.salt === 'string' ? k.salt : '',
          keyHash: k.keyHash,
          maxUses: Number.isFinite(k.maxUses) ? k.maxUses : DEFAULT_KEY_MAX_USES,
          uses: Number.isFinite(k.uses) ? k.uses : 0,
          createdAt: typeof k.createdAt === 'string' ? k.createdAt : new Date().toISOString(),
          lastUsedAt: typeof k.lastUsedAt === 'string' ? k.lastUsedAt : null,
          revoked: Boolean(k.revoked),
        })),
    };
  } catch {
    return { keys: [] };
  }
}

export function saveBookKeyStore(filePath: string, store: BookKeyStore): boolean {
  try {
    writeFileSync(filePath, JSON.stringify(store, null, 2) + '\n', 'utf8');
    return true;
  } catch {
    return false;
  }
}

/** Short-lived unlock tokens (H-4): the raw key must stop being a
 *  perpetual bearer credential. POST /api/book-keys/verify issues one
 *  token per (book, device); catalog / stream / download accept ONLY
 *  the token, in the `x-book-unlock` header (base64url JSON of
 *  { bookId: token }). The token is `base64url(deviceId.exp.hmac)`
 *  where hmac = HMAC-SHA256(SESSION_SECRET, `bookId.deviceId.exp`)
 *  and exp = now + 30 days. A token verifies without the key store,
 *  so it works on both hosts as long as SESSION_SECRET matches. The
 *  raw key is never accepted on the header path again. */
export const BOOK_UNLOCK_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function base64urlEncode(text: string): string {
  return Buffer.from(text, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(raw: string): string | null {
  try {
    const cleaned = String(raw || '').trim();
    if (!cleaned) return null;
    return Buffer.from(cleaned.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  } catch {
    return null;
  }
}

/** A device id is a client-generated stable UUID: no dots (they would
 *  break the token split), no whitespace, at most 128 chars. */
export function isValidDeviceId(deviceId: unknown): deviceId is string {
  return (
    typeof deviceId === 'string' &&
    deviceId.length > 0 &&
    deviceId.length <= 128 &&
    !deviceId.includes('.') &&
    !/\s/.test(deviceId)
  );
}

export function createBookUnlockToken(
  bookId: string,
  deviceId: string,
  secret: string,
  nowMs: number = Date.now()
): { token: string; expiresAt: string } {
  const exp = nowMs + BOOK_UNLOCK_TTL_MS;
  const hmac = createHmac('sha256', secret)
    .update(`${bookId}.${deviceId}.${exp}`)
    .digest('hex');
  return {
    token: base64urlEncode(`${deviceId}.${exp}.${hmac}`),
    expiresAt: new Date(exp).toISOString(),
  };
}

/** Verify an unlock token for one book. Returns the device id on
 *  success, or null for a missing / expired / forged token. */
export function verifyBookUnlockToken(
  token: unknown,
  bookId: string,
  secret: string,
  nowMs: number = Date.now()
): string | null {
  try {
    if (typeof token !== 'string' || !token || !secret) return null;
    const inner = base64urlDecode(token);
    if (!inner) return null;
    const parts = inner.split('.');
    if (parts.length !== 3) return null;
    const [deviceId, expRaw, hmac] = parts;
    if (!isValidDeviceId(deviceId)) return null;
    const exp = Number(expRaw);
    if (!Number.isFinite(exp) || exp <= nowMs) return null;
    const expected = createHmac('sha256', secret)
      .update(`${bookId}.${deviceId}.${exp}`)
      .digest('hex');
    const a = Buffer.from(hmac, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length) return null;
    return timingSafeEqual(a, b) ? deviceId : null;
  } catch {
    return null;
  }
}

/** Parse the `x-book-unlock` header: base64url JSON of
 *  { bookId: unlockToken }. Returns the map, or an empty map for a
 *  missing / broken header — never throws. */
export function parseBookUnlockHeader(header: unknown): Record<string, string> {
  try {
    const decoded = base64urlDecode(String(header || '').trim());
    if (!decoded) return {};
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: Record<string, string> = {};
    for (const [bookId, token] of Object.entries(parsed)) {
      if (typeof bookId === 'string' && typeof token === 'string' && token.trim()) {
        out[bookId] = token;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** Encode the same header value (client side / tests). */
export function encodeBookUnlockHeader(tokens: Record<string, string>): string {
  return base64urlEncode(JSON.stringify(tokens));
}

/** Which book ids in this request carry a VALID unlock token? One
 *  token unlocks one book only — a token minted for book A never
 *  verifies for book B. */
export function unlockTokenBookIds(
  header: unknown,
  secret: string,
  nowMs: number = Date.now()
): Set<string> {
  const out = new Set<string>();
  const supplied = parseBookUnlockHeader(header);
  for (const [bookId, token] of Object.entries(supplied)) {
    if (verifyBookUnlockToken(token, bookId, secret, nowMs)) out.add(bookId);
  }
  return out;
}
