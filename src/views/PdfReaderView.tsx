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
} from 'lucide-react';
import { appState } from '../state/appState';
import { router } from '../router/router';
import { ReaderAdvisoryModal } from '../components/ui/ReaderAdvisoryModal';
import { getItemType, getTypeLabel, getTypeBadgeColor, getItemUrl, getFileExtension, getDrivePreviewUrl, downloadBookFile } from '../utils/fileUtils';
import { FilePreviewer, FitMode } from '../components/viewers/FilePreviewer';
import { PdfZoomOverlay } from '../components/pdf/PdfZoomOverlay';
import { PaidLockScreen } from '../components/books/PaidLockScreen';

export const PdfReaderView: React.FC = () => {
  const bookId = appState.route.bookId;
  const book = bookId ? appState.getBookById(bookId) : undefined;
  const [showAdvisoryModal, setShowAdvisoryModal] = useState(!appState.hasAcknowledgedAdvisory());
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fitMode, setFitMode] = useState<FitMode>('width');
  const [isFitWidth, setIsFitWidth] = useState(true);
  const [retryNonce, setRetryNonce] = useState(0);

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
          Item Not Found
        </h2>
        <button
          onClick={() => router.navigate('library')}
          className="px-4 py-2 bg-[var(--gold)] text-black font-bold uppercase rounded"
        >
          Return to Library
        </button>
      </div>
    );
  }

  // Paid gate (closes the direct /read/<id> bypass): a paid book never
  // opens its reader, download or Drive link for a normal user. Admins
  // read paid books directly; everyone else gets the locked pay screen.
  const isAdmin = appState.adminAuthenticated;
  if (book.isPaid && !isAdmin) {
    return (
      <div className="animate-fade-in py-2 max-w-2xl mx-auto font-sans">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-5 sm:p-6">
          <PaidLockScreen
            book={book}
            onBack={() => router.navigate('book', { bookId: book.id })}
            backLabel="Back to book details"
          />
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
      pct === 100 ? `Marked "${book.title}" as completed!` : `Progress updated to ${pct}%`,
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
          <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">No File Available</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            There is no direct file attached to this record.
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
        initialPage={currentProgress?.currentPage || 1}
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
        onPageChange={(currentPage, totalPages) => {
          if (totalPages > 0) {
            const calculatedPercentage = Math.min(100, Math.round((currentPage / totalPages) * 100));
            appState.setReadingProgress(book.id, calculatedPercentage, currentPage, totalPages);
          }
        }}
        onRetry={() => setRetryNonce((n) => n + 1)}
      />
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] md:h-[calc(100vh-8rem)] min-h-[480px] bg-[var(--bg-surface)] border border-[var(--border-main)] rounded overflow-hidden animate-fade-in my-1 sm:my-2">
      
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
            title="Return to Details"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px]">Back</span>
          </button>

          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase shrink-0 ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
            {typeLabel}
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
            title={isFav ? 'Unfavorite item' : 'Favorite item'}
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {fileTarget && (
            <button
              type="button"
              onClick={() => downloadBookFile(book)}
              className="p-1.5 text-xs bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded transition-colors flex items-center justify-center cursor-pointer"
              title="Download File"
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
            title="Return to Details"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
                {typeLabel}
              </span>
              <h1 className="font-serif font-bold text-sm sm:text-base text-[var(--text-main)] truncate">
                {book.title}
              </h1>
            </div>
            {book.author && (
              <p className="text-[10px] text-[var(--text-muted)] truncate">
                AUTHOR / CREATOR // {book.author.toUpperCase()}
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
            title={isFav ? 'Unfavorite item' : 'Favorite item'}
          >
            {isFav ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Favorited</span>
              </>
            ) : (
              <>
                <Star className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Favorite</span>
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
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Reader/Viewer Frame */}
      <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
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

      {/* Reader Bottom Toolbar for PDFs */}
      {itemType === 'pdf' && (
        <>
          {/* Mobile Bottom Toolbar (<768px) */}
          <div className="md:hidden bg-[var(--bg-main)] border-t border-[var(--border-main)] px-3 py-2 flex flex-col gap-1.5 shrink-0 font-mono text-xs">
            {/* Row 1: Compact Progress info */}
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                <span className="text-[var(--text-muted)] uppercase font-bold text-[10px]">Progress:</span>
                <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-[var(--gold)]'}`}>
                  {percentage}% {isCompleted ? 'Completed' : 'Read'}
                </span>
              </div>

              {percentage < 100 && (
                <button
                  type="button"
                  onClick={() => handleUpdateProgress(100)}
                  className="text-[10px] text-[var(--gold)] hover:underline cursor-pointer font-bold"
                >
                  Mark Done ✔
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
                  title="Zoom Out"
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
                  title="Fit to Page"
                >
                  <Minimize2 className="w-3 h-3" />
                  <span className="text-[10px]">Page</span>
                </button>

                <button
                  type="button"
                  onClick={handleFitWidth}
                  className={`py-1 text-xs font-bold border rounded transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    fitMode === 'width'
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)]'
                  }`}
                  title="Fit to Width"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span className="text-[10px]">Width</span>
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="py-1 bg-[var(--bg-surface)] active:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded cursor-pointer font-bold text-xs flex items-center justify-center"
                  title="Zoom In"
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
                  title="Toggle 100% Zoom"
                >
                  {fitMode === 'page' ? 'Page' : fitMode === 'width' ? 'Width' : `${zoomLevel}%`}
                </button>
              </div>
            </div>
            )}
          </div>

          {/* Desktop Bottom Toolbar (>=768px) */}
          <div className="hidden md:flex bg-[var(--bg-main)] border-t border-[var(--border-main)] px-4 py-2 items-center justify-between gap-3 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] uppercase text-[11px] font-bold">Progress:</span>
              <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-[var(--gold)]'}`}>
                {percentage}% {isCompleted ? 'Completed' : 'Read'}
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
                  title="Zoom Out"
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
                  title="Fit Whole Page"
                >
                  <Minimize2 className="w-3 h-3" />
                  <span>Fit Page</span>
                </button>

                <button
                  type="button"
                  onClick={handleFitWidth}
                  className={`px-2 py-0.5 text-[10px] font-bold border rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    fitMode === 'width'
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-main)]'
                  }`}
                  title="Fit Page Width"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Fit Width</span>
                </button>

                <span className="text-[10px] font-bold text-[var(--gold)] px-1 font-mono min-w-[38px] text-center">
                  {fitMode === 'page' ? 'Page' : fitMode === 'width' ? 'Width' : `${zoomLevel}%`}
                </span>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded cursor-pointer transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleResetZoom100}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded cursor-pointer transition-colors"
                  title="Reset Zoom (100%)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              )}

              {/* Quick Set Progress Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)] uppercase mr-1">Set:</span>
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
