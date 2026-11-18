import React from 'react';
import { router } from '../../router/router';
import { appState } from '../../state/appState';
import { tTools } from '../../data/i18n-tools';

/**
 * The visible note shown at the top of every tools page.
 * Plain words, no promises, no rulings.
 */
export const ToolDisclaimer: React.FC = () => {
  const lang = appState.settings.language;
  return (
    <p className="ms-note-box">
      {tTools('tools.disclaimer.text', lang)}{' '}
      <button
        type="button"
        onClick={() => router.navigate('tools-method')}
        className="underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded"
      >
        {tTools('tools.disclaimer.link', lang)}
      </button>
    </p>
  );
};
