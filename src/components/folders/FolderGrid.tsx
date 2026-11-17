import React from 'react';
import { Folder } from '../../types';
import { FolderCard } from './FolderCard';

interface FolderGridProps {
  folders: Folder[];
}

export const FolderGrid: React.FC<FolderGridProps> = ({ folders }) => {
  if (folders.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      {folders.map((folder, i) => (
        <FolderCard key={folder.id} folder={folder} index={i} />
      ))}
    </div>
  );
};
