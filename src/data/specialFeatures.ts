import type { Book, SiteLanguage } from '../types';
import { t } from './i18n';

/**
 * The library's special features — what no normal library has.
 *
 * Rules this file lives by:
 * - Every journey step and every timeline entry points at a REAL book
 *   already in data/catalog.json, matched by exact title. Nothing invented.
 * - Wisdom of the Day is a short TEACHING SUMMARY, not a verbatim quote:
 *   no Quran verse and no Hadith is quoted here, so nothing can be
 *   misquoted. Each entry names the master and the real book it comes from.
 * - Timeline dates are centuries only (e.g. "9th century"), the commonly
 *   known era of each master — no invented exact years.
 */

export interface JourneyStep {
  /** Exact title in data/catalog.json. */
  title: string;
  /** Why this step comes here, in plain words. */
  note: string;
}

export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  steps: JourneyStep[];
}

export const JOURNEYS: Journey[] = [
  {
    id: 'seekers-path',
    title: "The Seeker's Path",
    subtitle: 'Sufism, step by step',
    description:
      'Start with knowledge and belief, then walk the Sufi path: what the masters taught, how the heart travels, and the stories that carry it.',
    level: 'Begin here',
    steps: [
      { title: 'knowledge vol.1', note: 'Step 1 — Knowledge first. Ghazali opens the Ihya with knowledge: learn before you act.' },
      { title: 'itqad vol. 2', note: 'Step 2 — Belief. The foundations of faith, so the path stands on something firm.' },
      { title: 'The Sufi Path Of Knowledge - William C. Chittick', note: 'Step 3 — What the Sufi path actually is, explained through Ibn Arabi.' },
      { title: 'The Journey to the Lord of Power by Muhammad ibn-Arabi', note: 'Step 4 — Ibn Arabi himself, on the journey to God.' },
      { title: 'The Station of no Station Open Secrets of the Sufis', note: 'Step 5 — The stations of the path, and the station beyond stations.' },
      { title: 'The Teachings of a Sufi Master', note: 'Step 6 — A master speaks directly: the teaching, in his own words.' },
      { title: 'Farid ud-Din Attar - The Conference of the Birds', note: 'Step 7 — The great Sufi story: the birds search for their king, and find themselves.' },
      { title: 'Masnavi-complete', note: 'Step 8 — Rumi. The Masnavi is the companion for the rest of the road.' },
    ],
  },
  {
    id: 'ibn-arabi',
    title: 'The Ibn Arabi Journey',
    subtitle: 'The Greatest Master',
    description:
      'One master, in depth. Read Ibn Arabi himself, then the book that explains his idea of the unity of being, then the wider world of Sufi thought around him.',
    level: 'Deep dive',
    steps: [
      { title: 'The Journey to the Lord of Power by Muhammad ibn-Arabi', note: 'Step 1 — Begin with Ibn Arabi in his own words: a short journey, not a long one.' },
      { title: 'The Bezels of Wisdom Paulist-1980 by Ibn Arabi', note: 'Step 2 — His most famous book: wisdom through the prophets, one bezel at a time.' },
      { title: 'WAHDAT AL WUJUD DALAM PEMIKIRAN IBNU ARABI', note: 'Step 3 — Wahdat al-wujud, the unity of being, as Ibn Arabi thought it.' },
      { title: 'The Sufi Path Of Knowledge - William C. Chittick', note: 'Step 4 — A clear modern guide to Ibn Arabi, so the hard parts make sense.' },
      { title: 'The Mystical Dimensions of islam', note: 'Step 5 — Step back and see where Ibn Arabi sits in the whole Sufi tradition.' },
    ],
  },
  {
    id: 'hidden-knowledge',
    title: 'The Hidden Knowledge Journey',
    subtitle: 'Secrets, symbols and wonders',
    description:
      'The side of the library other libraries do not have. Start with the great book of secrets, then the books of wonders, symbols, and the hidden history of orders and powers.',
    level: 'For the curious',
    steps: [
      { title: 'The Secret Teachings of All-ages Manly phall', note: 'Step 1 — The classic book of secret teachings, symbols and ancient wisdom.' },
      { title: 'The Sun of Knowledge Al-Buni-Shams-Al-Ma-Arif', note: 'Step 2 — Shams al-Ma\'arif: al-Buni on the hidden properties of letters and names.' },
      { title: 'Kitab Al Bulhan', note: 'Step 3 — The Book of Wonders: strange and marvellous images from the old manuscripts.' },
      { title: 'The Book of Wonders', note: 'Step 4 — The wonders continue: the manuscript tradition of marvels.' },
      { title: 'Book of Symbolism by Harry B.Joseph', note: 'Step 5 — Learn to read symbols, so the old books stop looking like decoration.' },
      { title: 'The Templars - Dan Jones', note: 'Step 6 — From symbols to history: the Templars, the most famous secret order.' },
      { title: 'Born in Blood The Lost Secrets of Freemasonry ( PDFDrive.com )', note: 'Step 7 — The hidden history of Freemasonry, and where its secrets came from.' },
    ],
  },
  {
    id: 'seerah-history',
    title: 'The Seerah & History Journey',
    subtitle: 'From the Prophets to the historians',
    description:
      'Read history the way the old scholars wrote it: the Prophets first, then the life of Muhammad (peace be upon him), then the caliphs, then the historians who tried to explain it all.',
    level: 'History',
    steps: [
      { title: 'Stories Of The Prophets By Ibn Kathir', note: 'Step 1 — The Prophets, one story after another, as Ibn Kathir told them.' },
      { title: 'The Life Of The Prophet Muhammad Volume 1', note: 'Step 2 — The Seerah begins: the life of the Prophet, volume 1.' },
      { title: 'The Life Of The Prophet Muhammad Volume 2', note: 'Step 3 — The Seerah continues: volume 2.' },
      { title: 'Al Sira al Nabawiyya By Ibn Kathir-All Volumes in One pdf', note: 'Step 4 — Ibn Kathir\'s full Seerah, all volumes in one place.' },
      { title: 'The History Of The Khalifahs', note: 'Step 5 — After the Prophet: the caliphs who carried Islam forward.' },
      { title: 'The Muqaddimah An Introduction to History by Ibn Khaldun', note: 'Step 6 — Ibn Khaldun asks the big question: why do empires rise and fall?' },
      { title: 'en Tabari Volume 01', note: 'Step 7 — Tabari, the greatest historian: the history of the world, from the beginning.' },
    ],
  },
  {
    id: 'soul-afterlife',
    title: 'The Soul & Afterlife Journey',
    subtitle: 'Death, Barzakh and what comes after',
    description:
      'The questions everyone asks, in order. What is the soul? What happens after death? What are the signs before the end, and the great trials?',
    level: 'Reflective',
    steps: [
      { title: '7 Stages of Nafs', note: 'Step 1 — Start with the soul itself: its seven stages, from the commanding self to the contented one.' },
      { title: "The Soul's Journey After Death - Ibn al Qayyim", note: 'Step 2 — Ibn al-Qayyim on the soul\'s journey after death.' },
      { title: 'Signs Before Qiyamat by Ibn Kathir', note: 'Step 3 — The signs before the end, as Ibn Kathir collected them.' },
      { title: 'Book of The End Great Trials and Tribulations', note: 'Step 4 — The great trials before the end, and what they mean.' },
      { title: 'Dajjal The False Messiah', note: 'Step 5 — The Dajjal, the false messiah of the end times.' },
    ],
  },
];

