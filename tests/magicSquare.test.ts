import { describe, it, expect } from 'vitest';
import {
  UNSUPPORTED_MODES,
  generateMagicSquare,
  isGenerateRefusal,
  isGenerateSuccess,
  magicConstant,
  supportedOrders,
  validateMagicSquare,
} from '../src/utils/magicSquare';
import type { MagicGrid } from '../src/utils/magicSquare';

/** Every generated grid must pass the independent validator at its target. */
function expectGeneratedValid(order: number, target: number): MagicGrid {
  const result = generateMagicSquare(order, target);
  expect(result.ok).toBe(true);
  if (!isGenerateSuccess(result)) throw new Error(`Expected order ${order} target ${target} to generate, got refusal: ${result.reason}`);
  const check = validateMagicSquare(result.grid, target);
  expect(check.pass).toBe(true);
  expect(check.failures).toEqual([]);
  expect(check.distinct).toBe(true);
  expect(check.rowSums.every((s) => s === target)).toBe(true);
  expect(check.colSums.every((s) => s === target)).toBe(true);
  expect(check.diagSums.every((s) => s === target)).toBe(true);
  const flat = result.grid.flat();
  expect(new Set(flat).size).toBe(order * order);
  expect(Math.min(...flat)).toBeGreaterThan(0);
  return result.grid;
}

describe('magic constants', () => {
  it('matches the formula M = n(n^2 + 1) / 2 for known orders', () => {
    expect(magicConstant(3)).toBe(15);
    expect(magicConstant(4)).toBe(34);
    expect(magicConstant(5)).toBe(65);
    expect(magicConstant(6)).toBe(111);
    expect(magicConstant(7)).toBe(175);
    expect(magicConstant(8)).toBe(260);
    expect(magicConstant(9)).toBe(369);
    expect(magicConstant(10)).toBe(505);
    expect(magicConstant(12)).toBe(870);
    expect(magicConstant(20)).toBe(4010);
  });
});

