import React from 'react';
import { router } from '../../router/router';

/**
 * The visible note shown at the top of every tools page.
 * Plain words, no promises, no rulings.
 */
export const ToolDisclaimer: React.FC = () => {
  return (
    <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl px-4 py-3">
      These tools are for study and calculation only. They do not promise any outcome, protection, healing or
      provision. Never use them to harm anyone.{' '}
      <button
        type="button"
        onClick={() => router.navigate('tools-method')}
        className="underline underline-offset-2 text-[var(--gold)] hover:text-[var(--gold-light)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded"
      >
        How these tools work
      </button>
    </p>
  );
};
