import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { PaidLockScreen } from '../src/components/books/PaidLockScreen';
import {
  sanitizeBook,
  sanitizeCatalog,
  hasFollowUnlocked,
  isPaidBookLocked,
} from '../server/app';
import {
  sanitizeBook as sanitizeBookCf,
  isPaidBookLocked as isPaidBookLockedCf,
  handleCloudflareApiRequest,
} from '../server/cf-api-handler';
import { getPaidBadgeLabel, formatBookPrice } from '../src/utils/fileUtils';
import {
  FOLLOW_UNLOCK_HEADER,
  getFollowUnlockHeaders,
  getBookUnlockHeaders,
  BOOK_UNLOCK_HEADER,
  DEVICE_ID_HEADER,
  saveBookUnlockToken,
  getDeviceId,
  api,
} from '../src/services/api';

// Paid books need their own key, even for followers. These tests pin the
// rule on both servers (Express/Vercel in server/app.ts,
// Cloudflare/pages.dev in server/cf-api-handler.ts, which must stay in
// sync):
//   locked visitor        -> paid links stripped, file endpoints 402
//   gate-unlocked follower (x-follow-unlocked: 1, no key) -> still locked
//   admin                 -> links kept, files served
//   visitor with the key  -> only THAT book's links kept, files served
// A key unlocks ONE paid book only — never a different paid book. The
// price itself is public info, not a payment step: the lock screen shows
// it when the book has one set (the Info page says the price is shown on
// the book), and shows no price at all when it has none. There is still
// no UPI / pay step on the lock screen itself.

const PAID_BOOK = {
  id: 'b-bulhan',
  title: 'Kitab Al Bulhan',
  driveFileId: '1gKygGbTJSNtkvcRKSURJ3vGnNVNgmDI5',
  externalUrl:
    'https://docs.google.com/document/d/1gKygGbTJSNtkvcRKSURJ3vGnNVNgmDI5/edit',
  fileUrl:
    'https://drive.google.com/file/d/1gKygGbTJSNtkvcRKSURJ3vGnNVNgmDI5/view',
  pdfUrl:
    'https://drive.google.com/file/d/1gKygGbTJSNtkvcRKSURJ3vGnNVNgmDI5/view',
  isPaid: true,
  visible: true,
};

const FREE_BOOK = {
  ...PAID_BOOK,
  id: 'b-free',
  title: 'A Free Book',
  isPaid: false,
  price: undefined,
};

describe('isPaidBookLocked (server/app.ts)', () => {
  it('is true for a paid book with neither admin nor its own key — following alone does not unlock it', () => {
    expect(isPaidBookLocked(PAID_BOOK, false, false)).toBe(true);
    expect(isPaidBookLocked(PAID_BOOK, true, false)).toBe(false);
    expect(isPaidBookLocked(PAID_BOOK, false, true)).toBe(false);
    expect(isPaidBookLocked(PAID_BOOK, true, true)).toBe(false);
    expect(isPaidBookLocked(FREE_BOOK, false, false)).toBe(false);
    expect(isPaidBookLocked(FREE_BOOK, false, true)).toBe(false);
    expect(isPaidBookLocked(null, false, false)).toBe(false);
    expect(isPaidBookLocked(undefined, false, false)).toBe(false);
  });
});

describe('isPaidBookLocked (server/cf-api-handler.ts)', () => {
  it('matches the Express rule exactly', () => {
    expect(isPaidBookLockedCf(PAID_BOOK, false, false)).toBe(true);
    expect(isPaidBookLockedCf(PAID_BOOK, true, false)).toBe(false);
    expect(isPaidBookLockedCf(PAID_BOOK, false, true)).toBe(false);
    expect(isPaidBookLockedCf(FREE_BOOK, false, false)).toBe(false);
  });
});

