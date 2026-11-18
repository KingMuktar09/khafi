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
import { ToolsLayout } from './ToolsLayout';

/**
 * Today — the facts of this day: the Gregorian date, the approximate
 * Hijri date, the planet ruling the day, and the planetary hour we
 * are in now. Facts only; nothing here promises any outcome.
 */
export const TodayView: React.FC = () => {
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
      title="Today"
      eyebrow="Time & Heavens"
      subtitle="The facts of this day: the date, the day's ruler, and the planetary hour we are in now."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{gregorianLabel}</h2>
        <p className="ms-body">
          Hijri date (approximate): <span className="ms-ink font-medium">{hijri.formatted}</span>
        </p>
        <p className="ms-note">
          {hijri.method}. {hijri.note} This date is approximate — it is the civil calendar, not a
          sighted date.
        </p>
      </section>

      {dayHours && ruler ? (
        <>
          <section className="ms-card space-y-3">
            <h2 className="ms-h2">Today&apos;s ruler</h2>
            <p className="ms-body">
              <span className="ms-ink font-medium">{ruler.name}</span>{' '}
              <span className="ms-arabic-sm" dir="rtl" lang="ar">
                {ruler.arabic}
              </span>{' '}
              <span className="ms-muted">({ruler.transliteration})</span> rules the first hour of
              this day, so it is the day&apos;s ruler. The day is counted from sunrise: an instant
              before sunrise belongs to the previous day.
            </p>
            <p className="ms-note">
              Day rulers: Sunday Sun, Monday Moon, Tuesday Mars, Wednesday Mercury, Thursday
              Jupiter, Friday Venus, Saturday Saturn. Source: Wikipedia, “Planetary hours”.
            </p>
          </section>

          {currentHour && currentRuler ? (
            <section className="ms-card space-y-3">
              <h2 className="ms-h2">The current hour</h2>
              <p className="ms-body">
                Hour {currentHour.index + 1} of 24 ({currentHour.isDay ? 'day' : 'night'} hour),
                ruled by <span className="ms-ink font-medium">{currentRuler.name}</span>{' '}
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
                  ? 'Approximate, not real hours — no location is set, so these hours use a fixed 06:00–18:00 split. Set a location on the Planetary Hours page for real hours.'
                  : `Real hours for ${dayHours.location ? dayHours.location.label : 'your saved location'}. Hours are unequal: each day hour is one twelfth of sunrise to sunset, each night hour one twelfth of sunset to next sunrise.`}
              </p>
            </section>
          ) : null}
        </>
      ) : (
        <p className="ms-note-box" role="alert">
          Planetary hours are unavailable for this place and day: {unavailableReason}
        </p>
      )}

      <p className="ms-note">
        {savedLocation
          ? `Location: ${savedLocation.label} (${savedLocation.lat}, ${savedLocation.lon}, ${savedLocation.timeZone}).`
          : 'No location is set. Times use the device time zone and the approximate 06:00–18:00 split. Set a location on the Planetary Hours page.'}{' '}
        Nothing is sent anywhere — the location is saved on this device only. There are no prayer
        times here.
      </p>
    </ToolsLayout>
  );
};
