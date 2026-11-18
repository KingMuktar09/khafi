/**
 * Bundled city list for the study tools' location picker.
 *
 * Coordinates are well-known city-centre values (rounded to 2 decimal
 * places — close enough for sunrise/sunset and planetary hours, which
 * shift by seconds, not minutes, over a few kilometres). The two
 * least-certain entries were checked on 18 Nov 2026: Fez 34.03°N
 * 5.00°W and Cordoba 37.89°N 4.77°W. Simurali / Kalyani is the user's
 * home (about 22.98°N 88.44°E). No external geocoding service is
 * used — the user picks from this list or types a latitude/longitude.
 */

export interface CityEntry {
  name: string;
  country: string;
  /** Latitude in decimal degrees (north positive). */
  lat: number;
  /** Longitude in decimal degrees (east positive). */
  lon: number;
  /** IANA time zone for the city. */
  timeZone: string;
}

export const CITIES: CityEntry[] = [
  { name: 'Mecca', country: 'Saudi Arabia', lat: 21.42, lon: 39.82, timeZone: 'Asia/Riyadh' },
  { name: 'Medina', country: 'Saudi Arabia', lat: 24.47, lon: 39.61, timeZone: 'Asia/Riyadh' },
  { name: 'Cairo', country: 'Egypt', lat: 30.04, lon: 31.24, timeZone: 'Africa/Cairo' },
  { name: 'Baghdad', country: 'Iraq', lat: 33.31, lon: 44.36, timeZone: 'Asia/Baghdad' },
  { name: 'Damascus', country: 'Syria', lat: 33.51, lon: 36.29, timeZone: 'Asia/Damascus' },
  { name: 'Istanbul', country: 'Türkiye', lat: 41.01, lon: 28.98, timeZone: 'Europe/Istanbul' },
  { name: 'Delhi', country: 'India', lat: 28.61, lon: 77.21, timeZone: 'Asia/Kolkata' },
  { name: 'Mumbai', country: 'India', lat: 19.08, lon: 72.88, timeZone: 'Asia/Kolkata' },
  { name: 'Kolkata', country: 'India', lat: 22.57, lon: 88.36, timeZone: 'Asia/Kolkata' },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.81, lon: 90.41, timeZone: 'Asia/Dhaka' },
  { name: 'Karachi', country: 'Pakistan', lat: 24.86, lon: 67.01, timeZone: 'Asia/Karachi' },
  { name: 'Lahore', country: 'Pakistan', lat: 31.52, lon: 74.36, timeZone: 'Asia/Karachi' },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.21, lon: 106.85, timeZone: 'Asia/Jakarta' },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.14, lon: 101.69, timeZone: 'Asia/Kuala_Lumpur' },
  { name: 'London', country: 'United Kingdom', lat: 51.51, lon: -0.13, timeZone: 'Europe/London' },
  { name: 'Paris', country: 'France', lat: 48.85, lon: 2.35, timeZone: 'Europe/Paris' },
  { name: 'New York', country: 'United States', lat: 40.71, lon: -74.01, timeZone: 'America/New_York' },
  { name: 'Toronto', country: 'Canada', lat: 43.65, lon: -79.38, timeZone: 'America/Toronto' },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2, lon: 55.27, timeZone: 'Asia/Dubai' },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.71, lon: 46.68, timeZone: 'Asia/Riyadh' },
  { name: 'Tehran', country: 'Iran', lat: 35.69, lon: 51.39, timeZone: 'Asia/Tehran' },
  { name: 'Jerusalem', country: 'Israel', lat: 31.77, lon: 35.21, timeZone: 'Asia/Jerusalem' },
  { name: 'Fez', country: 'Morocco', lat: 34.03, lon: -5.0, timeZone: 'Africa/Casablanca' },
  { name: 'Cordoba', country: 'Spain', lat: 37.89, lon: -4.77, timeZone: 'Europe/Madrid' },
  { name: 'Simurali / Kalyani', country: 'India', lat: 22.98, lon: 88.44, timeZone: 'Asia/Kolkata' },
];
