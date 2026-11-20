import React from 'react';
import { Book } from '../../types';
import { BookCard } from './BookCard';
import { appState } from '../../state/appState';

interface BookGridProps {
  books: Book[];
  onSelectBook?: (book: Book) => void;
  emptyMessage?: string;
  /** Admin-only delete, forwarded to each card (Library view only). */
  onDeleteBook?: (book: Book) => void;
  /** Position of books[0] in the whole list, so the first-12 entrance
   *  stagger is global, not per group. LibraryView passes it for its
   *  grouped sections; flat lists leave it at 0. */
  indexOffset?: number;
}

// Deliberately NOT React.memo: the grid reads favourite / progress /
// language from the global appState during render and hands them to
// each card as props (that is what makes the memoised BookCard update
// correctly on a favourite tap or a language change). Memoising the
// grid would freeze those store reads whenever its own props stayed
// the same. The grid itself is cheap — it only maps books to elements;
// the expensive per-card render is what BookCard's memo skips.
export const BookGrid: React.FC<BookGridProps> = ({
  books,
  onSelectBook,
  emptyMessage = 'No books found in this view.',
  onDeleteBook,
  indexOffset = 0,
}) => {
  if (books.length === 0) {
    return (
      <div className="py-12 px-4 text-center bg-[var(--bg-surface)]/60 border border-[var(--border-main)] rounded-2xl max-w-lg mx-auto my-6">
        <p className="font-serif text-[#f4f1ea] text-base mb-2">{emptyMessage}</p>
        <p className="text-xs text-gray-500">
          Try expanding your search parameters or explore other categories in the library.
        </p>
      </div>
    );
  }

  const lang = appState.settings.language;
  const favorites = new Set(appState.favorites);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {books.map((book, i) => (
        <BookCard
          key={book.id}
          book={book}
          onSelect={onSelectBook}
          index={indexOffset + i}
          onDelete={onDeleteBook}
          lang={lang}
          isFavorite={favorites.has(book.id)}
          progress={appState.getReadingProgress(book.id)}
        />
      ))}
    </div>
  );
};
