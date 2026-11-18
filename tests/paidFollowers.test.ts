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
import { getPaidBadgeLabel } from '../src/utils/fileUtils';
import {
  FOLLOW_UNLOCK_HEADER,
  getFollowUnlockHeaders,
  getBookKeyHeaders,
  BOOK_KEYS_HEADER,
  api,
} from '../src/services/api';

// Paid books are FREE for followers, and they can also be opened with
// their own unlock key. These tests pin the rule on both servers
// (Express/Vercel in server/app.ts, Cloudflare/pages.dev in
// server/cf-api-handler.ts, which must stay in sync):
//   locked visitor        -> paid links stripped, file endpoints 402
//   admin                 -> links kept, files served
//   gate-unlocked follower (x-follow-unlocked: 1) -> paid books open free
//   visitor with the key  -> only THAT book's links kept, files served
// A key unlocks ONE paid book only — never a different paid book. No
// money anywhere: no price, no UPI, no payment step.

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
  it('is true only for a paid book with neither admin, gate unlock, nor its own key', () => {
    expect(isPaidBookLocked(PAID_BOOK, false, false)).toBe(true);
    expect(isPaidBookLocked(PAID_BOOK, false, false, false)).toBe(true);
    expect(isPaidBookLocked(PAID_BOOK, true, false)).toBe(false);
    expect(isPaidBookLocked(PAID_BOOK, false, true)).toBe(false);
    expect(isPaidBookLocked(PAID_BOOK, false, false, true)).toBe(false);
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
    expect(isPaidBookLockedCf(PAID_BOOK, false, false, false)).toBe(true);
    expect(isPaidBookLockedCf(PAID_BOOK, true, false)).toBe(false);
    expect(isPaidBookLockedCf(PAID_BOOK, false, true)).toBe(false);
    expect(isPaidBookLockedCf(PAID_BOOK, false, false, true)).toBe(false);
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

  it('keeps paid links for a gate-unlocked follower (free for followers)', () => {
    const out = sanitizeBook(PAID_BOOK, false, false, true);
    expect(out.driveFileId).toBe(PAID_BOOK.driveFileId);
    expect(out.externalUrl).toBe(PAID_BOOK.externalUrl);
    expect(out.fileUrl).toBe(`/api/files/${PAID_BOOK.driveFileId}/preview`);
    expect(out.pdfUrl).toBe(`/api/files/${PAID_BOOK.driveFileId}/preview`);
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

  it('keeps all paid links for a gate-unlocked follower', () => {
    const otherPaid = { ...PAID_BOOK, id: 'b-other', title: 'Other Paid Book' };
    const out = sanitizeCatalog(
      { folders: [], books: [PAID_BOOK, otherPaid, FREE_BOOK] },
      false,
      new Set(),
      true
    );
    expect(out.books[0].driveFileId).toBe(PAID_BOOK.driveFileId);
    expect(out.books[1].driveFileId).toBe(otherPaid.driveFileId);
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

  it('keeps paid links for a gate-unlocked follower (free for followers)', () => {
    const out = sanitizeBookCf(PAID_BOOK, false, false, true);
    expect(out.driveFileId).toBe(PAID_BOOK.driveFileId);
    expect(out.externalUrl).toBe(PAID_BOOK.externalUrl);
    expect(out.fileUrl).toBe(`/api/files/${PAID_BOOK.driveFileId}/preview`);
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
  it('sets Vary on the admin token and the book-keys flag', async () => {
    const res = await handleCloudflareApiRequest(
      new Request('https://example.com/api/catalog'),
      {}
    );
    expect(res.status).toBe(200);
    const vary = res.headers.get('Vary') || '';
    expect(vary).toContain('x-admin-token');
    expect(vary).toContain('x-book-keys');
    const body = (await res.json()) as any;
    expect(Array.isArray(body.books)).toBe(true);
    expect(body.books.length).toBeGreaterThan(0);
  });
});

describe('PaidLockScreen (locked visitor screen)', () => {
  it('says free for followers and offers the key entry — never a price or UPI', () => {
    const html = renderToStaticMarkup(
      React.createElement(PaidLockScreen, { book: PAID_BOOK as any })
    );
    expect(html).toContain('free for followers');
    expect(html).toContain('Enter your key');
    expect(html).toContain('Unlock');
    expect(html).not.toContain('Rs 99');
    expect(html).not.toContain('Rs ');
    expect(html).not.toContain('UPI');
    expect(html).not.toContain('Pay by');
  });
});

describe('Cloudflare stream route (/api/books/:id/stream)', () => {
  // Regression: the stream matcher used to miss "/stream" on /api/books/
  // paths, so a locked visitor got 401 "Admin session required" instead
  // of the paid-book 402, and a follower got 401 too. The Manba book id
  // below is the real bundled catalog entry (data/catalog.json).
  it('returns 402 for a locked visitor (no gate unlock, no key)', async () => {
    const res = await handleCloudflareApiRequest(
      new Request('https://example.com/api/books/b-manba-usul-al-hikma/stream'),
      {}
    );
    expect(res.status).toBe(402);
    const body = (await res.json()) as any;
    expect(body.error).toMatch(/free for followers/i);
    expect(body.error).not.toMatch(/Rs 99|UPI/);
  });

  it('does not 402 for a gate-unlocked follower', async () => {
    const res = await handleCloudflareApiRequest(
      new Request('https://example.com/api/books/b-manba-usul-al-hikma/stream', {
        headers: { 'x-follow-unlocked': '1' },
      }),
      {}
    );
    expect(res.status).not.toBe(402);
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

describe('getBookKeyHeaders (client)', () => {
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

  it('sends nothing when no key is held', () => {
    stubLocalStorage();
    expect(getBookKeyHeaders()).toEqual({});
    expect(BOOK_KEYS_HEADER).toBe('x-book-keys');
  });

  it('sends the held keys as a base64url JSON header, one per book', () => {
    stubLocalStorage();
    store['ilmeghayb_book_keys'] = JSON.stringify({ 'b-bulhan': 'ABCDE-FGHIJ-KLMNO-PQRST' });
    const headers = getBookKeyHeaders();
    expect(headers[BOOK_KEYS_HEADER]).toBeTruthy();
    const decoded = JSON.parse(
      Buffer.from(headers[BOOK_KEYS_HEADER].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    );
    expect(decoded).toEqual({ 'b-bulhan': 'ABCDE-FGHIJ-KLMNO-PQRST' });
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

  it('includes x-book-keys when a key is held', async () => {
    stubAll();
    store['ilmeghayb_book_keys'] = JSON.stringify({ b1: 'KEY-12345-ABCDE-67890' });
    await api.reloadCatalog();
    expect((seenHeaders as any)?.['x-book-keys']).toBeTruthy();
  });
});
