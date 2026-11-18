import React, { useMemo, useState } from 'react';
import { getMansion, getMoonInfo, getMoonLongitude } from '../../utils/astronomy';
import { MANSION_CONVENTION, MANSION_SOURCE } from '../../data/mansions';
import { appState } from '../../state/appState';
import { localizeMoonMethod, localizePhaseName, tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * Moon — the Moon's phase, illumination, lunar day and current
 * lunar mansion, worked out with the Astronomy Engine. Facts only.
 */
export const MoonView: React.FC = () => {
  const lang = appState.settings.language;
  const [now] = useState(() => new Date());

  const moon = useMemo(() => getMoonInfo(now), [now]);
  const longitude = useMemo(() => getMoonLongitude(now), [now]);
  const mansion = useMemo(() => getMansion(longitude), [longitude]);

  return (
    <ToolsLayout
      title={tTools('tools.moon.title', lang)}
      eyebrow={tTools('tools.moon.eyebrow', lang)}
      subtitle={tTools('tools.moon.subtitle', lang)}
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{localizePhaseName(moon.phaseName, lang)}</h2>
        <dl className="space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="ms-body">{tTools('tools.moon.phaseAngle', lang)}</dt>
            <dd className="ms-num ms-ink">{moon.phaseAngle.toFixed(1)}°</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="ms-body">{tTools('tools.moon.illumination', lang)}</dt>
            <dd className="ms-num ms-ink">{(moon.illumination * 100).toFixed(1)}%</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="ms-body">{tTools('tools.moon.lunarDay', lang)}</dt>
            <dd className="ms-num ms-ink">
              {tfTools('tools.moon.lunarDayValue', lang, { n: moon.lunarDay })}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="ms-body">{tTools('tools.moon.longitude', lang)}</dt>
            <dd className="ms-num ms-ink">{longitude.toFixed(2)}°</dd>
          </div>
        </dl>
        <p className="ms-note">{tfTools('tools.moon.methodNote', lang, { method: localizeMoonMethod(moon.method, lang) })}</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.moon.currentMansion', lang)}</h2>
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
              <span className="ms-muted">{tfTools('tools.moon.alsoCalled', lang, { name: mansion.alternateName })}</span>
            </>
          ) : null}
        </p>
        <p className="ms-body ms-num">
          {mansion.startDeg.toFixed(2)}° – {mansion.endDeg.toFixed(2)}°
        </p>
        <p className="ms-note">
          {tTools('tools.data.mansionConvention', lang)} {tTools('tools.common.source', lang)}: {MANSION_SOURCE}.
        </p>
      </section>

      <p className="ms-note">
        {tTools('tools.moon.footer', lang)}
      </p>
    </ToolsLayout>
  );
};
