import React, { useState } from 'react';
import { CheckCircle2, Flame, BookOpen, MoonStar, AlertTriangle, ChevronDown } from 'lucide-react';
import { appState } from '../state/appState';
import { router } from '../router/router';
import { siteConfig } from '../config/siteConfig';
import { AMALS, amalStreak, amalsDoneToday, toISODateLocal } from '../data/tools';
import { BUNI_AMALS, BUNI_BOOK_TITLE } from '../data/buniAmals';

/**
 * Daily Amals — small daily practices, ticked off one by one.
 *
 * An "amal" is a small good habit you do on purpose, every day.
 * This page is general practice reminders only: no Hadith is quoted
 * here, and no count is given as a religious ruling. Do what you can,
 * at your own pace. Where a practice comes from a book in this
 * library, the page links to that book so you can read more.
 *
 * Tick marks and streaks are saved on this device only.
 */
export const AmalsView: React.FC = () => {
  const today = new Date();
  const todayKey = toISODateLocal(today);
  const done = amalsDoneToday(appState.amalLog, today);
  const streak = amalStreak(appState.amalLog, today);
  const total = AMALS.length;
  const pct = total === 0 ? 0 : Math.round((done.length / total) * 100);
  const todayLabel = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  // One Buni amal open at a time (tap a title to open it, tap again to close).
  const [openBuniId, setOpenBuniId] = useState<string | null>(null);
  const buniSourceBook = appState.getVisibleBooks().find((b) => b.title === BUNI_BOOK_TITLE);

  return (
    <div className="space-y-5 animate-fade-in py-2 font-sans max-w-3xl mx-auto">
      <div className="px-1">
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] flex items-center gap-2">
          <MoonStar className="w-6 h-6 text-[var(--gold)]" />
          <span>Daily Amals</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {todayLabel} — an amal is a small daily practice. Tick each one as you do it.
          Your streak is saved on this device only.
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
          These are general practice reminders, not religious rulings — no Hadith is quoted here,
          and no count is given as a rule. Do what you can, at your own pace.
        </p>
      </div>

      {/* Strict disclaimer — at your own risk, top of the page */}
      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl flex items-start gap-3" role="alert">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-[var(--text-main)] leading-relaxed">
          Warning — do this at your own risk. Doing any amal on this page is fully your own choice and
          your own risk. Ghayb Chronicles and the Ilm-e-Ghayb Library are NOT responsible for any
          problems, harm, or consequences that follow — now or in the future.
        </p>
      </div>

      {/* How this page works */}
      <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl space-y-3">
        <h2 className="font-semibold text-sm text-[var(--text-main)]">How this page works</h2>
        <ol className="text-sm text-[var(--text-muted)] leading-relaxed list-decimal list-inside space-y-1">
          <li>Each card below is one small practice for the day — read it, do it, then tap the circle to tick it off.</li>
          <li>Every card also says why it helps, in one line, so you know what it is for.</li>
          <li>Come back tomorrow: your streak counts the days in a row you did at least one amal. Missed a day? Just start again — the streak is a helper, not a test.</li>
        </ol>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Some cards link to a book in this library with the words "Read the book behind this" — tap it to read
          more about that practice from the book itself.
        </p>
      </div>

      {/* Progress */}
      <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-sm text-[var(--text-main)]">
            Today: {done.length} of {total} done
          </span>
          <span className="text-xs px-3 py-1.5 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-bold rounded-full flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>{streak} day streak</span>
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
          <div className="h-full bg-[var(--gold)] transition-all duration-300 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          {pct === 100
            ? 'All done for today — well done.'
            : pct === 0
              ? 'Nothing ticked yet today. Start with Fajr, then one small thing.'
              : `${total - done.length} left today.`}
        </p>
      </div>

      {/* Amal list */}
      <div className="space-y-2">
        {AMALS.map((amal) => {
          const isDone = done.includes(amal.id);
          const sourceBook = amal.sourceTitle
            ? appState.getVisibleBooks().find((b) => b.title === amal.sourceTitle)
            : undefined;
          return (
            <div
              key={amal.id}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                isDone
                  ? 'bg-[var(--gold-faint)] border-[var(--gold)]/50'
                  : 'bg-[var(--bg-surface)] border-[var(--border-main)]'
              }`}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={isDone}
                aria-label={amal.title}
                onClick={() => appState.toggleAmal(amal.id)}
                className={`tap-target w-7 h-7 rounded-full border flex items-center justify-center shrink-0 cursor-pointer mt-0.5 ${
                  isDone
                    ? 'bg-[var(--gold)] border-[var(--gold)] text-black'
                    : 'bg-[var(--bg-main)] border-[var(--border-main)] text-transparent hover:border-[var(--gold)]/50'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h3 className={`font-semibold text-sm ${isDone ? 'text-[var(--gold)] line-through' : 'text-[var(--text-main)]'}`}>
                  {amal.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">{amal.detail}</p>
                <p className="text-xs text-[var(--gold)] leading-relaxed mt-1">
                  Why it helps: {amal.why}
                </p>
                {sourceBook && (
                  <button
                    type="button"
                    onClick={() => router.navigate('book', { bookId: sourceBook.id })}
                    className="mt-2 text-[11px] text-[var(--gold)] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read the book behind this: {sourceBook.title}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Amals from the books of Ahmad al-Buni — 25 verified, tap to open */}
      <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={siteConfig.logo}
            alt="Ghayb Chronicles logo"
            className="w-14 h-14 rounded-xl object-cover border border-[var(--gold)]/40 shrink-0"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="min-w-0">
            <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--text-main)] leading-snug">
              Amals from the Books of Ahmad al-Buni
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">
              25 simple practices, tap a title to see the detail.
            </p>
          </div>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          These 25 amals come from the English translation of Shams al-Ma&apos;arif in this library —
          The Sun of Knowledge, translated by Amina Inloes (Revelore Press, 2021). The library holds
          only two books by al-Buni: this translation and an Arabic manuscript, so this section is
          from the translation. Each one was read from the book itself, with its chapter and page
          written down so you can check it. Only simple, beginner-friendly practices are here —
          recitations, short prayers, or two rak&apos;ahs. Nothing that needs writing, amulets,
          fasting, seclusion, or contact with spirits.
        </p>
        <div className="space-y-2">
          {BUNI_AMALS.map((amal) => {
            const isOpen = openBuniId === amal.id;
            return (
              <div
                key={amal.id}
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isOpen
                    ? 'bg-[var(--gold-faint)] border-[var(--gold)]/50'
                    : 'bg-[var(--bg-main)] border-[var(--border-main)]'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenBuniId(isOpen ? null : amal.id)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left cursor-pointer"
                >
                  <span className="font-semibold text-sm text-[var(--text-main)] flex-1 min-w-0">
                    {amal.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--gold)] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 space-y-2 animate-fade-in">
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      <span className="text-[var(--gold)] font-semibold">What it is for: </span>
                      {amal.purpose}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      <span className="text-[var(--gold)] font-semibold">How to do it: </span>
                      {amal.how}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-main)]">Source: </span>
                      The Sun of Knowledge: Shams al-Ma&apos;arif, {amal.chapter}, &ldquo;{amal.section}&rdquo;,
                      PDF page {amal.pdfPage} (English translation by Amina Inloes, Revelore Press, 2021).
                    </p>
                    {buniSourceBook && (
                      <button
                        type="button"
                        onClick={() => router.navigate('book', { bookId: buniSourceBook.id })}
                        className="text-[11px] text-[var(--gold)] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read the book: {buniSourceBook.title}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-[var(--text-muted)] px-1 leading-relaxed">
        Tick marks are saved per day on this device ({todayKey}). Your streak counts days where you did at least one amal.
        Missed a day? Just start again tomorrow — the streak is a helper, not a test.
      </p>
    </div>
  );
};
