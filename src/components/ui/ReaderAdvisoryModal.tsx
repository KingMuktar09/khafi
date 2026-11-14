import React, { useEffect } from 'react';
import { ShieldAlert, X, BookOpen, AlertTriangle } from 'lucide-react';

interface ReaderAdvisoryModalProps {
  isOpen: boolean;
  bookTitle?: string;
  isInformationalOnly?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ReaderAdvisoryModal: React.FC<ReaderAdvisoryModalProps> = ({
  isOpen,
  bookTitle,
  isInformationalOnly = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg max-w-lg w-full p-5 sm:p-6 text-[var(--text-main)] space-y-4 text-xs sm:text-sm shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border-main)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--border-main)] rounded-md shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-[var(--text-main)] leading-tight">
                Reader Advisory
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">
                Important Library Guidance & Notice
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Optional Book Title Context Bar */}
        {bookTitle && (
          <div className="bg-[var(--bg-main)] p-2.5 rounded border border-[var(--border-main)] flex items-center gap-2 text-xs">
            <BookOpen className="w-4 h-4 text-[var(--gold)] shrink-0" />
            <span className="text-[var(--text-muted)] truncate">
              Opening: <strong className="text-[var(--text-main)] font-semibold">{bookTitle}</strong>
            </span>
          </div>
        )}

        {/* Exact Required Advisory Text */}
        <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-[var(--text-main)]">
          <p>
            Some materials in KHAFI LIBRARY may contain descriptions of occult or magical practices, superstition, adult/erotic themes, violence, or other sensitive historical and literary material.
          </p>

          <p className="text-[var(--text-muted)] font-medium">
            These materials are provided for reading, study, research, and historical understanding only.
          </p>

          <div className="p-3 bg-[var(--gold-faint)] border border-[var(--border-main)] rounded-md text-[var(--text-main)] font-medium text-xs leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
            <span>
              Please do not practice, perform, imitate, or reproduce any harmful, occult, magical, erotic, or otherwise dangerous practices described in a text.
            </span>
          </div>

          <p className="text-[var(--text-muted)] italic">
            Read responsibly, use your judgment, and leave the material if it makes you uncomfortable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)] font-medium rounded transition-colors text-xs text-center cursor-pointer"
          >
            {isInformationalOnly ? 'Close' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold rounded transition-colors text-xs text-center cursor-pointer shadow-xs"
          >
            {isInformationalOnly ? 'I Understand' : 'I Understand, Open File'}
          </button>
        </div>

      </div>
    </div>
  );
};
