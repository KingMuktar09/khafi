import React, { useState, useEffect } from 'react';
import { Edit3, X } from 'lucide-react';

interface QuickRenameModalProps {
  isOpen: boolean;
  initialName: string;
  itemType: 'folder' | 'book';
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export const QuickRenameModal: React.FC<QuickRenameModalProps> = ({
  isOpen,
  initialName,
  itemType,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
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
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[var(--gold)]" />
            <h3 className="font-semibold text-sm text-[var(--text-main)]">
              Rename {itemType === 'folder' ? 'Folder' : 'Book'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[var(--text-muted)] mb-1 font-medium">
              Name *
            </label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
              placeholder="Enter name..."
            />
            <p className="text-[10px] text-[var(--text-faint)] mt-1">
              Press <kbd className="px-1 py-0.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded">Enter</kbd> to save, <kbd className="px-1 py-0.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded">Esc</kbd> to cancel.
            </p>
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
              disabled={!name.trim() || name === initialName}
              className="px-4 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-50 text-black font-semibold rounded transition-colors"
            >
              Save Name
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
