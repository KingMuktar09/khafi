import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  TOPICS,
  TOPICS_START_DATE,
  TOPIC_ROUTES,
  getTopicOfTheDay,
  topicRouteFor,
  formatTopicDate,
  formatAddedDate,
} from '../src/data/topicsContent';
import { TOPIC_QUESTIONS } from '../src/data/topicsQuestions';
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from '../src/config/supabase';
import { submitTopicRequest, fetchVisibleTopicRequests } from '../src/services/topicRequests';

/**
 * Topics follow-ups: fixed-order daily rotation, the Questions part,
 * and the Supabase-backed request/comment boxes (with a clipboard +
 * Instagram DM fallback while the keys are not set).
 */

function readSource(relPath: string): string {
  return readFileSync(join(process.cwd(), relPath), 'utf8');
}

describe('Topic of the Day rotates in fixed upload order', () => {
  it('starts on 18 Nov 2026 with the first topic', () => {
    expect(TOPICS_START_DATE).toBe('2026-11-18');
    const day1 = getTopicOfTheDay(new Date(2026, 10, 18));
    expect(day1.dayNumber).toBe(1);
    expect(day1.topic.id).toBe('ibn-arabi-40-day-retreat');
  });

  it('walks the list one topic per day, never random', () => {
    expect(getTopicOfTheDay(new Date(2026, 10, 19)).topic.id).toBe('alam-al-malakut');
    expect(getTopicOfTheDay(new Date(2026, 10, 20)).topic.id).toBe('ruh-and-soul');
    expect(getTopicOfTheDay(new Date(2026, 10, 25)).topic.id).toBe('al-khidr');
    expect(getTopicOfTheDay(new Date(2026, 10, 25)).dayNumber).toBe(8);
  });

  it('cycles back to the start when the list ends', () => {
    const day9 = getTopicOfTheDay(new Date(2026, 10, 26));
    expect(day9.dayNumber).toBe(9);
    expect(day9.topic.id).toBe('ibn-arabi-40-day-retreat');
  });

  it('gives day 45 on 1 Jan 2027, the Seal of Solomon', () => {
    const day45 = getTopicOfTheDay(new Date(2027, 0, 1));
    expect(day45.dayNumber).toBe(45);
    expect(day45.topic.id).toBe('seal-of-solomon');
  });

  it('is the same for every visitor on the same day', () => {
    const date = new Date(2026, 10, 22);
    expect(getTopicOfTheDay(date).topic.id).toBe(getTopicOfTheDay(new Date(2026, 10, 22)).topic.id);
  });

  it('clamps dates before the start to day 1', () => {
    const before = getTopicOfTheDay(new Date(2026, 10, 1));
    expect(before.dayNumber).toBe(1);
    expect(before.topic.id).toBe('ibn-arabi-40-day-retreat');
  });

  it('every topic has an addedDate in upload order', () => {
    const dates = TOPICS.map((t) => t.addedDate);
    expect(dates.length).toBe(TOPICS.length);
    for (const date of dates) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect([...dates].sort()).toEqual(dates);
  });

  it('formats dates as "18 Nov 2026"', () => {
    expect(formatTopicDate(new Date(2026, 10, 18))).toBe('18 Nov 2026');
    expect(formatAddedDate('2026-11-18')).toBe('18 Nov 2026');
  });

  it('has one route per topic, and an unknown id falls back to the hub', () => {
    expect(Object.keys(TOPIC_ROUTES).sort()).toEqual(TOPICS.map((t) => t.id).sort());
    for (const topic of TOPICS) {
      expect(topicRouteFor(topic.id)).toBe(TOPIC_ROUTES[topic.id]);
    }
    expect(topicRouteFor('no-such-topic')).toBe('topics');
  });
});

