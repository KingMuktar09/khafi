import React, { useState, lazy, Suspense } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  Archive as ArchiveIcon,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
} from 'lucide-react';
import { Book } from '../../types';
import {
  getItemType,
  getTypeLabel,
  getItemUrl,
  getFileExtension,
  getDrivePreviewUrl,
  getDriveDownloadUrl,
  downloadBookFile,
} from '../../utils/fileUtils';
import type { FitMode } from '../pdf/PdfCanvasViewer';
// The two heavy viewers are lazy: PdfCanvasViewer drags in pdf.js
// and DocxViewer drags in mammoth — neither belongs in the first-load
// bundle, and a preview only ever shows one of them at a time.
const PdfCanvasViewer = lazy(() => import('../pdf/PdfCanvasViewer').then((m) => ({ default: m.PdfCanvasViewer })));
const DocxViewer = lazy(() => import('./DocxViewer').then((m) => ({ default: m.DocxViewer })));
import { DrivePdfViewer } from '../pdf/DrivePdfViewer';
import { TextViewer } from './TextViewer';
import { OfficeEmbedViewer } from './OfficeEmbedViewer';

export type { FitMode };

/** Placeholder while a heavy viewer chunk loads: same height as the
 *  viewer area, so the modal does not jump. */
const ViewerLoading: React.FC = () => (
  <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-[var(--bg-main)]">
    <p className="text-sm font-semibold text-[var(--text-muted)]">Loading…</p>
  </div>
);

interface FilePreviewerProps {
  book: Book;
  fileUrl?: string;
  onDownload?: () => void;
  className?: string;
  zoomLevel?: number;
  isFitWidth?: boolean;
  fitMode?: FitMode;
  initialPage?: number;
  onZoomChange?: (zoomLevel: number, isFitWidth: boolean, fitMode?: FitMode) => void;
  onPageChange?: (currentPage: number, totalPages: number) => void;
  onRetry?: () => void;
}

