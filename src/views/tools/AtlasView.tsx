import React, { useState } from 'react';
import { ToolsLayout } from './ToolsLayout';
import { ShellEmptyState } from './ShellEmptyState';

/**
 * Tier B shell only. Atlas stays a shell: it may become a built tool
 * later, only after the square validator passes and the figure
 * designs are approved. No entries are shown here.
 */
export const AtlasView: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <ToolsLayout
      title="Atlas"
      eyebrow="Atlas"
      subtitle="A map of squares and figures — when supplied."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section will hold</h2>
        <p className="ms-body">
          Atlas will be a map of the squares and figures in this section — a way to see how they
          fit together. When material is supplied, its entries will appear here with their
          source and page named.
        </p>
        <p className="ms-body">
          Until then this page is only a template: a search box and a place where entries will
          be listed. No entries have been added yet.
        </p>
      </section>

      <p className="ms-note-box">
        This stays a shell for now. It may become a built tool later, only after the square
        validator passes and the figure designs are approved.
      </p>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="atlas-search">
          Search the atlas
        </label>
        <input
          id="atlas-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or page"
          className="ms-field w-full min-h-11 px-3.5 text-base"
        />
      </div>

      <section className="ms-card" aria-label="Atlas entries">
        <ShellEmptyState />
      </section>
    </ToolsLayout>
  );
};
