import React from 'react';
import { X, Star, Download, FileText } from 'lucide-react';
import { Book } from '../../types';
import { appState } from '../../state/appState';
import { downloadBookFile, getTypeBadgeColor, getTypeLabel, getItemType } from '../../utils/fileUtils';
import { FilePreviewer } from './FilePreviewer';

interface FilePreviewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !book) return null;

  const isFav = appState.isFavorite(book.id);
  const itemType = getItemType(book);
  const typeLabel = getTypeLabel(book);
  const badgeColor = getTypeBadgeColor(itemType);

  const handleToggleFavorite = () => {
    appState.toggleFavorite(book.id);
  };

  const handleDownload = () => {
    downloadBookFile(book);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl w-full max-w-6xl h-[92vh] max-h-[900px] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="bg-[var(--bg-surface)] border-b border-[var(--border-main)] px-4 py-3 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border rounded shrink-0 ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
              {typeLabel}
            </span>

            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-main)] truncate leading-tight">
                {book.title}
              </h3>
              {book.author && (
                <p className="text-xs text-[var(--text-muted)] truncate">
                  Author: {book.author}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Favorite Button */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isFav
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-400'
                  : 'bg-[var(--bg-main)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-amber-400'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / FilePreviewer */}
        <div className="flex-1 overflow-hidden bg-[var(--bg-main)]">
          <FilePreviewer book={book} onDownload={handleDownload} />
        </div>

      </div>
    </div>
  );
};
