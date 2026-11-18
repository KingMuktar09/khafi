import React, { useMemo, useState } from 'react';
import {
  formatInZone,
  getApproximateHours,
  getMansion,
  getMoonInfo,
  getMoonLongitude,
  getPlanetaryHours,
  getSavedLocation,
  type DayHours,
} from '../../utils/astronomy';
import { planetById, type PlanetId } from '../../data/planets';
import { router } from '../../router/router';
import { appState } from '../../state/appState';
import { t, tf } from '../../data/i18n';

/**
 * Home sky cards: the live facts of this moment, in a row of four
 * cards under the hero. Everything here is computed on the device
 * from the maintained astronomy engine and the site's own data.
 *
 * - Today: weekday and Gregorian date.
 * - Planetary hour: the hour we are in now, with its ruler tinted in
 *   the planet's colour. Real hours need a saved place; without one
 *   the fixed 06:00-18:00 fallback is shown and labelled approximate.
 * - Moon: phase name, lit share, and day of the lunar month.
 * - Lunar mansion: the mansion the Moon stands in now. 28 equal parts
 *   from 0 deg al-Sharatayn is a stated convention, not a universal fact.
 *
 * Nothing here promises any outcome. Each card links to its tool.
 * The `ms-live-card` class is the hook for the gentle breathe pulse
 * added by the animation pass; it adds no motion on its own.
 */

/** Planet colours, from the site's own manuscript palette. */
export const PLANET_COLOURS: Record<PlanetId, string> = {
  saturn: '#8b7fb8',
  jupiter: '#5f8fe8',
  mars: '#e86a52',
  sun: '#e8b84f',
  venus: '#5fc98f',
  mercury: '#b58fe8',
  moon: '#c9d2e0',
};

/**
 * Moon phase names are descriptions, not names, so they follow the
 * Settings language. Planet names, mansion names and their Arabic are
 * names and transliteration, so they stay exactly as they are.
 */
const PHASE_KEYS: Record<string, string> = {
  'New Moon': 'home.sky.phase.newMoon',
  'Waxing Crescent': 'home.sky.phase.waxingCrescent',
  'First Quarter': 'home.sky.phase.firstQuarter',
  'Waxing Gibbous': 'home.sky.phase.waxingGibbous',
  'Full Moon': 'home.sky.phase.fullMoon',
  'Waning Gibbous': 'home.sky.phase.waningGibbous',
  'Last Quarter': 'home.sky.phase.lastQuarter',
  'Waning Crescent': 'home.sky.phase.waningCrescent',
};

