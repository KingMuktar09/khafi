import React, { useState } from 'react';
import { BookOpen, Check, Instagram, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { router } from '../../router/router';

interface FollowGateProps {
  onUnlock: () => void;
  bookCount: number;
  categoryCount: number;
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
export const FollowGate: React.FC<FollowGateProps> = ({ onUnlock, bookCount, categoryCount }) => {
  const [followed, setFollowed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex items-center justify-center px-4 py-10 animate-fade-in">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--gold-faint)] border border-[var(--gold)]/40 flex items-center justify-center shadow-lg shadow-black/40">
            <BookOpen className="w-8 h-8 text-[var(--gold)]" />
          </div>
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[var(--gold)]">
            Ghayb Chronicles
          </p>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight leading-tight">
            Ilm-e-Ghayb Library
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md mx-auto">
            Hidden knowledge, Sufi wisdom, and the books behind it. Quran, Tafseer,
            Hadith, Seerah and history, with sources in every entry.
          </p>
        </div>

        {/* Gate card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
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
            <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
              <p className="font-bold text-lg text-[var(--gold)]">{categoryCount}</p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Collections</p>
            </div>
            <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
              <p className="font-bold text-lg text-[var(--gold)]">{bookCount}</p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Books</p>
            </div>
            <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
              <p className="font-bold text-lg text-[var(--gold)]">Free</p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">After follow</p>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setFollowed(true)}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.99] shadow-lg"
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
            <span>Islamic esoteric knowledge • Mysticism &amp; Sufi wisdom through art</span>
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
