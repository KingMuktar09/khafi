import { describe, it, expect } from 'vitest';
import { CHALDEAN_ORDER } from '../src/data/planets';
import {
  getApproximateHours,
  getPlanetaryHours,
  getSunTimes,
  getZoneOffsetMinutes,
  type GeoLocation,
} from '../src/utils/astronomy';

const LONDON: GeoLocation = {
  lat: 51.5074,
  lon: -0.1278,
  label: 'London',
  timeZone: 'Europe/London',
};

const TROMSO: GeoLocation = {
  lat: 69.65,
  lon: 18.96,
  label: 'Tromsø',
  timeZone: 'Europe/Oslo',
};

describe('getPlanetaryHours — London, Wednesday 18 Nov 2026', () => {
  it('gives 24 hours with Wednesday ruled by Mercury', () => {
    const day = getPlanetaryHours(new Date('2026-11-18T12:00:00Z'), LONDON);
    expect(day).not.toBeNull();
    expect(day!.dayRuler).toBe('mercury');
    expect(day!.hours).toHaveLength(24);
    expect(day!.approximate).toBe(false);
    expect(day!.location).toBe(LONDON);
    expect(day!.timeZone).toBe('Europe/London');
    expect(day!.dateLabel).toContain('18 November 2026');
  });

  it('first hour is the day ruler and rulers cycle the Chaldean order', () => {
    const day = getPlanetaryHours(new Date('2026-11-18T12:00:00Z'), LONDON)!;
    expect(day.hours[0].ruler).toBe('mercury');
    expect(day.hours[0].isDay).toBe(true);
    expect(day.hours[11].isDay).toBe(true);
    expect(day.hours[12].isDay).toBe(false);
    expect(day.hours[23].isDay).toBe(false);
    for (let i = 0; i < 24; i++) {
      const expected =
        CHALDEAN_ORDER[(CHALDEAN_ORDER.indexOf('mercury') + i) % 7];
      expect(day.hours[i].ruler).toBe(expected);
    }
  });

  it('day hours are equal and sum to the day length; night hours sum to the night length', () => {
    const day = getPlanetaryHours(new Date('2026-11-18T12:00:00Z'), LONDON)!;
    const times = getSunTimes(new Date('2026-11-18T12:00:00Z'), LONDON);
    const dayLength = times.sunset!.getTime() - times.sunrise!.getTime();
    const nightLength =
      times.nextSunrise!.getTime() - times.sunset!.getTime();
    const dayHours = day.hours.slice(0, 12);
    const nightHours = day.hours.slice(12);
    const dayLen0 = dayHours[0].end.getTime() - dayHours[0].start.getTime();
    for (const h of dayHours) {
      // Hour boundaries are floating-point divisions of the day length,
      // so allow 1 ms of rounding.
      expect(Math.abs(h.end.getTime() - h.start.getTime() - dayLen0)).toBeLessThanOrEqual(1);
    }
    const nightLen0 = nightHours[0].end.getTime() - nightHours[0].start.getTime();
    for (const h of nightHours) {
      expect(Math.abs(h.end.getTime() - h.start.getTime() - nightLen0)).toBeLessThanOrEqual(1);
    }
    const daySum = dayHours.reduce(
      (s, h) => s + (h.end.getTime() - h.start.getTime()),
      0,
    );
    const nightSum = nightHours.reduce(
      (s, h) => s + (h.end.getTime() - h.start.getTime()),
      0,
    );
    expect(Math.abs(daySum - dayLength)).toBeLessThan(1000);
    expect(Math.abs(nightSum - nightLength)).toBeLessThan(1000);
    // Hours join up with no gaps: each hour starts where the last ended.
    for (let i = 1; i < 24; i++) {
      expect(day.hours[i].start.getTime()).toBe(day.hours[i - 1].end.getTime());
    }
  });

  it('the current hour contains the instant asked about', () => {
    const at = new Date('2026-11-18T12:00:00Z');
    const day = getPlanetaryHours(at, LONDON)!;
    const current = day.hours[day.currentIndex];
    expect(at.getTime()).toBeGreaterThanOrEqual(current.start.getTime());
    expect(at.getTime()).toBeLessThan(current.end.getTime());
    expect(current.isDay).toBe(true);
  });
});

