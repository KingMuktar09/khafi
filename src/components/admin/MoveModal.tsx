import React, { useState } from 'react';
import { Folder as FolderIcon, ChevronRight, X, ArrowRight } from 'lucide-react';
import { Folder } from '../../types';

interface MoveModalProps {
  isOpen: boolean;
  itemTitle: string;
  itemType: 'folder' | 'book';
  currentParentId: string | null;
  itemId?: string; // provided if item is a folder to prevent circular move
  allFolders: Folder[];
  onConfirm: (targetFolderId: string | null) => void;
  onCancel: () => void;
}

export function isDescendantFolder(
  folders: Folder[],
  parentFolderId: string,
  childFolderId: string | null
): boolean {
  if (!childFolderId) return false;
  let currId: string | null = childFolderId;
  while (currId) {
    if (currId === parentFolderId) return true;
    const currFolder = folders.find((f) => f.id === currId);
    currId = currFolder?.parentId || null;
  }
  return false;
}

export const MoveModal: React.FC<MoveModalProps> = ({
  isOpen,
  itemTitle,
  itemType,
  currentParentId,
  itemId,
  allFolders,
  onConfirm,
  onCancel,
}) => {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(
    currentParentId
  );

  if (!isOpen) return null;

  // Filter out invalid destinations if item is a folder
  const isValidDestination = (folderId: string | null): boolean => {
    if (itemType === 'folder' && itemId) {
      if (folderId === itemId) return false; // cannot move folder into itself
      if (isDescendantFolder(allFolders, itemId, folderId)) return false; // cannot move into descendant
    }
    return true;
  };

  const currentParentFolder = allFolders.find((f) => f.id === currentParentId);
  const selectedDestFolder = allFolders.find((f) => f.id === selectedDestinationId);

  // Helper to get folder breadcrumb path text
  const getFolderPathText = (folderId: string | null): string => {
    if (!folderId) return 'Root Library';
    const path: string[] = [];
    let curr: Folder | undefined = allFolders.find((f) => f.id === folderId);
    while (curr) {
      path.unshift(curr.name);
      curr = allFolders.find((f) => f.id === curr?.parentId);
    }
    return path.join(' / ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg max-w-md w-full p-5 text-[var(--text-main)] space-y-4 text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
          <div className="min-w-0 pr-2">
            <h3 className="font-semibold text-sm sm:text-base text-[var(--text-main)] truncate">
              Move "{itemTitle}"
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] truncate">
              Current Location: <strong className="text-[var(--text-main)]">{getFolderPathText(currentParentId)}</strong>
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected destination indicator */}
        <div className="bg-[var(--bg-main)] p-2.5 rounded border border-[var(--border-main)] flex items-center gap-2 text-xs">
          <ArrowRight className="w-4 h-4 text-[var(--gold)] shrink-0" />
          <div className="truncate">
            <span className="text-[var(--text-muted)] block text-[10px]">Destination:</span>
            <span className="font-semibold text-[var(--text-main)] truncate block">
              {getFolderPathText(selectedDestinationId)}
            </span>
          </div>
        </div>

        {/* Destination Folder Selector */}
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 border border-[var(--border-subtle)] rounded p-2 bg-[var(--bg-main)]">
          {/* Root Choice */}
          <div
            onClick={() => setSelectedDestinationId(null)}
            className={`p-2 rounded cursor-pointer flex items-center justify-between transition-colors ${
              selectedDestinationId === null
                ? 'bg-[var(--gold-faint)] border border-[var(--gold)] text-[var(--gold)] font-semibold'
                : 'hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderIcon className="w-4 h-4 shrink-0 text-[var(--gold)]" />
              <span>Root Library (Top Level)</span>
            </div>
            {selectedDestinationId === null && <span className="text-[10px] font-bold">Selected</span>}
          </div>

          {/* Folder Hierarchy List */}
          {allFolders.map((folder) => {
            const valid = isValidDestination(folder.id);
            const isSelected = selectedDestinationId === folder.id;

            return (
              <div
                key={folder.id}
                onClick={() => {
                  if (valid) setSelectedDestinationId(folder.id);
                }}
                className={`p-2 rounded flex items-center justify-between transition-colors ${
                  !valid
                    ? 'opacity-40 cursor-not-allowed text-[var(--text-faint)]'
                    : isSelected
                    ? 'bg-[var(--gold-faint)] border border-[var(--gold)] text-[var(--gold)] font-semibold cursor-pointer'
                    : 'hover:bg-[var(--bg-hover)] text-[var(--text-main)] cursor-pointer border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <FolderIcon className="w-4 h-4 shrink-0 text-[var(--gold)]" />
                  <span className="truncate">{getFolderPathText(folder.id)}</span>
                </div>
                {isSelected ? (
                  <span className="text-[10px] font-bold shrink-0">Selected</span>
                ) : !valid ? (
                  <span className="text-[10px] italic text-[var(--text-faint)] shrink-0">Invalid</span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selectedDestinationId === currentParentId}
            onClick={() => onConfirm(selectedDestinationId)}
            className="px-4 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-50 text-black font-semibold rounded transition-colors"
          >
            Move Here
          </button>
        </div>

      </div>
    </div>
  );
};
