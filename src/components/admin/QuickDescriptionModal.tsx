import React, { useState, useEffect } from 'react';
import { AlignLeft, X } from 'lucide-react';

interface QuickDescriptionModalProps {
  isOpen: boolean;
  itemTitle: string;
  initialDescription: string;
  onSave: (newDesc: string) => void;
  onCancel: () => void;
}

export const QuickDescriptionModal: React.FC<QuickDescriptionModalProps> = ({
  isOpen,
  itemTitle,
  initialDescription,
  onSave,
  onCancel,
}) => {
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription || '');
  }, [initialDescription, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(description.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-sans"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg max-w-sm w-full p-5 text-[var(--text-main)] space-y-4 text-xs">
        
        <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2.5">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <AlignLeft className="w-4 h-4 text-[var(--gold)] shrink-0" />
            <h3 className="font-semibold text-sm text-[var(--text-main)] truncate">
              Edit Description
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[var(--text-muted)] mb-1 font-medium truncate">
              For: <span className="text-[var(--text-main)]">{itemTitle}</span>
            </label>
            <textarea
              rows={4}
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs resize-none"
              placeholder="Enter item description..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-1.5 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold rounded transition-colors"
            >
              Save Description
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
