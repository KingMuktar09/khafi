import React, { useState } from 'react';
import { ToolsLayout } from './ToolsLayout';
import { ShellEmptyState } from './ShellEmptyState';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Tier B shell only. Glossary will hold term entries, when material
 * is supplied with a source, page, and permission note. No terms
 * are shown here.
 */
export const GlossaryView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState('All');

  return (
    <ToolsLayout
      title="Glossary"
      eyebrow="Glossary"
      subtitle="Term entries, A to Z — when supplied."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section will hold</h2>
        <p className="ms-body">
          The Glossary explains the words used across this section, in plain words. When material
          is supplied, each term will appear here with its source and page named.
        </p>
        <p className="ms-body">
          Until then this page is only a template: a search box, an A to Z filter, and a place
          where term entries will be listed. No terms have been added yet.
        </p>
      </section>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="glossary-search">
          Search terms
        </label>
        <input
          id="glossary-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by term"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <div className="space-y-1.5">
        <span className="ms-label" id="glossary-letter-label">
          Filter by letter
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="glossary-letter-label">
          {['All', ...LETTERS].map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={letter === option}
              onClick={() => setLetter(option)}
              className="ms-toggle ms-toggle-chip"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <section className="ms-card" aria-label="Term entries">
        <ShellEmptyState
          message={
            letter === 'All'
              ? 'Nothing here yet — terms are added only from material supplied with a source, page, and permission note.'
              : `No terms under ${letter} yet — terms are added only from material supplied with a source, page, and permission note.`
          }
        />
      </section>
    </ToolsLayout>
  );
};
