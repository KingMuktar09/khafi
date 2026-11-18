import React, { useState } from 'react';
import { Compass, BookOpen, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { appState } from '../state/appState';
import { t, tf } from '../data/i18n';
import { router } from '../router/router';
import { BookGrid } from '../components/books/BookGrid';
import { FINDER_MOODS, recommendBooks } from '../data/tools';
import type { FinderAnswers, FinderFormat, FinderLevel, FinderPick } from '../data/tools';

/**
 * Find My Next Book — 3 simple questions, then 3 real books.
 * Q1: what are you in the mood for (a category). Q2: starting out
 * or going deep. Q3: any book, PDF books only, or notes only.
 * Recommendations come only from the catalog, in its arranged
 * order, with reasons from each book's own topic and category.
 */
export const BookFinderView: React.FC = () => {
  const lang = appState.settings.language;
  const [moodId, setMoodId] = useState<string | null>(null);
  const [level, setLevel] = useState<FinderLevel | null>(null);
  const [format, setFormat] = useState<FinderFormat | null>(null);
  const [picks, setPicks] = useState<FinderPick[] | null>(null);

  const step = !moodId ? 1 : !level ? 2 : !format ? 3 : 4;

  const find = (answers: FinderAnswers) => {
    setPicks(recommendBooks(appState.getOrderedBooks(), answers));
  };

  const reset = () => {
    setMoodId(null);
    setLevel(null);
    setFormat(null);
    setPicks(null);
  };

  const mood = FINDER_MOODS.find((m) => m.id === moodId);

  return (
    <div className="space-y-5 animate-fade-in py-2 font-sans max-w-4xl mx-auto">
      <div className="px-1">
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] flex items-center gap-2">
          <Compass className="w-6 h-6 text-[var(--gold)]" />
          <span>{t('finder.title', lang)}</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {t('finder.subtitle', lang)}
        </p>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2 px-1">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
              step >= n
                ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-main)]'
            }`}
          >
            {n}
          </span>
        ))}
        <span className="text-xs text-[var(--text-muted)] ml-1">
          {step === 4 ? t('finder.yourBooks', lang) : tf('finder.questionOf', lang, { n: step })}
        </span>
        {picks && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto text-xs text-[var(--text-muted)] hover:text-[var(--gold)] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('finder.startAgain', lang)}</span>
          </button>
        )}
      </div>

      {step === 1 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-lg text-[var(--text-main)] px-1">{t('finder.q1', lang)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FINDER_MOODS.map((m) => {
              const count = appState.getVisibleBooks().filter((b) => b.category === m.category).length;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMoodId(m.id)}
                  className="tap-target text-left p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-1"
                >
                  <span className="font-display font-semibold text-base text-[var(--text-main)]">{t(`finder.mood.${m.id}.label`, lang)}</span>
                  <span className="block text-xs text-[var(--text-muted)] leading-relaxed">{t(`finder.mood.${m.id}.blurb`, lang)}</span>
                  <span className="block text-[11px] text-[var(--gold)] font-semibold">{tf(count === 1 ? 'library.countOne' : 'library.countMany', lang, { n: count })}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {step === 2 && mood && (
        <section className="space-y-3">
          <h2 className="font-semibold text-lg text-[var(--text-main)] px-1">
            {tf('finder.q2', lang, { mood: t(`finder.mood.${mood.id}.label`, lang) })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLevel('begin')}
              className="tap-target text-left p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-1"
            >
              <span className="font-display font-semibold text-base text-[var(--text-main)]">{t('finder.begin', lang)}</span>
              <span className="block text-xs text-[var(--text-muted)] leading-relaxed">
                {t('finder.beginBlurb', lang)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLevel('deep')}
              className="tap-target text-left p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-1"
            >
              <span className="font-display font-semibold text-base text-[var(--text-main)]">{t('finder.deep', lang)}</span>
              <span className="block text-xs text-[var(--text-muted)] leading-relaxed">
                {t('finder.deepBlurb', lang)}
              </span>
            </button>
          </div>
        </section>
      )}

      {step === 3 && mood && level && (
        <section className="space-y-3">
          <h2 className="font-semibold text-lg text-[var(--text-main)] px-1">{t('finder.q3', lang)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { key: 'any', label: t('finder.formatAny', lang), blurb: t('finder.formatAnyBlurb', lang) },
              { key: 'pdf', label: t('finder.formatPdf', lang), blurb: t('finder.formatPdfBlurb', lang) },
              { key: 'notes', label: t('finder.formatNotes', lang), blurb: t('finder.formatNotesBlurb', lang) },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setFormat(opt.key);
                  find({ moodId: mood.id, level, format: opt.key });
                }}
                className="tap-target text-left p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-1"
              >
                <span className="font-display font-semibold text-base text-[var(--text-main)]">{opt.label}</span>
                <span className="block text-xs text-[var(--text-muted)] leading-relaxed">{opt.blurb}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 4 && picks && mood && (
        <section className="space-y-4">
          <div className="p-5 bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
                {tf('finder.resultTitle', lang, { mood: t(`finder.mood.${mood.id}.label`, lang).toLowerCase(), level: t(level === 'begin' ? 'finder.levelBegin' : 'finder.levelDeep', lang) })}
              </h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
                {t('finder.resultText', lang)}
              </p>
            </div>
          </div>
          {picks.length === 0 ? (
            <div className="py-10 px-4 text-center bg-[var(--bg-surface)] border border-dashed border-[var(--border-main)] rounded-xl">
              <p className="font-semibold text-sm text-[var(--text-main)]">{t('finder.noMatch', lang)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{t('finder.tryDifferent', lang)}</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {picks.map((pick, i) => (
                  <div
                    key={pick.book.id}
                    onClick={() => router.navigate('book', { bookId: pick.book.id })}
                    className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 rounded-xl cursor-pointer flex items-start gap-3"
                  >
                    <span className="w-7 h-7 rounded-full bg-[var(--gold)] text-black text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-[var(--text-main)]">{pick.book.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">{pick.reason}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--gold)] shrink-0 mt-1" />
                  </div>
                ))}
              </div>
              <BookGrid books={picks.map((p) => p.book)} emptyMessage={t('finder.noBooks', lang)} />
            </>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="tap-target px-4 py-2.5 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-xs rounded-lg cursor-pointer"
            >
              {t('finder.findAnother', lang)}
            </button>
            <button
              type="button"
              onClick={() => router.navigate('library')}
              className="tap-target px-4 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('finder.browseAll', lang)}</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
