import React from 'react';
import { Instagram, Lock } from 'lucide-react';
import { Book } from '../../types';

interface PaidLockScreenProps {
  book: Book;
  /** Optional back action (e.g. the reader view goes back to the book page). */
  onBack?: () => void;
  backLabel?: string;
}

/**
 * Locked screen for a paid book, shown to locked (not gate-unlocked)
 * visitors instead of any reader, download or "Open in Drive" link.
 *
 * Paid books are FREE for followers: there is no payment anywhere. A
 * visitor follows @ghayb.chronicles, taps "I followed" on the library
 * gate (or enters the gate key), and the book opens free. Admins and
 * gate-unlocked followers never see this screen.
 */
export const PaidLockScreen: React.FC<PaidLockScreenProps> = ({ onBack, backLabel }) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-full px-3 py-1 w-fit">
          <Lock className="w-3.5 h-3.5" />
          <span>Paid book — followers only</span>
        </p>
        <p className="font-display font-semibold text-lg text-[var(--text-main)]">
          This book is free for followers
        </p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          No payment needed. Follow{' '}
          <a href="https://instagram.com/ghayb.chronicles" target="_blank" rel="noreferrer" className="text-[var(--gold)] font-semibold underline underline-offset-2">
            @ghayb.chronicles on Instagram
          </a>{' '}
          and tap “I followed” on the library gate to unlock it — then this book opens free.
        </p>
      </div>

      <a
        href="https://instagram.com/ghayb.chronicles"
        target="_blank"
        rel="noreferrer"
        className="tap-target w-full py-3 px-4 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Instagram className="w-4 h-4" />
        <span>Follow @ghayb.chronicles</span>
      </a>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="tap-target w-full py-2.5 px-4 rounded-xl font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] transition-colors cursor-pointer text-sm"
        >
          {backLabel || 'Back to book details'}
        </button>
      )}
    </div>
  );
};
