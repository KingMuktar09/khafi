import React from 'react';
import { MoonStar } from 'lucide-react';
import { formatHijri, gregorianToHijri } from '../../data/tools';

/**
 * Today's Hijri date — TABULAR (calculated) Islamic date. It can
 * differ from the moon-sighting date by a day or two, so it is always
 * labelled "approximate". No prayer times are given here.
 */
export const HijriDate: React.FC = () => {
  const hijri = gregorianToHijri(new Date());
  const gregorian = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full flex items-center gap-1.5 tracking-wide">
      <MoonStar className="w-3.5 h-3.5" />
      <span title={`${gregorian}. Tabular Islamic date, approximate, may differ from the sighted date by a day or two.`}>
        {formatHijri(hijri)} (approx.)
      </span>
    </span>
  );
};
