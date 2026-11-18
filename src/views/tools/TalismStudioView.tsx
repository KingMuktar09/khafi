import React, { useState } from 'react';
import { ToolsLayout } from './ToolsLayout';
import { ShellEmptyState } from './ShellEmptyState';

/**
 * Tier B shell only. Talism Studio will hold composed-seal entries,
 * when material is supplied with a source, page, and permission note.
 * This page builds no seal composer and shows no seals.
 */
export const TalismStudioView: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <ToolsLayout
      title="Talism Studio"
      eyebrow="Seals"
      subtitle="Composed-seal entries, listed and searchable — when supplied."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section will hold</h2>
        <p className="ms-body">
          Talism Studio is a list of composed seals. When material is supplied, each entry will
          appear here with its source and page named, so a reader can look it up and check it.
        </p>
        <p className="ms-body">
          This page is a list only. It does not build seals, and no seal entries have been added yet.
        </p>
      </section>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="talism-studio-search">
          Search seals
        </label>
        <input
          id="talism-studio-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or page"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <section className="ms-card" aria-label="Seal entries">
        <ShellEmptyState />
      </section>
    </ToolsLayout>
  );
};
