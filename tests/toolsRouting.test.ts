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
  { id: 'index', route: 'tools-index', url: '/tools/all', view: 'IndexView' },
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

/** The four remaining Tier A tools: Fawatih, Sawaqit, Shields, About. */
const FOUR_TOOLS = [
  { id: 'fawatih', route: 'tools-fawatih', url: '/tools/fawatih', view: 'FawatihView' },
  { id: 'sawaqit', route: 'tools-sawaqit', url: '/tools/sawaqit', view: 'SawaqitView' },
  { id: 'shields', route: 'tools-shields', url: '/tools/shields', view: 'ShieldsView' },
  { id: 'about', route: 'tools-about', url: '/tools/about', view: 'AboutView' },
] as const;

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

  it("the legacy '/tools/index' URL still parses to the tools index (in-app alias)", () => {
    const router = readSource('src/router/router.ts');
    expect(router).toContain("pathname === '/tools/all' || pathname === '/tools/index'");
  });

  it('App.tsx imports and renders every new view', () => {
    const app = readSource('src/App.tsx');
    for (const tool of ALL_WIRED_TOOLS) {
      // Lazy-loaded since the performance pass: const X = lazy(() => import(...))
      expect(app).toContain(`const ${tool.view} = lazy(`);
      expect(app).toContain(`case '${tool.route}':`);
      expect(app).toContain(`<${tool.view} />`);
    }
  });

  it('the hub lists every wired tool once (no orphan routes)', () => {
    const entries = TOOLS_INDEX.filter((t) => ALL_WIRED_TOOLS.some((w) => w.id === t.id));
    expect(entries.length).toBe(ALL_WIRED_TOOLS.length);
  });
});

describe('The four Tier A tools (Fawatih, Sawaqit, Shields, About) are wired', () => {
  it('has one entry per tool in the index, with title, blurb, route and keywords', () => {
    for (const tool of FOUR_TOOLS) {
      const entry = TOOLS_INDEX.find((t) => t.id === tool.id);
      expect(entry, `missing TOOLS_INDEX entry for ${tool.id}`).toBeDefined();
      expect(entry!.title.length).toBeGreaterThan(0);
      expect(entry!.blurb.length).toBeGreaterThan(0);
      expect(entry!.route).toBe(tool.route);
      expect(entry!.keywords.length).toBeGreaterThan(0);
    }
    expect(TOOLS_INDEX).toHaveLength(38);
  });

  it('types.ts lists every new ViewName', () => {
    const types = readSource('src/types.ts');
    for (const tool of FOUR_TOOLS) {
      expect(types).toContain(`'${tool.route}'`);
    }
  });

  it('router.ts has a buildUrl case and a parseUrl case for every new route', () => {
    const router = readSource('src/router/router.ts');
    for (const tool of FOUR_TOOLS) {
      expect(router).toContain(`case '${tool.route}':`);
      expect(router).toContain(`return '${tool.url}';`);
      expect(router).toContain(`pathname === '${tool.url}'`);
      expect(router).toContain(`view: '${tool.route}'`);
    }
  });

  it('App.tsx imports and renders every new view', () => {
    const app = readSource('src/App.tsx');
    for (const tool of FOUR_TOOLS) {
      // Lazy-loaded since the performance pass: const X = lazy(() => import(...))
      expect(app).toContain(`const ${tool.view} = lazy(`);
      expect(app).toContain(`case '${tool.route}':`);
      expect(app).toContain(`<${tool.view} />`);
    }
  });

  it('the hub no longer says the four tools are still to be built', () => {
    const hub = readSource('src/views/tools/ToolsHubView.tsx');
    expect(hub).not.toContain('still to be built');
  });
});

/** Stage 3A Topics: hub + eight topic pages + Questions. No index entry is needed. */
const TOPIC_ROUTES = [
  { route: 'topics', url: '/topics', view: 'TopicsHubView' },
  { route: 'topic-retreat', url: '/topics/40-day-retreat', view: 'TopicRetreatView' },
  { route: 'topic-malakut', url: '/topics/alam-al-malakut', view: 'TopicMalakutView' },
  { route: 'topic-ruh', url: '/topics/ruh-and-soul', view: 'TopicRuhView' },
  { route: 'topic-alif', url: '/topics/letter-alif', view: 'TopicAlifView' },
  { route: 'topic-seal', url: '/topics/seal-of-solomon', view: 'TopicSealView' },
  { route: 'topic-dreams', url: '/topics/three-kinds-of-dreams', view: 'TopicDreamsView' },
  { route: 'topic-saba', url: '/topics/surah-saba-34-14', view: 'TopicSabaView' },
  { route: 'topic-khidr', url: '/topics/al-khidr', view: 'TopicKhidrView' },
  { route: 'topics-questions', url: '/topics/questions', view: 'QuestionsView' },
] as const;

