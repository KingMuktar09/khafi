import React from 'react';
import { ArrowLeft, BookOpen, Compass } from 'lucide-react';
import { getTimeline } from '../data/specialFeatures';
import { appState } from '../state/appState';
import { t } from '../data/i18n';
import { router } from '../router/router';

/**
 * Knowledge Map / Timeline — the masters behind the books, in order of
 * time. Dates are centuries only (the commonly known era of each master),
 * never invented exact years. Each master links to 1–2 real books in
 * the library.
 */
export const TimelineView: React.FC = () => {
  const lang = appState.settings.language;
  const books = appState.getVisibleBooks();
  const byTitle = new Map(books.map((b) => [b.title, b]));
  const masters = getTimeline();

  return (
    <div className="space-y-6 animate-fade-in py-2">
      <div>
        <button
          onClick={() => router.navigate('home')}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('timeline.backHome', lang)}</span>
        </button>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-3">
          {t('timeline.titleStart', lang)} <span className="gold-shimmer">{t('timeline.titleEnd', lang)}</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl mt-2">
          {t('timeline.intro', lang)}
        </p>
      </div>

      <div className="relative">
        <div aria-hidden="true" className="absolute left-[19px] sm:left-[27px] top-2 bottom-2 w-px bg-[var(--gold)]/30" />
        <ol className="space-y-4">
          {masters.map((master) => (
            <li key={master.name} className="relative flex gap-4 sm:gap-5">
              <div className="relative z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--gold)]/50 flex items-center justify-center shrink-0 shadow-lg">
                <span className="font-display font-bold text-[10px] sm:text-xs text-[var(--gold)] text-center leading-tight">
                  {master.century}th
                  <br />
                  <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] font-sans">{t('timeline.century', lang)}</span>
                </span>
              </div>
              <div className="flex-1 ms-panel rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">{master.name}</h2>
                  <span className="text-xs text-[var(--gold)] font-semibold">{master.era}</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{master.role}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {master.bookTitles.map((title) => {
                    const book = byTitle.get(title);
                    if (!book) return null;
                    return (
                      <button
                        key={title}
                        onClick={() => router.navigate('book', { bookId: book.id })}
                        className="tap-target px-3 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-left"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                        <span>{title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-[var(--text-muted)] text-center sm:text-left">
          {t('timeline.journeysPrompt', lang)}
        </span>
        <button
          onClick={() => router.navigate('journeys')}
          className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>{t('timeline.openJourneys', lang)}</span>
        </button>
      </div>
    </div>
  );
};
