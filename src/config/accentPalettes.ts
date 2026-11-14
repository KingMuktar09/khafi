import { AccentColorSetting } from '../types';

export interface AccentTheme {
  gold: string;
  light: string;
  faint: string;
}

export const ACCENT_PALETTES: Record<
  AccentColorSetting,
  { name: string; hex: string; dark: AccentTheme; light: AccentTheme }
> = {
  gold: {
    name: 'Gold',
    hex: '#D9A91A',
    dark: {
      gold: '#D9A91A',
      light: '#EAC038',
      faint: 'rgba(217, 169, 26, 0.15)',
    },
    light: {
      gold: '#B88700',
      light: '#946B00',
      faint: 'rgba(184, 135, 0, 0.12)',
    },
  },
  blue: {
    name: 'Blue',
    hex: '#3B82F6',
    dark: {
      gold: '#3B82F6',
      light: '#60A5FA',
      faint: 'rgba(59, 130, 246, 0.18)',
    },
    light: {
      gold: '#2563EB',
      light: '#1D4ED8',
      faint: 'rgba(37, 99, 235, 0.12)',
    },
  },
  green: {
    name: 'Green',
    hex: '#10B981',
    dark: {
      gold: '#10B981',
      light: '#34D399',
      faint: 'rgba(16, 185, 129, 0.18)',
    },
    light: {
      gold: '#059669',
      light: '#047857',
      faint: 'rgba(5, 150, 105, 0.12)',
    },
  },
  purple: {
    name: 'Purple',
    hex: '#A855F7',
    dark: {
      gold: '#A855F7',
      light: '#C084FC',
      faint: 'rgba(168, 85, 247, 0.18)',
    },
    light: {
      gold: '#7C3AED',
      light: '#6D28D9',
      faint: 'rgba(124, 58, 237, 0.12)',
    },
  },
  rose: {
    name: 'Rose',
    hex: '#F43F5E',
    dark: {
      gold: '#F43F5E',
      light: '#FB7185',
      faint: 'rgba(244, 63, 94, 0.18)',
    },
    light: {
      gold: '#E11D48',
      light: '#BE123C',
      faint: 'rgba(225, 29, 72, 0.12)',
    },
  },
};
