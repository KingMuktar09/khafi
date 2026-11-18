import { describe, it, expect } from 'vitest';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  generateBookKey,
  normalizeBookKey,
  hashBookKey,
  verifyBookKey,
  isKeyUsable,
  keyUsesLeft,
  createBookKeyRecord,
  publicKeyView,
  keyMonitorTotals,
  parseBookKeysHeader,
  encodeBookKeysHeader,
  keyUnlockedBookIds,
  loadBookKeyStore,
  saveBookKeyStore,
  DEFAULT_KEY_MAX_USES,
} from '../server/bookKeys';
import { isKeyVerifyRateLimited, recordKeyVerifyFailure } from '../server/app';

// Per-book unlock keys: strong, per-book, limited uses, hash-only storage.
// See server/bookKeys.ts for the full rules.

describe('generateBookKey', () => {
  it('makes 20-char keys in 4 groups of 5, letters + digits + symbols', () => {
    const key = generateBookKey();
    expect(key).toMatch(/^[A-Za-z0-9!@#$%&*]{5}(-[A-Za-z0-9!@#$%&*]{5}){3}$/);
    expect(normalizeBookKey(key)).toHaveLength(20);
  });

  it('makes a different key every time, with no title or date in it', () => {
    const keys = new Set(Array.from({ length: 100 }, () => generateBookKey()));
    expect(keys.size).toBe(100);
    for (const k of keys) {
      expect(k.toLowerCase()).not.toContain('manba');
      expect(k.toLowerCase()).not.toContain('buni');
      expect(k).not.toContain('2026');
    }
  });

  it('uses letters, digits and symbols across many keys', () => {
    const all = Array.from({ length: 100 }, () => generateBookKey()).join('');
    expect(all).toMatch(/[A-Za-z]/);
    expect(all).toMatch(/[0-9]/);
    expect(all).toMatch(/[!@#$%&*]/);
  });
});

describe('hash + verify', () => {
  it('verifies the right key and rejects wrong, close and empty keys', () => {
    const { record, plainKey } = createBookKeyRecord('b-manba-usul-al-hikma', 100);
    expect(verifyBookKey(record, plainKey)).toBe(true);
    // Same key with dashes/spaces typed differently still works.
    expect(verifyBookKey(record, plainKey.toLowerCase().replace(/-/g, ' '))).toBe(false); // case matters
    expect(verifyBookKey(record, plainKey.replace(/-/g, ''))).toBe(true);
    expect(verifyBookKey(record, 'WRONG-WRONG-WRONG-WRONG')).toBe(false);
    expect(verifyBookKey(record, plainKey.slice(0, -1) + 'X')).toBe(false);
    expect(verifyBookKey(record, '')).toBe(false);
    expect(verifyBookKey(record, null)).toBe(false);
  });

  it('stores only a hash — the plain key is nowhere in the record', () => {
    const { record, plainKey } = createBookKeyRecord('b-x', 100);
    expect(JSON.stringify(record)).not.toContain(plainKey);
    expect(record.keyHash).toMatch(/^[0-9a-f]{64}$/);
    expect(record.salt).toMatch(/^[0-9a-f]{32}$/);
    // Same key, different salt => different hash.
    const other = createBookKeyRecord('b-x', 100);
    expect(other.record.keyHash).not.toBe(record.keyHash);
  });

  it('a key for one book never verifies against another book’s record', () => {
    const a = createBookKeyRecord('b-book-a', 100);
    const b = createBookKeyRecord('b-book-b', 100);
    expect(verifyBookKey(b.record, a.plainKey)).toBe(false);
    expect(verifyBookKey(a.record, b.plainKey)).toBe(false);
  });
});

describe('uses + limits', () => {
  it('defaults to 100 uses and clamps the admin-set limit', () => {
    expect(createBookKeyRecord('b-x', undefined as any).record.maxUses).toBe(DEFAULT_KEY_MAX_USES);
    expect(DEFAULT_KEY_MAX_USES).toBe(100);
    expect(createBookKeyRecord('b-x', 5).record.maxUses).toBe(5);
    expect(createBookKeyRecord('b-x', 0).record.maxUses).toBe(1);
    expect(createBookKeyRecord('b-x', 999999).record.maxUses).toBe(10000);
  });

  it('is usable until uses run out, then stops', () => {
    const { record } = createBookKeyRecord('b-x', 2);
    expect(isKeyUsable(record)).toBe(true);
    expect(keyUsesLeft(record)).toBe(2);
    record.uses = 1;
    expect(isKeyUsable(record)).toBe(true);
    expect(keyUsesLeft(record)).toBe(1);
    record.uses = 2;
    expect(isKeyUsable(record)).toBe(false);
    expect(keyUsesLeft(record)).toBe(0);
  });

  it('a revoked key never unlocks, even with uses left', () => {
    const { record, plainKey } = createBookKeyRecord('b-x', 100);
    record.revoked = true;
    expect(isKeyUsable(record)).toBe(false);
    expect(verifyBookKey(record, plainKey)).toBe(true); // hash still matches; usability is separate
  });
});

describe('publicKeyView + monitor totals', () => {
  it('never exposes the hash, salt or plain key', () => {
    const { record } = createBookKeyRecord('b-x', 100);
    const view = publicKeyView(record);
    expect(JSON.stringify(view)).not.toContain(record.keyHash);
    expect(JSON.stringify(view)).not.toContain(record.salt);
    expect(view).toHaveProperty('usesLeft', 100);
    expect(view).toHaveProperty('usable', true);
  });

  it('totals count uses per key, per book and overall', () => {
    const a = createBookKeyRecord('b-a', 100).record;
    const b = createBookKeyRecord('b-a', 50).record;
    const c = createBookKeyRecord('b-b', 10).record;
    a.uses = 3;
    b.uses = 50; // used up
    c.uses = 1;
    c.revoked = true;
    const totals = keyMonitorTotals([a, b, c]);
    expect(totals.totalKeys).toBe(3);
    expect(totals.activeKeys).toBe(2);
    expect(totals.revokedKeys).toBe(1);
    expect(totals.totalUses).toBe(54);
    expect(totals.totalUsesLeft).toBe(97 + 0 + 9);
    expect(totals.byBook['b-a']).toEqual({ keys: 2, uses: 53, usesLeft: 97 });
    expect(totals.byBook['b-b']).toEqual({ keys: 1, uses: 1, usesLeft: 9 });
  });
});

describe('x-book-keys header', () => {
  it('round-trips through encode/parse and unlocks only the right book', () => {
    const a = createBookKeyRecord('b-a', 100);
    const b = createBookKeyRecord('b-b', 100);
    const store = { keys: [a.record, b.record] };
    const header = encodeBookKeysHeader({ 'b-a': a.plainKey });
    const unlocked = keyUnlockedBookIds(store, header);
    expect([...unlocked]).toEqual(['b-a']);

    // A key for book A presented as book B's key does not unlock B.
    const wrongBook = keyUnlockedBookIds(store, encodeBookKeysHeader({ 'b-b': a.plainKey }));
    expect([...wrongBook]).toEqual([]);

    // A used-up key does not unlock.
    a.record.uses = 100;
    expect([...keyUnlockedBookIds(store, header)]).toEqual([]);
  });

  it('a missing or broken header unlocks nothing and never throws', () => {
    const store = { keys: [] };
    expect([...keyUnlockedBookIds(store, '')]).toEqual([]);
    expect([...keyUnlockedBookIds(store, 'not-base64!!!')]).toEqual([]);
    expect([...keyUnlockedBookIds(store, undefined)]).toEqual([]);
    expect(parseBookKeysHeader('%%%')).toEqual({});
  });
});

describe('book-keys store persistence', () => {
  it('saves and loads hashes (never plain keys) from disk', () => {
    const path = join(tmpdir(), `book-keys-test-${Date.now()}.json`);
    const { record } = createBookKeyRecord('b-a', 100);
    saveBookKeyStore(path, { keys: [record] });
    const loaded = loadBookKeyStore(path);
    expect(loaded.keys).toHaveLength(1);
    expect(loaded.keys[0].keyHash).toBe(record.keyHash);
    expect(loaded.keys[0].uses).toBe(0);
  });
});

describe('wrong-key rate limit', () => {
  it('allows a few failures, then blocks for the window', () => {
    const ip = `192.0.2.${Math.floor(Math.random() * 200) + 1}`;
    const bookId = `b-rate-${Date.now()}`;
    expect(isKeyVerifyRateLimited(ip, bookId)).toBe(false);
    for (let i = 0; i < 10; i++) recordKeyVerifyFailure(ip, bookId);
    expect(isKeyVerifyRateLimited(ip, bookId)).toBe(true);
    // A different book is not affected by this book's failures.
    expect(isKeyVerifyRateLimited(ip, `${bookId}-other`)).toBe(false);
  });
});
