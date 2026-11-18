import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { FilledToolPage } from './FilledToolPage';

/**
 * Filled in Stage 3B from the Al Asrar notebook. Catalogue entries
 * only: each substance named, paged, and counted. Never quantities,
 * preparation, or recipes. The search box filters the entries.
 */
export const BakhurAdadView: React.FC = () => {
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
      title="Bakhur and Adad"
      eyebrow="Bakhur and Adad"
      subtitle="A catalogue of named substances and the number work, nothing more."
      filter={filter}
    >
      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="bakhur-adad-search">
          Search the catalogue
        </label>
        <input
          id="bakhur-adad-search"
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
