import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DEFAULT_BROADCAST_CHANNEL_URL,
  EMPTY_GATE_SETTINGS,
  isGateKeySet,
} from '../src/services/api';
import {
  hashGateKey,
  verifyGateKey,
  isGateKeySet as isServerGateKeySet,
  commitFileToGitHub,
  GATE_KEY_MIN_LENGTH,
} from '../server/app';

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

describe('gate key hashing (C-1: the key is stored hashed, never plaintext)', () => {
  const KEY = 'correct horse battery staple';

  it('hashes with a salt: same key, different salt, different hash', () => {
    const a = hashGateKey(KEY, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    const b = hashGateKey(KEY, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
    expect(a).not.toContain(KEY);
  });

  it('verifies the right guess against the hash and rejects wrong ones', () => {
    const salt = '0123456789abcdef0123456789abcdef';
    const settings = {
      gateKey: '',
      gateKeyHash: hashGateKey(KEY, salt),
      gateKeySalt: salt,
      channelUrl: CHANNEL_URL,
    };
    expect(verifyGateKey(KEY, settings)).toBe(true);
    expect(verifyGateKey('wrong key entirely', settings)).toBe(false);
    expect(verifyGateKey('', settings)).toBe(false);
  });

  it('still verifies a legacy plaintext file until it is re-saved hashed', () => {
    const legacy = { gateKey: KEY, gateKeyHash: '', gateKeySalt: '', channelUrl: CHANNEL_URL };
    expect(verifyGateKey(KEY, legacy)).toBe(true);
    expect(verifyGateKey('nope', legacy)).toBe(false);
  });

  it('keySet is true for a hash or a legacy key, false when neither is set', () => {
    expect(isServerGateKeySet({ gateKey: '', gateKeyHash: 'abc', gateKeySalt: 'def', channelUrl: CHANNEL_URL })).toBe(true);
    expect(isServerGateKeySet({ gateKey: KEY, gateKeyHash: '', gateKeySalt: '', channelUrl: CHANNEL_URL })).toBe(true);
    expect(isServerGateKeySet({ gateKey: '', gateKeyHash: '', gateKeySalt: '', channelUrl: CHANNEL_URL })).toBe(false);
  });

  it('the minimum gate-key length is 12 characters (H-5)', () => {
    expect(GATE_KEY_MIN_LENGTH).toBe(12);
  });
});

describe('commitFileToGitHub denylist (C-1)', () => {
  it('refuses to commit data/gate-settings.json, even with no token set', async () => {
    const result = await commitFileToGitHub('data/gate-settings.json', '{"gateKeyHash":"x"}', 'test');
    expect(result.ok).toBe(false);
    expect(result.error || '').toMatch(/Refusing to commit data\/gate-settings\.json/);
  });

  it('does not block other paths at the denylist (fails only for the missing token)', async () => {
    const saved = process.env.GITHUB_SYNC_TOKEN;
    process.env.GITHUB_SYNC_TOKEN = '';
    try {
      const result = await commitFileToGitHub('data/catalog.json', '{}', 'test');
      expect(result.ok).toBe(false);
      expect(result.error || '').toMatch(/GITHUB_SYNC_TOKEN is not set/);
    } finally {
      if (saved === undefined) delete process.env.GITHUB_SYNC_TOKEN;
      else process.env.GITHUB_SYNC_TOKEN = saved;
    }
  });
});
