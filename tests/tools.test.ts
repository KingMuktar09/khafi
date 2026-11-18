import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AMALS,
  FINDER_MOODS,
  LO_SHU,
  amalStreak,
  amalsDoneToday,
  computeReadingStats,
  computeStreak,
  formatHijri,
  generateMagicSquare,
  gregorianToHijri,
  magicConstant,
  pickRandomBook,
  recommendBooks,
  shelfBooks,
  shelfCounts,
  verifyMagicSquare,
} from '../src/data/tools';
import type { Book } from '../src/types';

const catalog = JSON.parse(
  readFileSync(resolve(__dirname, '../data/catalog.json'), 'utf8')
) as { folders: unknown[]; books: Book[] };

const titles = new Set(catalog.books.map((b) => b.title));

describe('Hijri date (tabular, approximate)', () => {
  it('is a valid date, monotonic, and within 2 days of the known Ramadan starts', () => {
    // Tabular dates can be 1-2 days off the sighted date, so the test
    // allows that — the UI always labels the date "approximate".
    const ramadan1444 = gregorianToHijri(new Date(2023, 2, 23)); // 1 Ramadan 1444 observed
    expect(ramadan1444.year).toBe(1444);
    expect(ramadan1444.month).toBe(9);
    expect(ramadan1444.day).toBeGreaterThanOrEqual(1);
    expect(ramadan1444.day).toBeLessThanOrEqual(3);
    const ramadan1447 = gregorianToHijri(new Date(2026, 1, 19)); // 1 Ramadan 1447 observed
    expect(ramadan1447.year).toBe(1447);
    expect(ramadan1447.month).toBe(9);
    expect(ramadan1447.day).toBeGreaterThanOrEqual(1);
    expect(ramadan1447.day).toBeLessThanOrEqual(3);
    // Invariants over a month of days.
    let prev: { year: number; month: number; day: number } | null = null;
    for (let i = 0; i < 40; i += 1) {
      const h = gregorianToHijri(new Date(2026, 10, 1 + i));
      expect(h.month).toBeGreaterThanOrEqual(1);
      expect(h.month).toBeLessThanOrEqual(12);
      expect(h.day).toBeGreaterThanOrEqual(1);
      expect(h.day).toBeLessThanOrEqual(30);
      expect(h.approximate).toBe(true);
      if (prev) {
        const cur = h.year * 372 + h.month * 31 + h.day;
        const old = prev.year * 372 + prev.month * 31 + prev.day;
        expect(cur).toBeGreaterThanOrEqual(old);
      }
      prev = h;
    }
    expect(formatHijri(gregorianToHijri(new Date(2026, 10, 18)))).toMatch(/AH$/);
  });
});

