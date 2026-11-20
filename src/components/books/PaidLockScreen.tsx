import React, { useState } from 'react';
import { Instagram, Lock, KeyRound, Check } from 'lucide-react';
import { Book } from '../../types';
import { api, DEFAULT_BROADCAST_CHANNEL_URL } from '../../services/api';
import { storage } from '../../services/storage';
import { t, tf } from '../../data/i18n';
import { formatBookPrice } from '../../utils/fileUtils';

interface PaidLockScreenProps {
  book: Book;
  /** Optional back action (e.g. the reader view goes back to the book page). */
  onBack?: () => void;
  backLabel?: string;
  /** Called after a key unlocks this book, so the parent can reload the
   *  catalog and show the book's links. */
  onUnlocked?: () => void;
}

/**
 * Locked screen for a paid book, shown to locked visitors instead of any
 * reader, download or "Open in Drive" link.
 *
 * How a paid book unlocks — with its own key, even for followers:
 *   1. Followers get the key from the broadcast channel (link below).
 *   2. Or enter this book's own key here. The server checks it (hash
 *      only, never the plain key) and, if it matches and still has uses
 *      left, the book unlocks on this device only.
 * One key unlocks ONE paid book only — it never opens a different paid
 * book, and it stops working after its use limit (default 100 uses).
 * Free books need no key at all.
 */
export const PaidLockScreen: React.FC<PaidLockScreenProps> = ({ book, onBack, backLabel, onUnlocked }) => {
  // Language read from storage at render time (not via appState):
  // appState pulls in the browser-only router, and this screen is
  // rendered in node tests. updateSettings always persists + notifies,
  // and the app re-renders the whole tree, so this stays fresh.
  const lang = storage.getSettings().language;
  // The price is public info (it survives catalog sanitisation — only
  // links are stripped for locked visitors), so the lock screen shows it
  // when the book has one. No price set means no price shown at all.
  const priceLabel = formatBookPrice(book);
  const [keyInput, setKeyInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const handleVerify = async () => {
    const key = keyInput.trim();
    if (!key) {
      setError(t('paid.enterKeyError', lang));
      return;
    }
    setChecking(true);
    setError('');
    const res = await api.verifyBookKey(book.id, key);
    setChecking(false);
    if (!res.ok) {
      setError(res.error || t('paid.wrongKey', lang));
      return;
    }
    storage.saveBookKey(book.id, key);
    setUnlocked(true);
    try {
      await api.reloadCatalog();
    } catch {}
    if (onUnlocked) onUnlocked();
  };

  if (unlocked) {
    return (
      <div className="space-y-3">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-full px-3 py-1 w-fit">
          <Check className="w-3.5 h-3.5" />
          <span>{t('paid.unlockedBadge', lang)}</span>
        </p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('paid.unlockedText', lang)}
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="tap-target w-full py-3 px-4 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            {t('paid.backDefault', lang)}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-full px-3 py-1 w-fit">
          <Lock className="w-3.5 h-3.5" />
          <span>{t('paid.lockBadge', lang)}</span>
        </p>
        {priceLabel && (
          <p className="text-sm font-bold text-[var(--gold)]">
            {tf('paid.priceLine', lang, { price: priceLabel })}
          </p>
        )}
        {book.paymentNote && (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">{book.paymentNote}</p>
        )}
        <p className="font-display font-semibold text-lg text-[var(--text-main)]">
          {t('paid.freeTitle', lang)}
        </p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('paid.freeText', lang)}
        </p>
      </div>

      {/* Enter the key. */}
      <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-4 space-y-3">
        <p className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-[var(--gold)]" />
          <span>{t('paid.keyTitle', lang)}</span>
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={keyInput}
            onChange={(e) => {
              setKeyInput(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleVerify();
            }}
            placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] font-mono"
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={checking}
            className="tap-target shrink-0 px-4 py-2.5 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black transition-all cursor-pointer text-sm disabled:opacity-50"
          >
            {checking ? t('paid.checking', lang) : t('paid.unlock', lang)}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        )}
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
          {t('paid.keyNote', lang)}
        </p>
      </div>

      <a
        href={DEFAULT_BROADCAST_CHANNEL_URL}
        target="_blank"
        rel="noreferrer"
        className="tap-target w-full py-3 px-4 rounded-xl font-bold bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
      >
        <Instagram className="w-4 h-4" />
        <span>{t('paid.messageForKey', lang)}</span>
      </a>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="tap-target w-full py-2.5 px-4 rounded-xl font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] transition-colors cursor-pointer text-sm"
        >
          {backLabel || t('paid.backDefault', lang)}
        </button>
      )}
    </div>
  );
};
