import React from 'react';
import { appState } from '../state/appState';
import { FolderExplorer } from '../components/folders/FolderExplorer';
import { CompactAdvisoryBanner } from '../components/ui/CompactAdvisoryBanner';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Book } from '../types';

export const LibraryView: React.FC = () => {
  const { folderId, subfolderId, searchQuery } = appState.route;

  if (appState.loading) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-8 text-center space-y-3 font-sans max-w-md mx-auto my-12 shadow-2xs animate-fade-in">
        <div className="w-10 h-10 border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--gold)] flex items-center justify-center rounded-lg mx-auto animate-spin">
          <RefreshCw className="w-5 h-5 text-[var(--gold)]" />
        </div>
        <p className="text-sm font-semibold text-[var(--text-main)]">Loading folder contents...</p>
      </div>
    );
  }

  if (appState.loadError) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-8 text-center space-y-4 font-sans max-w-md mx-auto my-12 shadow-2xs animate-fade-in">
        <div className="w-10 h-10 border border-amber-500/30 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-lg mx-auto">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-[var(--text-main)]">Unable to load folder contents.</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            A network error occurred while retrieving catalog items.
          </p>
        </div>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => appState.retryLoad()}
            className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const currentFolder = folderId ? appState.getFolderById(folderId) : null;
  const currentSubfolder = subfolderId ? appState.getFolderById(subfolderId) : null;

  // Top level: if the catalog has a single root collection (Islamic Library),
  // show its categories directly instead of one lone root folder.
  const roots = appState.getChildFolders(null);
  const topFolderId = !folderId && !subfolderId && roots.length === 1 ? roots[0].id : null;

  // Active subfolders in current view
  const childFolders = appState.getChildFolders(subfolderId || folderId || topFolderId || null);

  // Active books in current view
  let displayedBooks: Book[] = [];

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    displayedBooks = appState.getVisibleBooks().filter(
      (b) =>
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.description || '').toLowerCase().includes(q) ||
        (Array.isArray(b.tags) && b.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q)))
    );
  } else if (subfolderId) {
    displayedBooks = appState.getBooksForFolder(folderId!, subfolderId);
  } else if (folderId) {
    displayedBooks = appState.getBooksForFolder(folderId);
  } else if (topFolderId) {
    displayedBooks = appState.getBooksForFolder(topFolderId);
  } else {
    // Top-level books with no folderId or subfolderId
    displayedBooks = appState.getVisibleBooks().filter((b) => !b.folderId && !b.subfolderId);
  }

  const currentTitle = searchQuery
    ? `Search Results: "${searchQuery}"`
    : currentSubfolder
    ? currentSubfolder.name
    : currentFolder
    ? currentFolder.name
    : topFolderId
    ? 'Islamic Library'
    : 'Library';

  return (
    <div className="space-y-4 animate-fade-in py-2 font-sans">
      
      {/* Folder Explorer */}
      <FolderExplorer
        folders={searchQuery ? [] : childFolders}
        books={displayedBooks}
        title={currentTitle}
        folderId={folderId}
        subfolderId={subfolderId}
        showBack={true}
        isSpecialCollection={!!searchQuery}
        emptyMessage={
          searchQuery
            ? `No matching items found for "${searchQuery}".`
            : 'Empty folder'
        }
      />

      {/* Reader Advisory Banner */}
      <CompactAdvisoryBanner />

    </div>
  );
};
