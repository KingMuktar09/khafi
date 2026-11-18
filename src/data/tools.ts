import type { Book } from '../types';

/**
 * The library's tools — pure logic, no React, no localStorage here,
 * so tests can check every rule against the real catalog.
 *
 * Rules:
 * - Every recommended / random / shelf book is a REAL book already in
 *   data/catalog.json. Nothing is invented.
 * - The Hijri date is the TABULAR (calculated) Islamic date. It can
 *   differ from the moon-sighting date by a day or two, so the UI
 *   always labels it "approximate". No prayer times are given.
 * - The Magic Square (wafq) tool is maths + history only: classic
 *   squares, verified by addition. No claim of supernatural power,
 *   no instructions to use a square for harm.
 * - Amals are general daily practice reminders. No specific Hadith
 *   is quoted and no count is given as a religious ruling.
 */

export type ShelfStatus = 'to-read' | 'reading' | 'finished';

export const SHELF_LABELS: Record<ShelfStatus, string> = {
  'to-read': 'To Read',
  reading: 'Reading',
  finished: 'Finished',
};

export type ShelfMap = Record<string, ShelfStatus>;

/** Books on the shelf, in the order they were saved (most recent first). */
export function shelfBooks(books: Book[], shelf: ShelfMap): Book[] {
  const byId = new Map(books.map((b) => [b.id, b]));
  return Object.keys(shelf)
    .map((id) => byId.get(id))
    .filter((b): b is Book => b !== undefined);
}

export function shelfCounts(shelf: ShelfMap): Record<ShelfStatus, number> {
  const counts: Record<ShelfStatus, number> = { 'to-read': 0, reading: 0, finished: 0 };
  for (const status of Object.values(shelf)) {
    if (status in counts) counts[status] += 1;
  }
  return counts;
}

// --- Hijri date (tabular Islamic calendar, approximate) ---------------------

export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Ula',
  'Jumada al-Akhirah',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhul-Qa'dah",
  'Dhul-Hijjah',
];

export interface HijriDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-30
  monthName: string;
  /** Always true: the tabular date can differ from the sighted date. */
  approximate: true;
}

/**
 * Gregorian -> Hijri by the standard tabular (Kuwaiti) algorithm.
 * Tabular dates can be 1-2 days off the moon-sighting date, so callers
 * must show the result as approximate.
 */
export function gregorianToHijri(date: Date): HijriDate {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const jd =
    Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
    Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4) +
    d -
    32075;
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day, monthName: HIJRI_MONTHS[month - 1], approximate: true };
}

export function formatHijri(h: HijriDate): string {
  return `${h.day} ${h.monthName} ${h.year} AH`;
}

// --- Visit streak ------------------------------------------------------------

/** Local date as YYYY-MM-DD, for visit-day records. */
export function toISODateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Consecutive days visited, ending today (or yesterday if the reader
 * has not visited yet today). 0 when there is no recent visit.
 */