export const FilePreviewer: React.FC<FilePreviewerProps> = ({
  book,
  fileUrl,
  onDownload,
  className = '',
  zoomLevel: propZoomLevel,
  isFitWidth: propIsFitWidth = true,
  fitMode: propFitMode,
  initialPage = 1,
  onZoomChange,
  onPageChange,
  onRetry,
}) => {
  const fileTarget = fileUrl || getItemUrl(book);
  const itemType = getItemType(book);
  const typeLabel = getTypeLabel(book);
  const ext = getFileExtension(book.originalFilename || book.fileUrl || book.pdfUrl || fileTarget);

  const [internalZoomLevel, setInternalZoomLevel] = useState<number>(100);
  const [internalIsFitWidth, setInternalIsFitWidth] = useState<boolean>(true);
  const [internalFitMode, setInternalFitMode] = useState<FitMode>('width');
  const [rotation, setRotation] = useState<number>(0);

  const activeZoomLevel = propZoomLevel !== undefined ? propZoomLevel : internalZoomLevel;
  const activeIsFitWidth = propIsFitWidth !== undefined ? propIsFitWidth : internalIsFitWidth;
  const activeFitMode = propFitMode !== undefined ? propFitMode : internalFitMode;

  const handleZoomChange = (newZoom: number, newFit: boolean, newMode?: FitMode) => {
    setInternalZoomLevel(newZoom);
    setInternalIsFitWidth(newFit);
    if (newMode) setInternalFitMode(newMode);
    onZoomChange?.(newZoom, newFit, newMode);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      downloadBookFile(book);
    }
  };

  // 1. PDF FILES
  if (itemType === 'pdf') {
    // Drive books read through Google Drive's own viewer. The old path fed
    // pdf.js the app's /api/files stream, which answers 503 when no Drive
    // service account is configured, so every Drive book failed to open.
    // Local / uploaded PDFs still use the in-app canvas reader below.
    if (getDrivePreviewUrl(book)) {
      return (
        <div className={`w-full h-full min-h-[600px] flex flex-col bg-[var(--bg-main)] ${className}`}>
          <DrivePdfViewer book={book} />
        </div>
      );
    }

    return (
      <div className={`w-full h-full min-h-[600px] flex flex-col bg-[var(--bg-main)] ${className}`}>
        <Suspense fallback={<ViewerLoading />}>
          <PdfCanvasViewer
            pdfUrl={fileTarget}
            zoomLevel={activeZoomLevel}
            isFitWidth={activeIsFitWidth}
            fitMode={activeFitMode}
            initialPage={initialPage}
            onZoomChange={handleZoomChange}
            onPageChange={onPageChange}
            onRetry={onRetry}
          />
        </Suspense>
      </div>
    );
  }

  // 2. IMAGE FILES (JPG, PNG, WebP, GIF, SVG)
  if (itemType === 'image') {
    return (
      <div className={`w-full h-full min-h-[500px] flex flex-col bg-black/90 relative ${className}`}>
        {/* Floating Image Control Bar */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-lg border border-white/20 text-white text-xs">
          <button
            type="button"
            onClick={() => handleZoomChange(Math.max(50, activeZoomLevel - 25), false)}
            className="p-1.5 hover:text-[var(--gold)] cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] px-1">{activeZoomLevel}%</span>
          <button
            type="button"
            onClick={() => handleZoomChange(Math.min(300, activeZoomLevel + 25), false)}
            className="p-1.5 hover:text-[var(--gold)] cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1.5 hover:text-[var(--gold)] cursor-pointer transition-colors border-l border-white/20 pl-2"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              handleZoomChange(100, false);
              setRotation(0);
            }}
            className="p-1.5 hover:text-[var(--gold)] cursor-pointer transition-colors"
            title="Reset Zoom & Rotation"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Image Stage */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <img
            src={fileTarget}
            alt={book.title}
            style={{
              transform: `scale(${activeZoomLevel / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-out',
            }}
            className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
          />
        </div>
      </div>
    );
  }

  // 3. VIDEO FILES (MP4, WebM, MOV, MKV, AVI)
  if (itemType === 'video') {
    return (
      <div className={`w-full h-full min-h-[500px] flex items-center justify-center bg-black p-3 ${className}`}>
        <video
          src={fileTarget}
          controls
          controlsList="nodownload"
          className="max-w-full max-h-[80vh] rounded-lg shadow-2xl border border-white/10"
        >
          Your browser does not support standard HTML5 video playback.
        </video>
      </div>
    );
  }

  // 4. AUDIO FILES (MP3, WAV, M4A, OGG)
  if (itemType === 'audio') {
    return (
      <div className={`w-full h-full min-h-[450px] flex flex-col items-center justify-center bg-gradient-to-b from-[#111827] via-[#0b0f19] to-[#030712] p-6 text-center space-y-6 ${className}`}>
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[var(--gold-faint)] border-2 border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] shadow-2xl animate-pulse">
          <AudioIcon className="w-14 h-14 sm:w-16 sm:h-16" />
        </div>

        <div className="space-y-1.5 max-w-lg">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight">
            {book.title}
          </h2>
          {book.author && (
            <p className="text-xs sm:text-sm text-[var(--gold)] font-mono">
              By {book.author}
            </p>
          )}
        </div>

        <div className="w-full max-w-md bg-black/60 p-4 rounded-xl border border-white/10 shadow-xl">
          <audio src={fileTarget} controls className="w-full">
            Your browser does not support standard HTML5 audio playback.
          </audio>
        </div>
      </div>
    );
  }

  // 5. DOCX DOCUMENTS
  // Drive books cannot be fetched from the app's /api/files stream (503
  // without a Drive service account), so pass the direct Drive download
  // link: mammoth's fetch will fail on CORS and DocxViewer falls back to
  // its Google Viewer iframe, which fetches the file server-side.
  if (ext === 'docx') {
    const driveDownloadUrl = getDriveDownloadUrl(book);
    return (
      <Suspense fallback={<ViewerLoading />}>
        <DocxViewer
          fileUrl={driveDownloadUrl || fileTarget}
          title={book.title}
          onDownload={handleDownload}
        />
      </Suspense>
    );
  }

  // 6. PLAIN TEXT / MARKDOWN / CODE FORMATS
  if (['txt', 'text', 'md', 'markdown', 'json', 'csv', 'xml', 'log', 'js', 'ts', 'py', 'html', 'css', 'rtf'].includes(ext)) {
    // Drive notes cannot be fetched from the app's /api/files stream (503
    // without a Drive service account), and Drive's download link blocks
    // cross-origin fetch, so read them in Google Drive's own viewer
    // (drive.google.com/file/d/<id>/preview), same as PDFs. Local /
    // uploaded text files still use the in-app text reader below.
    if (getDrivePreviewUrl(book)) {
      return (
        <div className={`w-full h-full min-h-[600px] flex flex-col bg-[var(--bg-main)] ${className}`}>
          <DrivePdfViewer book={book} />
        </div>
      );
    }
    return (
      <TextViewer
        fileUrl={fileTarget}
        title={book.title}
        ext={ext}
        onDownload={handleDownload}
      />
    );
  }

  // 7. OTHER OFFICE DOCUMENTS (DOC, XLS, XLSX, PPT, PPTX)
  if (['doc', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
    return (
      <OfficeEmbedViewer
        fileUrl={fileTarget}
        title={book.title}
        ext={ext}
        onDownload={handleDownload}
      />
    );
  }

  // 8. ARCHIVE FORMATS & FALLBACK
  return (
    <div className={`w-full h-full min-h-[400px] flex items-center justify-center p-6 bg-[var(--bg-main)] ${className}`}>
      <div className="p-8 text-center max-w-md space-y-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl font-sans shadow-2xl">
        <div className="p-3.5 bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--border-main)] rounded-xl inline-block shadow-2xs">
          {itemType === 'archive' ? <ArchiveIcon className="w-10 h-10" /> : <FileText className="w-10 h-10" />}
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">
            {typeLabel} File Container
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            This file ({ext.toUpperCase()}) can be downloaded directly to open on your device.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="px-5 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs mx-auto transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download {ext.toUpperCase()} ({book.fileSize || 'File'})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