describe('sanitizeBook (server/app.ts)', () => {
  it('strips paid links for a locked visitor', () => {
    const out = sanitizeBook(PAID_BOOK, false, false);
    expect(out.isPaid).toBe(true);
    expect(out.driveFileId).toBeUndefined();
    expect(out.externalUrl).toBeUndefined();
    expect(out.fileUrl).toBe('');
    expect(out.pdfUrl).toBe('');
  });

  it('keeps paid links for a visitor holding that book’s own key', () => {
    const out = sanitizeBook(PAID_BOOK, false, true);
    expect(out.driveFileId).toBe(PAID_BOOK.driveFileId);
    expect(out.externalUrl).toBe(PAID_BOOK.externalUrl);
    expect(out.fileUrl).toBe(`/api/files/${PAID_BOOK.driveFileId}/preview`);
    expect(out.pdfUrl).toBe(`/api/files/${PAID_BOOK.driveFileId}/preview`);
  });

  it('strips paid links for a gate-unlocked follower without the key', () => {
    // The follow flag used to open paid books; since Phase 1 it opens
    // only free books. sanitizeBook takes no follow flag anymore.
    const out = sanitizeBook(PAID_BOOK, false, false);
    expect(out.isPaid).toBe(true);
    expect(out.driveFileId).toBeUndefined();
    expect(out.externalUrl).toBeUndefined();
    expect(out.fileUrl).toBe('');
    expect(out.pdfUrl).toBe('');
  });

  it('keeps paid links for the admin', () => {
    const out = sanitizeBook(PAID_BOOK, true, false);
    expect(out.driveFileId).toBe(PAID_BOOK.driveFileId);
    expect(out.externalUrl).toBe(PAID_BOOK.externalUrl);
  });

  it('keeps links for a free book even when locked', () => {
    const out = sanitizeBook(FREE_BOOK, false, false);
    expect(out.driveFileId).toBe(FREE_BOOK.driveFileId);
    expect(out.externalUrl).toBe(FREE_BOOK.externalUrl);
  });

  it('passes null through', () => {
    expect(sanitizeBook(null)).toBeNull();
  });
});

describe('sanitizeCatalog (server/app.ts)', () => {
  const catalog = { folders: [], books: [PAID_BOOK, FREE_BOOK] };

  it('strips only the paid book for a locked visitor', () => {
    const out = sanitizeCatalog(catalog, false, false);
    expect(out.books[0].driveFileId).toBeUndefined();
    expect(out.books[0].fileUrl).toBe('');
    expect(out.books[1].driveFileId).toBe(FREE_BOOK.driveFileId);
  });

  it('keeps only the key-unlocked book when given a Set of unlocked ids', () => {
    const otherPaid = { ...PAID_BOOK, id: 'b-other', title: 'Other Paid Book' };
    const out = sanitizeCatalog(
      { folders: [], books: [PAID_BOOK, otherPaid, FREE_BOOK] },
      false,
      new Set(['b-bulhan'])
    );
    expect(out.books[0].driveFileId).toBe(PAID_BOOK.driveFileId);
    expect(out.books[1].driveFileId).toBeUndefined();
    expect(out.books[1].fileUrl).toBe('');
    expect(out.books[2].driveFileId).toBe(FREE_BOOK.driveFileId);
  });

  it('strips all paid links for a gate-unlocked follower without keys', () => {
    const otherPaid = { ...PAID_BOOK, id: 'b-other', title: 'Other Paid Book' };
    const out = sanitizeCatalog(
      { folders: [], books: [PAID_BOOK, otherPaid, FREE_BOOK] },
      false,
      new Set()
    );
    expect(out.books[0].driveFileId).toBeUndefined();
    expect(out.books[0].fileUrl).toBe('');
    expect(out.books[1].driveFileId).toBeUndefined();
    expect(out.books[1].fileUrl).toBe('');
    expect(out.books[2].driveFileId).toBe(FREE_BOOK.driveFileId);
  });
});

describe('hasFollowUnlocked (server/app.ts)', () => {
  it('is true only when the header is exactly "1"', () => {
    expect(hasFollowUnlocked({ headers: { 'x-follow-unlocked': '1' } } as any)).toBe(true);
    expect(hasFollowUnlocked({ headers: {} } as any)).toBe(false);
    expect(hasFollowUnlocked({ headers: { 'x-follow-unlocked': '0' } } as any)).toBe(false);
    expect(hasFollowUnlocked({ headers: { 'x-follow-unlocked': 'true' } } as any)).toBe(false);
  });
});

