import { describe, it, expect } from 'vitest';
import {
  formatInZone,
  getHijri,
  getMoonInfo,
  getMoonLongitude,
  getSunLongitude,
  getSunTimes,
  type GeoLocation,
} from '../src/utils/astronomy';

const LONDON: GeoLocation = {
  lat: 51.5074,
  lon: -0.1278,
  label: 'London',
  timeZone: 'Europe/London',
};

/** Minutes between two instants. */
function minutesBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / 60000;
}

describe('getSunTimes — external anchor (timeanddate.com)', () => {
  it('matches London sunrise/sunset on 18 Nov 2026 within 5 minutes', () => {
    // timeanddate.com, Greater London, 18 Nov 2026: sunrise 7:23 am,
    // sunset 4:07 pm local (GMT). Our engine must agree closely.
    const times = getSunTimes(new Date('2026-11-18T12:00:00Z'), LONDON);
    expect(times.sunrise).not.toBeNull();
    expect(times.sunset).not.toBeNull();
    expect(times.unavailableReason).toBeUndefined();
    expect(minutesBetween(times.sunrise!, new Date('2026-11-18T07:23:00Z'))).toBeLessThan(5);
    expect(minutesBetween(times.sunset!, new Date('2026-11-18T16:07:00Z'))).toBeLessThan(5);
    expect(times.sunrise!.getTime()).toBeLessThan(times.sunset!.getTime());
    expect(times.nextSunrise).not.toBeNull();
    expect(times.nextSunrise!.getTime()).toBeGreaterThan(times.sunset!.getTime());
  });
});

describe('getSunTimes — internal consistency', () => {
  it('sunrise is before sunset and next sunrise is the next day', () => {
    const times = getSunTimes(new Date('2026-06-15T12:00:00Z'), LONDON);
    expect(times.sunrise).not.toBeNull();
    expect(times.sunset).not.toBeNull();
    expect(times.nextSunrise).not.toBeNull();
    // Next sunrise is roughly a day after this sunrise.
    const gapHours =
      (times.nextSunrise!.getTime() - times.sunrise!.getTime()) / 3600000;
    expect(gapHours).toBeGreaterThan(20);
    expect(gapHours).toBeLessThan(28);
  });
});

describe('formatInZone', () => {
  it('formats the same instant in different IANA zones', () => {
    const instant = new Date('2026-11-18T07:23:31Z');
    expect(formatInZone(instant, 'Europe/London')).toBe('07:23');
    expect(formatInZone(instant, 'Asia/Kolkata')).toBe('12:53');
    expect(formatInZone(instant, 'America/New_York')).toBe('02:23');
  });
});

describe('getMoonInfo — known new moon and full moon', () => {
  // timeanddate.com moon phases 2026 (India local times, converted):
  // new moon 9 Nov 2026, 12:32 IST = 07:02 UTC;
  // full moon 24 Nov 2026, 20:23 IST = 14:53 UTC.
  it('new moon gives a phase angle near 0 and almost no light', () => {
    const info = getMoonInfo(new Date('2026-11-09T07:02:00Z'));
    const angleFromNew = Math.min(info.phaseAngle, 360 - info.phaseAngle);
    expect(angleFromNew).toBeLessThan(8);
    expect(info.illumination).toBeLessThan(0.05);
    expect(info.phaseName).toBe('New Moon');
  });

  it('full moon gives a phase angle near 180 and almost full light', () => {
    const info = getMoonInfo(new Date('2026-11-24T14:53:00Z'));
    expect(Math.abs(info.phaseAngle - 180)).toBeLessThan(8);
    expect(info.illumination).toBeGreaterThan(0.95);
    expect(info.phaseName).toBe('Full Moon');
    expect(info.lunarDay).toBe(15);
  });

  it('a few hours after new moon is lunar day 1', () => {
    const info = getMoonInfo(new Date('2026-11-09T13:02:00Z'));
    expect(info.lunarDay).toBe(1);
  });

  it('states its method', () => {
    const info = getMoonInfo(new Date('2026-11-18T12:00:00Z'));
    expect(info.method).toContain('29.53');
  });
});

describe('getMoonLongitude', () => {
  it('returns a finite longitude in 0–360', () => {
    const lon = getMoonLongitude(new Date('2026-11-18T12:00:00Z'));
    expect(Number.isFinite(lon)).toBe(true);
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });
});

describe('getSunLongitude', () => {
  it('returns the Sun’s ecliptic longitude for known dates', () => {
    // Verified against Astronomy Engine SunPosition directly:
    // 18 Nov 2026 noon UTC → 236.16° (Scorpio), 21 Jun 2026 → 90.14°.
    expect(getSunLongitude(new Date('2026-11-18T12:00:00Z'))).toBeCloseTo(236.16, 0);
    expect(getSunLongitude(new Date('2026-06-21T12:00:00Z'))).toBeCloseTo(90.14, 0);
  });

  it('returns a finite longitude in 0–360', () => {
    const lon = getSunLongitude(new Date('2026-12-21T12:00:00Z'));
    expect(Number.isFinite(lon)).toBe(true);
    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });
});

describe('getHijri — approximate civil date', () => {
  it('returns a Hijri date in the expected shape for a known Gregorian date', () => {
    const hijri = getHijri(new Date('2026-11-18T12:00:00Z'));
    // Civil-calendar year for Nov 2026 is 1448 AH. The exact day is
    // NOT asserted: real months depend on moon sighting.
    expect(hijri.year).toBe(1448);
    expect(hijri.month).toBeGreaterThanOrEqual(1);
    expect(hijri.month).toBeLessThanOrEqual(12);
    expect(hijri.day).toBeGreaterThanOrEqual(1);
    expect(hijri.day).toBeLessThanOrEqual(30);
    expect(hijri.formatted).toContain('1448 AH');
    expect(hijri.approximate).toBe(true);
    expect(hijri.method).toContain('Kuwaiti');
    expect(hijri.note).toContain('moon sighting');
  });
});
