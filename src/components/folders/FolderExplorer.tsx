import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Folder as FolderIcon,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  Archive as ArchiveIcon,
  ArrowLeft,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  Search,
  Star,
  Download,
  Info,
  Filter as FilterIcon,
  ExternalLink,
  FolderPlus,
  Upload,
  MoreVertical,
  Edit3,
  AlignLeft,
  Move,
  Trash2,
  Bookmark,
  Eye,
} from 'lucide-react';
import { Book, Folder, SortFieldSetting, SortDirectionSetting, FilterTypeSetting } from '../../types';
import { appState } from '../../state/appState';
import { router } from '../../router/router';
import { TOPIC_GROUPS, cleanFolderName, groupForFolder } from '../../data/topicGroups';
import { ActionMenuPortal } from '../ui/ActionMenuPortal';
import { api } from '../../services/api';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ItemDetailsModal } from '../ui/ItemDetailsModal';
import { FilePreviewModal } from '../viewers/FilePreviewModal';
import { NewFolderModal } from './NewFolderModal';
import { UploadFileModal } from './UploadFileModal';
import { QuickRenameModal } from '../admin/QuickRenameModal';
import { QuickDescriptionModal } from '../admin/QuickDescriptionModal';
import { MoveModal } from '../admin/MoveModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import {
  getItemType,
  getTypeLabel,
  getTypeBadgeColor,
  getPaidBadgeLabel,
  formatFileSize,
  formatCleanTitle,
  formatCatalogDate,
  getItemUrl,
  parseSizeBytes,
  downloadBookFile,
} from '../../utils/fileUtils';

interface FolderExplorerProps {
  folders?: Folder[];
  books?: Book[];
  title?: string;
  subtitle?: string;
  folderId?: string | null;
  subfolderId?: string | null;
  emptyMessage?: string;
  showBack?: boolean;
  isSpecialCollection?: boolean;
  specialCollectionType?: 'favorites' | 'recentlyViewed' | 'inProgress' | 'search';
  hideBreadcrumbs?: boolean;
}

