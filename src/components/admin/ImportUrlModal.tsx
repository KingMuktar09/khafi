import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Link,
  Download,
  CheckCircle2,
  AlertCircle,
  Folder as FolderIcon,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  X,
  FileText,
  Tag,
  User,
  Eye,
  EyeOff,
  Search,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';
import { appState } from '../../state/appState';
import { Folder, ItemType } from '../../types';
import {
  getTypeBadgeColor,
  getTypeLabel,
  formatFileSize,
  detectFileType,
  getFileExtension,
} from '../../utils/fileUtils';

interface ImportUrlModalProps {
  isOpen: boolean;
  initialFolderId?: string | null;
  onClose: () => void;
  onImported?: (bookTitle: string, folderName: string) => void;
}

type ImportStep = 'input' | 'inspecting' | 'preview' | 'importing' | 'success' | 'error';

interface DetectedInfo {
  url: string;
  finalUrl: string;
  filename: string;
  title: string;
  author: string;
  description: string;
  mimeType: string;
  fileType: ItemType;
  sizeBytes: number;
  fileSize: string;
  supportsRanges?: boolean;
}

export const ImportUrlModal: React.FC<ImportUrlModalProps> = ({
  isOpen,
  initialFolderId,
  onClose,
  onImported,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [step, setStep] = useState<ImportStep>('input');
  const [errorMessage, setErrorMessage] = useState('');
  const [detectedInfo, setDetectedInfo] = useState<DetectedInfo | null>(null);

  // Form Fields for Customization
  const [customTitle, setCustomTitle] = useState('');
  const [customFilename, setCustomFilename] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customTags, setCustomTags] = useState('');
  const [customVisible, setCustomVisible] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedSubfolderId, setSelectedSubfolderId] = useState<string | null>(null);

  // Folder tree search and collapse state
  const [folderSearch, setFolderSearch] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Import Progress Tracking
  const [importProgressPhase, setImportProgressPhase] = useState<
    'connecting' | 'downloading' | 'uploading' | 'saving' | 'completed'
  >('connecting');
  const [importProgressText, setImportProgressText] = useState('Connecting to server...');

  // Success details
  const [successFolderName, setSuccessFolderName] = useState('');
  const [successBookTitle, setSuccessBookTitle] = useState('');

  // Abort controller for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const folders = appState.catalog.folders || [];

  // Reset and initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrlInput('');
      setStep('input');
      setErrorMessage('');
      setDetectedInfo(null);
      setCustomTitle('');
      setCustomFilename('');
      setCustomAuthor('');
      setCustomDescription('');
      setCustomTags('');
      setCustomVisible(true);
      setFolderSearch('');

      // Auto-select folder if provided
      if (initialFolderId) {
        const folderObj = appState.getFolderById(initialFolderId);
        if (folderObj && folderObj.parentId) {
          setSelectedFolderId(folderObj.parentId);
          setSelectedSubfolderId(folderObj.id);
          setExpandedFolders(new Set([folderObj.parentId]));
        } else if (folderObj) {
          setSelectedFolderId(folderObj.id);
          setSelectedSubfolderId(null);
          setExpandedFolders(new Set([folderObj.id]));
        }
      } else {
        const firstCategory = folders.find((f) => !f.parentId) || folders[0];
        setSelectedFolderId(firstCategory ? firstCategory.id : null);
        setSelectedSubfolderId(null);
      }
    } else {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    }
  }, [isOpen, initialFolderId]);

  if (!isOpen) return null;

  // Folder Hierarchy Helpers
  const rootCategories = folders.filter((f) => !f.parentId);
  const getSubfolders = (parentId: string) => folders.filter((f) => f.parentId === parentId);

  const toggleFolderExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const getDestinationDisplay = (): string => {
    if (selectedSubfolderId) {
      const sub = appState.getFolderById(selectedSubfolderId);
      const parent = selectedFolderId ? appState.getFolderById(selectedFolderId) : null;
      if (parent && sub) return `Library / ${parent.name} / ${sub.name}`;
      if (sub) return `Library / ${sub.name}`;
    }
    if (selectedFolderId) {
      const f = appState.getFolderById(selectedFolderId);
      if (f) return `Library / ${f.name}`;
    }
    return 'Library Root';
  };

  // Step 1 -> Step 2: Inspect URL
  const handleInspectUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) {
      setErrorMessage('Please enter a valid file URL.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setErrorMessage('URL must start with http:// or https://');
      return;
    }

    setErrorMessage('');
    setStep('inspecting');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await api.probeImportUrl(cleanUrl, controller.signal);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to inspect remote URL.');
        setStep('error');
        return;
      }

      const info: DetectedInfo = {
        url: cleanUrl,
        finalUrl: res.finalUrl || cleanUrl,
        filename: res.filename || 'imported_file.pdf',
        title: res.title || res.filename || 'Untitled Item',
        author: res.author || '',
        description: '',
        mimeType: res.mimeType || 'application/octet-stream',
        fileType: res.fileType || detectFileType(res.filename, res.mimeType),
        sizeBytes: res.sizeBytes || 0,
        fileSize: res.fileSize || 'Unknown size',
        supportsRanges: res.supportsRanges,
      };

      setDetectedInfo(info);
      setCustomTitle(info.title);
      setCustomFilename(info.filename);
      setCustomAuthor(info.author);
      setCustomDescription('');
      setCustomTags(info.fileType.toUpperCase());
      setStep('preview');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStep('input');
        return;
      }
      setErrorMessage(err.message || 'An unexpected error occurred while inspecting URL.');
      setStep('error');
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Step 2 -> Step 3: Execute Import
  const handleExecuteImport = async () => {
    if (!detectedInfo) return;
    if (!customTitle.trim()) {
      setErrorMessage('Title is required.');
      return;
    }

    const targetFolderId = selectedFolderId || folders[0]?.id || 'f-general';
    const targetSubfolderId = selectedSubfolderId || undefined;
    const finalFolderName = getDestinationDisplay();

    setStep('importing');
    setErrorMessage('');
    setImportProgressPhase('connecting');
    setImportProgressText('Contacting remote server...');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Simulate animated progress indicators for smooth feedback
    const progressTimer1 = setTimeout(() => {
      setImportProgressPhase('downloading');
      setImportProgressText('Downloading and streaming remote file...');
    }, 900);

    const progressTimer2 = setTimeout(() => {
      setImportProgressPhase('uploading');
      setImportProgressText('Uploading directly to Google Drive storage...');
    }, 2400);

    const progressTimer3 = setTimeout(() => {
      setImportProgressPhase('saving');
      setImportProgressText('Finalizing library catalog and metadata...');
    }, 4200);

    try {
      const res = await api.importFromUrl(
        {
          url: detectedInfo.url,
          filename: customFilename.trim() || detectedInfo.filename,
          title: customTitle.trim(),
          author: customAuthor.trim() || 'Unspecified Author',
          description: customDescription.trim(),
          folderId: targetFolderId,
          subfolderId: targetSubfolderId,
          tags: customTags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          visible: customVisible,
        },
        controller.signal
      );

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);

      if (res.success) {
        setImportProgressPhase('completed');
        setImportProgressText('Import completed successfully!');
        setSuccessFolderName(res.folderName || finalFolderName);
        setSuccessBookTitle(customTitle.trim());

        await appState.loadCatalog();

        if (onImported) {
          onImported(customTitle.trim(), res.folderName || finalFolderName);
        }

        setTimeout(() => {
          setStep('success');
        }, 500);
      } else {
        setErrorMessage(res.error || 'Failed to import file from URL.');
        setStep('error');
      }
    } catch (err: any) {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);

      if (err.name === 'AbortError') {
        setErrorMessage('Import process was cancelled.');
        setStep('preview');
        return;
      }
      setErrorMessage(err.message || 'An unexpected error occurred during import.');
      setStep('error');
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelOperation = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (step === 'inspecting') {
      setStep('input');
    } else if (step === 'importing') {
      setStep('preview');
    }
  };

  const badgeColor = detectedInfo ? getTypeBadgeColor(detectedInfo.fileType) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'importing') {
          onClose();
        }
      }}
    >
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-main)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[var(--text-main)] flex items-center gap-2">
                <span>Import from URL</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--gold)]/30 uppercase tracking-wider font-semibold">
                  Admin Tool
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Stream and save remote files directly to the library storage
              </p>
            </div>
          </div>

          {step !== 'importing' && (
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-md transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* STEP 1: URL Input */}
          {step === 'input' && (
            <form onSubmit={handleInspectUrl} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Direct Remote File URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Link className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="https://example.com/books/my-book.pdf"
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-sm focus:outline-none focus:border-[var(--gold)] font-mono transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    Server-side streamed download with SSRF protection. Google Drive credentials are never exposed.
                  </span>
                </p>
              </div>

              {/* Supported formats note */}
              <div className="p-3.5 bg-[var(--bg-main)]/60 border border-[var(--border-main)] rounded-lg text-xs space-y-1.5">
                <div className="font-medium text-[var(--text-main)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Supported File Types</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
                  PDF, EPUB, Word (DOC/DOCX), Text (TXT/MD), Images (JPG/PNG/WEBP), Audio (MP3/WAV/M4A), Video (MP4/WEBM), Archives (ZIP/RAR/7Z). Maximum 500 MB per file.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-5 py-2 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Inspect & Fetch Details</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Inspecting Loading State */}
          {step === 'inspecting' && (
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 mx-auto flex items-center justify-center text-[var(--gold)]">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[var(--text-main)]">Inspecting Remote URL...</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  Validating security constraints, checking headers, and extracting file metadata.
                </p>
              </div>
              <button
                onClick={handleCancelOperation}
                className="px-4 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* STEP 3: Preview & Customization Form */}
          {step === 'preview' && detectedInfo && (
            <div className="space-y-5 animate-fade-in">
              {/* Detected Metadata Card */}
              <div className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-main)] border border-[var(--border-main)] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-[var(--text-main)] truncate" title={detectedInfo.filename}>
                        {detectedInfo.filename}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate" title={detectedInfo.url}>
                        {detectedInfo.url}
                      </div>
                    </div>
                  </div>

                  {badgeColor && (
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}
                    >
                      {getTypeLabel(detectedInfo.fileType, getFileExtension(detectedInfo.filename))}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[var(--border-main)] text-xs">
                  <div>
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block">Detected Size</span>
                    <span className="font-semibold text-[var(--text-main)]">{detectedInfo.fileSize}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block">Content Type</span>
                    <span className="font-mono text-[11px] text-[var(--text-main)] truncate block">
                      {detectedInfo.mimeType}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block">Stream Support</span>
                    <span className="text-emerald-400 font-medium text-[11px]">Direct Stream Enabled</span>
                  </div>
                </div>
              </div>

              {/* Editable Metadata Form */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Item Details & Destination
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-medium text-[var(--text-main)]">
                      Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="Title of book or document"
                      required
                      className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)] font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[var(--text-main)]">
                      Filename in Storage
                    </label>
                    <input
                      type="text"
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      placeholder="filename.pdf"
                      className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[var(--text-main)]">
                      Author / Contributor
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customAuthor}
                        onChange={(e) => setCustomAuthor(e.target.value)}
                        placeholder="Author Name"
                        className="w-full pl-8 pr-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-medium text-[var(--text-main)]">
                      Description / Summary (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Add an optional brief summary..."
                      className="w-full px-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)] resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[var(--text-main)]">
                      Tags (Comma separated)
                    </label>
                    <div className="relative">
                      <Tag className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customTags}
                        onChange={(e) => setCustomTags(e.target.value)}
                        placeholder="Islamic, History, Tafsir"
                        className="w-full pl-8 pr-3 py-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="block text-xs font-medium text-[var(--text-main)] mb-1">
                      Visibility
                    </label>
                    <button
                      type="button"
                      onClick={() => setCustomVisible(!customVisible)}
                      className={`w-full px-3 py-2 border rounded-lg text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                        customVisible
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {customVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{customVisible ? 'Public in Library' : 'Hidden (Admin Only)'}</span>
                    </button>
                  </div>
                </div>

                {/* DESTINATION FOLDER SELECTOR */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[var(--text-main)]">
                      Destination Folder
                    </label>
                    <span className="text-[11px] text-[var(--gold)] font-medium">
                      {getDestinationDisplay()}
                    </span>
                  </div>

                  {/* Folder Structure Selector Tree */}
                  <div className="bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg p-2.5 max-h-48 overflow-y-auto space-y-1">
                    {/* Search inside folder selector */}
                    <div className="relative mb-2">
                      <Search className="w-3 h-3 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={folderSearch}
                        onChange={(e) => setFolderSearch(e.target.value)}
                        placeholder="Search folders..."
                        className="w-full pl-7 pr-2 py-1 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-[11px] focus:outline-none focus:border-[var(--gold)]"
                      />
                    </div>

                    {rootCategories
                      .filter((cat) => {
                        if (!folderSearch.trim()) return true;
                        const q = folderSearch.toLowerCase();
                        const subMatch = getSubfolders(cat.id).some((s) => s.name.toLowerCase().includes(q));
                        return cat.name.toLowerCase().includes(q) || subMatch;
                      })
                      .map((cat) => {
                        const subfolders = getSubfolders(cat.id);
                        const isExpanded = expandedFolders.has(cat.id);
                        const isCatSelected = selectedFolderId === cat.id && !selectedSubfolderId;

                        return (
                          <div key={cat.id} className="space-y-0.5">
                            <div
                              onClick={() => {
                                setSelectedFolderId(cat.id);
                                setSelectedSubfolderId(null);
                              }}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                                isCatSelected
                                  ? 'bg-[var(--gold)]/20 text-[var(--gold)] font-semibold border border-[var(--gold)]/30'
                                  : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {subfolders.length > 0 ? (
                                  <button
                                    onClick={(e) => toggleFolderExpand(cat.id, e)}
                                    className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5 text-[var(--gold)]" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-3.5" />
                                )}
                                <FolderIcon className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                                <span className="truncate">{cat.name}</span>
                              </div>

                              {isCatSelected && <Check className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />}
                            </div>

                            {/* Subfolder list */}
                            {isExpanded &&
                              subfolders.map((sub) => {
                                const isSubSelected = selectedSubfolderId === sub.id;
                                return (
                                  <div
                                    key={sub.id}
                                    onClick={() => {
                                      setSelectedFolderId(cat.id);
                                      setSelectedSubfolderId(sub.id);
                                    }}
                                    className={`ml-6 flex items-center justify-between px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                                      isSubSelected
                                        ? 'bg-[var(--gold)]/20 text-[var(--gold)] font-semibold border border-[var(--gold)]/30'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FolderIcon className="w-3 h-3 text-[var(--gold)]/70 shrink-0" />
                                      <span className="truncate">{sub.name}</span>
                                    </div>
                                    {isSubSelected && <Check className="w-3 h-3 text-[var(--gold)] shrink-0" />}
                                  </div>
                                );
                              })}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-main)]">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-3.5 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change URL</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteImport}
                    className="px-5 py-2 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Start Import</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Importing / In Progress */}
          {step === 'importing' && (
            <div className="py-8 space-y-6 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/40 mx-auto flex items-center justify-center text-[var(--gold)]">
                <RefreshCw className="w-7 h-7 animate-spin text-[var(--gold)]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[var(--text-main)]">Importing Remote File</h3>
                <p className="text-xs font-medium text-[var(--gold)]">{importProgressText}</p>
                <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto truncate" title={customTitle}>
                  "{customTitle}"
                </p>
              </div>

              {/* Progress Steps List */}
              <div className="max-w-xs mx-auto text-left space-y-2 bg-[var(--bg-card)] border border-[var(--border-main)] p-3.5 rounded-lg text-xs">
                <div
                  className={`flex items-center gap-2.5 ${
                    ['connecting', 'downloading', 'uploading', 'saving', 'completed'].includes(importProgressPhase)
                      ? 'text-emerald-400 font-medium'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>1. Validated security & headers</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 ${
                    ['downloading', 'uploading', 'saving', 'completed'].includes(importProgressPhase)
                      ? 'text-emerald-400 font-medium'
                      : importProgressPhase === 'connecting'
                      ? 'text-[var(--gold)] font-medium animate-pulse'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {['downloading', 'uploading', 'saving', 'completed'].includes(importProgressPhase) ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  )}
                  <span>2. Streaming remote file</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 ${
                    ['uploading', 'saving', 'completed'].includes(importProgressPhase)
                      ? 'text-emerald-400 font-medium'
                      : importProgressPhase === 'downloading'
                      ? 'text-[var(--gold)] font-medium animate-pulse'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {['uploading', 'saving', 'completed'].includes(importProgressPhase) ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  )}
                  <span>3. Uploading to Google Drive</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 ${
                    importProgressPhase === 'completed'
                      ? 'text-emerald-400 font-medium'
                      : importProgressPhase === 'saving'
                      ? 'text-[var(--gold)] font-medium animate-pulse'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {importProgressPhase === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  )}
                  <span>4. Updating library catalog</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCancelOperation}
                  className="px-4 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/20 border border-rose-500/20 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel Import
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success State */}
          {step === 'success' && (
            <div className="py-8 space-y-5 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[var(--text-main)]">Imported Successfully!</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  The file has been saved to your library and is ready to read or manage.
                </p>
              </div>

              <div className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl max-w-md mx-auto text-left space-y-2 text-xs">
                <div>
                  <span className="text-[var(--text-muted)] text-[10px] uppercase block">Item Title</span>
                  <span className="font-bold text-[var(--text-main)]">{successBookTitle}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] text-[10px] uppercase block">Destination Folder</span>
                  <span className="font-semibold text-[var(--gold)]">{successFolderName}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('');
                    setStep('input');
                    setDetectedInfo(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-main)] bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Import Another URL</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Error State */}
          {step === 'error' && (
            <div className="py-6 space-y-5 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[var(--text-main)]">Import Failed</h3>
                <p className="text-xs text-rose-300 max-w-md mx-auto">{errorMessage || 'An unknown error occurred.'}</p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setStep('input');
                  }}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)] rounded-lg transition-colors cursor-pointer"
                >
                  Edit URL
                </button>

                <button
                  type="button"
                  onClick={detectedInfo ? handleExecuteImport : () => handleInspectUrl()}
                  className="px-5 py-2 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