export interface ResolvedJourneyStep extends JourneyStep {
  book?: Book;
}

export interface ResolvedJourney extends Omit<Journey, 'steps'> {
  steps: ResolvedJourneyStep[];
}

/** Match every journey step to its real book by exact title. */
export function resolveJourneys(books: Book[]): ResolvedJourney[] {
  const byTitle = new Map(books.map((b) => [b.title, b]));
  return JOURNEYS.map((j) => ({
    ...j,
    steps: j.steps.map((s) => ({ ...s, book: byTitle.get(s.title) })),
  }));
}

/** Journey progress, saved on this device: done step titles per journey. */
export function journeyProgress(done: string[], journey: Journey): number {
  if (journey.steps.length === 0) return 0;
  const doneSet = new Set(done);
  const n = journey.steps.filter((s) => doneSet.has(s.title)).length;
  return Math.round((n / journey.steps.length) * 100);
}

/**
 * A journey with its title, subtitle, description and level in the
 * given language. Step notes stay as written: they are shown on the
 * Journeys page, not on Home. Generic so a resolved journey keeps
 * its matched books. Missing keys fall back to English via t().
 */
export function localizeJourney<T extends Journey>(journey: T, lang: SiteLanguage): T {
  const base = `specials.journey.${journey.id}`;
  return {
    ...journey,
    title: t(`${base}.title`, lang),
    subtitle: t(`${base}.subtitle`, lang),
    description: t(`${base}.description`, lang),
    level: t(`${base}.level`, lang),
  };
}

