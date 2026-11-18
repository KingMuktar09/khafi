import React, { useMemo, useState } from 'react';
import { getSunLongitude } from '../../utils/astronomy';
import { ZODIAC_CONVENTION, ZODIAC_SIGNS, ZODIAC_SOURCE, zodiacSignForLongitude } from '../../data/zodiac';
import { ToolsLayout } from './ToolsLayout';

/**
 * Falak — the twelve signs of the tropical zodiac. The Sun's
 * current sign is worked out from its ecliptic longitude with the
 * Astronomy Engine, through the shared time engine (getSunLongitude).
 * Facts only.
 */
export const FalakView: React.FC = () => {
  const [now] = useState(() => new Date());

  const sunLongitude = useMemo(() => getSunLongitude(now), [now]);

  const currentSign = useMemo(() => zodiacSignForLongitude(sunLongitude), [sunLongitude]);

  const elementLabel = (element: string): string =>
    element.charAt(0).toUpperCase() + element.slice(1);

  return (
    <ToolsLayout
      title="Falak — the Twelve Signs"
      eyebrow="Time & Heavens"
      subtitle="The twelve signs of the tropical zodiac, with the Sun's sign today. A table for study — nothing here says what a sign means for any person."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">The Sun&apos;s sign today</h2>
        <p className="ms-body">
          The Sun is at {sunLongitude.toFixed(2)}° ecliptic longitude, in{' '}
          <span className="ms-ink font-medium">{currentSign.name}</span>{' '}
          <span className="ms-arabic-sm" dir="rtl" lang="ar">
            {currentSign.arabic}
          </span>{' '}
          <span className="ms-muted">({currentSign.transliteration})</span>,{' '}
          {elementLabel(currentSign.element)}.
        </p>
        <p className="ms-note">
          Worked out with the Astronomy Engine (SunPosition ecliptic longitude of the Sun). {ZODIAC_CONVENTION}
        </p>
      </section>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">#</th>
              <th scope="col" className="px-4 py-3 font-medium">Sign</th>
              <th scope="col" className="px-4 py-3 font-medium">Arabic</th>
              <th scope="col" className="px-4 py-3 font-medium">Dates (approx.)</th>
              <th scope="col" className="px-4 py-3 font-medium">Element</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Degrees</th>
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
                    {isCurrent ? ' — today' : ''}
                  </td>
                  <td className="px-4 py-2.5 ms-ink">{sign.name}</td>
                  <td className="px-4 py-2.5">
                    <span className="ms-arabic-sm" dir="rtl" lang="ar">
                      {sign.arabic}
                    </span>{' '}
                    <span className="ms-muted text-sm">({sign.transliteration})</span>
                  </td>
                  <td className="px-4 py-2.5 ms-num">{sign.dateRange}</td>
                  <td className="px-4 py-2.5 ms-body">{elementLabel(sign.element)}</td>
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
        {ZODIAC_CONVENTION} Elements are the traditional Western grouping: Fire = Aries, Leo,
        Sagittarius; Earth = Taurus, Virgo, Capricorn; Air = Gemini, Libra, Aquarius; Water =
        Cancer, Scorpio, Pisces. Source: {ZODIAC_SOURCE}. The date ranges are approximate and shift
        a day or so from year to year, because the equinox itself moves.
      </p>
    </ToolsLayout>
  );
};
