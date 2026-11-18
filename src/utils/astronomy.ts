/**
 * Time engine for the study tools — Phase 2.
 *
 * Pure logic, no React. All astronomy comes from the maintained
 * `astronomy-engine` library — no hand-written astronomy formulas.
 * All instant maths is done in UTC; an IANA time zone is used only
 * for display (and for deciding which local day an instant falls on).
 *
 * Study-only: these functions calculate sunrise, sunset, planetary
 * hours, moon phase, lunar mansions and an approximate Hijri date.
 * They promise no outcomes. There are no prayer times here.
 * No location is ever sent anywhere — a saved location lives in
 * localStorage on this device only.
 *
 * Planetary hours follow the sunrise convention (see Wikipedia,
 * "Planetary hours"): the day starts at the most recent sunrise, so
 * an instant before sunrise belongs to the previous day, whose ruler
 * still applies. Day hours = sunrise to sunset / 12; night hours =
 * sunset to next sunrise / 12. (Vettius Valens used a sunset start;
 * this build uses the modern sunrise start, as the brief requires.)
 */

import * as Astronomy from 'astronomy-engine';

import { MANSIONS, MANSION_SIZE_DEG, type MansionEntry } from '../data/mansions';
import { CHALDEAN_ORDER, DAY_RULERS, type PlanetId } from '../data/planets';

export type { PlanetId } from '../data/planets';

/** A place on Earth, with the IANA zone used to display its times. */
export interface GeoLocation {
  lat: number;
  lon: number;
  label: string;
  timeZone: string;
}

export interface SunTimes {
  /** First sunrise inside the local calendar day, or null. */
  sunrise: Date | null;
  /** First sunset inside the local calendar day, or null. */
  sunset: Date | null;
  /** The next sunrise after this day's sunrise/sunset, or null. */
  nextSunrise: Date | null;
  /** Plain-words reason when sunrise or sunset is missing. */
  unavailableReason?: string;
}

export interface PlanetaryHour {
  /** 0–23 (0–11 day hours, 12–23 night hours). */
  index: number;
  start: Date;
  end: Date;
  ruler: PlanetId;
  isDay: boolean;
}

export interface DayHours {
  /** e.g. "Wednesday, 18 November 2026" (in the location's zone). */
  dateLabel: string;
  /** Planet ruling the first hour of this day. */
  dayRuler: PlanetId;
  /** All 24 hours, sunrise to next sunrise. */
  hours: PlanetaryHour[];
  /** Index of the hour containing the instant asked about. */
  currentIndex: number;
  /** Null for approximate hours (no location). */
  location: GeoLocation | null;
  timeZone: string;
  /** True when the hours are the fixed 06:00–18:00 fallback. */
  approximate: boolean;
  /** Human-readable note, e.g. "approximate, not real hours". */
  note?: string;
}

export interface MoonInfo {
  /** Phase angle in degrees (0 = new moon, 180 = full moon). */
  phaseAngle: number;
  /** Illuminated fraction, 0–1. */
  illumination: number;
  /** Day of the lunar month, 1–30. */
  lunarDay: number;
  /** e.g. "Waxing Crescent". */
  phaseName: string;
  /** How the numbers were worked out. */
  method: string;
}

export interface HijriDate {
  /** e.g. "9 Jumada II, 1448 AH". */
  formatted: string;
  day: number;
  month: number;
  year: number;
  monthName: string;
  /** How the date was worked out. */
  method: string;
  /** Sighting caveat. */
  note: string;
  /** Always true: this is the civil calendar, not a sighted date. */
  approximate: boolean;
}

// --- Time-zone helpers (Intl only; no external service) --------------------

interface DateParts {
  year: number;
  month: number;
  day: number;
}

function datePartsInZone(date: Date, timeZone: string): DateParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const get = (type: string): number => {
    const found = parts.find((p) => p.type === type);
    return found ? Number(found.value) : 0;
  };
  return { year: get('year'), month: get('month'), day: get('day') };
}

