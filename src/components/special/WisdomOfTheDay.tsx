import React from 'react';
import { Sun, BookOpen, ArrowRight } from 'lucide-react';
import { getLocalizedWisdomForDate } from '../../data/specialFeatures';
import { appState } from '../../state/appState';
import { router } from '../../router/router';
import { t, tf } from '../../data/i18n';

/**
 * Wisdom of the Day — one short teaching per day, same all day, changes
 * with the date. The teaching is a plain-words summary, NOT a verbatim
 * quote, so no Quran verse or Hadith is ever misquoted here. The source
 * is always a real book already in the catalog. The teaching and its
 * about-line follow the Settings language; the master name and the
 * source book title never change.
 */
export const WisdomOfTheDay: React.FC = () => {
  const lang = appState.settings.language;
  const wisdom = getLocalizedWisdomForDate(new Date(), lang);
  const sourceBook = appState.getVisibleBooks().find((b) => b.title === wisdom.sourceTitle);
  // Bengali dates read in Bengali; Hinglish keeps the English date
  // words, since Hinglish is written in the Roman script.
  const dateLocale = lang === 'bn' ? 'bn' : 'en-GB';
  const today = new Date().toLocaleDateString(dateLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // The teaching line names the master in gold. Word order differs by
  // language, so split the translated line on the master name itself
  // (which never changes) and put the gold span back in the middle.
  const teachingLine = tf('home.wisdom.teachingOf', lang, {
    master: wisdom.master,
    about: wisdom.about,
  });
  const [teachingBefore, teachingAfter] = teachingLine.split(wisdom.master);

  return (
    <section className="relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--gold)]/30 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-up">
      <div aria-hidden="true" className="halftone halftone-corner" />
      <div className="flex items-center gap-2">
        <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full tracking-wide flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5" />
          <span>{t('home.wisdom.title', lang)}</span>
        </span>
        <span className="text-[11px] text-[var(--text-muted)]">{today}</span>
      </div>
      <p className="font-display font-semibold text-xl sm:text-2xl text-[var(--text-main)] leading-snug mt-4 max-w-2xl">
        {wisdom.teaching}
      </p>
      <p className="text-xs text-[var(--text-muted)] mt-3">
        {teachingAfter === undefined ? (
          teachingLine
        ) : (
          <>
            {teachingBefore}
            <span className="text-[var(--gold)] font-semibold">{wisdom.master}</span>
            {teachingAfter}
          </>
        )}
      </p>
      {sourceBook && (
        <button
          onClick={() => router.navigate('book', { bookId: sourceBook.id })}
          className="tap-target mt-4 px-4 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[var(--gold)]" />
          <span>{tf('home.wisdom.readSource', lang, { title: sourceBook.title })}</span>
          <ArrowRight className="w-4 h-4 text-[var(--gold)]" />
        </button>
      )}
    </section>
  );
};
