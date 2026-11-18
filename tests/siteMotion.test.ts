import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Site motion: restrained manuscript animation, CSS only.
 * These tests read src/index.css as text and check the motion system
 * is wired the way the design asks: pages fade up on open, cards lift
 * on hover only where a real hover exists, the live sky cards breathe
 * slowly, the home greeting carries a soft gold glow, and every bit of
 * it switches off under prefers-reduced-motion. No JavaScript
 * animation library is added for any of this.
 */

function readSource(relPath: string): string {
  return readFileSync(join(process.cwd(), relPath), 'utf8');
}

function blockFor(css: string, selector: string): string {
  const start = css.indexOf(selector);
  if (start === -1) return '';
  const open = css.indexOf('{', start);
  if (open === -1) return '';
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  return '';
}

describe('site motion', () => {
  const css = readSource('src/index.css');

  it('page entry fades in and rises a little', () => {
    const rule = blockFor(css, '.animate-fade-in');
    expect(rule).toContain('motion-fade-up');
  });

  it('the breathe keyframe is wired to the live sky cards, about 6 seconds', () => {
    expect(css).toContain('@keyframes motion-breathe');
    const rule = blockFor(css, '.ms-live-card');
    expect(rule).toContain('motion-breathe');
    expect(rule).toContain('6s');
    expect(rule).toContain('infinite');
  });

  it('the breathe pulse is gentle: a small scale change, not a jump', () => {
    const keyframe = blockFor(css, '@keyframes motion-breathe');
    expect(keyframe).toMatch(/1\.01[0-9]/);
    expect(keyframe).not.toMatch(/scale\(1\.0[5-9]|scale\(1\.[1-9]/);
  });

  it('the home greeting has a soft gold glow', () => {
    const rule = blockFor(css, '.ms-greeting');
    expect(rule).toContain('text-shadow');
    expect(rule).toContain('var(--gold)');
  });

  it('card lift only applies where a real hover exists', () => {
    const mediaAt = css.indexOf('@media (hover: hover) and (pointer: fine)');
    expect(mediaAt).toBeGreaterThan(-1);
    for (const hover of ['.motion-card:hover', '.card-lift:hover', '.ms-card-hover:hover']) {
      const at = css.indexOf(hover);
      expect(at, `${hover} missing`).toBeGreaterThan(-1);
      expect(at, `${hover} must sit inside the hover media query`).toBeGreaterThan(mediaAt);
    }
  });

  it('prefers-reduced-motion switches all of the motion off', () => {
    const mediaAt = css.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(mediaAt).toBeGreaterThan(-1);
    const block = blockFor(css.slice(mediaAt), '@media (prefers-reduced-motion: reduce)');
    expect(block).toContain('animation: none');
    expect(block).toContain('transition: none');
  });

  it('motion stays transform/opacity only: no layout property is animated', () => {
    const keyframes = css.match(/@keyframes motion-[a-z-]+ \{[\s\S]*?\n\}/g) ?? [];
    expect(keyframes.length).toBeGreaterThan(0);
    for (const frame of keyframes) {
      expect(frame).not.toMatch(/\b(width|height|margin|padding|top|left|right|bottom)\s*:/);
    }
  });

  it('no new JavaScript animation dependency is added', () => {
    const pkg = JSON.parse(readSource('package.json')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const lib of ['framer-motion', 'gsap', '@gsap/react', 'animejs', 'lottie-web', 'react-spring', '@react-spring/web', 'popmotion']) {
      expect(all, `${lib} must not be added`).not.toHaveProperty(lib);
    }
  });
});
