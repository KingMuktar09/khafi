import React from 'react';
import { BookOpen, Instagram, ShieldCheck } from 'lucide-react';
import { router } from '../../router/router';
import { appState } from '../../state/appState';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[var(--border-main)] bg-[var(--bg-surface)] py-8 px-4 sm:px-8 text-xs font-mono text-[var(--text-muted)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.navigate('home')}
            className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors focus:outline-none"
          >
            <BookOpen className="w-4 h-4 text-[var(--gold)]" />
            <span className="font-serif font-bold text-sm tracking-wide text-[var(--text-main)]">
              Ilm-e-Ghayb Library
            </span>
          </button>
          <span className="text-[var(--text-faint)]">//</span>
          <span className="text-[11px] text-[var(--text-faint)]">by Ghayb Chronicles</span>
          <a
            href="https://instagram.com/ghayb.chronicles"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-[var(--gold)] transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>@ghayb.chronicles</span>
          </a>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[11px]">
          <button
            onClick={() => router.navigate('home')}
            className="hover:text-[var(--gold)] transition-colors uppercase"
          >
            Home
          </button>
          <button
            onClick={() => router.navigate('library')}
            className="hover:text-[var(--gold)] transition-colors uppercase"
          >
            Library
          </button>
          <button
            onClick={() => router.navigate('favorites')}
            className="hover:text-[var(--gold)] transition-colors uppercase"
          >
            Favorites
          </button>
          <button
            onClick={() => router.navigate('info')}
            className="hover:text-[var(--gold)] transition-colors uppercase"
          >
            Info
          </button>
          <button
            onClick={() => router.navigate('admin')}
            className="hover:text-[var(--gold)] transition-colors uppercase flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-[var(--gold)]" />
            <span>Admin</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-[var(--text-faint)]">
          Preserving classical knowledge &bull; Private Digital Library
        </div>

      </div>
    </footer>
  );
};
