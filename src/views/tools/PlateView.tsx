import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { FilledToolPage } from './FilledToolPage';
import { copyTextToClipboard, saveSvgAsPng } from '../../utils/figureExport';

/**
 * Filled in Stage 3A from the Al Asrar notebook. Entries are listed
 * below with their source named; the search box filters them.
 *
 * The plate of metals is also shown on this page as a figure. The
 * pairs below are only the ones the entries on this page state: the
 * books name copper plates and a tin sheet too, but they do not tie
 * them to a planet in these entries, so they are named in the note,
 * not in the figure. The figure is fully usable on the page. Copy and
 * save-as-image are extras the visitor chooses.
 */
const PLATE_METALS: { metal: string; planet: string }[] = [
  { metal: 'Gold', planet: 'Sun' },
  { metal: 'Silver', planet: 'Moon' },
  { metal: 'Iron', planet: 'Mars' },
  { metal: 'Quicksilver', planet: 'Mercury' },
  { metal: 'Lead', planet: 'Saturn' },
];

function buildPlateSvg(): string {
  const size = 640;
  const height = 560;
  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${height}" viewBox="0 0 ${size} ${height}">`,
  );
  lines.push(`<rect x="0" y="0" width="${size}" height="${height}" fill="#0a0806"/>`);
  lines.push(
    `<rect x="14" y="14" width="${size - 28}" height="${height - 28}" fill="none" stroke="#e8b84f" stroke-width="3"/>`,
  );
  lines.push(
    `<rect x="26" y="26" width="${size - 52}" height="${height - 52}" fill="none" stroke="#e8b84f" stroke-width="1"/>`,
  );
  lines.push(
    `<text x="${size / 2}" y="96" font-family="Georgia, serif" font-size="26" fill="#e8b84f" text-anchor="middle">Lawh, the plate</text>`,
  );
  lines.push(
    `<text x="${size / 2}" y="128" font-family="Georgia, serif" font-size="15" fill="#ece6d8" text-anchor="middle">Each planet has its metal. The metal must match the planet.</text>`,
  );
  const top = 168;
  const rowHeight = 56;
  PLATE_METALS.forEach((row, i) => {
    const y = top + i * rowHeight;
    if (i > 0) {
      lines.push(
        `<line x1="56" y1="${y - 16}" x2="${size - 56}" y2="${y - 16}" stroke="#e8b84f" stroke-width="1"/>`,
      );
    }
    lines.push(
      `<text x="72" y="${y + 14}" font-family="Georgia, serif" font-size="22" fill="#ece6d8">${row.metal}</text>`,
    );
    lines.push(
      `<text x="${size - 72}" y="${y + 14}" font-family="Georgia, serif" font-size="22" fill="#e8b84f" text-anchor="end">${row.planet}</text>`,
    );
  });
  lines.push(
    `<text x="${size / 2}" y="${height - 42}" font-family="Georgia, serif" font-size="14" fill="#ece6d8" text-anchor="middle">Copper and tin are named as plates too. Their planets are not named here.</text>`,
  );
  lines.push('</svg>');
  return lines.join('\n');
}

export const PlateView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const q = query.trim().toLowerCase();
  const filter = q
    ? (entry: { title: string; body: string; source: string; arabic?: string; transliteration?: string; meaning?: string }) =>
        [entry.title, entry.body, entry.source, entry.arabic ?? '', entry.transliteration ?? '', entry.meaning ?? '']
          .some((field) => field.toLowerCase().includes(q))
    : undefined;

  const onCopy = async (): Promise<void> => {
    const text = PLATE_METALS.map((row) => `${row.metal} - ${row.planet}`).join('\n');
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSaveImage = async (): Promise<void> => {
    await saveSvgAsPng(buildPlateSvg(), 'plate-of-metals.png');
  };

  return (
    <FilledToolPage
      content={AL_ASRAR_TOOLS['plate']}
      title="Plate"
      eyebrow="Plate"
      subtitle="Plates of metal, one for each planet."
      filter={filter}
    >
      <div className="space-y-1.5" aria-label="Entries">
        <label className="ms-label" htmlFor="plate-search">
          Search entries
        </label>
        <input
          id="plate-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or page"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <section className="ms-card space-y-3" aria-label="The metals and their planets">
        <h2 className="ms-h2">The metals and their planets, shown on this page</h2>
        <p className="ms-body">
          Each planet has its metal, and the metal must match the planet. The Sun has gold. The Moon
          has silver. Mars has iron. Mercury has quicksilver. Saturn has lead.
        </p>
        <div
          className="border border-[var(--ms-border)] px-4 py-2"
          role="table"
          aria-label="Plate of metals and their planets"
        >
          {PLATE_METALS.map((row) => (
            <div
              key={row.metal}
              role="row"
              className="flex items-center justify-between gap-3 border-b border-[var(--ms-border)] py-2 last:border-b-0"
            >
              <span role="cell" className="ms-body">
                {row.metal}
              </span>
              <span role="cell" className="ms-body ms-gold">
                {row.planet}
              </span>
            </div>
          ))}
        </div>
        <p className="ms-note">
          The figure is fully shown above, on this page. No download is needed to see it or use it.
          The books also name copper plates and a tin sheet, but they do not tie them to a planet in
          the entries on this page.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="ms-btn-solid" onClick={onCopy}>
            {copied ? 'Copied' : 'Copy list'}
          </button>
          <button type="button" className="ms-btn-solid" onClick={onSaveImage}>
            Save as image
          </button>
        </div>
        <p className="ms-body ms-muted text-sm">
          Sources: Manba Usul al-Hikma, pp. 140-141; The Radiant Jewels for Summoning, p. 54; Shams
          al-Ma'arif al-Kubra (John Friend), p. 38.
        </p>
      </section>
    </FilledToolPage>
  );
};
