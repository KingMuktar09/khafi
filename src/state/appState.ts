import { Book, CatalogData, Folder, ReadingProgress, RouteState, ThemeMode, Toast, UserSettings } from '../types';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { router } from '../router/router';
import { ACCENT_PALETTES } from '../config/accentPalettes';
import { JOURNEYS } from '../data/specialFeatures';
import type { AmalLog, ReadingStats, ShelfMap, ShelfStatus } from '../data/tools';
import { computeReadingStats, shelfBooks } from '../data/tools';
import {
  getBookVersion,
  getCategories,
  getTopics,
  getTopicsForCategory,
  sortBooksByTopicCategory,
  applyDailyRotation,
  type BookVersion,
} from '../utils/bookOrder';

type StateListener = () => void;

class AppState {
  private listeners: Set<StateListener> = new Set();

  public catalog: CatalogData = { folders: [], books: [] };
  public loading: boolean = true;
  public loadError: boolean = false;
  public route: RouteState = router.getRoute();
  public favorites: string[] = storage.getFavorites();
  public recentlyViewed: string[] = storage.getRecentlyViewed();
  public readingProgress: Record<string, ReadingProgress> = storage.getReadingProgress();
  public bookmarks: Record<string, number[]> = storage.getBookmarks();
  public journeyProgress: Record<string, string[]> = storage.getJourneyProgress();
  public shelf: ShelfMap = storage.getShelf();
  public visitDates: string[] = storage.recordVisit();
  public amalLog: AmalLog = storage.getAmalLog();
  public settings: UserSettings = storage.getSettings();
  public theme: ThemeMode = this.settings.appearance === 'light' ? 'light' : 'dark';
  public toasts: Toast[] = [];
  public adminAuthenticated: boolean = false;
  public adminUsername?: string;
  public searchQuery: string = '';
  public lastRandomBookId: string | null = null;
  public advisoryAcknowledged: boolean = storage.getAdvisoryAcknowledged();

