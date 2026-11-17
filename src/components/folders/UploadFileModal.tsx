import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Folder as FolderIcon,
  Trash2,
  RotateCw,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  Archive as ArchiveIcon,
  Layers,
  Globe,
} from 'lucide-react';
import { api } from '../../services/api';
import { appState } from '../../state/appState';
import {
  extractTitleFromFilename,
  detectFileType,
  formatFileSize,
  getTypeBadgeColor,
  getTypeLabel,
  extractDriveId,
} from '../../utils/fileUtils';
import { extractPdfCover } from '../../services/pdf';
import { PaidBookControl } from '../admin/PaidBookControl';
import { ItemType, Book } from '../../types';

interface UploadFileModalProps {
  isOpen: boolean;
  destinationFolderName?: string;
  folderId?: string | null;
  subfolderId?: string | null;
  onClose: () => void;
  onUploaded: () => void;
  onOpenUrlImport?: () => void;
}

export interface UploadQueueItem {
  id: string;
  // A local file to upload, OR a Drive link (driveLink set, file absent).
  // Link items never upload any bytes — only the link is saved.
  file?: File;
  driveLink?: string;
  driveFileId?: string;
  originalFilename: string;
  title: string;
  author?: string;
  description?: string;
  fileType: ItemType;
  fileSize: string;
  sizeBytes: number;
  status: 'ready' | 'uploading' | 'success' | 'error' | 'skipped';
  progress: number;
  loadedBytes: number;
  errorMsg?: string;
  duplicateDetected: boolean;
  existingBookId?: string;
  duplicateAction: 'skip' | 'replace' | 'keep_both';
  previewUrl?: string;
  coverUrl?: string;
  catalogSaved?: boolean;
}