// --- Wisdom of the Day -------------------------------------------------------

export interface Wisdom {
  /** A short teaching summary in plain words — NOT a verbatim quote. */
  teaching: string;
  master: string;
  /** Exact title of a real book in the catalog. */
  sourceTitle: string;
  /** What the teaching is about, for the reader. */
  about: string;
}

export const WISDOMS: Wisdom[] = [
  {
    teaching: 'Learn before you act: knowledge is the light that keeps worship and daily life on the right road.',
    master: 'Imam al-Ghazali',
    sourceTitle: 'knowledge vol.1',
    about: 'From the Ihya Ulum al-Din — knowledge comes first.',
  },
  {
    teaching: 'The seeker travels inward: the road to God is walked through the heart, not only with the feet.',
    master: 'Ibn Arabi',
    sourceTitle: 'The Journey to the Lord of Power by Muhammad ibn-Arabi',
    about: 'Ibn Arabi on the inner journey.',
  },
  {
    teaching: 'Do not settle for hearing about the truth — the birds in the story had to fly the road themselves.',
    master: 'Farid ud-Din Attar',
    sourceTitle: 'Farid ud-Din Attar - The Conference of the Birds',
    about: 'Attar: the search is the teaching.',
  },
  {
    teaching: 'The soul is a traveller: this world is one stop on its journey, not its home.',
    master: 'Ibn al-Qayyim',
    sourceTitle: "The Soul's Journey After Death - Ibn al Qayyim",
    about: 'Ibn al-Qayyim on the soul after death.',
  },
  {
    teaching: 'History repeats its patterns: empires rise when people hold together, and fall when they let go.',
    master: 'Ibn Khaldun',
    sourceTitle: 'The Muqaddimah An Introduction to History by Ibn Khaldun',
    about: 'Ibn Khaldun on why civilisations rise and fall.',
  },
  {
    teaching: 'The stories of the Prophets are not only history — they are lessons for anyone facing hardship today.',
    master: 'Ibn Kathir',
    sourceTitle: 'Stories Of The Prophets By Ibn Kathir',
    about: 'Ibn Kathir: the Prophets as teachers.',
  },
  {
    teaching: 'Love turns the heart toward what it seeks; the Masnavi teaches through stories, not lectures.',
    master: 'Rumi',
    sourceTitle: 'Masnavi-complete',
    about: 'Rumi on love and the path.',
  },
];

/** One wisdom per day: same all day, changes with the date (day-of-year). */
export function getWisdomForDate(date: Date): Wisdom {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return WISDOMS[dayOfYear % WISDOMS.length];
}

