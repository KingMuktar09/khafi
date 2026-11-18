import { RouteState, ViewName } from '../types';

type RouteChangeListener = (route: RouteState) => void;

class Router {
  private listeners: Set<RouteChangeListener> = new Set();
  private currentRoute: RouteState = { view: 'home' };

  constructor() {
    // Parse URL on init
    this.currentRoute = this.parseUrl(window.location.pathname, window.location.search);

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', () => {
      const parsed = this.parseUrl(window.location.pathname, window.location.search);
      this.currentRoute = parsed;
      this.notify();
    });
  }

  public getRoute(): RouteState {
    return { ...this.currentRoute };
  }

  public subscribe(listener: RouteChangeListener): () => void {
    this.listeners.add(listener);
    // Initial emission
    listener(this.getRoute());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const route = this.getRoute();
    this.listeners.forEach((fn) => fn(route));
  }

  public navigate(
    view: ViewName,
    params?: { folderId?: string | null; subfolderId?: string | null; bookId?: string | null; searchQuery?: string; category?: string | null },
    options?: { replace?: boolean }
  ): void {
    const newRoute: RouteState = {
      view,
      folderId: params?.folderId ?? null,
      subfolderId: params?.subfolderId ?? null,
      bookId: params?.bookId ?? null,
      searchQuery: params?.searchQuery ?? undefined,
      category: params?.category ?? null,
    };

    const url = this.buildUrl(newRoute);

    if (options?.replace) {
      window.history.replaceState(newRoute, '', url);
    } else {
      // Check if URL is already identical to prevent duplicate history entries
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl !== url) {
        window.history.pushState(newRoute, '', url);
      }
    }

    this.currentRoute = newRoute;
    this.notify();

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public back(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigate('home');
    }
  }

  private buildUrl(route: RouteState): string {
    switch (route.view) {
      case 'home':
        return '/';
      case 'library': {
        const searchParams = new URLSearchParams();
        if (route.folderId) searchParams.set('folderId', route.folderId);
        if (route.subfolderId) searchParams.set('subfolderId', route.subfolderId);
        if (route.category) searchParams.set('category', route.category);
        if (route.searchQuery) searchParams.set('q', route.searchQuery);
        const query = searchParams.toString();
        return query ? `/library?${query}` : '/library';
      }
      case 'favorites':
        return '/favorites';
      case 'info':
        return '/info';
      case 'book':
        return route.bookId ? `/book/${route.bookId}` : '/library';
      case 'read':
        return route.bookId ? `/read/${route.bookId}` : '/library';
      case 'admin':
        return '/admin';
      case 'journeys':
        return '/journeys';
      case 'timeline':
        return '/timeline';
      case 'shelf':
        return '/shelf';
      case 'finder':
        return '/finder';
      case 'wafq':
        return '/wafq';
      case 'amals':
        return '/amals';
      case 'tools':
        return '/tools';
      case 'tools-huruf':
        return '/tools/huruf';
      case 'tools-asma':
        return '/tools/asma';
      case 'tools-bast':
        return '/tools/bast';
      case 'tools-journal':
        return '/tools/journal';
      case 'tools-wird':
        return '/tools/wird';
      case 'tools-grimoire':
        return '/tools/grimoire';
      case 'tools-method':
        return '/tools/method';
      default:
        return '/';
    }
  }

  private parseUrl(pathname: string, search: string): RouteState {
    const params = new URLSearchParams(search);

    if (pathname.startsWith('/book/')) {
      const bookId = pathname.replace('/book/', '').trim();
      return { view: 'book', bookId };
    }

    if (pathname.startsWith('/read/')) {
      const bookId = pathname.replace('/read/', '').trim();
      return { view: 'read', bookId };
    }

    if (pathname === '/library' || pathname.startsWith('/library/')) {
      return {
        view: 'library',
        folderId: params.get('folderId') || null,
        subfolderId: params.get('subfolderId') || null,
        searchQuery: params.get('q') || undefined,
        category: params.get('category') || null,
      };
    }

    if (pathname === '/favorites') {
      return { view: 'favorites' };
    }

    if (pathname === '/info') {
      return { view: 'info' };
    }

    if (pathname === '/admin') {
      return { view: 'admin' };
    }

    if (pathname === '/journeys') {
      return { view: 'journeys' };
    }

    if (pathname === '/timeline') {
      return { view: 'timeline' };
    }

    if (pathname === '/shelf') {
      return { view: 'shelf' };
    }

    if (pathname === '/finder') {
      return { view: 'finder' };
    }

    if (pathname === '/wafq') {
      return { view: 'wafq' };
    }

    if (pathname === '/amals') {
      return { view: 'amals' };
    }

    if (pathname === '/tools') {
      return { view: 'tools' };
    }

    if (pathname === '/tools/huruf') {
      return { view: 'tools-huruf' };
    }

    if (pathname === '/tools/asma') {
      return { view: 'tools-asma' };
    }

    if (pathname === '/tools/bast') {
      return { view: 'tools-bast' };
    }

    if (pathname === '/tools/journal') {
      return { view: 'tools-journal' };
    }

    if (pathname === '/tools/wird') {
      return { view: 'tools-wird' };
    }

    if (pathname === '/tools/grimoire') {
      return { view: 'tools-grimoire' };
    }

    if (pathname === '/tools/method') {
      return { view: 'tools-method' };
    }

    return { view: 'home' };
  }
}

export const router = new Router();