  constructor() {
    // Subscribe to router changes
    router.subscribe((newRoute) => {
      this.route = newRoute;
      if (newRoute.searchQuery !== undefined) {
        this.searchQuery = newRoute.searchQuery;
      }
      this.notify();
    });

    // Apply initial settings & theme to HTML DOM
    this.applySettingsToDOM();

    // Listen for OS system theme changes if appearance === 'system'
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.settings.appearance === 'system') {
          this.applySettingsToDOM();
          this.notify();
        }
      });
    }

    // Initial load
    this.init();
  }

  private async init() {
    this.loading = true;
    this.loadError = false;
    this.notify();

    try {
      await Promise.all([this.loadCatalog(), this.checkAdmin()]);
    } catch {
      this.loadError = true;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  public subscribe(fn: StateListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public async loadCatalog() {
    try {
      const data = await api.getCatalog();
      if (!data || (!data.folders && !data.books)) {
        this.loadError = true;
        this.catalog = { folders: [], books: [] };
      } else {
        this.loadError = false;
        this.catalog = data;
        this.cleanupFavorites();
      }
    } catch {
      this.loadError = true;
      this.catalog = { folders: [], books: [] };
    }
    this.notify();
  }

  public async retryLoad() {
    this.loading = true;
    this.loadError = false;
    this.notify();
    await Promise.all([this.loadCatalog(), this.checkAdmin()]);
    this.loading = false;
    this.notify();
  }

  public cleanupFavorites() {
    if (!this.catalog?.books) return;
    const validBookIds = new Set(this.catalog.books.map((b) => b.id));
    const validFavs = this.favorites.filter((id) => validBookIds.has(id));
    if (validFavs.length !== this.favorites.length) {
      this.favorites = validFavs;
      storage.setFavorites(validFavs);
    }
  }

  public getFavoriteBooks(): Book[] {
    if (!this.catalog?.books) return [];
    const validBookIds = new Set(this.catalog.books.map((b) => b.id));
    return this.favorites
      .filter((id) => validBookIds.has(id))
      .map((id) => this.getBookById(id))
      .filter((b): b is Book => b !== undefined && b.visible !== false);
  }

  public async checkAdmin() {
    const res = await api.checkAdminAuth();
    this.adminAuthenticated = res.authenticated;
    this.adminUsername = res.username;
    this.notify();
  }

  public isAdmin(): boolean {
    return this.adminAuthenticated;
  }

  // Favorites
  public toggleFavorite(bookId: string) {
    const isFav = this.favorites.includes(bookId);
    if (isFav) {
      this.favorites = storage.removeFavorite(bookId);
      this.showToast('Removed from favorites', 'info');
    } else {
      this.favorites = storage.addFavorite(bookId);
      this.showToast('Added to favorites', 'success');
    }
    this.notify();
  }

  public isFavorite(bookId: string): boolean {
    return this.favorites.includes(bookId);
  }

  // Recently Viewed
  public recordViewedBook(bookId: string) {
    if (!bookId) return;
    this.recentlyViewed = storage.addRecentlyViewed(bookId);
    this.notify();
  }

  // Reading Progress
  public setReadingProgress(
    bookId: string,
    percentage: number,
    currentPage?: number,
    totalPages?: number
  ) {
    if (!bookId) return;
    this.readingProgress = storage.setBookProgress(bookId, {
      percentage,
      currentPage,
      totalPages,
    });
    this.notify();
  }

  public getReadingProgress(bookId: string): ReadingProgress | undefined {
    return this.readingProgress[bookId];
  }

  public removeReadingProgress(bookId: string) {
    this.readingProgress = storage.removeBookProgress(bookId);
    this.notify();
  }

  // Bookmarks — saved page numbers, local only.
  public getBookmarksForBook(bookId: string): number[] {
    return this.bookmarks[bookId] || [];
  }

  public toggleBookmark(bookId: string, page: number) {
    this.bookmarks = { ...this.bookmarks, [bookId]: storage.toggleBookmark(bookId, page) };
    if (this.bookmarks[bookId].length === 0) {
      const next = { ...this.bookmarks };
      delete next[bookId];
      this.bookmarks = next;
    }
    this.notify();
  }

  // Guided Reading Journeys — done steps, local only.
  public getJourneyDone(journeyId: string): string[] {
    return this.journeyProgress[journeyId] || [];
  }

  // My Shelf — saved books with a reading status, local only.
  public getShelfStatus(bookId: string): ShelfStatus | undefined {
    return this.shelf[bookId];
  }

  public setShelfStatus(bookId: string, status: ShelfStatus | null) {
    this.shelf = storage.setShelfStatus(bookId, status);
    this.showToast(
      status === null
        ? 'Removed from My Shelf'
        : status === 'finished'
          ? 'Marked Finished — well done'
          : status === 'reading'
            ? 'Moved to Reading on My Shelf'
            : 'Saved to My Shelf — To Read',
      'success'
    );
    this.notify();
  }

  public getShelfBooks(): Book[] {
    return shelfBooks(this.getVisibleBooks(), this.shelf);
  }

  public getShelfBooksByStatus(status: ShelfStatus): Book[] {
    return this.getShelfBooks().filter((b) => this.shelf[b.id] === status);
  }

  // Amals — tick done each day, local only.
  public getAmalsDoneToday(): string[] {
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return this.amalLog[key] || [];
  }

  public toggleAmal(amalId: string) {
    const done = storage.toggleAmal(amalId);
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.amalLog = { ...this.amalLog, [key]: done };
    if (done.length === 0) {
      const next = { ...this.amalLog };
      delete next[key];
      this.amalLog = next;
    }
    this.notify();
  }

  // Reading Stats — local only, from shelf + progress + journeys.
  public getReadingStats(): ReadingStats {
    return computeReadingStats({
      shelf: this.shelf,
      progress: this.readingProgress,
      bookmarks: this.bookmarks,
      journeyProgress: this.journeyProgress,
      journeys: JOURNEYS.map((j) => ({ id: j.id, total: j.steps.length })),
      visitDates: this.visitDates,
    });
  }

  public toggleJourneyStep(journeyId: string, stepTitle: string) {
    const done = storage.toggleJourneyStep(journeyId, stepTitle);
    this.journeyProgress = { ...this.journeyProgress, [journeyId]: done };
    if (done.length === 0) {
      const next = { ...this.journeyProgress };
      delete next[journeyId];
      this.journeyProgress = next;
    }
    this.notify();
  }

  public getBooksInProgress(): { book: Book; progress: ReadingProgress }[] {
    const visible = this.getVisibleBooks();
    const results: { book: Book; progress: ReadingProgress }[] = [];

    for (const book of visible) {
      const prog = this.readingProgress[book.id];
      if (prog && prog.percentage > 0) {
        results.push({ book, progress: prog });
      }
    }

    return results.sort((a, b) => {
      const timeA = a.progress.lastUpdated ? new Date(a.progress.lastUpdated).getTime() : 0;
      const timeB = b.progress.lastUpdated ? new Date(b.progress.lastUpdated).getTime() : 0;
      return timeB - timeA;
    });
  }

  // Settings & Theme
  public updateSettings(partial: Partial<UserSettings>) {
    this.settings = { ...this.settings, ...partial };
    if (partial.appearance && (partial.appearance === 'dark' || partial.appearance === 'light')) {
      storage.setTheme(partial.appearance);
    }
    storage.saveSettings(this.settings);
    this.applySettingsToDOM();
    this.notify();
  }

  public setSortField(field: UserSettings['sortField']) {
    this.updateSettings({ sortField: field });
  }

  public setSortDirection(direction: UserSettings['sortDirection']) {
    this.updateSettings({ sortDirection: direction });
  }

  public toggleSortDirection() {
    this.updateSettings({ sortDirection: this.settings.sortDirection === 'asc' ? 'desc' : 'asc' });
  }

  public setViewMode(mode: UserSettings['viewMode']) {
    this.updateSettings({ viewMode: mode });
  }

  public setFilterType(filter: UserSettings['filterType']) {
    this.updateSettings({ filterType: filter });
  }

  public setTheme(mode: ThemeMode) {
    this.updateSettings({ appearance: mode });
  }

  public applySettingsToDOM() {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const { appearance, accentColor, fontSize, animations } = this.settings;

    // 1. Appearance / Dark-Light Mode
    let isDark = true;
    if (appearance === 'system') {
      isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = appearance === 'dark';
    }

    if (isDark) {
      root.classList.remove('light-theme');
      root.classList.add('dark');
      this.theme = 'dark';
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark');
      this.theme = 'light';
    }

    // 2. Accent Color Tokens
    const modeKey = isDark ? 'dark' : 'light';
    const palette = ACCENT_PALETTES[accentColor] ? ACCENT_PALETTES[accentColor][modeKey] : ACCENT_PALETTES.gold[modeKey];
    root.style.setProperty('--gold', palette.gold);
    root.style.setProperty('--gold-light', palette.light);
    root.style.setProperty('--gold-faint', palette.faint);

    // 3. Font Size Scaling
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }

    // 4. Animations Mode
    if (animations === 'reduced') {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }

  // Toasts
  public showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const toast: Toast = { id, message, type };
    this.toasts = [...this.toasts, toast];
    this.notify();

    setTimeout(() => {
      this.removeToast(id);
    }, 3500);
  }

  public removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  // Random Book Engine
  public getRandomBook(): Book | null {
    const visibleBooks = (this.catalog.books || []).filter((b) => b.visible !== false);
    if (visibleBooks.length === 0) return null;
    if (visibleBooks.length === 1) return visibleBooks[0];

    // Filter out last chosen book to avoid immediate repeats
    const candidates = visibleBooks.filter((b) => b.id !== this.lastRandomBookId);
    const pool = candidates.length > 0 ? candidates : visibleBooks;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    this.lastRandomBookId = selected.id;
    return selected;
  }

  // Search helper
  public setGlobalSearchQuery(query: string) {
    this.searchQuery = query;
    this.notify();
  }

  // Helper getters
  public getVisibleBooks(): Book[] {
    return (this.catalog.books || []).filter((b) => b.visible !== false);
  }

  public getBookById(id: string): Book | undefined {
    return (this.catalog.books || []).find((b) => b.id === id);
  }

  // --- Topic / category arranging (the library's organising system) ---
  /** All books in topic/category display order, with the daily rotation
   *  applied (see applyDailyRotation). The stored sortOrder and the
   *  admin's order are never changed — this is display only. */
  public getOrderedBooks(): Book[] {
    return applyDailyRotation(
      sortBooksByTopicCategory(
        this.getVisibleBooks(),
        this.catalog.categoryOrder,
        this.catalog.topicOrder
      )
    );
  }

  public getCategories(): string[] {
    return getCategories(this.catalog.books || [], this.catalog.categoryOrder);
  }

  public getTopics(): string[] {
    return getTopics(this.catalog.books || [], this.catalog.topicOrder);
  }

  public getTopicsForCategory(category: string): string[] {
    return getTopicsForCategory(this.catalog.books || [], category, this.catalog.topicOrder);
  }

  /** Version info for one book (same-name copies, oldest = Version 1). */
  public getBookVersion(book: Book): BookVersion {
    return getBookVersion(this.catalog.books || [], book);
  }

  public getFolderById(id: string): Folder | undefined {
    return (this.catalog.folders || []).find((f) => f.id === id);
  }

  public getChildFolders(parentId: string | null = null): Folder[] {
    return (this.catalog.folders || [])
      .filter((f) => f.visible !== false)
      .filter((f) => f.parentId === parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public getBooksForFolder(folderId: string, subfolderId?: string | null): Book[] {
    return this.getVisibleBooks().filter((b) => {
      if (subfolderId) {
        return (
          b.folderId === subfolderId ||
          b.subfolderId === subfolderId ||
          (b.folderId === folderId && b.subfolderId === subfolderId)
        );
      }
      return (
        (b.folderId === folderId && (!b.subfolderId || b.subfolderId === folderId)) ||
        b.subfolderId === folderId
      );
    });
  }

  /**
   * All books in a folder AND every folder below it, in one flat list.
   * This is what makes browsing easy: one tap on a collection shows
   * all of its books, with no folder-after-folder drilling.
   */
  public getBooksInFolderTree(folderId: string): Book[] {
    const ids = new Set<string>([folderId]);
    const queue = [folderId];
    while (queue.length > 0) {
      const parent = queue.pop()!;
      for (const child of this.getChildFolders(parent)) {
        if (!ids.has(child.id)) {
          ids.add(child.id);
          queue.push(child.id);
        }
      }
    }
    return this.getVisibleBooks().filter(
      (b) => (b.folderId && ids.has(b.folderId)) || (b.subfolderId && ids.has(b.subfolderId))
    );
  }

  /** Top-level collections: children of the single root folder. */
  public getTopCollections(): Folder[] {
    const roots = this.getChildFolders(null);
    return roots.length === 1 ? this.getChildFolders(roots[0].id) : roots;
  }

  public getItemCountForFolder(folderId: string, _seen: Set<string> = new Set()): number {
    const folder = this.getFolderById(folderId);
    if (!folder || _seen.has(folderId)) return 0;
    _seen.add(folderId);

    // Books filed directly in this folder, plus books in every subfolder
    // (recursive), so a category card shows its true total.
    const directBooks = this.getVisibleBooks().filter(
      (b) => b.folderId === folderId || b.subfolderId === folderId
    ).length;
    const childFolders = this.getChildFolders(folderId);
    let total = directBooks + childFolders.length;
    for (const child of childFolders) {
      total += this.getItemCountForFolder(child.id, _seen);
    }
    return total;
  }

  public getBookCountForFolder(folderId: string): number {
    return this.getItemCountForFolder(folderId);
  }

  // Reader Advisory
  public hasAcknowledgedAdvisory(): boolean {
    return this.advisoryAcknowledged;
  }

  public acknowledgeAdvisory() {
    storage.setAdvisoryAcknowledged(true);
    this.advisoryAcknowledged = true;
    this.notify();
  }
}

export const appState = new AppState();
