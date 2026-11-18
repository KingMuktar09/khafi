import React, { useEffect, useState, lazy, Suspense } from 'react';
import { appState } from './state/appState';
import { storage } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { FollowGate } from './components/ui/FollowGate';
import { siteConfig } from './config/siteConfig';

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

// Study tools (Phase 1): calculators + device-only tools, behind the gate.
import { ToolsHubView } from './views/tools/ToolsHubView';
import { HurufView } from './views/tools/HurufView';
import { AsmaView } from './views/tools/AsmaView';
import { BastView } from './views/tools/BastView';
import { JournalView } from './views/tools/JournalView';
import { WirdView } from './views/tools/WirdView';
import { GrimoireView } from './views/tools/GrimoireView';
import { MethodView } from './views/tools/MethodView';

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

export default function App() {
  const [, setTick] = useState(0);
  const [followUnlocked, setFollowUnlocked] = useState(() => storage.hasFollowUnlocked());

  useEffect(() => {
    const unsubscribeState = appState.subscribe(() => {
      setTick((t) => t + 1);
    });

    return () => {
      unsubscribeState();
    };
  }, []);

  // Instagram follow gate: first screen for new visitors. Admins and the
  // admin sign-in page bypass it; everyone else unlocks by following
  // @ghayb.chronicles and tapping unlock (remembered on this device).
  const isAdmin = appState.adminAuthenticated;
  const showGate =
    !followUnlocked && !isAdmin && appState.route.view !== 'admin';

  if (showGate) {
    // Gate counts: total folders (36, incl. sub-collections) and total
    // visible books (173). While the catalog is still loading, show the
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
      case 'tools':
        return <ToolsHubView />;
      case 'tools-huruf':
        return <HurufView />;
      case 'tools-asma':
        return <AsmaView />;
      case 'tools-bast':
        return <BastView />;
      case 'tools-journal':
        return <JournalView />;
      case 'tools-wird':
        return <WirdView />;
      case 'tools-grimoire':
        return <GrimoireView />;
      case 'tools-method':
        return <MethodView />;
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
