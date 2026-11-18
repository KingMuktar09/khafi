import { describe, it, expect } from 'vitest';
import {
  ABJAD_LETTERS,
  NORMALIZATION_RULES,
  letterValue,
  normalizeArabic,
  saghirOf,
  valueOfText,
} from '../src/utils/abjad';
import type { AbjadLetter } from '../src/utils/abjad';

const MASHRIQI_KABIR: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8,
  'ط': 9, 'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60,
  'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400,
  'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
};

const ABJAD_ORDER = [
  'ا', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن',
  'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ',
];

describe('ABJAD_LETTERS table', () => {
  it('has 28 letters in abjad order', () => {
    expect(ABJAD_LETTERS).toHaveLength(28);
    expect(ABJAD_LETTERS.map((entry: AbjadLetter) => entry.letter)).toEqual(ABJAD_ORDER);
  });

  it('gives the standard kabir mashriqi value for every letter', () => {
    for (const entry of ABJAD_LETTERS) {
      expect(entry.kabirMashriqi).toBe(MASHRIQI_KABIR[entry.letter]);
      expect(letterValue(entry.letter, 'kabir', 'mashriqi')).toBe(MASHRIQI_KABIR[entry.letter]);
    }
  });

  it('differs from mashriqi only for the six maghribi letters', () => {
    const expectedMaghribi: Record<string, number> = {
      'ص': 60, 'ض': 90, 'س': 300, 'ش': 1000, 'ظ': 800, 'غ': 900,
    };
    for (const entry of ABJAD_LETTERS) {
      const expected = expectedMaghribi[entry.letter] ?? MASHRIQI_KABIR[entry.letter];
      expect(entry.kabirMaghribi).toBe(expected);
      expect(letterValue(entry.letter, 'kabir', 'maghribi')).toBe(expected);
    }
  });
});

describe('saghir (digit-sum reduction)', () => {
  it.each([
    [100, 1],
    [1000, 1],
    [90, 9],
    [300, 3],
    [60, 6],
    [10, 1],
    [1, 1],
    [9, 9],
    [0, 0],
  ])('saghirOf(%i) is %i', (kabir, expected) => {
    expect(saghirOf(kabir)).toBe(expected);
  });

  it('reduces per school: sad 90 -> 9 mashriqi, 60 -> 6 maghribi; shin 300 -> 3 mashriqi, 1000 -> 1 maghribi', () => {
    expect(letterValue('ص', 'saghir', 'mashriqi')).toBe(9);
    expect(letterValue('ص', 'saghir', 'maghribi')).toBe(6);
    expect(letterValue('ش', 'saghir', 'mashriqi')).toBe(3);
    expect(letterValue('ش', 'saghir', 'maghribi')).toBe(1);
    expect(letterValue('ق', 'saghir', 'mashriqi')).toBe(1);
    expect(letterValue('غ', 'saghir', 'mashriqi')).toBe(1);
  });
});

describe('letterValue', () => {
  it('returns null for non-letters', () => {
    expect(letterValue('x', 'kabir', 'mashriqi')).toBeNull();
    expect(letterValue(' ', 'kabir', 'mashriqi')).toBeNull();
    expect(letterValue('', 'kabir', 'mashriqi')).toBeNull();
  });

  it('reads hamza forms as their plain letter', () => {
    expect(letterValue('أ', 'kabir', 'mashriqi')).toBe(1);
    expect(letterValue('ؤ', 'kabir', 'mashriqi')).toBe(6);
    expect(letterValue('ئ', 'kabir', 'mashriqi')).toBe(10);
  });
});

describe('normalizeArabic', () => {
  it('documents every normalization choice in plain English', () => {
    expect(NORMALIZATION_RULES.length).toBeGreaterThanOrEqual(7);
    for (const rule of NORMALIZATION_RULES) {
      expect(rule.length).toBeGreaterThan(10);
    }
  });

  it('unifies hamza forms to alif, waw, yeh', () => {
    expect(normalizeArabic('أإآٱ')).toBe('اااا');
    expect(normalizeArabic('ؤ')).toBe('و');
    expect(normalizeArabic('ئ')).toBe('ي');
  });

  it('reads ta marbuta as ha and alif maqsura as yeh', () => {
    expect(normalizeArabic('ة')).toBe('ه');
    expect(normalizeArabic('ى')).toBe('ي');
    expect(normalizeArabic('موسى')).toBe('موسي');
  });

  it('expands a shadda into a repeat of its letter, and الله stays 66', () => {
    expect(normalizeArabic('اللَّه')).toBe('الله');
    expect(valueOfText('اللَّه', 'kabir', 'mashriqi').total).toBe(66);
    // A singly-written letter with a shadda counts twice.
    expect(normalizeArabic('مُحَمَّد')).toBe('محممد');
    expect(valueOfText('محمد', 'kabir', 'mashriqi').total).toBe(92);
    expect(valueOfText('مُحَمَّد', 'kabir', 'mashriqi').total).toBe(132);
  });

  it('strips diacritics', () => {
    expect(normalizeArabic('بِسْمِ')).toBe('بسم');
    expect(valueOfText('بِسْمِ', 'kabir', 'mashriqi').total).toBe(102);
  });

  it('removes tatweel', () => {
    expect(normalizeArabic('بـسـم')).toBe('بسم');
    expect(valueOfText('بـسـم', 'kabir', 'mashriqi').total).toBe(102);
  });

  it('ignores spaces and punctuation', () => {
    expect(normalizeArabic('بسم الله')).toBe('بسمالله');
    expect(valueOfText('بسم الله', 'kabir', 'mashriqi').total).toBe(168);
    expect(valueOfText('بسم، الله!', 'kabir', 'mashriqi').total).toBe(168);
  });

  it('applies Unicode NFC first (decomposed alif + hamza becomes أ, then ا)', () => {
    const decomposed = 'ا' + 'ٔ'; // U+0627 + U+0654, NFC composes to U+0623
    expect(normalizeArabic(decomposed)).toBe('ا');
    expect(valueOfText(decomposed, 'kabir', 'mashriqi').total).toBe(1);
  });

  it('strips superscript alef', () => {
    expect(normalizeArabic('الرحمٰن')).toBe('الرحمن');
  });
});

describe('valueOfText', () => {
  it('totals بسم الله to 168 in kabir mashriqi, with a per-letter breakdown', () => {
    const result = valueOfText('بسم الله', 'kabir', 'mashriqi');
    expect(result.total).toBe(168);
    expect(result.letters).toEqual([
      { letter: 'ب', value: 2 },
      { letter: 'س', value: 60 },
      { letter: 'م', value: 40 },
      { letter: 'ا', value: 1 },
      { letter: 'ل', value: 30 },
      { letter: 'ل', value: 30 },
      { letter: 'ه', value: 5 },
    ]);
  });

  it('uses the maghribi table when asked', () => {
    // ص 60 + س 300 in maghribi, vs 90 + 60 in mashriqi.
    expect(valueOfText('صس', 'kabir', 'mashriqi').total).toBe(150);
    expect(valueOfText('صس', 'kabir', 'maghribi').total).toBe(360);
  });

  it('sums saghir values per letter', () => {
    expect(valueOfText('بسم الله', 'saghir', 'mashriqi').total).toBe(2 + 6 + 4 + 1 + 3 + 3 + 5);
  });

  it('returns 0 with no letters for empty or non-Arabic text', () => {
    expect(valueOfText('', 'kabir', 'mashriqi')).toEqual({ total: 0, letters: [] });
    expect(valueOfText('hello 123', 'kabir', 'mashriqi')).toEqual({ total: 0, letters: [] });
  });
});
