import React, { useEffect, useState } from 'react';
import { AlertCircle, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { Book } from '../../types';
import {
  getDrivePreviewUrl,
  getDriveViewUrl,
  downloadBookFile,
} from '../../utils/fileUtils';

interface DrivePdfViewerProps {
  book: Book;
}

/**
 * In-app PDF reader for Google Drive books.
 *
 * The old reader fed pdf.js the app's own /api/files/<id>/preview stream,
 * which answers 503 "Google Drive is not configured on this server" on
 * this free deployment (no Drive service account), so every book showed
 * "Unable to open this PDF." This viewer instead embeds Google Drive's own
 * PDF viewer (drive.google.com/file/d/<id>/preview), derived from the
 * book's driveFileId — the app never fetches the file bytes itself.
 *
 * Google's viewer runs in a cross-origin iframe, so a failed load cannot
 * be detected reliably. The Download / Open in Drive actions are therefore
 * always visible, plus a "Preview not loading?" fallback panel the reader
 * can open by hand (for example when Drive shows a sign-in page).
 */
export const DrivePdfViewer: React.FC<DrivePdfViewerProps> = ({ book }) => {
  const previewUrl = getDrivePreviewUrl(book);
  const viewUrl = getDriveViewUrl(book);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrouble, setShowTrouble] = useState(false);
  // Preview fix: Drive's viewer runs in a cross-origin iframe, so the app
  // cannot tell a blank / sign-in page from a slow load, and the spinner
  // used to spin forever when Drive hung. If the iframe has not reported
  // loaded after 15 seconds, stop waiting and open the trouble panel by
  // itself, so the reader always has Open in Drive / Download in front
  // of them instead of a frozen spinner. Paid books never reach this
  // viewer without a key or admin (the lock screen comes first).
  useEffect(() => {
    if (!isLoading) return;
    const t = window.setTimeout(() => {
      setIsLoading(false);
      setShowTrouble(true);
    }, 15000);
    return () => window.clearTimeout(t);
  }, [isLoading]);

  if (!previewUrl) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center p-6 bg-[var(--bg-main)]">
        <div className="p-8 text-center max-w-md space-y-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl font-sans">
          <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded inline-block">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
            Unable to open this PDF.
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            This book has no Google Drive link attached. Please ask the library admin to check the book entry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[480px] flex flex-col bg-[#0a0806]">
      {/* Action bar: always visible, so the reader is never stuck */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2 bg-[var(--bg-main)] border-b border-[var(--border-main)]">
        <p className="text-[11px] text-[var(--text-muted)] leading-tight min-w-0 truncate">
          Reading in Google Drive viewer
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowTrouble((v) => !v)}
            className="px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)] rounded-lg cursor-pointer"
          >
            Preview not loading?
          </button>
          {viewUrl && (
            <a
              href={viewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Open in Drive</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => downloadBookFile(book)}
            className="px-2.5 py-1.5 text-[11px] font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Always-visible hint: Google Drive's viewer runs in a cross-origin
          iframe, so the app cannot detect when Drive refuses the preview
          (the file is not shared "Anyone with the link" and Drive answers
          401 / asks to sign in — the spinner still hides, because the
          iframe itself loaded). Keep the way out in plain sight instead
          of hiding it behind the toggle below. */}
      <p className="shrink-0 px-3 py-1.5 text-[11px] leading-snug text-[var(--text-muted)] bg-[var(--bg-main)] border-b border-[var(--border-main)]">
        If the preview stays blank or asks you to sign in, the file is not shared publicly in Drive yet — use{' '}
        <button
          type="button"
          onClick={() => setShowTrouble(true)}
          className="text-[var(--gold)] font-semibold underline underline-offset-2 cursor-pointer"
        >
          Preview not loading?
        </button>{' '}
        for the Drive and download options.
      </p>

      {/* Fallback panel: shown by hand when the preview stays blank or asks for sign-in */}
      {showTrouble && (
        <div className="shrink-0 mx-3 mt-3 p-4 text-center space-y-3 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl font-sans">
          <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
            The preview could not load here.
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Google Drive sometimes asks you to sign in before showing a book. You can still read it in Drive or download it to view on your device.
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {viewUrl && (
              <a
                href={viewUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-[var(--gold)]" />
                <span>Open in Drive</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => downloadBookFile(book)}
              className="px-4 py-2 bg-[var(--gold)] text-black font-bold text-xs uppercase rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTrouble(false)}
              className="px-4 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[var(--gold)]" />
              <span>Back to preview</span>
            </button>
          </div>
        </div>
      )}

      {/* Drive preview iframe */}
      <div className="relative flex-1 min-h-0">
        {isLoading && !showTrouble && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0806] font-mono text-xs text-[var(--text-muted)] z-10">
            <RefreshCw className="w-8 h-8 text-[var(--gold)] animate-spin" />
            <p className="text-[var(--gold)] font-semibold tracking-wider uppercase text-sm">
              Loading preview...
            </p>
          </div>
        )}
        <iframe
          key={previewUrl}
          src={previewUrl}
          title={`Preview of ${book.title}`}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};
