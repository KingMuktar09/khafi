import React, { useCallback, useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { appState } from '../state/appState';
import { t, tf } from '../data/i18n';
import { BookGrid } from '../components/books/BookGrid';
import { CompactAdvisoryBanner } from '../components/ui/CompactAdvisoryBanner';
import { RefreshCw, AlertTriangle, LayoutGrid, FileText, BookOpen, ShieldCheck, Search, Upload } from 'lucide-react';
// Admin-only, opened on click: lazy so the upload modal (and its
// cover-extraction chain) is not in the Library chunk on first load.
const UploadFileModal = lazy(() => import('../components/folders/UploadFileModal').then((m) => ({ default: m.UploadFileModal })));
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { api } from '../services/api';
import { Book } from '../types';
import { cleanLabel } from '../utils/bookOrder';
import type { ShelfStatus } from '../data/tools';

import { TOPIC_GROUPS, groupForCategory, topicGroupCounts } from '../data/topicGroups';

type TypeFilter = 'all' | 'pdf' | 'notes';
type StatusFilter = 'all' | ShelfStatus | 'not-shelf';
type SortBy = 'arranged' | 'title' | 'topic' | 'date';

/**
 * The Library page — books, NOT folders.
 *
 * There is no folder navigation here on purpose: the default view is flat
 * All Books, grouped by topic inside each category, as book cards with
 * cover, title, topic, version and Authentic badges. A reader never has
 * to open a folder to find a book. Folder ids still exist in the data
 * (they say where a file lives on Drive) but they are never shown as a
 * way to browse — category and topic chips, search and the cards are.
 */
export const LibraryView: React.FC = () => {
  const { searchQuery, category: routeCategory } = appState.route;
  const lang = appState.settings.language;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(routeCategory || null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    routeCategory ? groupForCategory(routeCategory)?.id || null : null
  );
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [authenticOnly, setAuthenticOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('arranged');
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  // Debounce the search box: without this, every keystroke re-filters
  // and re-renders all 138 book cards at once, which hangs typing on
  // slow phones. The list only re-filters 150 ms after the last keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery || '');
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(localSearch), 150);
    return () => window.clearTimeout(t);
  }, [localSearch]);
  // Admin "Upload a book here" modal, opened from a category header.
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFolderId, setUploadFolderId] = useState<string | null>(null);
  // The modal is only mounted after its first open, so its lazy chunk
  // downloads on the admin's click, not on the Library's first load.
  // It stays mounted afterwards, so an in-progress upload queue is
  // not lost when the modal is closed and reopened.
  const [uploadModalMounted, setUploadModalMounted] = useState(false);
  const openUploadModal = useCallback((folderId: string | null) => {
    setUploadFolderId(folderId);
    setUploadModalMounted(true);
    setUploadModalOpen(true);
  }, []);
  // Admin delete from the Library: the book waiting for confirmation.
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete the book's catalog entry only — the Drive file is never
  // deleted. Same endpoint and same durable-save behaviour as the admin
  // panel (GitHub commit when GITHUB_SYNC_TOKEN is set).
  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteBook(deleteTarget.id);
      if (res.success) {
        const suffix =
          res.durable === true
            ? 'Saved permanently.'
            : t('library.savedForNow', lang);
        appState.showToast(
          tf('library.deleteSuccess', lang, { title: deleteTarget.title, suffix }),
          res.durable === true ? 'success' : 'info'
        );
        await appState.loadCatalog();
        setDeleteTarget(null);
      } else {
        appState.showToast(res.error || t('library.deleteFail', lang), 'error');
      }
    } catch {
      appState.showToast(t('library.deleteFail', lang), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // The Drive folder that holds most books of one category — where an
  // upload from that category should land. Admin only.
  const folderForCategory = (category: string): string | null => {
    const counts = new Map<string, number>();
    for (const b of appState.getVisibleBooks()) {
      if (cleanLabel(b.category) !== cleanLabel(category)) continue;
      const fid = b.subfolderId || b.folderId;
      if (!fid) continue;
      counts.set(fid, (counts.get(fid) || 0) + 1);
    }
    let best: string | null = null;
    let bestN = 0;
    for (const [fid, n] of counts) {
      if (n > bestN) {
        best = fid;
        bestN = n;
      }
    }
    return best;
  };

  // A category card on Home links here with ?category=... — honour it.
  useEffect(() => {
    setSelectedCategory(routeCategory || null);
    setSelectedGroup(routeCategory ? groupForCategory(routeCategory)?.id || null : null);
    setSelectedTopic(null);
  }, [routeCategory]);

  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  const q = (searchQuery || debouncedSearch || '').trim().toLowerCase();

  const categories = appState.getCategories();
  const authenticCount = appState.getVisibleBooks().filter((b) => b.isAuthentic).length;

  // Search matches title, author, category, topic, description and tags.
  // Searching "authentic" finds books marked Authentic. Folder names are
  // deliberately NOT searched — folders are not how you find a book.
  // Each book's lowercase haystack is built once per catalog, not once
  // per book per keystroke (it used to be rebuilt 138 times a keystroke).
  const searchHaystacks = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of appState.catalog.books || []) {
      map.set(
        b.id,
        [b.title, b.author, b.category, b.topic, b.description, b.isAuthentic ? 'authentic' : '', ...(Array.isArray(b.tags) ? b.tags : [])]
          .filter((t): t is string => typeof t === 'string')
          .join(' ')
          .toLowerCase()
      );
    }
    return map;
  }, [appState.catalog]);

  const matchesSearch = (b: Book, query: string): boolean => {
    const haystack = searchHaystacks.get(b.id) || '';
    return query.split(/\s+/).every((word) => word === '' || haystack.includes(word));
  };

  const displayedBooks = useMemo(() => {
    let list = appState.getOrderedBooks();
    if (q) list = list.filter((b) => matchesSearch(b, q));
    if (selectedCategory) {
      list = list.filter((b) => cleanLabel(b.category) === selectedCategory);
    } else if (selectedGroup) {
      // A topic group is just its categories: filter to those, nothing else.
      const group = TOPIC_GROUPS.find((g) => g.id === selectedGroup);
      const cats = new Set((group?.categories || []).map((c) => cleanLabel(c)));
      list = list.filter((b) => cats.has(cleanLabel(b.category)));
    }
    if (selectedTopic) list = list.filter((b) => cleanLabel(b.topic) === selectedTopic);
    if (authenticOnly) list = list.filter((b) => b.isAuthentic);
    if (typeFilter === 'pdf') list = list.filter((b) => b.fileType === 'pdf');
    if (typeFilter === 'notes') list = list.filter((b) => b.fileType !== 'pdf');
    // Reading status from My Shelf (local only).
    if (statusFilter === 'not-shelf') {
      list = list.filter((b) => !appState.getShelfStatus(b.id));
    } else if (statusFilter !== 'all') {
      list = list.filter((b) => appState.getShelfStatus(b.id) === statusFilter);
    }
    // Sort: arranged is the library's own topic/category order.
    if (sortBy === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'topic') {
      list = [...list].sort(
        (a, b) =>
          cleanLabel(a.topic).localeCompare(cleanLabel(b.topic)) ||
          cleanLabel(a.category).localeCompare(cleanLabel(b.category)) ||
          a.title.localeCompare(b.title)
      );
    } else if (sortBy === 'date') {
      // Newest first by real Drive modified date (updatedDate).
      list = [...list].sort((a, b) => (b.updatedDate || '').localeCompare(a.updatedDate || ''));
    }
    return list;
    // NOTE: appState.catalog is a dep on purpose. The catalog arrives
    // after this view mounts (empty at first render), so without it the
    // memo keeps the empty first result forever and the Library shows
    // "No books match these filters." on a direct load / refresh.
    // selectedTopic is a dep too: filtering by topic must recompute.
  }, [appState.catalog, q, selectedCategory, selectedGroup, selectedTopic, authenticOnly, typeFilter, statusFilter, sortBy]);

  // Paginate the flat list: rendering all 138 cards at once (each with
  // a cover image, badges and a staggered entrance animation) janks the
  // scroll on phones. Show 48 first, then more on tap. Resets whenever
  // the filters change, so a new search never lands on page 3 of the old one.
  const PAGE_SIZE = 48;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [q, selectedCategory, selectedGroup, selectedTopic, authenticOnly, typeFilter, statusFilter, sortBy]);
  const visibleBooks = useMemo(
    () => displayedBooks.slice(0, visibleCount),
    [displayedBooks, visibleCount]
  );

  // Stable admin delete callback: an inline arrow here would be a new
  // function every render, which defeats BookCard's memo on every card.
  const handleDeleteBook = useCallback(
    (book: Book) => setDeleteTarget(book),
    []
  );

  // 6 big topics with book counts — the simple way to pick a category.
  // Cheap to compute every render (138 books), so no memo needed.
  const groupCounts = topicGroupCounts(appState.getVisibleBooks());
  const activeGroup = TOPIC_GROUPS.find((g) => g.id === selectedGroup) || null;
  // Categories shown as chips: the active group's categories, or all of
  // them, filtered by the "find a category" search box.
  const shownCategories = useMemo(() => {
    const pool = activeGroup ? activeGroup.categories : categories;
    const needle = categorySearch.trim().toLowerCase();
    if (!needle) return pool;
    return pool.filter((c) => c.toLowerCase().includes(needle));
  }, [activeGroup, categories, categorySearch]);

  // Group by category, then topic, in the library's arrange order — only
  // when the reader is browsing freely (no search / no single topic).
  // Each topic group carries its startIndex in the whole visible list,
  // so the first-12 entrance stagger is global, not per group.
  const grouped = useMemo(() => {
    if (q || selectedTopic || sortBy !== 'arranged') return null;
    const groups: Array<{ category: string; topics: Array<{ topic: string; books: Book[]; startIndex: number }> }> = [];
    let running = 0;
    for (const book of visibleBooks) {
      const category = cleanLabel(book.category) || 'General';
      const topic = cleanLabel(book.topic) || 'General';
      let cat = groups.find((g) => g.category === category);
      if (!cat) {
        cat = { category, topics: [] };
        groups.push(cat);
      }
      let top = cat.topics.find((t) => t.topic === topic);
      if (!top) {
        top = { topic, books: [], startIndex: running };
        cat.topics.push(top);
      }
      top.books.push(book);
      running += 1;
    }
    return groups;
  }, [visibleBooks, q, selectedTopic, sortBy]);

  if (appState.loading) {
    return (
      <div className="ms-panel rounded-xl p-8 text-center space-y-3 font-sans max-w-md mx-auto my-12 shadow-2xs animate-fade-in">
        <div className="w-10 h-10 border border-[var(--border-main)] bg-[var(--bg-main)] text-[var(--gold)] flex items-center justify-center rounded-lg mx-auto animate-spin">
          <RefreshCw className="w-5 h-5 text-[var(--gold)]" />
        </div>
        <p className="text-sm font-semibold text-[var(--text-main)]">{t('library.loading', lang)}</p>
        <div className="space-y-2 pt-2 text-left">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-11/12" />
          <div className="skeleton h-10 w-4/5" />
        </div>
      </div>
    );
  }

  if (appState.loadError) {
    return (
      <div className="ms-panel rounded-xl p-8 text-center space-y-4 font-sans max-w-md mx-auto my-12 shadow-2xs animate-fade-in">
        <div className="w-10 h-10 border border-amber-500/30 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-lg mx-auto">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-[var(--text-main)]">{t('library.loadErrorTitle', lang)}</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {t('library.loadErrorText', lang)}
          </p>
        </div>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => appState.retryLoad()}
            className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg cursor-pointer transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('library.tryAgain', lang)}</span>
          </button>
        </div>
      </div>
    );
  }

  const title = q
    ? tf('library.searchTitle', lang, { q })
    : selectedCategory || activeGroup?.title || t('library.allBooks', lang);

  return (
    <div className="space-y-5 animate-fade-in py-2 font-sans">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-2 px-1">
        <div>
          <span className="ms-eyebrow block">{t('library.eyebrow', lang)}</span>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)]">{title}</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {tf(displayedBooks.length === 1 ? 'library.countOne' : 'library.countMany', lang, { n: displayedBooks.length })}
            . {t('library.groupedNote', lang)}
          </p>
        </div>
        <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full">
          {tf('library.totalInLibrary', lang, { n: appState.getVisibleBooks().length })}
        </span>
      </div>

      {/* Search — find a book by title, author, topic or category. */}
      <div className="relative">
        <Search className="w-5 h-5 text-[var(--gold)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={t('library.searchPlaceholder', lang)}
          aria-label={t('library.searchAria', lang)}
          className="tap-target w-full pl-11 pr-4 py-3.5 text-sm sm:text-base bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded-xl focus:outline-none focus:border-[var(--gold)] shadow-lg"
        />
      </div>

      {/* Pick a topic — 6 big topics instead of 27 folders. Tap one to see its books. */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--gold)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder={t('library.findCategoryPlaceholder', lang)}
            aria-label={t('library.findCategoryAria', lang)}
            className="tap-target w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded-xl focus:outline-none focus:border-[var(--gold)]"
          />
        </div>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 gap-2" role="group" aria-label={t('library.topicsAria', lang)}>
          <button
            type="button"
            onClick={() => { setSelectedGroup(null); setSelectedCategory(null); setSelectedTopic(null); }}
            className={`tap-target p-3 rounded-xl text-left border transition-colors cursor-pointer ${
              selectedGroup === null && selectedCategory === null
                ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
            }`}
          >
            <span className="font-bold text-sm flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4" />
              <span>{t('library.allBooks', lang)}</span>
            </span>
            <span className={`text-xs mt-0.5 block ${selectedGroup === null && selectedCategory === null ? 'text-black/70' : 'text-[var(--text-muted)]'}`}>
              {tf('library.allBooksBlurb', lang, { n: appState.getVisibleBooks().length })}
            </span>
          </button>
          {groupCounts
            .filter(({ group }) => {
              const needle = categorySearch.trim().toLowerCase();
              if (!needle) return true;
              return (
                group.title.toLowerCase().includes(needle) ||
                group.blurb.toLowerCase().includes(needle) ||
                group.categories.some((c) => c.toLowerCase().includes(needle))
              );
            })
            .map(({ group, count }) => {
              const isActive = selectedGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(isActive ? null : group.id);
                    setSelectedCategory(null);
                    setSelectedTopic(null);
                  }}
                  aria-pressed={isActive}
                  className={`tap-target p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
                  }`}
                >
                  <span className="font-bold text-sm block">{group.title} ({count})</span>
                  <span className={`text-xs mt-0.5 block ${isActive ? 'text-black/70' : 'text-[var(--text-muted)]'}`}>
                    {group.blurb}
                  </span>
                </button>
              );
            })}
        </div>
        {categorySearch.trim() !== '' && groupCounts.filter(({ group }) => {
          const needle = categorySearch.trim().toLowerCase();
          return (
            group.title.toLowerCase().includes(needle) ||
            group.blurb.toLowerCase().includes(needle) ||
            group.categories.some((c) => c.toLowerCase().includes(needle))
          );
        }).length === 0 && (
          <p className="text-xs text-[var(--text-muted)] px-1">
            {tf('library.noTopicMatch', lang, { q: categorySearch.trim() })}
          </p>
        )}

        {/* Categories inside the picked topic — tap one to narrow further. */}
        <div className="flex gap-2 flex-wrap items-center" role="group" aria-label={t('library.categoriesAria', lang)}>
          {shownCategories.map((category) => {
            const count = appState.getVisibleBooks().filter((b) => cleanLabel(b.category) === category).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => { setSelectedCategory(category); setSelectedTopic(null); }}
                className={`tap-target px-3.5 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
          {shownCategories.length === 0 && (
            <p className="text-xs text-[var(--text-muted)]">{tf('library.noCategoryMatch', lang, { q: categorySearch.trim() })}</p>
          )}
        </div>

        {/* Type filter + Authentic */}
        <div className="flex gap-2 flex-wrap items-center" role="group" aria-label={t('library.typeFilterAria', lang)}>
          {([
            { key: 'all', label: t('library.typeAll', lang), icon: BookOpen },
            { key: 'pdf', label: t('library.typePdf', lang), icon: FileText },
            { key: 'notes', label: t('library.typeNotes', lang), icon: FileText },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTypeFilter(key)}
              className={`tap-target px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                typeFilter === key
                  ? 'bg-[var(--gold-faint)] text-[var(--gold)] border-[var(--gold)]/50'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-main)] hover:text-[var(--text-main)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAuthenticOnly((v) => !v)}
            aria-pressed={authenticOnly}
            title={t('library.authenticTitle', lang)}
            className={`tap-target px-3 py-2 rounded-lg text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
              authenticOnly
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-main)]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{tf('library.authenticOnly', lang, { n: authenticCount })}</span>
          </button>

          {/* Reading status (My Shelf) + sort */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label={t('library.statusAria', lang)}
            className="tap-target px-3 py-2 rounded-lg text-xs font-semibold border bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] cursor-pointer"
          >
            <option value="all">{t('library.statusAny', lang)}</option>
            {(['to-read', 'reading', 'finished'] as ShelfStatus[]).map((s) => (
              <option key={s} value={s}>{t(`shelf.${s}`, lang)}</option>
            ))}
            <option value="not-shelf">{t('library.statusNotShelf', lang)}</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            aria-label={t('library.sortAria', lang)}
            className="tap-target px-3 py-2 rounded-lg text-xs font-semibold border bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-main)] cursor-pointer"
          >
            <option value="arranged">{t('library.sortArranged', lang)}</option>
            <option value="title">{t('library.sortTitle', lang)}</option>
            <option value="topic">{t('library.sortTopic', lang)}</option>
            <option value="date">{t('library.sortDate', lang)}</option>
          </select>
        </div>

      </div>

      {/* Books — grouped by category and topic, as book cards. */}
      {displayedBooks.length === 0 ? (
        <div className="py-12 px-4 text-center ms-panel rounded-xl">
          <p className="font-semibold text-sm text-[var(--text-main)]">
            {q ? tf('library.noBooksSearch', lang, { q }) : t('library.noBooksFilters', lang)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{t('library.tryDifferent', lang)}</p>
        </div>
      ) : grouped ? (
        grouped.map((group) => (
          <section key={group.category} className="space-y-4">
            <div className="flex items-baseline gap-3 px-1 pt-2">
              <h2 className="font-display font-semibold text-xl text-[var(--text-main)]">{group.category}</h2>
              <span className="text-xs text-[var(--text-muted)]">
                {tf(group.topics.reduce((n, t) => n + t.books.length, 0) === 1 ? 'library.countOne' : 'library.countMany', lang, { n: group.topics.reduce((n, t) => n + t.books.length, 0) })}
              </span>
              {appState.isAdmin() && (
                <button
                  type="button"
                  onClick={() => openUploadModal(folderForCategory(group.category))}
                  className="ml-auto self-center px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--gold)]/50 bg-[var(--gold-faint)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t('library.uploadHere', lang)}</span>
                </button>
              )}
            </div>
            {group.topics.map((topicGroup) => (
              <div key={topicGroup.topic} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full">
                    {topicGroup.topic}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {tf(topicGroup.books.length === 1 ? 'library.countOne' : 'library.countMany', lang, { n: topicGroup.books.length })}
                  </span>
                </div>
                <BookGrid
                  books={topicGroup.books}
                  emptyMessage={t('library.noBooksInTopic', lang)}
                  onDeleteBook={appState.isAdmin() ? handleDeleteBook : undefined}
                  indexOffset={topicGroup.startIndex}
                />
              </div>
            ))}
          </section>
        ))
      ) : (
        <BookGrid
          books={visibleBooks}
          emptyMessage={q ? tf('library.noBooksSearch', lang, { q }) : t('library.noBooksFilters', lang)}
          onDeleteBook={appState.isAdmin() ? handleDeleteBook : undefined}
        />
      )}

      {displayedBooks.length > visibleCount && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="tap-target px-6 py-3 rounded-xl text-sm font-bold bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 cursor-pointer"
          >
            {tf('library.showMore', lang, { shown: visibleBooks.length, total: displayedBooks.length })}
          </button>
        </div>
      )}

      {uploadModalMounted && (
        <Suspense fallback={null}>
          <UploadFileModal
            isOpen={uploadModalOpen}
            folderId={uploadFolderId}
            onClose={() => setUploadModalOpen(false)}
            onUploaded={() => appState.loadCatalog()}
          />
        </Suspense>
      )}

      {/* Admin delete confirmation — title shown, catalog entry only. */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title={deleteTarget ? tf('library.deleteTitle', lang, { title: deleteTarget.title }) : t('library.deleteTitleFallback', lang)}
        message={
          deleteTarget
            ? tf('library.deleteMessage', lang, { title: deleteTarget.title })
            : ''
        }
        confirmLabel={isDeleting ? t('library.deleting', lang) : t('library.deleteConfirm', lang)}
        cancelLabel={t('library.cancel', lang)}
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
      />

      <CompactAdvisoryBanner />
    </div>
  );
};
