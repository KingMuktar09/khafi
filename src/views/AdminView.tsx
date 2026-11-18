import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Folder as FolderIcon,
  FileText,
  Upload,
  LogOut,
  RefreshCw,
  FolderPlus,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  X,
  Move,
  Edit3,
  AlignLeft,
  Globe,
  Sparkles,
  QrCode,
  Wallet,
  IndianRupee,
  Key,
} from 'lucide-react';
import { appState } from '../state/appState';
import { api } from '../services/api';
import { extractPdfCover } from '../services/pdf';
import { Book, Folder, PaymentSettings } from '../types';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { LibraryStatsDashboard } from '../components/admin/LibraryStatsDashboard';
import { UploadFileModal } from '../components/folders/UploadFileModal';
import { ImportUrlModal } from '../components/admin/ImportUrlModal';
import { AiOrganizerModal } from '../components/admin/AiOrganizerModal';
import { router } from '../router/router';
import { MoveModal, isDescendantFolder } from '../components/admin/MoveModal';
import { ArrangeByTopic } from '../components/admin/ArrangeByTopic';
import { PaidBookControl } from '../components/admin/PaidBookControl';
import { BookKeysPanel } from '../components/admin/BookKeysPanel';
import { MaintenancePanel } from '../components/admin/MaintenancePanel';
import { QuickRenameModal } from '../components/admin/QuickRenameModal';
import { QuickDescriptionModal } from '../components/admin/QuickDescriptionModal';
import { AdminContextMenu } from '../components/admin/AdminContextMenu';
import { ActionMenuPortal } from '../components/ui/ActionMenuPortal';
import {
  detectFileType,
  getFileExtension,
  getItemType,
  getTypeLabel,
  getTypeBadgeColor,
  formatFileSize,
  extractDriveId,
} from '../utils/fileUtils';