describe('sanitizeBook (server/cf-api-handler.ts)', () => {
  it('strips paid links for a locked visitor (default: not admin)', () => {
    const out = sanitizeBookCf(PAID_BOOK);
    expect(out.isPaid).toBe(true);
    expect(out.driveFileId).toBeUndefined();
    expect(out.externalUrl).toBeUndefined();
    expect(out.fileUrl).toBe('');
    expect(out.pdfUrl).toBe('');
  });

  it('keeps paid links for a visitor holding that book’s own key', () => {
    const out = sanitizeBookCf(PAID_BOOK, false, true);
    expect(out.driveFileId).toBe(PAID_BOOK.driveFileId);
    expect(out.externalUrl).toBe(PAID_BOOK.externalUrl);
    expect(out.fileUrl).toBe(`/api/files/${PAID_BOOK.driveFileId}/preview`);
  });

  it('strips paid links for a gate-unlocked follower without the key', () => {
    // The follow flag used to open paid books; since Phase 1 it opens
    // only free books. sanitizeBook takes no follow flag anymore.
    const out = sanitizeBookCf(PAID_BOOK, false, false);
    expect(out.isPaid).toBe(true);
    expect(out.driveFileId).toBeUndefined();
    expect(out.externalUrl).toBeUndefined();
    expect(out.fileUrl).toBe('');
    expect(out.pdfUrl).toBe('');
  });

  it('keeps paid links for the admin', () => {
    const out = sanitizeBookCf(PAID_BOOK, true, false);
    expect(out.driveFileId).toBe(PAID_BOOK.driveFileId);
  });

  it('keeps links for a free book even when locked', () => {
    const out = sanitizeBookCf(FREE_BOOK, false, false);
    expect(out.driveFileId).toBe(FREE_BOOK.driveFileId);
  });
});

describe('Cloudflare catalog endpoint', () => {
  it('sets Vary on the admin token and the book-unlock flag', async () => {
    const res = await handleCloudflareApiRequest(
      new Request('https://example.com/api/catalog'),
      {}
    );
    expect(res.status).toBe(200);
    const vary = res.headers.get('Vary') || '';
    expect(vary).toContain('x-admin-token');
    expect(vary).toContain('x-book-unlock');
    const body = (await res.json()) as any;
    expect(Array.isArray(body.books)).toBe(true);
    expect(body.books.length).toBeGreaterThan(0);
  });
});

describe('PaidLockScreen (locked visitor screen)', () => {
  it('says the book needs a key and offers the key entry — never free-for-followers or a payment step', () => {
    const html = renderToStaticMarkup(
      React.createElement(PaidLockScreen, { book: PAID_BOOK as any })
    );
    expect(html).toContain('needs a key');
    expect(html).toContain('broadcast channel');
    expect(html).toContain('Enter your key');
    expect(html).toContain('Unlock');
    expect(html).not.toContain('free for followers');
    expect(html).not.toContain('Free for followers');
    // Kitab Al Bulhan has no price set: no price shown at all.
    expect(html).not.toContain('Rs ');
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('UPI');
    expect(html).not.toContain('Pay by');
  });

  it('shows the price when the book has one — Rs 99 for Manba', () => {
    const priced = {
      ...PAID_BOOK,
      id: 'b-manba-usul-al-hikma',
      title: 'Manba Usul al-Hikma',
      price: 99,
      priceCurrency: 'INR',
    };
    const html = renderToStaticMarkup(
      React.createElement(PaidLockScreen, { book: priced as any })
    );
    expect(html).toContain('Rs 99');
    expect(html).toContain('unlock with a key');
    expect(html).toContain('needs a key');
  });

  it('shows no price for a paid book with price 0', () => {
    const html = renderToStaticMarkup(
      React.createElement(PaidLockScreen, { book: { ...PAID_BOOK, price: 0 } as any })
    );
    expect(html).not.toContain('Rs ');
    expect(html).not.toContain('Rs 0');
  });
});

describe('formatBookPrice', () => {
  it('formats an INR price as Rs, and returns null with no usable price', () => {
    expect(formatBookPrice({ price: 99, priceCurrency: 'INR' } as any)).toBe('Rs 99');
    expect(formatBookPrice({ price: 99 } as any)).toBe('Rs 99');
    expect(formatBookPrice({ price: 50, priceCurrency: 'USD' } as any)).toBe('USD 50');
    expect(formatBookPrice({} as any)).toBeNull();
    expect(formatBookPrice({ price: undefined } as any)).toBeNull();
    expect(formatBookPrice({ price: 0 } as any)).toBeNull();
    expect(formatBookPrice({ price: -10 } as any)).toBeNull();
    expect(formatBookPrice(null)).toBeNull();
    expect(formatBookPrice(undefined)).toBeNull();
  });
});

