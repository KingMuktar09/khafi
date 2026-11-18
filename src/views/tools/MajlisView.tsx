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
import { ToolsLayout } from './ToolsLayout';

/**
 * Majlis — facts only: the location, today's ruler, the current
 * planetary hour, and the Moon's phase and mansion. No scoring, no
 * "why this", no recommended working, no day's plate, no advice
 * about what to do.
 */
export const MajlisView: React.FC = () => {
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
      title="Majlis"
      eyebrow="Time & Heavens"
      subtitle="The facts of the moment, in one place: where you are, today's ruler, the current hour, and the Moon."
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">Location</h2>
        <p className="ms-body">
          {savedLocation
            ? `${savedLocation.label} (${savedLocation.lat}, ${savedLocation.lon}, ${savedLocation.timeZone}).`
            : 'No location is set. Hours below use the approximate 06:00–18:00 split. Set a location on the Planetary Hours page.'}
        </p>
        <p className="ms-note">The location is saved on this device only. Nothing is sent anywhere.</p>
      </section>

      {dayHours && ruler && currentHour && currentRuler ? (
        <>
          <section className="ms-card space-y-3">
            <h2 className="ms-h2">Today&apos;s ruler</h2>
            <p className="ms-body">
              <span className="ms-ink font-medium">{ruler.name}</span>{' '}
              <span className="ms-arabic-sm" dir="rtl" lang="ar">
                {ruler.arabic}
              </span>{' '}
              <span className="ms-muted">({ruler.transliteration})</span> rules the first hour of
              this day.
            </p>
          </section>

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
            {dayHours.approximate ? (
              <p className="ms-note">Approximate, not real hours — no location is set.</p>
            ) : null}
          </section>
        </>
      ) : (
        <p className="ms-note-box" role="alert">
          Planetary hours are unavailable for this place and day: {unavailableReason}
        </p>
      )}

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">The Moon</h2>
        <p className="ms-body">
          {moon.phaseName}, {(moon.illumination * 100).toFixed(1)}% lit, lunar day {moon.lunarDay}{' '}
          of 30.
        </p>
        <p className="ms-body">
          Mansion: <span className="ms-ink font-medium">
            {mansion.index + 1}. {mansion.name}
          </span>{' '}
          <span className="ms-arabic-sm" dir="rtl" lang="ar">
            {mansion.arabic}
          </span>
        </p>
        <p className="ms-note">
          Method: {moon.method}. The mansion division (28 equal parts from 0° al-Sharatayn) is a
          convention; see the Lunar Mansions page.
        </p>
      </section>

      <p className="ms-note">
        That is all this page says: facts about the time and the sky. It does not score the day,
        recommend anything, or say what to do.
      </p>
    </ToolsLayout>
  );
};
