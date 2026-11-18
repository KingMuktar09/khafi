import React from 'react';
import { Instagram, Wrench, LogIn } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { router } from '../../router/router';

interface MaintenancePageProps {
  message?: string;
}

/**
 * What visitors see while maintenance mode is ON (admin toggle in the
 * admin panel). No books, no library — just the logo, the admin's message
 * and the Instagram link. The admin can still sign in from here.
 */
export const MaintenancePage: React.FC<MaintenancePageProps> = ({ message }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="hero-glow relative overflow-hidden ms-panel rounded-2xl p-8 sm:p-10 shadow-2xl max-w-lg w-full text-center space-y-5 animate-fade-in">
        <div aria-hidden="true" className="halftone halftone-corner" />
        <img
          src={siteConfig.logo}
          alt="Ilm-e-Ghayb Library logo"
          className="w-20 h-20 mx-auto rounded-2xl object-cover border border-[var(--gold)]/40 shadow-md shadow-black/40"
        />
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-full px-3 py-1">
            <Wrench className="w-3.5 h-3.5" />
            <span>Under maintenance</span>
          </p>
          <h1 className="font-display font-semibold text-2xl text-[var(--text-main)]">
            Ilm-e-Ghayb Library
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {message && message.trim()
              ? message.trim()
              : 'We are adding new books and making the library better. Back soon.'}
          </p>
        </div>
        <a
          href="https://instagram.com/ghayb.chronicles"
          target="_blank"
          rel="noreferrer"
          className="tap-target w-full py-3 px-4 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
        >
          <Instagram className="w-4 h-4" />
          <span>Follow @ghayb.chronicles for updates</span>
        </a>
        <button
          type="button"
          onClick={() => router.navigate('admin')}
          className="tap-target w-full py-2.5 px-4 rounded-xl font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <LogIn className="w-4 h-4" />
          <span>Admin sign in</span>
        </button>
      </div>
    </div>
  );
};
