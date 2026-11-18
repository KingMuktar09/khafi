import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { FilledToolPage } from './FilledToolPage';

/**
 * Filled in Stage 3B from the Al Asrar notebook. Entries are listed
 * below with their source named; the search box filters them.
 */
export const WorksView: React.FC = () => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filter = q
    ? (entry: { title: string; body: string; source: string; arabic?: string; transliteration?: string; meaning?: string }) =>
        [entry.title, entry.body, entry.source, entry.arabic ?? '', entry.transliteration ?? '', entry.meaning ?? '']
          .some((field) => field.toLowerCase().includes(q))
    : undefined;

  return (
    <FilledToolPage
      content={AL_ASRAR_TOOLS['works']}
      title="Works"
      eyebrow="Works"
      subtitle="What the books say a work is, and what it needs."
      filter={filter}
    >
      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="works-search">
          Search entries
        </label>
        <input
          id="works-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or page"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>
    </FilledToolPage>
  );
};
