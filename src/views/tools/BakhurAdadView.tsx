import React, { useState } from 'react';
import { ToolsLayout } from './ToolsLayout';
import { ShellEmptyState } from './ShellEmptyState';

/**
 * Tier B shell only. Bakhur and Adad will hold catalogue entries
 * only — each substance named, paged, and counted — when material
 * is supplied with a source, page, and permission note. Never
 * quantities, preparation, or recipes.
 */
export const BakhurAdadView: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <ToolsLayout
      title="Bakhur and Adad"
      eyebrow="Bakhur and Adad"
      subtitle="A catalogue of named substances — nothing more."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section will hold</h2>
        <p className="ms-body">
          Bakhur and Adad is a catalogue. When material is supplied, each entry will name a
          substance and give its source and page, so a reader can count the entries and look
          each one up.
        </p>
        <p className="ms-body">
          That is all it will hold: names, pages, and counts. It will never show quantities,
          preparation, or recipes.
        </p>
      </section>

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

      <section className="ms-card" aria-label="Catalogue entries">
        <ShellEmptyState />
      </section>
    </ToolsLayout>
  );
};
