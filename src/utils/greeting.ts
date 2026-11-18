/**
 * A plain time-of-day greeting for the Home page hero.
 *
 * Computed from the visitor's own clock, nothing more. Three plain
 * branches: morning, afternoon, evening (evening covers the night
 * hours too, so the greeting is always a hello, never a goodbye).
 */

/** Greeting for a 0-23 hour. */
export function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}
