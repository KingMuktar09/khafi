import React from 'react';
import {
  STUDY_ONLY_NOTE,
  TALISMAN_FIGURES,
  type GridFigure,
  type SealSymbolKey,
  type SealsFigure,
  type TextFigure,
} from '../../data/talismanFigures';

const CELL = 64;

/** Draws a grid of numbers as SVG, exactly as given in the data. */
function NumberGridSvg({ figure }: { figure: GridFigure }) {
  const n = figure.rows.length;
  const size = n * CELL;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${figure.title} number grid`}
      className="mx-auto w-full max-w-64"
    >
      {figure.rows.map((row, r) =>
        row.map((value, c) => (
          <g key={`${r}-${c}`}>
            <rect
              x={c * CELL}
              y={r * CELL}
              width={CELL}
              height={CELL}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <text
              x={c * CELL + CELL / 2}
              y={r * CELL + CELL / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="24"
              fill="currentColor"
            >
              {value}
            </text>
          </g>
        )),
      )}
    </svg>
  );
}

/** One of the seven seal marks, drawn as plain line art. */
function SealSymbolSvg({ symbolKey, label }: { symbolKey: SealSymbolKey; label: string }) {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={label} className="mx-auto h-20 w-20">
      {symbolKey === 'star' ? (
        <polygon
          points="50,12 58.8,37.9 86.1,38.3 64.3,54.6 72.3,80.7 50,65 27.7,80.7 35.7,54.6 13.9,38.3 41.2,37.9"
          {...stroke}
        />
      ) : null}
      {symbolKey === 'rods' ? (
        <g {...stroke}>
          <line x1="35" y1="20" x2="35" y2="80" />
          <line x1="50" y1="20" x2="50" y2="80" />
          <line x1="65" y1="20" x2="65" y2="80" />
        </g>
      ) : null}
      {symbolKey === 'mim' ? <circle cx="50" cy="55" r="22" {...stroke} /> : null}
      {symbolKey === 'ladder' ? (
        <g {...stroke}>
          <line x1="35" y1="15" x2="35" y2="85" />
          <line x1="65" y1="15" x2="65" y2="85" />
          <line x1="35" y1="30" x2="65" y2="30" />
          <line x1="35" y1="45" x2="65" y2="45" />
          <line x1="35" y1="60" x2="65" y2="60" />
          <line x1="35" y1="75" x2="65" y2="75" />
        </g>
      ) : null}
      {symbolKey === 'strokes' ? (
        <g {...stroke}>
          <line x1="30" y1="68" x2="38" y2="52" />
          <line x1="42" y1="70" x2="50" y2="54" />
          <line x1="54" y1="70" x2="62" y2="54" />
          <line x1="66" y1="68" x2="74" y2="52" />
        </g>
      ) : null}
      {symbolKey === 'ha' ? (
        <g {...stroke}>
          <path d="M50 20 C35 20 30 35 30 50 C30 68 38 80 50 80 C62 80 70 68 70 50 C70 35 65 20 50 20" />
          <line x1="50" y1="22" x2="50" y2="78" />
        </g>
      ) : null}
      {symbolKey === 'waw' ? (
        <path d="M68 22 C68 48 56 60 46 60 C36 60 30 70 38 78 C44 84 56 84 64 76" {...stroke} />
      ) : null}
    </svg>
  );
}

function FigureCard({ figure }: { figure: GridFigure | TextFigure | SealsFigure }) {
  return (
    <article className="ms-card space-y-3">
      <h3 className="ms-h3">{figure.title}</h3>
      {figure.kind === 'grid' ? <NumberGridSvg figure={figure} /> : null}
      {figure.kind === 'text' ? (
        <div className="space-y-2">
          {figure.lines.map((line) => (
            <p key={line} className="ms-body text-center text-lg">
              {line}
            </p>
          ))}
        </div>
      ) : null}
      {figure.kind === 'seals' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {figure.symbols.map((symbol) => (
            <figure key={symbol.key} className="space-y-1 text-center">
              <SealSymbolSvg symbolKey={symbol.key} label={symbol.name} />
              <figcaption className="ms-body text-sm">{symbol.name}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      <p className="ms-body">{figure.caption}</p>
      {figure.note ? <p className="ms-body">{figure.note}</p> : null}
      <p className="ms-body ms-muted text-sm">Source: {figure.source}</p>
    </article>
  );
}

/**
 * Figures section shared by the Talasim and Talism Studio pages.
 * Every figure is drawn from verified data in src/data/talismanFigures.ts.
 * Nothing here is guessed and nothing promises an outcome.
 */
export const TalismanFiguresSection: React.FC = () => (
  <section className="space-y-4" aria-label="Figures">
    <h2 className="ms-h2">Figures</h2>
    <p className="ms-note-box" role="note">
      {STUDY_ONLY_NOTE}
    </p>
    {TALISMAN_FIGURES.map((figure) => (
      <FigureCard key={figure.id} figure={figure} />
    ))}
  </section>
);
