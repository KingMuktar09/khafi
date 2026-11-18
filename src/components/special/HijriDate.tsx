import React from 'react';
import { MoonStar } from 'lucide-react';
import { formatHijri, gregorianToHijri } from '../../data/tools';
import { appState } from '../../state/appState';
import { t, tf } from '../../data/i18n';

/**
 * Today's Hijri date — TABULAR (calculated) Islamic date. It can
 * differ from the moon-sighting date by a day or two, so it is always
 * labelled "approximate". No prayer times are given here. The Hijri
 * month name is transliteration and never changes; only the words
 * around the date follow the Settings language.
 */
export const HijriDate: React.FC = () => {
  const lang = appState.settings.language;
  const hijri = gregorianToHijri(new Date());
  // Bengali dates read in Bengali; Hinglish keeps the English date
  // words, since Hinglish is written in the Roman script.
  const dateLocale = lang === 'bn' ? 'bn' : 'en-GB';
  const gregorian = new Date().toLocaleDateString(dateLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full flex items-center gap-1.5 tracking-wide">
      <MoonStar className="w-3.5 h-3.5" />
      <span title={tf('home.hijri.tooltip', lang, { date: gregorian })}>
        {formatHijri(hijri)} {t('home.hijri.approx', lang)}
      </span>
    </span>
  );
};
