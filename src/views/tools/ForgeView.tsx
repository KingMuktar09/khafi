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
import type { SiteLanguage } from '../../types';
import { appState } from '../../state/appState';
import { localizeForgeReason, localizeValidationFailure, tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * Wafq Forge — build a magic square of order 3-20 at a chosen target
 * sum, and check it with a validator that is separate code from the
 * generator. SVG export and printing are only enabled after the
 * square passes validation. Maths and history only: nothing here
 * promises any outcome.
 */

const ORDERS = supportedOrders();

function buildSvg(order: number, target: number, grid: number[][], method: string, lang: SiteLanguage): string {
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
    `<text x="${size / 2}" y="${size - 22}" font-family="Georgia, serif" font-size="14" fill="#e8b84f" text-anchor="middle">${tfTools('tools.forge.svgCaption', lang, { order, target, method })}</text>`,
  );
  lines.push('</svg>');
  return lines.join('\n');
}

function downloadSvg(order: number, target: number, grid: number[][], method: string, lang: SiteLanguage): void {
  const svg = buildSvg(order, target, grid, method, lang);
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
  const lang = appState.settings.language;
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
      buildSvg(result.order, result.target, result.grid, result.method, lang),
      `wafq-${result.order}x${result.order}-${result.target}.png`,
    );
  };

  const cellFontSize = order <= 5 ? 20 : order <= 9 ? 16 : order <= 14 ? 13 : 11;

  return (
    <ToolsLayout
      title={tTools('tools.forge.title', lang)}
      eyebrow={tTools('tools.forge.eyebrow', lang)}
      subtitle={tTools('tools.forge.subtitle', lang)}
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
          <span className="ms-label">{tTools('tools.forge.orderLabel', lang)}</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label={tTools('tools.forge.orderLabel', lang)}>
            <button
              type="button"
              className="ms-toggle"
              disabled
              title={tTools('tools.forge.order2Title', lang)}
              aria-disabled="true"
            >
              {tTools('tools.forge.order2', lang)}
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
            {kind === 'odd' && tTools('tools.forge.kindOdd', lang)}
            {kind === 'doubly even' && tTools('tools.forge.kindDoubly', lang)}
            {kind === 'singly even' && tTools('tools.forge.kindSingly', lang)}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="ms-label" htmlFor="forge-target">
            {tfTools('tools.forge.targetLabel', lang, { n: baseConstant })}
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
            {tfTools('tools.forge.targetNote', lang, { base: baseConstant, order })}
          </p>
        </div>

        <button type="button" onClick={onGenerate} className="ms-btn-gold">
          {tTools('tools.forge.generate', lang)}
        </button>
      </section>

      {result && isGenerateRefusal(result) ? (
        <p className="ms-note-box" role="alert">
          {tTools('tools.forge.refusalPrefix', lang)} {localizeForgeReason(result.reason, lang)}
        </p>
      ) : null}

      {result && isGenerateSuccess(result) && validation ? (
        <>
          <section className="ms-card space-y-3">
            <h2 className="ms-h2">
              {tfTools('tools.forge.squareTitle', lang, { order: result.order, target: result.target })}
            </h2>
            <p className="ms-body">
              {tfTools('tools.forge.methodLineA', lang, { method: result.method, base: magicConstant(result.order) })}
              {result.offset > 0 ? tfTools('tools.forge.shiftSuffix', lang, { n: result.offset }) : tTools('tools.forge.noShift', lang)}
            </p>
            <div
              className="grid gap-px"
              style={{ gridTemplateColumns: `repeat(${result.order}, minmax(0, 1fr))` }}
              role="table"
              aria-label={tfTools('tools.forge.gridAria', lang, { order: result.order })}
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
              {tTools('tools.forge.shownNote', lang)}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="ms-btn-solid" disabled={!passed} onClick={onCopy}>
                {copied ? tTools('tools.common.copied', lang) : tTools('tools.forge.copyBtn', lang)}
              </button>
            </div>
          </section>

          <section className="ms-card space-y-3" aria-live="polite">
            <h2 className="ms-h2">{tTools('tools.forge.validationTitle', lang)}</h2>
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
                  <li key={failure}>{localizeValidationFailure(failure, lang)}</li>
                ))}
              </ul>
            ) : (
              <p className="ms-body">
                {tfTools('tools.forge.passBody', lang, { target: validation.target, n: result.order * result.order })}
              </p>
            )}
            <div className="ms-table-wrap">
              <table className="ms-table">
                <thead>
                  <tr className="text-left">
                    <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.forge.thLine', lang)}</th>
                    <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.forge.thSum', lang)}</th>
                    <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.forge.thTarget', lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {validation.rowSums.map((sum, i) => (
                    <tr key={`row-${i}`}>
                      <td className="px-4 py-2">{tfTools('tools.forge.rowLabel', lang, { n: i + 1 })}</td>
                      <td className="px-4 py-2 text-right ms-num">{sum}</td>
                      <td className="px-4 py-2 text-right ms-num">{validation.target}</td>
                    </tr>
                  ))}
                  {validation.colSums.map((sum, i) => (
                    <tr key={`col-${i}`}>
                      <td className="px-4 py-2">{tfTools('tools.forge.colLabel', lang, { n: i + 1 })}</td>
                      <td className="px-4 py-2 text-right ms-num">{sum}</td>
                      <td className="px-4 py-2 text-right ms-num">{validation.target}</td>
                    </tr>
                  ))}
                  {validation.diagSums.map((sum, i) => (
                    <tr key={`diag-${i}`}>
                      <td className="px-4 py-2">
                        {i === 0 ? tTools('tools.forge.diag1', lang) : tTools('tools.forge.diag2', lang)}
                      </td>
                      <td className="px-4 py-2 text-right ms-num">{sum}</td>
                      <td className="px-4 py-2 text-right ms-num">{validation.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ms-note">{tfTools('tools.forge.distinctLine', lang, { yesNo: validation.distinct ? tTools('tools.common.yes', lang) : tTools('tools.common.no', lang) })}</p>
          </section>

          <section className="ms-card space-y-3">
            <h2 className="ms-h2">{tTools('tools.forge.sealTitle', lang)}</h2>
            <p className="ms-body">
              {tTools('tools.forge.sealBody', lang)}
            </p>
            <div
              className="forge-seal-figure"
              role="img"
              aria-label={tfTools('tools.forge.framedAria', lang, { order: result.order, target: result.target })}
              dangerouslySetInnerHTML={{
                __html: buildSvg(result.order, result.target, result.grid, result.method, lang),
              }}
            />
            <label className="flex items-center gap-2 ms-body">
              <input
                type="checkbox"
                checked={a2Plate}
                onChange={(event) => setA2Plate(event.target.checked)}
              />
              {tTools('tools.forge.printA2', lang)}
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="ms-btn-solid" disabled={!passed} onClick={onSavePng}>
                {tTools('tools.forge.saveImage', lang)}
              </button>
              <button
                type="button"
                className="ms-btn-solid"
                disabled={!passed}
                onClick={() => downloadSvg(result.order, result.target, result.grid, result.method, lang)}
              >
                {tTools('tools.forge.downloadSvg', lang)}
              </button>
              <button type="button" className="ms-btn-gold" disabled={!passed} onClick={() => window.print()}>
                {tTools('tools.forge.printPlate', lang)}
              </button>
            </div>
            {!passed ? <p className="ms-note">{tTools('tools.forge.exportOff', lang)}</p> : null}
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
              {tfTools('tools.forge.svgCaption', lang, { order: result.order, target: result.target, method: result.method })}
            </p>
          </div>
        </>
      ) : null}

      <p className="ms-note">{tfTools('tools.forge.constructions', lang, { source: MAGIC_SQUARE_SOURCE })}</p>
    </ToolsLayout>
  );
};
