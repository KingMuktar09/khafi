import React, { useState } from 'react';
import { BookOpen, MoonStar, AlertTriangle, ChevronDown } from 'lucide-react';
import { appState } from '../state/appState';
import { t, tf } from '../data/i18n';
import { router } from '../router/router';
import { siteConfig } from '../config/siteConfig';
import { BUNI_AMALS, BUNI_BOOK_TITLE, BUNI_CHAPTERS } from '../data/buniAmals';
import { FRIEND_AMALS, FRIEND_AMALS_SOURCE, FRIEND_AMALS_WARNING } from '../data/friendAmals';

/**
 * Amals from the Books of Ahmad al-Buni — the main content of this page.
 *
 * 25 simple practices from the English translation of Shams al-Ma'arif
 * in this library (The Sun of Knowledge, translated by Amina Inloes,
 * Revelore Press, 2021). Each one was read from the book itself, with
 * its chapter and page written down so you can check it. Only simple,
 * beginner-friendly practices are here — recitations, short prayers, or
 * two rak'ahs. Nothing that needs writing, amulets, fasting, seclusion,
 * or contact with spirits.
 *
 * Tap a title to open the full detail: what it is for, the exact words,
 * how to do it, and the source.
 */
export const AmalsView: React.FC = () => {
  const lang = appState.settings.language;
  // One amal open at a time (tap a title to open it, tap again to close).
  const [openBuniId, setOpenBuniId] = useState<string | null>(null);
  const [openFriendId, setOpenFriendId] = useState<string | null>(null);
  const buniSourceBook = appState.getVisibleBooks().find((b) => b.title === BUNI_BOOK_TITLE);

  return (
    <div className="space-y-6 animate-fade-in py-2 font-sans max-w-3xl mx-auto">
      {/* Header — logo + title */}
      <div className="px-1 flex items-start gap-4">
        <img
          src={siteConfig.logo}
          alt={t('amals.logoAlt', lang)}
          className="w-20 h-20 rounded-2xl object-cover border border-[var(--gold)]/40 shrink-0"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="min-w-0 pt-1">
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] flex items-center gap-2 leading-snug">
            <MoonStar className="w-6 h-6 text-[var(--gold)] shrink-0" />
            <span>{t('amals.title', lang)}</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            {t('amals.subtitle', lang)}
          </p>
        </div>
      </div>

      {/* Strict disclaimer — at your own risk, top of the page */}
      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl flex items-start gap-3" role="alert">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-[var(--text-main)] leading-relaxed">
          {t('amals.warning', lang)}
        </p>
      </div>

      {/* How this page works */}
      <div className="p-5 ms-panel rounded-xl space-y-3">
        <h2 className="font-display font-semibold text-base text-[var(--text-main)]">{t('amals.howTitle', lang)}</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {t('amals.how1', lang)}
        </p>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {t('amals.how2', lang)}
        </p>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {t('amals.how3', lang)}
        </p>
      </div>

      {/* The collection — grouped by chapter, big cards */}
      {BUNI_CHAPTERS.map(({ chapter, title }) => {
        const amals = BUNI_AMALS.filter((a) => a.chapter === chapter);
        if (amals.length === 0) return null;
        return (
          <section key={chapter} className="space-y-3">
            <div className="px-1 pt-2">
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-[var(--text-main)]">
                {chapter} — {title}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {tf(amals.length === 1 ? 'amals.countOne' : 'amals.countMany', lang, { n: amals.length })}
              </p>
            </div>
            <div className="space-y-3">
              {amals.map((amal) => {
                const isOpen = openBuniId === amal.id;
                return (
                  <div
                    key={amal.id}
                    className={`rounded-2xl border overflow-hidden transition-colors ${
                      isOpen
                        ? 'bg-[var(--gold-faint)] border-[var(--gold)]/50'
                        : 'bg-[var(--bg-surface)] border-[var(--border-main)]'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenBuniId(isOpen ? null : amal.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer min-h-[4rem]"
                    >
                      <span className="font-semibold text-base sm:text-lg text-[var(--text-main)] flex-1 min-w-0 leading-snug">
                        {amal.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[var(--gold)] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 space-y-3 animate-fade-in">
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                          <span className="text-[var(--gold)] font-semibold">{t('amals.whatFor', lang)}</span>
                          {amal.purpose}
                        </p>
                        {amal.words && (
                          <p className="text-sm text-[var(--text-main)] leading-relaxed bg-[var(--bg-main)] border border-[var(--gold)]/30 rounded-xl px-4 py-3">
                            <span className="text-[var(--gold)] font-semibold">{t('amals.say', lang)}</span>
                            {amal.words}
                          </p>
                        )}
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                          <span className="text-[var(--gold)] font-semibold">{t('amals.howTo', lang)}</span>
                          {amal.how}
                        </p>
                        {amal.note && (
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-amber-500/5 border border-amber-500/30 rounded-xl px-4 py-3">
                            <span className="font-semibold text-[var(--text-main)]">{t('amals.note', lang)}</span>
                            {amal.note}
                          </p>
                        )}
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          <span className="font-semibold text-[var(--text-main)]">{t('amals.source', lang)}</span>
                          {tf('amals.sourceBuni', lang, { chapter: amal.chapter, section: amal.section, page: amal.pdfPage })}
                        </p>
                        {buniSourceBook && (
                          <button
                            type="button"
                            onClick={() => router.navigate('book', { bookId: buniSourceBook.id })}
                            className="text-sm text-[var(--gold)] font-semibold flex items-center gap-1.5 cursor-pointer hover:underline"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>{tf('amals.readBook', lang, { title: buniSourceBook.title })}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Second set: 6 amals from the John Friend translation */}
      <section className="space-y-3">
        <div className="px-1 pt-2">
          <h2 className="font-display font-semibold text-xl sm:text-2xl text-[var(--text-main)]">
            {t('amals.friendTitle', lang)}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {tf('amals.friendCount', lang, { n: FRIEND_AMALS.length })}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
            {tf('amals.friendSource', lang, { source: FRIEND_AMALS_SOURCE })}
          </p>
        </div>
        <div className="p-4 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl flex items-start gap-3" role="alert">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-[var(--text-main)] leading-relaxed">
            {FRIEND_AMALS_WARNING}
          </p>
        </div>
        <div className="space-y-3">
          {FRIEND_AMALS.map((amal) => {
            const isOpen = openFriendId === amal.id;
            return (
              <div
                key={amal.id}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  isOpen
                    ? 'bg-[var(--gold-faint)] border-[var(--gold)]/50'
                    : 'bg-[var(--bg-surface)] border-[var(--border-main)]'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFriendId(isOpen ? null : amal.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer min-h-[4rem]"
                >
                  <span className="font-semibold text-base sm:text-lg text-[var(--text-main)] flex-1 min-w-0 leading-snug">
                    {amal.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--gold)] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 space-y-3 animate-fade-in">
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      <span className="text-[var(--gold)] font-semibold">{t('amals.whatFor', lang)}</span>
                      {amal.purpose}
                    </p>
                    {amal.words && (
                      <p className="text-sm text-[var(--text-main)] leading-relaxed bg-[var(--bg-main)] border border-[var(--gold)]/30 rounded-xl px-4 py-3">
                        <span className="text-[var(--gold)] font-semibold">{t('amals.say', lang)}</span>
                        {amal.words}
                      </p>
                    )}
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      <span className="text-[var(--gold)] font-semibold">{t('amals.howTo', lang)}</span>
                      {amal.how}
                    </p>
                    {amal.note && (
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-amber-500/5 border border-amber-500/30 rounded-xl px-4 py-3">
                        <span className="font-semibold text-[var(--text-main)]">{t('amals.note', lang)}</span>
                        {amal.note}
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-main)]">{t('amals.source', lang)}</span>
                      {tf('amals.friendSourceLine', lang, { source: FRIEND_AMALS_SOURCE, section: amal.section, page: amal.page })}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-[11px] text-[var(--text-muted)] px-1 leading-relaxed">
        {t('amals.footer', lang)}
      </p>
    </div>
  );
};
