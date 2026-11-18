import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateMagicSquare } from '../src/utils/magicSquare';
import { buildFramedSquareSvg, gridToText } from '../src/utils/figureExport';
import { I18N_TOOLS } from '../src/data/i18n-tools';

/**
 * No-PDF rule for the Wafq Forge, the seal (Khatam) and the plate.
 * Each figure must be fully shown on the page first, with a Copy
 * button and a save-as-image control, and no download may be required
 * to see or use it. Downloads stay only as an extra the visitor
 * chooses. The square maths, the validator and the verified content
 * are untouched: these tests read the view sources as text and check
 * the on-page behaviour, and the existing magicSquare tests still
 * cover the maths.
 */

function readView(name: string): string {
  return readFileSync(join(process.cwd(), 'src/views/tools', name), 'utf8');
}

describe('Wafq Forge: square usable on the page, no download needed', () => {
  const src = readView('ForgeView.tsx');

  it('renders the square grid on the page, not behind a download click', () => {
    expect(src).toContain('role="table"');
    // The grid aria-label lives in the tools chunk now; the view renders it through the key.
    expect(I18N_TOOLS.en['tools.forge.gridAria']).toBe('{order} by {order} magic square');
    expect(src).toContain("tfTools('tools.forge.gridAria'");
    // The grid section renders whenever a square is generated; the
    // download button is not part of that section.
    // The note lives in the tools chunk now; the view renders it through the key.
    expect(I18N_TOOLS.en['tools.forge.shownNote']).toContain('The square is fully shown above, on this page');
    expect(src).toContain("tTools('tools.forge.shownNote'");
  });

  it('has a Copy button that copies the square as text rows', () => {
    expect(I18N_TOOLS.en['tools.forge.copyBtn']).toBe('Copy square');
    expect(src).toContain("tTools('tools.forge.copyBtn'");
    expect(src).toContain('copyTextToClipboard');
    expect(src).toContain('gridToText(result.grid)');
  });

  it('shows the framed seal figure on the page and offers save-as-image', () => {
    expect(src).toContain('forge-seal-figure');
    expect(src).toContain('dangerouslySetInnerHTML');
    expect(I18N_TOOLS.en['tools.forge.saveImage']).toBe('Save as image');
    expect(src).toContain("tTools('tools.forge.saveImage'");
    expect(src).toContain('saveSvgAsPng');
  });

  it('keeps the framed SVG download and the print option as extras', () => {
    expect(I18N_TOOLS.en['tools.forge.downloadSvg']).toBe('Download framed SVG');
    expect(I18N_TOOLS.en['tools.forge.printPlate']).toBe('Print plate');
    expect(src).toContain("tTools('tools.forge.downloadSvg'");
    expect(src).toContain("tTools('tools.forge.printPlate'");
    expect(src).toContain('window.print()');
  });

  it('mentions no PDF anywhere: getting the square never needs one', () => {
    expect(src.toLowerCase()).not.toContain('pdf');
  });

  it('keeps copy, image save, SVG download and print behind validation PASS', () => {
    expect(src).toContain('disabled={!passed}');
    expect(I18N_TOOLS.en['tools.forge.exportOff']).toBe('Export and print stay off until the square passes.');
    expect(src).toContain("tTools('tools.forge.exportOff'");
  });
});

describe('figure export helpers', () => {
  it('gridToText writes one row of numbers per line', () => {
    expect(
      gridToText([
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6],
      ]),
    ).toBe('4 9 2\n3 5 7\n8 1 6');
  });

  it('buildFramedSquareSvg draws the grid numbers with a caption', () => {
    const svg = buildFramedSquareSvg(
      [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6],
      ],
      'The seal of Solomon, 3 by 3, every line sums to 15',
    );
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('>4<');
    expect(svg).toContain('>9<');
    expect(svg).toContain('>2<');
    expect(svg).toContain('every line sums to 15');
    expect(svg).toContain('</svg>');
  });
});

