import React, { useState } from 'react';
import { ToolsLayout } from './ToolsLayout';
import { ShellEmptyState } from './ShellEmptyState';

/**
 * Tier B shell only. Haqa'iq will hold records, when material is
 * supplied with a source, page, and permission note. No records
 * are shown here.
 */
export const HaqaiqView: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <ToolsLayout
      title="Haqa'iq (Realities)"
      eyebrow="Realities"
      subtitle="Records, listed and searchable — when supplied."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section will hold</h2>
        <p className="ms-body">
          Haqa'iq is a set of records. When material is supplied, each record will appear here
          with its source and page named, so a reader can look it up and check it.
        </p>
        <p className="ms-body">
          Until then this page is only a template: a search box and a place where records will
          be listed. No records have been added yet.
        </p>
      </section>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="haqaiq-search">
          Search records
        </label>
        <input
          id="haqaiq-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or page"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <section className="ms-card" aria-label="Records">
        <ShellEmptyState />
      </section>
    </ToolsLayout>
  );
};
