import React, { useState } from 'react';
import { FolderPlus, X, Folder as FolderIcon } from 'lucide-react';
import { api } from '../../services/api';
import { appState } from '../../state/appState';

interface NewFolderModalProps {
  isOpen: boolean;
  parentFolderName?: string;
  parentId?: string | null;
  onClose: () => void;
  onCreated: () => void;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  parentFolderName,
  parentId,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Folder name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const res = await api.addFolder({
      name: name.trim(),
      description: description.trim() || undefined,
      parentId: parentId || null,
    });

    setIsSubmitting(false);

    if (res.success) {
      appState.showToast('Folder created successfully', 'success');
      await appState.loadCatalog();
      setName('');
      setDescription('');
      onCreated();
      onClose();
    } else {
      setError(res.error || 'Failed to create folder.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg max-w-md w-full p-6 text-[var(--text-main)] shadow-2xl relative space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] shrink-0">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-main)] leading-tight">
                New Folder
              </h3>
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                <span>Location:</span>
                <span className="font-medium text-[var(--gold)] flex items-center gap-1">
                  <FolderIcon className="w-3 h-3 inline" />
                  {parentFolderName || 'Library Root'}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block font-medium text-[var(--text-main)] mb-1">
              Folder Name *
            </label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quran Studies, Hadith, Philosophy..."
              className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] transition-colors text-xs font-sans"
            />
          </div>

          <div>
            <label className="block font-medium text-[var(--text-main)] mb-1">
              Description <span className="text-[var(--text-faint)] font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this collection contains..."
              className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] transition-colors text-xs font-sans resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)] text-xs font-medium">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-50 text-black font-semibold rounded transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
