/**
 * Registry of the study tools, used by the hub page and the search overlay.
 * The `route` values are ViewNames; the router integration adds them.
 */
import type { ViewName } from '../types';

export type ToolId = 'huruf' | 'asma' | 'bast' | 'journal' | 'wird' | 'grimoire' | 'method';

export interface ToolEntry {
  id: ToolId;
  title: string;
  blurb: string;
  route: ViewName;
  keywords: string[];
}

export const TOOLS_INDEX: ToolEntry[] = [
  {
    id: 'huruf',
    title: 'Huruf (Letters & Numbers)',
    blurb: 'The 28 Arabic letters and their Abjad values, with the counting rules shown in plain words.',
    route: 'tools-huruf',
    keywords: ['abjad', 'letters', 'huruf', 'numbers', 'values', 'alphabet', 'kabir', 'saghir', 'mashriqi', 'maghribi'],
  },
  {
    id: 'asma',
    title: 'Asma (The 99 Names)',
    blurb: 'Search the 99 Names, see each name’s number value, reckon any name, and save names you want to keep.',
    route: 'tools-asma',
    keywords: ['asma', 'names', '99 names', 'allah', 'asma ul husna', 'reckon', 'value'],
  },
  {
    id: 'bast',
    title: 'Bast (Unfold a Text)',
    blurb: 'Type any text and unfold it letter by letter, with each letter’s value and the running total.',
    route: 'tools-bast',
    keywords: ['bast', 'unfold', 'text', 'letters', 'total', 'calculate', 'value'],
  },
  {
    id: 'journal',
    title: 'Journal (Reading Notes)',
    blurb: 'Keep notes on what you read. Everything stays on this device — nothing is sent anywhere.',
    route: 'tools-journal',
    keywords: ['journal', 'notes', 'reading', 'diary', 'write', 'export'],
  },
  {
    id: 'wird',
    title: 'Wird (Remembrance Counter)',
    blurb: 'A simple counter for daily remembrance, with targets you set yourself. Saved on this device.',
    route: 'tools-wird',
    keywords: ['wird', 'counter', 'dhikr', 'remembrance', 'tasbih', 'count', 'subhanallah', 'alhamdulillah'],
  },
  {
    id: 'grimoire',
    title: 'Grimoire (Saved Items)',
    blurb: 'Names, unfolded texts and notes you saved from the other tools, all in one place on this device.',
    route: 'tools-grimoire',
    keywords: ['grimoire', 'saved', 'shelf', 'kept', 'notes', 'collection'],
  },
  {
    id: 'method',
    title: 'Method (How These Tools Work)',
    blurb: 'Where the numbers come from, how letters are counted, what was tested, and what these tools cannot do.',
    route: 'tools-method',
    keywords: ['method', 'how', 'source', 'sources', 'about', 'rules', 'limits', 'tested'],
  },
];
