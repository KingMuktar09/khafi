import { describe, it, expect } from 'vitest';
import {
  isPaidBookLockedForVisitor,
  isPaidBookRoute,
  readerAccess,
  shouldShowGate,
} from '../src/utils/gateDecision';

// Phase 1 gate/router rule: a paid book needs its own key, even for
// followers. The outer follow gate must let a locked visitor reach a
// paid book's page (so the key lock screen can be reached), and the
// reader decides for itself.

const PAID = { id: 'b-paid', title: 'Paid Book', isPaid: true } as any;
const FREE = { id: 'b-free', title: 'Free Book', isPaid: false } as any;
const BOOKS = [PAID, FREE];

const locked = { followUnlocked: false, isAdmin: false };

describe('isPaidBookLockedForVisitor', () => {
  it('locks a paid book for everyone except the admin and a key holder', () => {
    expect(isPaidBookLockedForVisitor({ isPaid: true, isAdmin: false, hasKeyUnlock: false })).toBe(true);
    expect(isPaidBookLockedForVisitor({ isPaid: true, isAdmin: true, hasKeyUnlock: false })).toBe(false);
    expect(isPaidBookLockedForVisitor({ isPaid: true, isAdmin: false, hasKeyUnlock: true })).toBe(false);
    expect(isPaidBookLockedForVisitor({ isPaid: false, isAdmin: false, hasKeyUnlock: false })).toBe(false);
    expect(isPaidBookLockedForVisitor({ isPaid: undefined, isAdmin: false, hasKeyUnlock: false })).toBe(false);
  });
});

describe('isPaidBookRoute', () => {
  it('is true only for a paid book details route', () => {
    expect(isPaidBookRoute({ view: 'book', bookId: 'b-paid' }, BOOKS)).toBe(true);
    expect(isPaidBookRoute({ view: 'book', bookId: 'b-free' }, BOOKS)).toBe(false);
    expect(isPaidBookRoute({ view: 'book', bookId: 'b-missing' }, BOOKS)).toBe(false);
    expect(isPaidBookRoute({ view: 'book', bookId: 'b-paid' }, [])).toBe(false);
    expect(isPaidBookRoute({ view: 'book', bookId: 'b-paid' }, undefined)).toBe(false);
    expect(isPaidBookRoute({ view: 'read', bookId: 'b-paid' }, BOOKS)).toBe(false);
    expect(isPaidBookRoute({ view: 'library' }, BOOKS)).toBe(false);
  });
});

describe('shouldShowGate', () => {
  it('shows the gate for the library and free book pages to a locked visitor', () => {
    expect(shouldShowGate({ ...locked, route: { view: 'library' }, books: BOOKS, isTopics: false })).toBe(true);
    expect(shouldShowGate({ ...locked, route: { view: 'book', bookId: 'b-free' }, books: BOOKS, isTopics: false })).toBe(true);
    expect(shouldShowGate({ ...locked, route: { view: 'home' }, books: BOOKS, isTopics: false })).toBe(true);
  });

  it('does NOT show the gate for a paid book page, so the key lock screen can be reached', () => {
    expect(shouldShowGate({ ...locked, route: { view: 'book', bookId: 'b-paid' }, books: BOOKS, isTopics: false })).toBe(false);
  });

  it('does NOT show the gate for the reader — the reader decides for itself', () => {
    expect(shouldShowGate({ ...locked, route: { view: 'read', bookId: 'b-paid' }, books: BOOKS, isTopics: false })).toBe(false);
    expect(shouldShowGate({ ...locked, route: { view: 'read', bookId: 'b-free' }, books: BOOKS, isTopics: false })).toBe(false);
  });

  it('shows the gate for a paid book page while the catalog has not loaded yet (unknown book)', () => {
    expect(shouldShowGate({ ...locked, route: { view: 'book', bookId: 'b-paid' }, books: [], isTopics: false })).toBe(true);
    expect(shouldShowGate({ ...locked, route: { view: 'book', bookId: 'b-paid' }, books: undefined, isTopics: false })).toBe(true);
  });

  it('never shows the gate for a follow-unlocked visitor, the admin, topics, or the admin page', () => {
    const paidRoute = { view: 'book', bookId: 'b-paid' } as const;
    expect(shouldShowGate({ followUnlocked: true, isAdmin: false, route: paidRoute, books: BOOKS, isTopics: false })).toBe(false);
    expect(shouldShowGate({ ...locked, isAdmin: true, route: paidRoute, books: BOOKS, isTopics: false })).toBe(false);
    expect(shouldShowGate({ ...locked, route: { view: 'topics' }, books: BOOKS, isTopics: true })).toBe(false);
    expect(shouldShowGate({ ...locked, route: { view: 'admin' }, books: BOOKS, isTopics: false })).toBe(false);
  });
});

describe('readerAccess', () => {
  it('locks a paid book for a follow-unlocked visitor without the key', () => {
    expect(readerAccess({ isPaid: true, isAdmin: false, followUnlocked: true, hasKeyUnlock: false })).toBe('paid-lock');
    expect(readerAccess({ isPaid: true, isAdmin: false, followUnlocked: false, hasKeyUnlock: false })).toBe('paid-lock');
  });

  it('opens a paid book for the admin or a key holder', () => {
    expect(readerAccess({ isPaid: true, isAdmin: true, followUnlocked: false, hasKeyUnlock: false })).toBe('open');
    expect(readerAccess({ isPaid: true, isAdmin: false, followUnlocked: false, hasKeyUnlock: true })).toBe('open');
  });

  it('asks a locked visitor to follow before opening a free book', () => {
    expect(readerAccess({ isPaid: false, isAdmin: false, followUnlocked: false, hasKeyUnlock: false })).toBe('follow-prompt');
    expect(readerAccess({ isPaid: false, isAdmin: false, followUnlocked: true, hasKeyUnlock: false })).toBe('open');
    expect(readerAccess({ isPaid: false, isAdmin: true, followUnlocked: false, hasKeyUnlock: false })).toBe('open');
  });
});
