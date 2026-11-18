import { beforeEach, describe, expect, it } from 'vitest';
import {
  addGrimoireItem,
  emptyWird,
  exportToolsData,
  importGrimoireJson,
  importJournalJson,
  importToolsData,
  loadGrimoire,
  loadJournal,
  loadWird,
  saveGrimoire,
  saveJournal,
  saveWird,
} from '../src/utils/toolsStorage';
import type { GrimoireItem, JournalEntry, WirdData } from '../src/utils/toolsStorage';

/** In-memory localStorage stand-in (vitest runs in node, so there is none). */
function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
}

const journalSample: JournalEntry[] = [
  { id: 'j1', title: 'First note', text: 'Something I read.', createdAt: 1000, updatedAt: 1000 },
  { id: 'j2', title: 'Second note', text: 'Another thought.', createdAt: 2000, updatedAt: 2500 },
];

const wirdSample: WirdData = {
  counts: { SubhanAllah: 33, Alhamdulillah: 12 },
  targets: { SubhanAllah: 33, Alhamdulillah: 100 },
};

const grimoireSample: GrimoireItem[] = [
  { id: 'g1', kind: 'name', title: 'Ar-Rahman', detail: 'The Most Merciful.', createdAt: 3000 },
  { id: 'g2', kind: 'bast', title: 'Unfolded text', detail: 'Total: 786.', createdAt: 4000 },
];

beforeEach(() => {
  (globalThis as unknown as { localStorage: unknown }).localStorage = createMemoryStorage();
});

describe('journal storage', () => {
  it('round-trips entries through save/load', () => {
    expect(loadJournal()).toEqual([]);
    saveJournal(journalSample);
    expect(loadJournal()).toEqual(journalSample);
  });

  it('returns an empty list when nothing is stored', () => {
    expect(loadJournal()).toEqual([]);
  });
});

describe('wird storage', () => {
  it('round-trips counts and targets through save/load', () => {
    expect(loadWird()).toEqual(emptyWird());
    saveWird(wirdSample);
    expect(loadWird()).toEqual(wirdSample);
  });
});

describe('grimoire storage', () => {
  it('round-trips items added with addGrimoireItem', () => {
    expect(loadGrimoire()).toEqual([]);
    const afterFirst = addGrimoireItem({ kind: 'name', title: 'Ar-Rahman', detail: 'The Most Merciful.' });
    expect(afterFirst).toHaveLength(1);
    expect(afterFirst[0].kind).toBe('name');
    expect(afterFirst[0].title).toBe('Ar-Rahman');
    expect(typeof afterFirst[0].id).toBe('string');
    expect(typeof afterFirst[0].createdAt).toBe('number');

    addGrimoireItem({ kind: 'note', title: 'A note', detail: 'Keep this.' });
    const loaded = loadGrimoire();
    expect(loaded).toHaveLength(2);
    expect(loaded[0].kind).toBe('note'); // newest first
    saveGrimoire(grimoireSample);
    expect(loadGrimoire()).toEqual(grimoireSample);
  });
});

describe('export / import', () => {
  it('export then import restores all three sections', () => {
    saveJournal(journalSample);
    saveWird(wirdSample);
    saveGrimoire(grimoireSample);
    const exported = exportToolsData();
    expect(() => JSON.parse(exported)).not.toThrow();

    saveJournal([]);
    saveWird(emptyWird());
    saveGrimoire([]);
    expect(loadJournal()).toEqual([]);
    expect(loadWird()).toEqual(emptyWird());
    expect(loadGrimoire()).toEqual([]);

    const result = importToolsData(exported);
    expect(result.ok).toBe(true);
    expect(loadJournal()).toEqual(journalSample);
    expect(loadWird()).toEqual(wirdSample);
    expect(loadGrimoire()).toEqual(grimoireSample);
  });

  it('malformed JSON returns an error and does not wipe existing data', () => {
    saveJournal(journalSample);
    saveWird(wirdSample);
    saveGrimoire(grimoireSample);

    const result = importToolsData('{not json');
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
    expect(loadJournal()).toEqual(journalSample);
    expect(loadWird()).toEqual(wirdSample);
    expect(loadGrimoire()).toEqual(grimoireSample);
  });

  it('wrong-shaped data returns an error and does not wipe existing data', () => {
    saveJournal(journalSample);
    const badShapes = [
      JSON.stringify({ journal: [{ id: 'x' }] }), // entry missing fields
      JSON.stringify({ wird: { counts: { a: 'not a number' }, targets: {} } }),
      JSON.stringify({ grimoire: [{ id: 'g', kind: 'wrong', title: 't', detail: 'd', createdAt: 1 }] }),
      JSON.stringify(['a list, not an object']),
    ];
    for (const bad of badShapes) {
      const result = importToolsData(bad);
      expect(result.ok).toBe(false);
      expect(result.error).toBeTruthy();
    }
    expect(loadJournal()).toEqual(journalSample);
  });

  it('a partial export only touches the sections it carries', () => {
    saveJournal(journalSample);
    saveGrimoire(grimoireSample);
    const result = importToolsData(JSON.stringify({ wird: wirdSample }));
    expect(result.ok).toBe(true);
    expect(loadWird()).toEqual(wirdSample);
    expect(loadJournal()).toEqual(journalSample);
    expect(loadGrimoire()).toEqual(grimoireSample);
  });

  it('journal import accepts a bare array and merges by id', () => {
    saveJournal(journalSample);
    const updated: JournalEntry = { ...journalSample[0], title: 'First note (edited)', updatedAt: 9999 };
    const extra: JournalEntry = { id: 'j3', title: 'New note', text: 'Imported.', createdAt: 3000, updatedAt: 3000 };
    const result = importJournalJson(JSON.stringify([updated, extra]));
    expect(result.ok).toBe(true);
    const loaded = loadJournal();
    expect(loaded).toHaveLength(3);
    expect(loaded.find((entry) => entry.id === 'j1')?.title).toBe('First note (edited)');
    expect(loaded.find((entry) => entry.id === 'j3')).toEqual(extra);
  });

  it('grimoire import accepts a bare array and rejects bad JSON without wiping', () => {
    saveGrimoire(grimoireSample);
    const result = importGrimoireJson(JSON.stringify([grimoireSample[0]]));
    expect(result.ok).toBe(true);
    expect(loadGrimoire()).toEqual(grimoireSample);

    const bad = importGrimoireJson('{{{');
    expect(bad.ok).toBe(false);
    expect(loadGrimoire()).toEqual(grimoireSample);
  });
});
