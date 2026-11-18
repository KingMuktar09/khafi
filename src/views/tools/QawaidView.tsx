import React from 'react';
import {
  MAGIC_SQUARE_SOURCE,
  UNSUPPORTED_MODES,
  magicConstant,
  methodForOrder,
} from '../../utils/magicSquare';
import { ToolsLayout } from './ToolsLayout';

/**
 * Qawa'id — the rules of the Wafq Forge, in plain words.
 * Which construction is used for each order type, when a target can
 * be reached and when it is refused, how the separate validator
 * works, and which modes are not built because no rule and worked
 * example has been supplied for them. Nothing here promises any
 * outcome.
 */
export const QawaidView: React.FC = () => {
  return (
    <ToolsLayout
      title="Qawa'id — The Rules of the Squares"
      eyebrow="Squares & Seals"
      subtitle="How a square is built, when a target sum can be reached, how it is checked, and what is refused."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What a magic square is</h2>
        <p className="ms-body">
          A magic square is a grid of numbers where every row, every column and both diagonals add up to
          the same number. That number is called the magic constant, or target sum. The order is the
          number of cells along one side: a 3x3 square is order 3, a 4x4 square is order 4, and so on.
          For a square holding the numbers 1 to n squared, the constant is n times (n squared plus 1),
          divided by 2. So a 3x3 square sums to 15, a 4x4 to 34, a 5x5 to 65, and a 9x9 to 369.
        </p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">The method for each order type</h2>
        <p className="ms-body">
          Orders fall into three types, and each type has its own documented construction. The Forge
          first builds a base square holding the numbers 1 to n squared, then shifts it to the target
          sum (see the reachability rule below).
        </p>
        <div className="space-y-3">
          <div>
            <h3 className="ms-h3">Odd orders (3, 5, 7, 9, 11, 13, 15, 17, 19) — {methodForOrder(3)}</h3>
            <p className="ms-body">
              Start with 1 in the middle cell of the top row. Then step up one row and right one column,
              wrapping around the edges when you leave the grid. If the next cell is already filled, step
              down one row from the current cell instead. Keep going until every cell holds a number.
            </p>
          </div>
          <div>
            <h3 className="ms-h3">Doubly even orders (4, 8, 12, 16, 20) — {methodForOrder(4)}</h3>
            <p className="ms-body">
              Write the numbers 1 to n squared in order, row by row. Then, in every 4x4 block, replace
              each number sitting on a diagonal of that block with its complement: n squared plus 1 minus
              the number. The numbers off the diagonals stay as they are.
            </p>
          </div>
          <div>
            <h3 className="ms-h3">Singly even orders (6, 10, 14, 18) — {methodForOrder(6)}</h3>
            <p className="ms-body">
              Build an array of letters, L, U and X, one letter for each 2x2 block of the finished square.
              Fill the blocks with four consecutive numbers each, walking the letter array in the same
              up-and-right order as the Siamese method, starting in the middle block of the top row. Each
              letter says in which order the four numbers land inside its 2x2 block: L fills
              top-right, bottom-left, bottom-right, top-left; U fills top-left, bottom-left,
              bottom-right, top-right; X fills top-left, bottom-right, bottom-left, top-right. The
              letters are arranged so the finished square adds up on every line.
            </p>
          </div>
        </div>
        <p className="ms-note">Source: {MAGIC_SQUARE_SOURCE}.</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">The reachability rule</h2>
        <p className="ms-body">
          The base square sums to its constant M. Adding the same whole number d to every cell adds n
          times d to every line, so a target T can be reached exactly when (T minus M) divided by n is a
          whole number, and d is not negative. The smallest cell of the base square is 1, so a negative
          shift would make a cell zero or negative, and that is refused.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            3x3, target 27: the shift is (27 minus 15) / 3 = 4, so the cells run from 5 to 13. Allowed.
          </li>
          <li>
            3x3, target 18: the shift is (18 minus 15) / 3 = 1, so the cells run from 2 to 10. Allowed.
          </li>
          <li>
            3x3, target 16: the shift would be 1 / 3, which is not a whole number. Refused.
          </li>
          <li>
            3x3, target 12: the shift would be minus 1, which would make a cell zero. Refused.
          </li>
          <li>
            4x4, target 35: the shift would be 1 / 4, which is not a whole number. Refused.
          </li>
        </ul>
        <p className="ms-body">
          When a target is refused, the Forge says so in plain words and makes nothing. It never rounds
          the shift, never patches a cell, and never repeats a number to force a result that only looks
          valid.
        </p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">How the validator works</h2>
        <p className="ms-body">
          The validator is separate code from the generator. It does not know how the square was made,
          and it never trusts the generator: it adds up the grid it is given, cell by cell. It checks
          every row, every column and both diagonals against the target, and it checks that every cell is
          a different positive whole number. It works on hand-made grids too, not only on squares the
          Forge built.
        </p>
        <p className="ms-body">
          The result is shown as PASS or FAIL, with every line sum listed, so anyone can see which line
          is wrong and by how much. Export and printing open only after a PASS.
        </p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What is refused and why</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>Order 2: no magic square of order 2 exists.</li>
          <li>Orders below 3 or above 20: no construction is implemented and tested for them here.</li>
          <li>A target the shift cannot reach (shift not a whole number): refused, not rounded.</li>
          <li>A target below the base constant: refused, because a cell would become zero or negative.</li>
          <li>A target that is not a whole positive number: refused.</li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Modes that are not built</h2>
        <p className="ms-body">
          These square modes are not built, because no rule and no worked example has been supplied for
          them. They are listed here so the gap is visible, instead of being guessed at.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          {UNSUPPORTED_MODES.map((mode) => (
            <li key={mode.id}>
              <span className="font-medium ms-ink">{mode.label}: </span>
              {mode.note}
            </li>
          ))}
        </ul>
      </section>

      <p className="ms-note">
        Base constants for reference: 3x3 = {magicConstant(3)}, 4x4 = {magicConstant(4)}, 5x5 ={' '}
        {magicConstant(5)}, 6x6 = {magicConstant(6)}, 7x7 = {magicConstant(7)}, 8x8 ={' '}
        {magicConstant(8)}, 9x9 = {magicConstant(9)}, 10x10 = {magicConstant(10)}.
      </p>
    </ToolsLayout>
  );
};