export const AdminView: React.FC = () => {
  const isAuthenticated = appState.adminAuthenticated;
  const username = appState.adminUsername;

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Current folder selection in admin explorer
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [adminSearch, setAdminSearch] = useState('');

  // Modals state
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [initialBookState, setInitialBookState] = useState<Partial<Book> | null>(null);
  const [showAdvancedBook, setShowAdvancedBook] = useState(false);

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Partial<Folder> | null>(null);
  const [initialFolderState, setInitialFolderState] = useState<Partial<Folder> | null>(null);
  const [showAdvancedFolder, setShowAdvancedFolder] = useState(false);

  // Quick Modals
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

  const [batchUploadModalOpen, setBatchUploadModalOpen] = useState(false);
  const [importUrlModalOpen, setImportUrlModalOpen] = useState(false);
  const [aiOrganizerModalOpen, setAiOrganizerModalOpen] = useState(false);
  const [aiPendingCount, setAiPendingCount] = useState(0);

  // UPI payment settings (admin only). Empty by default; the admin fills in
  // their own UPI ID / QR. Nothing here is pre-filled with a real value.
  const [paySettings, setPaySettings] = useState<PaymentSettings>({ upiId: '', upiQrUrl: '', displayName: '' });
  const [paySaving, setPaySaving] = useState(false);
  const [payLoaded, setPayLoaded] = useState(false);
  const [payUploading, setPayUploading] = useState(false);
  // Payment settings stay open until the UPI ID is set, then collapse to one
  // line so they stop taking up space on every admin visit.
  const [showPaySettings, setShowPaySettings] = useState(false);

  // Gate key (admin only). The key is shared in the Instagram broadcast
  // channel; followers enter it on the gate to unlock. The key value is
  // never shown back here and never pre-filled — leave the field blank to
  // keep the current key.
  const [gateKeySet, setGateKeySet] = useState(false);
  const [gateKeyInput, setGateKeyInput] = useState('');
  const [gateChannelUrl, setGateChannelUrl] = useState('');
  const [gateRemoveKey, setGateRemoveKey] = useState(false);
  const [gateShowKey, setGateShowKey] = useState(false);
  const [gateSaving, setGateSaving] = useState(false);
  const [gateLoaded, setGateLoaded] = useState(false);

  // Poll AI pending proposals count on mount
  useEffect(() => {
    if (isAuthenticated) {
      api.getAiPendingProposals()
        .then((res) => {
          if (res?.proposals) {
            const pending = res.proposals.filter((p: any) => p.status === 'pending');
            setAiPendingCount(pending.length);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Load UPI payment settings when the admin signs in
  useEffect(() => {
    if (isAuthenticated && !payLoaded) {
      api.getPaymentSettings()
        .then((s) => {
          setPaySettings(s);
          setPayLoaded(true);
          // Open the section only when there is something to set up.
          setShowPaySettings(!s.upiId);
        })
        .catch(() => setPayLoaded(true));
    }
  }, [isAuthenticated, payLoaded]);

  // Load gate key settings when the admin signs in
  useEffect(() => {
    if (isAuthenticated && !gateLoaded) {
      api.getGateSettings()
        .then((s) => {
          setGateKeySet(s.keySet);
          setGateChannelUrl(s.channelUrl);
          setGateLoaded(true);
        })
        .catch(() => setGateLoaded(true));
    }
  }, [isAuthenticated, gateLoaded]);

  // Whether live Drive storage is connected. When it is not, a file
  // uploaded from this device is stored only temporarily on the live
  // site (Vercel serverless /tmp) and can stop opening later — the
  // upload form warns about that and points at Drive links instead.
  const [driveConfigured, setDriveConfigured] = useState<boolean | null>(null);
  useEffect(() => {
    if (isAuthenticated) {
      api.getLibraryStatus()
        .then((s) => setDriveConfigured(s.driveConfigured))
        .catch(() => setDriveConfigured(null));
    }
  }, [isAuthenticated]);

  // Drive sync (admin only): rebuild the catalog from a fresh live Drive
  // listing. Shows the result (folders/books added) or a clear error when
  // Drive is not configured yet.
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncOk, setSyncOk] = useState<boolean | null>(null);

  const handleSavePaymentSettings = async () => {
    setPaySaving(true);
    const res = await api.savePaymentSettings(paySettings);
    setPaySaving(false);
    if (res.success) {
      appState.showToast(`Payment settings saved. ${durableSuffix(res)}`, durableToastType(res));
    } else {
      appState.showToast(res.error || 'Failed to save payment settings.', 'error');
    }
  };

  const handleSaveGateSettings = async () => {
    setGateSaving(true);
    const res = await api.saveGateSettings({
      gateKey: gateKeyInput.trim() ? gateKeyInput.trim() : undefined,
      channelUrl: gateChannelUrl,
      removeKey: gateRemoveKey,
    });
    setGateSaving(false);
    if (res.success) {
      setGateKeyInput('');
      setGateRemoveKey(false);
      if (typeof res.keySet === 'boolean') setGateKeySet(res.keySet);
      if (typeof res.channelUrl === 'string') setGateChannelUrl(res.channelUrl);
      appState.showToast(`Gate settings saved. ${durableSuffix(res)}`, durableToastType(res));
    } else {
      appState.showToast(res.error || 'Failed to save gate settings.', 'error');
    }
  };

  // Sync now: ask the server to rebuild the catalog from Google Drive
  // (live listing, deep folders included) and reload the library.
  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncMessage('');
    setSyncOk(null);
    try {
      const res = await api.syncWithDrive();
      if (res.success) {
        setSyncOk(true);
        setSyncMessage(
          `Synced with Drive: ${res.folders ?? 0} folders, ${res.books ?? 0} books` +
          ` (${res.addedBooks ?? 0} new books, ${res.removedBooks ?? 0} removed). ` +
          (res.durable === true ? 'Saved permanently.' : 'Saved for now only — set GITHUB_SYNC_TOKEN in Vercel to keep it.')
        );
        await appState.loadCatalog();
      } else {
        setSyncOk(false);
        setSyncMessage(res.error || 'Drive sync failed.');
      }
    } catch (err: any) {
      setSyncOk(false);
      setSyncMessage(err?.message || 'Drive sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  const handleQrUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      appState.showToast('Please choose an image file for the QR code.', 'error');
      return;
    }
    setPayUploading(true);
    const res = await api.uploadFile(file);
    setPayUploading(false);
    if (res.success && res.fileUrl) {
      setPaySettings((prev) => ({ ...prev, upiQrUrl: res.fileUrl || '' }));
      appState.showToast('QR image uploaded. Save payment settings to keep it.', 'success');
    } else {
      appState.showToast(res.error || 'QR upload failed. You can paste an image link instead.', 'error');
    }
  };

  // Unsaved changes warning confirmation
  const [unsavedWarning, setUnsavedWarning] = useState<{
    open: boolean;
    onDiscard: () => void;
  }>({ open: false, onDiscard: () => {} });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: 'book' | 'folder' | 'category' | 'bulk';
    id: string;
    title: string;
    message: string;
    isBlocked: boolean;
  }>({
    open: false,
    type: 'book',
    id: '',
    title: '',
    message: '',
    isBlocked: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk Selection
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<{ type: 'folder' | 'book'; id: string } | null>(
    null
  );
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    type: 'folder' | 'book';
    item: Folder | Book;
  } | null>(null);

  // Three-dot dropdown menu open row key
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);
  const menuButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [uploading, setUploading] = useState(false);
  // Real upload progress for the single-book form (percent + MB), so the
  // admin is never stuck watching a bare spinner. Null when not uploading.
  const [uploadProgress, setUploadProgress] = useState<{
    loadedBytes: number;
    totalBytes: number;
    percentage: number;
  } | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);

  // Bulk paid: mark several selected books paid at once with ONE price.
  const [bulkPaidModalOpen, setBulkPaidModalOpen] = useState(false);
  const [bulkPaidState, setBulkPaidState] = useState<Partial<Book>>({ isPaid: true });

  // Close open row menus when clicking anywhere
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuKey(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Keyboard Shortcuts (Esc, Delete, Ctrl+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input, textarea, or select
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT';

      if (e.key === 'Escape') {
        setActiveMenuKey(null);
        setContextMenu(null);
        if (selectedKeys.size > 0 && !isInput) {
          setSelectedKeys(new Set());
        }
      }

      if (e.key === 'Delete' && !isInput && selectedKeys.size > 0) {
        openDeleteModalForBulk();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && !isInput) {
        e.preventDefault();
        const allKeys = new Set<string>();
        currentChildFolders.forEach((f) => allKeys.add(`folder:${f.id}`));
        currentBooks.forEach((b) => allKeys.add(`book:${b.id}`));
        setSelectedKeys(allKeys);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKeys]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const res = await api.loginAdmin(loginUser, loginPass);
    setIsLoggingIn(false);

    if (res.success) {
      await appState.checkAdmin();
      await appState.loadCatalog();
      appState.showToast('Admin authenticated.', 'success');
      setLoginUser('');
      setLoginPass('');
    } else {
      setLoginError(res.error || 'Authentication failed.');
    }
  };

  const handleLogout = async () => {
    await api.logoutAdmin();
    await appState.checkAdmin();
    appState.showToast('Logged out of admin area.', 'info');
  };

  // UNAUTHENTICATED: Simple Sign In Box
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 animate-fade-in font-sans">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-6 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="font-bold text-xl text-[var(--text-main)]">Admin Sign In</h1>
            <p className="text-xs text-[var(--text-muted)]">
              Enter administrator credentials to manage library files and folders.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 dark:bg-red-950/50 border border-red-500/30 text-xs text-red-700 dark:text-red-200 font-medium rounded">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[var(--text-muted)] mb-1 font-medium">Username</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-sm font-sans"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] mb-1 font-medium">Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-sm font-sans"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold text-xs rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED: File Manager Style Admin View
  const folders = appState.catalog.folders || [];
  const books = appState.catalog.books || [];

  const currentFolder = selectedFolderId ? appState.getFolderById(selectedFolderId) : null;

  // Filter child folders and books for current selected folder + optional search filter
  let currentChildFolders = folders.filter((f) => f.parentId === selectedFolderId);
  let currentBooks = books.filter(
    (b) => b.folderId === selectedFolderId || (!selectedFolderId && !b.folderId)
  );

  if (adminSearch.trim()) {
    const q = adminSearch.toLowerCase();
    currentChildFolders = currentChildFolders.filter(
      (f) => f.name.toLowerCase().includes(q) || (f.description && f.description.toLowerCase().includes(q))
    );
    currentBooks = currentBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q))
    );
  }

  // Unsaved changes check helper
  const isBookModified = () => {
    if (!editingBook || !initialBookState) return false;
    return JSON.stringify(editingBook) !== JSON.stringify(initialBookState);
  };

  const isFolderModified = () => {
    if (!editingFolder || !initialFolderState) return false;
    return JSON.stringify(editingFolder) !== JSON.stringify(initialFolderState);
  };

  const handleCloseBookModal = () => {
    if (isBookModified()) {
      setUnsavedWarning({
        open: true,
        onDiscard: () => {
          setBookModalOpen(false);
          setEditingBook(null);
          setInitialBookState(null);
        },
      });
    } else {
      setBookModalOpen(false);
      setEditingBook(null);
      setInitialBookState(null);
    }
  };

  const handleCloseFolderModal = () => {
    if (isFolderModified()) {
      setUnsavedWarning({
        open: true,
        onDiscard: () => {
          setFolderModalOpen(false);
          setEditingFolder(null);
          setInitialFolderState(null);
        },
      });
    } else {
      setFolderModalOpen(false);
      setEditingFolder(null);
      setInitialFolderState(null);
    }
  };

  // Save-state line shown after every admin save. "Saved permanently" means
  // the change was also committed to GitHub main (durable). Anything else —
  // including an old server that sends no flag — is "Saved for now only":
  // it lives only on this server instance and will vanish on redeploy until
  // GITHUB_SYNC_TOKEN is set in Vercel.
  const durableSuffix = (res: { durable?: boolean; durableWarning?: string }) =>
    res.durable === true
      ? 'Saved permanently.'
      : 'Saved for now only — set GITHUB_SYNC_TOKEN in Vercel to keep it.';
  const durableToastType = (res: { durable?: boolean }) =>
    res.durable === true ? 'success' as const : 'info' as const;

  // Save Handlers
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editingBook.title || !editingBook.author) {
      appState.showToast('Title and author are required.', 'error');
      return;
    }

    // A paid book needs no price anymore (paid books are free for
    // followers). A free book must not keep stale paid data (price /
    // payment link / note) from when it was paid before.

    const folderIdToSet = editingBook.folderId || selectedFolderId || (folders[0]?.id || null);
    const targetFolder = folders.find((f) => f.id === folderIdToSet);

    // Category is the admin's organising label, NOT the folder name: keep
    // what the admin typed, and only fall back to the folder name when
    // the category was left blank (e.g. a fresh upload).
    const bookPayload: Record<string, unknown> = {
      ...editingBook,
      folderId: folderIdToSet,
      category:
        typeof editingBook.category === 'string' && editingBook.category.trim()
          ? editingBook.category.trim()
          : targetFolder
          ? targetFolder.name
          : 'General',
      topic:
        typeof editingBook.topic === 'string' ? editingBook.topic.trim() : editingBook.topic,
    };
    // Fast path: a pasted Drive link needs no file upload at all. Store the
    // Drive file id from the link so readers open the book straight from
    // Drive and the download/preview helpers can find it.
    if (!bookPayload.driveFileId && typeof bookPayload.externalUrl === 'string') {
      const driveId = extractDriveId(bookPayload.externalUrl);
      if (driveId) bookPayload.driveFileId = driveId;
    }
    if (!editingBook.isPaid) {
      // price: null (not undefined) so the server merge actually clears it.
      bookPayload.price = null;
      bookPayload.paymentLink = '';
      bookPayload.paymentNote = '';
    }

    if (editingBook.id) {
      const res = await api.updateBook(editingBook.id, bookPayload as Partial<Book>);
      if (res.success) {
        appState.showToast(`Book updated. ${durableSuffix(res)}`, durableToastType(res));
        setBookModalOpen(false);
        setEditingBook(null);
        setInitialBookState(null);
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to update book.', 'error');
      }
    } else {
      const res = await api.addBook(bookPayload as Partial<Book>);
      if (res.success) {
        appState.showToast(`Book added to library. ${durableSuffix(res)}`, durableToastType(res));
        setBookModalOpen(false);
        setEditingBook(null);
        setInitialBookState(null);
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to add book.', 'error');
      }
    }
  };

  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFolder || !editingFolder.name) {
      appState.showToast('Folder name is required.', 'error');
      return;
    }

    const payload: Partial<Folder> = {
      name: editingFolder.name,
      description: editingFolder.description || '',
      parentId: editingFolder.parentId ?? null,
      type: editingFolder.type || (editingFolder.parentId ? 'subfolder' : 'category'),
      sortOrder: editingFolder.sortOrder !== undefined ? Number(editingFolder.sortOrder) : undefined,
      visible: editingFolder.visible !== false,
    };

    if (editingFolder.id) {
      const res = await api.updateFolder(editingFolder.id, payload);
      if (res.success) {
        appState.showToast(`Folder updated. ${durableSuffix(res)}`, durableToastType(res));
        setFolderModalOpen(false);
        setEditingFolder(null);
        setInitialFolderState(null);
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to update folder.', 'error');
      }
    } else {
      const res = await api.addFolder(payload);
      if (res.success) {
        appState.showToast(`Folder created. ${durableSuffix(res)}`, durableToastType(res));
        setFolderModalOpen(false);
        setEditingFolder(null);
        setInitialFolderState(null);
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to create folder.', 'error');
      }
    }
  };

  // Quick Action Handlers
  const handleToggleFolderVisibility = async (folder: Folder) => {
    const newVisible = !(folder.visible !== false);
    const res = await api.updateFolder(folder.id, { visible: newVisible });
    if (res.success) {
      appState.showToast(`Folder "${folder.name}" is now ${newVisible ? 'public' : 'hidden'}. ${durableSuffix(res)}`, durableToastType(res));
      await appState.loadCatalog();
    } else {
      appState.showToast(res.error || 'Failed to update visibility.', 'error');
    }
  };

  const handleToggleBookVisibility = async (book: Book) => {
    const newVisible = !(book.visible !== false);
    const res = await api.updateBook(book.id, { visible: newVisible });
    if (res.success) {
      appState.showToast(`Book "${book.title}" is now ${newVisible ? 'public' : 'hidden'}. ${durableSuffix(res)}`, durableToastType(res));
      await appState.loadCatalog();
    } else {
      appState.showToast(res.error || 'Failed to update visibility.', 'error');
    }
  };

  // One-click paid toggle from the book list. Paid -> free right away.
  // Free -> paid right away too: a paid book needs no price anymore
  // (paid books are free for followers), so no price is ever invented.
  const handleTogglePaid = async (book: Book) => {
    if (book.isPaid) {
      const res = await api.updateBook(book.id, {
        isPaid: false,
        price: null as unknown as number,
        paymentLink: '',
        paymentNote: '',
      });
      if (res.success) {
        appState.showToast(`"${book.title}" is now free. ${durableSuffix(res)}`, durableToastType(res));
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to make this book free.', 'error');
      }
      return;
    }

    const res = await api.updateBook(book.id, { isPaid: true });
    if (res.success) {
      appState.showToast(`"${book.title}" is now paid — free for followers. ${durableSuffix(res)}`, durableToastType(res));
      await appState.loadCatalog();
    } else {
      appState.showToast(res.error || 'Failed to mark this book as paid.', 'error');
    }
  };

  const handleQuickRenameSave = async (newName: string) => {
    const { type, id } = renameModal;
    if (type === 'folder') {
      const res = await api.updateFolder(id, { name: newName });
      if (res.success) {
        appState.showToast('Folder renamed.', 'success');
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to rename folder.', 'error');
      }
    } else {
      const res = await api.updateBook(id, { title: newName });
      if (res.success) {
        appState.showToast('Book title updated.', 'success');
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to rename book.', 'error');
      }
    }
    setRenameModal({ open: false, type: 'folder', id: '', initialName: '' });
  };

  const handleQuickDescriptionSave = async (newDesc: string) => {
    const { id } = descModal;
    const res = await api.updateFolder(id, { description: newDesc });
    if (res.success) {
      appState.showToast('Description updated.', 'success');
      await appState.loadCatalog();
    } else {
      appState.showToast(res.error || 'Failed to update description.', 'error');
    }
    setDescModal({ open: false, id: '', title: '', initialDescription: '' });
  };

  const handleMoveConfirm = async (targetFolderId: string | null) => {
    const { type, id } = moveModal;
    if (type === 'folder') {
      const newType = targetFolderId ? 'subfolder' : 'category';
      const res = await api.updateFolder(id, { parentId: targetFolderId, type: newType });
      if (res.success) {
        appState.showToast('Folder moved.', 'success');
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to move folder.', 'error');
      }
    } else {
      const targetFolder = folders.find((f) => f.id === targetFolderId);
      const res = await api.updateBook(id, {
        folderId: targetFolderId,
        category: targetFolder ? targetFolder.name : 'General',
      });
      if (res.success) {
        appState.showToast('Book moved.', 'success');
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to move book.', 'error');
      }
    }
    setMoveModal({ open: false, type: 'folder', id: '', title: '', currentParentId: null });
  };

  const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      appState.showToast('File is too large. Maximum file size is 500 MB.', 'error');
      return;
    }
    const abortController = new AbortController();
    uploadAbortRef.current = abortController;
    setUploading(true);
    setUploadProgress({ loadedBytes: 0, totalBytes: file.size, percentage: 0 });
    appState.showToast(`Uploading ${file.name}...`, 'info');

    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();

    // Files over 4 MB go up in small 4 MB chunks (see src/utils/uploader.ts)
    // because Vercel rejects any single request bigger than 4.5 MB. Progress
    // is wired up here — the old code never passed a progress callback, so
    // the admin only ever saw a bare spinner while a big file stalled.
    const uploadRes = await api.uploadFile(
      file,
      (p) => setUploadProgress(p),
      abortController.signal,
      editingBook?.folderId || selectedFolderId || undefined
    );
    setUploading(false);
    setUploadProgress(null);
    uploadAbortRef.current = null;

    if (uploadRes.success && uploadRes.fileUrl) {
      const detectedType = uploadRes.fileType || detectFileType(file.name, file.type);
      appState.showToast(`${file.name} uploaded successfully.`, 'success');

      // Fill the form in straight away so the admin can keep working. The
      // cover page used to be extracted before the form was filled in, and
      // parsing a big PDF in the browser can take a long while — now it runs
      // in the background and the cover is added when it is ready.
      setEditingBook((prev) => ({
        ...prev,
        title: prev?.title || cleanTitle,
        originalFilename: file.name,
        pdfUrl: uploadRes.fileUrl,
        fileUrl: uploadRes.fileUrl,
        driveFileId: uploadRes.driveFileId || prev?.driveFileId,
        fileType: detectedType,
        mimeType: uploadRes.mimeType || file.type,
        fileSize: String(uploadRes.size || file.size || prev?.fileSize || ''),
        coverUrl: detectedType === 'image' ? uploadRes.fileUrl : prev?.coverUrl,
      }));
      if (detectedType === 'pdf') {
        extractPdfCover(file)
          .then((generatedCover) => {
            if (generatedCover) {
              setEditingBook((prev) => (prev ? { ...prev, coverUrl: generatedCover } : prev));
            }
          })
          .catch(() => {});
      }
    } else {
      if (abortController.signal.aborted) {
        appState.showToast('Upload cancelled.', 'info');
      } else {
        appState.showToast(uploadRes.error || 'Upload failed.', 'error');
      }
    }
  };

  // Delete modal triggers with safety checks
  const openDeleteModalForBook = (b: Book) => {
    setDeleteConfirm({
      open: true,
      type: 'book',
      id: b.id,
      title: 'Remove From Library?',
      message: `Remove from the library catalog:\n\n"${b.title}"\n\nThis removes the book from the catalog only. The file in Google Drive is NOT deleted — delete it separately in Drive if you ever want it gone.`,
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

  const openDeleteModalForBulk = () => {
    setDeleteConfirm({
      open: true,
      type: 'bulk',
      id: 'bulk',
      title: 'Delete Selected Items?',
      message: `Are you sure you want to delete ${selectedKeys.size} selected items? This action cannot be undone.`,
      isBlocked: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (isDeleting || deleteConfirm.isBlocked) return;
    setIsDeleting(true);

    try {
      if (deleteConfirm.type === 'bulk') {
        let count = 0;
        let hasError = false;
        for (const key of selectedKeys) {
          const [kind, id] = key.split(':');
          if (kind === 'book') {
            const res = await api.deleteBook(id);
            if (res.success) count++;
            else hasError = true;
          } else if (kind === 'folder') {
            const res = await api.deleteFolder(id);
            if (res.success) count++;
            else hasError = true;
          }
        }
        setSelectedKeys(new Set());
        if (hasError) {
          appState.showToast(`Deleted ${count} items. Some items could not be deleted.`, 'error');
        } else {
          appState.showToast(`Deleted ${count} items.`, 'success');
        }
        await appState.loadCatalog();
        setDeleteConfirm((prev) => ({ ...prev, open: false }));
      } else if (deleteConfirm.type === 'book') {
        const res = await api.deleteBook(deleteConfirm.id);
        if (res.success) {
          appState.showToast('Removed from the library catalog. The Drive file was not deleted.', 'success');
          await appState.loadCatalog();
          setDeleteConfirm((prev) => ({ ...prev, open: false }));
        } else {
          console.error('Delete book error:', res.error);
          appState.showToast(res.error || 'Unable to delete this item.', 'error');
        }
      } else {
        const res = await api.deleteFolder(deleteConfirm.id);
        if (res.success) {
          appState.showToast('Folder deleted successfully.', 'success');
          if (selectedFolderId === deleteConfirm.id) {
            setSelectedFolderId(null);
          }
          await appState.loadCatalog();
          setDeleteConfirm((prev) => ({ ...prev, open: false }));
        } else {
          console.error('Delete folder error:', res.error);
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

  // Bulk Visibility Actions
  const handleBulkMakePublic = async () => {
    for (const key of selectedKeys) {
      const [kind, id] = key.split(':');
      if (kind === 'folder') await api.updateFolder(id, { visible: true });
      if (kind === 'book') await api.updateBook(id, { visible: true });
    }
    appState.showToast('Selected items made public.', 'success');
    setSelectedKeys(new Set());
    await appState.loadCatalog();
  };

  const handleBulkHide = async () => {
    for (const key of selectedKeys) {
      const [kind, id] = key.split(':');
      if (kind === 'folder') await api.updateFolder(id, { visible: false });
      if (kind === 'book') await api.updateBook(id, { visible: false });
    }
    appState.showToast('Selected items hidden.', 'info');
    setSelectedKeys(new Set());
    await appState.loadCatalog();
  };

  // Bulk paid: mark every selected BOOK paid at once with ONE price typed
  // once for the whole batch. No price is ever invented — the admin types
  // it in the small dialog first. Folders in the selection are ignored.
  const handleBulkMarkPaid = async () => {
    // No price needed: paid books are free for followers, the price (if
    // the admin set one) is kept for reference only.
    const bookIds = [...selectedKeys]
      .filter((k) => k.startsWith('book:'))
      .map((k) => k.slice('book:'.length));
    if (bookIds.length === 0) {
      appState.showToast('Select at least one book first.', 'error');
      return;
    }
    let ok = 0;
    let failed = 0;
    let anyTemporary = false;
    for (const id of bookIds) {
      const res = await api.updateBook(id, {
        isPaid: true,
        price: bulkPaidState.price,
        paymentNote: bulkPaidState.paymentNote || '',
      });
      if (res.success) {
        ok++;
        if (res.durable !== true) anyTemporary = true;
      } else failed++;
    }
    setBulkPaidModalOpen(false);
    setBulkPaidState({ isPaid: true });
    setSelectedKeys(new Set());
    await appState.loadCatalog();
    const saveLine = anyTemporary
      ? 'Saved for now only — set GITHUB_SYNC_TOKEN in Vercel to keep them.'
      : 'Saved permanently.';
    appState.showToast(
      failed > 0
        ? `${ok} book${ok === 1 ? '' : 's'} marked paid — free for followers. ${failed} could not be updated. ${saveLine}`
        : `${ok} book${ok === 1 ? '' : 's'} marked paid — free for followers. ${saveLine}`,
      failed > 0 ? 'error' : anyTemporary ? 'info' : 'success'
    );
  };

  // Bulk free: one click makes every selected paid book free again and
  // clears its price/note, same as the single-book "Make free" action.
  const handleBulkMakeFree = async () => {
    const bookIds = [...selectedKeys]
      .filter((k) => k.startsWith('book:'))
      .map((k) => k.slice('book:'.length));
    if (bookIds.length === 0) {
      appState.showToast('Select at least one book first.', 'error');
      return;
    }
    let ok = 0;
    let anyTemporary = false;
    for (const id of bookIds) {
      const res = await api.updateBook(id, {
        isPaid: false,
        price: null as unknown as number,
        paymentLink: '',
        paymentNote: '',
      });
      if (res.success) {
        ok++;
        if (res.durable !== true) anyTemporary = true;
      }
    }
    setSelectedKeys(new Set());
    await appState.loadCatalog();
    appState.showToast(
      `${ok} book${ok === 1 ? '' : 's'} made free. ${anyTemporary ? 'Saved for now only — set GITHUB_SYNC_TOKEN in Vercel to keep them.' : 'Saved permanently.'}`,
      anyTemporary ? 'info' : 'success'
    );
  };

  // Drag and Drop Handler
  const handleDropOnFolder = async (targetFolderId: string) => {
    if (!draggedItem) return;
    setDragOverFolderId(null);

    if (draggedItem.type === 'folder') {
      if (draggedItem.id === targetFolderId) return;
      if (isDescendantFolder(folders, draggedItem.id, targetFolderId)) {
        appState.showToast('Cannot move a folder into its own subfolder.', 'error');
        return;
      }
      const targetFolder = folders.find((f) => f.id === targetFolderId);
      const draggedObj = folders.find((f) => f.id === draggedItem.id);
      const res = await api.updateFolder(draggedItem.id, {
        parentId: targetFolderId,
        type: 'subfolder',
      });
      if (res.success) {
        appState.showToast(`Moved "${draggedObj?.name}" into "${targetFolder?.name}".`, 'success');
        await appState.loadCatalog();
      }
    } else {
      const targetFolder = folders.find((f) => f.id === targetFolderId);
      const draggedObj = books.find((b) => b.id === draggedItem.id);
      const res = await api.updateBook(draggedItem.id, {
        folderId: targetFolderId,
        category: targetFolder ? targetFolder.name : 'General',
      });
      if (res.success) {
        appState.showToast(`Moved "${draggedObj?.title}" into "${targetFolder?.name}".`, 'success');
        await appState.loadCatalog();
      }
    }
    setDraggedItem(null);
  };

  // Checkbox helpers
  const toggleKeySelection = (key: string) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedKeys(next);
  };

  const isAllVisibleSelected =
    currentChildFolders.length + currentBooks.length > 0 &&
    currentChildFolders.every((f) => selectedKeys.has(`folder:${f.id}`)) &&
    currentBooks.every((b) => selectedKeys.has(`book:${b.id}`));

  const toggleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      setSelectedKeys(new Set());
    } else {
      const next = new Set(selectedKeys);
      currentChildFolders.forEach((f) => next.add(`folder:${f.id}`));
      currentBooks.forEach((b) => next.add(`book:${b.id}`));
      setSelectedKeys(next);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in py-2 font-sans select-none sm:select-text">
      
      {/* Top Header */}
      <div className="flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-4">
        <div>
          <h1 className="font-bold text-xl text-[var(--text-main)]">Library Manager</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Signed in as <strong className="text-[var(--text-main)]">{username}</strong>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 bg-rose-950/20 border border-rose-500/20 hover:bg-rose-900/30 rounded transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Simple section menu — jump to what you need, no headache. */}
      <nav className="flex gap-2 flex-wrap items-center text-xs font-semibold" aria-label="Admin sections">
        <span className="text-[var(--text-muted)]">Jump to:</span>
        <a href="#admin-book-keys" className="px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--gold)] transition-colors">Book Keys</a>
        <a href="#admin-maintenance" className="px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--gold)] transition-colors">Maintenance</a>
        <a href="#admin-arrange" className="px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--gold)] transition-colors">Arrange Books</a>
        <a href="#admin-files" className="px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--gold)] transition-colors">All Books &amp; Files</a>
      </nav>

      {/* Library Analytics & Statistics Dashboard */}
      <LibraryStatsDashboard
        catalog={appState.catalog}
        onSelectFolder={(fId) => setSelectedFolderId(fId)}
        onOpenUploadModal={() => setBatchUploadModalOpen(true)}
        onOpenAiOrganizer={() => setAiOrganizerModalOpen(true)}
        aiPendingCount={aiPendingCount}
      />

      {/* Sync with Google Drive — admin only */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-5 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] shrink-0">
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">Sync with Google Drive</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Rebuilds the library from your Drive folder, deep folders included. New books you add to Drive show up here.
                The library also syncs itself once a day automatically.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={syncing}
            className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing…' : 'Sync now'}</span>
          </button>
        </div>
        {syncMessage && (
          <p className={`text-xs leading-relaxed rounded-lg px-3 py-2 border ${syncOk ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'}`}>
            {syncMessage}
          </p>
        )}
      </div>

      {/* Payment Settings (UPI) — admin only */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-5 space-y-4">
        <button
          type="button"
          onClick={() => setShowPaySettings((v) => !v)}
          className="w-full flex items-start gap-3 text-left cursor-pointer"
          aria-expanded={showPaySettings}
        >
          <div className="w-10 h-10 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">Payment settings — UPI</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {paySettings.upiId
                ? `UPI set: ${paySettings.upiId} — paid books show this at checkout.`
                : 'Not set yet — paid books will ask visitors to message @ghayb.chronicles instead.'}
            </p>
          </div>
          {showPaySettings ? (
            <ChevronUp className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-2" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-2" />
          )}
        </button>

        {showPaySettings && (
        <>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Only you see this. No payment gateway, no automatic check — after a visitor pays, you unlock their access by hand.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[var(--text-muted)] mb-1 font-medium text-xs">Display name for payment (optional)</label>
            <input
              type="text"
              value={paySettings.displayName}
              onChange={(e) => setPaySettings((prev) => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:border-[var(--gold)] text-sm"
              placeholder="Your name, as it should appear to payers"
            />
          </div>
          <div>
            <label className="block text-[var(--text-muted)] mb-1 font-medium text-xs">UPI ID</label>
            <input
              type="text"
              value={paySettings.upiId}
              onChange={(e) => setPaySettings((prev) => ({ ...prev, upiId: e.target.value }))}
              className="w-full px-3 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:border-[var(--gold)] text-sm"
              placeholder="Not set yet — enter your UPI ID"
            />
          </div>
        </div>

        <div>
          <label className="block text-[var(--text-muted)] mb-1 font-medium text-xs">UPI QR code</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-2">
              <input
                type="url"
                value={paySettings.upiQrUrl}
                onChange={(e) => setPaySettings((prev) => ({ ...prev, upiQrUrl: e.target.value }))}
                className="w-full px-3 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:border-[var(--gold)] text-sm"
                placeholder="Paste an image link for your UPI QR code"
              />
              <label className="tap-target inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/60 text-xs font-semibold cursor-pointer">
                <Upload className="w-4 h-4 text-[var(--gold)]" />
                <span>{payUploading ? 'Uploading…' : 'Or upload a QR image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleQrUpload(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
            <div className="w-full sm:w-36 shrink-0 flex items-start justify-center">
              {paySettings.upiQrUrl ? (
                <img
                  src={paySettings.upiQrUrl}
                  alt="UPI QR code preview"
                  className="w-32 h-32 object-contain rounded-xl border border-[var(--border-main)] bg-white p-2"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl border border-dashed border-[var(--border-main)] flex flex-col items-center justify-center gap-1 text-[var(--text-faint)]">
                  <QrCode className="w-6 h-6" />
                  <span className="text-[11px]">QR not set yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleSavePaymentSettings}
            disabled={paySaving}
            className="tap-target px-5 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-60 text-black font-bold text-sm rounded-xl cursor-pointer transition-all"
          >
            {paySaving ? 'Saving…' : 'Save payment settings'}
          </button>
          <p className="text-[11px] text-[var(--text-faint)]">
            {paySettings.upiId || paySettings.upiQrUrl
              ? 'Saved — visitors see these details on paid books.'
              : 'Fill in your UPI ID above, then save.'}
          </p>
        </div>
        </>
        )}
      </div>

      {/* Gate key — admin only */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">Gate key</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {gateKeySet
                ? 'A key is set — followers can unlock the gate with it.'
                : 'No key set yet — the key field on the gate is hidden.'}
            </p>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Share the key in your Instagram broadcast channel — followers enter it on the gate to unlock.
          The follow button still works too. The key never expires: once set, it keeps working until
          you change it or remove it here.
        </p>

        <div>
          <label className="block text-[var(--text-muted)] mb-1 font-medium text-xs">Key</label>
          <div className="flex gap-2">
            <input
              type={gateShowKey ? 'text' : 'password'}
              value={gateKeyInput}
              onChange={(e) => setGateKeyInput(e.target.value)}
              autoComplete="off"
              className="flex-1 min-w-0 px-3 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:border-[var(--gold)] text-sm"
              placeholder={gateKeySet ? 'Key is set — leave blank to keep it, or type a new key' : 'Type a key, e.g. ghayb-2026'}
            />
            <button
              type="button"
              onClick={() => setGateShowKey((v) => !v)}
              className="shrink-0 px-3 py-2.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
            >
              {gateShowKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
          <input
            type="checkbox"
            checked={gateRemoveKey}
            onChange={(e) => setGateRemoveKey(e.target.checked)}
            className="w-4 h-4 accent-[var(--gold)]"
          />
          <span>Remove the key — the key field on the gate will be hidden</span>
        </label>

        <div>
          <label className="block text-[var(--text-muted)] mb-1 font-medium text-xs">Broadcast channel link</label>
          <input
            type="url"
            value={gateChannelUrl}
            onChange={(e) => setGateChannelUrl(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:border-[var(--gold)] text-sm"
            placeholder="https://www.instagram.com/channel/…"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleSaveGateSettings}
            disabled={gateSaving}
            className="tap-target px-5 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-60 text-black font-bold text-sm rounded-xl cursor-pointer transition-all"
          >
            {gateSaving ? 'Saving…' : 'Save gate settings'}
          </button>
          <p className="text-[11px] text-[var(--text-faint)]">
            Only you see this. The key is never shown back to anyone.
          </p>
        </div>
      </div>

      {/* Admin Toolbar */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-3 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Breadcrumbs inside Admin Explorer */}
          <div className="flex items-center gap-2 min-w-0">
            {selectedFolderId && (
              <button
                onClick={() => setSelectedFolderId(currentFolder?.parentId || null)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)] rounded transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title="Go up to parent folder"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Up</span>
              </button>
            )}

            <div className="flex items-center gap-1 text-[var(--text-muted)] truncate">
              <button
                onClick={() => setSelectedFolderId(null)}
                className="hover:text-[var(--text-main)] font-medium cursor-pointer"
              >
                Library
              </button>
              {currentFolder && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
                  <span className="text-[var(--text-main)] font-semibold truncate">
                    {currentFolder.name}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const initial = {
                  name: '',
                  description: '',
                  parentId: selectedFolderId,
                  type: (selectedFolderId ? 'subfolder' : 'category') as any,
                  sortOrder: folders.length + 1,
                  visible: true,
                };
                setEditingFolder(initial);
                setInitialFolderState(initial);
                setShowAdvancedFolder(false);
                setFolderModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{selectedFolderId ? 'New Subfolder' : 'New Folder'}</span>
            </button>

            <button
              onClick={() => setBatchUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold rounded transition-colors cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Files</span>
            </button>

            <button
              onClick={() => setImportUrlModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded transition-colors cursor-pointer"
              title="Import remote files directly via URL"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Import from URL</span>
            </button>

            <button
              onClick={() => setAiOrganizerModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[var(--gold)]/10 via-[var(--bg-main)] to-purple-500/10 hover:from-[var(--gold)]/20 hover:to-purple-500/20 text-[var(--text-main)] border border-[var(--gold)]/40 rounded transition-colors cursor-pointer relative shadow-2xs"
              title="AI Library Organizer: Autonomous classification, deduplication & organization via NVIDIA NIM"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span className="font-semibold text-[var(--gold)]">AI Organizer</span>
              {aiPendingCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[var(--gold)] text-black rounded-full shadow-xs">
                  {aiPendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                const initial = {
                  title: '',
                  author: '',
                  description: '',
                  folderId: selectedFolderId || (folders[0]?.id || ''),
                  visible: true,
                };
                setEditingBook(initial);
                setInitialBookState(initial);
                setShowAdvancedBook(false);
                setBookModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Single Item</span>
            </button>
          </div>

        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            placeholder="Search items in current folder..."
            className="w-full pl-8 pr-3 py-1.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs focus:outline-none focus:border-[var(--gold)]"
          />
          {adminSearch && (
            <button
              onClick={() => setAdminSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* BULK ACTION BAR */}
      {selectedKeys.size > 0 && (
        <div className="bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-lg p-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2 text-[var(--gold)] font-semibold">
            <Check className="w-4 h-4" />
            <span>Selected: {selectedKeys.size} {selectedKeys.size === 1 ? 'item' : 'items'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkMakePublic}
              className="px-2.5 py-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] text-[var(--text-main)] rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3 h-3 text-emerald-400" />
              <span>Make Public</span>
            </button>
            <button
              onClick={handleBulkHide}
              className="px-2.5 py-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] text-[var(--text-main)] rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <EyeOff className="w-3 h-3 text-amber-400" />
              <span>Hide</span>
            </button>
            <button
              onClick={() => {
                setBulkPaidState({ isPaid: true });
                setBulkPaidModalOpen(true);
              }}
              className="px-2.5 py-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] text-[var(--text-main)] rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              title="Mark the selected books paid with one price"
            >
              <IndianRupee className="w-3 h-3 text-[var(--gold)]" />
              <span>Mark Paid</span>
            </button>
            <button
              onClick={handleBulkMakeFree}
              className="px-2.5 py-1 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] text-[var(--text-main)] rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              title="Make the selected books free"
            >
              <X className="w-3 h-3 text-emerald-400" />
              <span>Make Free</span>
            </button>
            <button
              onClick={openDeleteModalForBulk}
              className="px-2.5 py-1 bg-rose-950/30 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedKeys(new Set())}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              title="Cancel Selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* BULK PAID MODAL — one price for every selected book */}
      {bulkPaidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg max-w-md w-full p-6 text-[var(--text-main)] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <h3 className="font-semibold text-base text-[var(--text-main)]">
                Mark selected books as paid
              </h3>
              <button
                onClick={() => setBulkPaidModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded"
              >
                ✕
              </button>
            </div>
            <p className="text-[var(--text-muted)]">
              {[...selectedKeys].filter((k) => k.startsWith('book:')).length} book
              {[...selectedKeys].filter((k) => k.startsWith('book:')).length === 1 ? '' : 's'} selected.
              One price below applies to all of them. Paid books are free for followers — locked visitors see the followers-only lock, or unlock with a key.
            </p>
            <PaidBookControl
              book={bulkPaidState}
              onChange={(patch) => setBulkPaidState((prev) => ({ ...prev, ...patch }))}
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setBulkPaidModalOpen(false)}
                className="px-3 py-1.5 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkMarkPaid}
                className="px-4 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold rounded cursor-pointer"
              >
                Mark Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Keys — paid books only. Generate a key, share it with the
          follower who needs the book; they enter it to unlock that one book. */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-5">
        <BookKeysPanel />
      </div>

      {/* Maintenance mode — turn the site off for visitors while you work. */}
      <MaintenancePanel />

      {/* Arrange by Topic & Category — the library's organising system.
          No folder digging: search, set topic/category, reorder, mark Authentic. */}
      <div id="admin-arrange">
        <ArrangeByTopic />
      </div>

      {/* Admin File List Table */}
      <div id="admin-files" className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg overflow-hidden text-sm">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-2.5 bg-[var(--bg-main)] text-[var(--text-muted)] text-xs font-medium border-b border-[var(--border-main)] items-center">
          <div className="col-span-1 sm:col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={isAllVisibleSelected}
              onChange={toggleSelectAllVisible}
              className="w-4 h-4 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer"
              title="Select all visible items"
            />
          </div>
          <div className="col-span-5 sm:col-span-5 font-semibold">Name & Description</div>
          <div className="col-span-3 sm:col-span-4 font-semibold">Type & Status</div>
          <div className="col-span-3 sm:col-span-2 text-right font-semibold">Actions</div>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          
          {/* Subfolders */}
          {currentChildFolders.map((f) => {
            const count = appState.getItemCountForFolder(f.id);
            const isVisible = f.visible !== false;
            const folderKey = `folder:${f.id}`;
            const isSelected = selectedKeys.has(folderKey);
            const isDragTarget = dragOverFolderId === f.id;

            return (
              <div
                key={f.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'folder', id: f.id }));
                  setDraggedItem({ type: 'folder', id: f.id });
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedItem?.id !== f.id) {
                    setDragOverFolderId(f.id);
                  }
                }}
                onDragLeave={() => setDragOverFolderId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOnFolder(f.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    open: true,
                    x: e.clientX,
                    y: e.clientY,
                    type: 'folder',
                    item: f,
                  });
                }}
                className={`grid grid-cols-12 px-4 py-3 items-center transition-colors text-xs sm:text-sm ${
                  isDragTarget
                    ? 'bg-[var(--gold-faint)] border-2 border-dashed border-[var(--gold)]'
                    : isSelected
                    ? 'bg-[var(--gold-faint)]/50'
                    : 'hover:bg-[var(--bg-hover)]'
                }`}
              >
                {/* Checkbox */}
                <div className="col-span-1 sm:col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleKeySelection(folderKey)}
                    className="w-4 h-4 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer"
                  />
                </div>

                {/* Name & Description - 1 Click Open */}
                <div
                  onClick={() => setSelectedFolderId(f.id)}
                  className="col-span-5 sm:col-span-5 flex items-center gap-3 min-w-0 cursor-pointer pr-2 group"
                >
                  <FolderIcon className="w-5 h-5 text-[var(--gold)] fill-[var(--gold)]/20 shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="truncate">
                    <span className="font-medium text-[var(--text-main)] group-hover:underline truncate block">
                      {f.name}
                    </span>
                    {f.description && (
                      <span className="text-xs text-[var(--text-muted)] truncate block">
                        {f.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Type & Status */}
                <div className="col-span-3 sm:col-span-4 flex items-center gap-2 text-xs text-[var(--text-muted)] flex-wrap">
                  <span className="capitalize font-medium text-[var(--text-main)]">
                    {f.type || (f.parentId ? 'subfolder' : 'category')}
                  </span>
                  <span className="text-[var(--text-faint)]">•</span>
                  <span>{count} {count === 1 ? 'item' : 'items'}</span>
                  
                  {/* Visibility Badge Quick Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFolderVisibility(f);
                    }}
                    className="cursor-pointer"
                    title="Click to toggle visibility"
                  >
                    {isVisible ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium hover:bg-emerald-500/20 transition-colors inline-flex items-center gap-1">
                        Public ●
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium hover:bg-amber-500/20 transition-colors inline-flex items-center gap-1">
                        Hidden ●
                      </span>
                    )}
                  </button>
                </div>

                {/* Actions: Open, Quick Edit, More */}
                <div className="col-span-3 sm:col-span-2 text-right flex items-center justify-end gap-1 relative">
                  <button
                    onClick={() => setSelectedFolderId(f.id)}
                    className="px-2 py-1 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs font-medium cursor-pointer hidden sm:inline-flex"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => {
                      setEditingFolder(f);
                      setInitialFolderState(f);
                      setShowAdvancedFolder(false);
                      setFolderModalOpen(true);
                    }}
                    className="px-2 py-1 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs font-medium cursor-pointer"
                    title="Quick Edit Name & Description"
                  >
                    Edit
                  </button>

                  {/* Three-Dot More Dropdown */}
                  <div>
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) menuButtonRefs.current.set(folderKey, el);
                        else menuButtonRefs.current.delete(folderKey);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuKey(activeMenuKey === folderKey ? null : folderKey);
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded hover:bg-[var(--bg-main)] cursor-pointer"
                      title="More options"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    <ActionMenuPortal
                      isOpen={activeMenuKey === folderKey}
                      onClose={() => setActiveMenuKey(null)}
                      triggerRef={{ current: menuButtonRefs.current.get(folderKey) || null }}
                      className="min-w-[170px]"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setSelectedFolderId(f.id);
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          <FolderIcon className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>Open Folder</span>
                        </button>
                        <button
                          onClick={() => {
                            setRenameModal({
                              open: true,
                              type: 'folder',
                              id: f.id,
                              initialName: f.name,
                            });
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={() => {
                            setDescModal({
                              open: true,
                              id: f.id,
                              title: f.name,
                              initialDescription: f.description || '',
                            });
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          <span>Edit Description</span>
                        </button>
                        <button
                          onClick={() => {
                            setMoveModal({
                              open: true,
                              type: 'folder',
                              id: f.id,
                              title: f.name,
                              currentParentId: f.parentId || null,
                            });
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          <Move className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>Move</span>
                        </button>
                        <button
                          onClick={() => {
                            handleToggleFolderVisibility(f);
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          {isVisible ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                              <span>Hide from Public</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Make Public</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="py-1 border-t border-[var(--border-subtle)]">
                        <button
                          onClick={() => {
                            openDeleteModalForFolder(f);
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-rose-400 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </ActionMenuPortal>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Books */}
          {currentBooks.map((b) => {
            const isVisible = b.visible !== false;
            const bookKey = `book:${b.id}`;
            const isSelected = selectedKeys.has(bookKey);

            return (
              <div
                key={b.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'book', id: b.id }));
                  setDraggedItem({ type: 'book', id: b.id });
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    open: true,
                    x: e.clientX,
                    y: e.clientY,
                    type: 'book',
                    item: b,
                  });
                }}
                className={`grid grid-cols-12 px-4 py-3 items-center transition-colors text-xs sm:text-sm ${
                  isSelected ? 'bg-[var(--gold-faint)]/50' : 'hover:bg-[var(--bg-hover)]'
                }`}
              >
                {/* Checkbox */}
                <div className="col-span-1 sm:col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleKeySelection(bookKey)}
                    className="w-4 h-4 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer"
                  />
                </div>

                {/* Title & Author - 1 Click Open */}
                <div
                  onClick={() => router.navigate('book', { bookId: b.id })}
                  className="col-span-5 sm:col-span-5 flex items-center gap-3 min-w-0 cursor-pointer pr-2 group"
                >
                  <FileText className="w-5 h-5 text-indigo-400 shrink-0 group-hover:scale-105 transition-transform" />
                  <div className="truncate">
                    <span className="font-medium text-[var(--text-main)] group-hover:underline truncate block">
                      {b.title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] truncate block">
                      By {b.author}
                    </span>
                  </div>
                </div>

                {/* Status & Type */}
                <div className="col-span-3 sm:col-span-4 flex items-center gap-2 text-xs text-[var(--text-muted)] flex-wrap">
                  {(() => {
                    const itemType = getItemType(b);
                    const typeLabel = getTypeLabel(b);
                    const badge = getTypeBadgeColor(itemType);
                    return (
                      <>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {typeLabel}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          {b.pageCount ? `${b.pageCount} pages` : b.fileSize ? formatFileSize(b.fileSize) : 'File'}
                        </span>
                      </>
                    );
                  })()}
                  
                  {/* Visibility Badge Quick Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookVisibility(b);
                    }}
                    className="cursor-pointer"
                    title="Click to toggle visibility"
                  >
                    {isVisible ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium hover:bg-emerald-500/20 transition-colors inline-flex items-center gap-1">
                        Public ●
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium hover:bg-amber-500/20 transition-colors inline-flex items-center gap-1">
                        Hidden ●
                      </span>
                    )}
                  </button>

                  {/* Paid / Free badge — click to toggle. Paid needs a price:
                      without one, the edit form opens so you can set it. */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePaid(b);
                    }}
                    className="cursor-pointer"
                    title={b.isPaid ? 'Paid — click to make this book free' : 'Free — click to mark this book as paid'}
                  >
                    {b.isPaid ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--gold)]/40 font-bold hover:bg-[var(--gold)]/20 transition-colors inline-flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        Paid
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-main)] font-medium hover:border-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors inline-flex items-center gap-1">
                        Free
                      </span>
                    )}
                  </button>
                </div>

                {/* Actions: Open, Quick Edit, More */}
                <div className="col-span-3 sm:col-span-2 text-right flex items-center justify-end gap-1 relative">
                  <button
                    onClick={() => router.navigate('book', { bookId: b.id })}
                    className="px-2 py-1 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs font-medium cursor-pointer hidden sm:inline-flex"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setEditingBook(b);
                      setInitialBookState(b);
                      setShowAdvancedBook(false);
                      setBookModalOpen(true);
                    }}
                    className="px-2 py-1 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs font-medium cursor-pointer"
                    title="Quick Edit Title & Author"
                  >
                    Edit
                  </button>

                  {/* Three-Dot More Dropdown */}
                  <div>
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) menuButtonRefs.current.set(bookKey, el);
                        else menuButtonRefs.current.delete(bookKey);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuKey(activeMenuKey === bookKey ? null : bookKey);
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded hover:bg-[var(--bg-main)] cursor-pointer"
                      title="More options"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    <ActionMenuPortal
                      isOpen={activeMenuKey === bookKey}
                      onClose={() => setActiveMenuKey(null)}
                      triggerRef={{ current: menuButtonRefs.current.get(bookKey) || null }}
                      className="min-w-[170px]"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            router.navigate('book', { bookId: b.id });
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>Open Book</span>
                        </button>
                        <button
                          onClick={() => {
                            setRenameModal({
                              open: true,
                              type: 'book',
                              id: b.id,
                              initialName: b.title,
                            });
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Rename Title</span>
                        </button>
                        <button
                          onClick={() => {
                            setMoveModal({
                              open: true,
                              type: 'book',
                              id: b.id,
                              title: b.title,
                              currentParentId: b.folderId || null,
                            });
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          <Move className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>Move</span>
                        </button>
                        <button
                          onClick={() => {
                            handleToggleBookVisibility(b);
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          {isVisible ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                              <span>Hide from Public</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Make Public</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            handleTogglePaid(b);
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-[var(--text-main)] flex items-center gap-2 cursor-pointer"
                        >
                          <IndianRupee className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>
                            {b.isPaid
                              ? 'Make free'
                              : 'Mark as paid'}
                          </span>
                        </button>
                      </div>

                      <div className="py-1 border-t border-[var(--border-subtle)]">
                        <button
                          onClick={() => {
                            openDeleteModalForBook(b);
                            setActiveMenuKey(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-[var(--bg-hover)] text-rose-400 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </ActionMenuPortal>
                  </div>
                </div>
              </div>
            );
          })}

          {currentChildFolders.length === 0 && currentBooks.length === 0 && (
            <div className="py-10 text-center text-xs text-[var(--text-muted)] space-y-1">
              <p className="font-medium text-[var(--text-main)]">
                {adminSearch ? 'No items match your search.' : 'This folder is empty.'}
              </p>
              <p className="text-[11px]">
                Use <strong className="text-[var(--gold)]">New Folder</strong> or <strong className="text-[var(--gold)]">Upload File</strong> above to add files.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* QUICK COMPACT FOLDER MODAL */}
      {folderModalOpen && editingFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg max-w-md w-full p-5 text-[var(--text-main)] space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <h3 className="font-semibold text-base text-[var(--text-main)]">
                {editingFolder.id ? 'Quick Edit Folder' : 'Create New Folder'}
              </h3>
              <button
                type="button"
                onClick={handleCloseFolderModal}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className="space-y-3.5">
              {/* Primary Fields */}
              <div>
                <label className="block text-[var(--text-muted)] mb-1 font-medium">
                  Folder Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={editingFolder.name || ''}
                  onChange={(e) =>
                    setEditingFolder((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
                  placeholder="e.g. Islam or Classical Philosophy"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1 font-medium">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingFolder.description || ''}
                  onChange={(e) =>
                    setEditingFolder((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs resize-none"
                  placeholder="Describe the topics and contents in this folder..."
                />
              </div>

              {/* Collapsible Advanced Options */}
              <div className="border-t border-[var(--border-subtle)] pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFolder(!showAdvancedFolder)}
                  className="text-[11px] text-[var(--gold)] font-medium hover:underline flex items-center gap-1 cursor-pointer py-1"
                >
                  <span>Advanced options</span>
                  {showAdvancedFolder ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showAdvancedFolder && (
                  <div className="mt-3 space-y-3 p-3 bg-[var(--bg-main)] rounded border border-[var(--border-main)] animate-fade-in">
                    <div>
                      <label className="block text-[var(--text-muted)] mb-1 font-medium">
                        Parent Folder / Category
                      </label>
                      <select
                        value={editingFolder.parentId || ''}
                        onChange={(e) => {
                          const val = e.target.value || null;
                          setEditingFolder((prev) => ({
                            ...prev,
                            parentId: val,
                            type: val ? 'subfolder' : 'category',
                          }));
                        }}
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs"
                      >
                        <option value="">Root Library (Top-Level Category)</option>
                        {folders
                          .filter((f) => f.id !== editingFolder.id)
                          .map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[var(--text-muted)] mb-1 font-medium">
                          Folder Type
                        </label>
                        <select
                          value={editingFolder.type || (editingFolder.parentId ? 'subfolder' : 'category')}
                          onChange={(e) =>
                            setEditingFolder((prev) => ({
                              ...prev,
                              type: e.target.value as any,
                            }))
                          }
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs capitalize"
                        >
                          <option value="category">Category</option>
                          <option value="folder">Folder</option>
                          <option value="subfolder">Subfolder</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[var(--text-muted)] mb-1 font-medium">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={editingFolder.sortOrder ?? editingFolder.order ?? 1}
                          onChange={(e) =>
                            setEditingFolder((prev) => ({
                              ...prev,
                              sortOrder: parseInt(e.target.value, 10) || 1,
                            }))
                          }
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingFolder.visible !== false}
                          onChange={(e) =>
                            setEditingFolder((prev) => ({
                              ...prev,
                              visible: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer"
                        />
                        <span className="font-medium text-[var(--text-main)] text-xs">
                          Visible in Public Library
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={handleCloseFolderModal}
                  className="px-3.5 py-1.5 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold rounded transition-colors cursor-pointer"
                >
                  Save Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK COMPACT BOOK MODAL */}
      {bookModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg max-w-lg w-full p-6 text-[var(--text-main)] space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <h3 className="font-semibold text-base text-[var(--text-main)]">
                {editingBook.id ? 'Quick Edit Item' : 'Upload File / Add Item'}
              </h3>
              <button
                onClick={handleCloseBookModal}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-3.5">

              {/* Local uploads are temporary while Google Drive is not
                  connected: the live site stores them in serverless /tmp,
                  so the book can stop opening later. Drive links always
                  work — the file stays in Drive. */}
              {driveConfigured === false && (
                <p className="text-xs leading-relaxed bg-amber-400/10 border border-amber-400/40 text-amber-200 rounded-lg px-3 py-2">
                  Google Drive is not connected yet, so a file uploaded from this device is only stored temporarily on the live site and may stop opening later. For books that must keep working, paste a Google Drive link below instead — the file stays in Drive.
                </p>
              )}

              {/* File Upload Zone */}
              <div>
                <label className="block text-[var(--text-muted)] mb-1 font-medium">
                  File Attachment (PDF, DOC, XLS, PPT, TXT, MD, Images, Audio, Video, ZIP)
                </label>
                
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="border-2 border-dashed border-[var(--border-main)] hover:border-[var(--gold)]/60 bg-[var(--bg-main)] rounded-lg p-3 text-center transition-colors space-y-2 cursor-pointer"
                >
                  {uploading ? (
                    <div className="space-y-2 py-2 text-left">
                      <div className="text-xs text-[var(--gold)] font-medium flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>
                          Uploading… {uploadProgress ? `${uploadProgress.percentage}%` : ''}
                        </span>
                      </div>
                      {uploadProgress && (
                        <>
                          <div className="w-full h-2 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-main)]">
                            <div
                              className="h-full bg-[var(--gold)] transition-all duration-150"
                              style={{ width: `${uploadProgress.percentage}%` }}
                            />
                          </div>
                          <p className="text-center text-[11px] font-mono text-[var(--text-muted)]">
                            {formatFileSize(uploadProgress.loadedBytes)} /{' '}
                            {formatFileSize(uploadProgress.totalBytes)}
                          </p>
                        </>
                      )}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => uploadAbortRef.current?.abort()}
                          className="px-3 py-1 border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 rounded text-[11px] font-medium cursor-pointer"
                        >
                          Cancel upload
                        </button>
                      </div>
                    </div>
                  ) : (editingBook.fileUrl || editingBook.pdfUrl) ? (
                    <div className="flex items-center justify-between gap-3 bg-[var(--bg-surface)] p-2 rounded border border-[var(--border-main)] text-left">
                      {editingBook.coverUrl ? (
                        <img
                          src={editingBook.coverUrl}
                          alt="Cover preview"
                          className="w-10 h-14 object-cover rounded shadow-xs shrink-0 border border-[var(--border-main)]"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-[var(--bg-main)] rounded flex items-center justify-center shrink-0 border border-[var(--border-main)] text-[var(--gold)]">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1 text-xs">
                        <span className="text-emerald-400 font-semibold block text-[11px]">
                          ✓ {getTypeLabel(editingBook)} File Attached
                        </span>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">
                          {editingBook.fileUrl || editingBook.pdfUrl}
                        </p>
                        {editingBook.fileSize && (
                          <p className="text-[10px] text-[var(--text-faint)] font-mono">
                            Size: {formatFileSize(editingBook.fileSize)}
                          </p>
                        )}
                      </div>

                      <label className="px-2.5 py-1 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-[11px] font-medium cursor-pointer shrink-0">
                        Replace File
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="py-2">
                      <p className="text-xs font-medium text-[var(--text-main)]">
                        Drag & drop any file here, or click to browse
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Supports PDF, Documents, Images, Audio, Video & Archives
                      </p>
                      <label className="inline-block mt-2 px-3 py-1 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold rounded text-xs cursor-pointer">
                        Select File
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Bulk add: several files or Drive links at once, instead of one by one. */}
              <button
                type="button"
                onClick={() => {
                  if (isBookModified()) {
                    setUnsavedWarning({
                      open: true,
                      onDiscard: () => {
                        setBookModalOpen(false);
                        setEditingBook(null);
                        setInitialBookState(null);
                        setBatchUploadModalOpen(true);
                      },
                    });
                  } else {
                    setBookModalOpen(false);
                    setEditingBook(null);
                    setInitialBookState(null);
                    setBatchUploadModalOpen(true);
                  }
                }}
                className="text-[11px] text-[var(--gold)] font-medium hover:underline cursor-pointer"
              >
                Adding several books? Use Bulk Upload — pick many files or paste Drive links at once.
              </button>

              {/* Primary Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] mb-1 font-medium">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBook.title || ''}
                    onChange={(e) =>
                      setEditingBook((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
                    placeholder="Book title"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] mb-1 font-medium">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBook.author || ''}
                    onChange={(e) =>
                      setEditingBook((prev) => ({ ...prev, author: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
                    placeholder="Author name"
                  />
                </div>
              </div>

              {/* Topic & Category — how the book is arranged. Category is
                  the organising label, NOT the folder; topic is the subject
                  inside it. Type a new one and it is created on save. */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] mb-1 font-medium">
                    Topic
                  </label>
                  <input
                    type="text"
                    list="admin-topics"
                    value={editingBook.topic || ''}
                    onChange={(e) =>
                      setEditingBook((prev) => ({ ...prev, topic: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
                    placeholder="e.g. Sufism, Tafseer, Seerah"
                  />
                  <datalist id="admin-topics">
                    {[...new Set(books.map((b) => (b.topic || '').trim()).filter(Boolean))].map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] mb-1 font-medium">
                    Category
                  </label>
                  <input
                    type="text"
                    list="admin-categories"
                    value={editingBook.category || ''}
                    onChange={(e) =>
                      setEditingBook((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
                    placeholder="e.g. All Sufis Books"
                  />
                  <datalist id="admin-categories">
                    {[...new Set(books.map((b) => (b.category || '').trim()).filter(Boolean))].map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer select-none text-xs">
                <input
                  type="checkbox"
                  checked={editingBook.isAuthentic === true}
                  onChange={(e) =>
                    setEditingBook((prev) => ({ ...prev, isAuthentic: e.target.checked }))
                  }
                  className="w-4 h-4 mt-0.5 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer shrink-0"
                />
                <span>
                  <span className="font-semibold text-[var(--text-main)]">Mark Authentic</span>
                  <span className="text-[var(--text-muted)] block">
                    You checked this copy and found it the genuine, unaltered text of the named
                    work. Unmarked books are simply not checked yet, not fake.
                  </span>
                </span>
              </label>

              {/* Paid or free — one toggle + price, right at the top. */}
              <PaidBookControl
                book={editingBook}
                onChange={(patch) =>
                  setEditingBook((prev) => ({ ...prev, ...patch }))
                }
              />

              <div>
                <label className="block text-[var(--text-muted)] mb-1 font-medium">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingBook.description || ''}
                  onChange={(e) =>
                    setEditingBook((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs resize-none"
                  placeholder="Summary or note about this book..."
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1 font-medium">
                  Google Drive link
                </label>
                <input
                  type="url"
                  value={editingBook.externalUrl || ''}
                  onChange={(e) => {
                    const link = e.target.value;
                    // Fast path: a Drive link needs no file upload at all.
                    // The file id is pulled out of the link right away so
                    // the book opens straight from Drive when saved.
                    const driveId = extractDriveId(link);
                    setEditingBook((prev) => ({
                      ...prev,
                      externalUrl: link,
                      driveFileId: driveId || prev?.driveFileId,
                    }));
                  }}
                  className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
                  placeholder="https://drive.google.com/file/d/... — readers open the book here"
                />
                {editingBook.externalUrl && extractDriveId(editingBook.externalUrl) ? (
                  <p className="text-[11px] text-emerald-400 mt-1">
                    ✓ Drive link set — no file upload needed. Readers open the book in Drive.
                  </p>
                ) : (
                  <p className="text-[11px] text-[var(--text-faint)] mt-1">
                    Paste the Drive share link for this book. The file stays in Drive; only the link is saved.
                  </p>
                )}
              </div>

              {/* Collapsible Advanced Options */}
              <div className="border-t border-[var(--border-subtle)] pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedBook(!showAdvancedBook)}
                  className="text-[11px] text-[var(--gold)] font-medium hover:underline flex items-center gap-1 cursor-pointer py-1"
                >
                  <span>Advanced options</span>
                  {showAdvancedBook ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showAdvancedBook && (
                  <div className="mt-3 space-y-3 p-3 bg-[var(--bg-main)] rounded border border-[var(--border-main)] animate-fade-in">
                    <div>
                      <label className="block text-[var(--text-muted)] mb-1 font-medium">
                        Target Folder
                      </label>
                      <select
                        value={editingBook.folderId || ''}
                        onChange={(e) =>
                          setEditingBook((prev) => ({ ...prev, folderId: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs"
                      >
                        <option value="">Root Library</option>
                        {folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[var(--text-muted)] mb-1 font-medium">
                        Google Drive File ID
                      </label>
                      <input
                        type="text"
                        value={editingBook.driveFileId || ''}
                        onChange={(e) =>
                          setEditingBook((prev) => ({ ...prev, driveFileId: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs"
                        placeholder="1A2b3C4d5E..."
                      />
                    </div>

                    <div>
                      <label className="block text-[var(--text-muted)] mb-1 font-medium">
                        Direct PDF URL / Path
                      </label>
                      <input
                        type="text"
                        value={editingBook.pdfUrl || ''}
                        onChange={(e) =>
                          setEditingBook((prev) => ({ ...prev, pdfUrl: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs"
                        placeholder="/uploads/... or https://..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[var(--text-muted)] mb-1 font-medium">
                          Cover Image URL
                        </label>
                        <input
                          type="text"
                          value={editingBook.coverUrl || ''}
                          onChange={(e) =>
                            setEditingBook((prev) => ({ ...prev, coverUrl: e.target.value }))
                          }
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs"
                          placeholder="/uploads/... or https://..."
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--text-muted)] mb-1 font-medium">
                          Page Count
                        </label>
                        <input
                          type="number"
                          value={editingBook.pageCount || ''}
                          onChange={(e) =>
                            setEditingBook((prev) => ({
                              ...prev,
                              pageCount: parseInt(e.target.value, 10) || undefined,
                            }))
                          }
                          className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs"
                          placeholder="e.g. 350"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingBook.visible !== false}
                          onChange={(e) =>
                            setEditingBook((prev) => ({
                              ...prev,
                              visible: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer"
                        />
                        <span className="font-medium text-[var(--text-main)] text-xs">
                          Visible in Public Library
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={handleCloseBookModal}
                  className="px-3 py-1.5 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-1.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-50 text-black font-semibold rounded cursor-pointer"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK RENAME MODAL */}
      <QuickRenameModal
        isOpen={renameModal.open}
        initialName={renameModal.initialName}
        itemType={renameModal.type}
        onSave={handleQuickRenameSave}
        onCancel={() => setRenameModal({ open: false, type: 'folder', id: '', initialName: '' })}
      />

      {/* QUICK DESCRIPTION MODAL */}
      <QuickDescriptionModal
        isOpen={descModal.open}
        itemTitle={descModal.title}
        initialDescription={descModal.initialDescription}
        onSave={handleQuickDescriptionSave}
        onCancel={() => setDescModal({ open: false, id: '', title: '', initialDescription: '' })}
      />

      {/* DEDICATED MOVE MODAL */}
      <MoveModal
        isOpen={moveModal.open}
        itemTitle={moveModal.title}
        itemType={moveModal.type}
        currentParentId={moveModal.currentParentId}
        itemId={moveModal.id}
        allFolders={folders}
        onConfirm={handleMoveConfirm}
        onCancel={() => setMoveModal({ open: false, type: 'folder', id: '', title: '', currentParentId: null })}
      />

      {/* RIGHT-CLICK CONTEXT MENU */}
      {contextMenu?.open && (
        <AdminContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          title={contextMenu.type === 'folder' ? (contextMenu.item as Folder).name : (contextMenu.item as Book).title}
          type={contextMenu.type}
          isVisible={contextMenu.item.visible !== false}
          onClose={() => setContextMenu(null)}
          onOpen={() => {
            if (contextMenu.type === 'folder') {
              setSelectedFolderId(contextMenu.item.id);
            } else {
              router.navigate('book', { bookId: contextMenu.item.id });
            }
          }}
          onQuickEdit={() => {
            if (contextMenu.type === 'folder') {
              setEditingFolder(contextMenu.item as Folder);
              setInitialFolderState(contextMenu.item as Folder);
              setShowAdvancedFolder(false);
              setFolderModalOpen(true);
            } else {
              setEditingBook(contextMenu.item as Book);
              setInitialBookState(contextMenu.item as Book);
              setShowAdvancedBook(false);
              setBookModalOpen(true);
            }
          }}
          onRename={() => {
            setRenameModal({
              open: true,
              type: contextMenu.type,
              id: contextMenu.item.id,
              initialName: contextMenu.type === 'folder' ? (contextMenu.item as Folder).name : (contextMenu.item as Book).title,
            });
          }}
          onEditDescription={() => {
            if (contextMenu.type === 'folder') {
              const f = contextMenu.item as Folder;
              setDescModal({
                open: true,
                id: f.id,
                title: f.name,
                initialDescription: f.description || '',
              });
            }
          }}
          onMove={() => {
            setMoveModal({
              open: true,
              type: contextMenu.type,
              id: contextMenu.item.id,
              title: contextMenu.type === 'folder' ? (contextMenu.item as Folder).name : (contextMenu.item as Book).title,
              currentParentId: contextMenu.type === 'folder' ? ((contextMenu.item as Folder).parentId || null) : ((contextMenu.item as Book).folderId || null),
            });
          }}
          onToggleVisibility={() => {
            if (contextMenu.type === 'folder') {
              handleToggleFolderVisibility(contextMenu.item as Folder);
            } else {
              handleToggleBookVisibility(contextMenu.item as Book);
            }
          }}
          isPaid={contextMenu.type === 'book' ? Boolean((contextMenu.item as Book).isPaid) : false}
          onTogglePaid={
            contextMenu.type === 'book'
              ? () => handleTogglePaid(contextMenu.item as Book)
              : undefined
          }
          onDelete={() => {
            if (contextMenu.type === 'folder') {
              openDeleteModalForFolder(contextMenu.item as Folder);
            } else {
              openDeleteModalForBook(contextMenu.item as Book);
            }
          }}
        />
      )}

      {/* UNSAVED CHANGES WARNING MODAL */}
      <ConfirmModal
        isOpen={unsavedWarning.open}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Discard Changes"
        cancelLabel="Continue Editing"
        onConfirm={() => {
          unsavedWarning.onDiscard();
          setUnsavedWarning({ open: false, onDiscard: () => {} });
        }}
        onCancel={() => setUnsavedWarning({ open: false, onDiscard: () => {} })}
      />

      {/* CONFIRM DELETE MODAL */}
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

      {/* BATCH UPLOAD MODAL */}
      <UploadFileModal
        isOpen={batchUploadModalOpen}
        folderId={selectedFolderId}
        onClose={() => setBatchUploadModalOpen(false)}
        onUploaded={() => appState.loadCatalog()}
        onOpenUrlImport={() => setImportUrlModalOpen(true)}
      />

      {/* IMPORT FROM URL MODAL */}
      <ImportUrlModal
        isOpen={importUrlModalOpen}
        initialFolderId={selectedFolderId}
        onClose={() => setImportUrlModalOpen(false)}
        onImported={(title, folderName) => {
          appState.showToast(`Imported "${title}" into ${folderName}`, 'success');
          appState.loadCatalog();
        }}
      />

      {/* AI LIBRARY ORGANIZER MODAL */}
      <AiOrganizerModal
        isOpen={aiOrganizerModalOpen}
        onClose={() => {
          setAiOrganizerModalOpen(false);
          api.getAiPendingProposals().then((res) => {
            if (res?.proposals) {
              setAiPendingCount(res.proposals.filter((p: any) => p.status === 'pending').length);
            }
          }).catch(() => {});
        }}
        folders={folders}
        books={books}
        onCatalogUpdated={() => {
          appState.loadCatalog();
          api.getAiPendingProposals().then((res) => {
            if (res?.proposals) {
              setAiPendingCount(res.proposals.filter((p: any) => p.status === 'pending').length);
            }
          }).catch(() => {});
        }}
      />

    </div>
  );
};
