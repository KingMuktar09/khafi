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
      setGeoMessage(`Location saved on this device: ${loc.label}.`);
    } else {
      setGeoMessage('That location is not valid. Latitude must be between -90 and 90, longitude between -180 and 180.');
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
      setGeoMessage('Type a number for latitude and a number for longitude.');
      return;
    }
    applyLocation({ lat, lon, label: `Manual (${lat}, ${lon})`, timeZone: deviceZone });
  };

  const useMyLocation = (): void => {
    if (!navigator.geolocation) {
      setGeoMessage('This browser does not offer geolocation.');
      return;
    }
    setGeoMessage('Asking for your location…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          label: `My location (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`,
          timeZone: deviceZone,
        });
      },
      () => {
        setGeoMessage('Location was not shared. Pick a city or type a latitude and longitude instead.');
      },
    );
  };

  const clear = (): void => {
    clearLocation();
    setLocation(null);
    setCityName('');
    setGeoMessage('Location cleared. Hours are now the approximate 06:00–18:00 split.');
  };

  return (
    <ToolsLayout
      title="Planetary Hours"
      eyebrow="Time & Heavens"
      subtitle="The 24 hours of the day, each ruled by a planet in Chaldean order. Day hours run sunrise to sunset, night hours sunset to next sunrise — so the hours are unequal."
    >
      <section className="ms-card space-y-4">
        <h2 className="ms-h2">Location</h2>
        <p className="ms-body">
          {location
            ? `Using ${location.label} (${location.lat}, ${location.lon}, ${location.timeZone}).`
            : 'No location is set. Hours below use the fixed 06:00–18:00 split — approximate, not real hours.'}
        </p>
        <div className="space-y-1.5">
          <label className="ms-label" htmlFor="hours-city">
            Pick a city
          </label>
          <select
            id="hours-city"
            className="ms-field w-full"
            value={cityName}
            onChange={(event) => pickCity(event.target.value)}
          >
            <option value="">Choose a city…</option>
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
              Latitude
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
              Longitude
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
            Use this latitude and longitude
          </button>
          <button type="button" className="ms-btn" onClick={useMyLocation}>
            Use my location
          </button>
          <button type="button" className="ms-btn" onClick={clear} disabled={!location}>
            Clear location
          </button>
        </div>
        {geoMessage ? <p className="ms-note">{geoMessage}</p> : null}
        <p className="ms-note">
          Your location is used on this device only to work out sunrise and sunset — it is never
          sent anywhere. “Use my location” asks your browser for it first; you can say no and pick
          a city or type coordinates instead. No external geocoding or timezone service is used.
        </p>
      </section>

      {dayHours ? (
        <>
          <section className="ms-card space-y-3">
            <h2 className="ms-h2">{dayHours.dateLabel}</h2>
            <p className="ms-body">
              Day ruler: <span className="ms-ink font-medium">{planetById(dayHours.dayRuler).name}</span>{' '}
              <span className="ms-arabic-sm" dir="rtl" lang="ar">
                {planetById(dayHours.dayRuler).arabic}
              </span>{' '}
              <span className="ms-muted">({planetById(dayHours.dayRuler).transliteration})</span>
            </p>
            {sunTimes && sunTimes.sunrise && sunTimes.sunset ? (
              <p className="ms-body ms-num">
                Sunrise {formatInZone(sunTimes.sunrise, timeZone)} · Sunset{' '}
                {formatInZone(sunTimes.sunset, timeZone)} ({timeZone})
              </p>
            ) : null}
            {dayHours.approximate ? (
              <p className="ms-note-box">
                Approximate, not real hours. No location is set, so this table uses a fixed
                06:00–18:00 split in {timeZone}. Set a location above for real hours.
              </p>
            ) : (
              <p className="ms-note">
                Hours are unequal: each day hour is one twelfth of sunrise to sunset, each night
                hour one twelfth of sunset to next sunrise. The day is counted from sunrise, so an
                instant before sunrise belongs to the previous day. Times are worked out with the
                Astronomy Engine library; the time zone is handled with Intl, so daylight saving is
                followed.
              </p>
            )}
          </section>

          <section className="ms-surface ms-table-wrap">
            <table className="ms-table">
              <thead>
                <tr className="text-left">
                  <th scope="col" className="px-4 py-3 font-medium">Hour</th>
                  <th scope="col" className="px-4 py-3 font-medium">Time</th>
                  <th scope="col" className="px-4 py-3 font-medium">Ruler</th>
                  <th scope="col" className="px-4 py-3 font-medium">Day / night</th>
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
                        {isCurrent ? ' — now' : ''}
                      </td>
                      <td className="px-4 py-2.5 ms-num">
                        {formatInZone(hour.start, timeZone)} – {formatInZone(hour.end, timeZone)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="ms-ink">{ruler.name}</span>{' '}
                        <span className="ms-arabic-sm" dir="rtl" lang="ar">
                          {ruler.arabic}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 ms-body">{hour.isDay ? 'Day' : 'Night'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <p className="ms-note-box" role="alert">
          Planetary hours are unavailable for this place and day:{' '}
          {sunTimes && sunTimes.unavailableReason
            ? sunTimes.unavailableReason
            : 'the Sun does not rise or set around now (polar day or night), so there is no sunrise or sunset to divide into hours.'}{' '}
          No hours are invented. Pick another place or day.
        </p>
      )}

      <p className="ms-note">
        Method: Astronomy Engine (SearchRiseSet for the Sun); the Chaldean order is Saturn, Jupiter,
        Mars, Sun, Venus, Mercury, Moon, and the first hour of the day is the day ruler. Source:
        Wikipedia, “Planetary hours”.
      </p>
    </ToolsLayout>
  );
};
