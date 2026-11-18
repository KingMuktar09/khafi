import { describe, it, expect } from 'vitest';
import { ASMA_NAMES, ASMA_SOURCE, nameValues } from '../src/data/asmaNames';
import type { AsmaName } from '../src/data/asmaNames';
import { valueOfText } from '../src/utils/abjad';

function findByArabic(arabic: string): AsmaName {
  const entry = ASMA_NAMES.find((item) => item.arabic === arabic);
  if (!entry) throw new Error(`missing name: ${arabic}`);
  return entry;
}

describe('ASMA_NAMES', () => {
  it('has exactly 99 entries', () => {
    expect(ASMA_NAMES).toHaveLength(99);
  });

  it('has all-unique Arabic forms and all-unique bare forms', () => {
    expect(new Set(ASMA_NAMES.map((entry) => entry.arabic)).size).toBe(99);
    expect(new Set(ASMA_NAMES.map((entry) => entry.bare)).size).toBe(99);
  });

  it('names the Tirmidhi enumeration as its source', () => {
    expect(ASMA_SOURCE).toContain('Tirmidhi');
  });

  it('stores Arabic without diacritics, tatweel, or superscript alef', () => {
    const forbidden = /[ً-ٰٟـ]/u;
    for (const entry of ASMA_NAMES) {
      expect(entry.arabic).not.toMatch(forbidden);
      expect(entry.bare).not.toMatch(forbidden);
      expect(entry.arabic.length).toBeGreaterThan(0);
      expect(entry.bare.length).toBeGreaterThan(0);
      expect(entry.transliteration.length).toBeGreaterThan(0);
      expect(entry.meaning.length).toBeGreaterThan(0);
    }
  });

  it('runs from Ar-Rahman to As-Sabur in the traditional order', () => {
    expect(ASMA_NAMES[0].arabic).toBe('الرحمن');
    expect(ASMA_NAMES[98].arabic).toBe('الصبور');
  });
});

describe('nameValues (kabir mashriqi spot checks)', () => {
  it('Allah totals 66', () => {
    // Allah itself is not counted among the 99; the value is checked directly.
    expect(valueOfText('الله', 'kabir', 'mashriqi').total).toBe(66);
  });

  it('ar-Rahman: bare 298, with al- 329', () => {
    expect(nameValues(findByArabic('الرحمن'), 'kabir', 'mashriqi')).toEqual({
      bare: 298,
      withAl: 329,
    });
  });

  it('ar-Rahim: bare 258, with al- 289', () => {
    expect(nameValues(findByArabic('الرحيم'), 'kabir', 'mashriqi')).toEqual({
      bare: 258,
      withAl: 289,
    });
  });

  it('al-Malik: bare 90, with al- 121', () => {
    expect(nameValues(findByArabic('الملك'), 'kabir', 'mashriqi')).toEqual({
      bare: 90,
      withAl: 121,
    });
  });

  it('al-Quddus: bare 170, with al- 201', () => {
    expect(nameValues(findByArabic('القدوس'), 'kabir', 'mashriqi')).toEqual({
      bare: 170,
      withAl: 201,
    });
  });

  it('values are computed from the table, and with-al is never less than bare', () => {
    for (const entry of ASMA_NAMES) {
      const values = nameValues(entry, 'kabir', 'mashriqi');
      expect(values.bare).toBeGreaterThan(0);
      expect(values.withAl).toBeGreaterThanOrEqual(values.bare);
      expect(values.bare).toBe(valueOfText(entry.bare, 'kabir', 'mashriqi').total);
      expect(values.withAl).toBe(valueOfText(entry.arabic, 'kabir', 'mashriqi').total);
    }
  });

  it('also works in saghir and in the maghribi school', () => {
    const rahman = nameValues(findByArabic('الرحمن'), 'saghir', 'mashriqi');
    expect(rahman.bare).toBe(2 + 8 + 4 + 5); // ر 200->2, ح 8, م 40->4, ن 50->5
    expect(rahman.withAl).toBe(rahman.bare + 1 + 3); // ا 1, ل 30->3
    const quddusMaghribi = nameValues(findByArabic('القدوس'), 'kabir', 'maghribi');
    expect(quddusMaghribi.bare).toBe(100 + 4 + 6 + 300); // س is 300 in maghribi
  });
});
