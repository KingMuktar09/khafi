import React from 'react';
import { BookOpen, CheckCircle2, Flame, Bookmark, Compass, Library } from 'lucide-react';
import { appState } from '../../state/appState';

/**
 * Reading Stats — local only, from My Shelf, reading progress,
 * journeys, bookmarks and visit days on this device. No account,
 * nothing leaves the device.
 */
export const ReadingStats: React.FC = () => {
  const stats = appState.getReadingStats();
  const items = [
    { icon: CheckCircle2, label: 'Finished', value: stats.finished },
    { icon: BookOpen, label: 'Reading now', value: stats.inProgress },
    { icon: Library, label: 'On My Shelf', value: stats.onShelf },
    { icon: Compass, label: 'Journey steps done', value: stats.journeyStepsDone },
    { icon: Bookmark, label: 'Bookmarks', value: stats.bookmarks },
    { icon: Flame, label: 'Day streak', value: stats.streakDays },
  ];
  return (
    <section className="space-y-3 animate-fade-up">
      <div className="px-1">
        <h2 className="font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
          <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
            <Flame className="w-4 h-4 text-[var(--gold)]" />
          </div>
          <span>Your Reading Stats</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Only on this device — your shelf, your progress, your streak.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl text-center space-y-1"
          >
            <Icon className="w-5 h-5 text-[var(--gold)] mx-auto" />
            <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{value}</p>
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