/**
 * Offset of an IANA zone at an instant, in milliseconds (local wall
 * time minus UTC). Uses an Intl round-trip, so DST is handled.
 */
export function getZoneOffsetMs(at: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);
  const get = (type: string): number => {
    const found = parts.find((p) => p.type === type);
    return found ? Number(found.value) : 0;
  };
  // Intl can report midnight as hour "24" of the previous day.
  let hour = get('hour');
  if (hour === 24) hour = 0;
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    hour,
    get('minute'),
    get('second'),
  );
  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
}

/** Offset of an IANA zone at an instant, in minutes. */
export function getZoneOffsetMinutes(at: Date, timeZone: string): number {
  return getZoneOffsetMs(at, timeZone) / 60000;
}

/** Midnight starting the local calendar day that `date` falls on. */
function localMidnight(date: Date, timeZone: string): Date {
  const { year, month, day } = datePartsInZone(date, timeZone);
  const guess = Date.UTC(year, month - 1, day);
  // Two passes: a DST change at midnight itself shifts the offset.
  const first = new Date(guess - getZoneOffsetMs(new Date(guess), timeZone));
  return new Date(guess - getZoneOffsetMs(first, timeZone));
}

/** A wall-clock time (year/month/day hour:minute) in an IANA zone. */
function wallTimeInZone(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const first = new Date(guess - getZoneOffsetMs(new Date(guess), timeZone));
  return new Date(guess - getZoneOffsetMs(first, timeZone));
}

/** JS weekday number (0 = Sunday) of an instant in an IANA zone. */
function weekdayInZone(date: Date, timeZone: string): number {
  const name = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
  }).format(date);
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const index = days.indexOf(name);
  if (index < 0) throw new Error(`Unknown weekday name: ${name}`);
  return index;
}

function dateLabelInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// --- Astronomy Engine wrappers --------------------------------------------

function observerOf(loc: GeoLocation): Astronomy.Observer {
  return new Astronomy.Observer(loc.lat, loc.lon, 0);
}

/**
 * First rise (+1) or set (-1) of the Sun at or after `from`.
 * Searches up to `limitDays` ahead. Null when the Sun does not rise
 * (or set) in that window — e.g. polar day/night.
 */
function firstEventAfter(
  direction: 1 | -1,
  from: Date,
  obs: Astronomy.Observer,
  limitDays = 3,
): Date | null {
  const found = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    obs,
    direction,
    new Astronomy.AstroTime(from),
    limitDays,
  );
  return found ? found.date : null;
}

/** All rises/sets of the Sun in (from, until], stepping event by event. */
function collectEvents(
  direction: 1 | -1,
  from: Date,
  until: Date,
  obs: Astronomy.Observer,
): Date[] {
  const out: Date[] = [];
  let cursor = from;
  for (let i = 0; i < 8; i++) {
    const next = firstEventAfter(direction, cursor, obs, 3);
    if (!next) break;
    if (next.getTime() > until.getTime()) break;
    out.push(next);
    cursor = new Date(next.getTime() + 60_000);
  }
  return out;
}

/** Most recent sunrise at or before `at` (looks back up to 3 days). */
function mostRecentSunrise(at: Date, obs: Astronomy.Observer): Date | null {
  const back = new Date(at.getTime() - 3 * 24 * 3600 * 1000);
  const rises = collectEvents(1, back, at, obs);
  return rises.length > 0 ? rises[rises.length - 1] : null;
}

/** Altitude of the Sun above the horizon, in degrees. */
function sunAltitudeAt(at: Date, obs: Astronomy.Observer): number {
  const time = new Astronomy.AstroTime(at);
  const eq = Astronomy.Equator(Astronomy.Body.Sun, time, obs, true, true);
  const hor = Astronomy.Horizon(time, obs, eq.ra, eq.dec, 'normal');
  return hor.altitude;
}

// --- Sun times ---------------------------------------------------------------

