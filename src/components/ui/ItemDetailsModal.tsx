import React from 'react';
import {
  X,
  FileText,
  Folder as FolderIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  Archive as ArchiveIcon,
  Download,
  ExternalLink,
  Star,
  Clock,
  HardDrive,
  User,
  Info,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Book, Folder } from '../../types';
import { appState } from '../../state/appState';
import { router } from '../../router/router';
import {
  getItemType,
  getTypeLabel,
  getTypeBadgeColor,
  getItemUrl,
  getFileExtension,
  formatFileSize,
  formatCleanTitle,
  formatReadableDate,
  downloadBookFile,
} from '../../utils/fileUtils';

interface ItemDetailsModalProps {
  item: Book | Folder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const isFolder = 'parentId' in item;

  if (isFolder) {
    const folder = item as Folder;
    const itemCount = appState.getItemCountForFolder(folder.id);
    const parentFolder = folder.parentId ? appState.getFolderById(folder.parentId) : null;
    const locationPath = parentFolder ? `Ilm-e-Ghayb Library > ${parentFolder.name}` : 'Ilm-e-Ghayb Library (Root)';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-sans">
        <div
          className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-main)] bg-[var(--bg-main)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--border-main)] rounded-lg shrink-0">
                <FolderIcon className="w-5 h-5 fill-[var(--gold)]/20" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Folder Details
                </span>
                <h3 className="font-semibold text-base text-[var(--text-main)] truncate">
                  {folder.name}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-md transition-colors cursor-pointer"
              title="Close Details"
              aria-label="Close details dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 text-xs sm:text-sm text-[var(--text-main)] max-h-[70vh] overflow-y-auto">
            {folder.description && (
              <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)]">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                  Description
                </span>
                <p className="text-xs text-[var(--text-main)] leading-relaxed">
                  {folder.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 font-sans">
              <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)] space-y-1">
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Contents</span>
                </span>
                <p className="font-semibold text-sm text-[var(--text-main)]">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)] space-y-1">
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Location</span>
                </span>
                <p className="font-medium text-xs text-[var(--text-main)] truncate" title={locationPath}>
                  {locationPath}
                </p>
              </div>

              {folder.createdAt && (
                <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)] space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>Created</span>
                  </span>
                  <p className="font-medium text-xs text-[var(--text-main)]">
                    {formatReadableDate(folder.createdAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 bg-[var(--bg-main)] border-t border-[var(--border-main)] flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                if (folder.parentId) {
                  router.navigate('library', { folderId: folder.parentId, subfolderId: folder.id });
                } else {
                  router.navigate('library', { folderId: folder.id });
                }
              }}
              className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <FolderIcon className="w-4 h-4" />
              <span>Open Folder</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // File Item
  const book = item as Book;
  const isFav = appState.isFavorite(book.id);
  const itemType = getItemType(book);
  const typeLabel = getTypeLabel(book);
  const badgeColor = getTypeBadgeColor(itemType);
  const targetUrl = getItemUrl(book);
  const ext = getFileExtension(targetUrl || book.title).toUpperCase();
  const formattedTitle = formatCleanTitle(book.title);
  const formattedSize = book.fileSize ? formatFileSize(book.fileSize) : book.pageCount ? `${book.pageCount} pages` : 'Standard file';

  const folder = book.folderId ? appState.getFolderById(book.folderId) : null;
  const subfolder = book.subfolderId ? appState.getFolderById(book.subfolderId) : null;
  const locationPath = subfolder
    ? `${folder?.name || 'Library'} > ${subfolder.name}`
    : folder
    ? folder.name
    : 'Root Library';

  const renderTypeIcon = () => {
    switch (itemType) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-400" />;
      case 'video':
        return <VideoIcon className="w-5 h-5 text-purple-400" />;
      case 'audio':
        return <AudioIcon className="w-5 h-5 text-amber-400" />;
      case 'archive':
        return <ArchiveIcon className="w-5 h-5 text-orange-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-sans">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-main)] bg-[var(--bg-main)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-lg border shrink-0 ${badgeColor.bg} ${badgeColor.border}`}>
              {renderTypeIcon()}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                File Details
              </span>
              <h3 className="font-semibold text-base text-[var(--text-main)] truncate" title={formattedTitle}>
                {formattedTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => appState.toggleFavorite(book.id)}
              className="p-1.5 text-amber-400 hover:bg-[var(--bg-hover)] rounded-md transition-colors cursor-pointer"
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)]'}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-md transition-colors cursor-pointer"
              title="Close Details"
              aria-label="Close details dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-[var(--text-main)] max-h-[70vh] overflow-y-auto">
          {/* Badge & Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}>
                {typeLabel} {ext ? `(${ext})` : ''}
              </span>
              {book.category && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-main)] font-mono">
                  {book.category}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono break-all pt-1" title="Original File Reference">
              Name: {book.title}
            </p>
          </div>

          {/* Description */}
          {book.description && (
            <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)]">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Description
              </span>
              <p className="text-xs text-[var(--text-main)] leading-relaxed">
                {book.description}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 font-sans">
            {book.author && (
              <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)] space-y-1">
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Author / Creator</span>
                </span>
                <p className="font-semibold text-xs text-[var(--text-main)] truncate" title={book.author}>
                  {book.author}
                </p>
              </div>
            )}

            <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)] space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Size / Length</span>
              </span>
              <p className="font-semibold text-xs text-[var(--text-main)]">
                {formattedSize}
              </p>
            </div>

            <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)] space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Location</span>
              </span>
              <p className="font-medium text-xs text-[var(--text-main)] truncate" title={locationPath}>
                {locationPath}
              </p>
            </div>

            {book.addedDate && (
              <div className="bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-main)] space-y-1">
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Date Added</span>
                </span>
                <p className="font-medium text-xs text-[var(--text-main)]">
                  {formatReadableDate(book.addedDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[var(--bg-main)] border-t border-[var(--border-main)] flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {targetUrl && (
              <button
                type="button"
                onClick={() => downloadBookFile(book)}
                className="px-3.5 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                title="Download file directly"
              >
                <Download className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Download</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                router.navigate('book', { bookId: book.id });
              }}
              className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
