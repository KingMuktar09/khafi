import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { router } from '../../router/router';
import { STUDY_GUIDES } from '../../data/studyGuides';
import { localizeGuide } from '../../data/topicsI18n';
import { tt, ttf } from '../../data/i18n-topics';
import { appState } from '../../state/appState';

/**
 * Study Guides: all six guides in full, one after another, each
 * with its own anchor id. Same style as TopicPage: title, subtitle,
 * intro, sections with quote blocks, terms, closing, sources, and
 * a study-only note at the top.
 */
export const GuidesView: React.FC = () => {
  const lang = appState.settings.language;
  const guides = STUDY_GUIDES.map((guide) => localizeGuide(guide, lang));

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
        <h1 className="ms-title">{tt('guides.title', lang)}</h1>
        <p className="ms-subtitle">{ttf('guides.subtitle', lang, { count: STUDY_GUIDES.length })}</p>
      </div>

      <p className="ms-note-box">{tt('guides.studyNote', lang)}</p>
      {lang === 'hi' && <p className="ms-note-box">{tt('guides.englishOnly', lang)}</p>}

      <nav className="ms-card space-y-2" aria-label={tt('guides.onThisPage', lang)}>
        <h2 className="ms-h2">{tt('guides.onThisPage', lang)}</h2>
        <ul className="space-y-2">
          {guides.map((guide) => (
            <li key={guide.id}>
              <a
                href={`#${guide.id}`}
                className="ms-body ms-gold font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded px-1 py-1"
              >
                {guide.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {guides.map((guide) => (
        <article key={guide.id} id={guide.id} className="space-y-6 scroll-mt-20">
          <div className="space-y-1.5">
            <span className="ms-eyebrow block">{guide.eyebrow}</span>
            <h2 className="ms-title">{guide.title}</h2>
            <p className="ms-subtitle">{guide.subtitle}</p>
          </div>

          <section className="ms-card space-y-3" aria-label={tt('topics.intro', lang)}>
            <p className="ms-body">{guide.intro}</p>
          </section>

          {guide.sections.map((section) => (
            <section key={section.heading} className="ms-card space-y-3">
              <h3 className="ms-h2">{section.heading}</h3>
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
                  <p className="ms-body ms-muted text-sm">
                    {tt('topics.sourceLabel', lang)}
                    {section.quote.source}
                  </p>
                </blockquote>
              ) : null}
            </section>
          ))}

          {guide.terms.length > 0 ? (
            <section className="ms-card space-y-3" aria-label={tt('topics.wordsUsed', lang)}>
              <h3 className="ms-h2">{tt('topics.wordsUsed', lang)}</h3>
              <ul className="space-y-3">
                {guide.terms.map((term) => (
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

          <section className="ms-card space-y-3" aria-label={tt('topics.closing', lang)}>
            <p className="ms-body">{guide.closing}</p>
          </section>

          <section className="ms-card space-y-3" aria-label={tt('topics.sources', lang)}>
            <h3 className="ms-h2">{tt('topics.sources', lang)}</h3>
            <ul className="space-y-2">
              {guide.sources.map((source, index) => (
                <li key={index} className="ms-body">
                  {source}
                </li>
              ))}
            </ul>
          </section>
        </article>
      ))}
    </div>
  );
};
