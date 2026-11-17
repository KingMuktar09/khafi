import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Check, Copy, Download, ExternalLink, IndianRupee, Instagram, QrCode, Star, Tag, Play, Image as ImageIcon, Music as AudioIcon, FileText, HardDrive, Folder as FolderIcon, Calendar, FileType, Hash } from 'lucide-react';
import { appState } from '../state/appState';
import { router } from '../router/router';
import { api } from '../services/api';
import { EMPTY_PAYMENT_SETTINGS, PaymentSettings } from '../types';
import { CoverImage } from '../components/books/CoverImage';
import { ReadingProgressTracker } from '../components/books/ReadingProgressTracker';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ReaderAdvisoryModal } from '../components/ui/ReaderAdvisoryModal';
import { getItemType, getTypeLabel, getTypeBadgeColor, getItemUrl, getFileExtension, downloadBookFile } from '../utils/fileUtils';

export const BookDetailsView: React.FC = () => {
  const bookId = appState.route.bookId;
  const book = bookId ? appState.getBookById(bookId) : undefined;
  const [showAdvisoryModal, setShowAdvisoryModal] = useState(false);
  const [paySettings, setPaySettings] = useState<PaymentSettings>(EMPTY_PAYMENT_SETTINGS);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (bookId) {
      appState.recordViewedBook(bookId);
    }
  }, [bookId]);

  useEffect(() => {
    if (book?.isPaid) {
      api.getPaymentSettings().then(setPaySettings).catch(() => {});
    }
  }, [book?.isPaid]);

  const copyUpiId = async () => {
    if (!paySettings.upiId) return;
    try {
      await navigator.clipboard.writeText(paySettings.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // clipboard unavailable; the ID is shown in full for manual copying
    }
  };

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
  const isPaidForVisitor = Boolean(book.isPaid) && !isAdmin;
  const itemType = getItemType(book);
  const typeLabel = getTypeLabel(book);
  const badgeColor = getTypeBadgeColor(itemType);
  const fileUrl = getItemUrl(book);
  const ext = getFileExtension(fileUrl || book.title).toUpperCase();
  const folder = book.folderId ? appState.getFolderById(book.folderId) : undefined;

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
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
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
        </div>

        {/* Information & Actions */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
                {typeLabel}
              </span>
              <span className="text-xs text-[var(--gold)] font-medium">
                {book.category}
              </span>
            </div>

            <h1 className="font-display font-semibold text-3xl text-[var(--text-main)] leading-tight">
              {book.title}
            </h1>

            {book.isPaid && (
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-full px-3 py-1 w-fit">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>
                  Paid book{typeof book.price === 'number' ? ` — ₹${book.price.toLocaleString('en-IN')}` : ''}
                </span>
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
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl space-y-3 text-sm">
            {isPaidForVisitor ? (
              <>
                {/* Paid checkout (visitor): no direct read, UPI pay + manual unlock */}
                <div className="space-y-2">
                  <p className="font-display font-semibold text-lg text-[var(--text-main)]">
                    This book is paid — {typeof book.price === 'number' ? `₹${book.price.toLocaleString('en-IN')}` : 'price set by the library'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Pay by UPI below. After payment, message{' '}
                    <a href="https://instagram.com/ghayb.chronicles" target="_blank" rel="noreferrer" className="text-[var(--gold)] font-semibold underline underline-offset-2">
                      @ghayb.chronicles on Instagram
                    </a>{' '}
                    with your payment proof — access is unlocked manually. There is no automatic payment check on this free site.
                  </p>
                </div>

                {book.paymentLink ? (
                  <a
                    href={book.paymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="tap-target w-full py-3 px-4 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>Pay {typeof book.price === 'number' ? `₹${book.price.toLocaleString('en-IN')}` : ''} now</span>
                  </a>
                ) : null}

                {/* UPI checkout */}
                <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl space-y-3">
                  <p className="font-semibold text-sm flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[var(--gold)]" />
                    <span>Pay by UPI</span>
                  </p>
                  {paySettings.upiId ? (
                    <>
                      {paySettings.displayName && (
                        <p className="text-xs text-[var(--text-muted)]">
                          Pay to: <span className="font-semibold text-[var(--text-main)]">{paySettings.displayName}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <code className="flex-1 min-w-0 break-all text-sm font-semibold bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg px-3 py-2.5">
                          {paySettings.upiId}
                        </code>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="tap-target shrink-0 px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/60 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[var(--gold)]" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy UPI ID'}</span>
                        </button>
                      </div>
                      {paySettings.upiQrUrl && (
                        <div className="flex flex-col items-center gap-2 pt-1">
                          <img
                            src={paySettings.upiQrUrl}
                            alt="UPI QR code for payment"
                            className="w-52 h-52 max-w-full object-contain rounded-xl border border-[var(--border-main)] bg-white p-2"
                          />
                          <p className="text-[11px] text-[var(--text-muted)]">Scan with any UPI app to pay</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      UPI payment details are not set yet. Please message{' '}
                      <a href="https://instagram.com/ghayb.chronicles" target="_blank" rel="noreferrer" className="text-[var(--gold)] font-semibold underline underline-offset-2">
                        @ghayb.chronicles
                      </a>{' '}
                      on Instagram to pay for this book.
                    </p>
                  )}
                  {book.paymentNote && (
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] pt-2">
                      {book.paymentNote}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {isAdmin && book.isPaid && (
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--gold-faint)] border border-[var(--gold)]/30 rounded-lg px-3 py-2">
                    Admin view: this book is marked Paid
                    {typeof book.price === 'number' ? ` (₹${book.price.toLocaleString('en-IN')})` : ''}. Visitors see the UPI checkout instead of the reader.
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
                  Books open in Google Drive. In-app reading works once the library's Drive connection is set up by the admin.
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
