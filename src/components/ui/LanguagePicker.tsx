import React from 'react';
import { Languages } from 'lucide-react';
import { appState } from '../../state/appState';
import { SITE_LANGUAGES, t } from '../../data/i18n';
import { storage } from '../../services/storage';

/**
 * First-visit language chooser: one big simple screen, shown before
 * anything else (even before the follow gate) when the visitor has
 * never picked a language. Four big buttons, each language in its own
 * script (English / Hinglish / বাংলা / اردو), big tap targets, so
 * even an illiterate person can pick at a glance. After the pick the
 * choice is saved on the device and this screen never shows again.
 * The language can be changed later only in Settings (More ->
 * Settings -> Language). Urdu buttons use the Nastaliq font and
 * read right-to-left; Bengali buttons use Hind Siliguri.
 */
export const LanguagePicker: React.FC<{ onPicked: () => void }> = ({ onPicked }) => {
  const lang = appState.settings.language;

  const pick = (id: (typeof SITE_LANGUAGES)[number]['id']) => {
    appState.updateSettings({ language: id });
    storage.setLanguageChosen();
    onPicked();
  };

  return (
    <div className="min-h-dvh bg-[#0a0806] flex items-center justify-center p-4 sm:p-6">
      <section className="ms-panel rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 w-full max-w-xl text-center animate-fade-up">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
            <Languages className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] leading-tight">
            {t('chooser.title', lang)}
          </h1>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            {t('chooser.subtitle', lang)}
          </p>
        </div>
        <div role="group" aria-label={t('chooser.title', lang)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SITE_LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => pick(l.id)}
              dir={l.id === 'ur' ? 'rtl' : undefined}
              style={
                l.id === 'bn'
                  ? { fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" }
                  : l.id === 'ur'
                    ? { fontFamily: "'Noto Nastaliq Urdu', 'Amiri', serif" }
                    : undefined
              }
              className="min-h-[68px] px-5 py-4 rounded-xl border text-xl sm:text-2xl font-bold cursor-pointer transition-all flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--gold)] hover:bg-[var(--gold-faint)] active:scale-[0.98]"
            >
              {l.nativeLabel}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
