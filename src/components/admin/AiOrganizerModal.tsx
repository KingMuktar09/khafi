import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Check,
  CheckCheck,
  X,
  Edit2,
  FolderPlus,
  Folder,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Search,
  BookOpen,
  Tag,
  FileText,
  Sliders,
  Layers,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  Send,
  Hash,
  Compass,
  Cpu,
  Activity,
} from 'lucide-react';
import { AIOrganizationProposal, AIOrganizerStatus, Book, Folder as FolderType } from '../../types';
import { api } from '../../services/api';
import { appState } from '../../state/appState';

interface AiOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderType[];
  books: Book[];
  onCatalogUpdated: () => void;
}

export const AiOrganizerModal: React.FC<AiOrganizerModalProps> = ({
  isOpen,
  onClose,
  folders,
  books,
  onCatalogUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'scan' | 'similarity' | 'history'>('queue');
  const [status, setStatus] = useState<AIOrganizerStatus | null>(null);
  const [proposals, setProposals] = useState<AIOrganizationProposal[]>([]);
  const [allProposals, setAllProposals] = useState<AIOrganizationProposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Filter & Search
  const [filterType, setFilterType] = useState<'all' | 'high' | 'review' | 'duplicates'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Edit Modal State
  const [editingProposal, setEditingProposal] = useState<AIOrganizationProposal | null>(null);
  const [editForm, setEditForm] = useState<{
    suggestedTitle: string;
    suggestedAuthor: string;
    suggestedFilename: string;
    suggestedFolderId: string | null;
    suggestedFolderName: string;
    suggestedParentFolderId: string | null;
    suggestedCategory: string;
    suggestedSubcategory: string;
    suggestedLanguage: string;
    volume: string;
    edition: string;
    tags: string;
  }>({
    suggestedTitle: '',
    suggestedAuthor: '',
    suggestedFilename: '',
    suggestedFolderId: null,
    suggestedFolderName: '',
    suggestedParentFolderId: null,
    suggestedCategory: '',
    suggestedSubcategory: '',
    suggestedLanguage: 'English',
    volume: '',
    edition: '',
    tags: '',
  });

  // Scan Tab State
  const [scanning, setScanning] = useState(false);
  const [selectedScanBookIds, setSelectedScanBookIds] = useState<Set<string>>(new Set());

  // Diagnostic State
  const [diagReport, setDiagReport] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  // Trigger Diagnostic
  const handleRunDiagnostic = async () => {
    setDiagLoading(true);
    setDiagReport(null);
    try {
      const res = await api.getNvidiaDiagnostic();
      setDiagReport(res);
      if (res.success) {
        appState.showToast('NVIDIA APIs diagnostic test PASSED!', 'success');
      } else {
        appState.showToast('NVIDIA API diagnostic finished with status check.', 'info');
      }
    } catch (err: any) {
      appState.showToast(err?.message || 'Diagnostic failed.', 'error');
    } finally {
      setDiagLoading(false);
    }
  };

  // Semantic Similarity Sandbox State
  const [simTextA, setSimTextA] = useState('');
  const [simTextB, setSimTextB] = useState('');
  const [simResult, setSimResult] = useState<any>(null);
  const [simLoading, setSimLoading] = useState(false);

  // Load Status and Proposals
  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, pendingRes, allRes] = await Promise.all([
        api.getAiOrganizerStatus(),
        api.getAiPendingProposals(),
        api.getAllAiProposals(),
      ]);

      if (statusRes) setStatus(statusRes);
      if (pendingRes?.proposals) setProposals(pendingRes.proposals);
      if (allRes?.proposals) setAllProposals(allRes.proposals);
    } catch (err) {
      console.error('Failed to load AI organizer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered Proposals
  const pendingProposals = proposals.filter((p) => p.status === 'pending');
  const historyProposals = allProposals.filter((p) => p.status !== 'pending');

  const filteredQueue = pendingProposals.filter((p) => {
    if (filterType === 'high' && (p.confidence || 0) < 0.85) return false;
    if (filterType === 'review' && (p.confidence || 0) >= 0.85) return false;
    if (filterType === 'duplicates' && !p.possibleDuplicate) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.originalFilename.toLowerCase().includes(q) ||
        p.suggestedTitle.toLowerCase().includes(q) ||
        p.suggestedAuthor.toLowerCase().includes(q) ||
        p.suggestedCategory.toLowerCase().includes(q) ||
        p.suggestedFolderName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Toggle selection
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAllFiltered = () => {
    if (selectedIds.size === filteredQueue.length && filteredQueue.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQueue.map((p) => p.id)));
    }
  };

  // Single Approve
  const handleApprove = async (proposal: AIOrganizationProposal, customEdits?: any) => {
    setActionLoadingId(proposal.id);
    try {
      const res = await api.approveAiProposal(proposal.id, customEdits);
      if (res.success) {
        appState.showToast(`Applied organization for "${proposal.suggestedTitle}".`, 'success');
        setProposals((prev) => prev.filter((p) => p.id !== proposal.id));
        setAllProposals((prev) =>
          prev.map((p) => (p.id === proposal.id ? { ...p, status: 'applied' } : p))
        );
        selectedIds.delete(proposal.id);
        setSelectedIds(new Set(selectedIds));
        onCatalogUpdated();
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Failed to apply proposal.', 'error');
      }
    } catch (err: any) {
      appState.showToast(err?.message || 'Error applying proposal.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Single Reject
  const handleReject = async (proposalId: string) => {
    setActionLoadingId(proposalId);
    try {
      const res = await api.rejectAiProposal(proposalId);
      if (res.success) {
        appState.showToast('Proposal dismissed.', 'info');
        setProposals((prev) => prev.filter((p) => p.id !== proposalId));
        setAllProposals((prev) =>
          prev.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' } : p))
        );
        selectedIds.delete(proposalId);
        setSelectedIds(new Set(selectedIds));
      } else {
        appState.showToast(res.error || 'Failed to reject proposal.', 'error');
      }
    } catch (err: any) {
      appState.showToast(err?.message || 'Error rejecting proposal.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Bulk Approve Selected
  const handleBulkApproveSelected = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      const res = await api.bulkAiAction('approve-selected', Array.from(selectedIds));
      if (res.success) {
        appState.showToast(`Successfully organized ${res.processed || selectedIds.size} files.`, 'success');
        setSelectedIds(new Set());
        await loadData();
        onCatalogUpdated();
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Bulk approve failed.', 'error');
      }
    } catch (err: any) {
      appState.showToast(err?.message || 'Bulk approve error.', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  // Bulk Approve High Confidence
  const handleBulkApproveHighConfidence = async () => {
    setBulkLoading(true);
    try {
      const res = await api.bulkAiAction('approve-all-high-confidence', undefined, 0.85);
      if (res.success) {
        appState.showToast(`Applied ${res.processed || 0} high-confidence proposals.`, 'success');
        await loadData();
        onCatalogUpdated();
        await appState.loadCatalog();
      } else {
        appState.showToast(res.error || 'Bulk approval failed.', 'error');
      }
    } catch (err: any) {
      appState.showToast(err?.message || 'Error approving high-confidence proposals.', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  // Bulk Reject Selected
  const handleBulkRejectSelected = async () => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      const res = await api.bulkAiAction('reject-selected', Array.from(selectedIds));
      if (res.success) {
        appState.showToast(`Dismissed ${res.processed || selectedIds.size} proposals.`, 'info');
        setSelectedIds(new Set());
        await loadData();
      } else {
        appState.showToast(res.error || 'Bulk reject failed.', 'error');
      }
    } catch (err: any) {
      appState.showToast(err?.message || 'Error rejecting proposals.', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  // Trigger Scan
  const handleRunScan = async (unorganizedOnly: boolean = true, useSelected: boolean = false) => {
    setScanning(true);
    try {
      const payload: any = {};
      if (useSelected && selectedScanBookIds.size > 0) {
        payload.bookIds = Array.from(selectedScanBookIds);
      } else if (unorganizedOnly) {
        payload.unorganizedOnly = true;
      }

      const itemCount = payload.bookIds ? payload.bookIds.length : (unorganizedOnly ? unorganizedBooks.length : books.length);
      appState.showToast(`AI Organizer analyzing ${itemCount} file(s) via Muse Glimmer 30B & Nemotron Embed 1B...`, 'info');

      const res = await api.analyzeWithAi(payload);

      if (res.success && res.proposals && res.proposals.length > 0) {
        appState.showToast(`Generated ${res.proposals.length} organization proposal(s).`, 'success');
        setSelectedScanBookIds(new Set());
        setActiveTab('queue');
        await loadData();
      } else if (res.success) {
        appState.showToast('Analysis complete. No new proposals required or items already organized.', 'info');
        setSelectedScanBookIds(new Set());
        await loadData();
      } else {
        appState.showToast(res.error || 'AI analysis produced no proposals.', 'error');
      }
    } catch (err: any) {
      appState.showToast(err?.message || 'AI scan error.', 'error');
    } finally {
      setScanning(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (p: AIOrganizationProposal) => {
    setEditingProposal(p);
    setEditForm({
      suggestedTitle: p.suggestedTitle,
      suggestedAuthor: p.suggestedAuthor,
      suggestedFilename: p.suggestedFilename,
      suggestedFolderId: p.suggestedFolderId,
      suggestedFolderName: p.suggestedFolderName,
      suggestedParentFolderId: p.suggestedParentFolderId,
      suggestedCategory: p.suggestedCategory,
      suggestedSubcategory: p.suggestedSubcategory || '',
      suggestedLanguage: p.suggestedLanguage || 'English',
      volume: p.volume || '',
      edition: p.edition || '',
      tags: (p.tags || []).join(', '),
    });
  };

  const handleSaveAndApprove = async () => {
    if (!editingProposal) return;
    const overrides = {
      suggestedTitle: editForm.suggestedTitle.trim(),
      suggestedAuthor: editForm.suggestedAuthor.trim(),
      suggestedFilename: editForm.suggestedFilename.trim(),
      suggestedFolderId: editForm.suggestedFolderId,
      suggestedFolderName: editForm.suggestedFolderName.trim(),
      suggestedParentFolderId: editForm.suggestedParentFolderId,
      suggestedCategory: editForm.suggestedCategory.trim(),
      suggestedSubcategory: editForm.suggestedSubcategory.trim(),
      suggestedLanguage: editForm.suggestedLanguage.trim(),
      volume: editForm.volume.trim(),
      edition: editForm.edition.trim(),
      tags: editForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    await handleApprove(editingProposal, overrides);
    setEditingProposal(null);
  };

  // Run Semantic Similarity Test
  const handleRunSimilarity = async () => {
    if (!simTextA.trim()) {
      appState.showToast('Please enter text to test similarity.', 'error');
      return;
    }
    setSimLoading(true);
    try {
      const res = await api.calculateAiSimilarity({
        textA: simTextA,
        textB: simTextB.trim() ? simTextB : undefined,
        compareWithFolders: true,
        compareWithBooks: true,
      });
      if (res.success) {
        setSimResult(res);
      } else {
        appState.showToast(res.error || 'Similarity calculation failed.', 'error');
      }
    } catch (err: any) {
      appState.showToast(err?.message || 'Error calculating similarity.', 'error');
    } finally {
      setSimLoading(false);
    }
  };

  // Unorganized books count
  const unorganizedBooks = books.filter(
    (b) => !b.folderId || b.folderId === 'f-general' || !b.subfolderId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-5xl h-[90vh] max-h-[860px] bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-xl shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-main)] bg-[var(--bg-main)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] font-serif tracking-wide">
                  AI Library Organizer
                </h2>
                {status?.configured ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    NVIDIA NIM Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Key Not Configured
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Reasoning: <span className="font-mono text-[var(--text-main)]">{status?.organizerModel || 'meta/muse-glimmer-30b'}</span> • Embeddings: <span className="font-mono text-[var(--text-main)]">{status?.embeddingModel || 'nvidia/nemotron-3-embed-1b'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              title="Refresh Proposals"
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-md transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 border-b border-[var(--border-main)] bg-[var(--bg-panel)] shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-[var(--gold)] text-black shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Proposals Queue</span>
              {pendingProposals.length > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                    activeTab === 'queue' ? 'bg-black/20 text-black' : 'bg-[var(--gold)]/20 text-[var(--gold)]'
                  }`}
                >
                  {pendingProposals.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'scan'
                  ? 'bg-[var(--gold)] text-black shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Scan & Analyze</span>
              {unorganizedBooks.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-400 font-bold rounded-full">
                  {unorganizedBooks.length} unorganized
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('similarity')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'similarity'
                  ? 'bg-[var(--gold)] text-black shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Nemotron Similarity Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[var(--gold)] text-black shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>History ({historyProposals.length})</span>
            </button>
          </div>

          {activeTab === 'queue' && pendingProposals.length > 0 && (
            <div className="flex items-center gap-2 py-2">
              <button
                onClick={handleBulkApproveHighConfidence}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-md transition-colors cursor-pointer"
                title="Approve all proposals with confidence >= 85%"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Approve High Confidence (≥85%)</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[var(--bg-main)]">
          
          {/* TAB 1: PROPOSALS QUEUE */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              {/* Not Configured Banner */}
              {!status?.configured && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3 text-amber-300 text-xs">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-200">NVIDIA NIM Keys Configuration</h4>
                    <p className="mt-1 text-amber-300/80 leading-relaxed">
                      To enable AI classification and embeddings, provide <code className="px-1 py-0.5 bg-black/40 rounded font-mono text-[var(--gold)]">NVIDIA_MUSE_API_KEY</code> (for Muse Glimmer 30B) and <code className="px-1 py-0.5 bg-black/40 rounded font-mono text-[var(--gold)]">NVIDIA_EMBEDDING_API_KEY</code> (for Nemotron Embed 1B) in your server environment variables.
                      All normal library functions remain fully operational.
                    </p>
                  </div>
                </div>
              )}

              {/* Filters and Search Bar */}
              {pendingProposals.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-lg">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={selectAllFiltered}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[var(--text-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredQueue.length && filteredQueue.length > 0}
                        onChange={() => {}}
                        className="rounded border-[var(--border-main)] text-[var(--gold)] focus:ring-0 cursor-pointer"
                      />
                      <span>Select All ({filteredQueue.length})</span>
                    </button>

                    {selectedIds.size > 0 && (
                      <>
                        <button
                          onClick={handleBulkApproveSelected}
                          disabled={bulkLoading}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Selected ({selectedIds.size})</span>
                        </button>

                        <button
                          onClick={handleBulkRejectSelected}
                          disabled={bulkLoading}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject Selected</span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Category Filter */}
                    <div className="flex items-center bg-[var(--bg-main)] border border-[var(--border-main)] rounded text-xs p-0.5">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`px-2.5 py-1 rounded transition-colors ${filterType === 'all' ? 'bg-[var(--bg-panel)] text-[var(--gold)] font-semibold' : 'text-[var(--text-muted)]'}`}
                      >
                        All ({pendingProposals.length})
                      </button>
                      <button
                        onClick={() => setFilterType('high')}
                        className={`px-2.5 py-1 rounded transition-colors ${filterType === 'high' ? 'bg-[var(--bg-panel)] text-emerald-400 font-semibold' : 'text-[var(--text-muted)]'}`}
                      >
                        High Conf (≥85%)
                      </button>
                      <button
                        onClick={() => setFilterType('review')}
                        className={`px-2.5 py-1 rounded transition-colors ${filterType === 'review' ? 'bg-[var(--bg-panel)] text-amber-400 font-semibold' : 'text-[var(--text-muted)]'}`}
                      >
                        Needs Review
                      </button>
                      <button
                        onClick={() => setFilterType('duplicates')}
                        className={`px-2.5 py-1 rounded transition-colors ${filterType === 'duplicates' ? 'bg-[var(--bg-panel)] text-rose-400 font-semibold' : 'text-[var(--text-muted)]'}`}
                      >
                        Duplicates
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search proposals..."
                        className="pl-8 pr-3 py-1 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded text-xs focus:outline-none focus:border-[var(--gold)] w-44 sm:w-56"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Proposals Cards List */}
              {filteredQueue.length > 0 ? (
                <div className="space-y-3.5">
                  {filteredQueue.map((p) => {
                    const isSelected = selectedIds.has(p.id);
                    const isActing = actionLoadingId === p.id;
                    const confidencePct = Math.round((p.confidence || 0.85) * 100);

                    return (
                      <div
                        key={p.id}
                        className={`p-4 bg-[var(--bg-panel)] border rounded-xl transition-all ${
                          isSelected
                            ? 'border-[var(--gold)] shadow-md bg-[var(--bg-panel)]'
                            : 'border-[var(--border-main)] hover:border-[var(--border-hover)]'
                        }`}
                      >
                        {/* Card Top Row */}
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--border-main)]/60">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(p.id)}
                              className="rounded border-[var(--border-main)] text-[var(--gold)] focus:ring-0 cursor-pointer mt-0.5"
                            />
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 rounded uppercase tracking-wider">
                              {p.documentType || 'Book'}
                            </span>
                            <span className="text-xs font-mono text-[var(--text-muted)] truncate max-w-xs sm:max-w-md">
                              {p.originalFilename}
                            </span>
                            {p.fileSize && (
                              <span className="text-[11px] text-[var(--text-faint)] font-mono">
                                ({p.fileSize})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Confidence Pill */}
                            <div
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                                confidencePct >= 85
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : confidencePct >= 65
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {confidencePct}% Confidence
                            </div>

                            {p.semanticSimilarityScore && (
                              <div className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30" title="Nemotron Embedding Match">
                                {p.semanticSimilarityScore}% Similarity
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Duplicate Alert Banner */}
                        {p.possibleDuplicate && p.duplicateDetails && (
                          <div className="my-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-amber-300 text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-semibold text-amber-200">Potential Duplicate Detected ({p.duplicateDetails.similarity}% match):</span>{' '}
                              An existing book <strong className="text-[var(--gold)]">"{p.duplicateDetails.matchedBookTitle}"</strong> already exists in folder <strong className="text-[var(--gold)]">{p.duplicateDetails.matchedFolder}</strong>.
                            </div>
                          </div>
                        )}

                        {/* Comparison Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 text-xs">
                          {/* Left: Proposed Organization */}
                          <div className="p-3 bg-[var(--bg-main)]/60 border border-[var(--border-main)] rounded-lg space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-[var(--gold)] font-semibold border-b border-[var(--border-main)] pb-1.5">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Proposed Metadata
                              </span>
                              {p.isNewFolderSuggested && (
                                <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[9px] font-bold">
                                  + New Folder
                                </span>
                              )}
                            </div>

                            <div className="space-y-1.5 pt-0.5">
                              <div>
                                <span className="text-[var(--text-muted)]">Title: </span>
                                <span className="font-semibold text-[var(--text-main)]">{p.suggestedTitle}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-[var(--text-muted)]">Author: </span>
                                  <span className="text-[var(--text-main)]">{p.suggestedAuthor || 'Unspecified'}</span>
                                </div>
                                <div>
                                  <span className="text-[var(--text-muted)]">Language: </span>
                                  <span className="text-[var(--text-main)]">{p.suggestedLanguage || 'English'}</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-[var(--text-muted)]">Standardized Filename: </span>
                                <span className="font-mono text-[11px] text-emerald-400 break-all">{p.suggestedFilename}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[var(--gold)] font-medium">
                                <Folder className="w-3.5 h-3.5 shrink-0" />
                                <span>Destination: <strong>{p.suggestedFolderPath || p.suggestedFolderName}</strong></span>
                              </div>
                              {p.tags && p.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {p.tags.map((t, idx) => (
                                    <span key={idx} className="px-1.5 py-0.2 text-[10px] bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-main)] rounded">
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: AI Scholarly Rationale */}
                          <div className="p-3 bg-[var(--bg-main)]/60 border border-[var(--border-main)] rounded-lg flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-semibold border-b border-[var(--border-main)] pb-1.5">
                                <Bot className="w-3.5 h-3.5 text-[var(--gold)]" />
                                <span>Scholarly AI Reasoning</span>
                              </div>
                              <p className="mt-2 text-xs text-[var(--text-main)] italic leading-relaxed">
                                "{p.reason}"
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-[var(--border-main)]/50 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                              <span>Current Location: <strong className="text-[var(--text-main)]">{p.currentLocation.folderName}</strong></span>
                              <span className="font-mono text-[10px] text-[var(--text-faint)]">
                                {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-main)]/60">
                          <button
                            onClick={() => handleReject(p.id)}
                            disabled={isActing}
                            className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>

                          <button
                            onClick={() => openEditModal(p)}
                            disabled={isActing}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--text-main)] bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[var(--gold)]" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            onClick={() => handleApprove(p)}
                            disabled={isActing}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded transition-colors cursor-pointer shadow-xs"
                          >
                            {isActing ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            <span>Approve & Move</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Queue State */
                <div className="py-16 text-center space-y-4">
                  <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-main)]">
                      All Proposals Reviewed
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1">
                      There are no pending AI organization proposals waiting for approval. You can scan unorganized books or test new files anytime.
                    </p>
                  </div>
                  <button
                    onClick={() => handleRunScan(true)}
                    disabled={scanning}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded-lg transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Scan Unorganized Library Items</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCAN & ANALYZE */}
          {activeTab === 'scan' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* API Diagnostic & Connectivity */}
              <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                      NVIDIA NIM Health & API Diagnostic
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Verify live response times for meta/muse-glimmer-30b and nvidia/nemotron-3-embed-1b models.
                    </p>
                  </div>
                  <button
                    onClick={handleRunDiagnostic}
                    disabled={diagLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {diagLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                    <span>Test APIs Live</span>
                  </button>
                </div>

                {diagReport && (
                  <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Reasoning (Muse Glimmer 30B):</span>
                      <span className={diagReport.NVIDIA_MUSE_API?.success ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                        {diagReport.NVIDIA_MUSE_API?.success ? `PASS (${diagReport.NVIDIA_MUSE_API.responseTimeMs}ms)` : `FAIL (${diagReport.NVIDIA_MUSE_API?.message || "Error"})`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Embeddings (Nemotron Embed 1B):</span>
                      <span className={diagReport.NVIDIA_EMBEDDING_API?.success ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                        {diagReport.NVIDIA_EMBEDDING_API?.success ? `PASS (${diagReport.NVIDIA_EMBEDDING_API.responseTimeMs}ms)` : `FAIL (${diagReport.NVIDIA_EMBEDDING_API?.message || "Error"})`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[var(--gold)]/10 text-[var(--gold)] rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">
                      Auto-Scan & Analyze Library
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Let Muse Glimmer 30B inspect document headers, table of contents, and categorize items into existing folders or propose new subcategories.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-main)]">Unorganized Items</span>
                      <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded-full font-bold">
                        {unorganizedBooks.length} items
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Items residing in root or the default "General" collection without specific subfolders.
                    </p>
                    <button
                      onClick={() => handleRunScan(true)}
                      disabled={scanning || unorganizedBooks.length === 0}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-50 text-black rounded transition-colors cursor-pointer"
                    >
                      {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                      <span>Analyze All Unorganized</span>
                    </button>
                  </div>

                  <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-main)]">Full Library Catalog</span>
                      <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full font-bold">
                        {books.length} items
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Re-evaluate existing library documents to find optimal standardized filenames and detect duplicate titles.
                    </p>
                    <button
                      onClick={() => handleRunScan(false)}
                      disabled={scanning || books.length === 0}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-[var(--bg-panel)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] rounded transition-colors cursor-pointer"
                    >
                      {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
                      <span>Evaluate Entire Catalog</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Specific Items Selection */}
              <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                  Select Specific Items for Analysis
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-2">
                  {books.map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center justify-between p-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-lg cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <input
                          type="checkbox"
                          checked={selectedScanBookIds.has(b.id)}
                          onChange={() => {
                            const next = new Set(selectedScanBookIds);
                            if (next.has(b.id)) next.delete(b.id);
                            else next.add(b.id);
                            setSelectedScanBookIds(next);
                          }}
                          className="rounded border-[var(--border-main)] text-[var(--gold)] focus:ring-0"
                        />
                        <span className="font-semibold text-[var(--text-main)] truncate">{b.title}</span>
                        <span className="text-[var(--text-muted)] font-mono text-[11px]">({b.category})</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-faint)]">{b.originalFilename}</span>
                    </label>
                  ))}
                </div>

                {selectedScanBookIds.size > 0 && (
                  <button
                    onClick={() => handleRunScan(false, true)}
                    disabled={scanning}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded transition-colors cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Analyze Selected Items ({selectedScanBookIds.size})</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NEMOTRON SIMILARITY SANDBOX */}
          {activeTab === 'similarity' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">
                      NVIDIA Nemotron-3-Embed-1B Similarity Explorer
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Compute high-dimensional vector embeddings to test semantic closeness between texts, categories, and existing library holdings.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                      Query Text or Excerpt (Text A):
                    </label>
                    <textarea
                      rows={3}
                      value={simTextA}
                      onChange={(e) => setSimTextA(e.target.value)}
                      placeholder="e.g. Sahih al-Bukhari commentary on the revelation of divine knowledge..."
                      className="w-full p-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                      Optional Target Comparison (Text B):
                    </label>
                    <textarea
                      rows={2}
                      value={simTextB}
                      onChange={(e) => setSimTextB(e.target.value)}
                      placeholder="e.g. Hadith and prophetic narrations collections..."
                      className="w-full p-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>

                  <button
                    onClick={handleRunSimilarity}
                    disabled={simLoading || !simTextA.trim()}
                    className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-50 text-black rounded-lg transition-colors cursor-pointer"
                  >
                    {simLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Calculate Embeddings & Similarity</span>
                  </button>
                </div>
              </div>

              {/* Similarity Results */}
              {simResult && (
                <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-xl space-y-4 animate-in fade-in">
                  {simResult.similarity !== undefined && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-200">Cosine Similarity (A vs B):</span>
                      <span className="text-lg font-bold font-mono text-blue-400">{simResult.similarity}%</span>
                    </div>
                  )}

                  {simResult.folderRankings && simResult.folderRankings.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-2">
                        Top Matching Library Folders
                      </h4>
                      <div className="space-y-1.5">
                        {simResult.folderRankings.map((f: any) => (
                          <div key={f.id} className="flex items-center justify-between p-2 bg-[var(--bg-main)] border border-[var(--border-main)] rounded text-xs">
                            <span className="font-semibold text-[var(--text-main)]">{f.name}</span>
                            <span className="font-mono text-emerald-400 font-bold">{f.similarity}% Match</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {simResult.bookRankings && simResult.bookRankings.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-2">
                        Top Matching Books in Library
                      </h4>
                      <div className="space-y-1.5">
                        {simResult.bookRankings.map((b: any) => (
                          <div key={b.id} className="flex items-center justify-between p-2 bg-[var(--bg-main)] border border-[var(--border-main)] rounded text-xs">
                            <div>
                              <span className="font-semibold text-[var(--text-main)]">{b.title}</span>
                              <span className="text-[var(--text-muted)] text-[11px] ml-2">by {b.author}</span>
                            </div>
                            <span className="font-mono text-blue-400 font-bold">{b.similarity}% Match</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {historyProposals.length > 0 ? (
                historyProposals.map((p) => (
                  <div key={p.id} className="p-3.5 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                          p.status === 'applied' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                        <span className="font-semibold text-[var(--text-main)]">{p.suggestedTitle}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        Folder: <strong>{p.suggestedFolderPath || p.suggestedFolderName}</strong> • Filename: <span className="font-mono text-[10px]">{p.suggestedFilename}</span>
                      </p>
                    </div>

                    <span className="text-[10px] text-[var(--text-faint)] font-mono shrink-0">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                  No organization history recorded yet.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Edit Proposal Modal */}
        {editingProposal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-main)] bg-[var(--bg-main)]">
                <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[var(--gold)]" />
                  Edit AI Organization Proposal
                </h3>
                <button
                  onClick={() => setEditingProposal(null)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto text-xs">
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.suggestedTitle}
                    onChange={(e) => setEditForm({ ...editForm, suggestedTitle: e.target.value })}
                    className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">Author</label>
                    <input
                      type="text"
                      value={editForm.suggestedAuthor}
                      onChange={(e) => setEditForm({ ...editForm, suggestedAuthor: e.target.value })}
                      className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">Language</label>
                    <input
                      type="text"
                      value={editForm.suggestedLanguage}
                      onChange={(e) => setEditForm({ ...editForm, suggestedLanguage: e.target.value })}
                      className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">Standardized Filename</label>
                  <input
                    type="text"
                    value={editForm.suggestedFilename}
                    onChange={(e) => setEditForm({ ...editForm, suggestedFilename: e.target.value })}
                    className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] font-mono text-[11px] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                {/* Target Folder Selector */}
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">Destination Folder</label>
                  <select
                    value={editForm.suggestedFolderId || ''}
                    onChange={(e) => {
                      const selectedF = folders.find((f) => f.id === e.target.value);
                      setEditForm({
                        ...editForm,
                        suggestedFolderId: e.target.value || null,
                        suggestedFolderName: selectedF ? selectedF.name : editForm.suggestedFolderName,
                        suggestedCategory: selectedF ? selectedF.name : editForm.suggestedCategory,
                      });
                    }}
                    className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                  >
                    <option value="">-- Custom / Create New Folder Below --</option>
                    {folders.map((f) => {
                      const parent = f.parentId ? folders.find((p) => p.id === f.parentId) : null;
                      const label = parent ? `${parent.name} / ${f.name}` : f.name;
                      return (
                        <option key={f.id} value={f.id}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {!editForm.suggestedFolderId && (
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">New Folder Name</label>
                    <input
                      type="text"
                      value={editForm.suggestedFolderName}
                      onChange={(e) => setEditForm({ ...editForm, suggestedFolderName: e.target.value })}
                      placeholder="e.g. Seerah or Quran / Tafsir"
                      className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">Volume (optional)</label>
                    <input
                      type="text"
                      value={editForm.volume}
                      onChange={(e) => setEditForm({ ...editForm, volume: e.target.value })}
                      placeholder="Volume 1"
                      className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">Edition (optional)</label>
                    <input
                      type="text"
                      value={editForm.edition}
                      onChange={(e) => setEditForm({ ...editForm, edition: e.target.value })}
                      placeholder="2nd Edition"
                      className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="Islam, Seerah, Biography"
                    className="w-full p-2 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border-main)] bg-[var(--bg-main)]">
                <button
                  onClick={() => setEditingProposal(null)}
                  className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndApprove}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black rounded transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Approve</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
