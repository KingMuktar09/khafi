import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AL_ASRAR_TOOLS } from '../src/data/alAsrarContent';
import { TOPICS } from '../src/data/topicsContent';
import { FRIEND_AMALS, FRIEND_AMALS_SOURCE, FRIEND_AMALS_WARNING } from '../src/data/friendAmals';
import { ASMA_NAMES } from '../src/data/asmaNames';

/**
 * Stage 3A + 3B content checks: the 19 filled Tier B tools, the twelve
 * Topics, and the 25 John Friend amals. Content prose is used exactly
 * as written in the data files; these tests only check shape,
 * completeness and honest sourcing, never the wording.
 */

const FILLED_TOOL_IDS = [
  'kitab',
  'talasim',
  'ashkal',
  'figure-forge',
  'talism-studio',
  'haqaiq',
  'shart',
  'sirr-al-jalil',
  'durus',
  'index',
  'library',
  'atlas',
  'qalam',
  'khatam',
  'plate',
  'works',
  'bakhur-adad',
  'shurut',
  'glossary',
] as const;

/** Friend amal number -> bare Arabic name in the 99 Names data. */
const FRIEND_BARE: Record<number, string> = {
  1: 'رحمن',
  2: 'قدوس',
  3: 'سلام',
  4: 'عزيز',
  5: 'وهاب',
  6: 'رزاق',
  7: 'فتاح',
  8: 'عليم',
  9: 'قابض',
  10: 'باسط',
  11: 'رافع',
  12: 'حليم',
  13: 'عظيم',
  14: 'شكور',
  15: 'ودود',
  16: 'باعث',
  17: 'حق',
  18: 'قوي',
  19: 'متين',
  20: 'ولي',
  21: 'مبدئ',
  22: 'محيي',
  23: 'مميت',
  24: 'قيوم',
  25: 'صبور',
};

function readSource(relPath: string): string {
  return readFileSync(join(process.cwd(), relPath), 'utf8');
}