describe('Khatam (seal): the 3 by 3 Solomon grid on the page', () => {
  const src = readView('KhatamView.tsx');

  it('shows the Solomon grid on the page with its source named', () => {
    expect(I18N_TOOLS.en['tools.khatam.gridTitle']).toBe('The 3 by 3 grid, shown on this page');
    expect(src).toContain("tTools('tools.khatam.gridTitle'");
    expect(src).toContain('The Radiant Jewels for Summoning, p. 47');
    expect(src).toContain('role="table"');
    expect(I18N_TOOLS.en['tools.khatam.gridNote']).toContain('No download is needed to see it or use it');
    expect(src).toContain("tTools('tools.khatam.gridNote'");
  });

  it('has a Copy button and a save-as-image control', () => {
    expect(I18N_TOOLS.en['tools.khatam.copyGrid']).toBe('Copy grid');
    expect(src).toContain("tTools('tools.khatam.copyGrid'");
    expect(I18N_TOOLS.en['tools.khatam.saveImage']).toBe('Save as image');
    expect(src).toContain("tTools('tools.khatam.saveImage'");
    expect(src).toContain('copyTextToClipboard');
    expect(src).toContain('saveSvgAsPng');
  });

  it('mentions no PDF anywhere', () => {
    expect(src.toLowerCase()).not.toContain('pdf');
  });

  it('the Solomon grid is a valid magic square: every line sums to 15', () => {
    const grid = [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6],
    ];
    const check = validateMagicSquare(grid, 15);
    expect(check.pass).toBe(true);
    expect(check.failures).toEqual([]);
    expect(check.rowSums).toEqual([15, 15, 15]);
    expect(check.colSums).toEqual([15, 15, 15]);
    expect(check.diagSums).toEqual([15, 15]);
    expect(src).toContain('[4, 9, 2]');
    expect(src).toContain('[3, 5, 7]');
    expect(src).toContain('[8, 1, 6]');
  });
});

describe('Plate: the metals and their planets on the page', () => {
  const src = readView('PlateView.tsx');

  it('shows the plate figure on the page with its sources named', () => {
    expect(I18N_TOOLS.en['tools.plate.metalsTitle']).toBe('The metals and their planets, shown on this page');
    expect(src).toContain("tTools('tools.plate.metalsTitle'");
    expect(src).toContain('Manba Usul al-Hikma, pp. 140-141');
    expect(src).toContain('role="table"');
    expect(I18N_TOOLS.en['tools.plate.metalsNote']).toContain('No download is needed to see it or use it');
    expect(src).toContain("tTools('tools.plate.metalsNote'");
  });

  it('has a Copy button and a save-as-image control', () => {
    expect(I18N_TOOLS.en['tools.plate.copyList']).toBe('Copy list');
    expect(src).toContain("tTools('tools.plate.copyList'");
    expect(I18N_TOOLS.en['tools.plate.saveImage']).toBe('Save as image');
    expect(src).toContain("tTools('tools.plate.saveImage'");
    expect(src).toContain('copyTextToClipboard');
    expect(src).toContain('saveSvgAsPng');
  });

  it('mentions no PDF anywhere', () => {
    expect(src.toLowerCase()).not.toContain('pdf');
  });

  it('lists only the planet-metal pairs the entries state, and says copper and tin are not tied to a planet here', () => {
    expect(src).toContain("{ metal: 'Gold', planet: 'Sun' }");
    expect(src).toContain("{ metal: 'Silver', planet: 'Moon' }");
    expect(src).toContain("{ metal: 'Iron', planet: 'Mars' }");
    expect(src).toContain("{ metal: 'Quicksilver', planet: 'Mercury' }");
    expect(src).toContain("{ metal: 'Lead', planet: 'Saturn' }");
    expect(src).not.toContain("planet: 'Venus'");
    expect(src).not.toContain("planet: 'Jupiter'");
    expect(I18N_TOOLS.en['tools.plate.metalsNote']).toContain('do not tie them to a planet in');
    expect(I18N_TOOLS.en['tools.plate.metalsNote']).toContain('the entries on this page');
  });
});

describe('Qawaid rules page: no PDF route is offered', () => {
  it('mentions no PDF and keeps export behind PASS', () => {
    const src = readView('QawaidView.tsx');
    expect(src.toLowerCase()).not.toContain('pdf');
    expect(I18N_TOOLS.en['tools.qawaid.validatorBody2']).toContain('Export and printing open only after a PASS.');
    expect(src).toContain("tTools('tools.qawaid.validatorBody2'");
  });
});
