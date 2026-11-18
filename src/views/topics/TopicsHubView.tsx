import React from 'react';
import { ArrowRight } from 'lucide-react';
import { router } from '../../router/router';
import { TOPICS, getTopicOfTheDay, formatTopicDate, formatAddedDate, topicRouteFor } from '../../data/topicsContent';
import { localizeTopic } from '../../data/topicsI18n';
import { tt, ttf } from '../../data/i18n-topics';
import { appState } from '../../state/appState';
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
  const lang = appState.settings.language;
  const today = getTopicOfTheDay(new Date());
  const todayTopic = localizeTopic(today.topic, lang);
  const topics = TOPICS.map((topic) => localizeTopic(topic, lang));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in ms-tools">
      <div className="space-y-1.5">
        <span className="ms-eyebrow block">{tt('topics.hubTitle', lang)}</span>
        <h1 className="ms-title">{tt('topics.hubTitle', lang)}</h1>
        <p className="ms-subtitle">{ttf('topics.hubSubtitle', lang, { count: TOPICS.length })}</p>
      </div>

      <p className="ms-note-box">{tt('topics.studyNoteHub', lang)}</p>

      <section className="ms-card ms-card-hover border-[var(--ms-gold)] space-y-3" aria-label={tt('topics.topicOfDay', lang)}>
        <span className="ms-eyebrow block">{tt('topics.topicOfDay', lang)}</span>
        <p className="ms-body text-sm ms-muted">
          {ttf('topics.dayLabel', lang, { day: today.dayNumber, date: formatTopicDate(today.date) })}
        </p>
        <h2 className="ms-h2">{todayTopic.title}</h2>
        <p className="ms-body">{todayTopic.subtitle}</p>
        <button
          type="button"
          onClick={() => router.navigate(topicRouteFor(today.topic.id))}
          className="inline-flex items-center gap-1.5 text-sm ms-gold font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded px-1 py-1"
        >
          {tt('topics.readToday', lang)}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      <p className="ms-body text-sm ms-muted">{tt('topics.dailyNote', lang)}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
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
            <span className="ms-body text-sm ms-gold font-semibold block">{tt('topics.readDiscussion', lang)}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.navigate('topics-guides')}
        className="ms-card ms-card-hover w-full text-left space-y-2"
      >
        <span className="ms-eyebrow block">{tt('topics.guidesEyebrow', lang)}</span>
        <span className="ms-h2 block">{tt('topics.guidesTitle', lang)}</span>
        <span className="ms-body block">{tt('topics.guidesDesc', lang)}</span>
        <span className="inline-flex items-center gap-1.5 text-sm ms-gold font-semibold">
          {tt('topics.readGuides', lang)}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </button>

      <button
        type="button"
        onClick={() => router.navigate('topics-questions')}
        className="ms-card ms-card-hover w-full text-left space-y-2"
      >
        <span className="ms-eyebrow block">{tt('topics.questionsEyebrow', lang)}</span>
        <span className="ms-h2 block">{tt('topics.questionsTitle', lang)}</span>
        <span className="ms-body block">{tt('topics.questionsDesc', lang)}</span>
        <span className="inline-flex items-center gap-1.5 text-sm ms-gold font-semibold">
          {tt('topics.readQuestions', lang)}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </button>

      <InstagramSendBox
        kind="request"
        topic="general"
        title={tt('sendbox.requestTitle', lang)}
        messageLabel={tt('sendbox.requestLabel', lang)}
        messagePlaceholder={tt('sendbox.requestPlaceholder', lang)}
        note={tt('sendbox.requestNote', lang)}
        doneMessage={tt('sendbox.requestDone', lang)}
      />
    </div>
  );
};