/**
 * Sunrise, sunset and next sunrise for the local calendar day that
 * `date` falls on, in the location's zone. When the Sun does not rise
 * or set that day (polar day/night, or a day that starts with the Sun
 * already up), the missing value is null and `unavailableReason`
 * says so in plain words — times are never invented.
 */
export function getSunTimes(date: Date, loc: GeoLocation): SunTimes {
  const obs = observerOf(loc);
  const startOfDay = localMidnight(date, loc.timeZone);
  const endOfDay = new Date(startOfDay.getTime() + 24 * 3600 * 1000);

  const rise = firstEventAfter(1, startOfDay, obs, 2);
  const set = firstEventAfter(-1, startOfDay, obs, 2);

  // Only events inside this calendar day count as "today's".
  const sunrise = rise && rise.getTime() < endOfDay.getTime() ? rise : null;
  const sunset = set && set.getTime() < endOfDay.getTime() ? set : null;

  let nextSunrise: Date | null;
  if (sunrise) {
    nextSunrise = firstEventAfter(1, new Date(sunrise.getTime() + 60_000), obs, 3);
  } else if (sunset) {
    nextSunrise = firstEventAfter(1, new Date(sunset.getTime() + 60_000), obs, 3);
  } else {
    nextSunrise = firstEventAfter(1, startOfDay, obs, 3);
  }

  let unavailableReason: string | undefined;
  if (!sunrise && !sunset) {
    const altitude = sunAltitudeAt(
      new Date(startOfDay.getTime() + 12 * 3600 * 1000),
      obs,
    );
    unavailableReason =
      altitude > 0
        ? 'The Sun does not set on this day (midnight sun) — there is no sunrise or sunset to divide into hours.'
        : 'The Sun does not rise on this day (polar night) — there is no sunrise or sunset to divide into hours.';
  } else if (!sunrise) {
    unavailableReason =
      'The Sun was already up at midnight, so there is no sunrise on this calendar day — it rose the day before.';
  } else if (!sunset) {
    unavailableReason =
      'The Sun rises today but does not set on this calendar day — it sets after midnight.';
  }

  return { sunrise, sunset, nextSunrise, unavailableReason };
}

// --- Planetary hours ---------------------------------------------------------

function buildHours(
  sunrise: Date,
  sunset: Date,
  nextSunrise: Date,
  dayRuler: PlanetId,
): PlanetaryHour[] {
  const startIndex = CHALDEAN_ORDER.indexOf(dayRuler);
  const hours: PlanetaryHour[] = [];
  const dayLength = sunset.getTime() - sunrise.getTime();
  const nightLength = nextSunrise.getTime() - sunset.getTime();
  for (let i = 0; i < 12; i++) {
    hours.push({
      index: i,
      start: new Date(sunrise.getTime() + (i * dayLength) / 12),
      end: new Date(sunrise.getTime() + ((i + 1) * dayLength) / 12),
      ruler: CHALDEAN_ORDER[(startIndex + i) % 7],
      isDay: true,
    });
  }
  for (let i = 0; i < 12; i++) {
    hours.push({
      index: 12 + i,
      start: new Date(sunset.getTime() + (i * nightLength) / 12),
      end: new Date(sunset.getTime() + ((i + 1) * nightLength) / 12),
      ruler: CHALDEAN_ORDER[(startIndex + 12 + i) % 7],
      isDay: false,
    });
  }
  return hours;
}

/**
 * The 24 planetary hours for the day that `date` (an instant) falls
 * in. The "day" starts at the most recent sunrise at or before the
 * instant — so an instant before sunrise belongs to the previous
 * day, with the previous day's ruler. The first hour's ruler is the
 * day ruler; after that the Chaldean order cycles.
 *
 * Returns null when the hours cannot be worked out — the Sun never
 * rose or never set around this instant (polar day/night). The caller
 * shows "unavailable" with the reason from getSunTimes; no hours are
 * invented.
 */
