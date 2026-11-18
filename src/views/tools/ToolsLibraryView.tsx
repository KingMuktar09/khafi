import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { appState } from '../../state/appState';
import { tTools } from '../../data/i18n-tools';
import { FilledToolPage } from './FilledToolPage';

/**
 * Filled in Stage 3A from the Al Asrar notebook. Entries are listed
 * below with their source named; the search box filters them.
 */
export const ToolsLibraryView: React.FC = () => {
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
      content={AL_ASRAR_TOOLS['library']}
      title={tTools('tools.library.title', lang)}
      eyebrow={tTools('tools.library.eyebrow', lang)}
      subtitle={tTools('tools.library.subtitle', lang)}
      toolId="library"
      filter={filter}
    >
      <div className="space-y-1.5" aria-label={tTools('tools.shell.aria.libraryEntries', lang)}>
        <label className="ms-label" htmlFor="tools-library-search">
          {tTools('tools.library.searchLabel', lang)}
        </label>
        <input
          id="tools-library-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tTools('tools.library.searchPlaceholder', lang)}
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>
    </FilledToolPage>
  );
};
