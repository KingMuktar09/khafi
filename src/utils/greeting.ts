import { t } from '../data/i18n';
import type { SiteLanguage } from '../types';

/**
 * A plain time-of-day greeting for the Home page hero.
 *
 * Computed from the visitor's own clock, nothing more. Three plain
 * branches: morning, afternoon, evening (evening covers the night
 * hours too, so the greeting is always a hello, never a goodbye).
 * The words come from the greeting.* keys, so the greeting follows
 * the Settings language; English is the default.
 */

/** Greeting for a 0-23 hour, in the given site language. */
export function greetingForHour(hour: number, lang: SiteLanguage = 'en'): string {
  if (hour >= 5 && hour < 12) return t('greeting.morning', lang);
  if (hour >= 12 && hour < 17) return t('greeting.afternoon', lang);
  return t('greeting.evening', lang);
}
