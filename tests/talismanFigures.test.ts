import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TALISMAN_FIGURES, STUDY_ONLY_NOTE } from '../src/data/talismanFigures';
import type { GridFigure, SealsFigure, TextFigure } from '../src/data/talismanFigures';

function findById<T extends { id: string }>(id: string): T {
  const figure = TALISMAN_FIGURES.find((item) => item.id === id);
  if (!figure) throw new Error(`missing figure: ${id}`);
  return figure as unknown as T;
}

function rowSums(grid: GridFigure): number[] {
  return grid.rows.map((row) => row.reduce((a, b) => a + b, 0));
}

function colSums(grid: GridFigure): number[] {
  return grid.rows[0].map((_, c) => grid.rows.reduce((a, row) => a + row[c], 0));
}

function diagSums(grid: GridFigure): [number, number] {
  const n = grid.rows.length;
  let d1 = 0;
  let d2 = 0;
  for (let i = 0; i < n; i += 1) {
    d1 += grid.rows[i][i];
    d2 += grid.rows[i][n - 1 - i];
  }
  return [d1, d2];
}

describe('talisman figures', () => {
  it('has exactly the five verified figures', () => {
    expect(TALISMAN_FIGURES.map((f) => f.id)).toEqual([
      'mutakabbir',
      'jabbar',
      'solomon-triangle',
      'fatiha-wafqs',
      'seven-seals',
    ]);
  });

  it('al-Mutakabbir grid is exactly as transcribed', () => {
    const figure = findById<GridFigure>('mutakabbir');
    expect(figure.kind).toBe('grid');
    expect(figure.rows).toEqual([
      [51, 58, 53, 44],
      [52, 25, 50, 56],
      [46, 55, 56, 41],
      [57, 48, 47, 54],
    ]);
  });

  it('al-Mutakabbir is honestly not a magic square', () => {
    const figure = findById<GridFigure>('mutakabbir');
    expect(rowSums(figure)).toEqual([206, 183, 198, 206]);
    const flat = figure.rows.flat();
    expect(flat.filter((v) => v === 56)).toHaveLength(2);
    expect(figure.note).toMatch(/does not check out as a magic square/);
    expect(figure.note).toMatch(/56 shows twice/);
  });

  it('Solomon triangle rows, columns and diagonals all sum to 15', () => {
    const figure = findById<GridFigure>('solomon-triangle');
    expect(figure.rows).toEqual([
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6],
    ]);
    expect(rowSums(figure)).toEqual([15, 15, 15]);
    expect(colSums(figure)).toEqual([15, 15, 15]);
    expect(diagSums(figure)).toEqual([15, 15]);
  });

  it('al-Jabbar has no grid cells anywhere', () => {
    const figure = findById<TextFigure>('jabbar');
    expect(figure.kind).toBe('text');
    expect(figure).not.toHaveProperty('rows');
    expect(figure.lines.join(' ')).toContain('288 by utterance and 208 by figure');
    expect(figure.note).toMatch(/grid itself is not in hand/);
  });

  it('Fatiha wafqs carry the rule as text only, with no grid', () => {
    const figure = findById<TextFigure>('fatiha-wafqs');
    expect(figure.kind).toBe('text');
    expect(figure).not.toHaveProperty('rows');
    expect(figure.lines.join(' ')).toContain('sevenfold wafq');
  });

  it('seven seals hold seven distinct marks and name the grids honestly', () => {
    const figure = findById<SealsFigure>('seven-seals');
    expect(figure.kind).toBe('seals');
    expect(figure.symbols).toHaveLength(7);
    expect(new Set(figure.symbols.map((s) => s.key)).size).toBe(7);
    expect(figure.symbols.map((s) => s.name)).toEqual([
      'Five pointed star',
      'Three rods',
      'Blind tailless Mim',
      'Ladder',
      'Four fingertip strokes',
      'Cleft Ha',
      'Curved Waw',
    ]);
    expect(figure.note).toMatch(/seven grids of 4 by 4/);
    expect(figure.note).toMatch(/hand drawn in the book/);
    expect(figure.caption).toContain('The form of the seven seals for the seven days.');
  });

  it('no 7 by 7 fever grid anywhere in the figures', () => {
    const raw = JSON.stringify(TALISMAN_FIGURES);
    expect(raw).not.toMatch(/7x7/);
    expect(raw).not.toMatch(/fever/i);
    expect(TALISMAN_FIGURES.some((f) => f.id.includes('fever'))).toBe(false);
  });

  it('every figure carries its source string', () => {
    for (const figure of TALISMAN_FIGURES) {
      expect(figure.source.length).toBeGreaterThan(10);
      expect(figure.title.length).toBeGreaterThan(0);
      expect(figure.caption.length).toBeGreaterThan(0);
    }
    expect(findById<GridFigure>('mutakabbir').source).toContain('Chapter 16');
    expect(findById<TextFigure>('jabbar').source).toContain('Chapter 16');
    expect(findById<GridFigure>('solomon-triangle').source).toContain('Radiant Jewels');
    expect(findById<TextFigure>('fatiha-wafqs').source).toContain('Chapter 13');
    expect(findById<SealsFigure>('seven-seals').source).toContain('Manba Usul al-Hikma');
  });

  it('study only note promises nothing and gives no ruling', () => {
    expect(STUDY_ONLY_NOTE).toMatch(/for study only/);
    expect(STUDY_ONLY_NOTE).toMatch(/do not promise any outcome/);
    expect(STUDY_ONLY_NOTE).toMatch(/no religious ruling/);
  });

  it('no em dash in the new files', () => {
    const files = [
      '../src/data/talismanFigures.ts',
      '../src/components/special/TalismanFigures.tsx',
      '../src/views/tools/TalasimView.tsx',
      '../src/views/tools/TalismStudioView.tsx',
      'talismanFigures.test.ts',
    ];
    for (const rel of files) {
      const text = readFileSync(resolve(__dirname, rel), 'utf8');
      expect(text).not.toContain('\u2014');
    }
  });
});
