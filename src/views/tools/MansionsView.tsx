import React, { useMemo, useState } from 'react';
import { getMansion, getMoonLongitude } from '../../utils/astronomy';
import {
  MANSIONS,
  MANSION_CONVENTION,
  MANSION_SIZE_DEG,
  MANSION_SOURCE,
} from '../../data/mansions';
import { appState } from '../../state/appState';
import { tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * Lunar Mansions — the full table of the 28 manazil al-qamar, with
 * today's mansion highlighted. The 28 equal parts of about 12.857°
 * from 0° al-Sharatayn is a convention, and the start point can be
 * moved here: the offset control shifts every mansion's range.
 */
export const MansionsView: React.FC = () => {
  const lang = appState.settings.language;
  const [now] = useState(() => new Date());
  const [offsetInput, setOffsetInput] = useState('0');

  const offset = useMemo(() => {
    const parsed = Number(offsetInput);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [offsetInput]);

  const moonLongitude = useMemo(() => getMoonLongitude(now), [now]);
  const todayMansion = useMemo(() => getMansion(moonLongitude, offset), [moonLongitude, offset]);

  const formatDeg = (value: number): string => `${value.toFixed(2)}°`;

  return (
    <ToolsLayout
      title={tTools('tools.mansions.title', lang)}
      eyebrow={tTools('tools.mansions.eyebrow', lang)}
      subtitle={tTools('tools.mansions.subtitle', lang)}
    >
      <section className="ms-card space-y-4">
        <h2 className="ms-h2">{tTools('tools.mansions.todayTitle', lang)}</h2>
        <p className="ms-body">
          {tfTools('tools.mansions.todayBodyA', lang, { deg: formatDeg(moonLongitude) })}{' '}
          <span className="ms-ink font-medium">
            {todayMansion.index + 1}. {todayMansion.name}
          </span>{' '}
          <span className="ms-arabic-sm" dir="rtl" lang="ar">
            {todayMansion.arabic}
          </span>
          {offset !== 0 ? tfTools('tools.mansions.todayOffset', lang, { offset }) : ''}.
        </p>
        <div className="space-y-1.5">
          <label className="ms-label" htmlFor="mansions-offset">
            {tTools('tools.mansions.offsetLabel', lang)}
          </label>
          <input
            id="mansions-offset"
            type="number"
            inputMode="decimal"
            className="ms-field ms-num w-full"
            value={offsetInput}
            onChange={(event) => setOffsetInput(event.target.value)}
          />
          <p className="ms-note">
            {tTools('tools.mansions.offsetNote', lang)}
          </p>
        </div>
      </section>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.mansions.thHash', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.mansions.thMansion', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.mansions.thArabic', lang)}</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">{tTools('tools.mansions.thDegrees', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {MANSIONS.map((mansion) => {
              const isToday = mansion.index === todayMansion.index;
              const start = (((mansion.startDeg + offset) % 360) + 360) % 360;
              const end = start + MANSION_SIZE_DEG;
              return (
                <tr
                  key={mansion.index}
                  style={isToday ? { background: 'rgba(232, 184, 79, 0.10)' } : undefined}
                >
                  <td className="px-4 py-2.5 ms-num">
                    {mansion.index + 1}
                    {isToday ? tTools('tools.mansions.todaySuffix', lang) : ''}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="ms-ink">{mansion.name}</span>
                    {mansion.alternateName ? (
                      <span className="ms-muted block text-sm">{tTools('tools.mansions.alsoPrefix', lang)}{mansion.alternateName}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="ms-arabic-sm" dir="rtl" lang="ar">
                      {mansion.arabic}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right ms-num">
                    {formatDeg(start)} – {formatDeg(end)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <p className="ms-note">
        {tTools('tools.data.mansionConvention', lang)} {tTools('tools.common.source', lang)}: {MANSION_SOURCE}. {tTools('tools.mansions.footerTail', lang)}
      </p>
    </ToolsLayout>
  );
};
