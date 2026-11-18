import React, { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Compass, BookOpen, Map as MapIcon } from 'lucide-react';
import { resolveJourneys, journeyProgress } from '../data/specialFeatures';
import { appState } from '../state/appState';
import { router } from '../router/router';

/**
 * Reading Paths — a path through the books, in order, with your place saved.
 * Each journey is a path through REAL books already in the catalog, in
 * order, with a short honest note per step. Tick a book done and the
 * progress is saved on this device (localStorage); the next visit resumes
 * where you left off. No invented titles, no account.
 */
export const JourneysView: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const books = appState.getVisibleBooks();
  const resolved = resolveJourneys(books);

  return (
    <div className="space-y-6 animate-fade-in py-2">
      <div>
        <button
          onClick={() => router.navigate('home')}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-3">
          Guided Reading <span className="gold-shimmer">Paths</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl mt-2">
          A normal library hands you a shelf. This one walks with you. Pick a
          path, read the books in order, tick each one done — your progress is
          saved on this device, so you can resume any time. Every book below
          is already in this library.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {resolved.map((journey) => {
          const done = appState.getJourneyDone(journey.id);
          const pct = journeyProgress(done, journey);
          const open = openId === journey.id;
          const nextStep = journey.steps.find((s) => !done.includes(s.title));
          return (
            <div
              key={journey.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full">
                    {journey.level} • {journey.steps.length} books
                  </span>
                  <h2 className="font-display font-semibold text-xl text-[var(--text-main)] mt-3">
                    {journey.title}
                  </h2>
                  <p className="text-xs text-[var(--gold)] font-medium mt-0.5">{journey.subtitle}</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-2">
                    {journey.description}
                  </p>
                </div>
                <Compass className="w-6 h-6 text-[var(--gold)] shrink-0" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-medium">
                  <span>{done.length} of {journey.steps.length} read</span>
                  <span className="font-bold text-[var(--gold)]">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                  <div className="h-full bg-[var(--gold)] transition-all duration-300 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                {nextStep && pct < 100 && (
                  <p className="text-[11px] text-[var(--text-muted)] pt-1">
                    Next: <span className="text-[var(--text-main)] font-medium">{nextStep.title}</span>
                  </p>
                )}
                {pct === 100 && (
                  <p className="text-[11px] text-emerald-400 font-semibold pt-1">Journey complete — well done.</p>
                )}
              </div>

              <button
                onClick={() => setOpenId(open ? null : journey.id)}
                className="tap-target w-full px-4 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[var(--gold)]" />
                <span>{open ? 'Hide the path' : 'See the path'}</span>
                <ChevronRight className={`w-4 h-4 text-[var(--gold)] transition-transform ${open ? 'rotate-90' : ''}`} />
              </button>

              {open && (
                <ol className="space-y-2 pt-1">
                  {journey.steps.map((step, i) => {
                    const isDone = done.includes(step.title);
                    return (
                      <li
                        key={step.title}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                          isDone
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-[var(--bg-main)] border-[var(--border-main)]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => appState.toggleJourneyStep(journey.id, step.title)}
                          aria-label={isDone ? `Mark ${step.title} as not read` : `Mark ${step.title} as read`}
                          className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-[var(--border-main)] text-transparent hover:border-[var(--gold)]'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                            <span className="text-[var(--gold)] mr-1.5">{i + 1}.</span>
                            {step.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">{step.note}</p>
                          {step.book && (
                            <button
                              onClick={() => router.navigate('book', { bookId: step.book!.id })}
                              className="text-xs text-[var(--gold)] hover:underline font-medium mt-1 cursor-pointer"
                            >
                              Open this book →
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-[var(--text-muted)] text-center sm:text-left">
          Want to see the masters behind these books, in order of time?
        </span>
        <button
          onClick={() => router.navigate('timeline')}
          className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <MapIcon className="w-4 h-4" />
          <span>Open the Knowledge Map</span>
        </button>
      </div>
    </div>
  );
};
