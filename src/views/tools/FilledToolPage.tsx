import React from 'react';
import { ToolsLayout } from './ToolsLayout';
import { appState } from '../../state/appState';
import { localizeAlAsrarIntro, tTools, tfTools } from '../../data/i18n-tools';
import type { AlAsrarEntry, FilledToolContent } from '../../data/alAsrarContent';

interface FilledToolPageProps {
  content: FilledToolContent;
  /** Stable key of the tool in AL_ASRAR_TOOLS, for its localized intro. */
  toolId?: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Optional filter UI (search box, chapter chips) kept from the shell. */
  children?: React.ReactNode;
  /** Optional entry filter, driven by the filter UI above. */
  filter?: (entry: AlAsrarEntry) => boolean;
}

/**
 * Shared page for the 15 filled Tier B tools. Renders inside
 * ToolsLayout: the first-person intro card, then one card per entry
 * with its title, body, Arabic term block when present, and a visible
 * source line. Prose comes from src/data/alAsrarContent.ts unchanged.
 */
export const FilledToolPage: React.FC<FilledToolPageProps> = ({
  content,
  toolId,
  title,
  eyebrow,
  subtitle,
  children,
  filter,
}) => {
  const lang = appState.settings.language;
  const entries = filter ? content.entries.filter(filter) : content.entries;
  const intro = toolId ? localizeAlAsrarIntro(toolId, content.intro, lang) : content.intro;

  return (
    <ToolsLayout title={title} eyebrow={eyebrow} subtitle={subtitle}>
      <section className="ms-card space-y-3" aria-label={tTools('tools.shell.aboutSection', lang)}>
        <p className="ms-body">{intro}</p>
        <p className="ms-body ms-muted">
          {content.entries.length === 1
            ? tTools('tools.shell.entriesOne', lang)
            : tfTools('tools.shell.entriesMany', lang, { n: content.entries.length })}
        </p>
      </section>

      {children}

      <div className="space-y-4">
        {entries.map((entry) => (
          <article key={entry.title} className="ms-card space-y-3">
            <h2 className="ms-h3">{entry.title}</h2>
            <p className="ms-body">{entry.body}</p>
            {entry.arabic ? (
              <div className="space-y-1 pt-1">
                <p className="ms-arabic-sm ms-gold" dir="rtl" lang="ar">
                  {entry.arabic}
                </p>
                {entry.transliteration ? <p className="ms-body italic">{entry.transliteration}</p> : null}
                {entry.meaning ? <p className="ms-body">{entry.meaning}</p> : null}
              </div>
            ) : null}
            <p className="ms-body ms-muted text-sm">{tTools('tools.common.source', lang)}: {entry.source}</p>
          </article>
        ))}
        {entries.length === 0 ? (
          <p className="ms-body text-center py-6" role="status">
            {tTools('tools.shell.noEntriesMatch', lang)}
          </p>
        ) : null}
      </div>
    </ToolsLayout>
  );
};
