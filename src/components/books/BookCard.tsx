import React from 'react';
import { Star, FileText, CheckCircle2, Trash2 } from 'lucide-react';
import { Book } from '../../types';
import { CoverImage } from './CoverImage';
import { appState } from '../../state/appState';
import { router } from '../../router/router';
import { getItemType, getTypeLabel, getTypeBadgeColor, getBookCoverUrl } from '../../utils/fileUtils';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
  /** 0-based position in its grid, for the staggered entrance (capped at 11). */
  index?: number;
  /** Admin-only delete: when set (and the viewer is admin), a small trash
   *  button shows on the card. The parent must confirm before deleting. */
  onDelete?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect, index = 0, onDelete }) => {
  const isFav = appState.isFavorite(book.id);
  const progress = appState.getReadingProgress(book.id);
  const percentage = progress?.percentage || 0;
  const isCompleted = percentage >= 100;

  const itemType = getItemType(book);
  const typeLabel = getTypeLabel(book);
  const badgeColor = getTypeBadgeColor(itemType);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(book);
    } else {
      router.navigate('book', { bookId: book.id });
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    appState.toggleFavorite(book.id);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{ '--motion-i': Math.min(index, 11) } as React.CSSProperties}
      className="motion-card motion-item group relative bg-[var(--bg-surface)] border border-[var(--border-main)] hover:bg-[var(--bg-hover)] cursor-pointer flex flex-col h-full rounded-lg overflow-hidden"
    >
      {/* Cover Image Container — fixed 2:3 book ratio so the grid never jumps while covers load */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[var(--bg-main)]">
        <CoverImage
          book={book}
          coverUrl={getBookCoverUrl(book)}
          fileUrl={book.fileUrl}
          title={book.title}
          author={book.author}
          category={book.category}
        />

        {/* Type Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border backdrop-blur-sm rounded ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
            {typeLabel}
          </span>
          {book.isPaid ? (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[var(--gold)]/60 bg-black/70 text-[var(--gold)] backdrop-blur-sm rounded">
              Paid{typeof book.price === 'number' ? ` • ₹${book.price.toLocaleString('en-IN')}` : ''}
            </span>
          ) : (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-white/25 bg-black/60 text-white/80 backdrop-blur-sm rounded">
              Free
            </span>
          )}
          {book.isAuthentic && (
            <span
              title="Marked Authentic by the library admin — this copy was checked and found to be the genuine, unaltered text of the named work."
              className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-emerald-400/60 bg-black/70 text-emerald-300 backdrop-blur-sm rounded inline-flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Authentic
            </span>
          )}
          {(() => {
            const v = appState.getBookVersion(book);
            return v.totalVersions > 1 ? (
              <span
                title={`Version ${v.versionNumber} of ${v.totalVersions} — dated ${v.versionDate || 'unknown'}. Same title, different copy.`}
                className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-white/25 bg-black/60 text-white/80 backdrop-blur-sm rounded"
              >
                Version {v.versionNumber} of {v.totalVersions}
              </span>
            ) : null;
          })()}
        </div>

        {/* Reading Progress Ribbon/Badge Overlay */}
        {percentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-[var(--bg-surface)]/90 backdrop-blur-sm px-2.5 py-1.5 border-t border-[var(--border-main)] flex items-center justify-between text-[10px]">
            <span className={`font-bold flex items-center gap-1 ${isCompleted ? 'text-emerald-500' : 'text-[var(--gold)]'}`}>
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>COMPLETED</span>
                </>
              ) : (
                <span>PROGRESS: {percentage}%</span>
              )}
            </span>
            {progress?.currentPage && progress?.totalPages ? (
              <span className="text-[var(--text-muted)] text-[9px]">
                p.{progress.currentPage}/{progress.totalPages}
              </span>
            ) : null}
          </div>
        )}

        {/* Favorite Button Overlay */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full border backdrop-blur-sm transition-all cursor-pointer shadow-xs ${
            isFav
              ? 'bg-[var(--bg-surface)]/90 border-amber-400/60 text-amber-400 hover:scale-110'
              : 'bg-[var(--bg-surface)]/80 border-[var(--border-main)] text-[var(--text-muted)] hover:text-amber-400 hover:border-amber-400/50 hover:scale-110'
          }`}
          title={isFav ? 'Unfavorite file' : 'Favorite file'}
          aria-label={isFav ? 'Unfavorite file' : 'Favorite file'}
        >
          {isFav ? (
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          ) : (
            <Star className="w-4 h-4 text-[var(--text-muted)] group-hover:text-amber-400" />
          )}
        </button>

        {/* Admin delete — small trash button under the star. Admin only,
            and only when the parent passed onDelete (Library view). */}
        {onDelete && appState.isAdmin() && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book);
            }}
            className="absolute top-12 right-2.5 z-10 p-1.5 rounded-full border backdrop-blur-sm transition-all cursor-pointer shadow-xs bg-[var(--bg-surface)]/80 border-[var(--border-main)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-400/50 hover:scale-110"
            title={`Delete "${book.title}" from the library`}
            aria-label={`Delete ${book.title} from the library`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar Line */}
      {percentage > 0 && (
        <div className="w-full bg-[var(--bg-main)] h-1 relative overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-[var(--gold)]'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Book Information Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
        <div>
          <h3 className="font-display font-semibold text-base sm:text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] line-clamp-2 leading-snug transition-colors mb-1">
            {book.title}
          </h3>
          <p className="text-xs text-[var(--text-muted)] line-clamp-1">
            {book.author}
          </p>
          {(book.topic || book.category) && (
            <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
              {book.topic ? (
                <>
                  <span className="text-[var(--gold)] font-medium">{book.topic}</span>
                  <span> • {book.category}</span>
                </>
              ) : (
                book.category
              )}
            </p>
          )}
        </div>

        <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] mt-2">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>{book.pageCount ? `${book.pageCount} Pages` : typeLabel}</span>
          </span>
          {percentage > 0 ? (
            <span className={`font-semibold ${isCompleted ? 'text-emerald-500' : 'text-[var(--gold)]'}`}>
              {percentage}%
            </span>
          ) : (
            book.fileSize && <span>{book.fileSize}</span>
          )}
        </div>
      </div>
    </div>
  );
};