export function computeStreak(visitDates: string[], today: Date = new Date()): number {
  const seen = new Set(visitDates);
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!seen.has(toISODateLocal(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (seen.has(toISODateLocal(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// --- Reading stats (local only) ----------------------------------------------

export interface ReadingStats {
  finished: number;
  inProgress: number;
  toRead: number;
  onShelf: number;
  journeysDone: number;
  journeyStepsDone: number;
  bookmarks: number;
  streakDays: number;
  totalVisits: number;
}

export function computeReadingStats(input: {
  shelf: ShelfMap;
  progress: Record<string, { percentage: number }>;
  bookmarks: Record<string, number[]>;
  journeyProgress: Record<string, string[]>;
  journeys: { id: string; total: number }[];
  visitDates: string[];
  today?: Date;
}): ReadingStats {
  const counts = shelfCounts(input.shelf);
  const bookmarks = Object.values(input.bookmarks).reduce((n, list) => n + list.length, 0);
  const journeyStepsDone = Object.values(input.journeyProgress).reduce((n, list) => n + list.length, 0);
  const journeysDone = input.journeys.filter(
    (j) => j.total > 0 && (input.journeyProgress[j.id] || []).length >= j.total
  ).length;
  return {
    finished: counts.finished,
    inProgress: Object.values(input.progress).filter((p) => p.percentage > 0 && p.percentage < 100).length,
    toRead: counts['to-read'],
    onShelf: Object.keys(input.shelf).length,
    journeysDone,
    journeyStepsDone,
    bookmarks,
    streakDays: computeStreak(input.visitDates, input.today),
    totalVisits: input.visitDates.length,
  };
}

// --- Random book / Surprise Me -----------------------------------------------

/** One real book at random. `rng` is injectable so tests can pin it. */
export function pickRandomBook(
  books: Book[],
  excludeId?: string | null,
  rng: () => number = Math.random
): Book | null {
  const visible = books.filter((b) => b.visible !== false);
  if (visible.length === 0) return null;
  const pool = visible.filter((b) => b.id !== excludeId);
  const list = pool.length > 0 ? pool : visible;
  return list[Math.floor(rng() * list.length)];
}

// --- Book Finder: "Find my next book" ----------------------------------------

export interface FinderMood {
  id: string;
  label: string;
  /** Category the mood maps to (exact category name in the catalog). */
  category: string;
  blurb: string;
}

export const FINDER_MOODS: FinderMood[] = [
  { id: 'sufism', label: 'Sufism', category: 'Sufism & Tasawwuf', blurb: 'Sufism is the spiritual side of Islam — the masters, the heart, and the path.' },
  { id: 'history', label: 'History', category: 'Islamic History', blurb: 'How Islam grew, and why empires rise and fall.' },
  { id: 'seerah', label: 'Seerah', category: 'Seerah & Prophets', blurb: 'The Prophets and the life of Muhammad (peace be upon him).' },
  { id: 'hadith', label: 'Hadith', category: 'Hadith', blurb: 'The sayings and practice of the Prophet, collected.' },
  { id: 'quran', label: 'Quran & Tafseer', category: 'Quran & Tafseer', blurb: 'The Quran itself, and how the scholars explained it.' },
  { id: 'hidden', label: 'Hidden Knowledge', category: 'Hidden Knowledge & Esoteric', blurb: 'Secrets, symbols, wonders, and hidden history.' },
  { id: 'soul', label: 'Soul & Afterlife', category: 'Soul, Death & Afterlife', blurb: 'The soul, death, Barzakh, and what comes after.' },
  { id: 'dreams', label: 'Dreams & the Unseen', category: 'Dreams & the Unseen', blurb: 'Dreams, their meanings, and the unseen world.' },
  { id: 'stories', label: 'Stories', category: 'Stories & Literature', blurb: 'Stories to get lost in — a thousand nights of them.' },
  { id: 'creation', label: 'Creation & the Universe', category: 'Creation & the Universe', blurb: 'How the world was made, and what it is made of.' },
];

export type FinderLevel = 'begin' | 'deep';
export type FinderFormat = 'any' | 'pdf' | 'notes';

export interface FinderAnswers {
  moodId: string;
  level: FinderLevel;
  format: FinderFormat;
}

export interface FinderPick {
  book: Book;
  /** Why this book, from its topic/category only — nothing invented. */
  reason: string;
}

/**
 * Recommend 3 real books for the reader's answers. The mood picks the
 * category; "begin" takes the first books in the library's arranged
 * order (foundational first), "deep" takes later ones in that order;
 * the format filter keeps PDFs or notes only. Reasons come only from
 * the book's own category and topic.
 */
export function recommendBooks(books: Book[], answers: FinderAnswers): FinderPick[] {
  const mood = FINDER_MOODS.find((m) => m.id === answers.moodId);
  if (!mood) return [];
  let pool = books.filter((b) => b.visible !== false && b.category === mood.category);
  if (answers.format === 'pdf') pool = pool.filter((b) => b.fileType === 'pdf');
  if (answers.format === 'notes') pool = pool.filter((b) => b.fileType !== 'pdf');
  if (pool.length === 0) return [];
  // Arranged order is already foundational-first (sortOrder), so keep
  // the catalog order: begin = first 3, deep = last 3.
  const picks = answers.level === 'deep' ? pool.slice(-3).reverse() : pool.slice(0, 3);
  return picks.map((book) => ({
    book,
    reason:
      `In ${book.category}` +
      (book.topic ? ` — ${book.topic}` : '') +
      (answers.level === 'begin'
        ? ', one of the first books in this category, a good place to start.'
        : ', a deeper book in this category, for when the basics are familiar.'),
  }));
}

// --- Magic Square Maker (Wafq) -----------------------------------------------

/** Source label for the wafq tool. */
export const SHAMS_SOURCE = 'Shams al-Ma‘arif — The Sun of Knowledge, translated by Amina Inloes (Revelore Press, 2021)';
/**
 * Honest source note: the catalog holds two Shams al-Ma'arif books —
 * "The Sun of Knowledge Al-Buni-Shams-Al-Ma-Arif" (the Amina Inloes
 * translation, Revelore Press 2021) and the manuscript
 * "Al-buni Shams-al-maarif-manuscript-1500". The squares below are the
 * classic, well-known magic squares of the wafq tradition.
 */
export const SHAMS_BOOK_TITLES = [
  'The Sun of Knowledge Al-Buni-Shams-Al-Ma-Arif',
  'Al-buni Shams-al-maarif-manuscript-1500',
];

/** The magic constant: every row, column and diagonal must sum to this. */
export function magicConstant(n: number): number {
  return (n * (n * n + 1)) / 2;
}

export type MagicSquare = number[][];

/** Classic 3x3 Lo Shu square — the oldest known magic square. */
export const LO_SHU: MagicSquare = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

/** Siamese method for odd sizes (3, 5, 7). */
function siamese(n: number): MagicSquare {
  const grid: MagicSquare = Array.from({ length: n }, () => Array<number>(n).fill(0));
  let row = 0;
  let col = Math.floor(n / 2);
  for (let num = 1; num <= n * n; num += 1) {
    grid[row][col] = num;
    const nextRow = (row - 1 + n) % n;
    const nextCol = (col + 1) % n;
    if (grid[nextRow][nextCol] !== 0) {
      row = (row + 1) % n;
    } else {
      row = nextRow;
      col = nextCol;
    }
  }
  return grid;
}

/** Standard 4x4 magic square (the classic Durer pattern). */
function fourByFour(): MagicSquare {
  return [
    [16, 3, 2, 13],
    [5, 10, 11, 8],
    [9, 6, 7, 12],
    [4, 15, 14, 1],
  ];
}

/** Make a magic square of size 3, 4, 5 or 7. Returns null for other sizes. */
export function generateMagicSquare(n: number): MagicSquare | null {
  if (n === 3 || n === 5 || n === 7) return siamese(n);
  if (n === 4) return fourByFour();
  return null;
}

export interface MagicCheck {
  constant: number;
  rowsOk: boolean;
  colsOk: boolean;
  diagsOk: boolean;
  allOk: boolean;
  rowSums: number[];
  colSums: number[];
  diagSums: number[];
  usesAllNumbers: boolean;
}

/** Verify a square: every row, column and diagonal sums to the constant,
 *  and it uses each number 1..n*n exactly once. */
export function verifyMagicSquare(grid: MagicSquare): MagicCheck {
  const n = grid.length;
  const constant = magicConstant(n);
  const rowSums = grid.map((row) => row.reduce((a, b) => a + b, 0));
  const colSums = grid[0].map((_, c) => grid.reduce((a, row) => a + row[c], 0));
  const diagSums = [
    grid.reduce((a, row, i) => a + row[i], 0),
    grid.reduce((a, row, i) => a + row[n - 1 - i], 0),
  ];
  const flat = grid.flat().sort((a, b) => a - b);
  const usesAllNumbers =
    flat.length === n * n && flat.every((v, i) => v === i + 1);
  const rowsOk = rowSums.every((s) => s === constant);
  const colsOk = colSums.every((s) => s === constant);
  const diagsOk = diagSums.every((s) => s === constant);
  return { constant, rowsOk, colsOk, diagsOk, allOk: rowsOk && colsOk && diagsOk && usesAllNumbers, rowSums, colSums, diagSums, usesAllNumbers };
}
