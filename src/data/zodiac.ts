/**
 * The 12 signs of the tropical zodiac.
 *
 * Source: Wikipedia, "Astrological sign" — the Western zodiac table
 * (12 signs, 30 degrees each, approximate Sun-sign dates, and the
 * element triplicities: Fire = Aries/Leo/Sagittarius, Earth =
 * Taurus/Virgo/Capricorn, Air = Gemini/Libra/Aquarius, Water =
 * Cancer/Scorpio/Pisces), checked 18 Nov 2026.
 *
 * CONVENTION: this is the TROPICAL zodiac — signs are measured from
 * the March equinox (0° Aries = the First Point of Aries), so they no
 * longer line up with the constellations of the same names. The dates
 * are approximate and shift a day or so from year to year, because the
 * equinox itself moves. Arabic names are canonical Unicode (NFC).
 * Element groupings are the traditional Western grouping from the
 * same source.
 */

export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water';

export interface ZodiacSign {
  /** 0-based index (0 = Aries). */
  index: number;
  /** English name. */
  name: string;
  /** Arabic name, canonical Unicode (NFC). */
  arabic: string;
  /** Transliteration of the Arabic name. */
  transliteration: string;
  /** Traditional element, per the source above. */
  element: ZodiacElement;
  /** Approximate start of the Sun's stay in this sign. */
  startMonth: number;
  startDay: number;
  /** Approximate end of the Sun's stay in this sign. */
  endMonth: number;
  endDay: number;
  /** Start of this sign's slice, in ecliptic degrees. */
  startLongitude: number;
  /** End of this sign's slice, in ecliptic degrees. */
  endLongitude: number;
  /** Human-readable approximate date range. */
  dateRange: string;
}

export const ZODIAC_SOURCE =
  'Wikipedia, "Astrological sign" (Western zodiac table), checked 18 Nov 2026';

export const ZODIAC_CONVENTION =
  'Tropical zodiac: signs are measured from the March equinox, so they no longer line up ' +
  'with the constellations of the same names. Dates are approximate and shift slightly year to year.';

function sign(
  index: number,
  name: string,
  arabic: string,
  transliteration: string,
  element: ZodiacElement,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
  dateRange: string,
): ZodiacSign {
  return {
    index,
    name,
    arabic,
    transliteration,
    element,
    startMonth,
    startDay,
    endMonth,
    endDay,
    startLongitude: index * 30,
    endLongitude: (index + 1) * 30,
    dateRange,
  };
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  sign(0, 'Aries', 'الحمل', 'al-Hamal', 'fire', 3, 21, 4, 20, '21 Mar – 20 Apr'),
  sign(1, 'Taurus', 'الثور', 'al-Thawr', 'earth', 4, 21, 5, 21, '21 Apr – 21 May'),
  sign(2, 'Gemini', 'الجوزاء', "al-Jawza'", 'air', 5, 22, 6, 21, '22 May – 21 Jun'),
  sign(3, 'Cancer', 'السرطان', 'al-Saratan', 'water', 6, 22, 7, 23, '22 Jun – 23 Jul'),
  sign(4, 'Leo', 'الأسد', 'al-Asad', 'fire', 7, 24, 8, 23, '24 Jul – 23 Aug'),
  sign(5, 'Virgo', 'العذراء', "al-'Adhra'", 'earth', 8, 24, 9, 23, '24 Aug – 23 Sep'),
  sign(6, 'Libra', 'الميزان', 'al-Mizan', 'air', 9, 24, 10, 23, '24 Sep – 23 Oct'),
  sign(7, 'Scorpio', 'العقرب', "al-'Aqrab", 'water', 10, 24, 11, 22, '24 Oct – 22 Nov'),
  sign(8, 'Sagittarius', 'القوس', 'al-Qaws', 'fire', 11, 23, 12, 21, '23 Nov – 21 Dec'),
  sign(9, 'Capricorn', 'الجدي', 'al-Jady', 'earth', 12, 22, 1, 20, '22 Dec – 20 Jan'),
  sign(10, 'Aquarius', 'الدلو', 'al-Dalw', 'air', 1, 21, 2, 19, '21 Jan – 19 Feb'),
  sign(11, 'Pisces', 'الحوت', 'al-Hut', 'water', 2, 20, 3, 20, '20 Feb – 20 Mar'),
];

/** The sign holding an ecliptic longitude (0–360, tropical). */
export function zodiacSignForLongitude(longitudeDeg: number): ZodiacSign {
  const norm = ((longitudeDeg % 360) + 360) % 360;
  const index = Math.floor(norm / 30);
  const found = ZODIAC_SIGNS[index];
  if (!found) throw new Error(`No zodiac sign at longitude ${longitudeDeg}`);
  return found;
}
