import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { FilledToolPage } from './FilledToolPage';

/**
 * Filled in Stage 3B from the Al Asrar notebook. Entries are listed
 * below with their source named; the search box filters them.
 */
export const ShurutView: React.FC = () => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filter = q
    ? (entry: { title: string; body: string; source: string; arabic?: string; transliteration?: string; meaning?: string }) =>
        [entry.title, entry.body, entry.source, entry.arabic ?? '', entry.transliteration ?? '', entry.meaning ?? '']
          .some((field) => field.toLowerCase().includes(q))
    : undefined;

  return (
    <FilledToolPage
      content={AL_ASRAR_TOOLS['shurut']}
      title="Shurut (Conditions)"
      eyebrow="Conditions"
      subtitle="The conditions the books name, each with its source and page."
      filter={filter}
    >
      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="shurut-search">
          Search entries
        </label>
        <input
          id="shurut-search"
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