describe('Cloudflare stream route (/api/books/:id/stream)', () => {
  // Regression: the stream matcher used to miss "/stream" on /api/books/
  // paths, so a locked visitor got 401 "Admin session required" instead
  // of the paid-book 402. The Manba book id below is the real bundled
  // catalog entry (data/catalog.json). Since Phase 1 a follower without
  // the key gets the same 402.
  it('returns 402 for a locked visitor (no gate unlock, no key)', async () => {
    const res = await handleCloudflareApiRequest(
      new Request('https://example.com/api/books/b-manba-usul-al-hikma/stream'),
      {}
    );
    expect(res.status).toBe(402);
    const body = (await res.json()) as any;
    expect(body.error).toMatch(/needs its own key/i);
    expect(body.error).not.toMatch(/Rs 99|UPI/);
  });

  it('still 402s for a gate-unlocked follower without the key', async () => {
    const res = await handleCloudflareApiRequest(
      new Request('https://example.com/api/books/b-manba-usul-al-hikma/stream', {
        headers: { 'x-follow-unlocked': '1' },
      }),
      {}
    );
    expect(res.status).toBe(402);
    const body = (await res.json()) as any;
    expect(body.error).toMatch(/needs its own key/i);
  });
});

describe('getPaidBadgeLabel', () => {
  it('is "Paid" for a paid book with or without a price — never a price', () => {
    expect(getPaidBadgeLabel({ isPaid: true, price: 199 } as any)).toBe('Paid');
    expect(getPaidBadgeLabel({ isPaid: true } as any)).toBe('Paid');
    expect(getPaidBadgeLabel({ isPaid: true, price: 199 } as any)).not.toContain('₹');
    expect(getPaidBadgeLabel({ isPaid: true, price: 199 } as any)).not.toContain('199');
  });

  it('is null for a free book or no book', () => {
    expect(getPaidBadgeLabel({ isPaid: false } as any)).toBeNull();
    expect(getPaidBadgeLabel({} as any)).toBeNull();
    expect(getPaidBadgeLabel(null)).toBeNull();
    expect(getPaidBadgeLabel(undefined)).toBeNull();
  });
});

describe('getFollowUnlockHeaders (client)', () => {
  const realLocalStorage = (globalThis as any).localStorage;
  let store: Record<string, string> = {};

  const stubLocalStorage = () => {
    (globalThis as any).localStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    };
  };

  afterEach(() => {
    (globalThis as any).localStorage = realLocalStorage;
    store = {};
  });

  it('sends only the boolean flag, never a key or secret', () => {
    expect(FOLLOW_UNLOCK_HEADER).toBe('x-follow-unlocked');
    stubLocalStorage();
    store['ilmeghayb_follow_unlocked'] = '1';
    expect(getFollowUnlockHeaders()).toEqual({ 'x-follow-unlocked': '1' });
  });

  it('sends nothing when the visitor has not unlocked', () => {
    stubLocalStorage();
    expect(getFollowUnlockHeaders()).toEqual({});
    store['ilmeghayb_follow_unlocked'] = '0';
    expect(getFollowUnlockHeaders()).toEqual({});
  });
});

describe('getBookUnlockHeaders (client)', () => {
  const realLocalStorage = (globalThis as any).localStorage;
  let store: Record<string, string> = {};

  const stubLocalStorage = () => {
    (globalThis as any).localStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    };
  };

  afterEach(() => {
    (globalThis as any).localStorage = realLocalStorage;
    store = {};
  });

  it('sends nothing when no unlock token is held', () => {
    stubLocalStorage();
    expect(getBookUnlockHeaders()).toEqual({});
    expect(BOOK_UNLOCK_HEADER).toBe('x-book-unlock');
  });

  it('sends the held unlock tokens as JSON, one per book, never a raw key', () => {
    stubLocalStorage();
    saveBookUnlockToken('b-bulhan', 'tok-abc-123');
    const headers = getBookUnlockHeaders();
    expect(headers[BOOK_UNLOCK_HEADER]).toBeTruthy();
    expect(JSON.parse(headers[BOOK_UNLOCK_HEADER])).toEqual({ 'b-bulhan': 'tok-abc-123' });
    expect(headers[BOOK_UNLOCK_HEADER]).not.toContain('ABCDE-FGHIJ');
  });

  it('drops expired unlock tokens instead of sending them', () => {
    stubLocalStorage();
    saveBookUnlockToken('b-old', 'tok-expired', Date.now() - 1000);
    saveBookUnlockToken('b-live', 'tok-live', Date.now() + 60000);
    const headers = getBookUnlockHeaders();
    expect(JSON.parse(headers[BOOK_UNLOCK_HEADER])).toEqual({ 'b-live': 'tok-live' });
  });

  it('ignores a raw key left in the old storage slot', () => {
    stubLocalStorage();
    store['ilmeghayb_book_keys'] = JSON.stringify({ 'b-bulhan': 'ABCDE-FGHIJ-KLMNO-PQRST' });
    expect(getBookUnlockHeaders()).toEqual({});
  });

  it('uses one stable device id per browser', () => {
    stubLocalStorage();
    const first = getDeviceId();
    expect(first).toBeTruthy();
    expect(getDeviceId()).toBe(first);
    expect(store['ilmeghayb_device_id']).toBe(first);
  });
});

