import React, { useMemo, useState } from 'react';
import { Grid3X3, CheckCircle2, Download, Printer, BookOpen, Sparkles, AlertTriangle } from 'lucide-react';
import { appState } from '../state/appState';
import { t, tf } from '../data/i18n';
import { router } from '../router/router';
import {
  LO_SHU,
  SHAMS_BOOK_TITLES,
  SHAMS_SOURCE,
  generateMagicSquare,
  magicConstant,
  verifyMagicSquare,
} from '../data/tools';

/**
 * Magic Square Maker (Wafq) — make a magic square, 3x3, 4x4, 5x5 or 7x7.
 *
 * A wafq is a square of numbers where every row, column and diagonal
 * adds up to the same total — the magic constant. Scholars of the
 * Islamic tradition, like al-Buni in Shams al-Ma'arif, studied these
 * squares as part of the science of letters and numbers. This tool is
 * the maths and the history only: it builds the square, checks every
 * sum, and shows you the pattern. It makes no claim that a square has
 * supernatural power, and it gives no instructions to use one for harm.
 *
 * Source label for the wafq tool: "Shams al-Ma'arif — The Sun of Knowledge,
 * translated by Amina Inloes (Revelore Press, 2021)". The catalog holds two
 * Shams al-Ma'arif books (linked below). The squares here are the classic,
 * well-known magic squares of the wafq tradition, verified by addition.
 */
const SIZES = [3, 4, 5, 7];