/**
 * One wisdom entry with its teaching and about lines in the given
 * language. The master name and the source book title never change.
 */
export function localizeWisdom(wisdom: Wisdom, lang: SiteLanguage): Wisdom {
  const index = WISDOMS.indexOf(wisdom);
  if (index < 0) return wisdom;
  const base = `specials.wisdom.${index}`;
  return { ...wisdom, teaching: t(`${base}.teaching`, lang), about: t(`${base}.about`, lang) };
}

/** The wisdom for a date, already in the given language. */
export function getLocalizedWisdomForDate(date: Date, lang: SiteLanguage): Wisdom {
  return localizeWisdom(getWisdomForDate(date), lang);
}

// --- Knowledge Map / Timeline -----------------------------------------------

export interface TimelineMaster {
  name: string;
  /** Century only — the commonly known era, no invented exact years. */
  era: string;
  /** Sort key: the century number, for chronological order. */
  century: number;
  role: string;
  /** Exact titles of real books in the catalog. */
  bookTitles: string[];
}

export const TIMELINE_MASTERS: TimelineMaster[] = [
  { name: 'Imam al-Bukhari', era: '9th century', century: 9, role: 'Hadith master — compiler of Sahih al-Bukhari', bookTitles: ['Sahih al-Bukhari Vol. 1 - 1-875'] },
  { name: 'Imam Muslim', era: '9th century', century: 9, role: 'Hadith master — compiler of Sahih Muslim', bookTitles: ['Sahih Muslim Vol. 1 - 1-1160 English Arabic'] },
  { name: 'Imam al-Tabari', era: '9th–10th century', century: 9, role: 'Historian and scholar of Tafseer', bookTitles: ['en Tabari Volume 01'] },
  { name: 'Ibn Hisham', era: '9th century', century: 9, role: 'Biographer of the Prophet', bookTitles: ['Sirat Ibn Hisham in Bengali'] },
  { name: 'Imam al-Ghazali', era: '11th–12th century', century: 11, role: 'Theologian and Sufi — author of the Ihya', bookTitles: ['knowledge vol.1', 'worship vol. 4'] },
  { name: 'Farid ud-Din Attar', era: '12th–13th century', century: 12, role: 'Sufi poet — The Conference of the Birds', bookTitles: ['Farid ud-Din Attar - The Conference of the Birds'] },
  { name: 'Ibn Arabi', era: '12th–13th century', century: 12, role: 'The Greatest Master of Sufism', bookTitles: ['The Bezels of Wisdom Paulist-1980 by Ibn Arabi', 'The Journey to the Lord of Power by Muhammad ibn-Arabi'] },
  { name: 'Rumi', era: '13th century', century: 13, role: 'Sufi poet — the Masnavi', bookTitles: ['Masnavi-complete'] },
  { name: 'Imam al-Nawawi', era: '13th century', century: 13, role: 'Hadith scholar — the Forty Hadith', bookTitles: ['Imam-Nawawis-40-Hadith-Text'] },
  { name: 'Ibn Kathir', era: '14th century', century: 14, role: 'Historian and scholar of Tafseer', bookTitles: ['Tafsir Ibn Kathir - Volume 01-10 - English', 'Stories Of The Prophets By Ibn Kathir'] },
  { name: 'Ibn Khaldun', era: '14th century', century: 14, role: 'Historian — the Muqaddimah', bookTitles: ['The Muqaddimah An Introduction to History by Ibn Khaldun'] },
  { name: 'Ibn al-Qayyim', era: '14th century', century: 14, role: 'Scholar of the soul and the heart', bookTitles: ["The Soul's Journey After Death - Ibn al Qayyim"] },
];

export function getTimeline(): TimelineMaster[] {
  return [...TIMELINE_MASTERS].sort((a, b) => a.century - b.century || a.name.localeCompare(b.name));
}
