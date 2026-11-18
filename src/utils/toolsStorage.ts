/**
 * Device-only storage for the study tools (Journal, Wird, Grimoire).
 *
 * Everything lives in localStorage on this device. Nothing is sent
 * anywhere. Every access is wrapped in try/catch because storage may
 * be unavailable (private mode, disabled cookies, server render).
 */

export interface JournalEntry {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface WirdData {
  /** Counts per phrase, keyed by the phrase text. */
  counts: Record<string, number>;
  /** Count targets per phrase, keyed by the phrase text. */
  targets: Record<string, number>;
}

export type GrimoireKind = 'name' | 'bast' | 'note';

export interface GrimoireItem {
  id: string;
  kind: GrimoireKind;
  title: string;
  detail: string;
  createdAt: number;
}

export const JOURNAL_KEY = 'ilmeghayb_tools_journal';
export const WIRD_KEY = 'ilmeghayb_tools_wird';
export const GRIMOIRE_KEY = 'ilmeghayb_tools_grimoire';

function storage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch {
    return null;
  }
}

function readRaw(key: string): string | null {
  const store = storage();
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch {
    // Storage full or unavailable — the UI keeps working in memory.
  }
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

// --- Journal ---------------------------------------------------------------

export function loadJournal(): JournalEntry[] {
  const raw = readRaw(JOURNAL_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const entries = validateJournalEntries(parsed);
    return entries ?? [];
  } catch {
    return [];
  }
}

export function saveJournal(entries: JournalEntry[]): void {
  writeRaw(JOURNAL_KEY, JSON.stringify(entries));
}

// --- Wird ------------------------------------------------------------------

export function emptyWird(): WirdData {
  return { counts: {}, targets: {} };
}

export function loadWird(): WirdData {
  const raw = readRaw(WIRD_KEY);
  if (!raw) return emptyWird();
  try {
    const parsed: unknown = JSON.parse(raw);
    const data = validateWirdData(parsed);
    return data ?? emptyWird();
  } catch {
    return emptyWird();
  }
}

export function saveWird(data: WirdData): void {
  writeRaw(WIRD_KEY, JSON.stringify(data));
}

// --- Grimoire --------------------------------------------------------------

export function loadGrimoire(): GrimoireItem[] {
  const raw = readRaw(GRIMOIRE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    const items = validateGrimoireItems(parsed);
    return items ?? [];
  } catch {
    return [];
  }
}

export function saveGrimoire(items: GrimoireItem[]): void {
  writeRaw(GRIMOIRE_KEY, JSON.stringify(items));
}

/** Add one item to the Grimoire (newest first) and return the new list. */
export function addGrimoireItem(item: Omit<GrimoireItem, 'id' | 'createdAt'>): GrimoireItem[] {
  const full: GrimoireItem = { ...item, id: uid(), createdAt: Date.now() };
  const items = [full, ...loadGrimoire()];
  saveGrimoire(items);
  return items;
}

// --- Validation ------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  if (!isRecord(value)) return false;
  return Object.values(value).every((v) => typeof v === 'number' && Number.isFinite(v));
}

/** Returns the entries if valid, otherwise null. Never throws. */
export function validateJournalEntries(value: unknown): JournalEntry[] | null {
  if (!Array.isArray(value)) return null;
  const entries: JournalEntry[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.title !== 'string' ||
      typeof item.text !== 'string' ||
      typeof item.createdAt !== 'number' ||
      typeof item.updatedAt !== 'number'
    ) {
      return null;
    }
    entries.push({
      id: item.id,
      title: item.title,
      text: item.text,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  }
  return entries;
}

/** Returns the data if valid, otherwise null. Never throws. */
export function validateWirdData(value: unknown): WirdData | null {
  if (!isRecord(value)) return null;
  if (!isNumberRecord(value.counts) || !isNumberRecord(value.targets)) return null;
  return { counts: { ...value.counts }, targets: { ...value.targets } };
}

/** Returns the items if valid, otherwise null. Never throws. */
export function validateGrimoireItems(value: unknown): GrimoireItem[] | null {
  if (!Array.isArray(value)) return null;
  const items: GrimoireItem[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      (item.kind !== 'name' && item.kind !== 'bast' && item.kind !== 'note') ||
      typeof item.title !== 'string' ||
      typeof item.detail !== 'string' ||
      typeof item.createdAt !== 'number'
    ) {
      return null;
    }
    items.push({
      id: item.id,
      kind: item.kind,
      title: item.title,
      detail: item.detail,
      createdAt: item.createdAt,
    });
  }
  return items;
}

