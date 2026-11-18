import React, { useMemo, useState } from 'react';
import {
  MAGIC_SQUARE_SOURCE,
  generateMagicSquare,
  isGenerateRefusal,
  isGenerateSuccess,
  magicConstant,
  orderKind,
  supportedOrders,
  validateMagicSquare,
} from '../../utils/magicSquare';
import type { GenerateResult, ValidationResult } from '../../utils/magicSquare';
import {
  copyTextToClipboard,
  gridToText,
  saveSvgAsPng,
} from '../../utils/figureExport';
import { ToolsLayout } from './ToolsLayout';

/**
 * Wafq Forge — build a magic square of order 3-20 at a chosen target
 * sum, and check it with a validator that is separate code from the
 * generator. SVG export and printing are only enabled after the
 * square passes validation. Maths and history only: nothing here
 * promises any outcome.
 */

const ORDERS = supportedOrders();

function buildSvg(order: number, target: number, grid: number[][], method: string): string {
  const size = 640;
  const margin = 56;
  const inner = size - margin * 2;
  const cell = inner / order;
  const fontSize = Math.min(28, Math.max(9, Math.floor(cell * 0.52)));
  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
  );
  lines.push(`<rect x="0" y="0" width="${size}" height="${size}" fill="#0a0806"/>`);
  // Seal frame: double gold border with corner marks.
  lines.push(
    `<rect x="14" y="14" width="${size - 28}" height="${size - 28}" fill="none" stroke="#e8b84f" stroke-width="3"/>`,
  );
  lines.push(
    `<rect x="26" y="26" width="${size - 52}" height="${size - 52}" fill="none" stroke="#e8b84f" stroke-width="1"/>`,
  );
  const corners: [number, number][] = [
    [14, 14],
    [size - 14, 14],
    [14, size - 14],
    [size - 14, size - 14],
  ];
  for (const [cx, cy] of corners) {
    lines.push(`<circle cx="${cx}" cy="${cy}" r="5" fill="#e8b84f"/>`);
  }
  // Grid.
  for (let r = 0; r <= order; r += 1) {
    const y = margin + r * cell;
    lines.push(
      `<line x1="${margin}" y1="${y}" x2="${margin + inner}" y2="${y}" stroke="#e8b84f" stroke-width="1"/>`,
    );
  }
  for (let c = 0; c <= order; c += 1) {
    const x = margin + c * cell;
    lines.push(
      `<line x1="${x}" y1="${margin}" x2="${x}" y2="${margin + inner}" stroke="#e8b84f" stroke-width="1"/>`,
    );
  }
  for (let r = 0; r < order; r += 1) {
    for (let c = 0; c < order; c += 1) {
      const x = margin + c * cell + cell / 2;
      const y = margin + r * cell + cell / 2 + fontSize * 0.35;
      lines.push(
        `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Georgia, serif" font-size="${fontSize}" fill="#ece6d8" text-anchor="middle">${grid[r][c]}</text>`,
      );
    }
  }
  lines.push(
    `<text x="${size / 2}" y="${size - 22}" font-family="Georgia, serif" font-size="14" fill="#e8b84f" text-anchor="middle">${order} x ${order} — every line sums to ${target} — ${method}</text>`,
  );
  lines.push('</svg>');
  return lines.join('\n');
}

