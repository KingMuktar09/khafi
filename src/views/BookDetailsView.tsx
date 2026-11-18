import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Download, ExternalLink, Instagram, Star, Tag, Play, Image as ImageIcon, Music as AudioIcon, FileText, HardDrive, Folder as FolderIcon, Calendar, FileType, Hash } from 'lucide-react';
import { appState } from '../state/appState';
import { router } from '../router/router';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { Book } from '../types';
import { CoverImage } from '../components/books/CoverImage';
import { PaidLockScreen } from '../components/books/PaidLockScreen';
import { PaidBookControl } from '../components/admin/PaidBookControl';
import { ReadingProgressTracker } from '../components/books/ReadingProgressTracker';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ReaderAdvisoryModal } from '../components/ui/ReaderAdvisoryModal';
import { getItemType, getTypeLabel, getTypeBadgeColor, getItemUrl, getFileExtension, downloadBookFile } from '../utils/fileUtils';
import { AUTHENTIC_MEANING, formatVersionDate } from '../utils/bookOrder';

// Admin-only: mark THIS already-added book paid or free again, right from
// its details page — no need to go back to the admin list and open the edit
// form. Only the admin ever sees this panel; visitors see the paid lock
// screen instead.
const AdminPaidPanel: React.FC<{ book: Book }> = ({ book }) => {
  const [draft, setDraft] = useState({
    isPaid: Boolean(book.isPaid),
    price: book.price,
    paymentNote: book.paymentNote || '',
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  // Keep the panel in step when the book changes (e.g. after a save reloads
  // the catalog, or the admin opens another book).
  useEffect(() => {
    setDraft({
      isPaid: Boolean(book.isPaid),
      price: book.price,
      paymentNote: book.paymentNote || '',
    });
    setNotice(null);
  }, [book.id, book.isPaid, book.price, book.paymentNote]);

  const handleSavePaid = async () => {
    // A paid book needs no price anymore: paid books are FREE for
    // followers, the price field is kept only for reference.
    setSaving(true);
    const res = await api.updateBook(book.id, {
      isPaid: draft.isPaid,
      price: draft.isPaid ? draft.price : (null as unknown as number),
      paymentLink: draft.isPaid ? undefined : '',
      paymentNote: draft.isPaid ? (draft.paymentNote || '') : '',
    });
    setSaving(false);
    if (res.success) {
      setNotice({
        text:
          res.durable === true
            ? 'Saved permanently.'
            : 'Saved for now only — set GITHUB_SYNC_TOKEN in Vercel to keep it.',
        ok: true,
      });
      await appState.loadCatalog();
    } else {
      setNotice({ text: res.error || 'Failed to save.', ok: false });
    }
  };

  return (
    <div className="space-y-3 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-3">
      <p className="text-xs font-semibold text-[var(--text-main)]">
        Admin: paid or free
      </p>
      <PaidBookControl
        book={draft}
        onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
      />
      <button
        type="button"
        onClick={handleSavePaid}
        disabled={saving}
        className="w-full px-3 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-60 text-black font-semibold rounded text-xs cursor-pointer"
      >
        {saving ? 'Saving…' : 'Save paid setting'}
      </button>
      {notice && (
        <p className={`text-[11px] leading-relaxed ${notice.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
          {notice.text}
        </p>
      )}
    </div>
  );
};

export const BookDetailsView: React.FC = () => {
  const bookId = appState.route.bookId;
  const book = bookId ? appState.getBookById(bookId) : undefined;
  const [showAdvisoryModal, setShowAdvisoryModal] = useState(false);
  const [retryingCatalog, setRetryingCatalog] = useState(false);

  useEffect(() => {
    if (bookId) {
      appState.recordViewedBook(bookId);
    }
  }, [bookId]);

  if (!book) {
    return (
      <div className="py-20 text-center space-y-4 font-sans">
        <h2 className="font-semibold text-xl text-[var(--text-main)]">
          Item Not Found
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          The requested file or item does not exist in the library.
        </p>
        <button
          onClick={() => router.navigate('library')}
          className="px-4 py-2 text-xs font-semibold bg-[var(--gold)] text-black rounded"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const isFav = appState.isFavorite(book.id);
  const isAdmin = appState.adminAuthenticated;
  // Paid books are FREE for followers: a gate-unlocked visitor (follow tap
  // or gate key) reads them like any free book. Only a locked visitor sees
  // the followers-only lock screen.
  const isFollowUnlocked = storage.hasFollowUnlocked();
  const isPaidForVisitor = Boolean(book.isPaid) && !isAdmin && !isFollowUnlocked;
  // Honest static-fallback case: when the live catalog did not load, the
  // client falls back to public/catalog.json, whose paid-book links are
  // always stripped. An unlocked follower then sees the book with no links
  // — not a lock, just a missing link, with a retry to reload the live
  // catalog. (Free books are unaffected.)
  const paidLinksMissing =
    Boolean(book.isPaid) &&
    !book.driveFileId &&
    !book.externalUrl &&
    !book.fileUrl &&
    !book.pdfUrl;
  const itemType = getItemType(book);
  const typeLabel = getTypeLabel(book);
  const badgeColor = getTypeBadgeColor(itemType);
  const fileUrl = getItemUrl(book);
  const ext = getFileExtension(fileUrl || book.title).toUpperCase();
  const folder = book.folderId ? appState.getFolderById(book.folderId) : undefined;
  const version = appState.getBookVersion(book);

  const handleOpen = () => {
    if (appState.hasAcknowledgedAdvisory()) {
      router.navigate('read', { bookId: book.id });
    } else {
      setShowAdvisoryModal(true);
    }
  };

  const handleConfirmAdvisory = () => {
    appState.acknowledgeAdvisory();
    setShowAdvisoryModal(false);
    router.navigate('read', { bookId: book.id });
  };

  const handleBack = () => {
    if (book.folderId) {
      router.navigate('library', { folderId: book.folderId, subfolderId: book.subfolderId });
    } else {
      router.navigate('library');
    }
  };

  const getPrimaryActionLabel = () => {
    switch (itemType) {
      case 'pdf': return 'Read PDF';
      case 'image': return 'View Image';
      case 'video': return 'Play Video';
      case 'audio': return 'Play Audio';
      case 'document': return 'View Document';
      default: return 'Open File';
    }
  };

  const renderActionIcon = () => {
    switch (itemType) {
      case 'video':
      case 'audio':
        return <Play className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in py-2 max-w-4xl mx-auto font-sans">
      
      <ReaderAdvisoryModal
        isOpen={showAdvisoryModal}
        bookTitle={book.title}
        onConfirm={handleConfirmAdvisory}
        onCancel={() => setShowAdvisoryModal(false)}
      />

      {/* Navigation Top Bar */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-3 flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className="p-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded transition-colors text-xs flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <Breadcrumbs
          folderId={book.folderId}
          subfolderId={book.subfolderId}
          bookTitle={book.title}
        />
      </div>

      {/* Details Panel */}
      <div className="ms-panel rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Cover Preview */}
        <div className="md:col-span-4 flex flex-col items-center space-y-3">
          <div className="w-full max-w-[200px] aspect-[3/4] border border-[var(--border-main)] bg-[var(--bg-main)] rounded-md overflow-hidden shadow-xs relative">
            <CoverImage book={book} />
          </div>

          <button
            type="button"
            onClick={() => appState.toggleFavorite(book.id)}
            className={`w-full max-w-[200px] py-2 px-3 text-xs rounded border flex items-center justify-center gap-1.5 transition-all cursor-pointer font-medium ${
              isFav
                ? 'bg-amber-400/15 border-amber-400/50 text-amber-400 hover:bg-amber-400/25'
                : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-main)] hover:border-amber-400/50'
            }`}
            title={isFav ? 'Unfavorite item' : 'Favorite item'}
            aria-label={isFav ? 'Unfavorite item' : 'Favorite item'}
          >
            {isFav ? (
              <>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Favorited</span>
              </>
            ) : (
              <>
                <Star className="w-4 h-4 text-[var(--text-muted)]" />
                <span>Add to Favorites</span>
              </>
            )}
          </button>

          {/* My Shelf — save with a reading status, local only. */}
          <div className="w-full max-w-[200px] space-y-1.5">
            <p className="text-[11px] text-[var(--text-muted)] font-semibold text-center">My Shelf</p>
            <div className="flex gap-1.5">
              {(['to-read', 'reading', 'finished'] as const).map((status) => {
                const active = appState.getShelfStatus(book.id) === status;
                const label = status === 'to-read' ? 'To Read' : status === 'reading' ? 'Reading' : 'Finished';
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => appState.setShelfStatus(book.id, active ? null : status)}
                    aria-pressed={active}
                    className={`tap-target flex-1 py-1.5 px-1 text-[11px] rounded border font-semibold cursor-pointer transition-colors ${
                      active
                        ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                        : 'bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-main)] hover:text-[var(--text-main)] hover:border-[var(--gold)]/50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {appState.getShelfStatus(book.id) && (
              <button
                type="button"
                onClick={() => appState.setShelfStatus(book.id, null)}
                className="w-full text-[11px] text-[var(--text-muted)] hover:text-[var(--gold)] cursor-pointer"
              >
                Remove from My Shelf
              </button>
            )}
          </div>
        </div>

        {/* Information & Actions */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
                {typeLabel}
              </span>
              <span className="text-xs text-[var(--gold)] font-medium">
                {book.category}
              </span>
              {book.topic && (
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  • {book.topic}
                </span>
              )}
              {book.isAuthentic && (
                <span
                  title={AUTHENTIC_MEANING}
                  className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                >
                  ✓ Authentic
                </span>
              )}
              {version.totalVersions > 1 && (
                <span
                  title={`Same title, different copy. This is Version ${version.versionNumber} of ${version.totalVersions}, dated ${formatVersionDate(book)} (Drive date).`}
                  className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-main)]"
                >
                  Version {version.versionNumber} of {version.totalVersions} • {formatVersionDate(book)}
                </span>
              )}
            </div>

            <h1 className="font-display font-semibold text-3xl text-[var(--text-main)] leading-tight">
              {book.title}
            </h1>

            {book.isPaid ? (
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-full px-3 py-1 w-fit">
                <span>
                  {isFollowUnlocked || isAdmin
                    ? 'Paid book — free for followers'
                    : 'Paid book — followers only'}
                </span>
              </p>
            ) : (
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-main)] border border-[var(--border-main)] rounded-full px-3 py-1 w-fit">
                <span>Free — no payment needed</span>
              </p>
            )}

            {book.author && (
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Author / Creator: {book.author}
              </p>
            )}

            {book.description && (
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                {book.description}
              </p>
            )}
          </div>

          {/* Reading Tracker for PDFs */}
          {itemType === 'pdf' && <ReadingProgressTracker book={book} />}

          {/* Actions */}
          <div className="p-4 ms-panel rounded-xl space-y-3 text-sm">
            {isPaidForVisitor ? (
              <PaidLockScreen book={book} />
            ) : (
              <>
                {isAdmin && book.isPaid && (
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--gold-faint)] border border-[var(--gold)]/30 rounded-lg px-3 py-2">
                    Admin view: this book is marked Paid. Locked visitors see the followers-only lock instead of the reader.
                  </p>
                )}
                {isAdmin && <AdminPaidPanel book={book} />}
                {!isAdmin && book.isPaid && paidLinksMissing && (
                  <div className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--gold-faint)] border border-[var(--gold)]/30 rounded-lg px-3 py-2 space-y-2">
                    <p>
                      Free for followers. This book is free for you. The live catalog did not load just now, so its Drive link is missing.
                    </p>
                    <button
                      type="button"
                      disabled={retryingCatalog}
                      onClick={async () => {
                        setRetryingCatalog(true);
                        await api.reloadCatalog();
                        await appState.loadCatalog();
                        setRetryingCatalog(false);
                      }}
                      className="tap-target px-3 py-1.5 rounded-lg bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-60 text-black font-semibold cursor-pointer"
                    >
                      {retryingCatalog ? 'Retrying…' : 'Retry — reload the live catalog'}
                    </button>
                  </div>
                )}
                {!isAdmin && book.isPaid && !paidLinksMissing && (
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--gold-faint)] border border-[var(--gold)]/30 rounded-lg px-3 py-2">
                    Free for followers. No payment needed.
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {book.externalUrl ? (
                    <a
                      href={book.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="tap-target bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold py-3 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in Drive</span>
                    </a>
                  ) : (
                    <button
                      onClick={handleOpen}
                      className="tap-target bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold py-3 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {renderActionIcon()}
                      <span>{getPrimaryActionLabel()}</span>
                    </button>
                  )}

                  <button
                    onClick={handleOpen}
                    className="tap-target bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] font-medium py-3 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {renderActionIcon()}
                    <span>Read in app</span>
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-faint)] leading-relaxed">
                  Books read in the app with Google Drive's viewer. You can also open any book in Drive or download it.
                </p>
              </>
            )}
          </div>

          {/* Details Table */}
          <div className="pt-2 border-t border-[var(--border-subtle)] text-xs grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg flex items-center gap-2">
              <FileType className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <div className="min-w-0">
                <span className="text-[var(--text-faint)] block text-[10px]">File Format</span>
                <span className="font-semibold text-[var(--text-main)] uppercase">{ext || typeLabel}</span>
              </div>
            </div>
            {folder && (
              <div className="p-2.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg flex items-center gap-2">
                <FolderIcon className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[var(--text-faint)] block text-[10px]">Location</span>
                  <span className="font-semibold text-[var(--text-main)] truncate block">{folder.name}</span>
                </div>
              </div>
            )}
            {book.pageCount ? (
              <div className="p-2.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg flex items-center gap-2">
                <Hash className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[var(--text-faint)] block text-[10px]">Page Count</span>
                  <span className="font-semibold text-[var(--text-main)]">{book.pageCount} Pages</span>
                </div>
              </div>
            ) : null}
            {book.fileSize && (
              <div className="p-2.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[var(--text-faint)] block text-[10px]">File Size</span>
                  <span className="font-semibold text-[var(--text-main)]">{book.fileSize}</span>
                </div>
              </div>
            )}
            {book.year && (
              <div className="p-2.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[var(--text-faint)] block text-[10px]">Year / Date</span>
                  <span className="font-semibold text-[var(--text-main)]">{book.year}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