export function getPlanetaryHours(date: Date, loc: GeoLocation): DayHours | null {
  const obs = observerOf(loc);
  const lastSunrise = mostRecentSunrise(date, obs);
  if (!lastSunrise) return null;
  const sunset = firstEventAfter(-1, new Date(lastSunrise.getTime() + 60_000), obs, 3);
  if (!sunset) return null;
  const nextSunrise = firstEventAfter(1, new Date(lastSunrise.getTime() + 60_000), obs, 3);
  if (!nextSunrise || nextSunrise.getTime() <= sunset.getTime()) return null;

  const dayRuler = DAY_RULERS[weekdayInZone(lastSunrise, loc.timeZone)];
  const hours = buildHours(lastSunrise, sunset, nextSunrise, dayRuler);
  let currentIndex = hours.findIndex(
    (h) => date.getTime() >= h.start.getTime() && date.getTime() < h.end.getTime(),
  );
  if (currentIndex < 0) currentIndex = 23;

  return {
    dateLabel: dateLabelInZone(lastSunrise, loc.timeZone),
    dayRuler,
    hours,
    currentIndex,
    location: loc,
    timeZone: loc.timeZone,
    approximate: false,
  };
}

/**
 * Fallback hours when no location is set: a fixed 06:00–18:00 split
 * in the given zone (the device's local zone by default). Flagged
 * approximate — these are NOT real planetary hours, and the note
 * says so: "approximate, not real hours".
 */
export function getApproximateHours(date: Date, timeZone?: string): DayHours {
  const tz = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { year, month, day } = datePartsInZone(date, tz);
  const six = wallTimeInZone(year, month, day, 6, 0, tz);
  const eighteen = wallTimeInZone(year, month, day, 18, 0, tz);
  const nextSix = wallTimeInZone(year, month, day + 1, 6, 0, tz);
  const dayRuler = DAY_RULERS[weekdayInZone(date, tz)];
  const hours = buildHours(six, eighteen, nextSix, dayRuler);
  let currentIndex = hours.findIndex(
    (h) => date.getTime() >= h.start.getTime() && date.getTime() < h.end.getTime(),
  );
  if (currentIndex < 0) currentIndex = 23;

  return {
    dateLabel: dateLabelInZone(date, tz),
    dayRuler,
    hours,
    currentIndex,
    location: null,
    timeZone: tz,
    approximate: true,
    note: 'approximate, not real hours',
  };
}

// --- Moon --------------------------------------------------------------------

function phaseNameFor(angleDeg: number): string {
  if (angleDeg < 10 || angleDeg >= 350) return 'New Moon';
  if (angleDeg < 80) return 'Waxing Crescent';
  if (angleDeg < 100) return 'First Quarter';
  if (angleDeg < 170) return 'Waxing Gibbous';
  if (angleDeg < 190) return 'Full Moon';
  if (angleDeg < 260) return 'Waning Gibbous';
  if (angleDeg < 280) return 'Last Quarter';
  return 'Waning Crescent';
}

/**
 * Moon phase angle (0 = new moon, 180 = full moon), illuminated
 * fraction, and day of the lunar month. The lunar day is the phase
 * angle's share of a 29.53-day month, counted from 1.
 */
export function getMoonInfo(date: Date): MoonInfo {
  const phaseAngle = Astronomy.MoonPhase(date);
  const illumination = Astronomy.Illumination(
    Astronomy.Body.Moon,
    date,
  ).phase_fraction;
  const ageDays = (phaseAngle / 360) * 29.53;
  const lunarDay = Math.min(30, Math.floor(ageDays) + 1);
  return {
    phaseAngle,
    illumination,
    lunarDay,
    phaseName: phaseNameFor(phaseAngle),
    method: 'Astronomy Engine MoonPhase; lunar month 29.53 days',
  };
}

/** Ecliptic longitude of the Moon, in degrees (0–360). */
export function getMoonLongitude(date: Date): number {
  const lon = Astronomy.EclipticLongitude(Astronomy.Body.Moon, date);
  return ((lon % 360) + 360) % 360;
}

