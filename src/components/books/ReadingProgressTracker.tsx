import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { Book } from '../../types';
import { appState } from '../../state/appState';

interface ReadingProgressTrackerProps {
  book: Book;
  compact?: boolean;
}

export const ReadingProgressTracker: React.FC<ReadingProgressTrackerProps> = ({
  book,
  compact = false,
}) => {
  const currentProgress = appState.getReadingProgress(book.id);
  const totalPagesCount = book.pageCount || currentProgress?.totalPages || 0;

  const [percentage, setPercentage] = useState<number>(currentProgress?.percentage || 0);
  const [currentPage, setCurrentPage] = useState<number>(
    currentProgress?.currentPage || (totalPagesCount > 0 ? Math.round(((currentProgress?.percentage || 0) / 100) * totalPagesCount) : 0)
  );

  useEffect(() => {
    const latest = appState.getReadingProgress(book.id);
    if (latest) {
      setPercentage(latest.percentage);
      if (latest.currentPage !== undefined) {
        setCurrentPage(latest.currentPage);
      }
    }
  }, [book.id]);

  const handlePercentageChange = (val: number) => {
    const clampedPct = Math.max(0, Math.min(100, val));
    setPercentage(clampedPct);
    if (totalPagesCount > 0) {
      const calcPage = Math.round((clampedPct / 100) * totalPagesCount);
      setCurrentPage(calcPage);
    }
  };

  const handlePageChange = (p: number) => {
    if (totalPagesCount > 0) {
      const clampedPage = Math.max(0, Math.min(totalPagesCount, p));
      setCurrentPage(clampedPage);
      const calcPct = Math.round((clampedPage / totalPagesCount) * 100);
      setPercentage(calcPct);
    }
  };

  const saveProgress = (pct: number, page?: number) => {
    const targetPage = page !== undefined ? page : currentPage;
    appState.setReadingProgress(
      book.id,
      pct,
      targetPage,
      totalPagesCount || undefined
    );
    appState.showToast('Reading progress saved', 'success');
  };

  const handlePreset = (pct: number) => {
    let targetPage: number | undefined = undefined;
    if (totalPagesCount > 0) {
      targetPage = Math.round((pct / 100) * totalPagesCount);
      setCurrentPage(targetPage);
    }
    setPercentage(pct);
  };

  const handleReset = () => {
    appState.removeReadingProgress(book.id);
    setPercentage(0);
    setCurrentPage(0);
    appState.showToast('Reading progress reset', 'info');
  };

  const isCompleted = percentage >= 100;

  if (compact) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-3 text-xs space-y-2 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--text-main)]">
            <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Reading Progress</span>
          </div>
          <span className="text-[11px] font-bold text-[var(--gold)]">
            {isCompleted ? '100% read ✓' : `${percentage}% read`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[var(--bg-main)] h-1.5 rounded-full overflow-hidden border border-[var(--border-subtle)]">
          <div
            className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-[var(--gold)]'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {[25, 50, 75, 100].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                handlePreset(p);
                saveProgress(p);
              }}
              className={`flex-1 py-1 text-[11px] font-medium border rounded transition-colors cursor-pointer ${
                percentage === p
                  ? 'bg-[var(--gold)] text-black border-[var(--gold)] font-bold'
                  : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-main)]'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-4 sm:p-5 space-y-4 text-xs font-sans text-[var(--text-main)] shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-main)] pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--gold)]" />
          <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--text-main)]">
            Reading Progress
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 ${
            isCompleted
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--border-main)]'
          }`}>
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% read ✓</span>
              </>
            ) : (
              <span>{percentage}% read</span>
            )}
          </span>
        </div>
      </div>

      {/* Slider & Scale */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>Set completion</span>
          <span className="font-semibold text-[var(--text-main)] font-mono">{percentage}%</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={percentage}
          onChange={(e) => handlePercentageChange(Number(e.target.value))}
          className="w-full accent-[var(--gold)] bg-[var(--bg-main)] cursor-pointer h-2 rounded-lg border border-[var(--border-main)]"
        />

        <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono px-0.5">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Page number input if page count available */}
      {totalPagesCount > 0 && (
        <div className="flex items-center justify-between gap-3 bg-[var(--bg-main)] p-2.5 rounded-lg border border-[var(--border-main)]">
          <label className="text-[11px] text-[var(--text-muted)] shrink-0">
            Current Page:
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              max={totalPagesCount}
              value={currentPage || ''}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              placeholder="0"
              className="w-16 px-2 py-1 bg-[var(--bg-surface)] text-[var(--text-main)] text-xs border border-[var(--border-main)] rounded text-center font-mono focus:outline-none focus:border-[var(--gold)]"
            />
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              / {totalPagesCount}
            </span>
          </div>
        </div>
      )}

      {/* Presets & Save Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Quick Presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[var(--text-muted)] mr-1 hidden sm:inline">Presets:</span>
          {[25, 50, 75, 100].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePreset(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                percentage === p
                  ? 'bg-[var(--gold)] text-black border-[var(--gold)] font-bold'
                  : 'bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border-[var(--border-main)]'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
          {percentage > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-rose-400 bg-[var(--bg-main)] hover:bg-rose-950/20 border border-[var(--border-main)] hover:border-rose-500/30 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => saveProgress(percentage)}
            className="flex-1 sm:flex-none px-4 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

