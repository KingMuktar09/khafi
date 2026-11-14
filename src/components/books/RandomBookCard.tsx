import React, { useState, useEffect } from 'react';
import { Shuffle, BookOpen, Star } from 'lucide-react';
import { Book } from '../../types';
import { appState } from '../../state/appState';
import { router } from '../../router/router';
import { CoverImage } from './CoverImage';

export const RandomBookCard: React.FC = () => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  const selectNewRandomBook = () => {
    const selected = appState.getRandomBook();
    setCurrentBook(selected);
  };

  useEffect(() => {
    selectNewRandomBook();
  }, [appState.catalog.books]);

  if (!currentBook) {
    return (
      <div className="p-8 text-center bg-[#111111] border border-white/10 font-mono text-xs text-white/40">
        NO_VOLUMES_AVAILABLE
      </div>
    );
  }

  const isFav = appState.isFavorite(currentBook.id);

  return (
    <div className="bg-[#111111] border border-white/15 p-6 sm:p-8 space-y-6 relative group">
      
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <span className="font-mono text-xs text-[#E2FF00] font-bold tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E2FF00]"></span>
          <span>[ RANDOM_DISCOVERY ]</span>
        </span>

        <button
          onClick={selectNewRandomBook}
          className="font-mono text-xs text-white/70 hover:text-white border border-white/15 hover:border-white/40 px-3 py-1.5 flex items-center gap-2 transition-all"
          title="Pick another volume"
        >
          <Shuffle className="w-3.5 h-3.5 text-[#E2FF00]" />
          <span>SURPRISE_ME</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Cover */}
        <div
          onClick={() => router.navigate('book', { bookId: currentBook.id })}
          className="w-36 sm:w-44 aspect-[1/1.35] shrink-0 border border-white/15 cursor-pointer hover:border-[#E2FF00] transition-all"
        >
          <CoverImage
            coverUrl={currentBook.coverUrl}
            title={currentBook.title}
            author={currentBook.author}
            category={currentBook.category}
          />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between text-center sm:text-left min-w-0">
          <div>
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#E2FF00] block mb-2">
              / {currentBook.category}
            </span>

            <h2
              onClick={() => router.navigate('book', { bookId: currentBook.id })}
              className="font-sans font-bold text-2xl text-white hover:text-[#E2FF00] transition-colors cursor-pointer leading-tight mb-2"
            >
              {currentBook.title}
            </h2>

            <p className="font-mono text-xs text-white/50 mb-4">
              AUTHOR // {currentBook.author}
            </p>

            <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed line-clamp-3 mb-6">
              {currentBook.description || 'A valuable treatise preserved in the digital archive.'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => router.navigate('book', { bookId: currentBook.id })}
              className="bg-[#E2FF00] hover:bg-[#d8f500] text-black font-mono font-bold text-xs px-5 py-2.5 uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>ACCESS_VOLUME</span>
            </button>

            <button
              type="button"
              onClick={() => appState.toggleFavorite(currentBook.id)}
              className={`font-mono text-xs px-4 py-2.5 border uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isFav
                  ? 'bg-amber-400/20 text-amber-400 border-amber-400'
                  : 'text-white/60 hover:text-white border-white/15 hover:border-white/30'
              }`}
            >
              {isFav ? (
                <>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>FAVORITED</span>
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 text-white/60" />
                  <span>FAVORITE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
