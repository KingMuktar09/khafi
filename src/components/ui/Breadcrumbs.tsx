import React from 'react';
import { ChevronRight, Home, Folder as FolderIcon, FileText } from 'lucide-react';
import { router } from '../../router/router';
import { appState } from '../../state/appState';

interface BreadcrumbsProps {
  folderId?: string | null;
  subfolderId?: string | null;
  bookTitle?: string | null;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ folderId, subfolderId, bookTitle }) => {
  const folder = folderId ? appState.getFolderById(folderId) : null;
  const subfolder = subfolderId ? appState.getFolderById(subfolderId) : null;

  const isAtRoot = !folder && !subfolder && !bookTitle;

  return (
    <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-sans text-[var(--text-muted)] py-1" aria-label="Breadcrumb">
      {/* Root Library Link */}
      {isAtRoot ? (
        <span className="font-semibold text-[var(--gold)] flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
          <span>Library</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => router.navigate('library')}
          className="hover:text-[var(--gold)] text-[var(--text-muted)] transition-colors focus:outline-none cursor-pointer font-medium flex items-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5 text-[var(--text-faint)] hover:text-[var(--gold)] shrink-0" />
          <span>Library</span>
        </button>
      )}

      {/* Main Folder Link */}
      {folder && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
          {subfolder || bookTitle ? (
            <button
              type="button"
              onClick={() => router.navigate('library', { folderId: folder.id })}
              className="hover:text-[var(--gold)] text-[var(--text-muted)] transition-colors focus:outline-none cursor-pointer font-medium flex items-center gap-1"
            >
              <FolderIcon className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
              <span>{folder.name}</span>
            </button>
          ) : (
            <span className="font-semibold text-[var(--gold)] flex items-center gap-1">
              <FolderIcon className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]/20 shrink-0" />
              <span>{folder.name}</span>
            </span>
          )}
        </>
      )}

      {/* Subfolder Link */}
      {subfolder && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
          {bookTitle ? (
            <button
              type="button"
              onClick={() => router.navigate('library', { folderId: folder?.id || folderId, subfolderId: subfolder.id })}
              className="hover:text-[var(--gold)] text-[var(--text-muted)] transition-colors focus:outline-none cursor-pointer font-medium flex items-center gap-1"
            >
              <FolderIcon className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
              <span>{subfolder.name}</span>
            </button>
          ) : (
            <span className="font-semibold text-[var(--gold)] flex items-center gap-1">
              <FolderIcon className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]/20 shrink-0" />
              <span>{subfolder.name}</span>
            </span>
          )}
        </>
      )}

      {/* Book Title */}
      {bookTitle && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
          <span className="font-semibold text-[var(--gold)] truncate max-w-[180px] sm:max-w-xs flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
            <span className="truncate">{bookTitle}</span>
          </span>
        </>
      )}
    </nav>
  );
};
