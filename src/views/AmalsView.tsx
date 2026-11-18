import React, { useState } from 'react';
import { BookOpen, MoonStar, AlertTriangle, ChevronDown } from 'lucide-react';
import { appState } from '../state/appState';
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
          alt="Ghayb Chronicles logo"
          className="w-20 h-20 rounded-2xl object-cover border border-[var(--gold)]/40 shrink-0"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="min-w-0 pt-1">
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] flex items-center gap-2 leading-snug">
            <MoonStar className="w-6 h-6 text-[var(--gold)] shrink-0" />
            <span>Amals from the Books of Ahmad al-Buni</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            25 simple practices from the Inloes translation, plus 6 more from the John Friend
            translation. Tap a title to see the full detail.
          </p>
        </div>
      </div>

      {/* Strict disclaimer — at your own risk, top of the page */}
      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl flex items-start gap-3" role="alert">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-[var(--text-main)] leading-relaxed">
          Warning. Do this at your own risk. Doing any amal on this page is fully your own choice and
          your own risk. Ghayb Chronicles and the Ilm-e-Ghayb Library are NOT responsible for any
          problems, harm, or consequences that follow, now or in the future.
        </p>
      </div>

      {/* How this page works */}
      <div className="p-5 ms-panel rounded-xl space-y-3">
        <h2 className="font-display font-semibold text-base text-[var(--text-main)]">How this page works</h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Each card below is one amal from the book. Tap its title to open it: you will see what it is
          for, the exact words to say, how to do it step by step, and the chapter and page in the book
          so you can check it yourself.
        </p>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          These 25 amals come from the English translation of Shams al-Ma&apos;arif in this library:
          The Sun of Knowledge, translated by Amina Inloes (Revelore Press, 2021). The library holds
          only two books by al-Buni: this translation and an Arabic manuscript, so this section is
          from the translation. Only simple, beginner-friendly practices are here: recitations, short
          prayers, or two rak&apos;ahs. Nothing that needs writing, amulets, fasting, seclusion, or
          contact with spirits.
        </p>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Below them is a second set of 6 amals, from a different English translation of the same
          book: Shams al-Ma&apos;arif al-Kubra, translated by John Friend (John Friend Publishing,
          2026). That edition is not in this library. These 6 come from Chapter Two: The Divine
          Names, and they are the only ones copied out so far. Amals 1 to 19 of that set are not in
          hand yet, so they are not here.
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
                {amals.length} {amals.length === 1 ? 'amal' : 'amals'}
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
                          <span className="text-[var(--gold)] font-semibold">What it is for: </span>
                          {amal.purpose}
                        </p>
                        {amal.words && (
                          <p className="text-sm text-[var(--text-main)] leading-relaxed bg-[var(--bg-main)] border border-[var(--gold)]/30 rounded-xl px-4 py-3">
                            <span className="text-[var(--gold)] font-semibold">Say: </span>
                            {amal.words}
                          </p>
                        )}
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                          <span className="text-[var(--gold)] font-semibold">How to do it: </span>
                          {amal.how}
                        </p>
                        {amal.note && (
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-amber-500/5 border border-amber-500/30 rounded-xl px-4 py-3">
                            <span className="font-semibold text-[var(--text-main)]">Note: </span>
                            {amal.note}
                          </p>
                        )}
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          <span className="font-semibold text-[var(--text-main)]">Source: </span>
                          The Sun of Knowledge: Shams al-Ma&apos;arif, {amal.chapter}, &ldquo;{amal.section}&rdquo;,
                          PDF page {amal.pdfPage} (English translation by Amina Inloes, Revelore Press, 2021).
                        </p>
                        {buniSourceBook && (
                          <button
                            type="button"
                            onClick={() => router.navigate('book', { bookId: buniSourceBook.id })}
                            className="text-sm text-[var(--gold)] font-semibold flex items-center gap-1.5 cursor-pointer hover:underline"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>Read the book: {buniSourceBook.title}</span>
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
            From the John Friend translation
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {FRIEND_AMALS.length} amals, from Chapter Two: The Divine Names
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
            Source: {FRIEND_AMALS_SOURCE}.
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
                      <span className="text-[var(--gold)] font-semibold">What it is for: </span>
                      {amal.purpose}
                    </p>
                    {amal.words && (
                      <p className="text-sm text-[var(--text-main)] leading-relaxed bg-[var(--bg-main)] border border-[var(--gold)]/30 rounded-xl px-4 py-3">
                        <span className="text-[var(--gold)] font-semibold">Say: </span>
                        {amal.words}
                      </p>
                    )}
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      <span className="text-[var(--gold)] font-semibold">How to do it: </span>
                      {amal.how}
                    </p>
                    {amal.note && (
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-amber-500/5 border border-amber-500/30 rounded-xl px-4 py-3">
                        <span className="font-semibold text-[var(--text-main)]">Note: </span>
                        {amal.note}
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-main)]">Source: </span>
                      {FRIEND_AMALS_SOURCE}, &ldquo;{amal.section}&rdquo;, p. {amal.page}.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-[11px] text-[var(--text-muted)] px-1 leading-relaxed">
        These practices are from an old historical book. They are not a replacement for normal prayer,
        good deeds, or medical care. Do them at your own risk.
      </p>
    </div>
  );
};
