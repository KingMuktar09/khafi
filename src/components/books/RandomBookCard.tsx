import React, { useState, useEffect } from 'react';
import { Shuffle, BookOpen, Star, Bookmark } from 'lucide-react';
import { Book } from '../../types';
import { appState } from '../../state/appState';
import { router } from '../../router/router';
import { CoverImage } from './CoverImage';
import { cleanLabel } from '../../utils/bookOrder';

/**
 * Surprise Me — one-tap random real book from the library.
 * Every tap picks a different book (the last one is never repeated
 * straight away). The book is always a real book from the catalog.
 */
export const RandomBookCard: React.FC = () => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const selectNewRandomBook = () => {
    const selected = appState.getRandomBook();
    setCurrentBook(selected);
  };

  useEffect(() => {
    selectNewRandomBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.catalog.books]);

  if (!currentBook) {
    return (
      <div className="p-8 text-center bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl text-xs text-[var(--text-muted)]">
        No books in the library yet.
      </div>
    );
  }

  const isFav = appState.isFavorite(currentBook.id);
  const shelfStatus = appState.getShelfStatus(currentBook.id);

  return (
    <section className="relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--gold)]/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
      <div aria-hidden="true" className="halftone halftone-corner" />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full flex items-center gap-1.5 tracking-wide">
          <Shuffle className="w-3.5 h-3.5" />
          <span>Surprise Me. A random book</span>
        </span>
        <button
          type="button"
          onClick={selectNewRandomBook}
          className="tap-target px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Another one</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
        <div
          onClick={() => router.navigate('book', { bookId: currentBook.id })}
          className="w-32 sm:w-40 aspect-[1/1.35] shrink-0 border border-[var(--border-main)] rounded-lg overflow-hidden cursor-pointer hover:border-[var(--gold)]/50 transition-colors"
        >
          <CoverImage
            book={currentBook}
            coverUrl={currentBook.coverUrl}
            fileUrl={currentBook.fileUrl}
            title={currentBook.title}
            author={currentBook.author}
            category={currentBook.category}
          />
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <span className="text-[11px] text-[var(--gold)] font-semibold">
            {cleanLabel(currentBook.category)}
            {currentBook.topic ? ` • ${cleanLabel(currentBook.topic)}` : ''}
          </span>
          <h3
            onClick={() => router.navigate('book', { bookId: currentBook.id })}
            className="font-display font-semibold text-xl sm:text-2xl text-[var(--text-main)] hover:text-[var(--gold)] transition-colors cursor-pointer leading-tight mt-1"
          >
            {currentBook.title}
          </h3>
          {currentBook.author && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{currentBook.author}</p>
          )}
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3 mt-2">
            {currentBook.description || 'A book from the library, picked at random.'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
            <button
              type="button"
              onClick={() => router.navigate('book', { bookId: currentBook.id })}
              className="tap-target px-4 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open this book</span>
            </button>
            <button
              type="button"
              onClick={() => appState.setShelfStatus(currentBook.id, shelfStatus ? null : 'to-read')}
              className={`tap-target px-4 py-2.5 border font-semibold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
                shelfStatus
                  ? 'bg-[var(--gold-faint)] text-[var(--gold)] border-[var(--gold)]/50'
                  : 'bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{shelfStatus ? 'On My Shelf' : 'Save to My Shelf'}</span>
            </button>
            <button
              type="button"
              onClick={() => appState.toggleFavorite(currentBook.id)}
              className={`tap-target px-4 py-2.5 border font-semibold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
                isFav
                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/50'
                  : 'bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-main)] hover:text-[var(--text-main)]'
              }`}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isFav ? 'Favorited' : 'Favorite'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
