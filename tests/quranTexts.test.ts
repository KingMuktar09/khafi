/**
 * Tests for the Qur'anic text used by the Fawatih, Sawaqit and Shields tools.
 *
 * The strings come from the Tanzil Project, Uthmani text (Madina Mushaf), Version 1.1
 * (February 2021) — see src/data/quranTexts.ts for the source and license notes.
 *
 * These tests pin the text itself (verse counts, NFC form, Basmalah handling) and the
 * values computed from it (14 Fawatih forms, 7 Sawaqit letters, the five Shields
 * totals). The expected numbers were worked out independently in Python against the
 * downloaded Tanzil file, using the letter table parsed from src/utils/abjad.ts,
 * so a failure here means the code and the source text disagree — not just that
 * the code changed its mind.
 *
 * Argument order for the abjad helpers is (text, system, school) where system is
 * 'kabir' | 'saghir' and school is 'mashriqi' | 'maghribi'.
 */
import { describe, expect, it } from 'vitest';
import {
  AYAT_AL_KURSI,
  FALAQ_VERSES,
  FATIHA_VERSES,
  IKHLAS_VERSES,
  NAS_VERSES,
  SHIELD_TEXTS,
  SURAH_OPENINGS,
  computeFawatih,
  computeSawaqit,
  shieldWordTotals,
} from '../src/data/quranTexts';
import { valueOfText } from '../src/utils/abjad';

describe('Qur\'anic text verification', () => {
  it('has the right verse counts', () => {
    expect(FATIHA_VERSES).toHaveLength(7);
    expect(IKHLAS_VERSES).toHaveLength(4);
    expect(FALAQ_VERSES).toHaveLength(5);
    expect(NAS_VERSES).toHaveLength(6);
  });

  it('has all 114 surah openings', () => {
    expect(SURAH_OPENINGS).toHaveLength(114);
    for (let n = 1; n <= 114; n += 1) {
      expect(SURAH_OPENINGS[n - 1].number).toBe(n);
    }
  });

  it('stores every string in Unicode NFC form', () => {
    const all: string[] = [
      ...FATIHA_VERSES,
      ...IKHLAS_VERSES,
      ...FALAQ_VERSES,
      ...NAS_VERSES,
      AYAT_AL_KURSI,
      ...SURAH_OPENINGS.map((entry) => entry.opening),
      ...SURAH_OPENINGS.filter((entry) => entry.secondVerse).map((entry) => entry.secondVerse as string),
    ];
    for (const text of all) {
      expect(text).toBe(text.normalize('NFC'));
    }
  });

  it('keeps the Basmalah as verse 1 of al-Fatiha', () => {
    // Verse 1 of the Fatiha IS the Basmalah. The whole Basmalah, in the
    // Uthmani spelling, counts 1,186 in Kabir Mashriqi. (The plain spelling
    // of just 'bism Allah' — two words, no shadda — counts 168.)
    expect(valueOfText(FATIHA_VERSES[0], 'kabir', 'mashriqi').total).toBe(1186);
    expect(valueOfText('بسم الله', 'kabir', 'mashriqi').total).toBe(168);
    expect(valueOfText(FATIHA_VERSES.join(' '), 'kabir', 'mashriqi').total).toBe(11919);
  });

  it('does not carry the Basmalah into al-Ikhlas, al-Falaq or al-Nas', () => {
    // The Basmalah is a prefix in the Tanzil file for these surahs, not a verse.
    // Each of them must start with 'qul' once the prefix is removed.
    for (const verses of [IKHLAS_VERSES, FALAQ_VERSES, NAS_VERSES]) {
      expect(verses[0].trimStart().startsWith('ق')).toBe(true);
      expect(verses.join(' ')).not.toContain(FATIHA_VERSES[0]);
    }
    expect(IKHLAS_VERSES.join(' ').split(' ')).toHaveLength(15);
    expect(FALAQ_VERSES.join(' ').split(' ')).toHaveLength(23);
    expect(NAS_VERSES.join(' ').split(' ')).toHaveLength(20);
  });

  it('holds the whole of Ayat al-Kursi (2:255) in one verse of 50 words', () => {
    expect(AYAT_AL_KURSI.split(' ')).toHaveLength(50);
    expect(valueOfText(AYAT_AL_KURSI, 'kabir', 'mashriqi').total).toBe(14021);
  });

  it('has a second opening verse only for Surah 42', () => {
    const withSecond = SURAH_OPENINGS.filter((entry) => entry.secondVerse);
    expect(withSecond).toHaveLength(1);
    expect(withSecond[0].number).toBe(42);
  });
});

