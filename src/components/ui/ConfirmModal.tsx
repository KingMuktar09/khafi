import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  isBlocked?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = true,
  isLoading = false,
  isBlocked = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-6 text-[var(--text-main)] relative shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1 disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className={`w-5 h-5 ${isDangerous ? 'text-rose-500' : 'text-[var(--gold)]'}`} />
          <h3 id="confirm-modal-title" className="text-base font-bold text-[var(--text-main)]">
            {title}
          </h3>
        </div>

        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6 whitespace-pre-line">
          {message}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)] text-xs">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded transition-colors font-medium disabled:opacity-50 cursor-pointer"
          >
            {isBlocked ? 'Cancel' : cancelLabel}
          </button>
          {!isBlocked && (
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded font-semibold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
                isDangerous
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black'
              }`}
            >
              {isLoading ? 'Deleting...' : confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
