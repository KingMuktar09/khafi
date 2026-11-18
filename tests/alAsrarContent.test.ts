import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AL_ASRAR_TOOLS } from '../src/data/alAsrarContent';
import { TOPICS } from '../src/data/topicsContent';
import { FRIEND_AMALS, FRIEND_AMALS_SOURCE, FRIEND_AMALS_WARNING } from '../src/data/friendAmals';
import { ASMA_NAMES } from '../src/data/asmaNames';

/**
 * Stage 3A content checks: the 15 filled Tier B tools, the two
 * Topics, and the 6 John Friend amals. Content prose is used exactly
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
] as const;

/** Friend amal number -> bare Arabic name in the 99 Names data. */
const FRIEND_BARE: Record<number, string> = {
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
  it('has exactly the 15 filled tools, no more and no fewer', () => {
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
  it('has the eight topics, in fixed upload order, each with a non-empty intro and closing', () => {
    expect(TOPICS.map((t) => t.id)).toEqual([
      'ibn-arabi-40-day-retreat',
      'alam-al-malakut',
      'ruh-and-soul',
      'letter-alif',
      'seal-of-solomon',
      'three-kinds-of-dreams',
      'surah-saba-34-14',
      'al-khidr',
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

  it('the Malakut topic says plainly that the discussion continues', () => {
    const malakut = TOPICS.find((t) => t.id === 'alam-al-malakut');
    expect(malakut?.continuesNote).toContain('This discussion continues');
    expect(malakut?.sources.join(' ').toLowerCase()).toContain('source needed');
  });
});

describe('John Friend amals', () => {
  it('has numbers 20 to 25 with no duplicates', () => {
    expect(FRIEND_AMALS.map((a) => a.number)).toEqual([20, 21, 22, 23, 24, 25]);
    expect(new Set(FRIEND_AMALS.map((a) => a.id)).size).toBe(FRIEND_AMALS.length);
  });

  it('every amal has title, purpose, how, section and a page within 42 to 50', () => {
    for (const amal of FRIEND_AMALS) {
      expect(amal.title.trim().length).toBeGreaterThan(0);
      expect(amal.purpose.trim().length).toBeGreaterThan(0);
      expect(amal.how.trim().length).toBeGreaterThan(0);
      expect(amal.section.trim().length).toBeGreaterThan(0);
      const page = Number(amal.page);
      expect(Number.isInteger(page)).toBe(true);
      expect(page).toBeGreaterThanOrEqual(42);
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
      const namePart = name!.transliteration.replace(/^(Al|Ar|As)-/, '');
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

describe('No em dashes in the Stage 3A content files', () => {
  it('alAsrarContent.ts, topicsContent.ts, topicsQuestions.ts and friendAmals.ts contain no em dash', () => {
    for (const file of [
      'src/data/alAsrarContent.ts',
      'src/data/topicsContent.ts',
      'src/data/topicsQuestions.ts',
      'src/data/friendAmals.ts',
    ]) {
      const text = readSource(file);
      expect(text, `${file} must not contain an em dash`).not.toContain('\u2014');
    }
  });
});
