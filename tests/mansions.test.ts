import { describe, it, expect } from 'vitest';
import { getMansion, getMoonLongitude } from '../src/utils/astronomy';
import { MANSIONS, MANSION_SIZE_DEG } from '../src/data/mansions';

describe('getMansion — boundaries', () => {
  it('longitude 0 is al-Sharatayn', () => {
    expect(getMansion(0).name).toBe('al-Sharatayn');
    expect(getMansion(0).index).toBe(0);
  });

  it('just past the first boundary is al-Butayn', () => {
    // One mansion is 360/28 = 12.857142… degrees. Note: 12.857° itself
    // is a hair BELOW the true boundary (it is the rounded value), so
    // the test uses the exact boundary and 12.86° instead.
    expect(getMansion(MANSION_SIZE_DEG).name).toBe('al-Butayn');
    expect(getMansion(12.86).name).toBe('al-Butayn');
    expect(getMansion(12.857).name).toBe('al-Sharatayn');
  });

  it('359.9° is the last mansion, Batn al-Hut', () => {
    const last = getMansion(359.9);
    expect(last.index).toBe(27);
    expect(last.alternateName).toBe('Batn al-Hut');
  });

  it('negative longitudes wrap around', () => {
    expect(getMansion(-1).index).toBe(27);
    expect(getMansion(360).name).toBe('al-Sharatayn');
  });

  it('a start offset shifts the mapping', () => {
    // With the start moved 10° forward, 0° now falls in the last
    // mansion and 10° is the new al-Sharatayn.
    expect(getMansion(0, 10).index).toBe(27);
    expect(getMansion(10, 10).name).toBe('al-Sharatayn');
    expect(getMansion(22.857142857, 10).name).toBe('al-Butayn');
  });
});

describe('MANSIONS data — 28 contiguous, NFC, verified names', () => {
  it('has 28 entries with contiguous degree slices', () => {
    expect(MANSIONS).toHaveLength(28);
    MANSIONS.forEach((m, i) => {
      expect(m.index).toBe(i);
      expect(m.startDeg).toBeCloseTo(i * MANSION_SIZE_DEG, 9);
      expect(m.endDeg).toBeCloseTo((i + 1) * MANSION_SIZE_DEG, 9);
    });
    expect(MANSIONS[27].endDeg).toBeCloseTo(360, 9);
  });

  it('names are unique and Arabic strings are canonical NFC', () => {
    const names = new Set(MANSIONS.map((m) => m.name));
    expect(names.size).toBe(28);
    for (const m of MANSIONS) {
      expect(m.arabic).toBe(m.arabic.normalize('NFC'));
      expect(m.arabic.length).toBeGreaterThan(0);
      if (m.alternateArabic) {
        expect(m.alternateArabic).toBe(m.alternateArabic.normalize('NFC'));
      }
    }
  });

  it('starts with al-Sharatayn and ends with al-Rasha’ / Batn al-Hut', () => {
    expect(MANSIONS[0].name).toBe('al-Sharatayn');
    expect(MANSIONS[27].name).toBe("al-Rasha'");
    expect(MANSIONS[27].alternateName).toBe('Batn al-Hut');
  });
});

describe('getMansion with the real Moon', () => {
  it('the Moon’s mansion on a known date is a valid entry', () => {
    const lon = getMoonLongitude(new Date('2026-11-18T12:00:00Z'));
    const mansion = getMansion(lon);
    expect(mansion.index).toBeGreaterThanOrEqual(0);
    expect(mansion.index).toBeLessThan(28);
    expect(lon).toBeGreaterThanOrEqual(mansion.startDeg);
    expect(lon).toBeLessThan(mansion.endDeg);
  });
});