export const HomeSkyCards: React.FC = () => {
  const lang = appState.settings.language;
  const [now] = useState(() => new Date());

  const savedLocation = useMemo(() => getSavedLocation(), []);
  const dayHours: DayHours | null = useMemo(() => {
    if (savedLocation) return getPlanetaryHours(now, savedLocation);
    return getApproximateHours(now);
  }, [now, savedLocation]);

  const moon = useMemo(() => getMoonInfo(now), [now]);
  const mansion = useMemo(() => getMansion(getMoonLongitude(now)), [now]);

  // Bengali dates read in Bengali; Hinglish keeps the English date
  // words, since Hinglish is written in the Roman script.
  const dateLocale = lang === 'bn' ? 'bn' : 'en-GB';
  const dayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(dateLocale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now),
    [now, dateLocale],
  );
  const weekday = useMemo(
    () => new Intl.DateTimeFormat(dateLocale, { weekday: 'long' }).format(now),
    [now, dateLocale],
  );
  const phaseKey = PHASE_KEYS[moon.phaseName];
  const phaseName = phaseKey ? t(phaseKey, lang) : moon.phaseName;

  const currentHour = dayHours ? dayHours.hours[dayHours.currentIndex] : null;
  const currentRuler = currentHour ? planetById(currentHour.ruler) : null;
  const rulerColour = currentRuler ? PLANET_COLOURS[currentRuler.id] : '#e8b84f';
  const timeZone = dayHours
    ? dayHours.timeZone
    : Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <section aria-label={t('home.sky.aria', lang)} className="animate-fade-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Today */}
        <div
          onClick={() => router.navigate('tools-today')}
          className="ms-card ms-card-hover ms-live-card p-5 cursor-pointer space-y-2"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') router.navigate('tools-today');
          }}
        >
          <p className="ms-label">{t('home.sky.today', lang)}</p>
          <p className="font-display font-semibold text-xl text-[var(--text-main)] leading-snug">
            {weekday}
          </p>
          <p className="ms-body">{dayLabel}</p>
          <p className="text-xs text-[var(--gold)] font-medium">{t('home.sky.seeToday', lang)}</p>
        </div>

        {/* Planetary hour now */}
        <div
          onClick={() => router.navigate('tools-hours')}
          className="ms-card ms-card-hover ms-live-card p-5 cursor-pointer space-y-2"
          style={{ borderTop: `3px solid ${rulerColour}` }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') router.navigate('tools-hours');
          }}
        >
          <p className="ms-label">{t('home.sky.planetaryHour', lang)}</p>
          {currentHour && currentRuler ? (
            <>
              <p className="font-display font-semibold text-xl text-[var(--text-main)] leading-snug">
                <span style={{ color: rulerColour }}>{currentRuler.name}</span>{' '}
                <span className="ms-arabic-sm" dir="rtl" lang="ar">
                  {currentRuler.arabic}
                </span>
              </p>
              <p className="ms-body">
                {tf('home.sky.hourOf', lang, {
                  n: currentHour.index + 1,
                  dayNight: t(currentHour.isDay ? 'home.sky.day' : 'home.sky.night', lang),
                })}{' '}
                · {formatInZone(currentHour.start, timeZone)} to{' '}
                {formatInZone(currentHour.end, timeZone)}
              </p>
              {dayHours?.approximate && (
                <p className="ms-note">
                  {t('home.sky.approxNote', lang)}
                </p>
              )}
            </>
          ) : (
            <p className="ms-body">
              {t('home.sky.noHours', lang)}
            </p>
          )}
          <p className="text-xs text-[var(--gold)] font-medium">{t('home.sky.seeHours', lang)}</p>
        </div>

        {/* Moon phase */}
        <div
          onClick={() => router.navigate('tools-moon')}
          className="ms-card ms-card-hover ms-live-card p-5 cursor-pointer space-y-2"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') router.navigate('tools-moon');
          }}
        >
          <p className="ms-label">{t('home.sky.moon', lang)}</p>
          <p className="font-display font-semibold text-xl text-[var(--text-main)] leading-snug">
            {phaseName}
          </p>
          <p className="ms-body">
            {tf('home.sky.moonLit', lang, {
              n: Math.round(moon.illumination * 100),
              day: moon.lunarDay,
            })}
          </p>
          <p className="text-xs text-[var(--gold)] font-medium">{t('home.sky.seeMoon', lang)}</p>
        </div>

        {/* Lunar mansion now */}
        <div
          onClick={() => router.navigate('tools-mansions')}
          className="ms-card ms-card-hover ms-live-card p-5 cursor-pointer space-y-2"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') router.navigate('tools-mansions');
          }}
        >
          <p className="ms-label">{t('home.sky.mansion', lang)}</p>
          <p className="font-display font-semibold text-xl text-[var(--text-main)] leading-snug">
            {mansion.name}
          </p>
          <p className="ms-body">
            {tf('home.sky.mansionOf', lang, {
              n: mansion.index + 1,
              from: mansion.startDeg.toFixed(1),
              to: mansion.endDeg.toFixed(1),
            })}
          </p>
          <p className="ms-note">
            {t('home.sky.mansionNote', lang)}
          </p>
          <p className="text-xs text-[var(--gold)] font-medium">{t('home.sky.seeMansions', lang)}</p>
        </div>
      </div>
    </section>
  );
};
