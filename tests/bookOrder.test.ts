import { describe, it, expect } from 'vitest';
import {
  groupBookVersions,
  getBookVersion,
  getCategories,
  getTopics,
  sortBooksByTopicCategory,
  moveBookInList,
  moveNameInOrder,
  formatVersionDate,
} from '../src/utils/bookOrder';
import { Book } from '../src/types';

function book(partial: Partial<Book>): Book {
  return {
    id: partial.id || 'b-x',
    title: partial.title || 'Untitled',
    author: partial.author || '',
    description: '',
    category: partial.category || 'General',
    topic: partial.topic,
    folderId: 'f-root',
    tags: [],
    addedDate: partial.addedDate ?? '2026-01-01T00:00:00.000Z',
    updatedDate: partial.updatedDate ?? '2026-01-01T00:00:00.000Z',
    featured: false,
    visible: true,
    sortOrder: partial.sortOrder,
    isAuthentic: partial.isAuthentic,
  };
}

describe('groupBookVersions', () => {
  it('labels the oldest same-name copy Version 1 and the newer one Version 2', () => {
    // The real pair in the catalog: two "Free Will" notes, different dates.
    const books = [
      book({ id: 'b-new', title: 'Free Will', updatedDate: '2026-06-22T09:01:29.000Z' }),
      book({ id: 'b-old', title: 'Free Will', updatedDate: '2026-06-22T08:52:14.000Z' }),
      book({ id: 'b-other', title: 'Other Book', updatedDate: '2026-06-22T08:00:00.000Z' }),
    ];
    const groups = groupBookVersions(books);
    const freeWill = groups.get('free will')!;
    expect(freeWill).toHaveLength(2);
    expect(freeWill[0].book.id).toBe('b-old');
    expect(freeWill[0].versionNumber).toBe(1);
    expect(freeWill[1].book.id).toBe('b-new');
    expect(freeWill[1].versionNumber).toBe(2);
    expect(freeWill[1].totalVersions).toBe(2);

    const other = getBookVersion(books, books[2]);
    expect(other.versionNumber).toBe(1);
    expect(other.totalVersions).toBe(1);
  });

  it('matches titles case- and space-insensitively', () => {
    const books = [
      book({ id: 'b-1', title: '  Seerah  ' }),
      book({ id: 'b-2', title: 'seerah' }),
    ];
    expect(groupBookVersions(books).get('seerah')).toHaveLength(2);
  });

  it('formats the real version date, never inventing one', () => {
    const b = book({ updatedDate: '2026-06-22T09:01:29.000Z' });
    expect(formatVersionDate(b)).toBe('22 Jun 2026');
    expect(formatVersionDate(book({ updatedDate: '', addedDate: '' }))).toBe('Date unknown');
  });
});

describe('topic / category ordering', () => {
  it('sorts by category, then topic, then sortOrder, then title', () => {
    const books = [
      book({ id: 'b-3', title: 'Zebra', category: 'History', topic: 'Tareekh', sortOrder: 2 }),
      book({ id: 'b-1', title: 'Apple', category: 'History', topic: 'Tareekh', sortOrder: 1 }),
      book({ id: 'b-2', title: 'Mango', category: 'Sufism', topic: 'Wisdom', sortOrder: 1 }),
      book({ id: 'b-4', title: 'NoTopic', category: 'History', topic: '', sortOrder: 1 }),
    ];
    const sorted = sortBooksByTopicCategory(books, ['History', 'Sufism'], ['Tareekh']);
    expect(sorted.map((b) => b.id)).toEqual(['b-1', 'b-3', 'b-4', 'b-2']);
  });

  it('lists categories in admin order, then alphabetical', () => {
    const books = [
      book({ category: 'Zebra' }),
      book({ category: 'Apple' }),
      book({ category: 'Mango' }),
    ];
    expect(getCategories(books, ['Mango', 'Apple'])).toEqual(['Mango', 'Apple', 'Zebra']);
    expect(getTopics(books)).toEqual([]);
  });

  it('lists topics in admin order, then alphabetical', () => {
    const books = [
      book({ topic: 'Zulu' }),
      book({ topic: 'Alpha' }),
      book({ topic: '' }),
    ];
    expect(getTopics(books, ['Alpha'])).toEqual(['Alpha', 'Zulu']);
  });
});

describe('move helpers', () => {
  it('moves a book one step up or down, and not past the ends', () => {
    const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(moveBookInList(list, 'b', 'up').map((x) => x.id)).toEqual(['b', 'a', 'c']);
    expect(moveBookInList(list, 'b', 'down').map((x) => x.id)).toEqual(['a', 'c', 'b']);
    expect(moveBookInList(list, 'a', 'up')).toEqual(list);
    expect(moveBookInList(list, 'c', 'down')).toEqual(list);
  });

  it('moves a category/topic name in its order list', () => {
    expect(moveNameInOrder(['A', 'B', 'C'], 'B', 'down')).toEqual(['A', 'C', 'B']);
    expect(moveNameInOrder(['A', 'B', 'C'], 'A', 'up')).toEqual(['A', 'B', 'C']);
  });
});
