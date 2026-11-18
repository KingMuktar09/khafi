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
      case 'tools-today':
        return '/tools/today';
      case 'tools-hours':
        return '/tools/hours';
      case 'tools-moon':
        return '/tools/moon';
      case 'tools-mansions':
        return '/tools/mansions';
      case 'tools-falak':
        return '/tools/falak';
      case 'tools-majlis':
        return '/tools/majlis';
      case 'tools-forge':
        return '/tools/forge';
      case 'tools-qawaid':
        return '/tools/qawaid';
      case 'tools-kitab':
        return '/tools/kitab';
      case 'tools-talasim':
        return '/tools/talasim';
      case 'tools-ashkal':
        return '/tools/ashkal';
      case 'tools-figure-forge':
        return '/tools/figure-forge';
      case 'tools-talism-studio':
        return '/tools/talism-studio';
      case 'tools-haqaiq':
        return '/tools/haqaiq';
      case 'tools-shart':
        return '/tools/shart';
      case 'tools-sirr-al-jalil':
        return '/tools/sirr-al-jalil';
      case 'tools-durus':
        return '/tools/durus';
      case 'tools-index':
        return '/tools/index';
      case 'tools-library':
        return '/tools/library';
      case 'tools-atlas':
        return '/tools/atlas';
      case 'tools-qalam':
        return '/tools/qalam';
      case 'tools-khatam':
        return '/tools/khatam';
      case 'tools-plate':
        return '/tools/plate';
      case 'tools-works':
        return '/tools/works';
      case 'tools-bakhur-adad':
        return '/tools/bakhur-adad';
      case 'tools-shurut':
        return '/tools/shurut';
      case 'tools-glossary':
        return '/tools/glossary';
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

    if (pathname === '/tools/today') {
      return { view: 'tools-today' };
    }

    if (pathname === '/tools/hours') {
      return { view: 'tools-hours' };
    }

    if (pathname === '/tools/moon') {
      return { view: 'tools-moon' };
    }

    if (pathname === '/tools/mansions') {
      return { view: 'tools-mansions' };
    }

    if (pathname === '/tools/falak') {
      return { view: 'tools-falak' };
    }

    if (pathname === '/tools/majlis') {
      return { view: 'tools-majlis' };
    }

    if (pathname === '/tools/forge') {
      return { view: 'tools-forge' };
    }

    if (pathname === '/tools/qawaid') {
      return { view: 'tools-qawaid' };
    }

    if (pathname === '/tools/kitab') {
      return { view: 'tools-kitab' };
    }

    if (pathname === '/tools/talasim') {
      return { view: 'tools-talasim' };
    }

    if (pathname === '/tools/ashkal') {
      return { view: 'tools-ashkal' };
    }

    if (pathname === '/tools/figure-forge') {
      return { view: 'tools-figure-forge' };
    }

    if (pathname === '/tools/talism-studio') {
      return { view: 'tools-talism-studio' };
    }

    if (pathname === '/tools/haqaiq') {
      return { view: 'tools-haqaiq' };
    }

    if (pathname === '/tools/shart') {
      return { view: 'tools-shart' };
    }

    if (pathname === '/tools/sirr-al-jalil') {
      return { view: 'tools-sirr-al-jalil' };
    }

    if (pathname === '/tools/durus') {
      return { view: 'tools-durus' };
    }

    if (pathname === '/tools/index') {
      return { view: 'tools-index' };
    }

    if (pathname === '/tools/library') {
      return { view: 'tools-library' };
    }

    if (pathname === '/tools/atlas') {
      return { view: 'tools-atlas' };
    }

    if (pathname === '/tools/qalam') {
      return { view: 'tools-qalam' };
    }

    if (pathname === '/tools/khatam') {
      return { view: 'tools-khatam' };
    }

    if (pathname === '/tools/plate') {
      return { view: 'tools-plate' };
    }

    if (pathname === '/tools/works') {
      return { view: 'tools-works' };
    }

    if (pathname === '/tools/bakhur-adad') {
      return { view: 'tools-bakhur-adad' };
    }

    if (pathname === '/tools/shurut') {
      return { view: 'tools-shurut' };
    }

    if (pathname === '/tools/glossary') {
      return { view: 'tools-glossary' };
    }

    return { view: 'home' };
  }
}

export const router = new Router();