function downloadSvg(order: number, target: number, grid: number[][], method: string): void {
  const svg = buildSvg(order, target, grid, method);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `wafq-${order}x${order}-${target}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const ForgeView: React.FC = () => {
  const [order, setOrder] = useState(3);
  const [targetInput, setTargetInput] = useState(String(magicConstant(3)));
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [a2Plate, setA2Plate] = useState(true);
  const [copied, setCopied] = useState(false);

  const validation: ValidationResult | null = useMemo(() => {
    if (!result || !isGenerateSuccess(result)) return null;
    return validateMagicSquare(result.grid, result.target);
  }, [result]);

  const passed = validation !== null && validation.pass;
  const baseConstant = magicConstant(order);
  const kind = orderKind(order);

  const chooseOrder = (n: number): void => {
    setOrder(n);
    setTargetInput(String(magicConstant(n)));
    setResult(null);
  };

  const onGenerate = (): void => {
    setResult(generateMagicSquare(order, Number(targetInput)));
  };

  const onCopy = async (): Promise<void> => {
    if (!result || !isGenerateSuccess(result)) return;
    const ok = await copyTextToClipboard(gridToText(result.grid));
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSavePng = async (): Promise<void> => {
    if (!result || !isGenerateSuccess(result)) return;
    await saveSvgAsPng(
      buildSvg(result.order, result.target, result.grid, result.method),
      `wafq-${result.order}x${result.order}-${result.target}.png`,
    );
  };

  const cellFontSize = order <= 5 ? 20 : order <= 9 ? 16 : order <= 14 ? 13 : 11;

  return (
    <ToolsLayout
      title="Wafq Forge — Magic Squares"
      eyebrow="Squares & Seals"
      subtitle="Build a magic square of order 3 to 20 at a target sum, then check it line by line. A square is only shown as passed when every row, column and diagonal adds up."
    >
      {/* Print rules live here so no existing file is touched. The plate
          prints at A2 proportions; everything else stays off the page. */}
      <style>{`
        .forge-print-plate { display: none; }
        .forge-seal-figure { max-width: 480px; margin: 0 auto; }
        .forge-seal-figure svg { width: 100%; height: auto; display: block; }
        @media print {
          @page { size: ${a2Plate ? 'A2' : 'A4'}; margin: 10mm; }
          body * { visibility: hidden; }
          .forge-print-plate, .forge-print-plate * { visibility: visible; }
          .forge-print-plate {
            display: flex; position: fixed; inset: 0;
            flex-direction: column; align-items: center; justify-content: center;
            gap: 12px; background: #fff; color: #111;
          }
        }
      `}</style>

      <section className="ms-card space-y-4">
        <div className="space-y-1.5">
          <span className="ms-label">Order (size of the square)</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Order">
            <button
              type="button"
              className="ms-toggle"
              disabled
              title="No magic square of order 2 exists."
              aria-disabled="true"
            >
              2 — not possible
            </button>
            {ORDERS.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={order === n}
                onClick={() => chooseOrder(n)}
                className="ms-toggle"
              >
                {n}x{n}
              </button>
            ))}
          </div>
          <p className="ms-note">
            {kind === 'odd' && 'Odd order — built by the Siamese method (de la Loubère).'}
            {kind === 'doubly even' && 'Doubly even order (divisible by 4) — built by the complement method.'}
            {kind === 'singly even' && 'Singly even order (even, not divisible by 4) — built by the LUX method (Conway).'}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="ms-label" htmlFor="forge-target">
            Target sum (default: the base constant {baseConstant})
          </label>
          <input
            id="forge-target"
            type="number"
            inputMode="numeric"
            className="ms-field ms-num"
            value={targetInput}
            onChange={(event) => {
              setTargetInput(event.target.value);
              setResult(null);
            }}
          />
          <p className="ms-note">
            The target must differ from {baseConstant} by a multiple of {order}, and must not be below{' '}
            {baseConstant}. Otherwise the square is refused, not forced.
          </p>
        </div>

        <button type="button" onClick={onGenerate} className="ms-btn-gold">
          Generate square
        </button>
      </section>

      {result && isGenerateRefusal(result) ? (
        <p className="ms-note-box" role="alert">
          This square cannot be made: {result.reason}
        </p>
      ) : null}

      {result && isGenerateSuccess(result) && validation ? (
        <>
          <section className="ms-card space-y-3">
            <h2 className="ms-h2">
              {result.order}x{result.order} square — target {result.target}
            </h2>
            <p className="ms-body">
              Method: {result.method}. Base constant {magicConstant(result.order)}
              {result.offset > 0 ? `, shifted by ${result.offset} in every cell.` : ', no shift.'}
            </p>
            <div
              className="grid gap-px"
              style={{ gridTemplateColumns: `repeat(${result.order}, minmax(0, 1fr))` }}
              role="table"
              aria-label={`${result.order} by ${result.order} magic square`}
            >
              {result.grid.flat().map((value, i) => (
                <div
                  key={i}
                  role="cell"
                  className="ms-num flex items-center justify-center border border-[var(--ms-border)] py-1.5"
                  style={{ fontSize: cellFontSize }}
                >
                  {value}
                </div>
              ))}
            </div>
            <p className="ms-note">
              The square is fully shown above, on this page. No download is needed to see it or use it.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="ms-btn-solid" disabled={!passed} onClick={onCopy}>
                {copied ? 'Copied' : 'Copy square'}
              </button>
            </div>
          </section>

          <section className="ms-card space-y-3" aria-live="polite">
            <h2 className="ms-h2">Validation — checked separately from the generator</h2>
            <p
              className="ms-num"
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: validation.pass ? 'var(--ms-green)' : 'var(--ms-red)',
              }}
            >
              {validation.pass ? 'PASS' : 'FAIL'}
            </p>
            {validation.failures.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 ms-body">
                {validation.failures.map((failure) => (
                  <li key={failure}>{failure}</li>
                ))}
              </ul>
            ) : (
              <p className="ms-body">
                Every row, every column and both diagonals sum to {validation.target}, and all{' '}
                {result.order * result.order} numbers are different positive whole numbers.
              </p>
            )}
            <div className="ms-table-wrap">
              <table className="ms-table">
                <thead>
                  <tr className="text-left">
                    <th scope="col" className="px-4 py-3 font-medium">Line</th>
                    <th scope="col" className="px-4 py-3 font-medium text-right">Sum</th>
                    <th scope="col" className="px-4 py-3 font-medium text-right">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {validation.rowSums.map((sum, i) => (
                    <tr key={`row-${i}`}>
                      <td className="px-4 py-2">Row {i + 1}</td>
                      <td className="px-4 py-2 text-right ms-num">{sum}</td>
                      <td className="px-4 py-2 text-right ms-num">{validation.target}</td>
                    </tr>
                  ))}
                  {validation.colSums.map((sum, i) => (
                    <tr key={`col-${i}`}>
                      <td className="px-4 py-2">Column {i + 1}</td>
                      <td className="px-4 py-2 text-right ms-num">{sum}</td>
                      <td className="px-4 py-2 text-right ms-num">{validation.target}</td>
                    </tr>
                  ))}
                  {validation.diagSums.map((sum, i) => (
                    <tr key={`diag-${i}`}>
                      <td className="px-4 py-2">
                        Diagonal {i === 0 ? 'top-left to bottom-right' : 'top-right to bottom-left'}
                      </td>
                      <td className="px-4 py-2 text-right ms-num">{sum}</td>
                      <td className="px-4 py-2 text-right ms-num">{validation.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ms-note">All numbers different: {validation.distinct ? 'yes' : 'no'}.</p>
          </section>

          <section className="ms-card space-y-3">
            <h2 className="ms-h2">Seal frame and plate</h2>
            <p className="ms-body">
              The framed seal is shown below, on this page. Copy it as text, save it as an image, or
              download the framed SVG. Print stays as an option too. All of these open only after the
              square passes validation.
            </p>
            <div
              className="forge-seal-figure"
              role="img"
              aria-label={`Framed ${result.order} by ${result.order} magic square, every line sums to ${result.target}`}
              dangerouslySetInnerHTML={{
                __html: buildSvg(result.order, result.target, result.grid, result.method),
              }}
            />
            <label className="flex items-center gap-2 ms-body">
              <input
                type="checkbox"
                checked={a2Plate}
                onChange={(event) => setA2Plate(event.target.checked)}
              />
              Print as an A2 plate (420 x 594 mm proportions)
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="ms-btn-solid" disabled={!passed} onClick={onSavePng}>
                Save as image
              </button>
              <button
                type="button"
                className="ms-btn-solid"
                disabled={!passed}
                onClick={() => downloadSvg(result.order, result.target, result.grid, result.method)}
              >
                Download framed SVG
              </button>
              <button type="button" className="ms-btn-gold" disabled={!passed} onClick={() => window.print()}>
                Print plate
              </button>
            </div>
            {!passed ? <p className="ms-note">Export and print stay off until the square passes.</p> : null}
          </section>

          {/* Print-only plate: hidden on screen, shown by the print rules above. */}
          <div className="forge-print-plate" aria-hidden="true">
            <div
              className="grid gap-px"
              style={{
                gridTemplateColumns: `repeat(${result.order}, minmax(0, 1fr))`,
                width: 'min(90%, 420mm)',
                aspectRatio: '420 / 594',
                border: '3px solid #111',
                padding: 16,
              }}
            >
              {result.grid.flat().map((value, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{ fontSize: 20, border: '1px solid #111' }}
                >
                  {value}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 16 }}>
              {result.order}x{result.order} — every line sums to {result.target} — {result.method}
            </p>
          </div>
        </>
      ) : null}

      <p className="ms-note">Constructions: {MAGIC_SQUARE_SOURCE}.</p>
    </ToolsLayout>
  );
};