// --- Export / import -------------------------------------------------------

export interface ToolsExport {
  journal: JournalEntry[];
  wird: WirdData;
  grimoire: GrimoireItem[];
}

/** A JSON string holding all three tools' data, for backup. */
export function exportToolsData(): string {
  const data: ToolsExport = {
    journal: loadJournal(),
    wird: loadWird(),
    grimoire: loadGrimoire(),
  };
  return JSON.stringify(data, null, 2);
}

export interface ImportResult {
  ok: boolean;
  error?: string;
  imported?: { journal: number; wird: number; grimoire: number };
}

/**
 * Import a full export (or a partial one — only the sections present in
 * the JSON are touched). Validates everything BEFORE writing anything,
 * so a bad file never wipes existing data. Merges by id: incoming
 * entries replace same-id ones, everything else is kept.
 */
export function importToolsData(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  if (!isRecord(parsed)) {
    return { ok: false, error: 'That file does not hold tools data.' };
  }

  const hasJournal = 'journal' in parsed;
  const hasWird = 'wird' in parsed;
  const hasGrimoire = 'grimoire' in parsed;
  if (!hasJournal && !hasWird && !hasGrimoire) {
    return { ok: false, error: 'That file has no journal, wird or grimoire data in it.' };
  }

  // Validate everything first — no writes until all sections check out.
  const journal = hasJournal ? validateJournalEntries(parsed.journal) : null;
  if (hasJournal && journal === null) {
    return { ok: false, error: 'The journal entries in that file are not in the right shape.' };
  }
  const wird = hasWird ? validateWirdData(parsed.wird) : null;
  if (hasWird && wird === null) {
    return { ok: false, error: 'The wird counts in that file are not in the right shape.' };
  }
  const grimoire = hasGrimoire ? validateGrimoireItems(parsed.grimoire) : null;
  if (hasGrimoire && grimoire === null) {
    return { ok: false, error: 'The grimoire items in that file are not in the right shape.' };
  }

  const imported = { journal: 0, wird: 0, grimoire: 0 };
  if (journal) {
    saveJournal(mergeById(loadJournal(), journal));
    imported.journal = journal.length;
  }
  if (wird) {
    saveWird({
      counts: { ...loadWird().counts, ...wird.counts },
      targets: { ...loadWird().targets, ...wird.targets },
    });
    imported.wird = Object.keys(wird.counts).length;
  }
  if (grimoire) {
    saveGrimoire(mergeById(loadGrimoire(), grimoire));
    imported.grimoire = grimoire.length;
  }
  return { ok: true, imported };
}

/**
 * Import journal entries from either a bare array of entries or a full
 * export object ({ journal: [...] }). Same validate-then-write rule.
 */
export function importJournalJson(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  const raw = isRecord(parsed) && 'journal' in parsed ? parsed.journal : parsed;
  const entries = validateJournalEntries(raw);
  if (entries === null) {
    return { ok: false, error: 'The journal entries in that file are not in the right shape.' };
  }
  saveJournal(mergeById(loadJournal(), entries));
  return { ok: true, imported: { journal: entries.length, wird: 0, grimoire: 0 } };
}

/**
 * Import grimoire items from either a bare array of items or a full
 * export object ({ grimoire: [...] }). Same validate-then-write rule.
 */
export function importGrimoireJson(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  const raw = isRecord(parsed) && 'grimoire' in parsed ? parsed.grimoire : parsed;
  const items = validateGrimoireItems(raw);
  if (items === null) {
    return { ok: false, error: 'The grimoire items in that file are not in the right shape.' };
  }
  saveGrimoire(mergeById(loadGrimoire(), items));
  return { ok: true, imported: { journal: 0, wird: 0, grimoire: items.length } };
}

function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  for (const item of incoming) byId.set(item.id, item);
  // Incoming items first (newest), then the rest in their old order.
  const incomingIds = new Set(incoming.map((item) => item.id));
  return [...incoming, ...existing.filter((item) => !incomingIds.has(item.id))];
}

// --- Browser download (for the Export buttons) -----------------------------

/** Trigger a download of a text file in the browser. No-op outside a browser. */
export function downloadTextFile(filename: string, text: string, mime = 'application/json'): void {
  try {
    if (typeof document === 'undefined' || typeof URL === 'undefined') return;
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    // Download unavailable — the data is still safe on the device.
  }
}
