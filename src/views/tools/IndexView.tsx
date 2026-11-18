import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { appState } from '../../state/appState';
import { tTools } from '../../data/i18n-tools';
import { FilledToolPage } from './FilledToolPage';

/**
 * Filled in Stage 3A from the Al Asrar notebook. Entries are listed
 * below with their source named; the search box filters them.
 */
export const IndexView: React.FC = () => {
  const lang = appState.settings.language;
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filter = q
    ? (entry: { title: string; body: string; source: string; arabic?: string; transliteration?: string; meaning?: string }) =>
        [entry.title, entry.body, entry.source, entry.arabic ?? '', entry.transliteration ?? '', entry.meaning ?? '']
          .some((field) => field.toLowerCase().includes(q))
    : undefined;

  return (
    <FilledToolPage
      content={AL_ASRAR_TOOLS['index']}
      title={tTools('tools.index.title', lang)}
      eyebrow={tTools('tools.index.eyebrow', lang)}
      subtitle={tTools('tools.index.subtitle', lang)}
      toolId="index"
      filter={filter}
    >
      <div className="space-y-1.5" aria-label={tTools('tools.shell.aria.indexResults', lang)}>
        <label className="ms-label" htmlFor="index-search">
          {tTools('tools.index.searchLabel', lang)}
        </label>
        <input
          id="index-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tTools('tools.index.searchPlaceholder', lang)}
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>
    </FilledToolPage>
  );
};
