/**
 * The 28 lunar mansions (manazil al-qamar, منازل القمر).
 *
 * Source: Wikipedia, "Lunar mansion" — the manazil al-qamar table
 * (28 stations, starting with al-Sharatayn at 0°), checked 18 Nov 2026.
 * Every name below was checked against that table; alternate names in
 * the table (al-Nath, al-Tarfah, al-Kharatan, al-Simak al-A'zal,
 * Fargh al-Dalw al-Muqaddam / al-Mu'akhkhar, Batn al-Hut) are kept as
 * alternates. Arabic strings are canonical Unicode (NFC) — written
 * out, never pasted from a PDF.
 *
 * CONVENTION (not a universal fact): the ecliptic is divided into 28
 * equal parts of 360/28 = about 12.857 degrees, starting at 0° with
 * al-Sharatayn. Other traditions start the count elsewhere. The start
 * point is a parameter (see getMansion in src/utils/astronomy.ts),
 * and the UI must say this is a convention.
 */

export interface MansionEntry {
  /** 0-based index (0 = al-Sharatayn). */
  index: number;
  /** Common transliterated name. */
  name: string;
  /** Arabic name, canonical Unicode (NFC). */
  arabic: string;
  /** Alternate traditional name, where the source lists one. */
  alternateName?: string;
  /** Arabic of the alternate name. */
  alternateArabic?: string;
  /** Start of this mansion's slice, in ecliptic degrees. */
  startDeg: number;
  /** End of this mansion's slice, in ecliptic degrees. */
  endDeg: number;
}

/** Degrees per mansion: 360 / 28. */
export const MANSION_SIZE_DEG = 360 / 28;

export const MANSION_SOURCE =
  'Wikipedia, "Lunar mansion" (manazil al-qamar table), checked 18 Nov 2026';

export const MANSION_CONVENTION =
  '28 equal parts of about 12.857 degrees, starting at 0 degrees with al-Sharatayn. ' +
  'This is a convention, not a universal fact; other traditions start the count elsewhere.';

function entry(
  index: number,
  name: string,
  arabic: string,
  alternateName?: string,
  alternateArabic?: string,
): MansionEntry {
  return {
    index,
    name,
    arabic,
    alternateName,
    alternateArabic,
    startDeg: index * MANSION_SIZE_DEG,
    endDeg: (index + 1) * MANSION_SIZE_DEG,
  };
}

export const MANSIONS: MansionEntry[] = [
  entry(0, 'al-Sharatayn', 'الشرطان', 'al-Nath', 'النطح'),
  entry(1, 'al-Butayn', 'البطين'),
  entry(2, 'al-Thurayya', 'الثريا'),
  entry(3, 'al-Dabaran', 'الدبران'),
  entry(4, "al-Haq'ah", 'الهقعة'),
  entry(5, "al-Han'ah", 'الهنعة'),
  entry(6, "al-Dhira'", 'الذراع'),
  entry(7, 'al-Nathrah', 'النثرة'),
  entry(8, 'al-Tarf', 'الطرف', 'al-Tarfah', 'الطرفة'),
  entry(9, 'al-Jabhah', 'الجبهة'),
  entry(10, 'al-Zubrah', 'الزبرة', 'al-Kharatan', 'الخراتان'),
  entry(11, 'al-Sarfah', 'الصرفة'),
  entry(12, "al-'Awwa'", 'العواء'),
  entry(13, 'al-Simak', 'السماك', "al-Simak al-A'zal", 'السماك الأعزل'),
  entry(14, 'al-Ghafr', 'الغفر'),
  entry(15, 'al-Zubana', 'الزبانى'),
  entry(16, 'al-Iklil', 'الإكليل'),
  entry(17, 'al-Qalb', 'القلب'),
  entry(18, 'al-Shawlah', 'الشولة'),
  entry(19, "al-Na'a'im", 'النعائم'),
  entry(20, 'al-Baldah', 'البلدة'),
  entry(21, "Sa'd al-Dhabih", 'سعد الذابح'),
  entry(22, "Sa'd al-Bula'", 'سعد البلع'),
  entry(23, "Sa'd al-Su'ud", 'سعد السعود'),
  entry(24, "Sa'd al-Akhbiyah", 'سعد الأخبية'),
  entry(25, 'al-Muqaddam', 'المقدم', 'Fargh al-Dalw al-Muqaddam', 'فرغ الدلو المقدم'),
  entry(26, "al-Mu'akhkhar", 'المؤخر', "Fargh al-Dalw al-Mu'akhkhar", 'فرغ الدلو المؤخر'),
  entry(27, "al-Rasha'", 'الرشاء', 'Batn al-Hut', 'بطن الحوت'),
];

export function mansionByIndex(index: number): MansionEntry {
  const found = MANSIONS[index];
  if (!found) throw new Error(`No lunar mansion at index ${index}`);
  return found;
}
