import React from 'react';
import { Check, Languages } from 'lucide-react';
import { appState } from '../../state/appState';
import { SITE_LANGUAGES, t } from '../../data/i18n';

/**
 * The language picker, built to be found at a glance: every language
 * is a big button in its own script (English, Hinglish, বাংলা), and
 * the active one is filled gold. `bar` is the slim strip in the top
 * bar, shown on every page the moment the site opens. `large` is the
 * big card on the Home page. The same choice also lives in Settings;
 * all three write the same setting, so they always agree.
 */
export const LanguagePicker: React.FC<{ variant: 'bar' | 'large' }> = ({ variant }) => {
  const lang = appState.settings.language;

  const pick = (id: (typeof SITE_LANGUAGES)[number]['id']) => {
    if (id !== lang) appState.updateSettings({ language: id });
  };

  const buttons = SITE_LANGUAGES.map((l) => {
    const active = lang === l.id;
    return (
      <button
        key={l.id}
        type="button"
        onClick={() => pick(l.id)}
        aria-pressed={active}
        style={l.id === 'bn' ? { fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" } : undefined}
        className={
          variant === 'bar'
            ? `min-h-[44px] px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold cursor-pointer transition-colors ${
                active
                  ? 'bg-[var(--gold)] text-black'
                  : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`
            : `min-h-[56px] px-5 py-4 rounded-xl border text-lg font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                active
                  ? 'bg-[var(--gold)] text-black border-[var(--gold)] shadow-lg scale-[1.02]'
                  : 'bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)]/50'
              }`
        }
      >
        {active && variant === 'large' && <Check className="w-5 h-5 shrink-0" aria-hidden="true" />}
        {l.nativeLabel}
      </button>
    );
  });

  if (variant === 'bar') {
    return (
      <div
        role="group"
        aria-label={t('home.languageBarLabel', lang)}
        className="flex items-center justify-center gap-2"
      >
        <Languages className="w-5 h-5 text-[var(--gold)] shrink-0" aria-hidden="true" />
        <div className="flex rounded-xl border border-[var(--border-main)] overflow-hidden shadow-2xs">
          {buttons}
        </div>
      </div>
    );
  }

  return (
    <section className="ms-panel rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 animate-fade-up">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)] shrink-0">
          <Languages className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display font-semibold text-xl sm:text-2xl text-[var(--text-main)] leading-tight">
            {t('home.languageTitle', lang)}
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {t('home.languageSubtitle', lang)}
          </p>
        </div>
      </div>
      <div role="group" aria-label={t('home.languageBarLabel', lang)} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {buttons}
      </div>
    </section>
  );
};
