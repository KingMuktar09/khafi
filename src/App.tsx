import React, { useEffect, useState } from 'react';
import { appState } from './state/appState';
import { storage } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { FollowGate } from './components/ui/FollowGate';

// Import Views
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { BookDetailsView } from './views/BookDetailsView';
import { PdfReaderView } from './views/PdfReaderView';
import { FavoritesView } from './views/FavoritesView';
import { InfoView } from './views/InfoView';
import { AdminView } from './views/AdminView';

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
    const books = appState.getVisibleBooks();
    const roots = appState.getChildFolders(null);
    const categories = roots.length === 1 ? appState.getChildFolders(roots[0].id).length : roots.length;
    return (
      <ErrorBoundary>
        <FollowGate
          bookCount={books.length}
          categoryCount={categories}
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
        return <PdfReaderView />;
      case 'favorites':
        return <FavoritesView />;
      case 'info':
        return <InfoView />;
      case 'admin':
        return <AdminView />;
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
