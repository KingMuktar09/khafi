import React, { useState } from 'react';
import { ToolsLayout } from './ToolsLayout';
import { ShellEmptyState } from './ShellEmptyState';

/**
 * Tier B shell only. al-Sirr al-Jalil will hold a monograph section,
 * when material is supplied with a source, page, and permission note.
 * No monograph text is shown here.
 */
export const SirrJalilView: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <ToolsLayout
      title="al-Sirr al-Jalil"
      eyebrow="Monograph"
      subtitle="A monograph section — when supplied."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section will hold</h2>
        <p className="ms-body">
          al-Sirr al-Jalil is a single monograph — one longer piece of writing, kept in one place.
          When material is supplied, it will appear here with its source and page named.
        </p>
        <p className="ms-body">
          Until then this page is only a template: a search box and a place where the monograph
          will be shown. Nothing has been added yet.
        </p>
      </section>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="sirr-jalil-search">
          Search the monograph
        </label>
        <input
          id="sirr-jalil-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by heading or page"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <section className="ms-card" aria-label="Monograph">
        <ShellEmptyState />
      </section>
    </ToolsLayout>
  );
};
