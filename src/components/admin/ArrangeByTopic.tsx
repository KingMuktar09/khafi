import React, { useMemo, useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { appState } from '../../state/appState';
import { api } from '../../services/api';
import {
  AUTHENTIC_MEANING,
  cleanLabel,
  formatVersionDate,
  getCategories,
  getTopics,
  getTopicsForCategory,
  moveBookInList,
  moveNameInOrder,
  sortBooksByTopicCategory,
  UNTITLED_TOPIC,
} from '../../utils/bookOrder';
import type { Book } from '../../types';

/**
 * Admin "Arrange by Topic & Category" panel.
 *
 * The library is organised by TOPIC and CATEGORY, not by folder. A folder
 * only says where a file lives in Drive; topic + category say what the
 * book is about, and that is what readers browse by. Everything here is
 * flat — search, pick a topic/category, edit it, move a book up or down —
 * with no folder digging at all.
 */
export const ArrangeByTopic: React.FC = () => {
  const books = appState.catalog.books || [];
  const categoryOrder = appState.catalog.categoryOrder;
  const topicOrder = appState.catalog.topicOrder;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [authenticOnly, setAuthenticOnly] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, { topic: string; category: string }>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const categories = useMemo(() => getCategories(books, categoryOrder), [books, categoryOrder]);
  const allTopics = useMemo(() => getTopics(books, topicOrder), [books, topicOrder]);
  const topicsForCategory = selectedCategory
    ? getTopicsForCategory(books, selectedCategory, topicOrder)
    : allTopics;

  const draftFor = (book: Book) =>
    drafts[book.id] || { topic: book.topic || '', category: book.category || '' };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((b) => {
      if (selectedCategory && cleanLabel(b.category) !== selectedCategory) return false;
      if (selectedTopic && cleanLabel(b.topic) !== selectedTopic) return false;
      if (authenticOnly && !b.isAuthentic) return false;
      if (!q) return true;
      const haystack = [b.title, b.author, b.category, b.topic, b.description, ...(b.tags || [])]
        .filter((t): t is string => typeof t === 'string')
        .join(' ')
        .toLowerCase();
      return q.split(/\s+/).every((w) => w === '' || haystack.includes(w));
    });
  }, [books, search, selectedCategory, selectedTopic, authenticOnly]);

  const ordered = useMemo(
    () => sortBooksByTopicCategory(filtered, categoryOrder, topicOrder),
    [filtered, categoryOrder, topicOrder]
  );

  // Group the ordered list by category, then topic, for display.
  const groups = useMemo(() => {
    const out: Array<{ category: string; topic: string; books: Book[] }> = [];
    for (const b of ordered) {
      const category = cleanLabel(b.category) || 'General';
      const topic = cleanLabel(b.topic) || UNTITLED_TOPIC;
      const last = out[out.length - 1];
      if (last && last.category === category && last.topic === topic) {
        last.books.push(b);
      } else {
        out.push({ category, topic, books: [b] });
      }
    }
    return out;
  }, [ordered]);

  const reload = async () => {
    await appState.loadCatalog();
  };

  const saveDraft = async (book: Book) => {
    const draft = draftFor(book);
    if (draft.topic === (book.topic || '') && draft.category === book.category) return;
    setBusyId(book.id);
    const res = await api.updateBook(book.id, {
      topic: draft.topic.trim(),
      category: draft.category.trim() || book.category,
    });
    setBusyId(null);
    if (res.success) {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[book.id];
        return next;
      });
      appState.showToast(`"${book.title}" moved to ${draft.category.trim()} / ${draft.topic.trim() || 'no topic'}.`, 'success');
      await reload();
    } else {
      appState.showToast(res.error || 'Could not save topic and category.', 'error');
    }
  };

  const toggleAuthentic = async (book: Book) => {
    setBusyId(book.id);
    const res = await api.updateBook(book.id, { isAuthentic: !book.isAuthentic });
    setBusyId(null);
    if (res.success) {
      appState.showToast(
        book.isAuthentic
          ? `"${book.title}" is no longer marked Authentic.`
          : `"${book.title}" marked Authentic.`,
        'success'
      );
      await reload();
    } else {
      appState.showToast(res.error || 'Could not change the Authentic mark.', 'error');
    }
  };

  const moveBook = async (book: Book, direction: 'up' | 'down') => {
    const group = groups.find(
      (g) => g.books.some((b) => b.id === book.id)
    );
    if (!group) return;
    const moved = moveBookInList(group.books, book.id, direction);
    if (moved === group.books) return;
    setBusyId(book.id);
    const res = await api.reorderBooks({
      bookOrders: moved.map((b, i) => ({ id: b.id, sortOrder: i + 1 })),
    });
    setBusyId(null);
    if (res.success) {
      await reload();
    } else {
      appState.showToast(res.error || 'Could not move the book.', 'error');
    }
  };

  const moveCategory = async (name: string, direction: 'up' | 'down') => {
    const next = moveNameInOrder(categories, name, direction);
    if (next.join('|') === categories.join('|')) return;
    setBusyId(`cat:${name}`);
    const res = await api.reorderBooks({ bookOrders: [], categoryOrder: next });
    setBusyId(null);
    if (res.success) await reload();
    else appState.showToast(res.error || 'Could not move the category.', 'error');
  };

  const moveTopic = async (name: string, direction: 'up' | 'down') => {
    const list = selectedCategory ? topicsForCategory : allTopics;
    const next = moveNameInOrder(list, name, direction);
    if (next.join('|') === list.join('|')) return;
    setBusyId(`topic:${name}`);
    const res = await api.reorderBooks({ bookOrders: [], topicOrder: next });
    setBusyId(null);
    if (res.success) await reload();
    else appState.showToast(res.error || 'Could not move the topic.', 'error');
  };

  const authenticCount = books.filter((b) => b.isAuthentic).length;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-5 space-y-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 text-left cursor-pointer"
        aria-expanded={open}
      >
        <div className="w-10 h-10 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
            Arrange books by Topic &amp; Category
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {books.length} books • {categories.length} categories • {allTopics.length} topics set •{' '}
            {authenticCount} marked Authentic. Topic and category decide where a book shows up —
            no folder digging needed to find or move a book.
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-2" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-2" />
        )}
      </button>

      {open && (
        <>
          {/* Search + Authentic filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search all books by title, author, topic or category…"
                aria-label="Search all books"
                className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:border-[var(--gold)] text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setAuthenticOnly((v) => !v)}
              aria-pressed={authenticOnly}
              title={AUTHENTIC_MEANING}
              className={`tap-target px-4 py-2.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                authenticOnly
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50'
                  : 'bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-main)]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authentic only ({authenticCount})</span>
            </button>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Categories">
            <button
              type="button"
              onClick={() => { setSelectedCategory(null); setSelectedTopic(null); }}
              className={`tap-target shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border cursor-pointer ${
                selectedCategory === null
                  ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                  : 'bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--border-main)]'
              }`}
            >
              All categories ({books.length})
            </button>
            {categories.map((name) => {
              const count = books.filter((b) => cleanLabel(b.category) === name).length;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { setSelectedCategory(name); setSelectedTopic(null); }}
                  className={`tap-target shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border cursor-pointer ${
                    selectedCategory === name
                      ? 'bg-[var(--gold)] text-black border-[var(--gold)]'
                      : 'bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--border-main)]'
                  }`}
                >
                  {name} ({count})
                </button>
              );
            })}
          </div>

          {/* Topic chips */}
          {topicsForCategory.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Topics">
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className={`tap-target shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                  selectedTopic === null
                    ? 'bg-[var(--gold-faint)] text-[var(--gold)] border-[var(--gold)]/50'
                    : 'bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-main)]'
                }`}
              >
                All topics
              </button>
              {topicsForCategory.map((name) => {
                const count = books.filter((b) => cleanLabel(b.topic) === name).length;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedTopic(selectedTopic === name ? null : name)}
                    className={`tap-target shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                      selectedTopic === name
                        ? 'bg-[var(--gold-faint)] text-[var(--gold)] border-[var(--gold)]/50'
                        : 'bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-main)]'
                    }`}
                  >
                    {name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-[11px] text-[var(--text-faint)] leading-relaxed">
            Tip: type a new topic or category right in a row and tap Save — it is created on
            the spot. Use the ↑ ↓ buttons to move a book inside its topic, or a whole
            category / topic up and down.
          </p>

          {/* Grouped book list */}
          <datalist id="arrange-topics">
            {allTopics.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          <datalist id="arrange-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <div className="space-y-4">
            {groups.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] py-4 text-center">
                No books match this filter.
              </p>
            )}
            {groups.map((group) => {
              const versionInfo = (b: Book) => appState.getBookVersion(b);
              return (
                <div key={`${group.category}::${group.topic}`} className="space-y-2">
                  {/* Group header: category • topic, with reorder buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-[var(--text-main)]">
                      {group.category} <span className="text-[var(--text-faint)]">•</span>{' '}
                      <span className="text-[var(--gold)]">{group.topic}</span>
                      <span className="text-xs text-[var(--text-muted)] font-normal">
                        {' '}({group.books.length} {group.books.length === 1 ? 'book' : 'books'})
                      </span>
                    </h4>
                    <span className="flex items-center gap-1 ml-auto">
                      <button
                        type="button"
                        onClick={() => moveCategory(group.category, 'up')}
                        disabled={busyId === `cat:${group.category}`}
                        title={`Move category "${group.category}" up`}
                        aria-label={`Move category ${group.category} up`}
                        className="p-1.5 rounded border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCategory(group.category, 'down')}
                        disabled={busyId === `cat:${group.category}`}
                        title={`Move category "${group.category}" down`}
                        aria-label={`Move category ${group.category} down`}
                        className="p-1.5 rounded border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {group.topic !== UNTITLED_TOPIC && (
                        <>
                          <button
                            type="button"
                            onClick={() => moveTopic(group.topic, 'up')}
                            disabled={busyId === `topic:${group.topic}`}
                            title={`Move topic "${group.topic}" up`}
                            aria-label={`Move topic ${group.topic} up`}
                            className="p-1.5 rounded border border-[var(--border-main)] text-[var(--gold)] hover:text-[var(--gold-light)] disabled:opacity-40 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveTopic(group.topic, 'down')}
                            disabled={busyId === `topic:${group.topic}`}
                            title={`Move topic "${group.topic}" down`}
                            aria-label={`Move topic ${group.topic} down`}
                            className="p-1.5 rounded border border-[var(--border-main)] text-[var(--gold)] hover:text-[var(--gold-light)] disabled:opacity-40 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-main)] rounded-lg overflow-hidden">
                    {group.books.map((b, i) => {
                      const v = versionInfo(b);
                      const draft = draftFor(b);
                      const dirty =
                        draft.topic !== (b.topic || '') || draft.category !== b.category;
                      return (
                        <div
                          key={b.id}
                          className="p-3 bg-[var(--bg-main)] flex flex-col gap-2 sm:flex-row sm:items-center"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="flex flex-col shrink-0">
                              <button
                                type="button"
                                onClick={() => moveBook(b, 'up')}
                                disabled={i === 0 || busyId === b.id}
                                title="Move up in this topic"
                                aria-label={`Move ${b.title} up`}
                                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveBook(b, 'down')}
                                disabled={i === group.books.length - 1 || busyId === b.id}
                                title="Move down in this topic"
                                aria-label={`Move ${b.title} down`}
                                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                            </span>
                            <span className="text-xs font-bold text-[var(--text-faint)] w-6 shrink-0 text-center">
                              {i + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                                {b.title}
                              </p>
                              <p className="text-[11px] text-[var(--text-muted)] flex flex-wrap gap-x-2 gap-y-0.5">
                                <span>{formatVersionDate(b)}</span>
                                {v.totalVersions > 1 && (
                                  <span className="text-[var(--gold)] font-semibold">
                                    Version {v.versionNumber} of {v.totalVersions}
                                  </span>
                                )}
                                {b.author && <span>{b.author}</span>}
                                {b.edition && <span>Ed. {b.edition}</span>}
                                {b.isPaid && <span>Paid</span>}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <label className="sr-only" htmlFor={`topic-${b.id}`}>Topic</label>
                            <input
                              id={`topic-${b.id}`}
                              list="arrange-topics"
                              value={draft.topic}
                              placeholder="Topic"
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [b.id]: { ...draftFor(b), topic: e.target.value },
                                }))
                              }
                              className="w-full sm:w-32 px-2.5 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)]"
                            />
                            <label className="sr-only" htmlFor={`cat-${b.id}`}>Category</label>
                            <input
                              id={`cat-${b.id}`}
                              list="arrange-categories"
                              value={draft.category}
                              placeholder="Category"
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [b.id]: { ...draftFor(b), category: e.target.value },
                                }))
                              }
                              className="w-full sm:w-36 px-2.5 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg text-xs focus:outline-none focus:border-[var(--gold)]"
                            />
                            <button
                              type="button"
                              onClick={() => toggleAuthentic(b)}
                              disabled={busyId === b.id}
                              aria-pressed={Boolean(b.isAuthentic)}
                              title={AUTHENTIC_MEANING}
                              className={`tap-target px-3 py-2 rounded-lg text-xs font-bold border flex items-center gap-1.5 cursor-pointer shrink-0 ${
                                b.isAuthentic
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50'
                                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-main)]'
                              }`}
                            >
                              <BadgeCheck className="w-4 h-4" />
                              <span>{b.isAuthentic ? 'Authentic' : 'Mark Authentic'}</span>
                            </button>
                            {dirty && (
                              <button
                                type="button"
                                onClick={() => saveDraft(b)}
                                disabled={busyId === b.id}
                                className="tap-target px-3 py-2 rounded-lg text-xs font-bold bg-[var(--gold)] text-black cursor-pointer shrink-0 flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                <span>Save</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-[var(--text-faint)] leading-relaxed">
            {AUTHENTIC_MEANING}
          </p>
        </>
      )}
    </div>
  );
};