describe('Al Asrar filled tools', () => {
  it('has exactly the 19 filled tools, no more and no fewer', () => {
    expect(Object.keys(AL_ASRAR_TOOLS).sort()).toEqual([...FILLED_TOOL_IDS].sort());
  });

  it('every tool has a non-empty intro and at least 3 entries', () => {
    for (const id of FILLED_TOOL_IDS) {
      const tool = AL_ASRAR_TOOLS[id];
      expect(tool, `missing tool ${id}`).toBeDefined();
      expect(tool.intro.trim().length).toBeGreaterThan(0);
      expect(tool.entries.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every entry has a non-empty title, body and source', () => {
    for (const id of FILLED_TOOL_IDS) {
      for (const entry of AL_ASRAR_TOOLS[id].entries) {
        expect(entry.title.trim().length, `${id} entry title`).toBeGreaterThan(0);
        expect(entry.body.trim().length, `${id} "${entry.title}" body`).toBeGreaterThan(0);
        expect(entry.source.trim().length, `${id} "${entry.title}" source`).toBeGreaterThan(0);
      }
    }
  });

  it('every entry id matches its key', () => {
    for (const id of FILLED_TOOL_IDS) {
      expect(AL_ASRAR_TOOLS[id].id).toBe(id);
    }
  });
});

describe('Topics', () => {
  it('has the twelve topics, in fixed upload order, each with a non-empty intro and closing', () => {
    expect(TOPICS.map((t) => t.id)).toEqual([
      'ibn-arabi-40-day-retreat',
      'alam-al-malakut',
      'ruh-and-soul',
      'letter-alif',
      'seal-of-solomon',
      'three-kinds-of-dreams',
      'surah-saba-34-14',
      'al-khidr',
      'rijal-al-ghayb',
      'uwaisi-transmission',
      'renewal-of-creation',
      'quranic-drinks',
    ]);
    for (const topic of TOPICS) {
      expect(topic.intro.trim().length, `${topic.id} intro`).toBeGreaterThan(0);
      expect(topic.closing.trim().length, `${topic.id} closing`).toBeGreaterThan(0);
      expect(topic.title.trim().length).toBeGreaterThan(0);
      expect(topic.subtitle.trim().length).toBeGreaterThan(0);
    }
  });

  it('every topic has at least 2 sections, each with a heading and non-empty paragraphs', () => {
    for (const topic of TOPICS) {
      expect(topic.sections.length, `${topic.id} sections`).toBeGreaterThanOrEqual(2);
      for (const section of topic.sections) {
        expect(section.heading.trim().length, `${topic.id} section heading`).toBeGreaterThan(0);
        expect(section.paragraphs.length).toBeGreaterThanOrEqual(1);
        for (const paragraph of section.paragraphs) {
          expect(paragraph.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('every topic has non-empty sources, and terms with Arabic, transliteration and meaning', () => {
    for (const topic of TOPICS) {
      expect(topic.sources.length).toBeGreaterThanOrEqual(1);
      for (const source of topic.sources) {
        expect(source.trim().length).toBeGreaterThan(0);
      }
      for (const term of topic.terms) {
        expect(term.arabic.trim().length).toBeGreaterThan(0);
        expect(term.transliteration.trim().length).toBeGreaterThan(0);
        expect(term.meaning.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('the Malakut topic is complete: no continues note, no "source needed", and the new sections are there', () => {
    const malakut = TOPICS.find((t) => t.id === 'alam-al-malakut');
    expect(malakut?.continuesNote).toBeUndefined();
    expect(malakut?.sources.join(' ').toLowerCase()).not.toContain('source needed');
    expect(malakut?.sections.length).toBeGreaterThanOrEqual(10);
    const headings = malakut?.sections.map((s) => s.heading) ?? [];
    expect(headings).toContain('The Genesis of the Malakut');
    expect(headings).toContain('The Eight Pillars of the Highest Malakut');
    expect(headings).toContain('The human microcosm');
    expect(headings).toContain('The Veil of Food and the Threefold Unveiling');
  });

  it('the al-Khidr topic and the retreat topic have no continues note any more', () => {
    const khidr = TOPICS.find((t) => t.id === 'al-khidr');
    expect(khidr?.continuesNote).toBeUndefined();
    const headings = khidr?.sections.map((s) => s.heading) ?? [];
    expect(headings).toContain('First meeting: Seville');
    expect(headings).toContain('Second meeting: the Port of Tunis');
    expect(headings).toContain('Third meeting: the Atlantic coast of Spain');
    const retreat = TOPICS.find((t) => t.id === 'ibn-arabi-40-day-retreat');
    expect(retreat?.continuesNote).toBeUndefined();
  });

  it('no topic carries a continues note', () => {
    for (const topic of TOPICS) {
      expect(topic.continuesNote, `${topic.id} should be complete`).toBeUndefined();
    }
  });
});

describe('John Friend amals', () => {
  it('has numbers 1 to 25 with no duplicates', () => {
    expect(FRIEND_AMALS.map((a) => a.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    ]);
    expect(new Set(FRIEND_AMALS.map((a) => a.id)).size).toBe(FRIEND_AMALS.length);
  });

  it('every amal has title, purpose, how, section and a page within 37 to 50', () => {
    for (const amal of FRIEND_AMALS) {
      expect(amal.title.trim().length).toBeGreaterThan(0);
      expect(amal.purpose.trim().length).toBeGreaterThan(0);
      expect(amal.how.trim().length).toBeGreaterThan(0);
      expect(amal.section.trim().length).toBeGreaterThan(0);
      const page = Number(amal.page);
      expect(Number.isInteger(page)).toBe(true);
      expect(page).toBeGreaterThanOrEqual(37);
      expect(page).toBeLessThanOrEqual(50);
    }
  });

  it('the source line and the warning are non-empty', () => {
    expect(FRIEND_AMALS_SOURCE).toContain('John Friend');
    expect(FRIEND_AMALS_WARNING).toContain('at your own risk');
  });

  it('amal 23 (al-Mumit) is honest about its missing steps', () => {
    const mumit = FRIEND_AMALS.find((a) => a.number === 23);
    expect(mumit?.words).toBeUndefined();
    expect(mumit?.note).toContain('not in hand yet');
    expect(mumit?.how).toContain('still in the notebook chat');
  });

  it('every Friend amal name matches the 99 Names data by bare Arabic form', () => {
    for (const amal of FRIEND_AMALS) {
      const bare = FRIEND_BARE[amal.number];
      expect(bare, `no bare form mapped for amal ${amal.number}`).toBeDefined();
      const name = ASMA_NAMES.find((n) => n.bare === bare);
      expect(name, `no 99 Names entry with bare "${bare}"`).toBeDefined();
      // Transliteration without the article prefix appears in the title.
      // The prefix strip also handles the sun-letter form Ash- (Ash-Shakur).
      const namePart = name!.transliteration.replace(/^(Al|Ar|As|Ash)-/, '');
      expect(amal.title.toLowerCase()).toContain(namePart.toLowerCase());
      // Meaning (without a leading "The ") appears in the title or how,
      // except amal 23, whose gloss is not in hand yet.
      const meaningCore = name!.meaning.replace(/^The /, '');
      const combined = `${amal.title} ${amal.how}`.toLowerCase();
      if (amal.number !== 23) {
        expect(combined).toContain(meaningCore.toLowerCase());
      }
    }
  });
});

describe('No em dashes in the Stage 3A/3B content files', () => {
  it('alAsrarContent.ts, topicsContent.ts, topicsQuestions.ts, friendAmals.ts and studyGuides.ts contain no em dash', () => {
    for (const file of [
      'src/data/alAsrarContent.ts',
      'src/data/topicsContent.ts',
      'src/data/topicsQuestions.ts',
      'src/data/friendAmals.ts',
      'src/data/studyGuides.ts',
    ]) {
      const text = readSource(file);
      expect(text, `${file} must not contain an em dash`).not.toContain('\u2014');
    }
  });
});
