// Abjad (Hisab al-Jumal) core: letter values, normalization, and totals.
//
// Tables verified 18 Nov 2026 against:
// - Wikipedia, "Abjad numerals" (https://en.wikipedia.org/wiki/Abjad_numerals):
//   Mashriqi values (alif 1 ... ghayn 1000) and the Maghrebian order, in which
//   six letters differ: sad 60, dad 90, sin 300, za 800, ghayn 900, shin 1000.
// - OpenArabic abjad calculator (https://openarabic.org/abjad-calculator/),
//   which lists the same six Maghribi changes and cites the same Wikipedia
//   tables and Frank Lewis's overview of the abjad system.
// - WiserWork abjad calculator (https://wiserwork.org/fun-math-tools/abjad-calculator/),
//   same six differences.
// The two orders agree on the other 22 letters.
//
// Study-only note: abjad values are a traditional study of letters. They
// make no promise about outcomes, and this module gives no religious rulings.

export type AbjadSystem = 'kabir' | 'saghir';
export type AbjadSchool = 'mashriqi' | 'maghribi';

export interface AbjadLetter {
  letter: string;
  name: string;
  kabirMashriqi: number;
  kabirMaghribi: number;
}

/** The 28 Arabic letters in abjad order, with kabir values for both schools. */
export const ABJAD_LETTERS: AbjadLetter[] = [
  { letter: 'ا', name: 'Alif', kabirMashriqi: 1, kabirMaghribi: 1 },
  { letter: 'ب', name: 'Ba', kabirMashriqi: 2, kabirMaghribi: 2 },
  { letter: 'ج', name: 'Jim', kabirMashriqi: 3, kabirMaghribi: 3 },
  { letter: 'د', name: 'Dal', kabirMashriqi: 4, kabirMaghribi: 4 },
  { letter: 'ه', name: 'Haa', kabirMashriqi: 5, kabirMaghribi: 5 },
  { letter: 'و', name: 'Waw', kabirMashriqi: 6, kabirMaghribi: 6 },
  { letter: 'ز', name: 'Zay', kabirMashriqi: 7, kabirMaghribi: 7 },
  { letter: 'ح', name: 'Ha', kabirMashriqi: 8, kabirMaghribi: 8 },
  { letter: 'ط', name: 'Taa', kabirMashriqi: 9, kabirMaghribi: 9 },
  { letter: 'ي', name: 'Ya', kabirMashriqi: 10, kabirMaghribi: 10 },
  { letter: 'ك', name: 'Kaf', kabirMashriqi: 20, kabirMaghribi: 20 },
  { letter: 'ل', name: 'Lam', kabirMashriqi: 30, kabirMaghribi: 30 },
  { letter: 'م', name: 'Mim', kabirMashriqi: 40, kabirMaghribi: 40 },
  { letter: 'ن', name: 'Nun', kabirMashriqi: 50, kabirMaghribi: 50 },
  { letter: 'س', name: 'Sin', kabirMashriqi: 60, kabirMaghribi: 300 },
  { letter: 'ع', name: 'Ayn', kabirMashriqi: 70, kabirMaghribi: 70 },
  { letter: 'ف', name: 'Fa', kabirMashriqi: 80, kabirMaghribi: 80 },
  { letter: 'ص', name: 'Sad', kabirMashriqi: 90, kabirMaghribi: 60 },
  { letter: 'ق', name: 'Qaf', kabirMashriqi: 100, kabirMaghribi: 100 },
  { letter: 'ر', name: 'Ra', kabirMashriqi: 200, kabirMaghribi: 200 },
  { letter: 'ش', name: 'Shin', kabirMashriqi: 300, kabirMaghribi: 1000 },
  { letter: 'ت', name: 'Ta', kabirMashriqi: 400, kabirMaghribi: 400 },
  { letter: 'ث', name: 'Tha', kabirMashriqi: 500, kabirMaghribi: 500 },
  { letter: 'خ', name: 'Kha', kabirMashriqi: 600, kabirMaghribi: 600 },
  { letter: 'ذ', name: 'Dhal', kabirMashriqi: 700, kabirMaghribi: 700 },
  { letter: 'ض', name: 'Dad', kabirMashriqi: 800, kabirMaghribi: 90 },
  { letter: 'ظ', name: 'Zaa', kabirMashriqi: 900, kabirMaghribi: 800 },
  { letter: 'غ', name: 'Ghayn', kabirMashriqi: 1000, kabirMaghribi: 900 },
];

/**
 * Plain-English list of the normalization choices made by normalizeArabic,
 * for display to users.
 */