export const UploadFileModal: React.FC<UploadFileModalProps> = ({
  isOpen,
  destinationFolderName,
  folderId,
  subfolderId,
  onClose,
  onUploaded,
  onOpenUrlImport,
}) => {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  // Batch Metadata fields (Optional)
  const [batchAuthor, setBatchAuthor] = useState('');
  const [batchDescription, setBatchDescription] = useState('');
  const [batchTags, setBatchTags] = useState('');
  const [showBatchMetadata, setShowBatchMetadata] = useState(false);

  // Batch paid: one price for every book in this batch (files and links).
  // The admin types the price once; no price is ever invented.
  const [batchPaid, setBatchPaid] = useState<Partial<Book>>({ isPaid: false });

  // Pasted Drive links, one per line. No file bytes are uploaded for these.
  const [driveLinksText, setDriveLinksText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB per file limit

  // Determine target folder structure
  const getTargetFolders = () => {
    let targetFolderId = folderId || 'general';
    let targetSubfolderId = subfolderId || undefined;

    if (folderId) {
      const folderObj = appState.getFolderById(folderId);
      if (folderObj && folderObj.parentId) {
        targetFolderId = folderObj.parentId;
        targetSubfolderId = folderObj.id;
      }
    }
    return { targetFolderId, targetSubfolderId };
  };

  const getDestinationPath = (): string => {
    if (destinationFolderName) return destinationFolderName;
    const { targetFolderId, targetSubfolderId } = getTargetFolders();

    if (targetSubfolderId) {
      const sub = appState.getFolderById(targetSubfolderId);
      const parent = appState.getFolderById(targetFolderId);
      if (parent && sub) return `Library / ${parent.name} / ${sub.name}`;
      if (sub) return `Library / ${sub.name}`;
    }
    if (targetFolderId && targetFolderId !== 'general') {
      const f = appState.getFolderById(targetFolderId);
      if (f) return `Library / ${f.name}`;
    }
    return 'Library Root';
  };

  // Whether live Drive storage is connected (local uploads are only
  // temporary on the live site while it is not — see the warning below).
  const [driveConfigured, setDriveConfigured] = useState<boolean | null>(null);
  useEffect(() => {
    if (isOpen && driveConfigured === null) {
      api.getLibraryStatus()
        .then((s) => setDriveConfigured(s.driveConfigured))
        .catch(() => setDriveConfigured(null));
    }
  }, [isOpen, driveConfigured]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQueue([]);
      setIsUploading(false);
      setGeneralError('');
      setBatchAuthor('');
      setBatchDescription('');
      setBatchTags('');
      setShowBatchMetadata(false);
      setBatchPaid({ isPaid: false });
      setDriveLinksText('');
      cancelledRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Check if a file with same title or filename exists in current folder
  const checkDuplicate = (fileTitle: string, filename: string): { duplicate: boolean; existingBookId?: string } => {
    const { targetFolderId, targetSubfolderId } = getTargetFolders();
    const cleanTitle = fileTitle.trim().toLowerCase();
    const cleanFilename = filename.trim().toLowerCase();

    const existing = (appState.catalog.books || []).find((b) => {
      const matchFolder =
        (b.folderId === targetFolderId || (!b.folderId && targetFolderId === 'general')) &&
        ((!b.subfolderId && !targetSubfolderId) || b.subfolderId === targetSubfolderId);

      if (!matchFolder) return false;

      const bookTitle = b.title.trim().toLowerCase();
      const origFilename = (b.originalFilename || '').trim().toLowerCase();

      return bookTitle === cleanTitle || origFilename === cleanFilename;
    });

    if (existing) {
      return { duplicate: true, existingBookId: existing.id };
    }
    return { duplicate: false };
  };

  // Process incoming files instantly without blocking
  const processFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setGeneralError('');

    const newItems: UploadQueueItem[] = [];
    const oversizedFiles: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizedFiles.push(file.name);
        continue;
      }

      // Automatic website title from filename (removes ONLY final extension)
      const autoTitle = extractTitleFromFilename(file.name);
      const fileType = detectFileType(file.name, file.type);
      const { duplicate, existingBookId } = checkDuplicate(autoTitle, file.name);

      let previewUrl: string | undefined = undefined;
      if (fileType === 'image') {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          // ignore
        }
      }

      const itemId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      newItems.push({
        id: itemId,
        file,
        originalFilename: file.name,
        title: autoTitle,
        fileType,
        fileSize: formatFileSize(file.size),
        sizeBytes: file.size,
        status: 'ready',
        progress: 0,
        loadedBytes: 0,
        duplicateDetected: duplicate,
        existingBookId,
        duplicateAction: 'skip',
        previewUrl,
        catalogSaved: false,
      });
    }

    if (oversizedFiles.length > 0) {
      setGeneralError(
        `The following files exceed the 500 MB per-file limit and were skipped: ${oversizedFiles.join(', ')}`
      );
    }

    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItemTitle = (id: string, newTitle: string) => {
    setQueue((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const { duplicate, existingBookId } = checkDuplicate(newTitle, item.originalFilename);
        return {
          ...item,
          title: newTitle,
          duplicateDetected: duplicate,
          existingBookId,
        };
      })
    );
  };

  const updateDuplicateAction = (id: string, action: 'skip' | 'replace' | 'keep_both') => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, duplicateAction: action } : item))
    );
  };

  const applyGlobalDuplicateAction = (action: 'skip' | 'replace' | 'keep_both') => {
    setQueue((prev) =>
      prev.map((item) => (item.duplicateDetected ? { ...item, duplicateAction: action } : item))
    );
  };

  // Apply batch metadata to all items in queue
  const applyBatchMetadata = () => {
    setQueue((prev) =>
      prev.map((item) => ({
        ...item,
        author: batchAuthor.trim() || item.author,
        description: batchDescription.trim() || item.description,
      }))
    );
    appState.showToast('Batch metadata applied to selected files', 'info');
  };

  // Paste Drive links, one per line. No file bytes are uploaded for these —
  // only the link is saved, exactly like the single-book Drive link field.
  // Titles default to "Untitled book" and are editable in the queue below.
  const addDriveLinks = () => {
    const lines = driveLinksText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const bad: string[] = [];
    const newItems: UploadQueueItem[] = [];
    for (const link of lines) {
      const driveId = extractDriveId(link);
      if (!driveId) {
        bad.push(link);
        continue;
      }
      newItems.push({
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        driveLink: link,
        driveFileId: driveId,
        originalFilename: link,
        title: 'Untitled book',
        fileType: 'pdf',
        fileSize: 'Drive link',
        sizeBytes: 0,
        status: 'ready',
        progress: 0,
        loadedBytes: 0,
        duplicateDetected: false,
        duplicateAction: 'skip',
        catalogSaved: false,
      });
    }
    if (bad.length > 0) {
      setGeneralError(
        `These are not Google Drive file links and were skipped: ${bad.join(', ')}`
      );
    } else {
      setGeneralError('');
    }
    if (newItems.length > 0) {
      setQueue((prev) => [...prev, ...newItems]);
      setDriveLinksText('');
      appState.showToast(
        `${newItems.length} Drive link${newItems.length === 1 ? '' : 's'} added — no file upload needed.`,
        'success'
      );
    }
  };

  // Helper to process a single item upload
  const uploadSingleItem = async (item: UploadQueueItem, signal: AbortSignal): Promise<boolean> => {
    const { targetFolderId, targetSubfolderId } = getTargetFolders();

    // Check duplicate action
    if (item.duplicateDetected && item.duplicateAction === 'skip') {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: 'skipped', progress: 100, loadedBytes: item.sizeBytes } : q
        )
      );
      return true;
    }

    // Drive-link items: no bytes are uploaded at all — only the link is
    // saved to the catalog, same as the single-book Drive link fast path.
    if (item.driveLink && item.driveFileId) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: 'uploading', progress: 50, loadedBytes: 0, errorMsg: undefined } : q
        )
      );
      const paidPatch = batchPaid.isPaid
        ? { isPaid: true, price: batchPaid.price, paymentNote: batchPaid.paymentNote || '' }
        : {};
      const linkTitle = item.title.trim() || 'Untitled book';
      if (item.duplicateDetected && item.duplicateAction === 'replace' && item.existingBookId) {
        const updateRes = await api.updateBook(item.existingBookId, {
          title: linkTitle,
          author: item.author || batchAuthor.trim() || undefined,
          description: item.description || batchDescription.trim() || undefined,
          externalUrl: item.driveLink,
          driveFileId: item.driveFileId,
          fileType: item.fileType,
          ...paidPatch,
        });
        if (!updateRes.success) {
          throw new Error(updateRes.error || 'Failed to update catalog entry.');
        }
      } else {
        const addRes = await api.addBook({
          title: linkTitle,
          originalFilename: item.originalFilename,
          author: item.author || batchAuthor.trim() || undefined,
          description: item.description || batchDescription.trim() || undefined,
          folderId: targetFolderId,
          subfolderId: targetSubfolderId,
          externalUrl: item.driveLink,
          driveFileId: item.driveFileId,
          fileType: item.fileType,
          fileSize: '',
          tags: batchTags.trim() ? batchTags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
          ...paidPatch,
        });
        if (!addRes.success) {
          throw new Error(addRes.error || 'Failed to save book to catalog.');
        }
      }
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? { ...q, status: 'success', progress: 100, loadedBytes: 0, catalogSaved: true }
            : q
        )
      );
      return true;
    }

    if (!item.file) {
      throw new Error('No file attached to this item.');
    }

    setQueue((prev) =>
      prev.map((q) =>
        q.id === item.id ? { ...q, status: 'uploading', progress: 0, loadedBytes: 0, errorMsg: undefined } : q
      )
    );

    const onProgress = (p: { loadedBytes: number; totalBytes: number; percentage: number }) => {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? {
                ...q,
                progress: p.percentage,
                loadedBytes: p.loadedBytes,
              }
            : q
        )
      );
    };

    const uploadTargetFolderId = targetSubfolderId || targetFolderId || folderId || undefined;
    const uploadRes = await api.uploadFile(item.file, onProgress, signal, uploadTargetFolderId);
    if (!uploadRes.success || !uploadRes.fileUrl) {
      throw new Error(uploadRes.error || 'File upload failed.');
    }

    let coverUrl = item.coverUrl;
    if (item.fileType === 'image' && !coverUrl) {
      coverUrl = uploadRes.fileUrl;
    }

    let finalTitle = item.title.trim() || extractTitleFromFilename(item.file.name);
    if (item.duplicateDetected && item.duplicateAction === 'keep_both') {
      finalTitle = `${finalTitle} (1)`;
    }

    // Save metadata entry to catalog ONCE
    if (!item.catalogSaved) {
      // Batch paid (if the admin ticked it): the same price applies to
      // every book in this batch, files and Drive links alike.
      const batchPaidPatch = batchPaid.isPaid
        ? { isPaid: true, price: batchPaid.price, paymentNote: batchPaid.paymentNote || '' }
        : {};
      if (item.duplicateDetected && item.duplicateAction === 'replace' && item.existingBookId) {
        const updateRes = await api.updateBook(item.existingBookId, {
          title: finalTitle,
          originalFilename: item.originalFilename,
          author: item.author || batchAuthor.trim() || undefined,
          description: item.description || batchDescription.trim() || undefined,
          fileUrl: uploadRes.fileUrl,
          fileType: uploadRes.fileType || item.fileType,
          fileSize: typeof uploadRes.size === 'number' ? formatFileSize(uploadRes.size) : uploadRes.size,
          coverUrl: coverUrl || undefined,
          ...batchPaidPatch,
        });
        if (!updateRes.success) {
          throw new Error(updateRes.error || 'Failed to update catalog entry.');
        }
      } else {
        const addRes = await api.addBook({
          title: finalTitle,
          originalFilename: item.originalFilename,
          author: item.author || batchAuthor.trim() || undefined,
          description: item.description || batchDescription.trim() || undefined,
          folderId: targetFolderId,
          subfolderId: targetSubfolderId,
          fileUrl: uploadRes.fileUrl,
          fileType: uploadRes.fileType || item.fileType,
          fileSize: typeof uploadRes.size === 'number' ? formatFileSize(uploadRes.size) : uploadRes.size,
          coverUrl: coverUrl || undefined,
          tags: batchTags.trim() ? batchTags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
          ...batchPaidPatch,
        });

        if (!addRes.success) {
          throw new Error(addRes.error || 'Failed to save book to catalog.');
        }
      }
    }

    // Mark item as successful
    setQueue((prev) =>
      prev.map((q) =>
        q.id === item.id
          ? {
              ...q,
              status: 'success',
              progress: 100,
              loadedBytes: item.sizeBytes,
              coverUrl,
              catalogSaved: true,
            }
          : q
      )
    );

    // Asynchronously extract PDF cover thumbnail in background (Non-blocking!)
    if (item.fileType === 'pdf' && !coverUrl) {
      extractPdfCover(item.file)
        .then((pdfCover) => {
          if (pdfCover) {
            setQueue((prev) =>
              prev.map((q) => (q.id === item.id ? { ...q, coverUrl: pdfCover, previewUrl: pdfCover } : q))
            );
          }
        })
        .catch(() => {});
    }

    return true;
  };

  // Controlled Concurrent Batch Queue Worker
  // 2 simultaneous files by default (each file already uploads 3 chunks
  // in parallel, so 2 files = 6 requests in flight). 4 files x 3 parts =
  // 12 concurrent uploads starved a phone uplink and made every file
  // slow; scale up to 3 only when the network proves fast and error-free.
  const startUpload = async () => {
    if (queue.length === 0) return;
    if (batchPaid.isPaid && !(typeof batchPaid.price === 'number' && batchPaid.price > 0)) {
      setGeneralError('Set a price in ₹ for the paid books before uploading.');
      return;
    }
    setIsUploading(true);
    setGeneralError('');
    cancelledRef.current = false;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const pendingItems = queue.filter(
      (q) => q.status === 'ready' || q.status === 'error'
    );

    let currentConcurrency = 2;
    let nextIndex = 0;
    let successCount = 0;
    let failureCount = 0;

    const worker = async () => {
      while (nextIndex < pendingItems.length) {
        if (cancelledRef.current || signal.aborted) break;
        const currentItem = pendingItems[nextIndex];
        nextIndex++;

        try {
          await uploadSingleItem(currentItem, signal);
          successCount++;
          // Scale concurrency to 3 if network is fast and error-free
          if (successCount >= 2 && failureCount === 0 && currentConcurrency < 3) {
            currentConcurrency = Math.min(3, currentConcurrency + 1);
          }
        } catch (err: any) {
          failureCount++;
          if (currentConcurrency > 2) {
            currentConcurrency = Math.max(2, currentConcurrency - 1);
          }
          if (!signal.aborted) {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === currentItem.id
                  ? { ...q, status: 'error', progress: 0, loadedBytes: 0, errorMsg: err.message || 'Upload failed' }
                  : q
              )
            );
          }
        }
      }
    };

    const workers: Promise<void>[] = [];
    const initialWorkers = Math.min(currentConcurrency, pendingItems.length);
    for (let i = 0; i < initialWorkers; i++) {
      workers.push(worker());
    }

    await Promise.all(workers);

    setIsUploading(false);
    await appState.loadCatalog();
  };

  const handleRetryItem = async (id: string) => {
    const item = queue.find((q) => q.id === id);
    if (!item) return;

    if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
      abortControllerRef.current = new AbortController();
    }
    const signal = abortControllerRef.current.signal;

    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'ready', progress: 0, loadedBytes: 0, errorMsg: undefined } : q))
    );

    try {
      await uploadSingleItem(item, signal);
    } catch (err: any) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, status: 'error', progress: 0, loadedBytes: 0, errorMsg: err.message || 'Upload failed' }
            : q
        )
      );
    }
    await appState.loadCatalog();
  };

  const cancelRemaining = () => {
    cancelledRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploading(false);
  };

  const handleDone = async () => {
    await appState.loadCatalog();
    onUploaded();
    onClose();
  };

  // Byte-based progress calculations across entire batch
  const totalItems = queue.length;
  const completedCount = queue.filter((q) => q.status === 'success' || q.status === 'skipped').length;
  const failedCount = queue.filter((q) => q.status === 'error').length;
  const uploadingCount = queue.filter((q) => q.status === 'uploading').length;

  const totalBatchBytes = queue.reduce((sum, q) => sum + q.sizeBytes, 0);
  const totalLoadedBytes = queue.reduce((sum, q) => {
    if (q.status === 'success' || q.status === 'skipped') return sum + q.sizeBytes;
    return sum + (q.loadedBytes || 0);
  }, 0);

  const hasDuplicates = queue.some((q) => q.duplicateDetected && q.status === 'ready');
  const isFinished = totalItems > 0 && completedCount + failedCount === totalItems && !isUploading;
  const overallProgress = totalBatchBytes > 0 ? Math.min(100, Math.round((totalLoadedBytes / totalBatchBytes) * 100)) : 0;

  // Render format icon or preview
  const renderItemIcon = (item: UploadQueueItem) => {
    if (item.coverUrl || item.previewUrl) {
      return (
        <img
          src={item.coverUrl || item.previewUrl}
          alt={item.title}
          className="w-10 h-10 object-cover rounded border border-[var(--border-main)] shrink-0 shadow-2xs"
        />
      );
    }

    const color = getTypeBadgeColor(item.fileType);
    let IconComponent = FileText;

    switch (item.fileType) {
      case 'pdf':
        IconComponent = FileText;
        break;
      case 'image':
        IconComponent = ImageIcon;
        break;
      case 'video':
        IconComponent = VideoIcon;
        break;
      case 'audio':
        IconComponent = AudioIcon;
        break;
      case 'archive':
        IconComponent = ArchiveIcon;
        break;
      case 'document':
        IconComponent = FileText;
        break;
      default:
        IconComponent = FileText;
    }

    return (
      <div
        className={`w-10 h-10 rounded flex items-center justify-center border shrink-0 ${color.bg} ${color.border} ${color.text}`}
      >
        <IconComponent className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl max-w-2xl w-full p-5 sm:p-6 text-[var(--text-main)] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] shrink-0 shadow-2xs">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[var(--text-main)] leading-tight">
                Upload Files
              </h3>
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                <span>Destination:</span>
                <span className="font-semibold text-[var(--gold)] flex items-center gap-1">
                  <FolderIcon className="w-3.5 h-3.5 inline text-[var(--gold)]" />
                  {getDestinationPath()}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">

          {generalError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Local uploads are temporary while Google Drive is not
              connected: the live site stores them in serverless /tmp, so
              the books can stop opening later. Paste Drive links below
              instead — those always work, the file stays in Drive. */}
          {driveConfigured === false && (
            <div className="p-3 bg-amber-400/10 border border-amber-400/40 text-amber-200 rounded-lg text-xs leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Google Drive is not connected yet, so files uploaded from this device are only stored temporarily on the live site and may stop opening later. For books that must keep working, paste Google Drive links below instead.
              </span>
            </div>
          )}

          {/* Drag & Drop Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 sm:p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-[var(--gold)] bg-[var(--gold-faint)]/20 scale-[0.99]'
                : 'border-[var(--border-main)] bg-[var(--bg-main)] hover:border-[var(--gold)]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.rtf,.odt,.ods,.odp,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.webm,.mov,.mkv,.avi,.mp3,.wav,.m4a,.ogg,.zip,.rar,.7z,.tar,.gz"
            />
            <div className="space-y-1.5">
              <Upload className="w-8 h-8 text-[var(--gold)] mx-auto opacity-90" />
              <p className="font-bold text-xs sm:text-sm text-[var(--text-main)]">
                Drag & drop files here or click to select
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Supports batch uploading multiple PDFs, Documents, Images, Media & Archives
              </p>
              <p className="text-[10px] font-semibold text-[var(--gold)]">
                High-speed parallel uploads • Resumable multipart for large files (4MB+)
              </p>
            </div>
          </div>

          {/* Quick URL Import Link */}
          {onOpenUrlImport && queue.length === 0 && !isUploading && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[var(--bg-main)]/70 border border-[var(--border-main)] rounded-xl text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-4 h-4 text-[var(--gold)] shrink-0" />
                <span className="text-[var(--text-muted)] truncate">
                  Have a direct file URL instead of downloading locally?
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUrlImport();
                }}
                className="px-3 py-1 bg-[var(--gold-faint)] hover:bg-[var(--gold)]/25 text-[var(--gold)] border border-[var(--gold)]/35 rounded-md font-semibold transition-colors cursor-pointer shrink-0"
              >
                Import from URL
              </button>
            </div>
          )}

          {/* Duplicate Batch Options */}
          {hasDuplicates && !isUploading && (
            <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-lg text-xs space-y-2 text-amber-300">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Some files already exist in this folder.</span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-amber-200/80">Batch action:</span>
                  <button
                    type="button"
                    onClick={() => applyGlobalDuplicateAction('skip')}
                    className="px-2 py-0.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 rounded font-medium cursor-pointer"
                  >
                    Skip All
                  </button>
                  <button
                    type="button"
                    onClick={() => applyGlobalDuplicateAction('replace')}
                    className="px-2 py-0.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 rounded font-medium cursor-pointer"
                  >
                    Replace All
                  </button>
                  <button
                    type="button"
                    onClick={() => applyGlobalDuplicateAction('keep_both')}
                    className="px-2 py-0.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 rounded font-medium cursor-pointer"
                  >
                    Keep Both All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paste Drive links — no file upload at all for these */}
          <div className="border border-[var(--border-main)] rounded-lg p-3 bg-[var(--bg-main)] space-y-2 text-xs">
            <label className="block font-semibold text-[var(--text-main)]">
              Or paste Google Drive links — one per line, no upload needed
            </label>
            <textarea
              rows={2}
              value={driveLinksText}
              onChange={(e) => setDriveLinksText(e.target.value)}
              placeholder={'https://drive.google.com/file/d/... \nhttps://drive.google.com/file/d/...'}
              className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs focus:outline-none focus:border-[var(--gold)] resize-y"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--text-muted)]">
                Only the link is saved — the file stays in Drive. Give each link a title in the list below.
              </span>
              <button
                type="button"
                onClick={addDriveLinks}
                disabled={driveLinksText.trim().length === 0 || isUploading}
                className="px-3 py-1 bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)] font-semibold rounded text-[11px] hover:bg-[var(--gold)] hover:text-black transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                Add links
              </button>
            </div>
          </div>

          {/* Optional Batch Metadata Collapsible */}
          {queue.length > 0 && (
            <div className="border border-[var(--border-main)] rounded-lg p-3 bg-[var(--bg-main)] space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setShowBatchMetadata(!showBatchMetadata)}
                className="w-full flex items-center justify-between text-left font-semibold text-[var(--text-main)] cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Batch Metadata Options (Optional)</span>
                </span>
                <span className="text-[11px] text-[var(--gold)] font-normal">
                  {showBatchMetadata ? 'Hide' : 'Show'}
                </span>
              </button>

              {showBatchMetadata && (
                <div className="pt-2 space-y-3 border-t border-[var(--border-subtle)] animate-fade-in">
                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                      Paid for the whole batch (optional)
                    </label>
                    <PaidBookControl
                      book={batchPaid}
                      onChange={(patch) => setBatchPaid((prev) => ({ ...prev, ...patch }))}
                    />
                    <p className="text-[11px] text-[var(--text-faint)] mt-1">
                      One price applies to every book in this batch. Payment is by UPI; you unlock access by hand.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                      Batch Author / Scholar
                    </label>
                    <input
                      type="text"
                      value={batchAuthor}
                      onChange={(e) => setBatchAuthor(e.target.value)}
                      placeholder="e.g. Imam Al-Ghazali..."
                      className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                      Batch Description
                    </label>
                    <input
                      type="text"
                      value={batchDescription}
                      onChange={(e) => setBatchDescription(e.target.value)}
                      placeholder="Notes or description applied across batch..."
                      className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={applyBatchMetadata}
                      className="px-3 py-1 bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)] font-semibold rounded text-[11px] hover:bg-[var(--gold)] hover:text-black transition-colors cursor-pointer"
                    >
                      Apply to Queue
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Queue Summary & Overall Progress */}
          {queue.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <span>{queue.length} {queue.length === 1 ? 'file' : 'files'} selected</span>
                  {completedCount > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {completedCount} uploaded
                    </span>
                  )}
                </span>
                {isUploading && (
                  <span className="text-[11px] font-semibold text-[var(--gold)]">
                    Uploading {uploadingCount > 0 ? `${uploadingCount} active` : ''} ({completedCount + 1} of {totalItems}) • {overallProgress}%
                  </span>
                )}
              </div>

              {/* Overall Progress Bar */}
              {(isUploading || isFinished) && (
                <div className="space-y-1">
                  <div className="w-full h-2 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-main)]">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--gold-dark)] via-[var(--gold)] to-emerald-400 transition-all duration-200"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>Overall Progress ({formatFileSize(totalLoadedBytes)} / {formatFileSize(totalBatchBytes)})</span>
                    <span>{overallProgress}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Queue Items List */}
          {queue.length > 0 && (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {queue.map((item) => {
                const badge = getTypeBadgeColor(item.fileType);
                const label = getTypeLabel(item.fileType, item.originalFilename);

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border text-xs space-y-2 transition-all ${
                      item.status === 'error'
                        ? 'border-rose-500/40 bg-rose-500/5'
                        : item.status === 'success'
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-[var(--border-main)] bg-[var(--bg-main)]'
                    }`}
                  >
                    {/* Item Row Top */}
                    <div className="flex items-start gap-3">
                      {renderItemIcon(item)}

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-[var(--text-muted)] truncate" title={item.originalFilename}>
                            {item.originalFilename}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-faint)] shrink-0">
                            {item.fileSize}
                          </span>
                        </div>

                        {/* Editable Website Display Title */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.title}
                            disabled={isUploading || item.status === 'success'}
                            onChange={(e) => updateItemTitle(item.id, e.target.value)}
                            placeholder="Website Title..."
                            className="w-full px-2.5 py-1 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs font-medium focus:outline-none focus:border-[var(--gold)] disabled:opacity-75"
                          />
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${badge.bg} ${badge.border} ${badge.text}`}>
                            {label}
                          </span>
                        </div>
                      </div>

                      {/* Remove item button */}
                      {!isUploading && item.status !== 'success' && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[var(--text-muted)] hover:text-rose-400 p-1 rounded transition-colors cursor-pointer shrink-0"
                          title="Remove from queue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Duplicate Warning & Radio Options */}
                    {item.duplicateDetected && item.status === 'ready' && !isUploading && (
                      <div className="p-2 bg-amber-400/10 border border-amber-400/30 rounded text-[11px] space-y-1 text-amber-300">
                        <p className="font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                          <span>File with this title or name already exists in destination.</span>
                        </p>
                        <div className="flex items-center gap-3 pt-0.5">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`dup-${item.id}`}
                              checked={item.duplicateAction === 'skip'}
                              onChange={() => updateDuplicateAction(item.id, 'skip')}
                              className="accent-[var(--gold)]"
                            />
                            <span>Skip</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`dup-${item.id}`}
                              checked={item.duplicateAction === 'replace'}
                              onChange={() => updateDuplicateAction(item.id, 'replace')}
                              className="accent-[var(--gold)]"
                            />
                            <span>Replace</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`dup-${item.id}`}
                              checked={item.duplicateAction === 'keep_both'}
                              onChange={() => updateDuplicateAction(item.id, 'keep_both')}
                              className="accent-[var(--gold)]"
                            />
                            <span>Keep Both</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Status & Per-file Progress Footer */}
                    <div className="flex items-center justify-between pt-0.5 text-[11px]">
                      {item.status === 'ready' && (
                        <span className="text-[var(--text-muted)] font-medium">Waiting</span>
                      )}

                      {item.status === 'uploading' && (
                        <div className="w-full space-y-1">
                          <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                            <div
                              className="bg-[var(--gold)] h-full transition-all duration-150"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--gold)]">
                            <span>Uploading {item.progress}%</span>
                            <span>{formatFileSize(item.loadedBytes)} / {item.fileSize}</span>
                          </div>
                        </div>
                      )}

                      {item.status === 'success' && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Uploaded successfully</span>
                        </span>
                      )}

                      {item.status === 'skipped' && (
                        <span className="text-[var(--text-muted)] font-semibold">
                          Skipped (Duplicate)
                        </span>
                      )}

                      {item.status === 'error' && (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-rose-400 font-medium truncate max-w-[220px]">
                            {item.errorMsg || 'Upload failed'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRetryItem(item.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold rounded text-[10px] transition-colors cursor-pointer"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-[var(--border-subtle)] shrink-0 text-xs font-medium">
          <div>
            {queue.length > 0 && !isUploading && !isFinished && (
              <button
                type="button"
                onClick={() => setQueue([])}
                className="text-[var(--text-muted)] hover:text-rose-400 text-xs cursor-pointer transition-colors"
              >
                Clear Queue
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isUploading ? (
              <button
                type="button"
                onClick={cancelRemaining}
                className="px-4 py-2 border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer font-semibold"
              >
                Cancel Remaining
              </button>
            ) : isFinished ? (
              <button
                type="button"
                onClick={handleDone}
                className="px-5 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Done ({completedCount} Uploaded)</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={startUpload}
                  disabled={queue.length === 0}
                  className="px-5 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-50 text-black font-bold rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>
                    Upload {queue.length > 0 ? `${queue.length} ${queue.length === 1 ? 'File' : 'Files'}` : 'Files'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
