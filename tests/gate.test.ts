import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DEFAULT_BROADCAST_CHANNEL_URL,
  EMPTY_GATE_SETTINGS,
  isGateKeySet,
} from '../src/services/api';

const CHANNEL_URL = 'https://www.instagram.com/channel/ZKdxHLW9r2VpKow7/';

describe('gate key: broadcast channel URL', () => {
  it('is the exact broadcast channel link, never changed or shortened', () => {
    expect(DEFAULT_BROADCAST_CHANNEL_URL).toBe(CHANNEL_URL);
  });
});

describe('isGateKeySet', () => {
  it('is true only when status.keySet is true', () => {
    expect(isGateKeySet({ keySet: true, channelUrl: CHANNEL_URL })).toBe(true);
  });

  it('is false for null, undefined, and keySet false', () => {
    expect(isGateKeySet(null)).toBe(false);
    expect(isGateKeySet(undefined)).toBe(false);
    expect(isGateKeySet({ keySet: false, channelUrl: CHANNEL_URL })).toBe(false);
  });
});

describe('default gate settings shape', () => {
  it('has an empty key and the default channel link (client fallback)', () => {
    expect(EMPTY_GATE_SETTINGS).toEqual({ gateKey: '', channelUrl: CHANNEL_URL });
    expect(EMPTY_GATE_SETTINGS.gateKey).toBe('');
    expect(EMPTY_GATE_SETTINGS.channelUrl).toBe(DEFAULT_BROADCAST_CHANNEL_URL);
  });

  it('matches the default gate-settings.json on disk', () => {
    const stored = JSON.parse(
      readFileSync(resolve(__dirname, '../data/gate-settings.json'), 'utf8')
    ) as { gateKey: string; channelUrl: string };
    expect(stored.gateKey).toBe('');
    expect(stored.channelUrl).toBe(CHANNEL_URL);
  });
});
