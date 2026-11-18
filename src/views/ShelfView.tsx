import React, { useState } from 'react';
import { Bookmark, BookOpen, CheckCircle2, Clock, Library } from 'lucide-react';
import { appState } from '../state/appState';
import { t, tf } from '../data/i18n';
import { router } from '../router/router';
import { BookGrid } from '../components/books/BookGrid';
import { ReadingStats } from '../components/special/ReadingStats';
import type { ShelfStatus } from '../data/tools';
import { shelfCounts } from '../data/tools';

type ShelfTab = ShelfStatus | 'all';

/**
 * My Shelf — books the reader saved, with a reading status:
 * To Read / Reading / Finished. Saved on this device only.
 * Change the status from a book's own page, or remove it here.
 */
export const ShelfView: React.FC = () => {
  const lang = appState.settings.language;
  const [tab, setTab] = useState<ShelfTab>('all');
  const shelf = appState.shelf;
  const counts = shelfCounts(shelf);
  const total = Object.keys(shelf).length;
  const books = tab === 'all' ? appState.getShelfBooks() : appState.getShelfBooksByStatus(tab);

  const tabs: { key: ShelfTab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'all', label: t('shelf.allSaved', lang), count: total, icon: <Library className="w-3.5 h-3.5" /> },
    { key: 'to-read', label: t('shelf.to-read', lang), count: counts['to-read'], icon: <Bookmark className="w-3.5 h-3.5" /> },
    { key: 'reading', label: t('shelf.reading', lang), count: counts.reading, icon: <Clock className="w-3.5 h-3.5" /> },
    { key: 'finished', label: t('shelf.finished', lang), count: counts.finished, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-5 animate-fade-in py-2 font-sans">
      <div className="px-1">
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-[var(--gold)]" />
          <span>{t('shelf.title', lang)}</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {t('shelf.subtitle', lang)}
        </p>
      </div>

      <ReadingStats />

      <div className="flex gap-2 flex-wrap" role="group" aria-label={t('shelf.statusAria', lang)}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`tap-target px-4 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === t.key
                ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
            }`}
          >
            {t.icon}
            <span>{t.label} ({t.count})</span>
          </button>
        ))}
      </div>

      {total === 0 ? (
        <div className="py-12 px-4 text-center bg-[var(--bg-surface)] border border-dashed border-[var(--border-main)] rounded-xl space-y-3">
          <Bookmark className="w-8 h-8 text-[var(--gold)] mx-auto" />
          <p className="font-semibold text-sm text-[var(--text-main)]">{t('shelf.emptyTitle', lang)}</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
            {t('shelf.emptyText', lang)}
          </p>
          <button
            type="button"
            onClick={() => router.navigate('library')}
            className="tap-target px-5 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('shelf.browseLibrary', lang)}</span>
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="py-12 px-4 text-center bg-[var(--bg-surface)] border border-dashed border-[var(--border-main)] rounded-xl">
          <p className="font-semibold text-sm text-[var(--text-main)]">{t('shelf.noBooksStatus', lang)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{t('shelf.changeStatus', lang)}</p>
        </div>
      ) : (
        <BookGrid books={books} emptyMessage={t('shelf.noBooksHere', lang)} />
      )}
    </div>
  );
};
