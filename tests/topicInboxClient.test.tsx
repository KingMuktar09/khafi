import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TopicInbox } from '../src/components/admin/TopicInbox';
import {
  instagramDmUrl,
  countUnreadTopicRequests,
  type TopicRequestWithReply,
} from '../src/services/topicRequests';

// Admin inbox rendering: the component is rendered to static HTML with
// fixed items (no network — effects do not run in renderToStaticMarkup),
// so the bell badge, the per-item rows, the reply and the DM link can be
// checked exactly as the admin sees them.

const ITEMS: TopicRequestWithReply[] = [
  {
    id: 2,
    instagram_name: 'someone',
    kind: 'question',
    topic: 'general',
    message: 'How do I start the retreat?',
    created_at: '2026-11-18T17:41:03.000Z',
    status: 'new',
    reply: null,
  },
  {
    id: 1,
    instagram_name: 'Anonymous',
    kind: 'comment',
    topic: 'ibn-arabi-40-day-retreat',
    message: 'Beautiful topic, thank you.',
    created_at: '2026-11-18T13:47:19.000Z',
    status: 'approved',
    reply: { id: 10, request_id: 1, reply: 'Thank you — glad it helped.', created_at: '2026-11-18T18:00:00.000Z' },
  },
];

function renderInbox() {
  return renderToStaticMarkup(
    React.createElement(TopicInbox, { initialItems: ITEMS, initialUnread: 1 })
  );
}

describe('TopicInbox rendering', () => {
  it('shows the bell with the unread badge count', () => {
    const html = renderInbox();
    expect(html).toContain('Messages from visitors');
    expect(html).toContain('aria-label="1 new messages"');
    expect(html).toContain('>1<');
  });

  it('lists each message on its own with name, type, topic and message', () => {
    const html = renderInbox();
    expect(html).toContain('@someone');
    expect(html).toContain('Anonymous');
    expect(html).toContain('Question');
    expect(html).toContain('Comment');
    expect(html).toContain('On: general');
    expect(html).toContain('How do I start the retreat?');
    expect(html).toContain('Beautiful topic, thank you.');
  });

  it('shows the admin reply under its message, labelled as the library reply', () => {
    const html = renderInbox();
    expect(html).toContain('Your reply');
    expect(html).toContain('Thank you — glad it helped.');
  });

  it('shows Approve only for new messages', () => {
    const html = renderInbox();
    expect(html.match(/>Approve</g)?.length).toBe(1);
    expect(html).toContain('New');
    expect(html).toContain('Approved');
  });

  it('links DM on Instagram only for real handles, never for Anonymous', () => {
    const html = renderInbox();
    expect(html).toContain('href="https://ig.me/m/someone"');
    expect(html).not.toContain('instagram.com/Anonymous');
    expect(html).not.toContain('ig.me/m/Anonymous');
    expect(html.match(/DM on Instagram/g)?.length).toBe(1);
  });

  it('gives every message a Delete button', () => {
    const html = renderInbox();
    expect(html.match(/>Delete</g)?.length).toBe(2);
  });

  it('gives every reply box a Send button', () => {
    const html = renderInbox();
    expect(html.match(/Send reply/g)?.length).toBe(2);
  });
});

describe('instagramDmUrl', () => {
  it('builds the DM link for a real handle and rejects the rest', () => {
    expect(instagramDmUrl('someone')).toBe('https://ig.me/m/someone');
    expect(instagramDmUrl('@some.one_2')).toBe('https://ig.me/m/some.one_2');
    expect(instagramDmUrl('Anonymous')).toBeNull();
    expect(instagramDmUrl('Guest')).toBeNull();
    expect(instagramDmUrl('')).toBeNull();
    expect(instagramDmUrl('not a handle!')).toBeNull();
    expect(instagramDmUrl('a'.repeat(31))).toBeNull();
  });
});

describe('countUnreadTopicRequests', () => {
  it('counts only new items', () => {
    expect(countUnreadTopicRequests(ITEMS)).toBe(1);
    expect(countUnreadTopicRequests([])).toBe(0);
  });
});
