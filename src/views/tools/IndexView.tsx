import React, { useState } from 'react';
import { ToolsLayout } from './ToolsLayout';
import { ShellEmptyState } from './ShellEmptyState';

/**
 * Tier B shell only. Index will hold searchable index entries, when
 * material is supplied with a source, page, and permission note.
 * No index entries are shown here.
 */
export const IndexView: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <ToolsLayout
      title="Index"
      eyebrow="Index"
      subtitle="Searchable index entries — when supplied."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section will hold</h2>
        <p className="ms-body">
          The Index is a way to find things by name or topic. When material is supplied, each
          index entry will appear here with its source and page named, so a reader can go
          straight to the page it points to.
        </p>
        <p className="ms-body">
          Until then this page is only a template: a search box and a results area. No index
          entries have been added yet.
        </p>
      </section>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="index-search">
          Search the index
        </label>
        <input
          id="index-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or topic"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <section className="ms-card" aria-label="Index results">
        <ShellEmptyState />
      </section>
    </ToolsLayout>
  );
};
