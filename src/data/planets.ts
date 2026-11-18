/**
 * The seven classical planets, in Chaldean order.
 *
 * Sources (recorded here, per the study-tools plan):
 * - Chaldean order and day rulers: Wikipedia, "Planetary hours"
 *   (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon; Sunday is the
 *   Sun's day, Monday the Moon's, Tuesday Mars, Wednesday Mercury,
 *   Thursday Jupiter, Friday Venus, Saturday Saturn).
 * - Arabic names: Wiktionary, "Appendix:Planets" (Arabic:
 *   عطارد، الزهرة، المريخ، المشتري، زحل) and the al-Biruni list quoted
 *   there (الشمس for the Sun, القمر for the Moon).
 *
 * The Chaldean order is a traditional convention, not a modern
 * astronomical fact. Arabic strings are canonical Unicode (NFC).
 */

export type PlanetId =
  | 'saturn'
  | 'jupiter'
  | 'mars'
  | 'sun'
  | 'venus'
  | 'mercury'
  | 'moon';

export interface PlanetEntry {
  id: PlanetId;
  /** English name. */
  name: string;
  /** Arabic name, canonical Unicode (NFC). */
  arabic: string;
  /** Transliteration of the Arabic name. */
  transliteration: string;
  /** Position in the Chaldean order (0 = first). */
  chaldeanOrder: number;
  /** JS weekday number (0 = Sunday) this planet rules. */
  dayOfWeek: number;
  /** English name of the weekday this planet rules. */
  dayName: string;
}

/** The seven classical planets, listed in Chaldean order. */
export const PLANETS: PlanetEntry[] = [
  { id: 'saturn', name: 'Saturn', arabic: 'زحل', transliteration: 'Zuhal', chaldeanOrder: 0, dayOfWeek: 6, dayName: 'Saturday' },
  { id: 'jupiter', name: 'Jupiter', arabic: 'المشتري', transliteration: 'al-Mushtari', chaldeanOrder: 1, dayOfWeek: 4, dayName: 'Thursday' },
  { id: 'mars', name: 'Mars', arabic: 'المريخ', transliteration: 'al-Mirrikh', chaldeanOrder: 2, dayOfWeek: 2, dayName: 'Tuesday' },
  { id: 'sun', name: 'Sun', arabic: 'الشمس', transliteration: 'al-Shams', chaldeanOrder: 3, dayOfWeek: 0, dayName: 'Sunday' },
  { id: 'venus', name: 'Venus', arabic: 'الزهرة', transliteration: 'al-Zuhara', chaldeanOrder: 4, dayOfWeek: 5, dayName: 'Friday' },
  { id: 'mercury', name: 'Mercury', arabic: 'عطارد', transliteration: "'Utarid", chaldeanOrder: 5, dayOfWeek: 3, dayName: 'Wednesday' },
  { id: 'moon', name: 'Moon', arabic: 'القمر', transliteration: 'al-Qamar', chaldeanOrder: 6, dayOfWeek: 1, dayName: 'Monday' },
];

/** The Chaldean order: slowest- to fastest-moving, as seen in the sky. */
export const CHALDEAN_ORDER: PlanetId[] = [
  'saturn',
  'jupiter',
  'mars',
  'sun',
  'venus',
  'mercury',
  'moon',
];

/**
 * Which planet rules the first hour of each weekday.
 * Key is the JS weekday number (0 = Sunday). Source: Wikipedia,
 * "Planetary hours" — the first hour of Sunday is the Sun's, Monday
 * the Moon's, Tuesday Mars, Wednesday Mercury, Thursday Jupiter,
 * Friday Venus, Saturday Saturn.
 */
export const DAY_RULERS: Record<number, PlanetId> = {
  0: 'sun',
  1: 'moon',
  2: 'mars',
  3: 'mercury',
  4: 'jupiter',
  5: 'venus',
  6: 'saturn',
};

export function planetById(id: PlanetId): PlanetEntry {
  const found = PLANETS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown planet: ${id}`);
  return found;
}
