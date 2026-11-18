import React from 'react';
import { Sun, BookOpen, ArrowRight } from 'lucide-react';
import { getWisdomForDate } from '../../data/specialFeatures';
import { appState } from '../../state/appState';
import { router } from '../../router/router';

/**
 * Wisdom of the Day — one short teaching per day, same all day, changes
 * with the date. The teaching is a plain-words summary, NOT a verbatim
 * quote, so no Quran verse or Hadith is ever misquoted here. The source
 * is always a real book already in the catalog.
 */
export const WisdomOfTheDay: React.FC = () => {
  const wisdom = getWisdomForDate(new Date());
  const sourceBook = appState.getVisibleBooks().find((b) => b.title === wisdom.sourceTitle);
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--gold)]/30 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-up">
      <div aria-hidden="true" className="halftone halftone-corner" />
      <div className="flex items-center gap-2">
        <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full tracking-wide flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5" />
          <span>Wisdom of the Day</span>
        </span>
        <span className="text-[11px] text-[var(--text-muted)]">{today}</span>
      </div>
      <p className="font-display font-semibold text-xl sm:text-2xl text-[var(--text-main)] leading-snug mt-4 max-w-2xl">
        {wisdom.teaching}
      </p>
      <p className="text-xs text-[var(--text-muted)] mt-3">
        A teaching of <span className="text-[var(--gold)] font-semibold">{wisdom.master}</span>
        . {wisdom.about}
      </p>
      {sourceBook && (
        <button
          onClick={() => router.navigate('book', { bookId: sourceBook.id })}
          className="tap-target mt-4 px-4 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[var(--gold)]" />
          <span>Read the source: {sourceBook.title}</span>
          <ArrowRight className="w-4 h-4 text-[var(--gold)]" />
        </button>
      )}
    </section>
  );
};
