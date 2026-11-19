import type { Book, RouteState } from '../types';

/**
 * Paid-book gate rule (Phase 1, Nov 2026): a paid book needs its own
 * key, even for followers. Following @ghayb.chronicles unlocks the
 * library and every FREE book on the device, but it no longer opens a
 * paid book — only the admin or a visitor holding that book's own key
 * reads it.
 *
 * These pure helpers are the single home of the client-side rule, so
 * the App gate, the book page and the reader cannot drift apart, and
 * tests can pin the rule without rendering the whole app.
 */

/** Client mirror of the server predicate: locked unless admin or key. */
export function isPaidBookLockedForVisitor(args: {
  isPaid: boolean | undefined;
  isAdmin: boolean;
  hasKeyUnlock: boolean;
}): boolean {
  return Boolean(args.isPaid) && !args.isAdmin && !args.hasKeyUnlock;
}

/** True when the route is a paid book's details page. */
export function isPaidBookRoute(route: RouteState, books: Book[] | undefined): boolean {
  if (route.view !== 'book' || !route.bookId) return false;
  return Boolean((books || []).find((b) => b.id === route.bookId)?.isPaid);
}

/**
 * Should the outer follow gate show for this route? The gate stays for
 * the library and every free book. It must NOT block a paid book's page
 * (or the key lock screen on it could never be reached), and it must not
 * block the reader — PdfReaderView decides for itself: the lock screen
 * for a paid book, a follow prompt for a free book opened by a locked
 * visitor.
 */
export function shouldShowGate(args: {
  followUnlocked: boolean;
  isAdmin: boolean;
  route: RouteState;
  books: Book[] | undefined;
  isTopics: boolean;
}): boolean {
  const { followUnlocked, isAdmin, route, books, isTopics } = args;
  if (followUnlocked || isAdmin || isTopics) return false;
  if (route.view === 'admin') return false;
  if (route.view === 'read') return false;
  if (isPaidBookRoute(route, books)) return false;
  return true;
}

export type ReaderAccess = 'open' | 'paid-lock' | 'follow-prompt';

/**
 * What the reader may show for this book and visitor. A paid book opens
 * only for the admin or a key holder — a follow-unlocked visitor without
 * the key gets the lock screen. A free book opens for the admin or a
 * follow-unlocked visitor; a locked visitor gets a follow prompt.
 */
export function readerAccess(args: {
  isPaid: boolean | undefined;
  isAdmin: boolean;
  followUnlocked: boolean;
  hasKeyUnlock: boolean;
}): ReaderAccess {
  if (args.isPaid && !args.isAdmin && !args.hasKeyUnlock) return 'paid-lock';
  if (!args.isPaid && !args.isAdmin && !args.followUnlocked) return 'follow-prompt';
  return 'open';
}