/**
 * The Sun's geocentric ecliptic longitude, 0–360.
 * NOTE: Astronomy Engine's EclipticLongitude() cannot be used for the
 * Sun — it throws "Cannot calculate heliocentric longitude of the Sun"
 * (the Sun is the centre). SunPosition() gives the geocentric ecliptic
 * longitude directly as `elon`.
 */
export function getSunLongitude(date: Date): number {
  const lon = Astronomy.SunPosition(date).elon;
  return ((lon % 360) + 360) % 360;
}

// --- Lunar mansions ----------------------------------------------------------

/**
 * The lunar mansion holding an ecliptic longitude.
 *
 * The 28-part division starting at 0° with al-Sharatayn is a
 * CONVENTION — `startOffsetDeg` moves the start point, so another
 * tradition's start can be used instead. The mansion list itself is
 * in src/data/mansions.ts, with its source recorded there.
 */
export function getMansion(
  longitudeDeg: number,
  startOffsetDeg = 0,
): MansionEntry {
  const norm = (((longitudeDeg - startOffsetDeg) % 360) + 360) % 360;
  // Tiny epsilon: a longitude that is exactly on a boundary can land a
  // hair below it through floating-point rounding (e.g. 360/28 itself).
  const index = Math.min(
    MANSIONS.length - 1,
    Math.floor(norm / MANSION_SIZE_DEG + 1e-9),
  );
  const found = MANSIONS[index];
  if (!found) throw new Error(`No mansion for longitude ${longitudeDeg}`);
  return found;
}

// --- Hijri date --------------------------------------------------------------

/**
 * Approximate Hijri date from the Islamic civil calendar (Kuwaiti
 * algorithm, via Intl). Real months depend on moon sighting and can
 * differ by a day or two — the returned note says so, and
 * `approximate` is always true.
 */
export function getHijri(date: Date): HijriDate {
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(date);
  const get = (type: string): number => {
    const found = parts.find((p) => p.type === type);
    return found ? Number(found.value) : 0;
  };
  const day = get('day');
  const month = get('month');
  const year = get('year');
  const monthName = new Intl.DateTimeFormat('en-u-ca-islamic', {
    month: 'long',
  }).format(date);
  return {
    formatted: `${day} ${monthName}, ${year} AH`,
    day,
    month,
    year,
    monthName,
    method: 'Islamic civil calendar (Intl, Kuwaiti algorithm)',
    note: 'Real months depend on moon sighting and can differ by a day or two.',
    approximate: true,
  };
}

// --- Formatting ----------------------------------------------------------------

/** Format a Date as HH:MM (24-hour) in an IANA zone. */
export function formatInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

// --- Saved location (device only) --------------------------------------------
// The generic storage helpers in src/utils/toolsStorage.ts are private
// to that file, and this task keeps new work in new files — so the
// tiny location helper lives here instead. Same rules as toolsStorage:
// localStorage on this device only, never sent anywhere.

export const LOCATION_STORAGE_KEY = 'ms-location';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidLocation(value: unknown): value is GeoLocation {
  if (!isRecord(value)) return false;
  return (
    typeof value.lat === 'number' &&
    Number.isFinite(value.lat) &&
    value.lat >= -90 &&
    value.lat <= 90 &&
    typeof value.lon === 'number' &&
    Number.isFinite(value.lon) &&
    value.lon >= -180 &&
    value.lon <= 180 &&
    typeof value.label === 'string' &&
    value.label.length > 0 &&
    typeof value.timeZone === 'string' &&
    value.timeZone.length > 0
  );
}

/** The saved location, or null when none is saved (or it is invalid). */
export function getSavedLocation(): GeoLocation | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidLocation(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Save a location on this device. Returns false when it is invalid. */
export function saveLocation(loc: GeoLocation): boolean {
  if (!isValidLocation(loc)) return false;
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
    return true;
  } catch {
    return false;
  }
}

/** Forget the saved location. */
export function clearLocation(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch {
    // Storage unavailable — nothing to clear.
  }
}
