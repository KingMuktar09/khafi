import React, { useState } from 'react';
import { AL_ASRAR_TOOLS } from '../../data/alAsrarContent';
import { appState } from '../../state/appState';
import { tTools, tfTools } from '../../data/i18n-tools';
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
  const lang = appState.settings.language;
  const [chapter, setChapter] = useState('All chapters');

  const chapterLabel = (option: string): string => {
    if (option === 'All chapters') return tTools('tools.kitab.allChapters', lang);
    if (option === 'Front matter') return tTools('tools.kitab.frontMatter', lang);
    if (option === 'Back matter') return tTools('tools.kitab.backMatter', lang);
    const n = Number(option.replace('Chapter ', ''));
    return tfTools('tools.kitab.chapterN', lang, { n });
  };

  return (
    <FilledToolPage
      content={AL_ASRAR_TOOLS['kitab']}
      title={tTools('tools.kitab.title', lang)}
      eyebrow={tTools('tools.kitab.eyebrow', lang)}
      subtitle={tTools('tools.kitab.subtitle', lang)}
      toolId="kitab"
    >
      <div className="space-y-1.5">
        <label className="ms-label" htmlFor="kitab-chapter">
          {tTools('tools.kitab.chapterLabel', lang)}
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label={tTools('tools.kitab.filterAria', lang)}>
          {['All chapters', ...CHAPTERS].map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={chapter === option}
              onClick={() => setChapter(option)}
              className="ms-toggle ms-toggle-chip"
            >
              {chapterLabel(option)}
            </button>
          ))}
        </div>
        {chapter !== 'All chapters' ? (
          <p className="ms-note-box">
            {tTools('tools.kitab.filterNote', lang)}
          </p>
        ) : null}
      </div>
    </FilledToolPage>
  );
};
