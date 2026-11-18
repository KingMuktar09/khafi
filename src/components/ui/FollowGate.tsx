import React, { useEffect, useState } from 'react';
import { Check, Instagram, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { router } from '../../router/router';
import { siteConfig } from '../../config/siteConfig';
import { api, GateStatus, isGateKeySet } from '../../services/api';

interface FollowGateProps {
  onUnlock: () => void;
  bookCount: number;
  categoryCount: number;
  /** True while the catalog is still loading: counts shown are the known totals, not live data. */
  loading?: boolean;
}

export const INSTAGRAM_URL = 'https://instagram.com/ghayb.chronicles';
export const INSTAGRAM_HANDLE = '@ghayb.chronicles';

/**
 * Instagram follow gate for Ilm-e-Ghayb Library.
 *
 * Honest limit: a free site cannot verify an Instagram follow. There is no
 * Instagram login, no Meta Graph API and no paid check here. The gate is a
 * follow prompt plus an honour unlock: the visitor follows @ghayb.chronicles,
 * taps "I followed", and the library unlocks in this browser (remembered in
 * localStorage). It is not a verified follow check, and the copy says so.
 */
export const FollowGate: React.FC<FollowGateProps> = ({ onUnlock, bookCount, categoryCount, loading = false }) => {
  const [followed, setFollowed] = useState(false);

  // Gate key: shown only when the admin has set one. The key itself is
  // checked server-side; the browser never sees it.
  const [gateStatus, setGateStatus] = useState<GateStatus | null>(null);
  const [gateKey, setGateKey] = useState('');
  const [gateError, setGateError] = useState('');
  const [checkingKey, setCheckingKey] = useState(false);

  useEffect(() => {
    api.getGateStatus()
      .then((status) => setGateStatus(status))
      .catch(() => setGateStatus(null));
  }, []);

  const handleKeyUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateKey.trim() || checkingKey) return;
    setCheckingKey(true);
    setGateError('');
    const res = await api.unlockGate(gateKey);
    setCheckingKey(false);
    if (res.ok) {
      onUnlock();
    } else {
      setGateError(res.error || 'Wrong key. Try again.');
      setGateKey('');
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex items-center justify-center px-4 py-10 animate-fade-in">
      <div aria-hidden="true" className="halftone halftone-top" />
      <div className="w-full max-w-lg relative">
        {/* Brand */}
        <div className="text-center space-y-3 mb-6">
          {/* Official logo, whole and centred in its square frame */}
          <img
            src={siteConfig.logo}
            alt="Ilm-e-Ghayb Library logo — halftone gold arch doorway with a geometric star"
            className="motion-breathe mx-auto w-16 h-16 rounded-2xl object-cover border border-[var(--gold)]/40 shadow-lg shadow-black/40"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <p className="gold-shimmer text-[11px] font-bold tracking-[0.3em] uppercase">
            Ghayb Chronicles
          </p>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight leading-tight">
            Ilm-e-Ghayb Library
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
            Books on the Quran, the Prophet's life, Sufi wisdom and Islamic history — with the source named in
            every entry. Everyone is welcome, no account needed.
          </p>
        </div>

        {/* Gate card */}
        <div className="gate-glow bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] flex items-center justify-center shrink-0">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Follow us to enter the library</p>
              <p className="text-xs text-[var(--text-muted)]">
                One follow unlocks every book on this device.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="motion-item p-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl" style={{ '--motion-i': 0 } as React.CSSProperties}>
              <p className="font-bold text-lg text-[var(--gold)]">{categoryCount}</p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Collections</p>
            </div>
            <div className="motion-item p-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl" style={{ '--motion-i': 1 } as React.CSSProperties}>
              <p className="font-bold text-lg text-[var(--gold)]">{bookCount}</p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Books</p>
            </div>
            <div className="motion-item p-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl" style={{ '--motion-i': 2 } as React.CSSProperties}>
              <p className="font-bold text-lg text-[var(--gold)]">Free</p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">After follow</p>
            </div>
          </div>

          {loading && (
            <p className="text-[11px] text-[var(--text-muted)] text-center -mt-2" role="status">
              Loading the library…
            </p>
          )}

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setFollowed(true)}
            className="insta-sheen w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.99] shadow-lg"
            style={{ background: 'linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}
          >
            <Instagram className="w-5 h-5" />
            <span>Follow {INSTAGRAM_HANDLE} on Instagram</span>
          </a>

          <button
            type="button"
            onClick={onUnlock}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {followed ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>I followed — unlock the library</span>
          </button>

          {isGateKeySet(gateStatus) && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-[var(--border-main)]" aria-hidden="true" />
                <span className="text-[11px] text-[var(--text-muted)]">or unlock with a key</span>
                <span className="flex-1 h-px bg-[var(--border-main)]" aria-hidden="true" />
              </div>
              <form onSubmit={handleKeyUnlock} className="flex gap-2">
                <input
                  type="password"
                  value={gateKey}
                  onChange={(e) => setGateKey(e.target.value)}
                  autoComplete="off"
                  placeholder="Have a key? Enter it here"
                  aria-label="Gate key"
                  className="flex-1 min-w-0 px-3 py-2.5 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-xl focus:outline-none focus:border-[var(--gold)] text-sm"
                />
                <button
                  type="submit"
                  disabled={checkingKey || !gateKey.trim()}
                  className="shrink-0 px-4 py-2.5 rounded-xl font-bold text-sm bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-60 text-black cursor-pointer transition-all"
                >
                  {checkingKey ? 'Checking…' : 'Unlock'}
                </button>
              </form>
              {gateError && (
                <p className="text-xs text-red-400 text-center" role="alert">{gateError}</p>
              )}
            </div>
          )}

          {gateStatus?.channelUrl && (
            <a
              href={gateStatus.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] underline underline-offset-2 cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Join the broadcast channel to get the key</span>
            </a>
          )}

          <p className="text-[11px] text-[var(--text-faint)] leading-relaxed text-center flex items-start justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-px text-[var(--gold)]" />
            <span>
              This is a free library, so unlocking works on trust — it does not
              check your Instagram account. Follow first, then tap unlock.
            </span>
          </p>
        </div>

        {/* Footnote */}
        <div className="mt-5 text-center space-y-2">
          <p className="text-[11px] text-[var(--text-faint)] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Islamic history and wisdom • Sufism and hidden knowledge, through art</span>
          </p>
          <button
            type="button"
            onClick={() => router.navigate('admin')}
            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--gold)] underline underline-offset-2 cursor-pointer"
          >
            Library admin? Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};