export const WafqView: React.FC = () => {
  const lang = appState.settings.language;
  const [size, setSize] = useState(3);
  const [showLoShu, setShowLoShu] = useState(false);
  const [copied, setCopied] = useState(false);

  const grid = useMemo(() => (showLoShu ? LO_SHU : generateMagicSquare(size)), [size, showLoShu]);
  const check = useMemo(() => (grid ? verifyMagicSquare(grid) : null), [grid]);
  const shamsBooks = appState
    .getVisibleBooks()
    .filter((b) => SHAMS_BOOK_TITLES.includes(b.title));

  const downloadSquare = () => {
    if (!grid || !check) return;
    const lines = [
      `Magic Square (Wafq) ${grid.length}x${grid.length}`,
      `Source: ${SHAMS_SOURCE}`,
      `Magic constant: ${check.constant}`,
      '',
      ...grid.map((row) => row.join('\t')),
      '',
      `Rows: ${check.rowSums.join(', ')}`,
      `Columns: ${check.colSums.join(', ')}`,
      `Diagonals: ${check.diagSums.join(', ')}`,
      `Verified: ${check.allOk ? 'every row, column and diagonal sums to the magic constant' : 'NOT verified'}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wafq-${grid.length}x${grid.length}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySquare = async () => {
    if (!grid) return;
    try {
      await navigator.clipboard.writeText(grid.map((row) => row.join('\t')).join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the download button still works
    }
  };

  if (!grid || !check) {
    return <div className="py-20 text-center text-sm text-[var(--text-muted)]">{t('wafq.chooseSize', lang)}</div>;
  }

  return (
    <div className="space-y-5 animate-fade-in py-2 font-sans max-w-3xl mx-auto">
      <div className="px-1">
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] flex items-center gap-2">
          <Grid3X3 className="w-6 h-6 text-[var(--gold)]" />
          <span>{t('wafq.title', lang)}</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {t('wafq.subtitle', lang)}
        </p>
      </div>

      {/* Strict disclaimer — at your own risk, top of the page */}
      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl flex items-start gap-3" role="alert">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-[var(--text-main)] leading-relaxed">
          {t('wafq.warning', lang)}
        </p>
      </div>

      <div className="p-5 ms-panel rounded-xl space-y-4">
        <div>
          <h2 className="font-display font-semibold text-sm text-[var(--text-main)]">{t('wafq.whatTitle', lang)}</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-1">
            {t('wafq.whatBefore', lang)}<span className="text-[var(--text-main)] font-semibold">wafq</span>{t('wafq.whatAfter', lang)}<span className="text-[var(--text-main)] font-semibold">{t('wafq.magicConstant', lang)}</span>{t('wafq.whatEnd', lang)}
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-sm text-[var(--text-main)]">{t('wafq.whereTitle', lang)}</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-1">
            {t('wafq.whereA', lang)}<span className="text-[var(--text-main)] font-semibold">Shams al-Ma'arif</span>{t('wafq.whereB', lang)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {t('wafq.sourceNoteA', lang)}<span className="text-[var(--gold)] font-semibold">{SHAMS_SOURCE}</span>{t('wafq.sourceNoteB', lang)}
          </p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-sm text-[var(--text-main)]">{t('wafq.howTitle', lang)}</h2>
          <ol className="text-sm text-[var(--text-muted)] leading-relaxed mt-1 list-decimal list-inside space-y-1">
            <li>{t('wafq.step1', lang)}</li>
            <li>{t('wafq.step2', lang)}</li>
            <li>{t('wafq.step3', lang)}</li>
            <li>{t('wafq.step4', lang)}</li>
          </ol>
        </div>
        <div>
          <h2 className="font-display font-semibold text-sm text-[var(--text-main)]">{t('wafq.exampleTitle', lang)}</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-1">
            {t('wafq.exampleIntro', lang)}
          </p>
          <div className="grid grid-cols-3 gap-1 max-w-[180px] mt-2" aria-label={t('wafq.loShuExampleAria', lang)}>
            {LO_SHU.flat().map((num, i) => (
              <div key={i} className="aspect-square flex items-center justify-center rounded-lg border border-[var(--gold)]/40 bg-[var(--bg-main)] font-display font-semibold text-[var(--text-main)]">
                {num}
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-2">
            {t('wafq.exampleRows', lang)}
            <br />
            {t('wafq.exampleCols', lang)}
            <br />
            {t('wafq.exampleDiags', lang)}
            <br />
            {tf('wafq.exampleSumsB', lang, { loShu: t('wafq.loShu', lang) })}
          </p>
        </div>
        {shamsBooks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {shamsBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => router.navigate('book', { bookId: book.id })}
                className="tap-target px-3 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{book.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Size picker */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('wafq.sizeAria', lang)}>
        <span className="text-xs font-semibold text-[var(--text-muted)]">{t('wafq.sizeLabel', lang)}</span>
        {SIZES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => { setSize(n); setShowLoShu(false); }}
            className={`tap-target px-4 py-2 rounded-full text-xs font-bold border cursor-pointer ${
              size === n && !showLoShu
                ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
            }`}
          >
            {n} × {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowLoShu(true)}
          className={`tap-target px-4 py-2 rounded-full text-xs font-bold border cursor-pointer flex items-center gap-1.5 ${
            showLoShu
              ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
              : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('wafq.loShu', lang)}</span>
        </button>
      </div>

      {/* The square */}
      <div className="p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--gold)]/30 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
            {showLoShu ? t('wafq.loShuTitle', lang) : tf('wafq.squareTitle', lang, { n: grid.length })}
          </h2>
          <span className="text-xs px-3 py-1.5 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-bold rounded-full">
            {tf('wafq.magicConstantLabel', lang, { n: check.constant })}
          </span>
        </div>
        <div
          className="grid gap-1.5 mx-auto w-full max-w-md"
          style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
        >
          {grid.flat().map((num, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center rounded-lg border border-[var(--gold)]/40 bg-[var(--bg-main)] font-display font-semibold text-[var(--text-main)] text-lg sm:text-2xl"
            >
              {num}
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center">
          {tf('wafq.methodNote', lang, { n: grid.length, c: magicConstant(grid.length) })}
        </p>

        {/* Verification */}
        <div className={`p-4 rounded-xl border ${check.allOk ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
          <p className="font-semibold text-sm flex items-center gap-2 text-[var(--text-main)]">
            <CheckCircle2 className={`w-4 h-4 ${check.allOk ? 'text-emerald-400' : 'text-red-400'}`} />
            <span>{check.allOk ? t('wafq.verified', lang) : t('wafq.notVerified', lang)}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2">
            {tf('wafq.rowsLine', lang, { sums: check.rowSums.join(' + '), c: check.constant, ok: t(check.rowsOk ? 'wafq.allMatch' : 'wafq.notMatch', lang) })}
            <br />
            {tf('wafq.colsLine', lang, { sums: check.colSums.join(', '), ok: t(check.colsOk ? 'wafq.allMatch' : 'wafq.notMatch', lang) })}
            <br />
            {tf('wafq.diagsLine', lang, { sums: check.diagSums.join(', '), ok: t(check.diagsOk ? 'wafq.bothMatch' : 'wafq.notMatch', lang) })}
            <br />
            {tf('wafq.numbersLine', lang, { total: grid.length * grid.length, yesno: t(check.usesAllNumbers ? 'wafq.yes' : 'wafq.no', lang) })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadSquare}
            className="tap-target px-4 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{t('wafq.download', lang)}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="tap-target px-4 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{t('wafq.print', lang)}</span>
          </button>
          <button
            type="button"
            onClick={copySquare}
            className="tap-target px-4 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-xs rounded-lg cursor-pointer"
          >
            {copied ? t('wafq.copied', lang) : t('wafq.copy', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
