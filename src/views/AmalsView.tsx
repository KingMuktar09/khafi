import React from 'react';
import { CheckCircle2, Flame, BookOpen, MoonStar, AlertTriangle } from 'lucide-react';
import { appState } from '../state/appState';
import { router } from '../router/router';
import { AMALS, amalStreak, amalsDoneToday, toISODateLocal } from '../data/tools';

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

      <p className="text-[11px] text-[var(--text-muted)] px-1 leading-relaxed">
        Tick marks are saved per day on this device ({todayKey}). Your streak counts days where you did at least one amal.
        Missed a day? Just start again tomorrow — the streak is a helper, not a test.
      </p>
    </div>
  );
};
