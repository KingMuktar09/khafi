import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { router } from '../../router/router';
import { STUDY_GUIDES } from '../../data/studyGuides';

/**
 * Study Guides: all six guides in full, one after another, each
 * with its own anchor id. Same style as TopicPage: title, subtitle,
 * intro, sections with quote blocks, terms, closing, sources, and
 * a study-only note at the top.
 */
export const GuidesView: React.FC = () => {
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
        <span className="ms-eyebrow block">Topics</span>
        <h1 className="ms-title">Study Guides</h1>
        <p className="ms-subtitle">
          Short practical guides for the seeker, gathered from the books with their sources named.
          {` ${STUDY_GUIDES.length} guides so far.`}
        </p>
      </div>

      <p className="ms-note-box">
        These guides are for study only. They do not promise any outcome, and they give no religious
        ruling. Read them slowly, and check the sources named at the end of each one.
      </p>

      <nav className="ms-card space-y-2" aria-label="Guides on this page">
        <h2 className="ms-h2">Guides on this page</h2>
        <ul className="space-y-2">
          {STUDY_GUIDES.map((guide) => (
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

      {STUDY_GUIDES.map((guide) => (
        <article key={guide.id} id={guide.id} className="space-y-6 scroll-mt-20">
          <div className="space-y-1.5">
            <span className="ms-eyebrow block">{guide.eyebrow}</span>
            <h2 className="ms-title">{guide.title}</h2>
            <p className="ms-subtitle">{guide.subtitle}</p>
          </div>

          <section className="ms-card space-y-3" aria-label="Introduction">
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
                  <p className="ms-body ms-muted text-sm">Source: {section.quote.source}</p>
                </blockquote>
              ) : null}
            </section>
          ))}

          {guide.terms.length > 0 ? (
            <section className="ms-card space-y-3" aria-label="Words used here">
              <h3 className="ms-h2">Words used here</h3>
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

          <section className="ms-card space-y-3" aria-label="Closing">
            <p className="ms-body">{guide.closing}</p>
          </section>

          <section className="ms-card space-y-3" aria-label="Sources">
            <h3 className="ms-h2">Sources</h3>
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
