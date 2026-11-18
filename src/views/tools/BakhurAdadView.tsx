import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { appState } from '../../state/appState';
import { tTools } from '../../data/i18n-tools';
import { FilledToolPage } from './FilledToolPage';

/**
 * Filled in Stage 3B from the Al Asrar notebook. Catalogue entries
 * only: each substance named, paged, and counted. Never quantities,
 * preparation, or recipes. The search box filters the entries.
 */
export const BakhurAdadView: React.FC = () => {
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
      content={AL_ASRAR_TOOLS['bakhur-adad']}
      title={tTools('tools.bakhur.title', lang)}
      eyebrow={tTools('tools.bakhur.eyebrow', lang)}
      subtitle={tTools('tools.bakhur.subtitle', lang)}
      toolId="bakhur-adad"
      filter={filter}
    >
      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="bakhur-adad-search">
          {tTools('tools.bakhur.searchLabel', lang)}
        </label>
        <input
          id="bakhur-adad-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tTools('tools.bakhur.searchPlaceholder', lang)}
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>
    </FilledToolPage>
  );
};