describe('DST — Europe/London', () => {
  it('summer is UTC+1 and winter is UTC+0', () => {
    expect(getZoneOffsetMinutes(new Date('2026-07-18T12:00:00Z'), 'Europe/London')).toBe(60);
    expect(getZoneOffsetMinutes(new Date('2026-01-18T12:00:00Z'), 'Europe/London')).toBe(0);
  });

  it('the DST transition day (29 Mar 2026) still yields 24 hours with no crash', () => {
    // Clocks go forward 01:00 UTC on 29 Mar 2026.
    const day = getPlanetaryHours(new Date('2026-03-29T12:00:00Z'), LONDON);
    expect(day).not.toBeNull();
    expect(day!.hours).toHaveLength(24);
    expect(day!.currentIndex).toBeGreaterThanOrEqual(0);
    expect(day!.currentIndex).toBeLessThan(24);
    const times = getSunTimes(new Date('2026-03-29T12:00:00Z'), LONDON);
    expect(times.sunrise).not.toBeNull();
    expect(times.sunset).not.toBeNull();
  });
});

describe('midnight boundaries — the night belongs to the day that started it', () => {
  it('just before and just after midnight share the same night hours', () => {
    const before = getPlanetaryHours(new Date('2026-11-18T23:30:00Z'), LONDON)!;
    const after = getPlanetaryHours(new Date('2026-11-19T00:30:00Z'), LONDON)!;
    expect(before.dayRuler).toBe('mercury');
    expect(after.dayRuler).toBe('mercury');
    expect(after.hours[0].start.getTime()).toBe(before.hours[0].start.getTime());
    expect(after.hours[23].end.getTime()).toBe(before.hours[23].end.getTime());
    expect(before.currentIndex).toBeGreaterThanOrEqual(12);
    expect(after.currentIndex).toBeGreaterThanOrEqual(12);
  });

  it('an instant before sunrise uses the previous day’s ruler', () => {
    // 06:00 UTC on Thu 19 Nov is before sunrise (about 07:25) —
    // still Wednesday’s day, ruled by Mercury.
    const beforeSunrise = getPlanetaryHours(new Date('2026-11-19T06:00:00Z'), LONDON)!;
    expect(beforeSunrise.dayRuler).toBe('mercury');
    // After sunrise the new day starts, ruled by Jupiter (Thursday).
    const afterSunrise = getPlanetaryHours(new Date('2026-11-19T08:00:00Z'), LONDON)!;
    expect(afterSunrise.dayRuler).toBe('jupiter');
    expect(afterSunrise.hours[0].ruler).toBe('jupiter');
  });
});

describe('polar day/night — Tromsø (69.65°N)', () => {
  it('midnight sun in June: no hours, reason says the Sun does not set', () => {
    const times = getSunTimes(new Date('2026-06-21T12:00:00Z'), TROMSO);
    expect(times.sunrise).toBeNull();
    expect(times.sunset).toBeNull();
    expect(times.unavailableReason).toContain('does not set');
    expect(getPlanetaryHours(new Date('2026-06-21T12:00:00Z'), TROMSO)).toBeNull();
  });

  it('polar night in December: no hours, reason says the Sun does not rise', () => {
    const times = getSunTimes(new Date('2026-12-21T12:00:00Z'), TROMSO);
    expect(times.sunrise).toBeNull();
    expect(times.sunset).toBeNull();
    expect(times.unavailableReason).toContain('does not rise');
    expect(getPlanetaryHours(new Date('2026-12-21T12:00:00Z'), TROMSO)).toBeNull();
  });
});

describe('getApproximateHours — fixed 06:00–18:00 fallback', () => {
  it('is flagged approximate with 06:00 day hours and 12-hour halves', () => {
    const at = new Date('2026-11-18T12:00:00Z');
    const day = getApproximateHours(at, 'Asia/Kolkata');
    expect(day.approximate).toBe(true);
    expect(day.note).toBe('approximate, not real hours');
    expect(day.location).toBeNull();
    expect(day.timeZone).toBe('Asia/Kolkata');
    expect(day.hours).toHaveLength(24);
    // 06:00 and 18:00 local (Kolkata is UTC+5:30).
    expect(day.hours[0].start.toISOString()).toBe('2026-11-18T00:30:00.000Z');
    expect(day.hours[11].end.toISOString()).toBe('2026-11-18T12:30:00.000Z');
    const dayLen = day.hours[0].end.getTime() - day.hours[0].start.getTime();
    expect(dayLen).toBe(60 * 60 * 1000);
    const nightLen = day.hours[12].end.getTime() - day.hours[12].start.getTime();
    expect(nightLen).toBe(60 * 60 * 1000);
    // 18 Nov 2026 is a Wednesday, ruled by Mercury.
    expect(day.dayRuler).toBe('mercury');
    const current = day.hours[day.currentIndex];
    expect(at.getTime()).toBeGreaterThanOrEqual(current.start.getTime());
    expect(at.getTime()).toBeLessThan(current.end.getTime());
  });
});