export const NORMALIZATION_RULES: string[] = [
  'Text is first put into Unicode NFC form, so a letter typed as separate parts (for example alif plus a hamza mark above it) becomes one single letter.',
  'Tatweel (the stretch mark) and all vowel marks are removed: fatha, damma, kasra, sukun, tanwin, superscript alef, and similar marks.',
  'Hamza forms are unified: أ, إ, آ, ٱ, and a standalone hamza ء all become ا; ؤ becomes و; ئ becomes ي.',
  'Ta marbuta ة is read as ه. This is a choice made by this tool, not a universal rule.',
  'Alif maqsura ى is read as ي.',
  'A shadda doubles the letter it sits on, so that letter counts twice. If the letter is already written twice, as the two lams in الله, the shadda adds no third letter, so الله still totals 66.',
  'Spaces, punctuation, and non-Arabic letters are ignored: they are not counted and do not appear in the letter list.',
];

const TATWEEL = 'ـ'; // U+0640
const SHADDA = 'ّ'; // U+0651
const SUPERSCRIPT_ALEF = 'ٰ'; // U+0670

/** Single-letter replacements applied during normalization. */
const LETTER_MAP: Record<string, string> = {
  'أ': 'ا', // U+0623 alef with hamza above
  'إ': 'ا', // U+0625 alef with hamza below
  'آ': 'ا', // U+0622 alef with madda
  'ٱ': 'ا', // U+0671 alef wasla
  'ء': 'ا', // U+0621 standalone hamza (hamza and alif share the value 1)
  'ؤ': 'و', // U+0624 waw with hamza
  'ئ': 'ي', // U+0626 yeh with hamza
  'ة': 'ه', // U+0629 ta marbuta -> ha (a choice, see NORMALIZATION_RULES)
  'ى': 'ي', // U+0649 alef maksura -> yeh
};

/** Arabic combining marks (harakat, sukun, tanwin, and similar) to strip. */
function isCombiningMark(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (
    (code >= 0x064b && code <= 0x065f) || // fatha, damma, kasra, shadda, sukun, madda, etc.
    (code >= 0x06d6 && code <= 0x06dc) || // Quranic annotation marks
    code === 0x0670 // superscript alef
  );
}

const ABJAD_SET = new Set(ABJAD_LETTERS.map((entry) => entry.letter));

/**
 * Normalize Arabic text to plain abjad letters: NFC, hamza/ta-marbuta/
 * alif-maqsura unified, tatweel and vowel marks removed, shadda expanded
 * into a repeat of its letter, and everything else dropped.
 */
export function normalizeArabic(input: string): string {
  const nfc = input.normalize('NFC');
  const out: string[] = [];
  for (const ch of nfc) {
    if (ch === SHADDA) {
      // A shadda doubles the preceding letter. If that letter is already
      // written twice in a row (the two lams of الله), the doubling is
      // already written, so the shadda adds nothing.
      const last = out[out.length - 1];
      const beforeLast = out[out.length - 2];
      if (last !== undefined && last !== beforeLast) {
        out.push(last);
      }
      continue;
    }
    if (ch === TATWEEL || ch === SUPERSCRIPT_ALEF || isCombiningMark(ch)) {
      continue;
    }
    const mapped = LETTER_MAP[ch] ?? ch;
    // Keep only the 28 abjad letters; spaces, punctuation, and
    // non-Arabic letters are ignored.
    if (ABJAD_SET.has(mapped)) {
      out.push(mapped);
    }
  }
  return out.join('');
}

/** Digit-sum reduction: 1000 -> 1, 900 -> 9, 90 -> 9, 300 -> 3, 60 -> 6, 10 -> 1. */
export function saghirOf(kabir: number): number {
  if (kabir <= 0) return 0;
  let n = kabir;
  while (n >= 10) {
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;
  }
  return n;
}

/**
 * Value of one letter, or null if it is not one of the 28 abjad letters.
 * A hamza form, ta marbuta, or alif maqsura is read as its plain letter.
 */
export function letterValue(
  letter: string,
  system: AbjadSystem,
  school: AbjadSchool,
): number | null {
  const normalized = normalizeArabic(letter);
  const entry = ABJAD_LETTERS.find((item) => item.letter === normalized);
  if (!entry) return null;
  const kabir = school === 'mashriqi' ? entry.kabirMashriqi : entry.kabirMaghribi;
  return system === 'kabir' ? kabir : saghirOf(kabir);
}

/** Total value of a text, with the per-letter breakdown. */
export function valueOfText(
  text: string,
  system: AbjadSystem,
  school: AbjadSchool,
): { total: number; letters: Array<{ letter: string; value: number }> } {
  const letters: Array<{ letter: string; value: number }> = [];
  let total = 0;
  for (const letter of normalizeArabic(text)) {
    const value = letterValue(letter, system, school);
    if (value === null) continue;
    letters.push({ letter, value });
    total += value;
  }
  return { total, letters };
}