describe('Stage 3A topic routes are wired', () => {
  it('types.ts lists every topic ViewName', () => {
    const types = readSource('src/types.ts');
    for (const topic of TOPIC_ROUTES) {
      expect(types).toContain(`'${topic.route}'`);
    }
  });

  it('router.ts has a buildUrl case and a parseUrl case for every topic route', () => {
    const router = readSource('src/router/router.ts');
    for (const topic of TOPIC_ROUTES) {
      expect(router).toContain(`case '${topic.route}':`);
      expect(router).toContain(`return '${topic.url}';`);
      expect(router).toContain(`pathname === '${topic.url}'`);
      expect(router).toContain(`view: '${topic.route}'`);
    }
  });

  it('App.tsx imports and renders every topic view', () => {
    const app = readSource('src/App.tsx');
    for (const topic of TOPIC_ROUTES) {
      // Lazy-loaded since the performance pass: const X = lazy(() => import(...))
      expect(app).toContain(`const ${topic.view} = lazy(`);
      expect(app).toContain(`case '${topic.route}':`);
      expect(app).toContain(`<${topic.view} />`);
    }
  });

  it('the Navbar puts Topics in the top row on desktop, not in the More menu', () => {
    const navbar = readSource('src/components/layout/Navbar.tsx');
    expect(navbar).not.toContain(`moreLink('topics'`);
    expect(navbar).toContain(`desktopLink(`);
    expect(navbar).toContain(`'topics',`);
    expect(navbar).toContain(`handleNav('topics')`);
    expect(navbar).toContain('isTopicsView(currentView)');
  });
});

/** Stage 3B Topics: four new topic pages + the Study Guides page. */
const STAGE_3B_ROUTES = [
  { route: 'topic-rijal', url: '/topics/rijal-al-ghayb', view: 'TopicRijalView' },
  { route: 'topic-uwaisi', url: '/topics/uwaisi-transmission', view: 'TopicUwaisiView' },
  { route: 'topic-renewal', url: '/topics/renewal-of-creation', view: 'TopicRenewalView' },
  { route: 'topic-drinks', url: '/topics/quranic-drinks', view: 'TopicDrinksView' },
  { route: 'topics-guides', url: '/topics/guides', view: 'GuidesView' },
] as const;

describe('Stage 3B topic routes are wired', () => {
  it('types.ts lists every new ViewName', () => {
    const types = readSource('src/types.ts');
    for (const topic of STAGE_3B_ROUTES) {
      expect(types).toContain(`'${topic.route}'`);
    }
  });

  it('router.ts has a buildUrl case and a parseUrl case for every new route', () => {
    const router = readSource('src/router/router.ts');
    for (const topic of STAGE_3B_ROUTES) {
      expect(router).toContain(`case '${topic.route}':`);
      expect(router).toContain(`return '${topic.url}';`);
      expect(router).toContain(`pathname === '${topic.url}'`);
      expect(router).toContain(`view: '${topic.route}'`);
    }
  });

  it('App.tsx imports and renders every new view', () => {
    const app = readSource('src/App.tsx');
    for (const topic of STAGE_3B_ROUTES) {
      // Lazy-loaded since the performance pass: const X = lazy(() => import(...))
      expect(app).toContain(`const ${topic.view} = lazy(`);
      expect(app).toContain(`case '${topic.route}':`);
      expect(app).toContain(`<${topic.view} />`);
    }
  });

  it('the Topics hub links to the Guides page', () => {
    const hub = readSource('src/views/topics/TopicsHubView.tsx');
    expect(hub).toContain(`router.navigate('topics-guides')`);
  });

  it('the search overlay finds guides and routes them to the Guides page', () => {
    const overlay = readSource('src/views/tools/ToolsSearchOverlay.tsx');
    expect(overlay).toContain(`STUDY_GUIDES`);
    expect(overlay).toContain(`route: 'topics-guides'`);
  });
});
