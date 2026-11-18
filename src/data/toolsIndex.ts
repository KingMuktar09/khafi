/**
 * Registry of the study tools, used by the hub page and the search overlay.
 * The `route` values are ViewNames; the router integration adds them.
 */
import type { ViewName } from '../types';

export type ToolId = 'huruf' | 'asma' | 'bast' | 'fawatih' | 'sawaqit' | 'shields' | 'journal' | 'wird' | 'grimoire' | 'method' | 'about' | 'today' | 'hours' | 'moon' | 'mansions' | 'falak' | 'majlis' | 'forge' | 'qawaid' | 'kitab' | 'talasim' | 'ashkal' | 'figure-forge' | 'talism-studio' | 'haqaiq' | 'shart' | 'sirr-al-jalil' | 'durus' | 'index' | 'library' | 'atlas' | 'qalam' | 'khatam' | 'plate' | 'works' | 'bakhur-adad' | 'shurut' | 'glossary';

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
    id: 'fawatih',
    title: 'Fawatih (The Opening Letters)',
    blurb: 'The 14 disjointed-letter forms that open 29 surahs, found by a rule run over the opening verse of every surah, with their values.',
    route: 'tools-fawatih',
    keywords: ['fawatih', 'muqattaat', 'disjointed letters', 'opening letters', 'surah openings', 'quran', 'letters'],
  },
  {
    id: 'sawaqit',
    title: 'Sawaqit (The Seven Absent Letters)',
    blurb: 'The seven letters that do not appear anywhere in al-Fatiha, found by counting which letters the surah uses.',
    route: 'tools-sawaqit',
    keywords: ['sawaqit', 'absent letters', 'fatiha', 'seven letters', 'quran', 'letters'],
  },
  {
    id: 'shields',
    title: 'Shields (Running Letter Sums)',
    blurb: 'Word-by-word running letter sums for al-Fatiha, al-Ikhlas, al-Falaq, al-Nas and Ayat al-Kursi, so you can follow the arithmetic.',
    route: 'tools-shields',
    keywords: ['shields', 'running total', 'fatiha', 'ikhlas', 'falaq', 'nas', 'kursi', 'ayat al-kursi', 'quran', 'sums'],
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
    id: 'today',
    title: 'Today',
    blurb: 'The facts of this day: the date, the approximate Hijri date, the day’s ruler, and the planetary hour we are in now.',
    route: 'tools-today',
    keywords: ['today', 'date', 'hijri', 'day', 'ruler', 'hour', 'current hour'],
  },
  {
    id: 'hours',
    title: 'Planetary Hours',
    blurb: 'The 24 hours of the day, each ruled by a planet. Day hours run sunrise to sunset, night hours sunset to next sunrise — the hours are unequal.',
    route: 'tools-hours',
    keywords: ['planetary hours', 'hours', 'sunrise', 'sunset', 'location', 'city', 'latitude', 'longitude', 'day hours', 'night hours'],
  },
  {
    id: 'moon',
    title: 'Moon',
    blurb: 'The Moon’s phase, how much of it is lit, the lunar day, and the mansion it sits in.',
    route: 'tools-moon',
    keywords: ['moon', 'phase', 'illumination', 'lunar day', 'mansion', 'manazil'],
  },
  {
    id: 'mansions',
    title: 'Lunar Mansions',
    blurb: 'The 28 stations of the Moon, with today’s mansion highlighted and the start point shown as a convention you can move.',
    route: 'tools-mansions',
    keywords: ['lunar mansions', 'mansions', 'manazil', 'stations', 'sharatayn', 'moon'],
  },
  {
    id: 'falak',
    title: 'Falak — the Twelve Signs',
    blurb: 'The twelve signs of the tropical zodiac, with the Sun’s sign today.',
    route: 'tools-falak',
    keywords: ['falak', 'zodiac', 'signs', 'sun sign', 'aries', 'taurus', 'element', 'tropical'],
  },
  {
    id: 'majlis',
    title: 'Majlis',
    blurb: 'The facts of the moment in one place: location, today’s ruler, the current hour, and the Moon. Facts only — no advice.',
    route: 'tools-majlis',
    keywords: ['majlis', 'today', 'current hour', 'moon', 'facts'],
  },
  {
    id: 'forge',
    title: 'Wafq Forge — Magic Squares',
    blurb: 'Build a magic square of order 3 to 20 at a target sum, then check it line by line with a separate validator.',
    route: 'tools-forge',
    keywords: ['wafq', 'forge', 'magic square', 'squares', 'seal', 'target sum', 'siamese', 'lux', 'complement'],
  },
  {
    id: 'qawaid',
    title: 'Qawa’id — The Rules of the Squares',
    blurb: 'How a square is built, when a target sum can be reached, how it is checked, and what is refused.',
    route: 'tools-qawaid',
    keywords: ['qawaid', 'rules', 'magic square', 'reachability', 'validator', 'refused', 'methods'],
  },
  {
    id: 'kitab',
    title: 'Kitab (The Book)',
    blurb: 'What the books say about the Book: the three mothers of books, the Preserved Tablet, and the titled kitabs in the library.',
    route: 'tools-kitab',
    keywords: ['kitab', 'book', 'chapters', 'shams'],
  },
  {
    id: 'talasim',
    title: 'Talasim (Figures)',
    blurb: 'What a talisman is, its shapes and lineage, and the four strict conditions for making one.',
    route: 'tools-talasim',
    keywords: ['talasim', 'figures', 'talisman'],
  },
  {
    id: 'ashkal',
    title: 'Ashkal (Forms)',
    blurb: 'Forms as vessels for spirits: Point and Circle, Triangle and Square, magic squares as figures, and more.',
    route: 'tools-ashkal',
    keywords: ['ashkal', 'forms', 'figures'],
  },
  {
    id: 'figure-forge',
    title: 'Figure Forge',
    blurb: 'How a figure is made: metals and stones, timing, washing, consecration, and the artificer.',
    route: 'tools-figure-forge',
    keywords: ['figure forge', 'figures', 'forge'],
  },
  {
    id: 'talism-studio',
    title: 'Talism Studio',
    blurb: 'The workplace of the old craft: the remembrance house, the four pillars, the sand board, and the rules of the studio.',
    route: 'tools-talism-studio',
    keywords: ['talism studio', 'seal', 'composed'],
  },
  {
    id: 'haqaiq',
    title: 'Haqa’iq (Realities)',
    blurb: 'Realities that live in the heart: the fixed entities, the three worlds, and the path of law, way and reality.',
    route: 'tools-haqaiq',
    keywords: ['haqaiq', 'realities', 'records'],
  },
  {
    id: 'shart',
    title: 'Shart (Conditions)',
    blurb: 'The conditions every work needs: the 27 conditions, the four pillars, purity, and the condition of will.',
    route: 'tools-shart',
    keywords: ['shart', 'conditions'],
  },
  {
    id: 'sirr-al-jalil',
    title: 'al-Sirr al-Jalil',
    blurb: 'The Great Secret: the Name al-Jalil, the Name al-Majid, and the secret set in its matrix.',
    route: 'tools-sirr-al-jalil',
    keywords: ['sirr', 'jalil', 'monograph', 'verse'],
  },
  {
    id: 'durus',
    title: 'Durus (Lessons)',
    blurb: 'Lessons on learning: silence, Jilani’s thirteen branches, study etiquette, and learning from creation.',
    route: 'tools-durus',
    keywords: ['durus', 'lessons', 'courses'],
  },
  {
    id: 'index',
    title: 'Index',
    blurb: 'How the old books map themselves: Ibn Arabi’s chapter of the index, rubrics, and the dispersal of knowledge.',
    route: 'tools-index',
    keywords: ['index', 'search', 'records'],
  },
  {
    id: 'library',
    title: 'Library (Squares Library)',
    blurb: 'How the old books were kept: hidden knowledge, chests, the covenant of custody, and the great libraries.',
    route: 'tools-library',
    keywords: ['library', 'squares', 'entries'],
  },
  {
    id: 'atlas',
    title: 'Atlas',
    blurb: 'A map of the heavens: the Atlas sphere, nine charts, the Wheel of Letter Dispositions, and the Head of Qaf.',
    route: 'tools-atlas',
    keywords: ['atlas', 'map', 'figures'],
  },
  {
    id: 'qalam',
    title: 'Qalam',
    blurb: 'The Pen: the first thing created, the triple inscription, talismanic pen rules, and Rumi’s ants.',
    route: 'tools-qalam',
    keywords: ['qalam', 'pen', 'figures'],
  },
  {
    id: 'khatam',
    title: 'Khatam',
    blurb: 'The Seal: Solomon as its master, the 3 by 3 grid, the seven symbols, and the Seal of the Prophets.',
    route: 'tools-khatam',
    keywords: ['khatam', 'seal', 'figures'],
  },
  {
    id: 'plate',
    title: 'Plate',
    blurb: 'Plates of metal: gold for the Sun, silver for the Moon, iron for Mars, lead for Saturn, and seven-metal casting.',
    route: 'tools-plate',
    keywords: ['plate', 'a2', 'figures'],
  },
  {
    id: 'works',
    title: 'Works',
    blurb: 'What the books say a work is: its two purposes, intention, the letters, the square sizes, and the protocols, each with its source named.',
    route: 'tools-works',
    keywords: ['works', 'entries'],
  },
  {
    id: 'bakhur-adad',
    title: 'Bakhur and Adad',
    blurb: 'A catalogue of the aromatic substances and the number work, named with source and page. Never quantities, preparation, or recipes.',
    route: 'tools-bakhur-adad',
    keywords: ['bakhur', 'adad', 'incense', 'catalogue'],
  },
  {
    id: 'shurut',
    title: 'Shurut (Conditions)',
    blurb: 'The conditions a work needs: timing, harmony, consecration, charity, purity, intention and certainty, each with its source named.',
    route: 'tools-shurut',
    keywords: ['shurut', 'conditions'],
  },
  {
    id: 'glossary',
    title: 'Glossary',
    blurb: 'The words used across this section, explained in plain words, each with its source and page.',
    route: 'tools-glossary',
    keywords: ['glossary', 'terms', 'definitions'],
  },
  {
    id: 'method',
    title: 'Method (How These Tools Work)',
    blurb: 'Where the numbers come from, how letters are counted, what was tested, and what these tools cannot do.',
    route: 'tools-method',
    keywords: ['method', 'how', 'source', 'sources', 'about', 'rules', 'limits', 'tested'],
  },
  {
    id: 'about',
    title: 'About (The Study Tools)',
    blurb: 'What this section is, where its numbers come from, what was tested, and what it cannot do.',
    route: 'tools-about',
    keywords: ['about', 'sources', 'conventions', 'limits', 'tested', 'who made this', 'ghayb'],
  },
];
