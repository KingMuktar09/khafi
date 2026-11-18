import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { FilledToolPage } from './FilledToolPage';

const CHAPTERS = [
  'Front matter',
  ...Array.from({ length: 20 }, (_, i) => `Chapter ${i + 1}`),
  'Back matter',
];

/**
 * Filled in Stage 3A from the Al Asrar notebook. The chapter filter
 * is kept from the shell; the entries here are general notes about
 * the Book, not chapter text, so the filter does not narrow them.
 */
export const KitabView: React.FC = () => {
  const [chapter, setChapter] = useState('All chapters');

  return (
    <FilledToolPage
      content={AL_ASRAR_TOOLS['kitab']}
      title="Kitab (The Book)"
      eyebrow="The Book"
      subtitle="What the books say about the Book, from the books themselves."
    >
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
        {chapter !== 'All chapters' ? (
          <p className="ms-note-box">
            These entries are general notes about the Book, not chapter text, so the chapter filter does not narrow them.
          </p>
        ) : null}
      </div>
    </FilledToolPage>
  );
};
