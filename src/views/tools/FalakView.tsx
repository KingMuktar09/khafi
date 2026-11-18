import React, { useMemo, useState } from 'react';
import { getSunLongitude } from '../../utils/astronomy';
import { ZODIAC_CONVENTION, ZODIAC_SIGNS, ZODIAC_SOURCE, zodiacSignForLongitude } from '../../data/zodiac';
import { appState } from '../../state/appState';
import { localizeElement, localizeZodiacName, tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * Falak — the twelve signs of the tropical zodiac. The Sun's
 * current sign is worked out from its ecliptic longitude with the
 * Astronomy Engine, through the shared time engine (getSunLongitude).
 * Facts only.
 */
export const FalakView: React.FC = () => {
  const lang = appState.settings.language;
  const [now] = useState(() => new Date());

  const sunLongitude = useMemo(() => getSunLongitude(now), [now]);

  const currentSign = useMemo(() => zodiacSignForLongitude(sunLongitude), [sunLongitude]);

  return (
    <ToolsLayout
      title={tTools('tools.falak.title', lang)}
      eyebrow={tTools('tools.falak.eyebrow', lang)}
      subtitle={tTools('tools.falak.subtitle', lang)}
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.falak.sunSignTitle', lang)}</h2>
        <p className="ms-body">
          {tfTools('tools.falak.sunSignBodyA', lang, { deg: sunLongitude.toFixed(2) })}{' '}
          <span className="ms-ink font-medium">{localizeZodiacName(currentSign.index, currentSign.name, lang)}</span>{' '}
          <span className="ms-arabic-sm" dir="rtl" lang="ar">
            {currentSign.arabic}
          </span>{' '}
          <span className="ms-muted">({currentSign.transliteration})</span>,{' '}
          {localizeElement(currentSign.element, lang)}.
        </p>
        <p className="ms-note">
          {tfTools('tools.falak.methodNote', lang, { convention: tTools('tools.data.zodiacConvention', lang) })}
        </p>
      </section>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.falak.thHash', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.falak.thSign', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.falak.thArabic', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.falak.thDates', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.falak.thElement', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.falak.thDegrees', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {ZODIAC_SIGNS.map((sign) => {
              const isCurrent = sign.index === currentSign.index;
              return (
                <tr
                  key={sign.index}
                  style={isCurrent ? { background: 'rgba(232, 184, 79, 0.10)' } : undefined}
                >
                  <td className="px-4 py-2.5 ms-num">
                    {sign.index + 1}
                    {isCurrent ? tTools('tools.falak.todaySuffix', lang) : ''}
                  </td>
                  <td className="px-4 py-2.5 ms-ink">{localizeZodiacName(sign.index, sign.name, lang)}</td>
                  <td className="px-4 py-2.5">
                    <span className="ms-arabic-sm" dir="rtl" lang="ar">
                      {sign.arabic}
                    </span>{' '}
                    <span className="ms-muted text-sm">({sign.transliteration})</span>
                  </td>
                  <td className="px-4 py-2.5 ms-num">{sign.dateRange}</td>
                  <td className="px-4 py-2.5 ms-body">{localizeElement(sign.element, lang)}</td>
                  <td className="px-4 py-2.5 text-right ms-num">
                    {sign.startLongitude}° – {sign.endLongitude}°
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <p className="ms-note">
        {tTools('tools.data.zodiacConvention', lang)}{' '}
        {tfTools('tools.falak.footer', lang, { source: ZODIAC_SOURCE })}
      </p>
    </ToolsLayout>
  );
};
