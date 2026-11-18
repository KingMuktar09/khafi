import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { router } from '../../router/router';
import type { TopicContent } from '../../data/topicsContent';
import { formatTopicDate } from '../../data/topicsContent';
import { fetchVisibleTopicRequests, type TopicRequestRow } from '../../services/topicRequests';
import { InstagramSendBox } from './InstagramSendBox';

/**
 * Shared layout for a long-form Topic discussion. Manuscript look
 * (ms-tools scope), back link to the Topics hub, a study-only note,
 * sections with headings, quote blocks with Arabic, transliteration
 * and English, a terms glossary, sources, and the continues note
 * shown clearly where the discussion is not complete yet.
 */
export const TopicPage: React.FC<{ topic: TopicContent }> = ({ topic }) => {
  const [comments, setComments] = useState<TopicRequestRow[]>([]);

  useEffect(() => {
    let live = true;
    fetchVisibleTopicRequests(topic.id).then((rows) => {
      if (live) setComments(rows);
    });
    return () => {
      live = false;
    };
  }, [topic.id]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in ms-tools">
      <button
        type="button"
        onClick={() => router.navigate('topics')}
        className="inline-flex items-center gap-1.5 text-sm ms-muted hover:text-[var(--ms-gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded px-1 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Topics
      </button>

      <div className="space-y-1.5">
        <span className="ms-eyebrow block">{topic.eyebrow}</span>
        <h1 className="ms-title">{topic.title}</h1>
        <p className="ms-subtitle">{topic.subtitle}</p>
      </div>

      <p className="ms-note-box">
        These discussions are for study only. They do not promise any outcome, and they give no religious
        ruling. Read them slowly, and check the sources named at the end.
      </p>

      <section className="ms-card space-y-3" aria-label="Introduction">
        <p className="ms-body">{topic.intro}</p>
      </section>

      {topic.continuesNote ? (
        <p className="ms-note-box" role="note">
          {topic.continuesNote}
        </p>
      ) : null}

      {topic.sections.map((section) => (
        <section key={section.heading} className="ms-card space-y-3">
          <h2 className="ms-h2">{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="ms-body">
              {paragraph}
            </p>
          ))}
          {section.quote ? (
            <blockquote className="ms-note-box space-y-2">
              {section.quote.arabic ? (
                <p className="ms-arabic-sm ms-gold" dir="rtl" lang="ar">
                  {section.quote.arabic}
                </p>
              ) : null}
              {section.quote.transliteration ? (
                <p className="ms-body italic">{section.quote.transliteration}</p>
              ) : null}
              <p className="ms-body">&ldquo;{section.quote.text}&rdquo;</p>
              <p className="ms-body ms-muted text-sm">Source: {section.quote.source}</p>
            </blockquote>
          ) : null}
        </section>
      ))}

      {topic.terms.length > 0 ? (
        <section className="ms-card space-y-3" aria-label="Words used here">
          <h2 className="ms-h2">Words used here</h2>
          <ul className="space-y-3">
            {topic.terms.map((term) => (
              <li key={term.transliteration} className="space-y-1">
                <p className="ms-arabic-sm ms-gold" dir="rtl" lang="ar">
                  {term.arabic}
                </p>
                <p className="ms-body">
                  <span className="italic">{term.transliteration}</span>: {term.meaning}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="ms-card space-y-3" aria-label="Closing">
        <p className="ms-body">{topic.closing}</p>
      </section>

      <section className="ms-card space-y-3" aria-label="Sources">
        <h2 className="ms-h2">Sources</h2>
        <ul className="space-y-2">
          {topic.sources.map((source, index) => (
            <li key={index} className="ms-body">
              {source}
            </li>
          ))}
        </ul>
      </section>

      {comments.length > 0 ? (
        <section className="ms-card space-y-3" aria-label="What others said">
          <h2 className="ms-h2">What others said</h2>
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="space-y-1">
                <p className="ms-body">
                  <span className="font-semibold">
                    {comment.instagram_name.toLowerCase() === 'anonymous'
                      ? 'Anonymous'
                      : `@${comment.instagram_name}`}
                  </span>
                  {' · '}
                  <span className="ms-muted text-sm">{formatTopicDate(new Date(comment.created_at))}</span>
                </p>
                <p className="ms-body">{comment.message}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <InstagramSendBox
        kind="comment"
        topic={topic.id}
        topicLabel={topic.title}
        title="Comments and wants"
        messageLabel="Your comment, or a topic you need"
        messagePlaceholder="Share a thought on this topic, or write a topic you need."
        note="Good comments and answered wants get added to this page."
        doneMessage="Thanks. Your note is saved. Good comments and answered wants get added to this page."
      />
    </div>
  );
};
