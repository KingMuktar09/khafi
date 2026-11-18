import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { greetingForHour } from '../src/utils/greeting';

/**
 * Home visuals: the big greeting, the live sky cards, and the reckon
 * box. The astronomy and abjad maths are covered by their own suites;
 * these tests check the greeting branches, the planet colours, and
 * that the Home page wires the new pieces in with plain words.
 */

function readSource(relPath: string): string {
  return readFileSync(join(process.cwd(), relPath), 'utf8');
}

describe('greetingForHour', () => {
  it('says good morning from 5 to 12', () => {
    expect(greetingForHour(5)).toBe('Good morning');
    expect(greetingForHour(11)).toBe('Good morning');
  });

  it('says good afternoon from 12 to 17', () => {
    expect(greetingForHour(12)).toBe('Good afternoon');
    expect(greetingForHour(16)).toBe('Good afternoon');
  });

  it('says good evening from 17 through the night', () => {
    expect(greetingForHour(17)).toBe('Good evening');
    expect(greetingForHour(23)).toBe('Good evening');
    expect(greetingForHour(0)).toBe('Good evening');
    expect(greetingForHour(4)).toBe('Good evening');
  });
});

describe('Home sky cards', () => {
  it('has a colour for every one of the seven planets', () => {
    const cards = readSource('src/components/special/HomeSkyCards.tsx');
    for (const [planet, colour] of Object.entries({
      saturn: '#8b7fb8',
      jupiter: '#5f8fe8',
      mars: '#e86a52',
      sun: '#e8b84f',
      venus: '#5fc98f',
      mercury: '#b58fe8',
      moon: '#c9d2e0',
    })) {
      expect(cards, `missing colour for ${planet}`).toContain(`${planet}: '${colour}'`);
    }
  });

  it('the cards use the live astronomy data and label the fallback honestly', () => {
    const cards = readSource('src/components/special/HomeSkyCards.tsx');
    expect(cards).toContain('getPlanetaryHours');
    expect(cards).toContain('getApproximateHours');
    expect(cards).toContain('getMoonInfo');
    expect(cards).toContain('getMansion');
    expect(cards).toContain('Approximate, not real hours');
    expect(cards).toContain('28 equal parts from 0° al-Sharatayn, a stated convention');
    expect(cards).toContain('ms-live-card');
  });
});

describe('Home reckon box', () => {
  it('reckons live with the site abjad code, Kabir Mashriqi', () => {
    const box = readSource('src/components/special/HomeReckonBox.tsx');
    expect(box).toContain('valueOfText');
    expect(box).toContain("valueOfText(name, 'kabir', 'mashriqi')");
    expect(box).toContain('Kabir values, Mashriqi school');
    expect(box).toContain('tools-huruf');
  });
});

describe('Home page wires the visuals in', () => {
  it('shows the greeting, the sky cards, and the reckon box after the hero', () => {
    const home = readSource('src/views/HomeView.tsx');
    expect(home).toContain('greetingForHour');
    expect(home).toContain('ms-greeting');
    expect(home).toContain('<HomeSkyCards />');
    expect(home).toContain('<HomeReckonBox />');
  });
});

describe('No em dashes in the Home visuals files', () => {
  it('greeting.ts, HomeSkyCards.tsx and HomeReckonBox.tsx contain no em dash', () => {
    for (const file of [
      'src/utils/greeting.ts',
      'src/components/special/HomeSkyCards.tsx',
      'src/components/special/HomeReckonBox.tsx',
    ]) {
      const text = readSource(file);
      expect(text, `${file} must not contain an em dash`).not.toContain('\u2014');
    }
  });
});
