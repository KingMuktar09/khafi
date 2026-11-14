import React from 'react';
import { ArrowUpRight, Folder as FolderIcon, Layers } from 'lucide-react';
import { Folder } from '../../types';
import { appState } from '../../state/appState';
import { router } from '../../router/router';

interface FolderCardProps {
  folder: Folder;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  const count = appState.getBookCountForFolder(folder.id);

  const handleClick = () => {
    if (folder.parentId) {
      router.navigate('library', { folderId: folder.parentId, subfolderId: folder.id });
    } else {
      router.navigate('library', { folderId: folder.id });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 p-5 rounded-lg transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] group-hover:scale-110 group-hover:border-[var(--gold)] transition-all">
              <FolderIcon className="w-3.5 h-3.5 fill-[var(--gold)]/20" />
            </div>
            <span className="font-mono text-xs text-[var(--gold)] font-bold tracking-wider">
              / {folder.name.toUpperCase()}
            </span>
          </div>
          <span className="font-sans text-[11px] px-2 py-0.5 border border-[var(--border-main)] text-[var(--text-muted)] bg-[var(--bg-main)] rounded-md flex items-center gap-1 font-medium">
            <Layers className="w-3 h-3 text-[var(--gold)]" />
            <span>{count} {count === 1 ? 'ITEM' : 'ITEMS'}</span>
          </span>
        </div>

        <h3 className="font-sans font-bold text-lg sm:text-xl text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors mb-1.5">
          {folder.name}
        </h3>

        {folder.description && (
          <p className="font-sans text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {folder.description}
          </p>
        )}
      </div>

      <div className="pt-3.5 mt-3 border-t border-[var(--border-main)] flex items-center justify-between text-xs font-sans text-[var(--text-muted)]">
        <span className="text-[11px]">Explore Collection</span>
        <ArrowUpRight className="w-4 h-4 text-[var(--gold)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </div>
  );
};
