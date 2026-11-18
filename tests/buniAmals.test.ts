import { describe, it, expect } from 'vitest';
import { BUNI_AMALS, BUNI_BOOK_TITLE, BUNI_CHAPTERS } from '../src/data/buniAmals';

describe('Buni amals (Ahmad al-Buni section)', () => {
  it('has exactly 25 amals', () => {
    expect(BUNI_AMALS.length).toBe(25);
  });

  it('every amal has a unique id and all display fields', () => {
    const ids = new Set<string>();
    for (const amal of BUNI_AMALS) {
      expect(amal.id).toBeTruthy();
      expect(ids.has(amal.id)).toBe(false);
      ids.add(amal.id);
      expect(amal.title.trim().length).toBeGreaterThan(0);
      expect(amal.purpose.trim().length).toBeGreaterThan(0);
      expect(amal.how.trim().length).toBeGreaterThan(0);
      expect(amal.chapter.trim().length).toBeGreaterThan(0);
      expect(amal.section.trim().length).toBeGreaterThan(0);
      // PDF page ref so the reader can check the book, e.g. "178" or "178–179".
      expect(amal.pdfPage).toMatch(/^\d+(–\d+)?$/);
    }
  });

  it('never presents the amals as the John Friend version', () => {
    const text = JSON.stringify(BUNI_AMALS) + BUNI_BOOK_TITLE;
    expect(text.toLowerCase()).not.toContain('john friend');
  });

  it('links to the real Shams book title in the catalog', () => {
    expect(BUNI_BOOK_TITLE).toBe('The Sun of Knowledge Al-Buni-Shams-Al-Ma-Arif');
  });

  it('every chapter group exists and covers all 25 amals', () => {
    const grouped = BUNI_CHAPTERS.flatMap((c) => BUNI_AMALS.filter((a) => a.chapter === c.chapter));
    expect(grouped.length).toBe(25);
    expect(BUNI_CHAPTERS.map((c) => c.chapter)).toEqual(['Chapter 5', 'Chapter 8', 'Chapter 10']);
  });

  it('every amal has the exact words or the full prayer in its how-to', () => {
    for (const amal of BUNI_AMALS) {
      const text = `${amal.words || ''} ${amal.how}`;
      // A count or a phrase to say must be present — no empty detail.
      expect(text.length).toBeGreaterThan(20);
    }
    // The two long prayers carry their full text in the how-to.
    const hidden = BUNI_AMALS.find((a) => a.id === 'buni-hidden-name');
    expect(hidden?.how).toContain('the Pure, the Purifying');
    const important = BUNI_AMALS.find((a) => a.id === 'buni-important-matter');
    expect(important?.how).toContain('Take care of what I need');
  });
});
