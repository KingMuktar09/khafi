import React from 'react';
import { Star, FileText, CheckCircle2, Trash2 } from 'lucide-react';
import { Book, ReadingProgress } from '../../types';
import { CoverImage } from './CoverImage';
import { appState } from '../../state/appState';
import { t, tf, type SiteLanguage } from '../../data/i18n';
import { router } from '../../router/router';
import { getItemType, getTypeLabel, getTypeBadgeColor, getBookCoverUrl, getPaidBadgeLabel, formatBookPrice } from '../../utils/fileUtils';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
  /** 0-based position in its grid, for the staggered entrance (capped at 11). */
  index?: number;
  /** Admin-only delete: when set (and the viewer is admin), a small trash
   *  button shows on the card. The parent must confirm before deleting. */
  onDelete?: (book: Book) => void;
  /**
   * Store values the card reads, passed as props so React.memo stays
   * correct. The card used to read appState directly during render, so
   * a memoised card would freeze: a favourite tap or a language change
   * re-renders the parents, but with identical props memo would skip
   * this card and the star / text would never update. The parent
   * (BookGrid) passes these; other callers may omit them and the card
   * falls back to reading appState, as before.
   */
  lang?: SiteLanguage;
  isFavorite?: boolean;
  progress?: ReadingProgress | undefined;
}

// Memoised: the Library re-renders on every keystroke / filter change, and
// without memo every one of the 138 cards re-rendered with it. A card only
// re-renders when its own book, favourite/progress state or index changes.
export const BookCard: React.FC<BookCardProps> = React.memo(({ book, onSelect, index = 0, onDelete, lang: langProp, isFavorite: isFavoriteProp, progress: progressProp }) => {
  const lang = langProp ?? appState.settings.language;
const typeLabelText = (label: string): string =>
  label === 'Document' ? t('book.typeDocument', lang)
  : label === 'Image' ? t('book.typeImage', lang)
  : label === 'Video' ? t('book.typeVideo', lang)
  : label === 'Audio' ? t('book.typeAudio', lang)
  : label === 'Archive' ? t('book.typeArchive', lang)
  : label === 'File' ? t('book.typeFile', lang)
  : label;

  const isFav = isFavoriteProp ?? appState.isFavorite(book.id);
  const progress = progressProp ?? appState.getReadingProgress(book.id);
  const percentage = progress?.percentage || 0;
  const isCompleted = percentage >= 100;

  const itemType = getItemType(book);
  const typeLabel = getTypeLabel(book);
  const badgeColor = getTypeBadgeColor(itemType);
  // Paid books show their price on the card when one is set (public
  // info); no price set means nothing shown here either.
  const priceLabel = book.isPaid ? formatBookPrice(book) : null;

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

  // Only the first 12 cards get the staggered entrance. The rest
  // mount without an animation: 138 staggered entrances (even capped
  // at ~0.5 s delay) all restart on every Library mount and keystroke.
  const animated = index < 12;

  return (
    <div
      onClick={handleCardClick}
      style={animated ? ({ '--motion-i': Math.min(index, 11) } as React.CSSProperties) : undefined}
      className={`motion-card ${animated ? 'motion-item' : ''} group relative bg-[var(--bg-surface)] border border-[var(--border-main)] hover:bg-[var(--bg-hover)] cursor-pointer flex flex-col h-full rounded-[14px] overflow-hidden`}
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
          thumbWidth={300}
        />

        {/* Type Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border rounded ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
            {typeLabelText(typeLabel)}
          </span>
          {getPaidBadgeLabel(book) ? (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-[var(--gold)]/60 bg-black/70 text-[var(--gold)] rounded">
              {t('paid.badge', lang)}
            </span>
          ) : (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-white/25 bg-black/60 text-white/80 rounded">
              {t('book.freeBadge', lang)}
            </span>
          )}
          {book.isAuthentic && (
            <span
              title={t('book.authenticMeaning', lang)}
              className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-emerald-400/60 bg-black/70 text-emerald-300 rounded inline-flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              {t('book.authenticBadge', lang)}
            </span>
          )}
          {(() => {
            const v = appState.getBookVersion(book);
            return v.totalVersions > 1 ? (
              <span
                title={tf('book.versionCardTitle', lang, { n: v.versionNumber, total: v.totalVersions, date: v.versionDate || 'unknown' })}
                className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-white/25 bg-black/60 text-white/80 rounded"
              >
                {tf('book.versionShort', lang, { n: v.versionNumber, total: v.totalVersions })}
              </span>
            ) : null;
          })()}
        </div>

        {/* Reading Progress Ribbon/Badge Overlay */}
        {percentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-[var(--bg-surface)]/90 px-2.5 py-1.5 border-t border-[var(--border-main)] flex items-center justify-between text-[10px]">
            <span className={`font-bold flex items-center gap-1 ${isCompleted ? 'text-emerald-500' : 'text-[var(--gold)]'}`}>
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{t('book.completed', lang)}</span>
                </>
              ) : (
                <span>{tf('book.progressLabel', lang, { n: percentage })}</span>
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
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full border transition-all cursor-pointer shadow-xs ${
            isFav
              ? 'bg-[var(--bg-surface)]/90 border-amber-400/60 text-amber-400 hover:scale-110'
              : 'bg-[var(--bg-surface)]/80 border-[var(--border-main)] text-[var(--text-muted)] hover:text-amber-400 hover:border-amber-400/50 hover:scale-110'
          }`}
          title={isFav ? t('book.unfavoriteFile', lang) : t('book.favoriteFile', lang)}
          aria-label={isFav ? t('book.unfavoriteFile', lang) : t('book.favoriteFile', lang)}
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
            className="absolute top-12 right-2.5 z-10 p-1.5 rounded-full border transition-all cursor-pointer shadow-xs bg-[var(--bg-surface)]/80 border-[var(--border-main)] text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-400/50 hover:scale-110"
            title={tf('book.deleteTitleAttr', lang, { title: book.title })}
            aria-label={tf('book.deleteAria', lang, { title: book.title })}
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
          {priceLabel && (
            <p className="text-[11px] font-bold text-[var(--gold)] mt-0.5">
              {priceLabel}
            </p>
          )}
        </div>

        <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] mt-2">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>{book.pageCount ? tf('book.pagesSuffix', lang, { n: book.pageCount }) : typeLabelText(typeLabel)}</span>
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
});
