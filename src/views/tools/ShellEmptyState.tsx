import React from 'react';
import { appState } from '../../state/appState';
import { tTools } from '../../data/i18n-tools';

/**
 * Shared empty state for Tier B shell pages. Shells hold no content:
 * entries are added only from material supplied with a source, page,
 * and permission note. The message can be varied per page, but the
 * default wording stays honest about why the page is empty.
 */
export const ShellEmptyState: React.FC<{ message?: string }> = ({ message }) => {
  const lang = appState.settings.language;
  const text = message ?? tTools('tools.shell.emptyMessage', lang);
  return (
    <div className="py-10 px-4 text-center space-y-2" role="status">
      <p className="ms-h2">{tTools('tools.shell.emptyTitle', lang)}</p>
      <p className="ms-body">{text}</p>
    </div>
  );
};
