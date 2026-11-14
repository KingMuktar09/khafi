import React, { useState } from 'react';
import { Star, BookOpen, ExternalLink, RefreshCw, AlertTriangle, StarOff, Eye } from 'lucide-react';
import { appState } from '../state/appState';
import { router } from '../router/router';
import { Book } from '../types';
import { CoverImage } from '../components/books/CoverImage';
import { getItemType, getTypeLabel, getTypeBadgeColor } from '../utils/fileUtils';
import { FilePreviewModal } from '../components/viewers/FilePreviewModal';

export const FavoritesView: React.FC = () => {
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  if (appState.loading) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-8 text-center space-y-3 font-sans max-w-md mx-auto my-12 shadow-2xs animate-fade-in">
        <div className="w-10 h-10 border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--gold)] flex items-center justify-center rounded-lg mx-auto animate-spin">
          <RefreshCw className="w-5 h-5 text-[var(--gold)]" />
        </div>
        <p className="text-sm font-semibold text-[var(--text-main)]">Loading favorites...</p>
      </div>
    );
  }

  if (appState.loadError) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-8 text-center space-y-4 font-sans max-w-md mx-auto my-12 shadow-2xs animate-fade-in">
        <div className="w-10 h-10 border border-amber-500/30 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-lg mx-auto">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-[var(--text-main)]">Unable to load favorites.</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            A network error occurred while retrieving catalog items.
          </p>
        </div>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => appState.retryLoad()}
            className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const favoriteBooks: Book[] = appState.getFavoriteBooks() || [];

  return (
    <div className="space-y-6 animate-fade-in py-2 font-sans max-w-4xl mx-auto">
      {/* Simple Header */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <h1 className="font-bold text-xl sm:text-2xl text-[var(--text-main)] flex items-center gap-2.5">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>Favorites</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Your saved books and files.
          </p>
        </div>

        {favoriteBooks.length > 0 && (
          <span className="text-xs px-3 py-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 font-semibold rounded-lg self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Favorites {favoriteBooks.length}</span>
          </span>
        )}
      </div>

      {/* Favorite Items List or Empty State */}
      {favoriteBooks.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl py-12 px-6 text-center max-w-md mx-auto space-y-4 shadow-2xs my-8">
          <div className="w-12 h-12 border border-amber-400/30 bg-amber-400/10 text-amber-400 flex items-center justify-center rounded-full mx-auto shadow-2xs">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-bold text-base text-[var(--text-main)]">
              No favorite files yet.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
              Favorite a book, document, image, video, or audio file and it will appear here.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.navigate('library')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Library</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteBooks.map((book) => {
            const itemType = getItemType(book);
            const typeLabel = getTypeLabel(book);
            const badgeColor = getTypeBadgeColor(itemType);

            return (
              <div
                key={book.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold-faint)] transition-all rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Thumbnail / File Cover */}
                  <div className="w-12 h-16 sm:w-14 sm:h-18 flex-shrink-0 relative rounded overflow-hidden bg-[var(--bg-main)] border border-[var(--border-subtle)] shadow-2xs">
                    <CoverImage
                      book={book}
                      coverUrl={book.coverUrl}
                      fileUrl={book.fileUrl}
                      title={book.title}
                      author={book.author}
                      category={book.category}
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-amber-400" title="Favorite">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </span>
                      <h3
                        onClick={() => router.navigate('read', { bookId: book.id })}
                        className="font-semibold text-sm sm:text-base text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors cursor-pointer truncate max-w-md"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] flex-wrap">
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border rounded ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
                        {typeLabel}
                      </span>
                      {book.author && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px]">{book.author}</span>
                        </>
                      )}
                      {(book.fileSize || book.pageCount) && (
                        <>
                          <span>•</span>
                          <span>{book.fileSize || (book.pageCount ? `${book.pageCount} Pages` : '')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-subtle)] w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setPreviewBook(book)}
                    className="px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--gold)] border border-[var(--border-main)] hover:border-[var(--gold)] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Quick Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => appState.toggleFavorite(book.id)}
                    className="px-3 py-1.5 border border-[var(--border-main)] hover:border-amber-400/50 text-[var(--text-muted)] hover:text-amber-400 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Remove from favorites"
                  >
                    <StarOff className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.navigate('read', { bookId: book.id })}
                    className="px-4 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Centralized File Preview Modal */}
      <FilePreviewModal
        book={previewBook}
        isOpen={!!previewBook}
        onClose={() => setPreviewBook(null)}
      />
    </div>
  );
};
