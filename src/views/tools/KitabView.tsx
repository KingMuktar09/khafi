import React, { useState } from 'react';
import { ToolsLayout } from './ToolsLayout';
import { ShellEmptyState } from './ShellEmptyState';

const CHAPTERS = [
  'Front matter',
  ...Array.from({ length: 20 }, (_, i) => `Chapter ${i + 1}`),
  'Back matter',
];

/**
 * Tier B shell only. Kitab will hold the 20 chapters plus front and
 * back matter, when material is supplied with a source, page, and
 * permission note. No chapter text is shown here.
 */
export const KitabView: React.FC = () => {
  const [chapter, setChapter] = useState('All chapters');

  return (
    <ToolsLayout
      title="Kitab (The Book)"
      eyebrow="The Book"
      subtitle="The book, chapter by chapter — front matter, 20 chapters, and back matter, when supplied."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">What this section will hold</h2>
        <p className="ms-body">
          Kitab is the book itself, laid out so a reader can find a chapter and read it in order.
          When material is supplied, each chapter will appear here with its source and page named.
        </p>
        <p className="ms-body">
          Until then this page is only a template: a chapter filter and a place where chapters
          will be listed. Nothing has been filled in yet.
        </p>
      </section>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="kitab-chapter">
          Chapter
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by chapter">
          {['All chapters', ...CHAPTERS].map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={chapter === option}
              onClick={() => setChapter(option)}
              className="ms-toggle ms-toggle-chip"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <section className="ms-card" aria-label="Chapters">
        <ShellEmptyState
          message={
            chapter === 'All chapters'
              ? 'Nothing here yet — chapters are added only from material supplied with a source, page, and permission note.'
              : `Nothing in ${chapter} yet — chapters are added only from material supplied with a source, page, and permission note.`
          }
        />
      </section>
    </ToolsLayout>
  );
};
