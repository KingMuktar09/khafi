import React, { useMemo, useState } from 'react';
import { getMansion, getMoonLongitude } from '../../utils/astronomy';
import {
  MANSIONS,
  MANSION_CONVENTION,
  MANSION_SIZE_DEG,
  MANSION_SOURCE,
} from '../../data/mansions';
import { ToolsLayout } from './ToolsLayout';

/**
 * Lunar Mansions — the full table of the 28 manazil al-qamar, with
 * today's mansion highlighted. The 28 equal parts of about 12.857°
 * from 0° al-Sharatayn is a convention, and the start point can be
 * moved here: the offset control shifts every mansion's range.
 */
export const MansionsView: React.FC = () => {
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
      title="Lunar Mansions"
      eyebrow="Time & Heavens"
      subtitle="The 28 stations of the Moon (manazil al-qamar). Today's mansion is highlighted; the start point below is a convention you can move."
    >
      <section className="ms-card space-y-4">
        <h2 className="ms-h2">Today&apos;s mansion</h2>
        <p className="ms-body">
          The Moon is at {formatDeg(moonLongitude)} ecliptic longitude, in{' '}
          <span className="ms-ink font-medium">
            {todayMansion.index + 1}. {todayMansion.name}
          </span>{' '}
          <span className="ms-arabic-sm" dir="rtl" lang="ar">
            {todayMansion.arabic}
          </span>
          {offset !== 0 ? ` (with a start offset of ${offset}°)` : ''}.
        </p>
        <div className="space-y-1.5">
          <label className="ms-label" htmlFor="mansions-offset">
            Start offset (degrees) — a convention, not a fixed fact
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
            The table below starts at 0° with al-Sharatayn by convention. Setting an offset of, say,
            5° moves the start point to 5°, so every mansion&apos;s range shifts by 5°. Other
            traditions start the count elsewhere — this control lets you use their start point
            instead. The Moon&apos;s position itself comes from the Astronomy Engine.
          </p>
        </div>
      </section>

      <section className="ms-surface ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">#</th>
              <th scope="col" className="px-4 py-3 font-medium">Mansion</th>
              <th scope="col" className="px-4 py-3 font-medium">Arabic</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Degrees</th>
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
                    {isToday ? ' — today' : ''}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="ms-ink">{mansion.name}</span>
                    {mansion.alternateName ? (
                      <span className="ms-muted block text-sm">also {mansion.alternateName}</span>
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
        {MANSION_CONVENTION} Source: {MANSION_SOURCE}. Each mansion covers 360 / 28 = about
        12.857°. The list is a traditional table, not a modern astronomical fact.
      </p>
    </ToolsLayout>
  );
};
