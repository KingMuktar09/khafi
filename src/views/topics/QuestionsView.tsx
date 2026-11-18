import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ArrowRight } from 'lucide-react';
import { router } from '../../router/router';
import { TOPIC_QUESTIONS } from '../../data/topicsQuestions';
import { topicRouteFor } from '../../data/topicsContent';
import { localizeQuestion } from '../../data/topicsI18n';
import { tt } from '../../data/i18n-topics';
import { appState } from '../../state/appState';
import { InstagramSendBox } from './InstagramSendBox';

/**
 * Questions: short answers to common questions, each with its sources.
 * New questions come through Instagram @ghayb.chronicles: the visitor
 * sends the question with their Instagram name, the answer goes back
 * to them, and the answered question is added here for others to read.
 */
export const QuestionsView: React.FC = () => {
  const lang = appState.settings.language;
  const questions = TOPIC_QUESTIONS.map((item) => localizeQuestion(item, lang));
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in ms-tools">
      <button
        type="button"
        onClick={() => router.navigate('topics')}
        className="inline-flex items-center gap-1.5 text-sm ms-muted hover:text-[var(--ms-gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded px-1 py-1"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {tt('topics.back', lang)}
      </button>

      <div className="space-y-1.5">
        <span className="ms-eyebrow block">{tt('topics.hubTitle', lang)}</span>
        <h1 className="ms-title">{tt('questions.title', lang)}</h1>
        <p className="ms-subtitle">{tt('questions.subtitle', lang)}</p>
      </div>

      <p className="ms-note-box">{tt('questions.studyNote', lang)}</p>

      <div className="space-y-3">
        {questions.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`ms-card overflow-hidden ${isOpen ? 'border-[var(--ms-gold)]' : ''}`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center gap-3 text-left cursor-pointer"
              >
                <span className="ms-h3 flex-1 min-w-0">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 ms-gold shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="pt-3 space-y-3 animate-fade-in">
                  {item.answer.map((paragraph, index) => (
                    <p key={index} className="ms-body">
                      {paragraph}
                    </p>
                  ))}
                  {item.quote ? (
                    <blockquote className="ms-note-box space-y-2">
                      {item.quote.arabic ? (
                        <p className="ms-arabic-sm ms-gold" dir="rtl" lang="ar">
                          {item.quote.arabic}
                        </p>
                      ) : null}
                      {item.quote.transliteration ? (
                        <p className="ms-body italic">{item.quote.transliteration}</p>
                      ) : null}
                      <p className="ms-body">&ldquo;{item.quote.text}&rdquo;</p>
                      <p className="ms-body ms-muted text-sm">
                        {tt('topics.sourceLabel', lang)}
                        {item.quote.source}
                      </p>
                    </blockquote>
                  ) : null}
                  {item.terms && item.terms.length > 0 ? (
                    <ul className="space-y-2">
                      {item.terms.map((term) => (
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
                  ) : null}
                  <p className="ms-body text-sm">
                    <span className="font-semibold">{tt('topics.sourcesLabel', lang)}</span>
                    {item.sources.join(' ')}
                  </p>
                  {item.topicId ? (
                    <button
                      type="button"
                      onClick={() => router.navigate(topicRouteFor(item.topicId as string))}
                      className="inline-flex items-center gap-1.5 text-sm ms-gold font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded px-1 py-1"
                    >
                      {tt('questions.readFull', lang)}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <InstagramSendBox
        kind="question"
        topic="general"
        title={tt('sendbox.askTitle', lang)}
        messageLabel={tt('sendbox.askLabel', lang)}
        messagePlaceholder={tt('sendbox.askPlaceholder', lang)}
        note={tt('sendbox.askNote', lang)}
        doneMessage={tt('sendbox.askDone', lang)}
      />
    </div>
  );
};
