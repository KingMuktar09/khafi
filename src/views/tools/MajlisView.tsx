import React, { useMemo, useState } from 'react';
import {
  formatInZone,
  getApproximateHours,
  getMansion,
  getMoonInfo,
  getMoonLongitude,
  getPlanetaryHours,
  getSavedLocation,
  getSunTimes,
  type DayHours,
} from '../../utils/astronomy';
import { planetById } from '../../data/planets';
import { appState } from '../../state/appState';
import { localizeMoonMethod, localizePhaseName, localizePlanetName, localizeSunReason, tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * Majlis — facts only: the location, today's ruler, the current
 * planetary hour, and the Moon's phase and mansion. No scoring, no
 * "why this", no recommended working, no day's plate, no advice
 * about what to do.
 */
export const MajlisView: React.FC = () => {
  const lang = appState.settings.language;
  const [now] = useState(() => new Date());

  const savedLocation = useMemo(() => getSavedLocation(), []);
  const moon = useMemo(() => getMoonInfo(now), [now]);
  const mansion = useMemo(() => getMansion(getMoonLongitude(now)), [now]);

  const dayHours: DayHours | null = useMemo(() => {
    if (savedLocation) return getPlanetaryHours(now, savedLocation);
    return getApproximateHours(now);
  }, [now, savedLocation]);

  const unavailableReason = useMemo(() => {
    if (!savedLocation || dayHours) return null;
    return getSunTimes(now, savedLocation).unavailableReason ?? 'No sunrise or sunset could be worked out for this place and day.';
  }, [now, savedLocation, dayHours]);

  const ruler = dayHours ? planetById(dayHours.dayRuler) : null;
  const currentHour = dayHours ? dayHours.hours[dayHours.currentIndex] : null;
  const currentRuler = currentHour ? planetById(currentHour.ruler) : null;
  const timeZone = dayHours ? dayHours.timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <ToolsLayout
      title={tTools('tools.majlis.title', lang)}
      eyebrow={tTools('tools.majlis.eyebrow', lang)}
      subtitle={tTools('tools.majlis.subtitle', lang)}
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.majlis.locationTitle', lang)}</h2>
        <p className="ms-body">
          {savedLocation
            ? `${savedLocation.label} (${savedLocation.lat}, ${savedLocation.lon}, ${savedLocation.timeZone}).`
            : tTools('tools.majlis.noLocation', lang)}
        </p>
        <p className="ms-note">{tTools('tools.majlis.locationNote', lang)}</p>
      </section>

      {dayHours && ruler && currentHour && currentRuler ? (
        <>
          <section className="ms-card space-y-3">
            <h2 className="ms-h2">{tTools('tools.majlis.rulerTitle', lang)}</h2>
            <p className="ms-body">
              <span className="ms-ink font-medium">{localizePlanetName(ruler.id, ruler.name, lang)}</span>{' '}
              <span className="ms-arabic-sm" dir="rtl" lang="ar">
                {ruler.arabic}
              </span>{' '}
              <span className="ms-muted">({ruler.transliteration})</span>{' '}
              {tTools('tools.majlis.rulerBodyA', lang)}
            </p>
          </section>

          <section className="ms-card space-y-3">
            <h2 className="ms-h2">{tTools('tools.majlis.currentTitle', lang)}</h2>
            <p className="ms-body">
              {tfTools('tools.today.hourLineA', lang, { n: currentHour.index + 1, dayNight: currentHour.isDay ? tTools('tools.common.day', lang) : tTools('tools.common.night', lang) })}{' '}
              <span className="ms-ink font-medium">{localizePlanetName(currentRuler.id, currentRuler.name, lang)}</span>{' '}
              <span className="ms-arabic-sm" dir="rtl" lang="ar">
                {currentRuler.arabic}
              </span>{' '}
              <span className="ms-muted">({currentRuler.transliteration})</span>.
            </p>
            <p className="ms-body ms-num">
              {formatInZone(currentHour.start, timeZone)} – {formatInZone(currentHour.end, timeZone)}{' '}
              ({timeZone})
            </p>
            {dayHours.approximate ? (
              <p className="ms-note">{tTools('tools.majlis.approxNote', lang)}</p>
            ) : null}
          </section>
        </>
      ) : (
        <p className="ms-note-box" role="alert">
          {tfTools('tools.majlis.unavailable', lang, { reason: unavailableReason ? localizeSunReason(unavailableReason, lang) : tTools('tools.today.defaultReason', lang) })}
        </p>
      )}

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.majlis.moonTitle', lang)}</h2>
        <p className="ms-body">
          {tfTools('tools.majlis.moonLine', lang, { phase: localizePhaseName(moon.phaseName, lang), pct: (moon.illumination * 100).toFixed(1), day: moon.lunarDay })}
        </p>
        <p className="ms-body">
          {tTools('tools.majlis.mansionLabel', lang)} <span className="ms-ink font-medium">
            {mansion.index + 1}. {mansion.name}
          </span>{' '}
          <span className="ms-arabic-sm" dir="rtl" lang="ar">
            {mansion.arabic}
          </span>
        </p>
        <p className="ms-note">
          {tfTools('tools.majlis.methodNote', lang, { method: localizeMoonMethod(moon.method, lang) })}
        </p>
      </section>

      <p className="ms-note">
        {tTools('tools.majlis.footer', lang)}
      </p>
    </ToolsLayout>
  );
};
