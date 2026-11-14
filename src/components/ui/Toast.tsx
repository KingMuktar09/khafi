import React from 'react';
import { Toast } from '../../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none font-sans">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 border rounded-lg shadow-xl transition-all duration-200 animate-fade-in ${
              isSuccess
                ? 'bg-emerald-950/90 dark:bg-emerald-950 border-emerald-500 text-emerald-100'
                : isError
                ? 'bg-red-950/90 dark:bg-red-950 border-red-500 text-red-100'
                : 'bg-[var(--bg-surface)] border-[var(--border-main)] text-[var(--text-main)]'
            }`}
            role="alert"
          >
            <div className="flex items-center gap-2.5 min-w-0 text-xs sm:text-sm">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-[var(--gold)] shrink-0" />}
              <span className="font-medium leading-snug truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
