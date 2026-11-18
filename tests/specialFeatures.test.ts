import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  JOURNEYS,
  resolveJourneys,
  journeyProgress,
  getWisdomForDate,
  WISDOMS,
  getTimeline,
  TIMELINE_MASTERS,
} from '../src/data/specialFeatures';
import type { Book } from '../src/types';

const catalog = JSON.parse(
  readFileSync(resolve(__dirname, '../data/catalog.json'), 'utf8')
) as { folders: unknown[]; books: Book[] };

describe('Guided Reading Journeys', () => {
  it('has 5 journeys, every step points at a real book in the catalog', () => {
    expect(JOURNEYS).toHaveLength(5);
    const resolved = resolveJourneys(catalog.books);
    for (const journey of resolved) {
      expect(journey.steps.length).toBeGreaterThanOrEqual(5);
      for (const step of journey.steps) {
        expect(step.book, `journey ${journey.id} step "${step.title}" must be a real book`).toBeDefined();
        expect(step.book!.title).toBe(step.title);
      }
    }
    // No journey step is a duplicate of another step in the same journey.
    for (const journey of resolved) {
      const titles = journey.steps.map((s) => s.title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  it('progress is the share of done steps', () => {
    const journey = JOURNEYS[0];
    expect(journeyProgress([], journey)).toBe(0);
    expect(journeyProgress([journey.steps[0].title], journey)).toBe(
      Math.round(100 / journey.steps.length)
    );
    expect(journeyProgress(journey.steps.map((s) => s.title), journey)).toBe(100);
  });
});

describe('Wisdom of the Day', () => {
  it('is the same all day and changes by date, never a verbatim quote', () => {
    const a = getWisdomForDate(new Date('2026-11-18T08:00:00+05:30'));
    const b = getWisdomForDate(new Date('2026-11-18T22:00:00+05:30'));
    expect(a).toEqual(b);
    // Over a week, more than one wisdom appears.
    const week = new Set(
      Array.from({ length: 7 }, (_, i) => getWisdomForDate(new Date(2026, 10, 18 + i)).teaching)
    );
    expect(week.size).toBeGreaterThan(1);
    // Every wisdom names a real source book in the catalog.
    for (const w of WISDOMS) {
      expect(catalog.books.some((book) => book.title === w.sourceTitle)).toBe(true);
      expect(w.teaching).not.toContain('Quran');
      expect(w.teaching).not.toContain('Hadith');
    }
  });
});

describe('Knowledge Map / Timeline', () => {
  it('is chronological by century, every master links to real books', () => {
    const timeline = getTimeline();
    expect(timeline).toHaveLength(TIMELINE_MASTERS.length);
    const centuries = timeline.map((m) => m.century);
    expect(centuries).toEqual([...centuries].sort((x, y) => x - y));
    for (const master of timeline) {
      expect(master.era).toMatch(/century/);
      expect(master.bookTitles.length).toBeGreaterThanOrEqual(1);
      for (const title of master.bookTitles) {
        expect(
          catalog.books.some((book) => book.title === title),
          `${master.name} book "${title}" must be in the catalog`
        ).toBe(true);
      }
    }
  });
});

describe('Static catalog fallback (Vercel = Cloudflare Pages)', () => {
  it('public/catalog.json exists, matches data/catalog.json counts, and strips paid links', () => {
    const pubPath = resolve(__dirname, '../public/catalog.json');
    expect(existsSync(pubPath)).toBe(true);
    const pub = JSON.parse(readFileSync(pubPath, 'utf8')) as {
      folders: unknown[];
      books: Book[];
    };
    expect(pub.books.length).toBe(173);
    expect(pub.folders.length).toBe(36);
    expect(pub.books.map((b) => b.id).sort()).toEqual(
      catalog.books.map((b) => b.id).sort()
    );
    for (const book of pub.books) {
      if (book.isPaid) {
        expect(book.externalUrl).toBeUndefined();
        expect(book.driveFileId).toBeUndefined();
      }
    }
  });
});
