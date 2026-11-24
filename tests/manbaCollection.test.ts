import { describe, it, expect } from 'vitest';
import catalog from '../data/catalog.json';
import publicCatalog from '../public/catalog.json';
import { siteConfig } from '../src/config/siteConfig';

// Manba Usul al-Hikma, paid Rs 99 (needs its own key), in its own
// separate collection: "Ahmad al-Buni Collection" — a category, not a
// folder. The two al-Buni books already in the catalog moved there too,
// still free.
//
// NOTE (counts): the catalog in this repo had 137 books / 27 folders
// (the 173-book figure in older notes was stale). Adding Manba made
// 138 books. Fifteen public-domain books added 25 Nov 2026 make 153. Kitab Al Bulhan stays paid as before (no price set in the
// working catalog); Manba is the only NEW paid book, priced Rs 99 —
// paid books need their own key, and they open from Drive like the
// other books once unlocked.

const books = (catalog as any).books as any[];
const folders = (catalog as any).folders as any[];
const categoryOrder = (catalog as any).categoryOrder as string[];

describe('Manba Usul al-Hikma (paid, needs its own key)', () => {
  const manba = books.find((b) => b.id === 'b-manba-usul-al-hikma');

  it('exists as the 138th book', () => {
    expect(books).toHaveLength(153);
    expect(folders).toHaveLength(27);
    expect(manba).toBeTruthy();
  });

  it('is paid Rs 99, with the full title and author', () => {
    expect(manba.isPaid).toBe(true);
    expect(manba.price).toBe(99);
    expect(manba.priceCurrency).toBe('INR');
    expect(manba.paymentNote).toContain('Rs 99');
    expect(manba.title).toContain('Manba Usul al-Hikma');
    expect(manba.title).toContain('Four Treatises');
    expect(manba.author).toContain('al-Buni');
    expect(manba.pageCount).toBe(1368);
  });

  it('opens the Drive file (19 MB), like the other books', () => {
    expect(manba.driveFileId).toBe('1mhzUYdyFykJhI_0UkMayN7hbWRF04p9l');
    expect(manba.externalUrl).toBe(
      'https://drive.google.com/file/d/1mhzUYdyFykJhI_0UkMayN7hbWRF04p9l/view?usp=drivesdk'
    );
    expect(manba.fileUrl).toBeNull();
    expect(manba.pdfUrl).toBeNull();
    expect(manba.fileSize).toBe('19 MB');
    expect(manba.fileExtension).toBe('pdf');
  });

  it('is the only NEW paid book — Kitab Al Bulhan keeps its old paid mark', () => {
    const paid = books.filter((b) => b.isPaid);
    expect(paid).toHaveLength(2);
    expect(paid.map((b) => b.id).sort()).toEqual(
      ['b-1gKygGbTJSNtkvcRKSURJ3vGnNVNgmDI5', 'b-manba-usul-al-hikma'].sort()
    );
    const bulhan = paid.find((b) => b.title === 'Kitab Al Bulhan');
    expect(bulhan).toBeTruthy();
    expect(bulhan.price).toBeUndefined(); // unchanged: it never had a price in this catalog
    const manbaPaid = paid.find((b) => b.id === 'b-manba-usul-al-hikma');
    expect(manbaPaid.price).toBe(99);
  });
});

describe('Ahmad al-Buni Collection (separate category, not a folder)', () => {
  const collection = books.filter((b) => b.category === 'Ahmad al-Buni Collection');

  it('is its own category in categoryOrder, after Hidden Knowledge', () => {
    expect(categoryOrder).toContain('Ahmad al-Buni Collection');
    expect(categoryOrder.indexOf('Ahmad al-Buni Collection')).toBeGreaterThan(
      categoryOrder.indexOf('Hidden Knowledge & Esoteric')
    );
  });

  it('holds exactly 3 books: Manba (paid) + the 2 al-Buni books (free)', () => {
    expect(collection).toHaveLength(3);
    expect(collection.map((b) => b.title)).toContain('The Sun of Knowledge Al-Buni-Shams-Al-Ma-Arif');
    expect(collection.map((b) => b.title)).toContain('Al-buni Shams-al-maarif-manuscript-1500');
    const free = collection.filter((b) => !b.isPaid);
    expect(free).toHaveLength(2);
    const paid = collection.filter((b) => b.isPaid);
    expect(paid).toHaveLength(1);
    expect(paid[0].id).toBe('b-manba-usul-al-hikma');
  });

  it('keeps the Shams al-Ma’arif topic on all three books', () => {
    for (const b of collection) {
      expect(b.topic).toBe("Shams al-Ma'arif");
    }
  });

  it('orders Manba first, then the two free books', () => {
    const ordered = [...collection].sort((a, b) => a.sortOrder - b.sortOrder);
    expect(ordered[0].id).toBe('b-manba-usul-al-hikma');
  });
});

describe('public (static) catalog copy', () => {
  it('matches the repo catalog counts', () => {
    expect((publicCatalog as any).books).toHaveLength(153);
    expect((publicCatalog as any).folders).toHaveLength(27);
  });

  it('strips the paid books’ links for visitors, keeps the paid flag and the price', () => {
    const pub = (publicCatalog as any).books as any[];
    const manba = pub.find((b) => b.id === 'b-manba-usul-al-hikma');
    expect(manba.isPaid).toBe(true);
    // The price is public info: it survives sanitisation, only the
    // open/download links are stripped for locked visitors.
    expect(manba.price).toBe(99);
    expect(manba.priceCurrency).toBe('INR');
    expect(manba.fileUrl).toBe('');
    expect(manba.pdfUrl).toBe('');
    expect(manba.driveFileId).toBeUndefined();
    expect(manba.externalUrl).toBeUndefined();
    // A free book keeps its links in the static copy.
    const free = pub.find((b) => b.title.includes('Sun of Knowledge'));
    expect(free.fileUrl || free.externalUrl || free.driveFileId).toBeTruthy();
  });
});

describe('gate fallback totals', () => {
  it('siteConfig totals match the catalog (153 books, 27 folders)', () => {
    expect(siteConfig.catalogStats.totalBooks).toBe(153);
    expect(siteConfig.catalogStats.totalFolders).toBe(27);
  });
});
