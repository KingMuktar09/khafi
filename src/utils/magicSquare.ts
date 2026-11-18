/**
 * Magic squares (wafq) — pure logic, no React.
 *
 * Sources (checked 18 Nov 2026):
 * - Wikipedia, "Magic square" — classification into odd, doubly even
 *   (n divisible by 4) and singly even (n even but not divisible by 4);
 *   the magic constant M = n(n^2 + 1) / 2; the Siamese (de la Loubere)
 *   method for odd orders; the complement method for doubly even orders;
 *   and Conway's LUX method (with the Strachey method) for singly even
 *   orders. https://en.wikipedia.org/wiki/Magic_square
 * - Wikipedia, "Conway's LUX method for magic squares" — the exact LUX
 *   construction: a (2p+1)-by-(2p+1) array of letters (p+1 rows of L,
 *   1 row of U, p-1 rows of X, then the middle U exchanged with the L
 *   above it), filled block by block in Siamese order, each 2x2 block
 *   filled in the order its letter prescribes:
 *   L = [[4,1],[2,3]], U = [[1,4],[2,3]], X = [[1,4],[3,2]].
 *   https://en.wikipedia.org/wiki/Conway%27s_LUX_method_for_magic_squares
 *
 * What this file does and does not do:
 * - It builds a base square of 1..n^2 by the documented construction
 *   for the order, then shifts every cell by the same whole number to
 *   reach the requested target sum. Nothing else is ever done: no
 *   rounding, no patching, no repeated numbers.
 * - If the target cannot be reached that way (the shift is not a whole
 *   number, or cells would become zero or negative, or no documented
 *   construction exists for the order), it REFUSES with a plain-words
 *   reason instead of returning a square that only looks valid.
 * - The validator below is SEPARATE code from the generator: it adds
 *   up the grid it is given and checks the sums itself. It works on
 *   hand-made grids too, not only on generator output.
 * - These are maths and history only. Nothing here promises any
 *   outcome, protection, healing or provision.
 */

export type MagicGrid = number[][];

export const MAGIC_SQUARE_SOURCE =
  'Wikipedia, "Magic square" and "Conway\'s LUX method for magic squares" (constructions checked 18 Nov 2026)';

/** The magic constant: every row, column and diagonal must sum to this. */
export function magicConstant(n: number): number {
  return (n * (n * n + 1)) / 2;
}

export type OrderKind = 'odd' | 'doubly even' | 'singly even';

/** Odd, doubly even (n divisible by 4) or singly even (n even, not divisible by 4). */
export function orderKind(n: number): OrderKind | null {
  if (!Number.isInteger(n) || n < 3) return null;
  if (n % 2 === 1) return 'odd';
  if (n % 4 === 0) return 'doubly even';
  return 'singly even';
}

/** Plain-words name of the construction used for this order. */
export function methodForOrder(n: number): string | null {
  const kind = orderKind(n);
  if (kind === 'odd') return 'Siamese method (de la Loubère)';
  if (kind === 'doubly even') return 'Complement method';
  if (kind === 'singly even') return 'LUX method (Conway)';
  return null;
}

/**
 * Siamese method (de la Loubere) for odd n: start with 1 in the middle
 * of the top row, then step up and right, wrapping around the edges;
 * when the next cell is already filled, step down one from the
 * current cell instead.
 */
function siamese(n: number): MagicGrid {
  const grid: MagicGrid = Array.from({ length: n }, () => Array<number>(n).fill(0));
  let row = 0;
  let col = Math.floor(n / 2);
  for (let num = 1; num <= n * n; num += 1) {
    grid[row][col] = num;
    const nextRow = (row - 1 + n) % n;
    const nextCol = (col + 1) % n;
    if (grid[nextRow][nextCol] !== 0) {
      row = (row + 1) % n;
    } else {
      row = nextRow;
      col = nextCol;
    }
  }
  return grid;
}

/**
 * Complement method for doubly even n (n divisible by 4): write
 * 1..n^2 in order, then replace each number on the diagonals of every
 * 4x4 block with its complement (n^2 + 1 - value).
 */
