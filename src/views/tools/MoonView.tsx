import React, { useMemo, useState } from 'react';
import { getMansion, getMoonInfo, getMoonLongitude } from '../../utils/astronomy';
import { MANSION_CONVENTION, MANSION_SOURCE } from '../../data/mansions';
import { ToolsLayout } from './ToolsLayout';

/**
 * Moon — the Moon's phase, illumination, lunar day and current
 * lunar mansion, worked out with the Astronomy Engine. Facts only.
 */
export const MoonView: React.FC = () => {
  const [now] = useState(() => new Date());

  const moon = useMemo(() => getMoonInfo(now), [now]);
  const longitude = useMemo(() => getMoonLongitude(now), [now]);
  const mansion = useMemo(() => getMansion(longitude), [longitude]);

  return (
    <ToolsLayout
      title="Moon"
      eyebrow="Time & Heavens"
      subtitle="The Moon's phase, how much of it is lit, the lunar day, and the mansion it sits in."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{moon.phaseName}</h2>
        <dl className="space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="ms-body">Phase angle</dt>
            <dd className="ms-num ms-ink">{moon.phaseAngle.toFixed(1)}°</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="ms-body">Illumination</dt>
            <dd className="ms-num ms-ink">{(moon.illumination * 100).toFixed(1)}%</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="ms-body">Lunar day</dt>
            <dd className="ms-num ms-ink">
              Day {moon.lunarDay} of 30
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="ms-body">Moon&apos;s ecliptic longitude</dt>
            <dd className="ms-num ms-ink">{longitude.toFixed(2)}°</dd>
          </div>
        </dl>
        <p className="ms-note">Method: {moon.method}. Phase angle 0° is new moon, 180° is full moon.</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Current mansion</h2>
        <p className="ms-body">
          <span className="ms-ink font-medium">
            {mansion.index + 1}. {mansion.name}
          </span>{' '}
          <span className="ms-arabic-sm" dir="rtl" lang="ar">
            {mansion.arabic}
          </span>
          {mansion.alternateName ? (
            <>
              {' '}
              <span className="ms-muted">(also called {mansion.alternateName})</span>
            </>
          ) : null}
        </p>
        <p className="ms-body ms-num">
          {mansion.startDeg.toFixed(2)}° – {mansion.endDeg.toFixed(2)}°
        </p>
        <p className="ms-note">
          {MANSION_CONVENTION} Source: {MANSION_SOURCE}.
        </p>
      </section>

      <p className="ms-note">
        These are calculated facts only. They say where the Moon is and how lit it is — nothing
        here says what that means for any day or any person.
      </p>
    </ToolsLayout>
  );
};