export const FolderExplorer: React.FC<FolderExplorerProps> = ({
  folders = [],
  books = [],
  title,
  subtitle,
  folderId = null,
  subfolderId = null,
  emptyMessage,
  showBack = true,
  isSpecialCollection = false,
  specialCollectionType,
  hideBreadcrumbs = false,
}) => {
  // Local state initialized with default "All Items" filter
  const [viewMode, setViewModeState] = useState<'list' | 'grid'>(appState.settings.viewMode || 'list');
  const [sortField, setSortFieldState] = useState<SortFieldSetting>(appState.settings.sortField || 'name');
  const [sortDirection, setSortDirectionState] = useState<SortDirectionSetting>(appState.settings.sortDirection || 'asc');
  const [filterType, setFilterTypeState] = useState<FilterTypeSetting>('all');
  const [searchQuery, setSearchQuery] = useState('');
  // 6 big topics — the simple way to pick a folder instead of 36 long names.
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Creation Modals
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Item Details Modal
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<Book | Folder | null>(null);

  // File Preview Modal
  const [previewModalBook, setPreviewModalBook] = useState<Book | null>(null);

  // Quick Action Modals
  const [renameModal, setRenameModal] = useState<{
    open: boolean;
    type: 'folder' | 'book';
    id: string;
    initialName: string;
  }>({ open: false, type: 'folder', id: '', initialName: '' });

  const [descModal, setDescModal] = useState<{
    open: boolean;
    id: string;
    title: string;
    initialDescription: string;
  }>({ open: false, id: '', title: '', initialDescription: '' });

  const [moveModal, setMoveModal] = useState<{
    open: boolean;
    type: 'folder' | 'book';
    id: string;
    title: string;
    currentParentId: string | null;
  }>({ open: false, type: 'folder', id: '', title: '', currentParentId: null });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: 'folder' | 'book' | 'category';
    id: string;
    title: string;
    message: string;
    isBlocked: boolean;
  }>({ open: false, type: 'folder', id: '', title: '', message: '', isBlocked: false });

  const [isDeleting, setIsDeleting] = useState(false);

  // Active Three-Dot Menu Row Key
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);
  const menuButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Sync with global user settings updates (keeping filter default as 'all')
  useEffect(() => {
    setViewModeState(appState.settings.viewMode || 'list');
    setSortFieldState(appState.settings.sortField || 'name');
    setSortDirectionState(appState.settings.sortDirection || 'asc');
  }, [appState.settings]);

  // Reset filter & search whenever changing location / folder
  useEffect(() => {
    setFilterTypeState('all');
    setSearchQuery('');
    setSelectedGroup(null);
  }, [folderId, subfolderId]);

  // Close row menus on outside click
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuKey(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleSetViewMode = (mode: 'list' | 'grid') => {
    setViewModeState(mode);
    appState.setViewMode(mode);
  };

  const handleSetSortField = (field: SortFieldSetting) => {
    setSortFieldState(field);
    appState.setSortField(field);
  };

  const handleToggleSortDirection = () => {
    const nextDir = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirectionState(nextDir);
    appState.setSortDirection(nextDir);
  };

  const handleSetFilterType = (type: FilterTypeSetting) => {
    setFilterTypeState(type);
    appState.setFilterType(type);
  };

  // Resolve current active folder object
  const activeFolder = subfolderId
    ? appState.getFolderById(subfolderId)
    : folderId
    ? appState.getFolderById(folderId)
    : null;

  const currentFolderName = activeFolder ? cleanFolderName(activeFolder.name) : title || 'Library';
  const currentFolderDescription = activeFolder ? activeFolder.description : subtitle;

  // One-click Navigation handlers
  const handleFolderClick = (folder: Folder) => {
    if (folder.parentId) {
      router.navigate('library', { folderId: folder.parentId, subfolderId: folder.id });
    } else {
      router.navigate('library', { folderId: folder.id });
    }
  };

  const handleBookClick = (book: Book) => {
    router.navigate('book', { bookId: book.id });
  };

  const handleBackClick = () => {
    if (subfolderId) {
      router.navigate('library', { folderId });
    } else if (folderId) {
      router.navigate('library');
    } else {
      router.navigate('home');
    }
  };

  // 1. FILTERING
  const filteredFolders = useMemo(() => {
    if (filterType !== 'all' && filterType !== 'folders') {
      return [];
    }

    const safeFolders = Array.isArray(folders) ? folders : [];
    let result = safeFolders.filter((f) => f && typeof f === 'object');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          (f.name || '').toLowerCase().includes(q) ||
          (f.description || '').toLowerCase().includes(q)
      );
    }
    // Group filter: show only folders in the picked topic. Searching wins
    // over the group filter, so a search always looks at every folder.
    if (selectedGroup && !searchQuery.trim()) {
      const books = appState.catalog.books || [];
      result = result.filter((f) => groupForFolder(f, books)?.id === selectedGroup);
    }
    return result;
  }, [folders, filterType, searchQuery, selectedGroup]);

  // Counts per topic group, for the folders shown in this location.
  const folderGroupCounts = useMemo(() => {
    const books = appState.catalog.books || [];
    const safeFolders = Array.isArray(folders) ? folders : [];
    return TOPIC_GROUPS.map((group) => ({
      group,
      count: safeFolders.filter((f) => f && groupForFolder(f, books)?.id === group.id).length,
    })).filter((g) => g.count > 0);
  }, [folders]);

  const filteredBooks = useMemo(() => {
    if (filterType === 'folders') {
      return [];
    }

    const safeBooks = Array.isArray(books) ? books : [];
    let result = safeBooks.filter((b) => b && typeof b === 'object');

    if (filterType !== 'all') {
      result = result.filter((b) => {
        const t = getItemType(b);
        if (filterType === 'documents') return t === 'document' || t === 'pdf';
        if (filterType === 'pdfs') return t === 'pdf';
        if (filterType === 'images') return t === 'image';
        if (filterType === 'videos') return t === 'video';
        if (filterType === 'audio') return t === 'audio';
        if (filterType === 'other') return t === 'other' || t === 'archive';
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          (b.title || '').toLowerCase().includes(q) ||
          (b.author || '').toLowerCase().includes(q) ||
          (b.description || '').toLowerCase().includes(q) ||
          (Array.isArray(b.tags) && b.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [books, filterType, searchQuery]);

  // 2. SORTING (Folders First, Files Second)
  const sortedFolders = useMemo(() => {
    return [...filteredFolders].sort((a, b) => {
      if (!a || !b) return 0;
      let cmp = 0;
      if (sortField === 'name') {
        cmp = (a.name || '').localeCompare(b.name || '');
      } else if (sortField === 'date' || sortField === 'modified') {
        cmp = (a.createdAt || '').localeCompare(b.createdAt || '');
      } else if (sortField === 'size') {
        const countA = a.id ? appState.getItemCountForFolder(a.id) : 0;
        const countB = b.id ? appState.getItemCountForFolder(b.id) : 0;
        cmp = countA - countB;
      } else if (sortField === 'type') {
        cmp = 'Folder'.localeCompare('Folder');
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredFolders, sortField, sortDirection]);

  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
      if (!a || !b) return 0;
      let cmp = 0;
      if (sortField === 'name') {
        cmp = (a.title || '').localeCompare(b.title || '');
      } else if (sortField === 'date') {
        cmp = (a.addedDate || a.createdAt || '').localeCompare(b.addedDate || b.createdAt || '');
      } else if (sortField === 'modified') {
        cmp = (a.updatedDate || a.updatedAt || a.addedDate || '').localeCompare(
          b.updatedDate || b.updatedAt || b.addedDate || ''
        );
      } else if (sortField === 'type') {
        cmp = getTypeLabel(a).localeCompare(getTypeLabel(b));
      } else if (sortField === 'size') {
        const sizeA = parseSizeBytes(a.fileSize || a.pageCount);
        const sizeB = parseSizeBytes(b.fileSize || b.pageCount);
        cmp = sizeA - sizeB;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredBooks, sortField, sortDirection]);

  const isLocationEmpty = (folders || []).length === 0 && (books || []).length === 0;
  const isFilteredEmpty = sortedFolders.length === 0 && sortedBooks.length === 0;

  // Actions for Rename, Description, Move, Delete
  const handleSaveRename = async (newName: string) => {
    const { type, id } = renameModal;
    setRenameModal((prev) => ({ ...prev, open: false }));

    if (type === 'folder') {
      const res = await api.updateFolder(id, { name: newName });
      if (res.success) {
        appState.showToast('Folder renamed successfully', 'success');
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to rename folder', 'error');
      }
    } else {
      const res = await api.updateBook(id, { title: newName });
      if (res.success) {
        appState.showToast('File renamed successfully', 'success');
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to rename file', 'error');
      }
    }
  };

  const handleSaveDescription = async (newDesc: string) => {
    const { id } = descModal;
    setDescModal((prev) => ({ ...prev, open: false }));

    const isFolder = appState.getFolderById(id);
    if (isFolder) {
      const res = await api.updateFolder(id, { description: newDesc });
      if (res.success) {
        appState.showToast('Folder description updated', 'success');
        await appState.loadCatalog();
      }
    } else {
      const res = await api.updateBook(id, { description: newDesc });
      if (res.success) {
        appState.showToast('File description updated', 'success');
        await appState.loadCatalog();
      }
    }
  };

  const handleSaveMove = async (targetParentId: string | null) => {
    const { type, id } = moveModal;
    setMoveModal((prev) => ({ ...prev, open: false }));

    if (type === 'folder') {
      const res = await api.updateFolder(id, { parentId: targetParentId });
      if (res.success) {
        appState.showToast('Folder moved successfully', 'success');
        await appState.loadCatalog();
      }
    } else {
      // Determine if target is root folder or subfolder
      const targetFolder = targetParentId ? appState.getFolderById(targetParentId) : null;
      let newFolderId = 'general';
      let newSubfolderId: string | null = null;

      if (targetFolder) {
        if (targetFolder.parentId) {
          newFolderId = targetFolder.parentId;
          newSubfolderId = targetFolder.id;
        } else {
          newFolderId = targetFolder.id;
        }
      }

      const res = await api.updateBook(id, { folderId: newFolderId, subfolderId: newSubfolderId || undefined });
      if (res.success) {
        appState.showToast('File moved successfully', 'success');
        await appState.loadCatalog();
      }
    }
  };

  const openDeleteModalForBook = (b: Book) => {
    setDeleteConfirm({
      open: true,
      type: 'book',
      id: b.id,
      title: 'Delete File?',
      message: `Are you sure you want to permanently delete:\n\n"${b.title}"\n\nThis action cannot be undone.`,
      isBlocked: false,
    });
  };

  const openDeleteModalForFolder = (f: Folder) => {
    const isCategory = !f.parentId;
    const childFoldersCount = (appState.catalog.folders || []).filter((sub) => sub.parentId === f.id).length;
    const childBooksCount = (appState.catalog.books || []).filter(
      (b) => b.folderId === f.id || b.subfolderId === f.id
    ).length;
    const totalItems = childFoldersCount + childBooksCount;

    if (totalItems > 0) {
      setDeleteConfirm({
        open: true,
        type: isCategory ? 'category' : 'folder',
        id: f.id,
        title: isCategory ? 'Delete Category?' : 'Delete Folder?',
        message: `This folder contains ${totalItems} ${totalItems === 1 ? 'item' : 'items'}.\n\nThis folder is not empty. Move or delete its contents before deleting the folder.`,
        isBlocked: true,
      });
    } else {
      setDeleteConfirm({
        open: true,
        type: isCategory ? 'category' : 'folder',
        id: f.id,
        title: isCategory ? 'Delete Category?' : 'Delete Folder?',
        message: `Are you sure you want to delete:\n\n"${f.name}"?\n\n"${f.name}" is empty. Delete it?`,
        isBlocked: false,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (isDeleting || deleteConfirm.isBlocked) return;
    setIsDeleting(true);

    try {
      if (deleteConfirm.type === 'folder' || deleteConfirm.type === 'category') {
        const res = await api.deleteFolder(deleteConfirm.id);
        if (res.success) {
          appState.showToast('Folder deleted successfully.', 'success');
          await appState.loadCatalog();
          setDeleteConfirm((prev) => ({ ...prev, open: false }));
        } else {
          console.error('Delete folder error:', res.error);
          appState.showToast(res.error || 'Unable to delete this item.', 'error');
        }
      } else {
        const res = await api.deleteBook(deleteConfirm.id);
        if (res.success) {
          appState.showToast('File deleted successfully.', 'success');
          await appState.loadCatalog();
          setDeleteConfirm((prev) => ({ ...prev, open: false }));
        } else {
          console.error('Delete file error:', res.error);
          appState.showToast(res.error || 'Unable to delete this item.', 'error');
        }
      }
    } catch (err) {
      console.error('Delete exception:', err);
      appState.showToast('Unable to delete this item.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      
      {/* Top Header & Toolbar Area */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-4 space-y-4 shadow-2xs">
        
        {/* Row 1: Back Button & Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            {showBack && (
              <button
                type="button"
                onClick={handleBackClick}
                className="px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0 shadow-2xs"
                title="Return to previous location"
                aria-label="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                <span>Back</span>
              </button>
            )}

            {!hideBreadcrumbs && !isSpecialCollection && (
              <Breadcrumbs folderId={folderId} subfolderId={subfolderId} />
            )}
          </div>
        </div>

        {/* Row 2: Current Folder Name, Description & Top Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1 border-t border-[var(--border-subtle)]">
          
          {/* Current Folder Title & Description */}
          <div className="space-y-1 min-w-0">
            <h1 className="font-sans font-bold text-xl sm:text-2xl text-[var(--text-main)] tracking-tight">
              {currentFolderName}
            </h1>
            {currentFolderDescription && currentFolderDescription.trim().length > 0 && (
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl font-normal">
                {currentFolderDescription}
              </p>
            )}
          </div>

          {/* Action Buttons: New Folder & Upload File (Admin Only) */}
          {!isSpecialCollection && appState.isAdmin() && (
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setNewFolderModalOpen(true)}
                className="px-3.5 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded-md transition-colors text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <FolderPlus className="w-4 h-4 text-[var(--gold)]" />
                <span>New Folder</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-md transition-colors text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </button>
            </div>
          )}

        </div>

        {/* Row 3: Search Input Field */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search folders and books — type a name..."
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-md focus:outline-none focus:border-[var(--gold)] text-xs sm:text-sm font-sans transition-colors"
              aria-label="Search folders and books"
            />
          </div>
        </div>

        {/* Row 3b: Topic groups — 6 big topics instead of 27 folder names */}
        {folderGroupCounts.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-[11px] text-[var(--text-muted)] mb-2">Pick a topic to narrow the folders:</p>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Topics">
              <button
                type="button"
                onClick={() => setSelectedGroup(null)}
                className={`tap-target px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                  selectedGroup === null
                    ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
                }`}
              >
                All folders ({(folders || []).length})
              </button>
              {folderGroupCounts.map(({ group, count }) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
                  aria-pressed={selectedGroup === group.id}
                  className={`tap-target px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                    selectedGroup === group.id
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
                  }`}
                >
                  {group.title} ({count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Row 4: Controls Toolbar (Sort, Filter, View Toggles) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)] text-xs">
          
          {/* Left Controls: Filter & Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Category / Type Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-md px-2.5 py-1.5">
              <FilterIcon className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
              <span className="text-[var(--text-muted)] font-medium text-xs hidden sm:inline">Filter:</span>
              <select
                value={filterType}
                onChange={(e) => handleSetFilterType(e.target.value as FilterTypeSetting)}
                className="bg-transparent text-[var(--text-main)] focus:outline-none cursor-pointer font-medium text-xs"
                aria-label="Filter by format"
              >
                <option value="all" className="bg-[var(--bg-surface)] text-[var(--text-main)]">All Items</option>
                <option value="folders" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Folders</option>
                <option value="documents" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Documents</option>
                <option value="pdfs" className="bg-[var(--bg-surface)] text-[var(--text-main)]">PDFs</option>
                <option value="images" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Images</option>
                <option value="videos" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Videos</option>
                <option value="audio" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Audio</option>
                <option value="other" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Other / Archives</option>
              </select>
            </div>

            {/* Beginner-Friendly Sort Options */}
            <div className="flex items-center gap-1 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-md px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
              <span className="text-[var(--text-muted)] font-medium text-xs hidden sm:inline">Sort:</span>
              <select
                value={sortField}
                onChange={(e) => handleSetSortField(e.target.value as SortFieldSetting)}
                className="bg-transparent text-[var(--text-main)] focus:outline-none cursor-pointer font-medium text-xs"
                aria-label="Sort field"
              >
                <option value="name" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Name</option>
                <option value="date" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Date Added</option>
                <option value="modified" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Last Modified</option>
                <option value="type" className="bg-[var(--bg-surface)] text-[var(--text-main)]">File Type</option>
                <option value="size" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Size</option>
              </select>

              {/* Direction Toggle Button */}
              <button
                type="button"
                onClick={handleToggleSortDirection}
                className="px-2 py-0.5 ml-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--gold)] font-bold rounded border border-[var(--border-main)] transition-colors cursor-pointer text-[11px]"
                title={`Sort Direction: ${sortDirection === 'asc' ? 'Ascending (A-Z)' : 'Descending (Z-A)'}`}
                aria-label="Toggle sort order direction"
              >
                {sortDirection === 'asc' ? '↑ A-Z' : '↓ Z-A'}
              </button>
            </div>

          </div>

          {/* Right Controls: View Mode Toggle (List vs Grid) */}
          <div className="flex items-center gap-1 border border-[var(--border-main)] bg-[var(--bg-main)] rounded-md p-0.5">
            <button
              type="button"
              onClick={() => handleSetViewMode('list')}
              title="List View"
              aria-label="Switch to list view"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[var(--bg-accent)] text-[var(--gold)] font-bold shadow-2xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleSetViewMode('grid')}
              title="Grid View"
              aria-label="Switch to grid view"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[var(--bg-accent)] text-[var(--gold)] font-bold shadow-2xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Empty State Display */}
      {isFilteredEmpty && (
        <div className="py-12 px-6 text-center bg-[var(--bg-surface)] border border-dashed border-[var(--border-main)] rounded-lg space-y-3 font-sans shadow-2xs">
          {isLocationEmpty ? (
            <>
              {isSpecialCollection ? (
                <Bookmark className="w-8 h-8 text-[var(--gold)] mx-auto opacity-80" />
              ) : (
                <FolderIcon className="w-8 h-8 text-[var(--gold)] mx-auto opacity-80" />
              )}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  {emptyMessage || (isSpecialCollection ? 'No items found.' : 'Empty folder')}
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
                  {isSpecialCollection
                    ? 'No items available in this section.'
                    : appState.isAdmin()
                    ? 'Create a folder or upload a file to start building this collection.'
                    : 'There are no files available in this folder.'}
                </p>
              </div>

              {!isSpecialCollection && appState.isAdmin() && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewFolderModalOpen(true)}
                    className="px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded-md transition-colors text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <FolderPlus className="w-4 h-4 text-[var(--gold)]" />
                    <span>New Folder</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(true)}
                    className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-md transition-colors text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Search className="w-8 h-8 text-[var(--gold)] mx-auto opacity-80" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  No matching files
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
                  {searchQuery
                    ? `No items match your search for "${searchQuery}".`
                    : `No files match the selected filter type. Try changing the filter or selecting "All Items".`}
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilterTypeState('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold rounded-md transition-colors text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>Reset Filter & Search</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* LIST VIEW (File Manager Layout) */}
      {viewMode === 'list' && !isFilteredEmpty && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg overflow-hidden text-sm shadow-2xs">
          
          {/* Header Row */}
          <div className="grid grid-cols-12 px-4 py-2.5 bg-[var(--bg-list)] text-[var(--text-muted)] text-xs font-semibold border-b border-[var(--border-main)]">
            <div className="col-span-7 sm:col-span-5">Name</div>
            <div className="col-span-3 sm:col-span-2">Type</div>
            <div className="hidden sm:block sm:col-span-3 md:col-span-2 text-right">Items / Size</div>
            <div className="hidden md:block md:col-span-2 text-right">Modified</div>
            <div className="col-span-2 sm:col-span-2 md:col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            
            {/* 1. Folders Group */}
            {sortedFolders.map((folder, i) => {
              const itemCount = appState.getItemCountForFolder(folder.id);
              const formattedDate = formatCatalogDate(folder.createdAt, folder.updatedAt);
              const menuKey = `folder-${folder.id}`;
              const isMenuOpen = activeMenuKey === menuKey;

              return (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  style={{ '--motion-i': Math.min(i, 11) } as React.CSSProperties}
                  className="motion-item grid grid-cols-12 px-4 py-3 items-center hover:bg-[var(--bg-hover)] transition-colors cursor-pointer select-none text-xs sm:text-sm group relative"
                >
                  {/* Name & Description */}
                  <div className="col-span-7 sm:col-span-5 flex items-center gap-3 min-w-0 pr-2">
                    <FolderIcon className="w-5 h-5 text-[var(--gold)] fill-[var(--gold)]/20 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors truncate block">
                        {cleanFolderName(folder.name)}
                      </span>
                      {folder.description && (
                        <span className="text-xs text-[var(--text-muted)] truncate block font-normal leading-tight">
                          {folder.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-3 sm:col-span-2 text-xs text-[var(--text-muted)] font-medium">
                    Folder
                  </div>

                  {/* Size / Items */}
                  <div className="hidden sm:block sm:col-span-3 md:col-span-2 text-right text-xs text-[var(--text-muted)] font-medium">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </div>

                  {/* Modified */}
                  <div className="hidden md:block md:col-span-2 text-right text-xs text-[var(--text-muted)]">
                    {formattedDate || '—'}
                  </div>

                  {/* Actions & More Menu */}
                  <div className="col-span-2 sm:col-span-2 md:col-span-1 text-right flex items-center justify-end gap-1">
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) menuButtonRefs.current.set(menuKey, el);
                        else menuButtonRefs.current.delete(menuKey);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuKey(isMenuOpen ? null : menuKey);
                      }}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-colors cursor-pointer"
                      title="More actions"
                      aria-label="More folder actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Three-Dot Context Dropdown via Portal */}
                    <ActionMenuPortal
                      isOpen={isMenuOpen}
                      onClose={() => setActiveMenuKey(null)}
                      triggerRef={{ current: menuButtonRefs.current.get(menuKey) || null }}
                      className="w-44"
                    >
                      <button
                        onClick={() => {
                          setActiveMenuKey(null);
                          handleFolderClick(folder);
                        }}
                        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                      >
                        <FolderIcon className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>Open Folder</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuKey(null);
                          setSelectedDetailsItem(folder);
                        }}
                        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>Details</span>
                      </button>
                      {appState.isAdmin() && (
                        <>
                          <div className="my-1 border-t border-[var(--border-subtle)]" />
                          <button
                            onClick={() => {
                              setActiveMenuKey(null);
                              setRenameModal({ open: true, type: 'folder', id: folder.id, initialName: folder.name });
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Rename</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuKey(null);
                              setDescModal({ open: true, id: folder.id, title: folder.name, initialDescription: folder.description || '' });
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                          >
                            <AlignLeft className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Edit Description</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuKey(null);
                              setMoveModal({ open: true, type: 'folder', id: folder.id, title: folder.name, currentParentId: folder.parentId });
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                          >
                            <Move className="w-3.5 h-3.5 text-amber-400" />
                            <span>Move Folder</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuKey(null);
                              openDeleteModalForFolder(folder);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-500/10 text-rose-400 text-left cursor-pointer font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </ActionMenuPortal>
                  </div>
                </div>
              );
            })}

            {/* 2. Files Group */}
            {sortedBooks.map((book, i) => {
              const isFav = appState.isFavorite(book.id);
              const itemType = getItemType(book);
              const typeLabel = getTypeLabel(book);
              const badgeColor = getTypeBadgeColor(itemType);
              const cleanTitle = formatCleanTitle(book.title);
              const formattedDate = formatCatalogDate(book.addedDate, book.updatedDate);
              const formattedSize = book.fileSize ? formatFileSize(book.fileSize) : book.pageCount ? `${book.pageCount}p` : 'File';
              const targetUrl = getItemUrl(book);
              const menuKey = `book-${book.id}`;
              const isMenuOpen = activeMenuKey === menuKey;

              const renderIcon = () => {
                switch (itemType) {
                  case 'image':
                    return (
                      <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                      </div>
                    );
                  case 'video':
                    return (
                      <div className="w-8 h-8 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <VideoIcon className="w-4 h-4 text-purple-400" />
                      </div>
                    );
                  case 'audio':
                    return (
                      <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <AudioIcon className="w-4 h-4 text-amber-400" />
                      </div>
                    );
                  case 'archive':
                    return (
                      <div className="w-8 h-8 rounded-md bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <ArchiveIcon className="w-4 h-4 text-orange-400" />
                      </div>
                    );
                  default:
                    return (
                      <div className="w-8 h-8 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4 text-sky-400" />
                      </div>
                    );
                }
              };

              return (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  style={{ '--motion-i': Math.min(sortedFolders.length + i, 11) } as React.CSSProperties}
                  className="motion-item grid grid-cols-12 px-4 py-3 items-center hover:bg-[var(--bg-hover)] transition-colors cursor-pointer select-none text-xs sm:text-sm group relative"
                >
                  {/* Name & Creator */}
                  <div className="col-span-7 sm:col-span-5 flex items-center gap-3 min-w-0 pr-2">
                    {renderIcon()}
                    <div className="min-w-0 flex-1">
                      <span
                        className="font-semibold text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors truncate block"
                        title={book.title}
                      >
                        {cleanTitle}
                      </span>
                      {book.author && (
                        <span className="text-xs text-[var(--text-muted)] truncate block font-normal">
                          {book.author}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="col-span-3 sm:col-span-2 text-xs flex flex-wrap items-center gap-1.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
                      {typeLabel}
                    </span>
                    {getPaidBadgeLabel(book) && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold border border-[var(--gold)]/60 bg-[var(--gold-faint)] text-[var(--gold)]">
                        {getPaidBadgeLabel(book)}
                      </span>
                    )}
                  </div>

                  {/* Size / Pages */}
                  <div className="hidden sm:block sm:col-span-3 md:col-span-2 text-right text-xs text-[var(--text-muted)] font-medium">
                    {formattedSize}
                  </div>

                  {/* Modified Date */}
                  <div className="hidden md:block md:col-span-2 text-right text-xs text-[var(--text-muted)]">
                    {formattedDate || '—'}
                  </div>

                  {/* Actions & Dropdown */}
                  <div className="col-span-2 sm:col-span-2 md:col-span-1 text-right flex items-center justify-end gap-1 relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewModalBook(book);
                      }}
                      className="p-1 rounded text-[var(--gold)] hover:bg-[var(--bg-main)] transition-colors cursor-pointer"
                      title="Quick Preview"
                      aria-label="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        appState.toggleFavorite(book.id);
                      }}
                      className="p-1 rounded hover:bg-[var(--bg-main)] transition-colors text-amber-400 cursor-pointer"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      aria-label="Favorite"
                    >
                      {isFav ? (
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <Star className="w-4 h-4 text-[var(--text-muted)] hover:text-amber-400" />
                      )}
                    </button>

                    {targetUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadBookFile(book);
                        }}
                        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-colors hidden sm:inline-block cursor-pointer"
                        title="Download file"
                        aria-label="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      ref={(el) => {
                        if (el) menuButtonRefs.current.set(menuKey, el);
                        else menuButtonRefs.current.delete(menuKey);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuKey(isMenuOpen ? null : menuKey);
                      }}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-colors cursor-pointer"
                      title="More actions"
                      aria-label="More file actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Three-Dot Dropdown Menu via Portal */}
                    <ActionMenuPortal
                      isOpen={isMenuOpen}
                      onClose={() => setActiveMenuKey(null)}
                      triggerRef={{ current: menuButtonRefs.current.get(menuKey) || null }}
                      className="w-44"
                    >
                      <button
                        onClick={() => {
                          setActiveMenuKey(null);
                          setPreviewModalBook(book);
                        }}
                        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer font-semibold text-[var(--gold)]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>Quick Preview</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenuKey(null);
                          handleBookClick(book);
                        }}
                        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>Open Details Page</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenuKey(null);
                          appState.toggleFavorite(book.id);
                        }}
                        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isFav ? 'Unfavorite' : 'Favorite'}</span>
                      </button>

                      {targetUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuKey(null);
                            downloadBookFile(book);
                          }}
                          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-400" />
                          <span>Download</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveMenuKey(null);
                          setSelectedDetailsItem(book);
                        }}
                        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>Details</span>
                      </button>

                      {appState.isAdmin() && (
                        <>
                          <div className="my-1 border-t border-[var(--border-subtle)]" />
                          <button
                            onClick={() => {
                              setActiveMenuKey(null);
                              setRenameModal({ open: true, type: 'book', id: book.id, initialName: book.title });
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Rename</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuKey(null);
                              setDescModal({ open: true, id: book.id, title: book.title, initialDescription: book.description || '' });
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                          >
                            <AlignLeft className="w-3.5 h-3.5 text-purple-400" />
                            <span>Edit Description</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuKey(null);
                              setMoveModal({ open: true, type: 'book', id: book.id, title: book.title, currentParentId: book.subfolderId || book.folderId });
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-hover)] text-left cursor-pointer"
                          >
                            <Move className="w-3.5 h-3.5 text-amber-400" />
                            <span>Move File</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuKey(null);
                              openDeleteModalForBook(book);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-500/10 text-rose-400 text-left cursor-pointer font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </ActionMenuPortal>
                  </div>
                </div>
              );
            })}

          </div>

        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && !isFilteredEmpty && (
        <div className="space-y-4">
          
          {/* Folders Section */}
          {sortedFolders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sortedFolders.map((folder, i) => {
                const itemCount = appState.getItemCountForFolder(folder.id);
                return (
                  <div
                    key={folder.id}
                    onClick={() => handleFolderClick(folder)}
                    style={{ '--motion-i': Math.min(i, 11) } as React.CSSProperties}
                    className="motion-item motion-card p-3 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-2 min-w-0 group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderIcon className="w-6 h-6 text-[var(--gold)] fill-[var(--gold)]/20 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-[var(--text-main)] group-hover:text-[var(--gold)] truncate">
                          {cleanFolderName(folder.name)}
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetailsItem(folder);
                      }}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded cursor-pointer shrink-0"
                      title="Folder Details"
                      aria-label="View folder details"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Books / Files Grid Section */}
          {sortedBooks.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sortedBooks.map((book, i) => {
                const isFav = appState.isFavorite(book.id);
                const itemType = getItemType(book);
                const typeLabel = getTypeLabel(book);
                const badgeColor = getTypeBadgeColor(itemType);
                const cleanTitle = formatCleanTitle(book.title);
                const formattedSize = book.fileSize ? formatFileSize(book.fileSize) : book.pageCount ? `${book.pageCount}p` : 'File';

                const renderGridIcon = () => {
                  switch (itemType) {
                    case 'image':
                      return (
                        <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                        </div>
                      );
                    case 'video':
                      return (
                        <div className="w-8 h-8 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <VideoIcon className="w-4 h-4 text-purple-400" />
                        </div>
                      );
                    case 'audio':
                      return (
                        <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <AudioIcon className="w-4 h-4 text-amber-400" />
                        </div>
                      );
                    case 'archive':
                      return (
                        <div className="w-8 h-8 rounded-md bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <ArchiveIcon className="w-4 h-4 text-orange-400" />
                        </div>
                      );
                    default:
                      return (
                        <div className="w-8 h-8 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <FileText className="w-4 h-4 text-sky-400" />
                        </div>
                      );
                  }
                };

                return (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    style={{ '--motion-i': Math.min(sortedFolders.length + i, 11) } as React.CSSProperties}
                    className="motion-item motion-card p-3 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer transition-colors flex flex-col justify-between space-y-2 min-h-[100px] group relative shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="flex items-start gap-2 min-w-0">
                        {renderGridIcon()}
                        <div className="min-w-0">
                          <h4
                            className="font-semibold text-xs sm:text-sm text-[var(--text-main)] line-clamp-2 leading-tight group-hover:text-[var(--gold)] transition-colors"
                            title={book.title}
                          >
                            {cleanTitle}
                          </h4>
                          {book.author && (
                            <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                              {book.author}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          appState.toggleFavorite(book.id);
                        }}
                        className="p-1 rounded hover:bg-[var(--bg-main)] transition-colors shrink-0 cursor-pointer text-amber-400"
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label="Favorite"
                      >
                        {isFav ? (
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ) : (
                          <Star className="w-4 h-4 text-[var(--text-muted)] hover:text-amber-400" />
                        )}
                      </button>
                    </div>

                    <div className="text-[10px] text-[var(--text-faint)] flex items-center justify-between border-t border-[var(--border-subtle)] pt-1.5 font-sans">
                      <span className="flex items-center gap-1.5">
                        <span className={`font-bold ${badgeColor.text}`}>{typeLabel}</span>
                        {getPaidBadgeLabel(book) && (
                          <span className="font-bold text-[var(--gold)]">
                            {getPaidBadgeLabel(book)}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span>{formattedSize}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalBook(book);
                          }}
                          className="p-0.5 text-[var(--gold)] hover:scale-110 cursor-pointer transition-transform"
                          title="Quick Preview"
                          aria-label="Quick preview file"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailsItem(book);
                          }}
                          className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                          title="File Details"
                          aria-label="View file details"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Item Details Modal */}
      <ItemDetailsModal
        item={selectedDetailsItem}
        isOpen={!!selectedDetailsItem}
        onClose={() => setSelectedDetailsItem(null)}
      />

      {/* Creation Modals */}
      <NewFolderModal
        isOpen={newFolderModalOpen}
        parentFolderName={currentFolderName}
        parentId={subfolderId || folderId || null}
        onClose={() => setNewFolderModalOpen(false)}
        onCreated={() => appState.loadCatalog()}
      />

      <UploadFileModal
        isOpen={uploadModalOpen}
        destinationFolderName={currentFolderName}
        folderId={folderId}
        subfolderId={subfolderId}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={() => appState.loadCatalog()}
      />

      {/* Management Modals */}
      <QuickRenameModal
        isOpen={renameModal.open}
        itemType={renameModal.type}
        initialName={renameModal.initialName}
        onSave={handleSaveRename}
        onCancel={() => setRenameModal((prev) => ({ ...prev, open: false }))}
      />

      <QuickDescriptionModal
        isOpen={descModal.open}
        itemTitle={descModal.title}
        initialDescription={descModal.initialDescription}
        onSave={handleSaveDescription}
        onCancel={() => setDescModal((prev) => ({ ...prev, open: false }))}
      />

      <MoveModal
        isOpen={moveModal.open}
        itemType={moveModal.type}
        itemId={moveModal.id}
        itemTitle={moveModal.title}
        currentParentId={moveModal.currentParentId}
        allFolders={appState.catalog.folders || []}
        onConfirm={handleSaveMove}
        onCancel={() => setMoveModal((prev) => ({ ...prev, open: false }))}
      />

      <ConfirmModal
        isOpen={deleteConfirm.open}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
        isBlocked={deleteConfirm.isBlocked}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteConfirm((prev) => ({ ...prev, open: false }));
          }
        }}
      />

      {/* Centralized File Preview Modal */}
      <FilePreviewModal
        book={previewModalBook}
        isOpen={!!previewModalBook}
        onClose={() => setPreviewModalBook(null)}
      />

    </div>
  );
};
