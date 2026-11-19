import React, { useEffect, useState, lazy, Suspense } from 'react';
import { appState } from './state/appState';
import { storage } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { FollowGate } from './components/ui/FollowGate';
import { MaintenancePage } from './components/ui/MaintenancePage';
import { api } from './services/api';
import { siteConfig } from './config/siteConfig';
import { shouldShowGate } from './utils/gateDecision';

// Import Views
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { BookDetailsView } from './views/BookDetailsView';
import { FavoritesView } from './views/FavoritesView';
import { InfoView } from './views/InfoView';
import { JourneysView } from './views/JourneysView';
import { TimelineView } from './views/TimelineView';
import { ShelfView } from './views/ShelfView';
import { BookFinderView } from './views/BookFinderView';
import { WafqView } from './views/WafqView';
import { AmalsView } from './views/AmalsView';

// Topics: open to everyone, no gate. The hub, every topic page, the
// Questions part, and the Guides page all load without a follow or a
// key. The library, the books, and the study tools stay behind the
// gate exactly as before. Only Topics is public.
import { TopicsHubView } from './views/topics/TopicsHubView';
import { TopicRetreatView } from './views/topics/TopicRetreatView';
import { TopicMalakutView } from './views/topics/TopicMalakutView';
import { TopicRuhView } from './views/topics/TopicRuhView';
import { TopicAlifView } from './views/topics/TopicAlifView';
import { TopicSealView } from './views/topics/TopicSealView';
import { TopicDreamsView } from './views/topics/TopicDreamsView';
import { TopicSabaView } from './views/topics/TopicSabaView';
import { TopicKhidrView } from './views/topics/TopicKhidrView';
import { TopicRijalView } from './views/topics/TopicRijalView';
import { TopicUwaisiView } from './views/topics/TopicUwaisiView';
import { TopicRenewalView } from './views/topics/TopicRenewalView';
import { TopicDrinksView } from './views/topics/TopicDrinksView';
import { TopicBasmalahView } from './views/topics/TopicBasmalahView';
import { TopicKursiView } from './views/topics/TopicKursiView';
import { TopicGreatestNameView } from './views/topics/TopicGreatestNameView';
import { TopicFawatihView } from './views/topics/TopicFawatihView';
import { TopicTawaqifView } from './views/topics/TopicTawaqifView';
import { TopicKhayasView } from './views/topics/TopicKhayasView';
import { TopicZayirjahView } from './views/topics/TopicZayirjahView';
import { TopicIhatahView } from './views/topics/TopicIhatahView';
import { TopicSimiyaView } from './views/topics/TopicSimiyaView';
import { TopicKhalawatView } from './views/topics/TopicKhalawatView';
import { QuestionsView } from './views/topics/QuestionsView';
import { GuidesView } from './views/topics/GuidesView';

// Study tools (Phase 1): calculators + device-only tools, behind the gate.
import { ToolsHubView } from './views/tools/ToolsHubView';
import { HurufView } from './views/tools/HurufView';
import { AsmaView } from './views/tools/AsmaView';
import { BastView } from './views/tools/BastView';
import { FawatihView } from './views/tools/FawatihView';
import { SawaqitView } from './views/tools/SawaqitView';
import { ShieldsView } from './views/tools/ShieldsView';
import { JournalView } from './views/tools/JournalView';
import { WirdView } from './views/tools/WirdView';
import { GrimoireView } from './views/tools/GrimoireView';
import { MethodView } from './views/tools/MethodView';
import { AboutView } from './views/tools/AboutView';

// Study tools (Phase 2): time and sky facts, behind the gate.
import { TodayView } from './views/tools/TodayView';
import { HoursView } from './views/tools/HoursView';
import { MoonView } from './views/tools/MoonView';
import { MansionsView } from './views/tools/MansionsView';
import { FalakView } from './views/tools/FalakView';
import { MajlisView } from './views/tools/MajlisView';

// Study tools (Phase 3): magic squares with a separate validator.
import { ForgeView } from './views/tools/ForgeView';
import { QawaidView } from './views/tools/QawaidView';

// Study tools (Phase 4): Tier B shells — templates and empty states only.
import { KitabView } from './views/tools/KitabView';
import { TalasimView } from './views/tools/TalasimView';
import { AshkalView } from './views/tools/AshkalView';
import { FigureForgeView } from './views/tools/FigureForgeView';
import { TalismStudioView } from './views/tools/TalismStudioView';
import { HaqaiqView } from './views/tools/HaqaiqView';
import { ShartView } from './views/tools/ShartView';
import { SirrJalilView } from './views/tools/SirrJalilView';
import { DurusView } from './views/tools/DurusView';
import { IndexView } from './views/tools/IndexView';
import { ToolsLibraryView } from './views/tools/ToolsLibraryView';
import { AtlasView } from './views/tools/AtlasView';
import { QalamView } from './views/tools/QalamView';
import { KhatamView } from './views/tools/KhatamView';
import { PlateView } from './views/tools/PlateView';
import { WorksView } from './views/tools/WorksView';
import { BakhurAdadView } from './views/tools/BakhurAdadView';
import { ShurutView } from './views/tools/ShurutView';
import { GlossaryView } from './views/tools/GlossaryView';

