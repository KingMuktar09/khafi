import React from 'react';
import { ArrowRight } from 'lucide-react';
import { router } from '../../router/router';
import { TOPICS, getTopicOfTheDay, formatTopicDate, formatAddedDate, topicRouteFor } from '../../data/topicsContent';
import { InstagramSendBox } from './InstagramSendBox';

/**
 * Hub page for the long-form Topics, written as a daily blog.
 *
 * A Topic of the Day is featured on top: the pre-made topics are shown
 * in fixed upload order, one per day, cycling back to the start when
 * the list ends. The order is the same for every visitor, never random.
 * Below it are blog-style cards with a date label and a short intro,
 * then a Questions card and a Request a topic box.
 */
export const TopicsHubView: React.FC = () => {
  const today = getTopicOfTheDay(new Date());

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in ms-tools">
      <div className="space-y-1.5">
        <span className="ms-eyebrow block">Topics</span>
        <h1 className="ms-title">Topics</h1>
        <p className="ms-subtitle">
          Longer discussions, gathered from the books with their sources named. {TOPICS.length} topics so far.
        </p>
      </div>

      <p className="ms-note-box">
        These discussions are for study only. They do not promise any outcome, and they give no religious
        ruling. Read them slowly, and check the sources named at the end of each one.
      </p>

      <section className="ms-card ms-card-hover border-[var(--ms-gold)] space-y-3" aria-label="Topic of the Day">
        <span className="ms-eyebrow block">Topic of the Day</span>
        <p className="ms-body text-sm ms-muted">
          Day {today.dayNumber} · {formatTopicDate(today.date)}
        </p>
        <h2 className="ms-h2">{today.topic.title}</h2>
        <p className="ms-body">{today.topic.subtitle}</p>
        <button
          type="button"
          onClick={() => router.navigate(topicRouteFor(today.topic.id))}
          className="inline-flex items-center gap-1.5 text-sm ms-gold font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded px-1 py-1"
        >
          Read today&rsquo;s topic
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      <p className="ms-body text-sm ms-muted">
        A new topic every day, in the order the topics were made. Day 1 is the first topic. When the list
        ends, it starts again.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => router.navigate(topicRouteFor(topic.id))}
            className="ms-card ms-card-hover text-left space-y-3"
          >
            <span className="ms-label block">{formatAddedDate(topic.addedDate)}</span>
            <span className="flex items-center justify-between gap-3">
              <span className="ms-hub-title">{topic.title}</span>
              <ArrowRight className="w-5 h-5 ms-gold shrink-0" aria-hidden="true" />
            </span>
            <span className="ms-body block">{topic.subtitle}</span>
            <span className="ms-body text-sm ms-gold font-semibold block">Read the discussion</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.navigate('topics-questions')}
        className="ms-card ms-card-hover w-full text-left space-y-2"
      >
        <span className="ms-eyebrow block">Questions</span>
        <span className="ms-h2 block">Questions, answered</span>
        <span className="ms-body block">
          Short answers to common questions, with the source named for every answer. New answers get added
          here, so check back.
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm ms-gold font-semibold">
          Read the questions
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </button>

      <InstagramSendBox
        kind="request"
        topic="general"
        title="Request a topic"
        messageLabel="The topic you want"
        messagePlaceholder="Write the topic you want to read about."
        note="New topics come from requests like yours. Write the topic you want, with your Instagram name if you want to show who you are, or post as anonymous."
        doneMessage="Thanks. Your request is saved. New topics get added to this page in the order they were made."
      />
    </div>
  );
};
