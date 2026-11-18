import React, { useMemo, useState } from 'react';
import {
  clearLocation,
  formatInZone,
  getApproximateHours,
  getPlanetaryHours,
  getSavedLocation,
  getSunTimes,
  saveLocation,
  type DayHours,
  type GeoLocation,
} from '../../utils/astronomy';
import { CITIES } from '../../data/cities';
import { planetById } from '../../data/planets';
import { appState } from '../../state/appState';
import { localizePlanetName, localizeSunReason, tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * Planetary Hours — the full 24-hour table for the current day.
 * Day hours are sunrise to sunset divided by 12; night hours are
 * sunset to next sunrise divided by 12, so the hours are unequal.
 * No location set: a fixed 06:00–18:00 split, labelled clearly as
 * approximate, not real hours. Polar day/night: unavailable, with
 * the reason — hours are never invented.
 */
export const HoursView: React.FC = () => {
  const lang = appState.settings.language;
  const [now] = useState(() => new Date());
  const [location, setLocation] = useState<GeoLocation | null>(() => getSavedLocation());
  // The picker shows the saved city when the saved location is one of the
  // bundled cities (otherwise it shows "Choose a city…", as before).
  const [cityName, setCityName] = useState(() => {
    const saved = getSavedLocation();
    if (!saved) return '';
    const match = CITIES.find((c) => c.lat === saved.lat && c.lon === saved.lon);
    return match ? match.name : '';
  });
  const [latInput, setLatInput] = useState('');
  const [lonInput, setLonInput] = useState('');
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  const deviceZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const dayHours: DayHours | null = useMemo(() => {
    if (!location) return getApproximateHours(now);
    return getPlanetaryHours(now, location);
  }, [now, location]);

  const sunTimes = useMemo(() => {
    if (!location) return null;
    return getSunTimes(now, location);
  }, [now, location]);

  const timeZone = dayHours ? dayHours.timeZone : deviceZone;

  const applyLocation = (loc: GeoLocation): void => {
    if (saveLocation(loc)) {
      setLocation(loc);
      setGeoMessage(tfTools('tools.hours.geoSaved', lang, { label: loc.label }));
    } else {
      setGeoMessage(tTools('tools.hours.geoInvalid', lang));
    }
  };

  const pickCity = (name: string): void => {
    setCityName(name);
    const city = CITIES.find((c) => c.name === name);
    if (!city) return;
    applyLocation({ lat: city.lat, lon: city.lon, label: `${city.name}, ${city.country}`, timeZone: city.timeZone });
  };

  const saveManual = (): void => {
    const lat = Number(latInput);
    const lon = Number(lonInput);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setGeoMessage(tTools('tools.hours.geoTypeNumbers', lang));
      return;
    }
    applyLocation({ lat, lon, label: tfTools('tools.hours.geoManual', lang, { lat, lon }), timeZone: deviceZone });
  };

  const useMyLocation = (): void => {
    if (!navigator.geolocation) {
      setGeoMessage(tTools('tools.hours.geoNoGeo', lang));
      return;
    }
    setGeoMessage(tTools('tools.hours.geoAsking', lang));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          label: tfTools('tools.hours.geoMyLocation', lang, { lat: position.coords.latitude.toFixed(2), lon: position.coords.longitude.toFixed(2) }),
          timeZone: deviceZone,
        });
      },
      () => {
        setGeoMessage(tTools('tools.hours.geoNotShared', lang));
      },
    );
  };

  const clear = (): void => {
    clearLocation();
    setLocation(null);
    setCityName('');
    setGeoMessage(tTools('tools.hours.geoCleared', lang));
  };

  return (
    <ToolsLayout
      title={tTools('tools.hours.title', lang)}
      eyebrow={tTools('tools.hours.eyebrow', lang)}
      subtitle={tTools('tools.hours.subtitle', lang)}
    >
      <section className="ms-card space-y-4">
        <h2 className="ms-h2">{tTools('tools.hours.locationTitle', lang)}</h2>
        <p className="ms-body">
          {location
            ? tfTools('tools.hours.usingLocation', lang, { label: location.label, lat: location.lat, lon: location.lon, tz: location.timeZone })
            : tTools('tools.hours.noLocation', lang)}
        </p>
        <div className="space-y-1.5">
          <label className="ms-label" htmlFor="hours-city">
            {tTools('tools.hours.pickCity', lang)}
          </label>
          <select
            id="hours-city"
            className="ms-field w-full"
            value={cityName}
            onChange={(event) => pickCity(event.target.value)}
          >
            <option value="">{tTools('tools.hours.chooseCity', lang)}</option>
            {CITIES.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}, {city.country}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="ms-label" htmlFor="hours-lat">
              {tTools('tools.hours.lat', lang)}
            </label>
            <input
              id="hours-lat"
              type="number"
              inputMode="decimal"
              className="ms-field ms-num w-full"
              placeholder="22.98"
              value={latInput}
              onChange={(event) => setLatInput(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="ms-label" htmlFor="hours-lon">
              {tTools('tools.hours.lon', lang)}
            </label>
            <input
              id="hours-lon"
              type="number"
              inputMode="decimal"
              className="ms-field ms-num w-full"
              placeholder="88.44"
              value={lonInput}
              onChange={(event) => setLonInput(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="ms-btn-gold" onClick={saveManual}>
            {tTools('tools.hours.useLatLon', lang)}
          </button>
          <button type="button" className="ms-btn" onClick={useMyLocation}>
            {tTools('tools.hours.useMyLocation', lang)}
          </button>
          <button type="button" className="ms-btn" onClick={clear} disabled={!location}>
            {tTools('tools.hours.clearLocation', lang)}
          </button>
        </div>
        {geoMessage ? <p className="ms-note">{geoMessage}</p> : null}
        <p className="ms-note">
          {tTools('tools.hours.privacyNote', lang)}
        </p>
      </section>

      {dayHours ? (
        <>
          <section className="ms-card space-y-3">
            <h2 className="ms-h2">{dayHours.dateLabel}</h2>
            <p className="ms-body">
              {tTools('tools.hours.dayRuler', lang)} <span className="ms-ink font-medium">{localizePlanetName(dayHours.dayRuler, planetById(dayHours.dayRuler).name, lang)}</span>{' '}
              <span className="ms-arabic-sm" dir="rtl" lang="ar">
                {planetById(dayHours.dayRuler).arabic}
              </span>{' '}
              <span className="ms-muted">({planetById(dayHours.dayRuler).transliteration})</span>
            </p>
            {sunTimes && sunTimes.sunrise && sunTimes.sunset ? (
              <p className="ms-body ms-num">
                {tTools('tools.hours.sunrise', lang)} {formatInZone(sunTimes.sunrise, timeZone)} · {tTools('tools.hours.sunset', lang)}{' '}
                {formatInZone(sunTimes.sunset, timeZone)} ({timeZone})
              </p>
            ) : null}
            {dayHours.approximate ? (
              <p className="ms-note-box">
                {tfTools('tools.hours.approxBox', lang, { tz: timeZone })}
              </p>
            ) : (
              <p className="ms-note">
                {tTools('tools.hours.realNote', lang)}
              </p>
            )}
          </section>

          <section className="ms-surface ms-table-wrap">
            <table className="ms-table">
              <thead>
                <tr className="text-left">
                  <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.hours.thHour', lang)}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.hours.thTime', lang)}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.hours.thRuler', lang)}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{tTools('tools.hours.thDayNight', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {dayHours.hours.map((hour, i) => {
                  const ruler = planetById(hour.ruler);
                  const isCurrent = i === dayHours.currentIndex;
                  return (
                    <tr key={hour.index} style={isCurrent ? { background: 'rgba(232, 184, 79, 0.10)' } : undefined}>
                      <td className="px-4 py-2.5 ms-num">
                        {hour.index + 1}
                        {isCurrent ? tTools('tools.hours.nowSuffix', lang) : ''}
                      </td>
                      <td className="px-4 py-2.5 ms-num">
                        {formatInZone(hour.start, timeZone)} – {formatInZone(hour.end, timeZone)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="ms-ink">{localizePlanetName(ruler.id, ruler.name, lang)}</span>{' '}
                        <span className="ms-arabic-sm" dir="rtl" lang="ar">
                          {ruler.arabic}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 ms-body">{hour.isDay ? tTools('tools.common.day', lang) : tTools('tools.common.night', lang)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <p className="ms-note-box" role="alert">
          {tTools('tools.hours.unavailableTitle', lang)}{' '}
          {sunTimes && sunTimes.unavailableReason
            ? localizeSunReason(sunTimes.unavailableReason, lang)
            : tTools('tools.hours.unavailableDefault', lang)}{' '}
          {tTools('tools.hours.unavailableTail', lang)}
        </p>
      )}

      <p className="ms-note">
        {tTools('tools.hours.methodNote', lang)}
      </p>
    </ToolsLayout>
  );
};
