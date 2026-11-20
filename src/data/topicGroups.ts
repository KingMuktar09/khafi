import { cleanLabel } from '../utils/bookOrder';
import type { Book, Folder } from '../types';

/**
 * The 6 big topics — display grouping ONLY.
 *
 * The catalog still has 27 folders and 11 categories with their own
 * ids and names (data/catalog.json is untouched). These groups exist
 * only so a normal person can pick what to read without digging
 * through 27 long folder names, duplicates and deep nesting. A group
 * is just a set of the library's real categories; a folder belongs to
 * the group that holds most of the books inside it.
 */
export interface TopicGroup {
  id: string;
  title: string;
  /** One plain line saying what lives here. */
  blurb: string;
  /** Real category names from the catalog. */
  categories: string[];
}

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    id: 'quran',
    title: 'Quran & Tafseer',
    blurb: 'The Quran, and how scholars explain it.',
    categories: ['Quran & Tafseer'],
  },
  {
    id: 'hadith',
    title: 'Hadith',
    blurb: "The Prophet's sayings and practice, collected.",
    categories: ['Hadith'],
  },
  {
    id: 'seerah',
    title: 'Life of the Prophet',
    blurb: "The Prophet's life, and the stories of the Prophets.",
    categories: ['Seerah & Prophets', 'Stories & Literature'],
  },
  {
    id: 'history',
    title: 'History',
    blurb: 'How Islam grew, and why empires rise and fall.',
    categories: ['Islamic History'],
  },
  {
    id: 'sufism',
    title: 'Sufism & Wisdom',
    blurb: 'The spiritual path, and the foundations of faith.',
    categories: ['Sufism & Tasawwuf', 'Aqeedah & Foundations'],
  },
  {
    id: 'hidden',
    title: 'Hidden Knowledge',
    blurb: 'Secrets, symbols, the soul, dreams, and the unseen world.',
    categories: [
      'Hidden Knowledge & Esoteric',
      'Creation & the Universe',
      'Soul, Death & Afterlife',
      'Dreams & the Unseen',
    ],
  },
];

/** The group a category belongs to, if any. */
export function groupForCategory(category: string): TopicGroup | undefined {
  const name = cleanLabel(category);
  return TOPIC_GROUPS.find((g) => g.categories.some((c) => cleanLabel(c) === name));
}

/** Book counts per group, in group order. Groups with no books are skipped. */
export function topicGroupCounts(books: Book[]): Array<{ group: TopicGroup; count: number }> {
  const visible = books.filter((b) => b.visible !== false);
  return TOPIC_GROUPS.map((group) => ({
    group,
    count: visible.filter((b) => group.categories.some((c) => cleanLabel(c) === cleanLabel(b.category))).length,
  })).filter((g) => g.count > 0);
}

/** Display name for a folder: strips the leading 📂/📁 emoji Drive names carry. */
export function cleanFolderName(name?: string | null): string {
  return (name || '').replace(/^[\u{1F4C2}\u{1F4C1}\u{1F5C2}\u{1F4C4}\s]+/u, '').trim();
}

/**
 * The group a folder belongs to: the group holding most of the books
 * stored in it (folder or subfolder). Falls back to name keywords
 * for empty folders, so they still land somewhere sensible.
 */
export function groupForFolder(folder: Folder, books: Book[]): TopicGroup | undefined {
  const inside = books.filter((b) => b.folderId === folder.id || b.subfolderId === folder.id);
  if (inside.length > 0) {
    const counts = new Map<string, number>();
    for (const book of inside) {
      const group = groupForCategory(book.category);
      if (group) counts.set(group.id, (counts.get(group.id) || 0) + 1);
    }
    let best: TopicGroup | undefined;
    let bestCount = 0;
    for (const [id, n] of counts) {
      if (n > bestCount) {
        bestCount = n;
        best = TOPIC_GROUPS.find((g) => g.id === id);
      }
    }
    if (best) return best;
  }
  const name = cleanFolderName(folder.name).toLowerCase();
  if (/quran|tafsir|tafseer/.test(name)) return TOPIC_GROUPS[0];
  if (/bukhari|muslim|hadith/.test(name)) return TOPIC_GROUPS[1];
  if (/sira|seerah|prophet|muhammad|jesus|miraj|mus'ab|uma/i.test(name)) return TOPIC_GROUPS[2];
  if (/tareekh|tabari|athir|kholafa|history|islam$/.test(name)) return TOPIC_GROUPS[3];
  if (/sufi|ihya|ulum|basics|exclusive/.test(name)) return TOPIC_GROUPS[4];
  return TOPIC_GROUPS[5];
}
