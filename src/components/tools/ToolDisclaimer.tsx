import React from 'react';
import { router } from '../../router/router';

/**
 * The visible note shown at the top of every tools page.
 * Plain words, no promises, no rulings.
 */
export const ToolDisclaimer: React.FC = () => {
  return (
    <p className="ms-note-box">
      These tools are for study and calculation only. They do not promise any outcome, protection, healing or
      provision. Never use them to harm anyone.{' '}
      <button
        type="button"
        onClick={() => router.navigate('tools-method')}
        className="underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded"
      >
        How these tools work
      </button>
    </p>
  );
};