describe('api.verifyBookKey stores the unlock token, never the raw key', () => {
  const realFetch = (globalThis as any).fetch;
  const realLocalStorage = (globalThis as any).localStorage;
  let store: Record<string, string> = {};
  let seen: { url: string; init?: any } | null = null;

  const stubAll = () => {
    (globalThis as any).localStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    };
    (globalThis as any).fetch = vi.fn(async (url: string, init?: any) => {
      seen = { url, init };
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ ok: true, usesLeft: 99, unlockToken: 'tok-xyz', unlockExpiresAt: Date.now() + 3600000 }),
      };
    });
  };

  afterEach(() => {
    (globalThis as any).fetch = realFetch;
    (globalThis as any).localStorage = realLocalStorage;
    store = {};
    seen = null;
    vi.restoreAllMocks();
  });

  it('sends the device id header and stores only the unlock token', async () => {
    stubAll();
    const res = await api.verifyBookKey('b-bulhan', 'ABCDE-FGHIJ-KLMNO-PQRST');
    expect(res.ok).toBe(true);
    expect(res.unlockToken).toBe('tok-xyz');
    expect(res.usesLeft).toBe(99);
    expect(seen?.url).toBe('/api/book-keys/verify');
    expect(seen?.init?.headers?.[DEVICE_ID_HEADER]).toBeTruthy();
    const stored = JSON.parse(store['ilmeghayb_book_unlocks'] || '{}');
    expect(stored['b-bulhan']?.token).toBe('tok-xyz');
    expect(JSON.stringify(store)).not.toContain('ABCDE-FGHIJ-KLMNO-PQRST');
  });

  it('reports a wrong key without storing anything', async () => {
    (globalThis as any).localStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    };
    (globalThis as any).fetch = vi.fn(async () => ({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ error: 'Wrong key. Check the key and try again.' }),
    }));
    const res = await api.verifyBookKey('b-bulhan', 'WRONG-WRONG-WRONG-WRONG');
    expect(res.ok).toBe(false);
    expect(store['ilmeghayb_book_unlocks']).toBeUndefined();
  });
});

describe('api.getCatalog sends the unlock headers', () => {
  const realFetch = (globalThis as any).fetch;
  const realLocalStorage = (globalThis as any).localStorage;
  let store: Record<string, string> = {};
  let seenHeaders: Record<string, string> | null = null;

  const catalogJson = JSON.stringify({
    folders: [],
    books: [{ id: 'b1', title: 'T' }],
  });

  const stubAll = () => {
    (globalThis as any).localStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    };
    (globalThis as any).fetch = vi.fn(async (_url: string, init?: any) => {
      seenHeaders = init?.headers || null;
      return { ok: true, status: 200, text: async () => catalogJson };
    });
  };

  afterEach(() => {
    (globalThis as any).fetch = realFetch;
    (globalThis as any).localStorage = realLocalStorage;
    store = {};
    seenHeaders = null;
    vi.restoreAllMocks();
  });

  it('includes x-follow-unlocked: 1 when unlocked', async () => {
    stubAll();
    store['ilmeghayb_follow_unlocked'] = '1';
    const data = await api.reloadCatalog();
    expect(data.books).toHaveLength(1);
    expect(seenHeaders).toMatchObject({ 'x-follow-unlocked': '1' });
  });

  it('omits the header when locked', async () => {
    stubAll();
    await api.reloadCatalog();
    expect(seenHeaders).not.toBeNull();
    expect((seenHeaders as any)?.['x-follow-unlocked']).toBeUndefined();
    expect(Object.keys(seenHeaders || {})).not.toContain('x-follow-unlocked');
  });

  it('includes x-book-unlock when an unlock token is held, never x-book-keys', async () => {
    stubAll();
    saveBookUnlockToken('b1', 'tok-1');
    await api.reloadCatalog();
    expect((seenHeaders as any)?.['x-book-unlock']).toBeTruthy();
    expect(JSON.parse((seenHeaders as any)['x-book-unlock'])).toEqual({ b1: 'tok-1' });
    expect((seenHeaders as any)?.['x-book-keys']).toBeUndefined();
  });
});
