import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { appState } from '../../state/appState';
import { tTools, tfTools } from '../../data/i18n-tools';
import { FilledToolPage } from './FilledToolPage';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Filled in Stage 3B from the Al Asrar notebook. Term entries are
 * listed below with their source named; the search box and the A to Z
 * chips filter them.
 */
export const GlossaryView: React.FC = () => {
  const lang = appState.settings.language;
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState('All');
  const q = query.trim().toLowerCase();
  const filter =
    q || letter !== 'All'
      ? (entry: { title: string; body: string; source: string; arabic?: string; transliteration?: string; meaning?: string }) => {
          const matchesQuery =
            !q ||
            [entry.title, entry.body, entry.source, entry.arabic ?? '', entry.transliteration ?? '', entry.meaning ?? '']
              .some((field) => field.toLowerCase().includes(q));
          const matchesLetter = letter === 'All' || entry.title.toUpperCase().startsWith(letter);
          return matchesQuery && matchesLetter;
        }
      : undefined;

  return (
    <FilledToolPage
      content={AL_ASRAR_TOOLS['glossary']}
      title={tTools('tools.glossary.title', lang)}
      eyebrow={tTools('tools.glossary.eyebrow', lang)}
      subtitle={tTools('tools.glossary.subtitle', lang)}
      toolId="glossary"
      filter={filter}
    >
      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="glossary-search">
          {tTools('tools.glossary.searchLabel', lang)}
        </label>
        <input
          id="glossary-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tTools('tools.glossary.searchPlaceholder', lang)}
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <div className="space-y-1.5">
        <span className="ms-label" id="glossary-letter-label">
          {tTools('tools.glossary.filterLabel', lang)}
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
              {option === 'All' ? tTools('tools.common.all', lang) : option}
            </button>
          ))}
        </div>
        {letter !== 'All' ? (
          <p className="ms-note-box">
            {tfTools('tools.glossary.showingLetter', lang, { letter })}
          </p>
        ) : null}
      </div>
    </FilledToolPage>
  );
};
