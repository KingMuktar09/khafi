import { ReadingProgress, ThemeMode, UserSettings } from '../types';
import type { ShelfMap, ShelfStatus } from '../data/tools';
import { toISODateLocal } from '../data/tools';

const FAVORITES_KEY = 'khafi_favorites';
const RECENT_KEY = 'khafi_recently_viewed';
const THEME_KEY = 'khafi_theme';
const PROGRESS_KEY = 'khafi_reading_progress';
const SETTINGS_KEY = 'khafi_user_settings';
const FOLLOW_UNLOCK_KEY = 'ilmeghayb_follow_unlocked';
const BOOKMARKS_KEY = 'khafi_bookmarks';
const JOURNEYS_KEY = 'khafi_journey_progress';
const SHELF_KEY = 'khafi_my_shelf';
const VISITS_KEY = 'khafi_visit_days';

export const DEFAULT_SETTINGS: UserSettings = {
  appearance: 'dark',
  accentColor: 'gold',
  viewMode: 'list',
  fontSize: 'medium',
  animations: 'normal',
  sortField: 'name',
  sortDirection: 'asc',
  filterType: 'all',
};

export const storage = {
  // Reading Progress
  getReadingProgress(): Record<string, ReadingProgress> {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  getBookProgress(bookId: string): ReadingProgress | undefined {
    const all = this.getReadingProgress();
    return all[bookId];
  },

  setBookProgress(
    bookId: string,
    progress: { percentage: number; currentPage?: number; totalPages?: number }
  ): Record<string, ReadingProgress> {
    const all = this.getReadingProgress();
    const percentage = Math.max(0, Math.min(100, Math.round(progress.percentage)));
    const updatedProgress: ReadingProgress = {
      bookId,
      percentage,
      currentPage: progress.currentPage,
      totalPages: progress.totalPages,
      lastUpdated: new Date().toISOString(),
    };
    all[bookId] = updatedProgress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    return all;
  },

  removeBookProgress(bookId: string): Record<string, ReadingProgress> {
    const all = this.getReadingProgress();
    delete all[bookId];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    return all;
  },
  // Favorites
  getFavorites(): string[] {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addFavorite(id: string): string[] {
    const list = this.getFavorites();
    if (!list.includes(id)) {
      const updated = [id, ...list];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    }
    return list;
  },

  removeFavorite(id: string): string[] {
    const list = this.getFavorites();
    const updated = list.filter((item) => item !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  },

  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  },

  setFavorites(list: string[]): void {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  // Recently Viewed
  getRecentlyViewed(): string[] {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addRecentlyViewed(id: string): string[] {
    const list = this.getRecentlyViewed();
    const filtered = list.filter((item) => item !== id);
    const updated = [id, ...filtered].slice(0, 12); // limit to 12 most recent
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    return updated;
  },

  // Session Advisory
  getAdvisoryAcknowledged(): boolean {
    try {
      return sessionStorage.getItem('khafi_advisory_acknowledged') === 'true';
    } catch {
      return false;
    }
  },

  setAdvisoryAcknowledged(acknowledged: boolean = true): void {
    try {
      sessionStorage.setItem('khafi_advisory_acknowledged', String(acknowledged));
    } catch {
      // fallback
    }
  },

  // Theme
  getTheme(): ThemeMode {
    try {
      const saved = localStorage.getItem(THEME_KEY) as ThemeMode;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // fallback
    }
    return 'dark';
  },

  setTheme(mode: ThemeMode): void {
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch {
      // ignore
    }
  },

  // Settings
  getSettings(): UserSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          filterType: 'all',
          sortField: parsed.sortField || 'name',
          sortDirection: parsed.sortDirection || 'asc',
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  // Bookmarks (per book, page numbers) — local only, no account.
  // A bookmark is a page number the reader saved. For Drive books the
  // Drive viewer cannot be jumped to a page by the app, so the bookmark
  // is shown as "page X" to jump to by hand; for local PDFs the reader
  // opens at that page.
  getBookmarks(): Record<string, number[]> {
    try {
      const raw = localStorage.getItem(BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  getBookmarksForBook(bookId: string): number[] {
    return this.getBookmarks()[bookId] || [];
  },

  toggleBookmark(bookId: string, page: number): number[] {
    const all = this.getBookmarks();
    const current = all[bookId] || [];
    const list = current.includes(page)
      ? current.filter((p) => p !== page)
      : [...current, page].sort((a, b) => a - b);
    if (list.length > 0) {
      all[bookId] = list;
    } else {
      delete all[bookId];
    }
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(all));
    } catch {}
    return list;
  },

  // Guided Reading Journeys — done step titles per journey id.
  getJourneyProgress(): Record<string, string[]> {
    try {
      const raw = localStorage.getItem(JOURNEYS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  getJourneyDone(journeyId: string): string[] {
    return this.getJourneyProgress()[journeyId] || [];
  },

  toggleJourneyStep(journeyId: string, stepTitle: string): string[] {
    const all = this.getJourneyProgress();
    const done = all[journeyId] || [];
    const next = done.includes(stepTitle)
      ? done.filter((t) => t !== stepTitle)
      : [...done, stepTitle];
    if (next.length > 0) {
      all[journeyId] = next;
    } else {
      delete all[journeyId];
    }
    try {
      localStorage.setItem(JOURNEYS_KEY, JSON.stringify(all));
    } catch {}
    return next;
  },

  // My Shelf — saved books with a reading status, local only.
  // Stored newest first (object key order is kept by JSON round-trip
  // for string keys in insertion order).
  getShelf(): ShelfMap {
    try {
      const raw = localStorage.getItem(SHELF_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  setShelfStatus(bookId: string, status: ShelfStatus | null): ShelfMap {
    const shelf = this.getShelf();
    if (status === null) {
      delete shelf[bookId];
    } else if (shelf[bookId] === undefined) {
      // New save goes first.
      const next: ShelfMap = { [bookId]: status };
      for (const [id, s] of Object.entries(shelf)) next[id] = s as ShelfStatus;
      try {
        localStorage.setItem(SHELF_KEY, JSON.stringify(next));
      } catch {}
      return next;
    } else {
      shelf[bookId] = status;
    }
    try {
      localStorage.setItem(SHELF_KEY, JSON.stringify(shelf));
    } catch {}
    return shelf;
  },

  getShelfStatus(bookId: string): ShelfStatus | undefined {
    return this.getShelf()[bookId];
  },

  // Visit days — one YYYY-MM-DD per day the library was opened, local
  // only, used for the reading streak. Capped at 365 days.
  getVisitDates(): string[] {
    try {
      const raw = localStorage.getItem(VISITS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  recordVisit(date: Date = new Date()): string[] {
    const today = toISODateLocal(date);
    const list = this.getVisitDates();
    if (!list.includes(today)) {
      const next = [...list, today].slice(-365);
      try {
        localStorage.setItem(VISITS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    }
    return list;
  },

  // Instagram follow gate (honour unlock, remembered per browser).
  // This is NOT a verified Instagram follow check — a free site cannot do
  // that. The visitor follows @ghayb.chronicles, taps unlock, and the
  // library stays unlocked on this device.
  hasFollowUnlocked(): boolean {
    try {
      return localStorage.getItem(FOLLOW_UNLOCK_KEY) === '1';
    } catch {
      return false;
    }
  },

  setFollowUnlocked(): void {
    try {
      localStorage.setItem(FOLLOW_UNLOCK_KEY, '1');
    } catch {
      // ignore
    }
  },
};
