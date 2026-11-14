import React, { useState } from 'react';
import {
  BookOpen,
  Folder as FolderIcon,
  FileText,
  Upload,
  Eye,
  EyeOff,
  HardDrive,
  BarChart2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { CatalogData, Book, Folder } from '../../types';
import { formatFileSize, getTypeBadgeColor, getItemType } from '../../utils/fileUtils';

interface LibraryStatsDashboardProps {
  catalog: CatalogData;
  onSelectFolder?: (folderId: string | null) => void;
  onOpenUploadModal?: () => void;
  onOpenAiOrganizer?: () => void;
  aiPendingCount?: number;
}

export const LibraryStatsDashboard: React.FC<LibraryStatsDashboardProps> = ({
  catalog,
  onSelectFolder,
  onOpenUploadModal,
  onOpenAiOrganizer,
  aiPendingCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const books = catalog.books || [];
  const folders = catalog.folders || [];

  // Metrics Calculations
  const totalBooks = books.length;
  const totalFolders = folders.length;

  const rootCategories = folders.filter((f) => !f.parentId);
  const subfolders = folders.filter((f) => Boolean(f.parentId));

  const publicBooks = books.filter((b) => b.visible !== false).length;
  const hiddenBooks = totalBooks - publicBooks;

  const publicFolders = folders.filter((f) => f.visible !== false).length;
  const hiddenFolders = totalFolders - publicFolders;

  // File type distribution
  const fileTypeCounts = books.reduce(
    (acc, b) => {
      const type = b.fileType || getItemType(b);
      if (type === 'pdf') acc.pdf++;
      else if (type === 'document') acc.document++;
      else if (type === 'image') acc.image++;
      else acc.other++;
      return acc;
    },
    { pdf: 0, document: 0, image: 0, other: 0 }
  );

  // Total Storage Size Calculation
  let totalSizeBytes = 0;
  books.forEach((b) => {
    if (b.fileSize) {
      const parsed = parseInt(b.fileSize, 10);
      if (!isNaN(parsed)) {
        totalSizeBytes += parsed;
      }
    }
  });

  // Recent Uploads / Additions (sorted by addedDate / createdAt descending)
  const recentBooks = [...books]
    .sort((a, b) => {
      const dateA = new Date(a.addedDate || a.createdAt || a.updatedAt || 0).getTime();
      const dateB = new Date(b.addedDate || b.createdAt || b.updatedAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  // Category Distribution (Top 5 folders by book count)
  const folderCountsMap = new Map<string, { folder: Folder; count: number }>();
  folders.forEach((f) => {
    folderCountsMap.set(f.id, { folder: f, count: 0 });
  });

  books.forEach((b) => {
    if (b.folderId && folderCountsMap.has(b.folderId)) {
      const entry = folderCountsMap.get(b.folderId)!;
      entry.count++;
    }
  });

  const topFolders = Array.from(folderCountsMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg text-xs font-sans overflow-hidden transition-all duration-200">
      
      {/* Dashboard Section Header */}
      <div className="flex items-center justify-between p-4 bg-[var(--bg-main)]/50 border-b border-[var(--border-main)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 rounded-md">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
              <span>Library Analytics & Overview</span>
              <span className="px-2 py-0.2 text-[10px] bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--gold)]/30 rounded-full font-semibold">
                Live Catalog
              </span>
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              Real-time statistics across total documents, folders, file types, and recent additions.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded border border-[var(--border-main)] transition-colors cursor-pointer flex items-center gap-1"
          title={isExpanded ? 'Collapse Statistics' : 'Expand Statistics'}
        >
          <span className="font-medium text-[11px] hidden sm:inline">
            {isExpanded ? 'Hide Overview' : 'Show Overview'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Dashboard Body */}
      {isExpanded && (
        <div className="p-4 space-y-5 animate-fade-in">
          
          {/* Top 4 Primary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* 1. Total Documents */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg p-3.5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="font-semibold text-[11px]">Total Documents</span>
                <BookOpen className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--text-main)]">{totalBooks}</span>
                <span className="text-[10px] text-[var(--text-muted)]">files</span>
              </div>
              <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span>{fileTypeCounts.pdf} PDFs</span>
                <span>•</span>
                <span>{fileTypeCounts.document} Office Docs</span>
                <span>•</span>
                <span>{fileTypeCounts.image + fileTypeCounts.other} Other</span>
              </div>
            </div>

            {/* 2. Total Folders */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg p-3.5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="font-semibold text-[11px]">Folder Architecture</span>
                <FolderTree className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--text-main)]">{totalFolders}</span>
                <span className="text-[10px] text-[var(--text-muted)]">folders</span>
              </div>
              <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span>{rootCategories.length} Root Categories</span>
                <span>•</span>
                <span>{subfolders.length} Subfolders</span>
              </div>
            </div>

            {/* 3. Catalog Visibility */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg p-3.5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="font-semibold text-[11px]">Visibility Status</span>
                <Eye className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-400">{publicBooks}</span>
                <span className="text-[10px] text-[var(--text-muted)]">public files</span>
              </div>
              <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px]">
                <span className="text-emerald-400 font-medium">● {publicBooks} Visible</span>
                <span className="text-amber-400 font-medium">● {hiddenBooks} Hidden</span>
              </div>
            </div>

            {/* 4. Total Storage Footprint */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg p-3.5 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="font-semibold text-[11px]">Storage Footprint</span>
                <HardDrive className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[var(--text-main)]">
                  {totalSizeBytes > 0 ? formatFileSize(totalSizeBytes) : 'Cloud Indexed'}
                </span>
              </div>
              <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span>Sync Status: Active</span>
                {aiPendingCount > 0 && (
                  <button
                    onClick={onOpenAiOrganizer}
                    className="text-[var(--gold)] hover:underline font-semibold cursor-pointer"
                  >
                    {aiPendingCount} AI Proposals
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Lower Grid: Top Categories & Recent Uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Top Folders & Distribution */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                  <FolderIcon className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Top Folder Distribution</span>
                </h3>
                <span className="text-[10px] text-[var(--text-muted)]">By file count</span>
              </div>

              <div className="space-y-2.5 pt-1">
                {topFolders.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic py-2">No folders available yet.</p>
                ) : (
                  topFolders.map(({ folder, count }) => {
                    const percentage = totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0;
                    return (
                      <div key={folder.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => onSelectFolder && onSelectFolder(folder.id)}
                            className="font-medium text-[var(--text-main)] hover:text-[var(--gold)] hover:underline truncate cursor-pointer flex items-center gap-1.5"
                          >
                            <FolderIcon className="w-3 h-3 text-[var(--gold)] shrink-0" />
                            <span className="truncate">{folder.name}</span>
                          </button>
                          <span className="text-[var(--text-muted)] shrink-0 font-medium">
                            {count} {count === 1 ? 'file' : 'files'} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                          <div
                            className="bg-[var(--gold)] h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Uploads / Additions */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Recent Uploads & Additions</span>
                </h3>
                {onOpenUploadModal && (
                  <button
                    onClick={onOpenUploadModal}
                    className="text-[10px] text-[var(--gold)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload New</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-[var(--border-subtle)]">
                {recentBooks.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic py-2">No documents added yet.</p>
                ) : (
                  recentBooks.map((book) => {
                    const itemType = book.fileType || getItemType(book);
                    const formattedSize = book.fileSize
                      ? formatFileSize(parseInt(book.fileSize, 10) || 0)
                      : null;
                    const folderName = catalog.folders.find((f) => f.id === book.folderId)?.name || book.category || 'Library Root';

                    return (
                      <div key={book.id} className="py-2 flex items-center justify-between gap-3 text-[11px] first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {itemType === 'pdf' ? (
                            <FileText className="w-4 h-4 text-red-400 shrink-0" />
                          ) : itemType === 'document' ? (
                            <FileCode className="w-4 h-4 text-blue-400 shrink-0" />
                          ) : itemType === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-[var(--gold)] shrink-0" />
                          )}

                          <div className="min-w-0">
                            <span className="font-medium text-[var(--text-main)] truncate block">
                              {book.title}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] truncate">
                              <span>In <strong className="text-[var(--text-main)] font-normal">{folderName}</strong></span>
                              {formattedSize && (
                                <>
                                  <span>•</span>
                                  <span>{formattedSize}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {book.visible !== false ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                              Public
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                              Hidden
                            </span>
                          )}

                          <button
                            onClick={() => onSelectFolder && onSelectFolder(book.folderId)}
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                            title="Go to container folder"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
