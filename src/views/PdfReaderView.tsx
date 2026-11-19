import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  AlertCircle,
  BookOpen,
  Star,
  FileText,
  Archive as ArchiveIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Music as AudioIcon,
  RotateCcw,
  Bookmark,
  Lock,
} from 'lucide-react';
import { appState } from '../state/appState';
import { t, tf } from '../data/i18n';
import { router } from '../router/router';
import { readerAccess } from '../utils/gateDecision';
import { ReaderAdvisoryModal } from '../components/ui/ReaderAdvisoryModal';
import { getItemType, getTypeLabel, getTypeBadgeColor, getItemUrl, getFileExtension, getDrivePreviewUrl, downloadBookFile } from '../utils/fileUtils';
import { FilePreviewer, FitMode } from '../components/viewers/FilePreviewer';
import { PdfZoomOverlay } from '../components/pdf/PdfZoomOverlay';
import { PaidLockScreen } from '../components/books/PaidLockScreen';
import { storage } from '../services/storage';

export const PdfReaderView: React.FC = () => {
  const bookId = appState.route.bookId;
  const lang = appState.settings.language;
  const typeLabelText = (label: string): string =>
    label === 'Document' ? t('book.typeDocument', lang)
    : label === 'Image' ? t('book.typeImage', lang)
    : label === 'Video' ? t('book.typeVideo', lang)
    : label === 'Audio' ? t('book.typeAudio', lang)
    : label === 'Archive' ? t('book.typeArchive', lang)
    : label === 'File' ? t('book.typeFile', lang)
    : label;
  const book = bookId ? appState.getBookById(bookId) : undefined;
  const [showAdvisoryModal, setShowAdvisoryModal] = useState(!appState.hasAcknowledgedAdvisory());
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fitMode, setFitMode] = useState<FitMode>('width');
  const [isFitWidth, setIsFitWidth] = useState(true);
  const [retryNonce, setRetryNonce] = useState(0);
  // Resume + bookmarks: the page the reader opens at (from saved progress),
  // and the page the reader is on now. For local PDFs the canvas reader
  // jumps to the saved page; for Drive books the Drive viewer cannot be
  // jumped by the app, so the saved page is shown to jump to by hand.
  const savedPage = bookId ? storage.getBookProgress(bookId)?.currentPage || 1 : 1;
  const [resumePage, setResumePage] = useState(savedPage);
  const [currentPage, setCurrentPage] = useState(savedPage);
  const [jumpInput, setJumpInput] = useState('');

  const bookmarks = bookId ? appState.getBookmarksForBook(bookId) : [];
  const isBookmarked = bookmarks.includes(currentPage);

  const jumpToPage = (page: number) => {
    const total = book?.pageCount || appState.getReadingProgress(bookId!)?.totalPages;
    const clamped = Math.max(1, total ? Math.min(total, page) : page);
    setCurrentPage(clamped);
    setResumePage(clamped);
    setJumpInput('');
    if (bookId) {
      const pct = total ? Math.min(100, Math.round((clamped / total) * 100)) : appState.getReadingProgress(bookId)?.percentage || 0;
      appState.setReadingProgress(bookId, pct, clamped, total);
    }
    // Remount the viewer so the canvas reader opens at the new page.
    setRetryNonce((n) => n + 1);
  };

  const handleZoomIn = () => {
    setFitMode('custom');
    setIsFitWidth(false);
    setZoomLevel((z) => Math.min(300, z + 25));
  };

  const handleZoomOut = () => {
    setFitMode('custom');
    setIsFitWidth(false);
    setZoomLevel((z) => Math.max(50, z - 25));
  };

  const handleFitWidth = () => {
    setFitMode('width');
    setIsFitWidth(true);
    setZoomLevel(100);
  };

  const handleFitPage = () => {
    setFitMode('page');
    setIsFitWidth(false);
    setZoomLevel(100);
  };

  const handleSetZoom = (newZoom: number) => {
    setFitMode('custom');
    setIsFitWidth(false);
    setZoomLevel(newZoom);
  };

  const handleResetZoom100 = () => {
    setFitMode('custom');
    setIsFitWidth(false);
    setZoomLevel(100);
  };

  if (!book) {
    return (
      <div className="py-20 text-center space-y-4 font-mono text-xs text-[var(--text-muted)]">
        <h2 className="font-serif font-bold text-2xl text-[var(--text-main)]">
          {t('book.notFound', lang)}
        </h2>
        <button
          onClick={() => router.navigate('library')}
          className="px-4 py-2 bg-[var(--gold)] text-black font-bold uppercase rounded"
        >
          {t('book.returnToLibrary', lang)}
        </button>
      </div>
    );
  }

  // Paid gate (closes the direct /read/<id> bypass): a paid book never
  // opens its reader, download or Drive link without its own key. Admins
  // read paid books directly, and so do visitors holding that book's own
  // unlock key — following alone does not open a paid book. A free book
  // opened by a locked visitor (deep link past the gate) shows a follow
  // prompt instead of the file.
  const isAdmin = appState.adminAuthenticated;
  const access = readerAccess({
    isPaid: book.isPaid,
    isAdmin,
    followUnlocked: storage.hasFollowUnlocked(),
    hasKeyUnlock: storage.hasBookKey(book.id),
  });
  if (access === 'paid-lock') {
    return (
      <div className="animate-fade-in py-2 max-w-2xl mx-auto font-sans">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-5 sm:p-6">
          <PaidLockScreen
            book={book}
            onBack={() => router.navigate('book', { bookId: book.id })}
            backLabel={t('reader.backToDetails', lang)}
            onUnlocked={() => router.navigate('book', { bookId: book.id })}
          />
        </div>
      </div>
    );
  }

  if (access === 'follow-prompt') {
    return (
      <div className="animate-fade-in py-2 max-w-2xl mx-auto font-sans">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-5 sm:p-6 space-y-3 text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-full px-3 py-1 w-fit">
            <Lock className="w-3.5 h-3.5" />
            <span>{t('reader.followToReadTitle', lang)}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {t('reader.followToReadText', lang)}
          </p>
          <button
            type="button"
            onClick={() => router.navigate('library')}
            className="tap-target px-4 py-2.5 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black transition-all cursor-pointer text-sm"
          >
            {t('reader.goToLibrary', lang)}
          </button>
        </div>
      </div>
    );
  }

  const isFav = appState.isFavorite(book.id);
  const itemType = getItemType(book);
  const typeLabel = getTypeLabel(book);
  const badgeColor = getTypeBadgeColor(itemType);
  const fileTarget = getItemUrl(book);
  const ext = getFileExtension(fileTarget || book.title).toLowerCase();
  // Drive books read in Google Drive's viewer (see FilePreviewer), so the
  // pdf.js zoom controls below do not apply to them and are hidden.
  const isDriveBook = Boolean(getDrivePreviewUrl(book));

  const currentProgress = appState.getReadingProgress(book.id);
  const percentage = currentProgress?.percentage || 0;
  const isCompleted = percentage >= 100;

  const handleBack = () => {
    router.navigate('book', { bookId: book.id });
  };

  const handleUpdateProgress = (pct: number) => {
    const totalPages = book.pageCount || currentProgress?.totalPages;
    const calcPage = totalPages ? Math.round((pct / 100) * totalPages) : undefined;
    appState.setReadingProgress(book.id, pct, calcPage, totalPages);
    appState.showToast(
      pct === 100 ? tf('reader.markedCompleted', lang, { title: book.title }) : tf('reader.progressUpdated', lang, { n: pct }),
      'success'
    );
  };

  const handleConfirmAdvisory = () => {
    appState.acknowledgeAdvisory();
    setShowAdvisoryModal(false);
  };

  const handleCancelAdvisory = () => {
    setShowAdvisoryModal(false);
    handleBack();
  };

  // Render content based on file type using centralized FilePreviewer
  const renderViewerContent = () => {
    if (!fileTarget) {
      return (
        <div className="p-8 text-center max-w-md space-y-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded m-4 font-mono">
          <div className="p-3 bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--border-main)] rounded inline-block">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">{t('reader.noFile', lang)}</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {t('reader.noFileText', lang)}
          </p>
        </div>
      );
    }

    return (
      <FilePreviewer
        key={`${fileTarget}-${retryNonce}`}
        book={book}
        fileUrl={fileTarget}
        onDownload={() => downloadBookFile(book)}
        zoomLevel={zoomLevel}
        isFitWidth={isFitWidth}
        fitMode={fitMode}
        initialPage={resumePage}
        onZoomChange={(newZoom, newFit, newMode) => {
          setZoomLevel(newZoom);
          setIsFitWidth(newFit);
          if (newMode) {
            setFitMode(newMode);
          } else if (newFit) {
            setFitMode('width');
          } else {
            setFitMode('custom');
          }
        }}
        onPageChange={(page, totalPages) => {
          setCurrentPage(page);
          if (totalPages > 0) {
            const calculatedPercentage = Math.min(100, Math.round((page / totalPages) * 100));
            appState.setReadingProgress(book.id, calculatedPercentage, page, totalPages);
          }
        }}
        onRetry={() => setRetryNonce((n) => n + 1)}
      />
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] md:h-[calc(100vh-8rem)] min-h-[480px] ms-panel rounded overflow-hidden animate-fade-in my-1 sm:my-2">
      
      {/* Reader Advisory Modal before viewing */}
      <ReaderAdvisoryModal
        isOpen={showAdvisoryModal}
        bookTitle={book.title}
        onConfirm={handleConfirmAdvisory}
        onCancel={handleCancelAdvisory}
      />
      
      {/* Mobile Top Header (<768px) */}
      <div className="md:hidden bg-[var(--bg-main)] border-b border-[var(--border-main)] px-2.5 py-2 flex items-center justify-between gap-2 shrink-0 font-mono text-xs">
        {/* Left: Back + Badge + Title */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <button
            onClick={handleBack}
            className="px-2 py-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--gold)] border border-[var(--border-main)] rounded transition-colors shrink-0 flex items-center gap-1 font-bold text-xs cursor-pointer"
            title={t('reader.returnDetailsTitle', lang)}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t('book.back', lang)}</span>
          </button>

          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase shrink-0 ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
            {typeLabelText(typeLabel)}
          </span>

          <h1
            className="font-serif font-bold text-xs text-[var(--text-main)] truncate min-w-0 flex-1"
            title={book.title}
          >
            {book.title}
          </h1>
        </div>

        {/* Right: Actions (Favorite + Download) */}
        <div className="flex items-center gap-1 shrink-0 font-mono">
          <button
            type="button"
            onClick={() => appState.toggleFavorite(book.id)}
            className={`p-1.5 text-xs border rounded transition-colors cursor-pointer ${
              isFav
                ? 'bg-amber-400/15 border-amber-400/50 text-amber-400'
                : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] border-[var(--border-main)]'
            }`}
            title={isFav ? t('book.unfavoriteAria', lang) : t('book.favoriteAria', lang)}
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {fileTarget && (
            <button
              type="button"
              onClick={() => downloadBookFile(book)}
              className="p-1.5 text-xs bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded transition-colors flex items-center justify-center cursor-pointer"
              title={t('reader.downloadTitle', lang)}
            >
              <Download className="w-3.5 h-3.5 text-[var(--gold)]" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Top Header (>=768px) */}
      <div className="hidden md:flex bg-[var(--bg-main)] border-b border-[var(--border-main)] px-4 py-3 items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleBack}
            className="p-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--gold)] border border-[var(--border-main)] rounded transition-colors shrink-0 flex items-center gap-1 font-bold text-xs cursor-pointer"
            title={t('reader.returnDetailsTitle', lang)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('book.back', lang)}</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
                {typeLabelText(typeLabel)}
              </span>
              <h1 className="font-serif font-bold text-sm sm:text-base text-[var(--text-main)] truncate">
                {book.title}
              </h1>
            </div>
            {book.author && (
              <p className="text-[10px] text-[var(--text-muted)] truncate">
                {tf('reader.authorLine', lang, { author: book.author.toUpperCase() })}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <button
            type="button"
            onClick={() => appState.toggleFavorite(book.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded transition-colors cursor-pointer font-sans font-medium ${
              isFav
                ? 'bg-amber-400/15 border-amber-400/50 text-amber-400 hover:bg-amber-400/25'
                : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-main)]'
            }`}
            title={isFav ? t('book.unfavoriteAria', lang) : t('book.favoriteAria', lang)}
          >
            {isFav ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{t('book.favorited', lang)}</span>
              </>
            ) : (
              <>
                <Star className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>{t('book.favoriteLabel', lang)}</span>
              </>
            )}
          </button>

          {fileTarget && (
            <button
              type="button"
              onClick={() => downloadBookFile(book)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded uppercase transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{t('reader.download', lang)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Reader/Viewer Frame */}
      <div className="flex-1 bg-[#0a0806] relative overflow-hidden flex items-center justify-center">
        {renderViewerContent()}

        {/* Floating Fit to Page & Zoom Overlay for PDF documents (in-app canvas reader only) */}
        {itemType === 'pdf' && fileTarget && !isDriveBook && (
          <PdfZoomOverlay
            zoomLevel={zoomLevel}
            fitMode={fitMode}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitWidth={handleFitWidth}
            onFitPage={handleFitPage}
            onSetZoom={handleSetZoom}
            onResetZoom={handleResetZoom100}
          />
        )}
      </div>

      {/* Bookmarks + jump to a page — works for every book. Local PDFs jump
          in the reader; Drive books open in Drive, so the saved page is
          shown here to jump to by hand in Drive. */}
      {itemType === 'pdf' && (
        <div className="bg-[var(--bg-main)] border-t border-[var(--border-main)] px-3 py-2 flex flex-wrap items-center gap-2 shrink-0 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              appState.toggleBookmark(book.id, currentPage);
              appState.showToast(
                isBookmarked ? tf('reader.bookmarkRemoved', lang, { n: currentPage }) : tf('reader.bookmarkAdded', lang, { n: currentPage }),
                'success'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded transition-colors cursor-pointer font-sans font-medium ${
              isBookmarked
                ? 'bg-[var(--gold)] text-black border-[var(--gold)] font-bold'
                : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border-[var(--border-main)]'
            }`}
            title={isBookmarked ? t('reader.removeBookmark', lang) : t('reader.bookmarkThis', lang)}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-black' : ''}`} />
            <span>{isBookmarked ? tf('reader.bookmarked', lang, { n: currentPage }) : tf('reader.bookmark', lang, { n: currentPage })}</span>
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = Number(jumpInput);
              if (Number.isFinite(n) && n >= 1) jumpToPage(n);
            }}
            className="flex items-center gap-1.5"
          >
            <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold" htmlFor="reader-jump-page">
              {t('reader.goToPage', lang)}
            </label>
            <input
              id="reader-jump-page"
              type="number"
              min={1}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder={String(currentPage)}
              className="w-16 px-2 py-1 bg-[var(--bg-surface)] text-[var(--text-main)] text-xs border border-[var(--border-main)] rounded text-center font-mono focus:outline-none focus:border-[var(--gold)]"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs font-bold cursor-pointer"
            >
              {t('reader.go', lang)}
            </button>
          </form>

          {bookmarks.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">{t('reader.bookmarksLabel', lang)}</span>
              {bookmarks.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => jumpToPage(p)}
                  className="px-2 py-1 bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--gold)]/40 rounded text-xs font-bold cursor-pointer hover:bg-[var(--gold)] hover:text-black transition-colors"
                  title={tf('reader.jumpToPage', lang, { n: p })}
                >
                  p.{p}
                </button>
              ))}
              {isDriveBook && (
                <span className="text-[10px] text-[var(--text-muted)]">
                  {t('reader.driveJumpNote', lang)}
                </span>
              )}
            </div>
          )}
          {bookmarks.length === 0 && isDriveBook && (
            <span className="text-[10px] text-[var(--text-muted)]">
              {t('reader.driveSavedNote', lang)}
            </span>
          )}
        </div>
      )}

      {/* Reader Bottom Toolbar for PDFs */}
      {itemType === 'pdf' && (
        <>
          {/* Mobile Bottom Toolbar (<768px) */}
          <div className="md:hidden bg-[var(--bg-main)] border-t border-[var(--border-main)] px-3 py-2 flex flex-col gap-1.5 shrink-0 font-mono text-xs">
            {/* Row 1: Compact Progress info */}
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                <span className="text-[var(--text-muted)] uppercase font-bold text-[10px]">{t('reader.progress', lang)}</span>
                <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-[var(--gold)]'}`}>
                  {percentage}% {isCompleted ? t('reader.completed', lang) : t('reader.read', lang)}
                </span>
              </div>

              {percentage < 100 && (
                <button
                  type="button"
                  onClick={() => handleUpdateProgress(100)}
                  className="text-[10px] text-[var(--gold)] hover:underline cursor-pointer font-bold"
                >
                  {t('reader.markDone', lang)}
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[var(--bg-surface)] h-1.5 border border-[var(--border-main)] rounded overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-400' : 'bg-[var(--gold)]'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Row 2: Mobile Zoom & Fit Controls (in-app canvas reader only) */}
            {!isDriveBook && (
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-[var(--border-main)]/50">
              <div className="grid grid-cols-5 w-full gap-1 items-center">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="py-1 bg-[var(--bg-surface)] active:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded cursor-pointer font-bold text-xs flex items-center justify-center"
                  title={t('reader.zoomOut', lang)}
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleFitPage}
                  className={`py-1 text-xs font-bold border rounded transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    fitMode === 'page'
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)]'
                  }`}
                  title={t('reader.fitPage', lang)}
                >
                  <Minimize2 className="w-3 h-3" />
                  <span className="text-[10px]">{t('reader.page', lang)}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFitWidth}
                  className={`py-1 text-xs font-bold border rounded transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    fitMode === 'width'
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)]'
                  }`}
                  title={t('reader.fitWidth', lang)}
                >
                  <Maximize2 className="w-3 h-3" />
                  <span className="text-[10px]">{t('reader.width', lang)}</span>
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="py-1 bg-[var(--bg-surface)] active:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded cursor-pointer font-bold text-xs flex items-center justify-center"
                  title={t('reader.zoomIn', lang)}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleResetZoom100}
                  className={`py-1 text-xs font-bold border rounded transition-colors cursor-pointer flex items-center justify-center ${
                    fitMode === 'custom' && zoomLevel === 100
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-main)]'
                  }`}
                  title={t('reader.resetZoom', lang)}
                >
                  {fitMode === 'page' ? t('reader.page', lang) : fitMode === 'width' ? t('reader.width', lang) : `${zoomLevel}%`}
                </button>
              </div>
            </div>
            )}
          </div>

          {/* Desktop Bottom Toolbar (>=768px) */}
          <div className="hidden md:flex bg-[var(--bg-main)] border-t border-[var(--border-main)] px-4 py-2 items-center justify-between gap-3 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] uppercase text-[11px] font-bold">{t('reader.progress', lang)}</span>
              <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-[var(--gold)]'}`}>
                {percentage}% {isCompleted ? t('reader.completed', lang) : t('reader.read', lang)}
              </span>

              <div className="w-32 bg-[var(--bg-surface)] h-2 border border-[var(--border-main)] rounded relative overflow-hidden">
                <div
                  className={`h-full ${isCompleted ? 'bg-emerald-400' : 'bg-[var(--gold)]'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Zoom & Fit Controls (in-app canvas reader only) */}
              {!isDriveBook && (
              <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded border border-[var(--border-main)]">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded cursor-pointer transition-colors"
                  title={t('reader.zoomOut', lang)}
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleFitPage}
                  className={`px-2 py-0.5 text-[10px] font-bold border rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    fitMode === 'page'
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-main)]'
                  }`}
                  title={t('reader.fitWholePage', lang)}
                >
                  <Minimize2 className="w-3 h-3" />
                  <span>{t('reader.fitPage', lang)}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFitWidth}
                  className={`px-2 py-0.5 text-[10px] font-bold border rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    fitMode === 'width'
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-main)]'
                  }`}
                  title={t('reader.fitPageWidth', lang)}
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>{t('reader.fitWidth', lang)}</span>
                </button>

                <span className="text-[10px] font-bold text-[var(--gold)] px-1 font-mono min-w-[38px] text-center">
                  {fitMode === 'page' ? t('reader.page', lang) : fitMode === 'width' ? t('reader.width', lang) : `${zoomLevel}%`}
                </span>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded cursor-pointer transition-colors"
                  title={t('reader.zoomIn', lang)}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleResetZoom100}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded cursor-pointer transition-colors"
                  title={t('reader.resetZoom', lang)}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              )}

              {/* Quick Set Progress Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)] uppercase mr-1">{t('reader.setLabel', lang)}</span>
                {[25, 50, 75, 100].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleUpdateProgress(p)}
                    className={`px-2 py-0.5 text-[10px] font-bold border rounded uppercase transition-colors cursor-pointer ${
                      percentage === p
                        ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-main)]'
                    }`}
                  >
                    {p === 100 ? '100% ✔' : `${p}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
