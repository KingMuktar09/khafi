/**
 * Talisman figures drawn from verified sources only.
 *
 * Every figure here comes from a book we have in hand. Nothing is
 * guessed. Where a grid is not in hand, we say so and we draw no grid.
 * All words are plain. No figure promises any outcome.
 */

export type SealSymbolKey =
  | 'star'
  | 'rods'
  | 'mim'
  | 'ladder'
  | 'strokes'
  | 'ha'
  | 'waw';

export interface SealSymbol {
  key: SealSymbolKey;
  /** Plain name of the mark, as the task names it. */
  name: string;
}

export interface GridFigure {
  kind: 'grid';
  id: string;
  title: string;
  caption: string;
  source: string;
  rows: number[][];
  note?: string;
}

export interface TextFigure {
  kind: 'text';
  id: string;
  title: string;
  caption: string;
  source: string;
  /** Lines quoted or given by the book. No grid cells live here. */
  lines: string[];
  note?: string;
}

export interface SealsFigure {
  kind: 'seals';
  id: string;
  title: string;
  caption: string;
  source: string;
  symbols: SealSymbol[];
  note?: string;
}

export type TalismanFigure = GridFigure | TextFigure | SealsFigure;

export const STUDY_ONLY_NOTE =
  'These figures are for study only. They do not promise any outcome. They give no religious ruling. Read them slowly and check the sources named.';

export const TALISMAN_FIGURES: TalismanFigure[] = [
  {
    kind: 'grid',
    id: 'mutakabbir',
    title: 'Square of al-Mutakabbir, 4 by 4',
    caption:
      'A square of numbers from the book. The book gives these numbers as they are. We draw them here exactly as written.',
    source: 'John Friend, Shams al-Ma\u2019arif al-Kubra, Chapter 16',
    rows: [
      [51, 58, 53, 44],
      [52, 25, 50, 56],
      [46, 55, 56, 41],
      [57, 48, 47, 54],
    ],
    note: 'This grid does not check out as a magic square. The rows add to 206, 183, 198 and 206. The number 56 shows twice. We show it as it is in the book. We do not fix it.',
  },
  {
    kind: 'text',
    id: 'jabbar',
    title: 'Square of al-Jabbar, 5 by 5',
    caption:
      'The book gives the number of this square but not the grid. We show only what the book gives.',
    source: 'John Friend, Shams al-Ma\u2019arif al-Kubra, Chapter 16',
    lines: ['Its number is 288 by utterance and 208 by figure.'],
    note: 'The grid itself is not in hand. We do not guess the cells.',
  },
  {
    kind: 'grid',
    id: 'solomon-triangle',
    title: 'Solomon triangle wafq, 3 by 3',
    caption:
      'A small square of nine numbers. Each row and each column and each diagonal adds to 15.',
    source: 'Radiant Jewels, pp. 47-48',
    rows: [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6],
    ],
  },
  {
    kind: 'text',
    id: 'fatiha-wafqs',
    title: 'Seven wafqs of the omitted letters of al-Fatiha',
    caption:
      'The book says there is a sevenfold wafq for every omitted letter of al-Fatiha. The rule is named here. No grid is drawn.',
    source: 'John Friend, Shams al-Ma\u2019arif al-Kubra, Chapter 13',
    lines: ['For every letter there is a sevenfold wafq.'],
    note: 'The grids are not in hand. We do not draw what we do not have.',
  },
  {
    kind: 'seals',
    id: 'seven-seals',
    title: 'The seven seals for the seven days',
    caption:
      'The book opens the chapter with this line. The form of the seven seals for the seven days. The seven marks below are the graphic marks found inside the seals.',
    source: 'Manba Usul al-Hikma, chapter The Seven Seals',
    symbols: [
      { key: 'star', name: 'Five pointed star' },
      { key: 'rods', name: 'Three rods' },
      { key: 'mim', name: 'Blind tailless Mim' },
      { key: 'ladder', name: 'Ladder' },
      { key: 'strokes', name: 'Four fingertip strokes' },
      { key: 'ha', name: 'Cleft Ha' },
      { key: 'waw', name: 'Curved Waw' },
    ],
    note: 'In the book the seals are seven grids of 4 by 4 with numbers and hand drawn marks. The grids are hand drawn in the book. They are not written out here. Only the seven marks are drawn.',
  },
];
