import React from 'react';
import { Book } from '../../types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onSelectBook?: (book: Book) => void;
  emptyMessage?: string;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  onSelectBook,
  emptyMessage = 'No books found in this view.',
}) => {
  if (books.length === 0) {
    return (
      <div className="py-12 px-4 text-center bg-[#121826]/40 border border-white/5 rounded-2xl max-w-lg mx-auto my-6">
        <p className="font-serif text-[#f4f1ea] text-base mb-2">{emptyMessage}</p>
        <p className="text-xs text-gray-500">
          Try expanding your search parameters or explore other categories in the library.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {books.map((book, i) => (
        <BookCard key={book.id} book={book} onSelect={onSelectBook} index={i} />
      ))}
    </div>
  );
};
