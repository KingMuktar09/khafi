import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { FilledToolPage } from './FilledToolPage';
import {
  buildFramedSquareSvg,
  copyTextToClipboard,
  gridToText,
  saveSvgAsPng,
} from '../../utils/figureExport';

/**
 * Filled in Stage 3A from the Al Asrar notebook. Entries are listed
 * below with their source named; the search box filters them.
 *
 * The 3 by 3 grid is also shown on this page as a figure, because the
 * books call it the seal of Solomon and of al-Ghazali. The numbers are
 * the classic 3 by 3 square: every row, every column and both
 * diagonals add to 15. The figure is fully usable on the page. Copy
 * and save-as-image are extras the visitor chooses.
 */
const SOLOMON_GRID: number[][] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

export const KhatamView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const q = query.trim().toLowerCase();
  const filter = q
    ? (entry: { title: string; body: string; source: string; arabic?: string; transliteration?: string; meaning?: string }) =>
        [entry.title, entry.body, entry.source, entry.arabic ?? '', entry.transliteration ?? '', entry.meaning ?? '']
          .some((field) => field.toLowerCase().includes(q))
    : undefined;

  const onCopy = async (): Promise<void> => {
    const ok = await copyTextToClipboard(gridToText(SOLOMON_GRID));
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSaveImage = async (): Promise<void> => {
    await saveSvgAsPng(
      buildFramedSquareSvg(SOLOMON_GRID, 'The seal of Solomon, 3 by 3, every line sums to 15'),
      'seal-of-solomon-3x3.png',
    );
  };

  return (
    <FilledToolPage
      content={AL_ASRAR_TOOLS['khatam']}
      title="Khatam"
      eyebrow="Khatam"
      subtitle="The Seal, and Solomon its master."
      filter={filter}
    >
      <div className="space-y-1.5" aria-label="Entries">
        <label className="ms-label" htmlFor="khatam-search">
          Search entries
        </label>
        <input
          id="khatam-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or page"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <section className="ms-card space-y-3" aria-label="The 3 by 3 grid, the seal of Solomon">
        <h2 className="ms-h2">The 3 by 3 grid, shown on this page</h2>
        <p className="ms-body">
          The books call the 3 by 3 grid the seal of Solomon and of al-Ghazali. Here it is, as the
          books give it. Every row, every column and both diagonals add to 15.
        </p>
        <div
          className="grid gap-px"
          style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
          role="table"
          aria-label="The seal of Solomon, a 3 by 3 grid"
        >
          {SOLOMON_GRID.flat().map((value, i) => (
            <div
              key={i}
              role="cell"
              className="ms-num flex items-center justify-center border border-[var(--ms-border)] py-2"
              style={{ fontSize: 20 }}
            >
              {value}
            </div>
          ))}
        </div>
        <p className="ms-note">
          The grid is fully shown above, on this page. No download is needed to see it or use it.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="ms-btn-solid" onClick={onCopy}>
            {copied ? 'Copied' : 'Copy grid'}
          </button>
          <button type="button" className="ms-btn-solid" onClick={onSaveImage}>
            Save as image
          </button>
        </div>
        <p className="ms-body ms-muted text-sm">
          Source: The Radiant Jewels for Summoning, p. 47. The numbers are the classic 3 by 3
          square, and every line sums to 15.
        </p>
      </section>
    </FilledToolPage>
  );
};