// Heavy views are lazy-loaded so the first paint stays light on mobile:
// the PDF reader (pdf.js) and the admin dashboard only download when opened.
const PdfReaderView = lazy(() => import('./views/PdfReaderView').then((m) => ({ default: m.PdfReaderView })));
const AdminView = lazy(() => import('./views/AdminView').then((m) => ({ default: m.AdminView })));

const ViewLoading: React.FC = () => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-8 text-center max-w-md mx-auto my-12 animate-fade-in">
    <p className="text-sm font-semibold text-[var(--text-main)]">Loading…</p>
  </div>
);

import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { LanguagePicker } from './components/ui/LanguagePicker';
import { isTopicsView } from './data/topicsContent';

export default function App() {
  const [, setTick] = useState(0);
  const [followUnlocked, setFollowUnlocked] = useState(() => storage.hasFollowUnlocked());
  const [showChooser, setShowChooser] = useState(() => !storage.hasChosenLanguage());
  const [maintenance, setMaintenance] = useState<{ enabled: boolean; message: string }>({ enabled: false, message: '' });

  useEffect(() => {
    const unsubscribeState = appState.subscribe(() => {
      setTick((t) => t + 1);
    });

    return () => {
      unsubscribeState();
    };
  }, []);

  // Maintenance mode (admin toggle): fetch once on load. Visitors see the
  // maintenance page; the admin still browses normally.
  useEffect(() => {
    let cancelled = false;
    api.getSiteSettings().then((s) => {
      if (!cancelled) setMaintenance(s.maintenance);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Instagram follow gate: first screen for new visitors. Admins and the
  // admin sign-in page bypass it; everyone else unlocks by following
  // @ghayb.chronicles and tapping unlock (remembered on this device).
  // Topics stays open without the gate, so anyone can read the topics.
  // Paid-book pages and the reader also bypass the gate: a paid book
  // needs its own key even for followers, so a locked visitor must reach
  // the key lock screen on the book page (or the reader's lock screen),
  // or the key could never be entered at all. Free books and the library
  // stay behind the gate as before.
  const isAdmin = appState.adminAuthenticated;
  // First-visit language chooser: before anything else, even the
  // follow gate. One pick, saved on the device, never shown again.
  // The language can be changed later only in Settings.
  if (showChooser) {
    return (
      <ErrorBoundary>
        <LanguagePicker onPicked={() => setShowChooser(false)} />
      </ErrorBoundary>
    );
  }
  // Maintenance mode: visitors see the maintenance page (with an admin
  // sign-in button) instead of any view. The admin and the admin sign-in
  // page bypass it, so Muktar can turn it off again.
  if (maintenance.enabled && !isAdmin && appState.route.view !== 'admin') {
    return (
      <ErrorBoundary>
        <MaintenancePage message={maintenance.message} />
      </ErrorBoundary>
    );
  }
  const showGate = shouldShowGate({
    followUnlocked,
    isAdmin,
    route: appState.route,
    books: appState.catalog.books,
    isTopics: isTopicsView(appState.route.view),
  });

  if (showGate) {
    // Gate counts: total folders (27, incl. sub-collections) and total
    // visible books (138). While the catalog is still loading, show the
    // known totals from siteConfig instead of 0 — the catalog starts
    // empty and only fills after the async /api/catalog fetch, so
    // rendering the raw state here showed "0 Collections, 0 Books"
    // on first paint (and forever to crawlers / slow connections).
    const liveFolders = (appState.catalog.folders || []).filter((f) => f.visible !== false).length;
    const liveBooks = appState.getVisibleBooks().length;
    const catalogLoaded = !appState.loading && (liveFolders > 0 || liveBooks > 0);
    const categoryCount = catalogLoaded ? liveFolders : siteConfig.catalogStats.totalFolders;
    const bookCount = catalogLoaded ? liveBooks : siteConfig.catalogStats.totalBooks;
    return (
      <ErrorBoundary>
        <FollowGate
          bookCount={bookCount}
          categoryCount={categoryCount}
          loading={!catalogLoaded}
          onUnlock={() => {
            storage.setFollowUnlocked();
            setFollowUnlocked(true);
          }}
        />
      </ErrorBoundary>
    );
  }

  const renderView = () => {
    const currentView = appState.route.view;

    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'library':
        return <LibraryView />;
      case 'book':
        return <BookDetailsView />;
      case 'read':
        return (
          <Suspense fallback={<ViewLoading />}>
            <PdfReaderView />
          </Suspense>
        );
      case 'favorites':
        return <FavoritesView />;
      case 'journeys':
        return <JourneysView />;
      case 'timeline':
        return <TimelineView />;
      case 'shelf':
        return <ShelfView />;
      case 'finder':
        return <BookFinderView />;
      case 'wafq':
        return <WafqView />;
      case 'amals':
        return <AmalsView />;
      case 'topics':
        return <TopicsHubView />;
      case 'topic-retreat':
        return <TopicRetreatView />;
      case 'topic-malakut':
        return <TopicMalakutView />;
      case 'topic-ruh':
        return <TopicRuhView />;
      case 'topic-alif':
        return <TopicAlifView />;
      case 'topic-seal':
        return <TopicSealView />;
      case 'topic-dreams':
        return <TopicDreamsView />;
      case 'topic-saba':
        return <TopicSabaView />;
      case 'topic-khidr':
        return <TopicKhidrView />;
      case 'topic-rijal':
        return <TopicRijalView />;
      case 'topic-uwaisi':
        return <TopicUwaisiView />;
      case 'topic-renewal':
        return <TopicRenewalView />;
      case 'topic-drinks':
        return <TopicDrinksView />;
      case 'topic-basmalah':
        return <TopicBasmalahView />;
      case 'topic-kursi':
        return <TopicKursiView />;
      case 'topic-greatest-name':
        return <TopicGreatestNameView />;
      case 'topic-fawatih':
        return <TopicFawatihView />;
      case 'topic-tawaqif':
        return <TopicTawaqifView />;
      case 'topic-khayas':
        return <TopicKhayasView />;
      case 'topic-zayirjah':
        return <TopicZayirjahView />;
      case 'topic-ihatah':
        return <TopicIhatahView />;
      case 'topic-simiya':
        return <TopicSimiyaView />;
      case 'topic-khalawat':
        return <TopicKhalawatView />;
      case 'topics-questions':
        return <QuestionsView />;
      case 'topics-guides':
        return <GuidesView />;
      case 'tools':
        return <ToolsHubView />;
      case 'tools-huruf':
        return <HurufView />;
      case 'tools-asma':
        return <AsmaView />;
      case 'tools-bast':
        return <BastView />;
      case 'tools-fawatih':
        return <FawatihView />;
      case 'tools-sawaqit':
        return <SawaqitView />;
      case 'tools-shields':
        return <ShieldsView />;
      case 'tools-journal':
        return <JournalView />;
      case 'tools-wird':
        return <WirdView />;
      case 'tools-grimoire':
        return <GrimoireView />;
      case 'tools-method':
        return <MethodView />;
      case 'tools-about':
        return <AboutView />;
      case 'tools-today':
        return <TodayView />;
      case 'tools-hours':
        return <HoursView />;
      case 'tools-moon':
        return <MoonView />;
      case 'tools-mansions':
        return <MansionsView />;
      case 'tools-falak':
        return <FalakView />;
      case 'tools-majlis':
        return <MajlisView />;
      case 'tools-forge':
        return <ForgeView />;
      case 'tools-qawaid':
        return <QawaidView />;
      case 'tools-kitab':
        return <KitabView />;
      case 'tools-talasim':
        return <TalasimView />;
      case 'tools-ashkal':
        return <AshkalView />;
      case 'tools-figure-forge':
        return <FigureForgeView />;
      case 'tools-talism-studio':
        return <TalismStudioView />;
      case 'tools-haqaiq':
        return <HaqaiqView />;
      case 'tools-shart':
        return <ShartView />;
      case 'tools-sirr-al-jalil':
        return <SirrJalilView />;
      case 'tools-durus':
        return <DurusView />;
      case 'tools-index':
        return <IndexView />;
      case 'tools-library':
        return <ToolsLibraryView />;
      case 'tools-atlas':
        return <AtlasView />;
      case 'tools-qalam':
        return <QalamView />;
      case 'tools-khatam':
        return <KhatamView />;
      case 'tools-plate':
        return <PlateView />;
      case 'tools-works':
        return <WorksView />;
      case 'tools-bakhur-adad':
        return <BakhurAdadView />;
      case 'tools-shurut':
        return <ShurutView />;
      case 'tools-glossary':
        return <GlossaryView />;
      case 'info':
        return <InfoView />;
      case 'admin':
        return (
          <Suspense fallback={<ViewLoading />}>
            <AdminView />
          </Suspense>
        );
      default:
        return <HomeView />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex flex-col selection:bg-[var(--gold)] selection:text-black">
        {/* Toast Notifications */}
        <ToastContainer
          toasts={appState.toasts}
          onDismiss={(id) => appState.removeToast(id)}
        />

        {/* Main Top Header Navigation */}
        <Navbar />

        {/* Main Content Body */}
        <main className={`flex-1 w-full max-w-7xl mx-auto ${
          appState.route.view === 'read'
            ? 'px-1.5 sm:px-6 lg:px-8 py-2 sm:py-8'
            : 'px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
        }`}>
          <ErrorBoundary>
            {renderView()}
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