describe('generator at the base constant', () => {
  it.each([
    [3, 15],
    [4, 34],
    [5, 65],
    [6, 111],
    [7, 175],
    [8, 260],
    [9, 369],
    [10, 505],
    [12, 870],
    [20, 4010],
  ])('order %i sums to %i on every row, column and diagonal', (order, target) => {
    expectGeneratedValid(order, target);
  });

  it('supports every order from 3 to 20, each passing the validator', () => {
    expect(supportedOrders()).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    for (const order of supportedOrders()) {
      expectGeneratedValid(order, magicConstant(order));
    }
  });

  it('produces the classic 1..n^2 base square at the base constant', () => {
    const grid = expectGeneratedValid(3, 15);
    expect(grid.flat().sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const grid5 = expectGeneratedValid(5, 65);
    expect(grid5.flat().sort((a, b) => a - b)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });
});

describe('shifted sums', () => {
  it('3x3 target 27 shifts by 4: cells 5..13, all lines sum to 27', () => {
    const grid = expectGeneratedValid(3, 27);
    expect(grid.flat().sort((a, b) => a - b)).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  it('3x3 target 18 shifts by 1: cells 2..10', () => {
    const grid = expectGeneratedValid(3, 18);
    expect(grid.flat().sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('5x5 target 90 shifts by 5: cells 6..30', () => {
    const grid = expectGeneratedValid(5, 90);
    expect(grid.flat().sort((a, b) => a - b)).toEqual(Array.from({ length: 25 }, (_, i) => i + 6));
  });
});

describe('must-reject cases', () => {
  it('refuses 3x3 target 16: the shift (1/3) is not a whole number', () => {
    const result = generateMagicSquare(3, 16);
    expect(result.ok).toBe(false);
    if (!isGenerateRefusal(result)) throw new Error('Expected a refusal');
    expect(result.reason).toMatch(/cannot be reached/i);
  });

  it('refuses 3x3 target 12: the shift (-1) would make a cell zero', () => {
    const result = generateMagicSquare(3, 12);
    expect(result.ok).toBe(false);
    if (!isGenerateRefusal(result)) throw new Error('Expected a refusal');
    expect(result.reason).toMatch(/zero or negative/i);
  });

  it('refuses 4x4 target 35: the shift (1/4) is not a whole number', () => {
    const result = generateMagicSquare(4, 35);
    expect(result.ok).toBe(false);
    if (!isGenerateRefusal(result)) throw new Error('Expected a refusal');
    expect(result.reason).toMatch(/cannot be reached/i);
  });

  it('refuses order 2: no magic square of order 2 exists', () => {
    const result = generateMagicSquare(2, 5);
    expect(result.ok).toBe(false);
  });

  it('refuses orders outside 3-20', () => {
    expect(generateMagicSquare(1, 1).ok).toBe(false);
    expect(generateMagicSquare(21, 1000).ok).toBe(false);
  });

  it('refuses a non-whole or non-positive target', () => {
    expect(generateMagicSquare(3, 15.5).ok).toBe(false);
    expect(generateMagicSquare(3, 0).ok).toBe(false);
  });
});

describe('validator independence', () => {
  it('passes the hand-made Lo Shu 3x3 square', () => {
    const loShu: MagicGrid = [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6],
    ];
    const check = validateMagicSquare(loShu, 15);
    expect(check.pass).toBe(true);
    expect(check.rowSums).toEqual([15, 15, 15]);
    expect(check.colSums).toEqual([15, 15, 15]);
    expect(check.diagSums).toEqual([15, 15]);
    expect(check.distinct).toBe(true);
    expect(check.failures).toEqual([]);
  });

  it('fails when two cells are swapped, naming the broken lines', () => {
    const broken: MagicGrid = [
      [9, 4, 2],
      [3, 5, 7],
      [8, 1, 6],
    ];
    const check = validateMagicSquare(broken, 15);
    expect(check.pass).toBe(false);
    expect(check.failures.join(' ')).toMatch(/Column 1/);
    expect(check.failures.join(' ')).toMatch(/Column 2/);
    expect(check.failures.join(' ')).toMatch(/Diagonal/);
  });

  it('fails distinctness when a number repeats', () => {
    const repeated: MagicGrid = [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 1],
    ];
    const check = validateMagicSquare(repeated, 15);
    expect(check.pass).toBe(false);
    expect(check.distinct).toBe(false);
    expect(check.failures.join(' ')).toMatch(/more than once/);
  });

  it('fails with the row named when a row sum is wrong', () => {
    const wrongRow: MagicGrid = [
      [4, 9, 3],
      [3, 5, 7],
      [8, 1, 6],
    ];
    const check = validateMagicSquare(wrongRow, 15);
    expect(check.pass).toBe(false);
    expect(check.rowSums[0]).toBe(16);
    expect(check.failures).toContain('Row 1 sums to 16, not 15.');
  });

  it('fails a non-square grid and an empty grid', () => {
    expect(validateMagicSquare([[1, 2], [3]], 5).pass).toBe(false);
    expect(validateMagicSquare([], 0).pass).toBe(false);
  });

  it('does not trust the generator: a grid that only looks magic fails', () => {
    // Every row and column sums to 15, but the diagonals do not — not a magic square.
    const semi: MagicGrid = [
      [1, 5, 9],
      [6, 7, 2],
      [8, 3, 4],
    ];
    expect(validateMagicSquare(semi, 15).rowSums).toEqual([15, 15, 15]);
    expect(validateMagicSquare(semi, 15).pass).toBe(false);
  });
});

describe('unbuilt modes', () => {
  it('lists the four unbuilt modes as source needed', () => {
    expect(UNSUPPORTED_MODES.map((m) => m.id)).toEqual([
      'multiplied',
      'cycling',
      'hollow centre',
      'grand wafq',
    ]);
    for (const mode of UNSUPPORTED_MODES) {
      expect(mode.note).toMatch(/source needed/i);
    }
  });
});