describe('computeFawatih', () => {
  const forms = computeFawatih();

  it('finds 29 surahs in 14 forms', () => {
    expect(forms).toHaveLength(14);
    expect(forms.reduce((sum, form) => sum + form.surahs.length, 0)).toBe(29);
  });

  it('finds the exact known mapping', () => {
    const byForm = new Map(forms.map((form) => [form.form, form.surahs.map((s) => s.number)]));
    expect(byForm.get('الم')).toEqual([2, 3, 29, 30, 31, 32]);
    expect(byForm.get('المص')).toEqual([7]);
    expect(byForm.get('الر')).toEqual([10, 11, 12, 14, 15]);
    expect(byForm.get('المر')).toEqual([13]);
    expect(byForm.get('كهيعص')).toEqual([19]);
    expect(byForm.get('طه')).toEqual([20]);
    expect(byForm.get('طسم')).toEqual([26, 28]);
    expect(byForm.get('طس')).toEqual([27]);
    expect(byForm.get('يس')).toEqual([36]);
    expect(byForm.get('ص')).toEqual([38]);
    expect(byForm.get('حم')).toEqual([40, 41, 43, 44, 45, 46]);
    expect(byForm.get('حم عسق')).toEqual([42]);
    expect(byForm.get('ق')).toEqual([50]);
    expect(byForm.get('ن')).toEqual([68]);
  });

  it('does not pick up ordinary first words', () => {
    // Surah 71 opens with 'inna', Surah 75 with 'la' — both carry vowel marks
    // in the Uthmani text, so the bare-word rule must not count them.
    const surahNumbers = forms.flatMap((form) => form.surahs.map((s) => s.number));
    expect(surahNumbers).not.toContain(71);
    expect(surahNumbers).not.toContain(75);
    expect(surahNumbers).not.toContain(90);
    expect(surahNumbers).not.toContain(108);
  });
});

describe('computeSawaqit', () => {
  it('finds 21 letters present and the 7 known absent letters', () => {
    const { present, absent } = computeSawaqit();
    expect(present).toHaveLength(21);
    expect(absent.map((entry) => entry.letter)).toEqual(['ج', 'ز', 'ف', 'ش', 'ث', 'خ', 'ظ']);
  });

  it('counts the absent letters at 2,390 in Kabir Mashriqi and 2,990 in Kabir Maghribi', () => {
    const { absent } = computeSawaqit();
    expect(absent.reduce((total, entry) => total + entry.kabirMashriqi, 0)).toBe(2390);
    expect(absent.reduce((total, entry) => total + entry.kabirMaghribi, 0)).toBe(2990);
  });
});

describe('Shields running sums', () => {
  const expected = new Map<string, { kabirMashriqi: number; saghirMashriqi: number; kabirMaghribi: number; saghirMaghribi: number; words: number }>([
    ['fatiha', { kabirMashriqi: 11919, saghirMashriqi: 525, kabirMaghribi: 10219, saghirMaghribi: 526, words: 29 }],
    ['ikhlas', { kabirMashriqi: 1122, saghirMashriqi: 186, kabirMaghribi: 1062, saghirMaghribi: 180, words: 15 }],
    ['falaq', { kabirMashriqi: 9607, saghirMashriqi: 283, kabirMaghribi: 13027, saghirMaghribi: 274, words: 23 }],
    ['nas', { kabirMashriqi: 5483, saghirMashriqi: 335, kabirMaghribi: 8553, saghirMaghribi: 300, words: 20 }],
    ['kursi', { kabirMashriqi: 14021, saghirMashriqi: 719, kabirMaghribi: 16181, saghirMaghribi: 692, words: 50 }],
  ]);

  it('has five shield texts', () => {
    expect(SHIELD_TEXTS).toHaveLength(5);
    expect(SHIELD_TEXTS.map((text) => text.id)).toEqual(['fatiha', 'ikhlas', 'falaq', 'nas', 'kursi']);
  });

  it('matches the word-by-word totals to the whole-text totals in Kabir Mashriqi', () => {
    for (const text of SHIELD_TEXTS) {
      const joined = text.verses.join(' ');
      const { words, total } = shieldWordTotals(joined, 'kabir', 'mashriqi');
      const want = expected.get(text.id);
      expect(words).toHaveLength(want?.words);
      expect(total).toBe(want?.kabirMashriqi);
      // The word-by-word sums must add up to the whole text counted in one go.
      expect(total).toBe(valueOfText(joined, 'kabir', 'mashriqi').total);
      // The running total of the last word is the grand total.
      expect(words[words.length - 1].runningTotal).toBe(want?.kabirMashriqi);
      // Running totals never go down: every word counts a positive number.
      for (let i = 1; i < words.length; i += 1) {
        expect(words[i].runningTotal).toBeGreaterThan(words[i - 1].runningTotal);
      }
    }
  });

  it('matches the Saghir and Maghribi totals', () => {
    for (const text of SHIELD_TEXTS) {
      const joined = text.verses.join(' ');
      const want = expected.get(text.id);
      expect(shieldWordTotals(joined, 'saghir', 'mashriqi').total).toBe(want?.saghirMashriqi);
      expect(shieldWordTotals(joined, 'kabir', 'maghribi').total).toBe(want?.kabirMaghribi);
      expect(shieldWordTotals(joined, 'saghir', 'maghribi').total).toBe(want?.saghirMaghribi);
    }
  });

  it('matches the spot checks: Allah 66, plain Bismillah words 168', () => {
    expect(valueOfText('الله', 'kabir', 'mashriqi').total).toBe(66);
    expect(valueOfText('بسم الله', 'kabir', 'mashriqi').total).toBe(168);
  });

  it('shows the shadda difference honestly', () => {
    // The Uthmani spelling of al-Rahman, with its shadda, counts 529.
    // The plain spelling, without the shadda, counts 329. Both use the same
    // rules — the difference is the input text, and the page says so.
    expect(valueOfText('ٱلرَّحْمَٰنِ', 'kabir', 'mashriqi').total).toBe(529);
    expect(valueOfText('الرحمن', 'kabir', 'mashriqi').total).toBe(329);
  });
});