describe('Magic Square Maker (Wafq)', () => {
  it.each([3, 4, 5, 7])('makes a true %ix%i magic square', (n) => {
    const grid = generateMagicSquare(n);
    expect(grid).not.toBeNull();
    expect(grid!.length).toBe(n);
    expect(grid!.every((row) => row.length === n)).toBe(true);
    const check = verifyMagicSquare(grid!);
    expect(check.constant).toBe(magicConstant(n));
    expect(check.constant).toBe((n * (n * n + 1)) / 2);
    expect(check.rowsOk).toBe(true);
    expect(check.colsOk).toBe(true);
    expect(check.diagsOk).toBe(true);
    expect(check.usesAllNumbers).toBe(true);
    expect(check.allOk).toBe(true);
  });

  it('the classic Lo Shu 3x3 verifies with constant 15', () => {
    const check = verifyMagicSquare(LO_SHU);
    expect(check.constant).toBe(15);
    expect(check.allOk).toBe(true);
    expect(check.rowSums).toEqual([15, 15, 15]);
  });

  it('rejects non-magic squares and unsupported sizes', () => {
    expect(verifyMagicSquare([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).allOk).toBe(false);
    expect(generateMagicSquare(6)).toBeNull();
    expect(generateMagicSquare(2)).toBeNull();
  });
});

describe('My Shelf', () => {
  it('counts by status and drops books that are not in the catalog', () => {
    const shelf = { a: 'to-read', b: 'reading', c: 'finished', d: 'finished' } as Record<string, 'to-read' | 'reading' | 'finished'>;
    expect(shelfCounts(shelf)).toEqual({ 'to-read': 1, reading: 1, finished: 2 });
    const books = catalog.books.slice(0, 2);
    const got = shelfBooks(catalog.books, { [books[0].id]: 'to-read', 'no-such-id': 'reading' });
    expect(got.map((b) => b.id)).toEqual([books[0].id]);
  });
});

describe('Surprise Me (random book)', () => {
  it('always returns a real catalog book, and never repeats the excluded one', () => {
    const first = pickRandomBook(catalog.books, null, () => 0);
    expect(first).not.toBeNull();
    expect(titles.has(first!.title)).toBe(true);
    const last = pickRandomBook(catalog.books, null, () => 0.999);
    expect(titles.has(last!.title)).toBe(true);
    const excluded = pickRandomBook(catalog.books, first!.id, () => 0);
    expect(excluded!.id).not.toBe(first!.id);
    expect(pickRandomBook([], null)).toBeNull();
  });
});

describe('Book Finder', () => {
  it('recommends up to 3 real books for every mood, with reasons from topic/category', () => {
    for (const mood of FINDER_MOODS) {
      const picks = recommendBooks(catalog.books, { moodId: mood.id, level: 'begin', format: 'any' });
      // A mood only has as many books as the library really holds on that
      // topic (e.g. Dreams & the Unseen has 1 real book), so 1-3 picks.
      expect(picks.length, `mood ${mood.id}`).toBeGreaterThanOrEqual(1);
      expect(picks.length, `mood ${mood.id}`).toBeLessThanOrEqual(3);
      for (const pick of picks) {
        expect(titles.has(pick.book.title)).toBe(true);
        expect(pick.book.category).toBe(mood.category);
        expect(pick.reason).toContain(mood.category);
      }
      const deep = recommendBooks(catalog.books, { moodId: mood.id, level: 'deep', format: 'any' });
      expect(deep.length, `mood ${mood.id} deep`).toBeGreaterThanOrEqual(1);
      expect(deep.length, `mood ${mood.id} deep`).toBeLessThanOrEqual(3);
      expect(deep.every((p) => titles.has(p.book.title))).toBe(true);
    }
  });

  it('honours the format filter and returns nothing for an unknown mood', () => {
    const pdfs = recommendBooks(catalog.books, { moodId: 'hadith', level: 'begin', format: 'pdf' });
    expect(pdfs.length).toBeGreaterThan(0);
    expect(pdfs.every((p) => p.book.fileType === 'pdf')).toBe(true);
    const notes = recommendBooks(catalog.books, { moodId: 'sufism', level: 'begin', format: 'notes' });
    expect(notes.every((p) => p.book.fileType !== 'pdf')).toBe(true);
    expect(recommendBooks(catalog.books, { moodId: 'nope', level: 'begin', format: 'any' })).toEqual([]);
  });
});

describe('Reading stats and streaks', () => {
  it('counts finished / in progress / shelf / bookmarks / journeys', () => {
    const stats = computeReadingStats({
      shelf: { a: 'finished', b: 'reading', c: 'to-read' },
      progress: { a: { percentage: 100 }, b: { percentage: 40 }, x: { percentage: 10 } },
      bookmarks: { a: [3, 9], b: [1] },
      journeyProgress: { j1: ['s1', 's2'] },
      journeys: [
        { id: 'j1', total: 2 },
        { id: 'j2', total: 5 },
      ],
      visitDates: ['2026-11-16', '2026-11-17', '2026-11-18'],
      today: new Date(2026, 10, 18),
    });
    expect(stats.finished).toBe(1);
    expect(stats.inProgress).toBe(2);
    expect(stats.toRead).toBe(1);
    expect(stats.onShelf).toBe(3);
    expect(stats.bookmarks).toBe(3);
    expect(stats.journeyStepsDone).toBe(2);
    expect(stats.journeysDone).toBe(1);
    expect(stats.streakDays).toBe(3);
    expect(stats.totalVisits).toBe(3);
  });

  it('streak breaks on a missed day and is 0 with no recent visit', () => {
    expect(computeStreak(['2026-11-18', '2026-11-16'], new Date(2026, 10, 18))).toBe(1);
    expect(computeStreak(['2026-11-10'], new Date(2026, 10, 18))).toBe(0);
    expect(computeStreak([], new Date(2026, 10, 18))).toBe(0);
    // Not visited yet today, but visited yesterday: streak still counts.
    expect(computeStreak(['2026-11-17'], new Date(2026, 10, 18))).toBe(1);
  });
});

describe('Amals', () => {
  it('lists general amals whose linked books are real catalog books', () => {
    expect(AMALS.length).toBeGreaterThanOrEqual(5);
    for (const amal of AMALS) {
      expect(amal.title.length).toBeGreaterThan(0);
      expect(amal.detail.length).toBeGreaterThan(0);
      expect(amal.why.length).toBeGreaterThan(0);
      if (amal.sourceTitle) {
        expect(titles.has(amal.sourceTitle), `amal "${amal.id}" source "${amal.sourceTitle}" must be a real book`).toBe(true);
      }
      // No prescribed counts as religious rulings, no Hadith quoted.
      expect(amal.detail).not.toMatch(/Hadith/i);
    }
  });

  it('tracks done amals per day and the amal streak', () => {
    const log = { '2026-11-17': ['fajr'], '2026-11-18': ['fajr', 'quran-reading'] };
    expect(amalsDoneToday(log, new Date(2026, 10, 18))).toEqual(['fajr', 'quran-reading']);
    expect(amalStreak(log, new Date(2026, 10, 18))).toBe(2);
    expect(amalsDoneToday({}, new Date(2026, 10, 18))).toEqual([]);
  });
});
