/**
 * Tests for the Latin transliteration shown on the Fawatih, Sawaqit and
 * Shields pages (see src/data/quranTexts.ts).
 *
 * Source: Tanzil Project, English Transliteration
 * (https://tanzil.net/trans/en.transliteration), downloaded 18 Nov 2026.
 * The file marks some letters with HTML tags (<u>, <b>, <i>); only the tags
 * are removed, the letters are kept as the file writes them. So the l of
 * 'al' stays written before sun letters (alrrahmani), AA is the letter ayn,
 * and th is the letter tha.
 *
 * These tests pin the data itself: every verse matches its Arabic verse
 * word for word, and the one fix to the source file (114:6) stays visible.
 * The expected strings were worked out independently against the downloaded
 * file with a script, not copied from the code under test.
 */
import { describe, expect, it } from 'vitest';
import {
  AYAT_AL_KURSI,
  AYAT_AL_KURSI_TRANSLITERATION,
  FALAQ_TRANSLITERATION,
  FALAQ_VERSES,
  FATIHA_TRANSLITERATION,
  FATIHA_VERSES,
  IKHLAS_TRANSLITERATION,
  IKHLAS_VERSES,
  NAS_TRANSLITERATION,
  NAS_VERSES,
  SHIELD_TEXTS,
  computeFawatih,
  shieldTransliterationWords,
  transliterateForm,
} from '../src/data/quranTexts';

const VERSE_SETS: Array<{ arabic: string[]; latin: string[][] }> = [
  { arabic: FATIHA_VERSES, latin: FATIHA_TRANSLITERATION },
  { arabic: IKHLAS_VERSES, latin: IKHLAS_TRANSLITERATION },
  { arabic: FALAQ_VERSES, latin: FALAQ_TRANSLITERATION },
  { arabic: NAS_VERSES, latin: NAS_TRANSLITERATION },
];

describe('Transliteration matches the Arabic verse by verse', () => {
  it('has the same verse count as the Arabic for every text', () => {
    for (const set of VERSE_SETS) {
      expect(set.latin).toHaveLength(set.arabic.length);
    }
    expect(AYAT_AL_KURSI_TRANSLITERATION).toHaveLength(50);
  });

  it('has the same word count as the Arabic in every verse (29 + 15 + 23 + 20 + 50 = 137 words)', () => {
    let total = 0;
    for (const set of VERSE_SETS) {
      for (let i = 0; i < set.arabic.length; i += 1) {
        const arabicWords = set.arabic[i].split(' ').filter((w) => w.length > 0).length;
        expect(set.latin[i]).toHaveLength(arabicWords);
        total += set.latin[i].length;
      }
    }
    expect(total).toBe(29 + 15 + 23 + 20);
    expect(AYAT_AL_KURSI_TRANSLITERATION).toHaveLength(AYAT_AL_KURSI.split(' ').length);
    expect(total + AYAT_AL_KURSI_TRANSLITERATION.length).toBe(137);
  });

  it('carries no HTML markup from the source file', () => {
    const all: string[] = [
      ...VERSE_SETS.flatMap((set) => set.latin.flat()),
      ...AYAT_AL_KURSI_TRANSLITERATION,
    ];
    for (const word of all) {
      expect(word).not.toMatch(/[<>]/);
      expect(word.length).toBeGreaterThan(0);
    }
  });

  it('matches the spot checks: the Basmalah, 112:1, and the ends of Ayat al-Kursi', () => {
    expect(FATIHA_TRANSLITERATION[0].join(' ')).toBe('Bismi Allahi alrrahmani alrraheemi');
    expect(IKHLAS_TRANSLITERATION[0].join(' ')).toBe('Qul huwa Allahu ahadun');
    expect(FATIHA_TRANSLITERATION[6].join(' ')).toBe(
      'Sirata allatheena anAAamta AAalayhim ghayri almaghdoobi AAalayhim wala alddalleena',
    );
    expect(AYAT_AL_KURSI_TRANSLITERATION.slice(0, 3).join(' ')).toBe('Allahu la ilaha');
    expect(AYAT_AL_KURSI_TRANSLITERATION.slice(-3).join(' ')).toBe('wahuwa alAAaliyyu alAAatheemu');
  });

  it('stores the 114:6 fix, not the typo in the source file', () => {
    // The Tanzil file's line for 114:6 reads 'Mina aljinnati wa alnnasm':
    // four tokens, ending in 'm'. The Arabic verse has three words, and the
    // same file writes 'alnnasi' for 114:1-3. The stored line is the fix.
    expect(NAS_TRANSLITERATION[5].join(' ')).toBe('Mina aljinnati waalnnasi');
    expect(NAS_TRANSLITERATION[5]).toHaveLength(3);
  });
});

describe('transliterateForm', () => {
  it('reads every one of the 14 forms in letter names', () => {
    const forms = computeFawatih();
    expect(forms).toHaveLength(14);
    const byForm = new Map(forms.map((form) => [form.form, transliterateForm(form.form)]));
    expect(byForm.get('الم')).toBe('Alif Lam Mim');
    expect(byForm.get('المص')).toBe('Alif Lam Mim Sad');
    expect(byForm.get('الر')).toBe('Alif Lam Ra');
    expect(byForm.get('المر')).toBe('Alif Lam Mim Ra');
    expect(byForm.get('كهيعص')).toBe('Kaf Haa Ya Ayn Sad');
    expect(byForm.get('طه')).toBe('Taa Haa');
    expect(byForm.get('طسم')).toBe('Taa Sin Mim');
    expect(byForm.get('طس')).toBe('Taa Sin');
    expect(byForm.get('يس')).toBe('Ya Sin');
    expect(byForm.get('ص')).toBe('Sad');
    expect(byForm.get('حم')).toBe('Ha Mim');
    expect(byForm.get('حم عسق')).toBe('Ha Mim, Ayn Sin Qaf');
    expect(byForm.get('ق')).toBe('Qaf');
    expect(byForm.get('ن')).toBe('Nun');
  });

  it('never leaves a letter unread', () => {
    for (const form of computeFawatih()) {
      const said = transliterateForm(form.form);
      expect(said.length).toBeGreaterThan(0);
      expect(said).not.toMatch(/[؀-ۿ]/);
    }
  });
});

describe('shieldTransliterationWords', () => {
  it('gives one Latin word per Arabic word for all five shield texts', () => {
    for (const text of SHIELD_TEXTS) {
      const arabicWords = text.verses.join(' ').split(' ').filter((w) => w.length > 0).length;
      expect(shieldTransliterationWords(text.id)).toHaveLength(arabicWords);
    }
  });
});
