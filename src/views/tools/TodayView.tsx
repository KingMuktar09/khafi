import React, { useMemo, useState } from 'react';
import {
  formatInZone,
  getApproximateHours,
  getHijri,
  getPlanetaryHours,
  getSavedLocation,
  getSunTimes,
  type DayHours,
} from '../../utils/astronomy';
import { planetById } from '../../data/planets';
import { appState } from '../../state/appState';
import { localizeHijriMethod, localizeHijriNote, localizePlanetName, localizeSunReason, tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * Today — the facts of this day: the Gregorian date, the approximate
 * Hijri date, the planet ruling the day, and the planetary hour we
 * are in now. Facts only; nothing here promises any outcome.
 */
export const TodayView: React.FC = () => {
  const lang = appState.settings.language;
  const [now] = useState(() => new Date());

  const savedLocation = useMemo(() => getSavedLocation(), []);
  const hijri = useMemo(() => getHijri(now), [now]);

  const dayHours: DayHours | null = useMemo(() => {
    if (savedLocation) return getPlanetaryHours(now, savedLocation);
    return getApproximateHours(now);
  }, [now, savedLocation]);

  const unavailableReason = useMemo(() => {
    if (!savedLocation || dayHours) return null;
    return getSunTimes(now, savedLocation).unavailableReason ?? 'No sunrise or sunset could be worked out for this place and day.';
  }, [now, savedLocation, dayHours]);

  const gregorianLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now),
    [now],
  );

  const ruler = dayHours ? planetById(dayHours.dayRuler) : null;
  const currentHour = dayHours ? dayHours.hours[dayHours.currentIndex] : null;
  const currentRuler = currentHour ? planetById(currentHour.ruler) : null;
  const timeZone = dayHours ? dayHours.timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <ToolsLayout
      title={tTools('tools.today.title', lang)}
      eyebrow={tTools('tools.today.eyebrow', lang)}
      subtitle={tTools('tools.today.subtitle', lang)}
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{gregorianLabel}</h2>
        <p className="ms-body">
          {tTools('tools.today.hijriLabel', lang)} <span className="ms-ink font-medium">{hijri.formatted}</span>
        </p>
        <p className="ms-note">
          {localizeHijriMethod(hijri.method, lang)}. {localizeHijriNote(hijri.note, lang)}{' '}
          {tTools('tools.today.hijriApprox', lang)}
        </p>
      </section>

      {dayHours && ruler ? (
        <>
          <section className="ms-card space-y-3">
            <h2 className="ms-h2">{tTools('tools.today.rulerTitle', lang)}</h2>
            <p className="ms-body">
              <span className="ms-ink font-medium">{localizePlanetName(ruler.id, ruler.name, lang)}</span>{' '}
              <span className="ms-arabic-sm" dir="rtl" lang="ar">
                {ruler.arabic}
              </span>{' '}
              <span className="ms-muted">({ruler.transliteration})</span>{' '}
              {tTools('tools.today.rulerBodyA', lang)}
            </p>
            <p className="ms-note">
              {tTools('tools.today.dayRulersNote', lang)}
            </p>
          </section>

          {currentHour && currentRuler ? (
            <section className="ms-card space-y-3">
              <h2 className="ms-h2">{tTools('tools.today.currentTitle', lang)}</h2>
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
              <p className="ms-note">
                {dayHours.approximate
                  ? tTools('tools.today.approxNote', lang)
                  : tfTools('tools.today.realNote', lang, { label: dayHours.location ? dayHours.location.label : tTools('tools.today.yourSavedLocation', lang) })}
              </p>
            </section>
          ) : null}
        </>
      ) : (
        <p className="ms-note-box" role="alert">
          {tfTools('tools.today.unavailable', lang, { reason: unavailableReason ? localizeSunReason(unavailableReason, lang) : tTools('tools.today.defaultReason', lang) })}
        </p>
      )}

      <p className="ms-note">
        {savedLocation
          ? tfTools('tools.today.locationLine', lang, { label: savedLocation.label, lat: savedLocation.lat, lon: savedLocation.lon, tz: savedLocation.timeZone })
          : tTools('tools.today.noLocation', lang)}{' '}
        {tTools('tools.today.locationTail', lang)}
      </p>
    </ToolsLayout>
  );
};
