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
  api,
} from '../src/services/api';

// Paid books are FREE for followers. These tests pin the rule on both
// servers (Express/Vercel in server/app.ts, Cloudflare/pages.dev in
// server/cf-api-handler.ts, which must stay in sync):
//   locked visitor  -> paid links stripped, file endpoints 402
//   admin           -> links kept, files served
//   gate-unlocked follower (x-follow-unlocked: 1) -> links kept, files
//     served, no payment anywhere
// The unlock is TRUST-BASED, like the gate itself: the header carries
// only the boolean flag, never the gate key or any secret.

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
};

describe('isPaidBookLocked (server/app.ts)', () => {
  it('is true only for a paid book with neither admin nor follow unlock', () => {
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
    expect(out.title).toBe('Kitab Al Bulhan');
    expect(out.driveFileId).toBeUndefined();
    expect(out.externalUrl).toBeUndefined();
    expect(out.fileUrl).toBe('');
    expect(out.pdfUrl).toBe('');
  });

  it('keeps paid links for a gate-unlocked follower', () => {
    const out = sanitizeBook(PAID_BOOK, false, true);
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

  it('keeps the paid book for a gate-unlocked follower', () => {
    const out = sanitizeCatalog(catalog, false, true);
    expect(out.books[0].driveFileId).toBe(PAID_BOOK.driveFileId);
    expect(out.books[0].externalUrl).toBe(PAID_BOOK.externalUrl);
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

  it('keeps paid links for a gate-unlocked follower', () => {
    const out = sanitizeBookCf(PAID_BOOK, false, true);
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
  it('sets Vary on the admin token and the follow-unlock flag', async () => {
    const res = await handleCloudflareApiRequest(
      new Request('https://example.com/api/catalog'),
      {}
    );
    expect(res.status).toBe(200);
    const vary = res.headers.get('Vary') || '';
    expect(vary).toContain('x-admin-token');
    expect(vary).toContain('x-follow-unlocked');
    const body = (await res.json()) as any;
    expect(Array.isArray(body.books)).toBe(true);
    expect(body.books.length).toBeGreaterThan(0);
  });
});

describe('PaidLockScreen (locked visitor screen)', () => {
  it('tells followers the book is free, with no payment screen, UPI, QR or price', () => {
    const html = renderToStaticMarkup(
      React.createElement(PaidLockScreen, { book: PAID_BOOK as any })
    );
    expect(html).toContain('free for followers');
    expect(html).toContain('Follow @ghayb.chronicles');
    expect(html).not.toContain('UPI');
    expect(html).not.toContain('Pay by');
    expect(html).not.toContain('₹');
    expect(html).not.toContain('payment proof');
    expect(html).not.toContain('QR');
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

describe('api.getCatalog sends the unlock header only when unlocked', () => {
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
});
