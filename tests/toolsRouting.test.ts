import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TOOLS_INDEX } from '../src/data/toolsIndex';

/**
 * Phase 2 + 3 wiring: every new TOOLS_INDEX entry has a matching
 * ViewName, a router URL (buildUrl + parseUrl cases) and an App case.
 *
 * The router module itself is a singleton that touches `window` on
 * import, so a live buildUrl/parseUrl round-trip is not possible in
 * this node test run — instead the test reads the router, types and
 * App sources and asserts the cases are present. The hub and Ctrl+K
 * search read TOOLS_INDEX, so the index entries wire both.
 */

const NEW_TOOLS = [
  { id: 'today', route: 'tools-today', url: '/tools/today', view: 'TodayView' },
  { id: 'hours', route: 'tools-hours', url: '/tools/hours', view: 'HoursView' },
  { id: 'moon', route: 'tools-moon', url: '/tools/moon', view: 'MoonView' },
  { id: 'mansions', route: 'tools-mansions', url: '/tools/mansions', view: 'MansionsView' },
  { id: 'falak', route: 'tools-falak', url: '/tools/falak', view: 'FalakView' },
  { id: 'majlis', route: 'tools-majlis', url: '/tools/majlis', view: 'MajlisView' },
  { id: 'forge', route: 'tools-forge', url: '/tools/forge', view: 'ForgeView' },
  { id: 'qawaid', route: 'tools-qawaid', url: '/tools/qawaid', view: 'QawaidView' },
] as const;

/** Phase 4 Tier B shells: same wiring, same checks. */
const SHELL_TOOLS = [
  { id: 'kitab', route: 'tools-kitab', url: '/tools/kitab', view: 'KitabView' },
  { id: 'talasim', route: 'tools-talasim', url: '/tools/talasim', view: 'TalasimView' },
  { id: 'ashkal', route: 'tools-ashkal', url: '/tools/ashkal', view: 'AshkalView' },
  { id: 'figure-forge', route: 'tools-figure-forge', url: '/tools/figure-forge', view: 'FigureForgeView' },
  { id: 'talism-studio', route: 'tools-talism-studio', url: '/tools/talism-studio', view: 'TalismStudioView' },
  { id: 'haqaiq', route: 'tools-haqaiq', url: '/tools/haqaiq', view: 'HaqaiqView' },
  { id: 'shart', route: 'tools-shart', url: '/tools/shart', view: 'ShartView' },
  { id: 'sirr-al-jalil', route: 'tools-sirr-al-jalil', url: '/tools/sirr-al-jalil', view: 'SirrJalilView' },
  { id: 'durus', route: 'tools-durus', url: '/tools/durus', view: 'DurusView' },
  { id: 'index', route: 'tools-index', url: '/tools/index', view: 'IndexView' },
  { id: 'library', route: 'tools-library', url: '/tools/library', view: 'ToolsLibraryView' },
  { id: 'atlas', route: 'tools-atlas', url: '/tools/atlas', view: 'AtlasView' },
  { id: 'qalam', route: 'tools-qalam', url: '/tools/qalam', view: 'QalamView' },
  { id: 'khatam', route: 'tools-khatam', url: '/tools/khatam', view: 'KhatamView' },
  { id: 'plate', route: 'tools-plate', url: '/tools/plate', view: 'PlateView' },
  { id: 'works', route: 'tools-works', url: '/tools/works', view: 'WorksView' },
  { id: 'bakhur-adad', route: 'tools-bakhur-adad', url: '/tools/bakhur-adad', view: 'BakhurAdadView' },
  { id: 'shurut', route: 'tools-shurut', url: '/tools/shurut', view: 'ShurutView' },
  { id: 'glossary', route: 'tools-glossary', url: '/tools/glossary', view: 'GlossaryView' },
] as const;

const ALL_WIRED_TOOLS = [...NEW_TOOLS, ...SHELL_TOOLS];

function readSource(relPath: string): string {
  return readFileSync(join(process.cwd(), relPath), 'utf8');
}

describe('Phase 2 + 3 tools are in the index', () => {
  it('has one entry per new tool, with title, blurb, route and keywords', () => {
    for (const tool of ALL_WIRED_TOOLS) {
      const entry = TOOLS_INDEX.find((t) => t.id === tool.id);
      expect(entry, `missing TOOLS_INDEX entry for ${tool.id}`).toBeDefined();
      expect(entry!.title.length).toBeGreaterThan(0);
      expect(entry!.blurb.length).toBeGreaterThan(0);
      expect(entry!.route).toBe(tool.route);
      expect(entry!.keywords.length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate ids or routes in the whole index', () => {
    const ids = TOOLS_INDEX.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    const routes = TOOLS_INDEX.map((t) => t.route);
    expect(new Set(routes).size).toBe(routes.length);
  });
});

describe('Phase 2 + 3 tools are in the router and App', () => {
  it('types.ts lists every new ViewName', () => {
    const types = readSource('src/types.ts');
    for (const tool of ALL_WIRED_TOOLS) {
      expect(types).toContain(`'${tool.route}'`);
    }
  });

  it('router.ts has a buildUrl case and a parseUrl case for every new route', () => {
    const router = readSource('src/router/router.ts');
    for (const tool of ALL_WIRED_TOOLS) {
      expect(router).toContain(`case '${tool.route}':`);
      expect(router).toContain(`return '${tool.url}';`);
      expect(router).toContain(`pathname === '${tool.url}'`);
      expect(router).toContain(`view: '${tool.route}'`);
    }
  });

  it('App.tsx imports and renders every new view', () => {
    const app = readSource('src/App.tsx');
    for (const tool of ALL_WIRED_TOOLS) {
      expect(app).toContain(`import { ${tool.view} }`);
      expect(app).toContain(`case '${tool.route}':`);
      expect(app).toContain(`<${tool.view} />`);
    }
  });

  it('the hub lists every wired tool once (no orphan routes)', () => {
    const entries = TOOLS_INDEX.filter((t) => ALL_WIRED_TOOLS.some((w) => w.id === t.id));
    expect(entries.length).toBe(ALL_WIRED_TOOLS.length);
  });
});