function doublyEven(n: number): MagicGrid {
  const total = n * n;
  const grid: MagicGrid = [];
  for (let r = 0; r < n; r += 1) {
    const row: number[] = [];
    for (let c = 0; c < n; c += 1) {
      const value = r * n + c + 1;
      const onDiagonal = r % 4 === c % 4 || (r % 4) + (c % 4) === 3;
      row.push(onDiagonal ? total + 1 - value : value);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * LUX method (Conway) for singly even n (n = 4p + 2, p >= 1).
 * Build a (2p+1)-by-(2p+1) array of letters: p+1 rows of L, 1 row of
 * U, p-1 rows of X; then exchange the middle U with the L above it.
 * Each letter is one 2x2 block of the finished square. Fill the blocks
 * with four consecutive numbers each, walking the block array in
 * Siamese order (up and right, wrapping; down when obstructed),
 * starting in the middle block of the top row. Each block is filled
 * in the order its letter prescribes (the numbers 1-4 below are the
 * order the four consecutive numbers land in the block):
 *   L: [[4,1],[2,3]]  U: [[1,4],[2,3]]  X: [[1,4],[3,2]]
 */
function lux(n: number): MagicGrid {
  const p = (n - 2) / 4;
  const size = 2 * p + 1; // block array is size x size; n = 2 * size
  const letters: string[][] = [];
  for (let r = 0; r < size; r += 1) {
    const letter = r <= p ? 'L' : r === p + 1 ? 'U' : 'X';
    letters.push(Array<string>(size).fill(letter));
  }
  // Exchange the middle U with the L above it.
  letters[p + 1][p] = 'L';
  letters[p][p] = 'U';

  const fillOrder: Record<string, number[][]> = {
    L: [
      [4, 1],
      [2, 3],
    ],
    U: [
      [1, 4],
      [2, 3],
    ],
    X: [
      [1, 4],
      [3, 2],
    ],
  };

  const grid: MagicGrid = Array.from({ length: n }, () => Array<number>(n).fill(0));
  const filled: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  let blockRow = 0;
  let blockCol = p; // middle block of the top row
  for (let block = 0; block < size * size; block += 1) {
    const base = block * 4 + 1;
    const pattern = fillOrder[letters[blockRow][blockCol]];
    for (let dr = 0; dr < 2; dr += 1) {
      for (let dc = 0; dc < 2; dc += 1) {
        grid[blockRow * 2 + dr][blockCol * 2 + dc] = base + pattern[dr][dc] - 1;
      }
    }
    filled[blockRow][blockCol] = true;
    const nextRow = (blockRow - 1 + size) % size;
    const nextCol = (blockCol + 1) % size;
    if (filled[nextRow][nextCol]) {
      blockRow = (blockRow + 1) % size;
    } else {
      blockRow = nextRow;
      blockCol = nextCol;
    }
  }
  return grid;
}

/** The base (1..n^2) square for an order, or null when no construction is implemented. */
function baseSquare(n: number): MagicGrid | null {
  const kind = orderKind(n);
  if (kind === 'odd') return siamese(n);
  if (kind === 'doubly even') return doublyEven(n);
  if (kind === 'singly even') return lux(n);
  return null;
}

export type GenerateResult =
  | {
      ok: true;
      order: number;
      target: number;
      /** Whole-number amount added to every cell of the base square (0 at the base constant). */
      offset: number;
      method: string;
      grid: MagicGrid;
    }
  | { ok: false; reason: string };

/**
 * Type guards for GenerateResult. This repo's tsconfig does not enable
 * `strict`, so a plain `result.ok` check does not narrow the union —
 * use these helpers wherever the success or refusal shape is needed.
 */
export function isGenerateSuccess(
  result: GenerateResult,
): result is Extract<GenerateResult, { ok: true }> {
  return result.ok;
}

export function isGenerateRefusal(
  result: GenerateResult,
): result is Extract<GenerateResult, { ok: false }> {
  return !result.ok;
}

/**
 * Build a magic square of the given order whose rows, columns and
 * diagonals all sum to `target`.
 *
 * The base square holds 1..n^2 and sums to M = n(n^2+1)/2. Adding the
 * same whole number d to every cell adds n*d to every line, so the
 * target is reachable exactly when (target - M) / n is a whole number
 * and d >= 0 (the smallest base cell is 1, so a negative shift would
 * make a cell zero or negative). Otherwise this refuses — it never
 * forces, rounds, patches or repeats numbers.
 */
export function generateMagicSquare(order: number, target: number): GenerateResult {
  if (!Number.isInteger(order) || order < 3 || order > 20) {
    return {
      ok: false,
      reason: `Order ${order} is not supported. Orders 3 to 20 only, and order 2 has no magic square at all.`,
    };
  }
  const method = methodForOrder(order);
  const base = baseSquare(order);
  if (method === null || base === null) {
    return {
      ok: false,
      reason: `No documented construction is implemented for order ${order}, so no square is made.`,
    };
  }
  if (!Number.isInteger(target) || target <= 0) {
    return { ok: false, reason: 'The target sum must be a whole positive number.' };
  }
  const baseConstant = magicConstant(order);
  const shift = target - baseConstant;
  if (shift % order !== 0) {
    return {
      ok: false,
      reason:
        `Target ${target} cannot be reached for a ${order}x${order} square. ` +
        `The base square sums to ${baseConstant}, and shifting every cell by the same whole number ` +
        `changes each line by a multiple of ${order}, so ${target} cannot be reached that way. ` +
        `Pick a target that differs from ${baseConstant} by a multiple of ${order}.`,
    };
  }
  const offset = shift / order;
  if (offset < 0) {
    return {
      ok: false,
      reason:
        `Target ${target} is below the base sum ${baseConstant} for a ${order}x${order} square. ` +
        `Reaching it would need a shift of ${offset}, which would make the smallest cell zero or negative. ` +
        `Only targets of ${baseConstant} or more can be made this way.`,
    };
  }
  const grid = base.map((row) => row.map((cell) => cell + offset));
  return { ok: true, order, target, offset, method, grid };
}

/**
 * Orders the generator supports: 3-20, every one of them covered by a
 * test that checks the generator output with the independent validator.
 */
export function supportedOrders(): number[] {
  const orders: number[] = [];
  for (let n = 3; n <= 20; n += 1) orders.push(n);
  return orders;
}

export interface ValidationResult {
  pass: boolean;
  target: number;
  rowSums: number[];
  colSums: number[];
  diagSums: number[];
  distinct: boolean;
  failures: string[];
}

/**
 * Validate a square INDEPENDENTLY of the generator: add up every row,
 * every column and both diagonals from the grid itself, and check that
 * every cell is a distinct positive whole number. Works on hand-made
 * grids too — it never calls the generator and never assumes where the
 * grid came from. A grid that is not square, empty, or holds
 * non-numbers fails with a named reason.
 */
export function validateMagicSquare(grid: MagicGrid, target: number): ValidationResult {
  const failures: string[] = [];
  const rowSums: number[] = [];
  const colSums: number[] = [];
  const diagSums: number[] = [0, 0];

  if (!Array.isArray(grid) || grid.length === 0) {
    return { pass: false, target, rowSums, colSums, diagSums, distinct: false, failures: ['The grid is empty.'] };
  }
  const n = grid.length;
  const square = grid.every((row) => Array.isArray(row) && row.length === n);
  if (!square) {
    return {
      pass: false,
      target,
      rowSums,
      colSums,
      diagSums,
      distinct: false,
      failures: ['The grid is not square: every row must have the same number of cells as there are rows.'],
    };
  }

  const seen = new Set<number>();
  let distinct = true;
  let allWholePositive = true;
  for (let r = 0; r < n; r += 1) {
    let rowSum = 0;
    for (let c = 0; c < n; c += 1) {
      const value = grid[r][c];
      if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
        allWholePositive = false;
        failures.push(`Cell row ${r + 1}, column ${c + 1} is not a positive whole number.`);
        continue;
      }
      if (seen.has(value)) {
        distinct = false;
        failures.push(`The number ${value} appears more than once.`);
      }
      seen.add(value);
      rowSum += value;
    }
    rowSums.push(rowSum);
    if (rowSum !== target) failures.push(`Row ${r + 1} sums to ${rowSum}, not ${target}.`);
  }

  for (let c = 0; c < n; c += 1) {
    let colSum = 0;
    for (let r = 0; r < n; r += 1) {
      const value = grid[r][c];
      if (typeof value === 'number' && Number.isInteger(value) && value > 0) colSum += value;
    }
    colSums.push(colSum);
    if (colSum !== target) failures.push(`Column ${c + 1} sums to ${colSum}, not ${target}.`);
  }

  for (let i = 0; i < n; i += 1) {
    const a = grid[i][i];
    const b = grid[i][n - 1 - i];
    if (typeof a === 'number' && Number.isInteger(a) && a > 0) diagSums[0] += a;
    if (typeof b === 'number' && Number.isInteger(b) && b > 0) diagSums[1] += b;
  }
  if (diagSums[0] !== target) failures.push(`Diagonal (top-left to bottom-right) sums to ${diagSums[0]}, not ${target}.`);
  if (diagSums[1] !== target) failures.push(`Diagonal (top-right to bottom-left) sums to ${diagSums[1]}, not ${target}.`);

  if (!allWholePositive && !failures.some((f) => f.startsWith('Cell row'))) {
    failures.push('Some cells are not positive whole numbers.');
  }
  if (!distinct) {
    // Keep the per-number failures above; add a plain summary line.
    failures.push('Not all numbers are different.');
  }

  return { pass: failures.length === 0, target, rowSums, colSums, diagSums, distinct, failures };
}

export interface UnsupportedMode {
  id: string;
  label: string;
  note: string;
}

/**
 * Square modes that are NOT built: no rule and no worked example has
 * been supplied for any of them, so they are listed here as
 * "source needed" instead of being guessed at.
 */
export const UNSUPPORTED_MODES: UnsupportedMode[] = [
  { id: 'multiplied', label: 'Multiplied squares', note: 'Source needed — no rule and worked example supplied.' },
  { id: 'cycling', label: 'Cycling squares', note: 'Source needed — no rule and worked example supplied.' },
  { id: 'hollow centre', label: 'Hollow-centre squares', note: 'Source needed — no rule and worked example supplied.' },
  { id: 'grand wafq', label: 'Grand wafq', note: 'Source needed — no rule and worked example supplied.' },
];
