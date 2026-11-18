import { Book } from '../types';

/**
 * Topic / category ordering, same-name versions, and Authentic helpers.
 *
 * Organising rule (from Muktar): books are arranged by their TOPIC and
 * CATEGORY, not by their Drive folder. A folder only says where a file
 * lives; topic + category say what the book is about, and that is what
 * readers browse by. No folder digging is needed to find or move a book.
 */

export const UNTITLED_TOPIC = 'No topic yet';

export function cleanLabel(value?: string | null): string {
  return (value || '').trim();
}

export function normalizeTitle(title: string): string {
  return (title || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/** The date that identifies a copy: Drive modifiedTime, stored in the
 *  catalog as updatedDate (addedDate as fallback). Never invented. */
export function bookVersionDate(book: Book): string {
  return book.updatedDate || book.addedDate || '';
}

export function formatVersionDate(book: Book): string {
  const d = bookVersionDate(book);
  if (!d) return 'Date unknown';
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return 'Date unknown';
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export interface BookVersion {
  book: Book;
  /** 1 = oldest copy, 2 = next, and so on (by real date). */
  versionNumber: number;
  totalVersions: number;
  versionDate: string;
}

/**
 * Group books with the same title (case/space-insensitive) as versions.
 * Oldest copy is Version 1. A book with no same-name twin is Version 1 of 1.
 */
export function groupBookVersions(books: Book[]): Map<string, BookVersion[]> {
  const groups = new Map<string, Book[]>();
  for (const book of books) {
    const key = normalizeTitle(book.title);
    if (!key) continue;
    const list = groups.get(key) || [];
    list.push(book);
    groups.set(key, list);
  }
  const out = new Map<string, BookVersion[]>();
  for (const [key, list] of groups) {
    const sorted = [...list].sort(
      (a, b) =>
        bookVersionDate(a).localeCompare(bookVersionDate(b)) ||
        a.id.localeCompare(b.id)
    );
    out.set(
      key,
      sorted.map((book, i) => ({
        book,
        versionNumber: i + 1,
        totalVersions: sorted.length,
        versionDate: bookVersionDate(book),
      }))
    );
  }
  return out;
}

export function getBookVersion(books: Book[], book: Book): BookVersion {
  const group = groupBookVersions(books).get(normalizeTitle(book.title)) || [];
  return (
    group.find((v) => v.book.id === book.id) || {
      book,
      versionNumber: 1,
      totalVersions: 1,
      versionDate: bookVersionDate(book),
    }
  );
}

/** Distinct categories, in admin order first, then alphabetical. */
export function getCategories(books: Book[], categoryOrder?: string[]): string[] {
  const names = [...new Set(books.map((b) => cleanLabel(b.category)).filter(Boolean))];
  const order = new Map((categoryOrder || []).map((name, i) => [name, i]));
  return names.sort((a, b) => {
    const oa = order.has(a) ? order.get(a)! : Number.MAX_SAFE_INTEGER;
    const ob = order.has(b) ? order.get(b)! : Number.MAX_SAFE_INTEGER;
    return oa - ob || a.localeCompare(b);
  });
}

/** Distinct topics, in admin order first, then alphabetical. Books with
 *  no topic set are not listed (they show under "No topic yet"). */
export function getTopics(books: Book[], topicOrder?: string[]): string[] {
  const names = [...new Set(books.map((b) => cleanLabel(b.topic)).filter(Boolean))];
  const order = new Map((topicOrder || []).map((name, i) => [name, i]));
  return names.sort((a, b) => {
    const oa = order.has(a) ? order.get(a)! : Number.MAX_SAFE_INTEGER;
    const ob = order.has(b) ? order.get(b)! : Number.MAX_SAFE_INTEGER;
    return oa - ob || a.localeCompare(b);
  });
}

/** Topics used inside one category (same ordering rule). */
export function getTopicsForCategory(
  books: Book[],
  category: string,
  topicOrder?: string[]
): string[] {
  return getTopics(
    books.filter((b) => cleanLabel(b.category) === cleanLabel(category)),
    topicOrder
  );
}

function orderIndex(order: string[] | undefined, name: string): number {
  const i = (order || []).indexOf(name);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

/**
 * The library's display order: category (admin order, then A–Z), then
 * topic inside that category (admin order, then A–Z, no-topic last),
 * then the admin's sortOrder inside that topic, then title.
 */
export function sortBooksByTopicCategory(
  books: Book[],
  categoryOrder?: string[],
  topicOrder?: string[]
): Book[] {
  return [...books].sort((a, b) => {
    const ca = cleanLabel(a.category) || 'General';
    const cb = cleanLabel(b.category) || 'General';
    const catDiff = orderIndex(categoryOrder, ca) - orderIndex(categoryOrder, cb);
    if (catDiff !== 0) return catDiff;
    if (ca !== cb) return ca.localeCompare(cb);

    const ta = cleanLabel(a.topic);
    const tb = cleanLabel(b.topic);
    if (ta !== tb) {
      if (!ta) return 1;
      if (!tb) return -1;
      const topicDiff = orderIndex(topicOrder, ta) - orderIndex(topicOrder, tb);
      if (topicDiff !== 0) return topicDiff;
      return ta.localeCompare(tb);
    }

    const sa = typeof a.sortOrder === 'number' ? a.sortOrder : Number.MAX_SAFE_INTEGER;
    const sb = typeof b.sortOrder === 'number' ? b.sortOrder : Number.MAX_SAFE_INTEGER;
    if (sa !== sb) return sa - sb;
    return a.title.localeCompare(b.title);
  });
}

/** Move one book one step up/down inside an already-ordered list.
 *  Returns the new list, or the same list when the move is impossible. */
export function moveBookInList<T extends { id: string }>(
  list: T[],
  id: string,
  direction: 'up' | 'down'
): T[] {
  const i = list.findIndex((item) => item.id === id);
  if (i === -1) return list;
  const j = direction === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Move a name one step up/down inside an order list. */
export function moveNameInOrder(
  order: string[],
  name: string,
  direction: 'up' | 'down'
): string[] {
  return moveBookInList(
    order.map((n) => ({ id: n })),
    name,
    direction
  ).map((item) => item.id);
}

/** "Authentic" means: the admin checked this copy and found it to be the
 *  genuine, unaltered text of the named work. Unmarked = not checked yet. */
export const AUTHENTIC_MEANING =
  'Marked Authentic by the library admin — this copy was checked and found to be the genuine, unaltered text of the named work, not a fake, altered or mislabelled copy. A book without this mark has simply not been checked yet.';
