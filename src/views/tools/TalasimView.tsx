import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { TalismanFiguresSection } from '../../components/special/TalismanFigures';
import { appState } from '../../state/appState';
import { tTools } from '../../data/i18n-tools';
import { FilledToolPage } from './FilledToolPage';

/**
 * Filled in Stage 3A from the Al Asrar notebook. Entries are listed
 * below with their source named; the search box filters them.
 */
export const TalasimView: React.FC = () => {
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
      content={AL_ASRAR_TOOLS['talasim']}
      title={tTools('tools.talasim.title', lang)}
      eyebrow={tTools('tools.talasim.eyebrow', lang)}
      subtitle={tTools('tools.talasim.subtitle', lang)}
      toolId="talasim"
      filter={filter}
    >
      <div className="space-y-1.5" aria-label={tTools('tools.shell.aria.figureEntries', lang)}>
        <label className="ms-label" htmlFor="talasim-search">
          {tTools('tools.talasim.searchLabel', lang)}
        </label>
        <input
          id="talasim-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tTools('tools.talasim.searchPlaceholder', lang)}
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>
      <TalismanFiguresSection />
    </FilledToolPage>
  );
};
