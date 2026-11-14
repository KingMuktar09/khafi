import { ReadingProgress, ThemeMode, UserSettings } from '../types';

const FAVORITES_KEY = 'khafi_favorites';
const RECENT_KEY = 'khafi_recently_viewed';
const THEME_KEY = 'khafi_theme';
const PROGRESS_KEY = 'khafi_reading_progress';
const SETTINGS_KEY = 'khafi_user_settings';

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
};
