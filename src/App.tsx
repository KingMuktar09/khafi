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

// Import Views — Home stays eager (first paint). Every other view is
// lazy-loaded: the main bundle used to be ~3 MB because all 60+ views
// (Topics, study tools, Journeys, Timeline, Shelf, Finder, Wafq, Amals,
// Library, Book details, Favorites, Info) shipped in the first load.
// Each lazy view downloads only when the reader opens it, so the home
// page loads light on slow phones. Named exports are wrapped so
// React.lazy gets a default export.
import { HomeView } from './views/HomeView';

const LibraryView = lazy(() => import('./views/LibraryView').then((m) => ({ default: m.LibraryView })));
const BookDetailsView = lazy(() => import('./views/BookDetailsView').then((m) => ({ default: m.BookDetailsView })));
const FavoritesView = lazy(() => import('./views/FavoritesView').then((m) => ({ default: m.FavoritesView })));
const InfoView = lazy(() => import('./views/InfoView').then((m) => ({ default: m.InfoView })));
const JourneysView = lazy(() => import('./views/JourneysView').then((m) => ({ default: m.JourneysView })));
const TimelineView = lazy(() => import('./views/TimelineView').then((m) => ({ default: m.TimelineView })));
const ShelfView = lazy(() => import('./views/ShelfView').then((m) => ({ default: m.ShelfView })));
const BookFinderView = lazy(() => import('./views/BookFinderView').then((m) => ({ default: m.BookFinderView })));
const WafqView = lazy(() => import('./views/WafqView').then((m) => ({ default: m.WafqView })));
const AmalsView = lazy(() => import('./views/AmalsView').then((m) => ({ default: m.AmalsView })));
const TopicsHubView = lazy(() => import('./views/topics/TopicsHubView').then((m) => ({ default: m.TopicsHubView })));
const TopicRetreatView = lazy(() => import('./views/topics/TopicRetreatView').then((m) => ({ default: m.TopicRetreatView })));
const TopicMalakutView = lazy(() => import('./views/topics/TopicMalakutView').then((m) => ({ default: m.TopicMalakutView })));
const TopicRuhView = lazy(() => import('./views/topics/TopicRuhView').then((m) => ({ default: m.TopicRuhView })));
const TopicAlifView = lazy(() => import('./views/topics/TopicAlifView').then((m) => ({ default: m.TopicAlifView })));
const TopicSealView = lazy(() => import('./views/topics/TopicSealView').then((m) => ({ default: m.TopicSealView })));
const TopicDreamsView = lazy(() => import('./views/topics/TopicDreamsView').then((m) => ({ default: m.TopicDreamsView })));
const TopicSabaView = lazy(() => import('./views/topics/TopicSabaView').then((m) => ({ default: m.TopicSabaView })));
const TopicKhidrView = lazy(() => import('./views/topics/TopicKhidrView').then((m) => ({ default: m.TopicKhidrView })));
const TopicRijalView = lazy(() => import('./views/topics/TopicRijalView').then((m) => ({ default: m.TopicRijalView })));
const TopicUwaisiView = lazy(() => import('./views/topics/TopicUwaisiView').then((m) => ({ default: m.TopicUwaisiView })));
const TopicRenewalView = lazy(() => import('./views/topics/TopicRenewalView').then((m) => ({ default: m.TopicRenewalView })));
const TopicDrinksView = lazy(() => import('./views/topics/TopicDrinksView').then((m) => ({ default: m.TopicDrinksView })));
const TopicBasmalahView = lazy(() => import('./views/topics/TopicBasmalahView').then((m) => ({ default: m.TopicBasmalahView })));
const TopicKursiView = lazy(() => import('./views/topics/TopicKursiView').then((m) => ({ default: m.TopicKursiView })));
const TopicGreatestNameView = lazy(() => import('./views/topics/TopicGreatestNameView').then((m) => ({ default: m.TopicGreatestNameView })));
const TopicFawatihView = lazy(() => import('./views/topics/TopicFawatihView').then((m) => ({ default: m.TopicFawatihView })));
const TopicTawaqifView = lazy(() => import('./views/topics/TopicTawaqifView').then((m) => ({ default: m.TopicTawaqifView })));
const TopicKhayasView = lazy(() => import('./views/topics/TopicKhayasView').then((m) => ({ default: m.TopicKhayasView })));
const TopicZayirjahView = lazy(() => import('./views/topics/TopicZayirjahView').then((m) => ({ default: m.TopicZayirjahView })));
const TopicIhatahView = lazy(() => import('./views/topics/TopicIhatahView').then((m) => ({ default: m.TopicIhatahView })));
const TopicSimiyaView = lazy(() => import('./views/topics/TopicSimiyaView').then((m) => ({ default: m.TopicSimiyaView })));
const TopicKhalawatView = lazy(() => import('./views/topics/TopicKhalawatView').then((m) => ({ default: m.TopicKhalawatView })));
const QuestionsView = lazy(() => import('./views/topics/QuestionsView').then((m) => ({ default: m.QuestionsView })));
const GuidesView = lazy(() => import('./views/topics/GuidesView').then((m) => ({ default: m.GuidesView })));
const ToolsHubView = lazy(() => import('./views/tools/ToolsHubView').then((m) => ({ default: m.ToolsHubView })));
const HurufView = lazy(() => import('./views/tools/HurufView').then((m) => ({ default: m.HurufView })));
const AsmaView = lazy(() => import('./views/tools/AsmaView').then((m) => ({ default: m.AsmaView })));
const BastView = lazy(() => import('./views/tools/BastView').then((m) => ({ default: m.BastView })));
const FawatihView = lazy(() => import('./views/tools/FawatihView').then((m) => ({ default: m.FawatihView })));
const SawaqitView = lazy(() => import('./views/tools/SawaqitView').then((m) => ({ default: m.SawaqitView })));
const ShieldsView = lazy(() => import('./views/tools/ShieldsView').then((m) => ({ default: m.ShieldsView })));
const JournalView = lazy(() => import('./views/tools/JournalView').then((m) => ({ default: m.JournalView })));
const WirdView = lazy(() => import('./views/tools/WirdView').then((m) => ({ default: m.WirdView })));
const GrimoireView = lazy(() => import('./views/tools/GrimoireView').then((m) => ({ default: m.GrimoireView })));
const MethodView = lazy(() => import('./views/tools/MethodView').then((m) => ({ default: m.MethodView })));
const AboutView = lazy(() => import('./views/tools/AboutView').then((m) => ({ default: m.AboutView })));
const TodayView = lazy(() => import('./views/tools/TodayView').then((m) => ({ default: m.TodayView })));
const HoursView = lazy(() => import('./views/tools/HoursView').then((m) => ({ default: m.HoursView })));
const MoonView = lazy(() => import('./views/tools/MoonView').then((m) => ({ default: m.MoonView })));
const MansionsView = lazy(() => import('./views/tools/MansionsView').then((m) => ({ default: m.MansionsView })));
const FalakView = lazy(() => import('./views/tools/FalakView').then((m) => ({ default: m.FalakView })));
const MajlisView = lazy(() => import('./views/tools/MajlisView').then((m) => ({ default: m.MajlisView })));
const ForgeView = lazy(() => import('./views/tools/ForgeView').then((m) => ({ default: m.ForgeView })));
const QawaidView = lazy(() => import('./views/tools/QawaidView').then((m) => ({ default: m.QawaidView })));
const KitabView = lazy(() => import('./views/tools/KitabView').then((m) => ({ default: m.KitabView })));
const TalasimView = lazy(() => import('./views/tools/TalasimView').then((m) => ({ default: m.TalasimView })));
const AshkalView = lazy(() => import('./views/tools/AshkalView').then((m) => ({ default: m.AshkalView })));
const FigureForgeView = lazy(() => import('./views/tools/FigureForgeView').then((m) => ({ default: m.FigureForgeView })));
const TalismStudioView = lazy(() => import('./views/tools/TalismStudioView').then((m) => ({ default: m.TalismStudioView })));
const HaqaiqView = lazy(() => import('./views/tools/HaqaiqView').then((m) => ({ default: m.HaqaiqView })));
const ShartView = lazy(() => import('./views/tools/ShartView').then((m) => ({ default: m.ShartView })));
const SirrJalilView = lazy(() => import('./views/tools/SirrJalilView').then((m) => ({ default: m.SirrJalilView })));
const DurusView = lazy(() => import('./views/tools/DurusView').then((m) => ({ default: m.DurusView })));
const IndexView = lazy(() => import('./views/tools/IndexView').then((m) => ({ default: m.IndexView })));
const ToolsLibraryView = lazy(() => import('./views/tools/ToolsLibraryView').then((m) => ({ default: m.ToolsLibraryView })));
const AtlasView = lazy(() => import('./views/tools/AtlasView').then((m) => ({ default: m.AtlasView })));
const QalamView = lazy(() => import('./views/tools/QalamView').then((m) => ({ default: m.QalamView })));
const KhatamView = lazy(() => import('./views/tools/KhatamView').then((m) => ({ default: m.KhatamView })));
const PlateView = lazy(() => import('./views/tools/PlateView').then((m) => ({ default: m.PlateView })));
const WorksView = lazy(() => import('./views/tools/WorksView').then((m) => ({ default: m.WorksView })));
const BakhurAdadView = lazy(() => import('./views/tools/BakhurAdadView').then((m) => ({ default: m.BakhurAdadView })));
const ShurutView = lazy(() => import('./views/tools/ShurutView').then((m) => ({ default: m.ShurutView })));
const GlossaryView = lazy(() => import('./views/tools/GlossaryView').then((m) => ({ default: m.GlossaryView })));


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
            <Suspense fallback={<ViewLoading />}>{renderView()}</Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