describe('Questions', () => {
  it('has six answered questions, each with sources', () => {
    expect(TOPIC_QUESTIONS.map((q) => q.id)).toEqual([
      'what-is-the-ruh',
      'what-is-special-about-alif',
      'did-solomon-have-a-ring',
      'three-kinds-of-dreams',
      'what-happened-when-solomon-died',
      'is-the-picatrix-in-these-books',
    ]);
    for (const item of TOPIC_QUESTIONS) {
      expect(item.question.trim().length).toBeGreaterThan(0);
      expect(item.answer.length).toBeGreaterThanOrEqual(1);
      for (const paragraph of item.answer) {
        expect(paragraph.trim().length).toBeGreaterThan(0);
      }
      expect(item.sources.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('every linked full discussion exists as a topic', () => {
    for (const item of TOPIC_QUESTIONS) {
      if (item.topicId) {
        expect(TOPICS.some((t) => t.id === item.topicId), `${item.id} topicId`).toBe(true);
      }
    }
  });

  it('the Saba question quotes Qur\u2019an 34:14', () => {
    const saba = TOPIC_QUESTIONS.find((q) => q.id === 'what-happened-when-solomon-died');
    expect(saba?.quote?.source).toBe('Qur\u2019an 34:14');
    expect(saba?.quote?.text).toContain('When he fell');
  });

  it('the Picatrix question is honest that the book is not in the sources', () => {
    const picatrix = TOPIC_QUESTIONS.find((q) => q.id === 'is-the-picatrix-in-these-books');
    expect(picatrix?.answer.join(' ')).toContain('not in this collection');
    expect(picatrix?.topicId).toBeUndefined();
  });
});

describe('Topic requests use the public Supabase fallback', () => {
  it('isSupabaseConfigured is true via the public fallback, with the ilmeghayb project URL', () => {
    expect(isSupabaseConfigured()).toBe(true);
    expect(SUPABASE_URL).toBe('https://icbqkqvlonjzqokxljpg.supabase.co');
    expect(SUPABASE_ANON_KEY).toBeTruthy();
  });

  it('submit posts without a status, so the table default (new) applies', async () => {
    const calls: { url: string; body: string }[] = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async (url: unknown, init?: { body?: unknown }) => {
      calls.push({ url: String(url), body: String(init?.body ?? '') });
      return { ok: true } as Response;
    }) as typeof fetch;
    try {
      const result = await submitTopicRequest({
        instagramName: 'Anonymous',
        kind: 'comment',
        topic: 'ruh-and-soul',
        message: 'A test comment',
      });
      expect(result.stored).toBe(true);
      expect(calls).toHaveLength(1);
      expect(calls[0].url).toContain('/rest/v1/topic_requests');
      const body = JSON.parse(calls[0].body) as Record<string, unknown>;
      expect(body).toEqual({
        instagram_name: 'Anonymous',
        kind: 'comment',
        topic: 'ruh-and-soul',
        message: 'A test comment',
      });
      expect(body).not.toHaveProperty('status');
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  it('submit returns stored: false when the request fails, without throwing', async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error('no network');
    }) as typeof fetch;
    try {
      const result = await submitTopicRequest({
        instagramName: 'tester',
        kind: 'request',
        topic: 'general',
        message: 'A test topic',
      });
      expect(result.stored).toBe(false);
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  it('list asks only for approved comments of one topic, newest first', async () => {
    const calls: string[] = [];
    const rows = [
      {
        id: 1,
        instagram_name: 'Anonymous',
        kind: 'comment',
        topic: 'ruh-and-soul',
        message: 'Hello',
        created_at: '2026-11-18T00:00:00Z',
        status: 'approved',
      },
    ];
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async (url: unknown) => {
      calls.push(String(url));
      return { ok: true, json: async () => rows } as Response;
    }) as typeof fetch;
    try {
      const listed = await fetchVisibleTopicRequests('ruh-and-soul');
      expect(listed).toEqual(rows);
      expect(calls).toHaveLength(1);
      expect(calls[0]).toContain('topic=eq.ruh-and-soul');
      expect(calls[0]).toContain('kind=eq.comment');
      expect(calls[0]).toContain('status=eq.approved');
      expect(calls[0]).toContain('order=created_at.desc');
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  it('list returns an empty list when the request fails', async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error('no network');
    }) as typeof fetch;
    try {
      expect(await fetchVisibleTopicRequests('ruh-and-soul')).toEqual([]);
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});

describe('Posting as anonymous', () => {
  it('the send box offers "Post as anonymous" and an optional name, never "Post as guest"', () => {
    const box = readSource('src/views/topics/InstagramSendBox.tsx');
    expect(box).toContain('Post as anonymous');
    expect(box).toContain('Your Instagram name (optional)');
    expect(box).not.toContain('Post as guest');
    expect(box).toContain(`'Anonymous'`);
  });

  it('anonymous comments show as "Anonymous" with no @ on the Topic page', () => {
    const page = readSource('src/views/topics/TopicPage.tsx');
    expect(page).toContain(`toLowerCase() === 'anonymous'`);
    expect(page).toContain(`'Anonymous'`);
  });

  it('the Questions note says a visitor may post as anonymous', () => {
    const questions = readSource('src/views/topics/QuestionsView.tsx');
    expect(questions).toContain('post as anonymous');
    const hub = readSource('src/views/topics/TopicsHubView.tsx');
    expect(hub).toContain('post as anonymous');
  });
});

describe('No em dashes in the new Topics view files', () => {
  it('InstagramSendBox, QuestionsView, TopicsHubView and TopicPage contain no em dash', () => {
    for (const file of [
      'src/views/topics/InstagramSendBox.tsx',
      'src/views/topics/QuestionsView.tsx',
      'src/views/topics/TopicsHubView.tsx',
      'src/views/topics/TopicPage.tsx',
    ]) {
      const text = readSource(file);
      expect(text, `${file} must not contain an em dash`).not.toContain('\u2014');
    }
  });

  it('the Home Topic of the Day strip contains no em dash', () => {
    const home = readSource('src/views/HomeView.tsx');
    expect(home).not.toContain('Topic of the Day \u2014');
  });
});
