import React from 'react';
import { Instagram, ShieldCheck } from 'lucide-react';
import { router } from '../../router/router';
import { appState } from '../../state/appState';
import { siteConfig } from '../../config/siteConfig';
import { t } from '../../data/i18n';

export const Footer: React.FC = () => {
  const lang = appState.settings.language;
  return (
    <footer className="animate-fade-in mt-auto border-t border-[var(--border-main)] bg-[var(--bg-header)] py-8 px-4 sm:px-8 text-xs font-mono text-[var(--text-muted)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.navigate('home')}
            className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors focus:outline-none"
          >
            <img
              src={siteConfig.logo}
              alt={t('home.logoAlt', lang)}
              className="w-6 h-6 rounded-md object-cover border border-[var(--gold)]/30 shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="font-display font-bold text-sm tracking-wide text-[var(--text-main)]">
              Ilm-e-Ghayb Library
            </span>
          </button>
          <span className="text-[var(--text-faint)]">//</span>
          <span className="text-[11px] text-[var(--text-faint)]">{t('nav.byGhayb', lang)}</span>
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
            {t('nav.home', lang)}
          </button>
          <button
            onClick={() => router.navigate('library')}
            className="hover:text-[var(--gold)] transition-colors uppercase"
          >
            {t('nav.library', lang)}
          </button>
          <button
            onClick={() => router.navigate('favorites')}
            className="hover:text-[var(--gold)] transition-colors uppercase"
          >
            {t('nav.favorites', lang)}
          </button>
          <button
            onClick={() => router.navigate('info')}
            className="hover:text-[var(--gold)] transition-colors uppercase"
          >
            {t('nav.info', lang)}
          </button>
          <button
            onClick={() => router.navigate('admin')}
            className="hover:text-[var(--gold)] transition-colors uppercase flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-[var(--gold)]" />
            <span>{t('nav.admin', lang)}</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-[var(--text-faint)] text-center sm:text-right space-y-1">
          <p>{t('footer.freeLine', lang)}</p>
          <p>{t('footer.disclaimer', lang)}</p>
        </div>

      </div>
    </footer>
  );
};
