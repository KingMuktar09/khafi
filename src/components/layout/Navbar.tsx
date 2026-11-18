import React, { useState } from 'react';
import { Search, Sun, Moon, Lock, ShieldCheck, X, Menu, Settings as SettingsIcon, Home, BookOpen, Star, Info, Instagram, Compass, Map as MapIcon, Bookmark, Grid3X3, MoonStar, Calculator, ChevronDown, NotebookText } from 'lucide-react';
import { router } from '../../router/router';
import { appState } from '../../state/appState';
import { siteConfig } from '../../config/siteConfig';
import { ViewName } from '../../types';
import { SettingsModal } from '../ui/SettingsModal';
import { isTopicsView } from '../../data/topicsContent';

/**
 * Navbar, manuscript style. The old desktop row listed every page in
 * one wide line, so the page overflowed sideways at 1280px
 * (scrollWidth about 1750px). Now the desktop bar shows only the
 * four main pages (Home, Library, Topics, Study Tools) plus a "More"
 * menu that holds the rest, so the bar fits at 1280px and at 390px.
 * Topics is a main page, not a hidden one: it sits in the top row on
 * desktop and near the top of the mobile drawer, and it is open to
 * everyone, so it never waits behind the gate.
 * Nothing about the pages themselves changed — only the bar.
 */
export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(appState.searchQuery || '');
  const currentView = appState.route.view;
  const favoritesCount = appState.getFavoriteBooks().length;
  const shelfCount = Object.keys(appState.shelf).length;
  const theme = appState.theme;
  const isAdmin = appState.adminAuthenticated;
  const userSettings = appState.settings;

  const handleNav = (view: ViewName) => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
    if (view === 'home') {
      router.navigate('home');
    } else if (view === 'library') {
      router.navigate('library');
    } else {
      router.navigate(view);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchVal.trim();
    appState.setGlobalSearchQuery(query);
    router.navigate('library', { searchQuery: query || undefined });
    setMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    appState.setTheme(nextTheme);
  };

  // One desktop link: gold when it is the open page, muted otherwise.
  const desktopLink = (view: ViewName, label: string, icon: React.ReactNode, active: boolean, badge?: number) => (
    <button
      onClick={() => handleNav(view)}
      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
        active
          ? 'bg-[var(--bg-accent)] text-[var(--gold)] font-semibold shadow-2xs border border-[var(--border-main)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-1.5 py-0.2 bg-[var(--gold)] text-black text-xs font-bold rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  // One row inside the "More" menu.
  const moreLink = (view: ViewName, label: string, icon: React.ReactNode, active: boolean, badge?: number) => (
    <button
      onClick={() => handleNav(view)}
      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
        active
          ? 'bg-[var(--bg-accent)] text-[var(--gold)] font-semibold'
          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 bg-[var(--gold)] text-black text-xs font-semibold rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  const moreActive =
    ['journeys', 'timeline', 'shelf', 'finder', 'wafq', 'amals', 'favorites', 'info', 'admin'].includes(currentView);

  return (
    <header className="nav-enter sticky top-0 z-50 w-full bg-[var(--bg-header)] border-b border-[var(--border-main)] transition-colors duration-150 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            <button
              onClick={() => handleNav('home')}
              className="text-left focus:outline-none flex items-center gap-2.5 group cursor-pointer min-w-0"
            >
              <img
                src={siteConfig.logo}
                alt="Ilm-e-Ghayb Library logo"
                className="w-9 h-9 rounded-lg object-cover border border-[var(--border-main)] shadow-2xs group-hover:border-[var(--gold)] group-hover:scale-105 transition-all duration-200 shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="min-w-0">
                <span className="font-display font-semibold text-base sm:text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors block leading-tight truncate">
                  Ilm-e-Ghayb Library
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-normal block">
                  by Ghayb Chronicles
                </span>
              </div>
            </button>
          </div>

          {/* Center: Search Field (Desktop & Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-xs mx-2 relative min-w-0"
          >
            <Search className="w-4 h-4 text-[var(--gold)] absolute left-3 pointer-events-none opacity-80" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search this library..."
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-md focus:outline-none focus:border-[var(--gold)] transition-colors font-sans shadow-2xs"
            />
            {searchVal && (
              <button
                type="button"
                onClick={() => {
                  setSearchVal('');
                  appState.setGlobalSearchQuery('');
                  if (currentView === 'library') {
                    router.navigate('library');
                  }
                }}
                className="absolute right-2.5 p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Right: main pages + "More" menu (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 font-sans text-sm shrink-0">
            {desktopLink('home', 'Home', <Home className="w-4 h-4 text-[var(--gold)]" />, currentView === 'home')}
            {desktopLink(
              'library',
              'Library',
              <BookOpen className="w-4 h-4 text-[var(--gold)]" />,
              currentView === 'library' || currentView === 'book' || currentView === 'read'
            )}
            {desktopLink(
              'tools',
              'Study Tools',
              <Calculator className="w-4 h-4 text-[var(--gold)]" />,
              currentView === 'tools' || currentView.startsWith('tools-')
            )}
            {desktopLink(
              'topics',
              'Topics',
              <NotebookText className="w-4 h-4 text-[var(--gold)]" />,
              isTopicsView(currentView)
            )}

            {/* "More" — every other page, in one menu. */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  moreOpen || moreActive
                    ? 'bg-[var(--bg-accent)] text-[var(--gold)] font-semibold shadow-2xs border border-[var(--border-main)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--gold)] transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <>
                  <button
                    aria-label="Close menu"
                    onClick={() => setMoreOpen(false)}
                    className="fixed inset-0 z-10 cursor-default"
                    tabIndex={-1}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 z-20 ms-panel rounded-xl p-2 space-y-0.5 font-sans text-sm shadow-2xl animate-fade-in">
                    {moreLink('journeys', 'Reading Paths', <Compass className="w-4 h-4 text-[var(--gold)]" />, currentView === 'journeys')}
                    {moreLink('timeline', 'History Timeline', <MapIcon className="w-4 h-4 text-[var(--gold)]" />, currentView === 'timeline')}
                    {moreLink('shelf', 'My Shelf', <Bookmark className="w-4 h-4 text-[var(--gold)]" />, currentView === 'shelf', shelfCount)}
                    {moreLink('finder', 'Find a Book', <Compass className="w-4 h-4 text-[var(--gold)]" />, currentView === 'finder')}
                    {moreLink('wafq', 'Magic Square', <Grid3X3 className="w-4 h-4 text-[var(--gold)]" />, currentView === 'wafq')}
                    {moreLink('amals', 'Amals', <MoonStar className="w-4 h-4 text-[var(--gold)]" />, currentView === 'amals')}
                    {moreLink('favorites', 'Favorites', <Star className="w-4 h-4 fill-amber-400 text-amber-400" />, currentView === 'favorites', favoritesCount)}
                    {moreLink('info', 'Info', <Info className="w-4 h-4 text-blue-400" />, currentView === 'info')}
                    <a
                      href="https://instagram.com/ghayb.chronicles"
                      target="_blank"
                      rel="noreferrer"
                      title="Follow @ghayb.chronicles on Instagram"
                      onClick={() => setMoreOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                    >
                      <Instagram className="w-4 h-4 text-[var(--gold)]" />
                      <span className="flex-1">Instagram</span>
                    </a>
                    {moreLink(
                      'admin',
                      isAdmin ? 'Admin (signed in)' : 'Admin',
                      isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-[var(--gold)]" />,
                      currentView === 'admin'
                    )}
                    <button
                      onClick={() => { setMoreOpen(false); setSettingsOpen(true); }}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                    >
                      <SettingsIcon className="w-4 h-4 text-[var(--gold)]" />
                      <span className="flex-1">Settings</span>
                    </button>
                    <button
                      onClick={() => { setMoreOpen(false); handleThemeToggle(); }}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--gold)]" /> : <Moon className="w-4 h-4 text-[var(--gold)]" />}
                      <span className="flex-1">{theme === 'dark' ? 'Light theme' : 'Dark theme'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleThemeToggle}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--gold)]" /> : <Moon className="w-4 h-4 text-[var(--gold)]" />}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSettingsOpen(true)}
              title="Settings"
              aria-label="Settings"
              className="p-2 text-[var(--text-muted)] rounded hover:bg-[var(--bg-hover)]"
            >
              <SettingsIcon className="w-4 h-4 text-[var(--gold)]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-main)] rounded hover:bg-[var(--bg-hover)]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search this library..."
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-md font-sans"
            />
          </form>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="animate-fade-in lg:hidden bg-[var(--bg-surface)] border-b border-[var(--border-main)] px-4 py-3 space-y-1 font-sans text-sm">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'home' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('library')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'library' || currentView === 'book' || currentView === 'read'
                ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            Library
          </button>

          <button
            onClick={() => handleNav('topics')}
            className={`w-full text-left px-3 py-2 rounded ${
              isTopicsView(currentView) ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Topics
          </button>

          <button
            onClick={() => handleNav('journeys')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'journeys' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Reading Paths
          </button>

          <button
            onClick={() => handleNav('timeline')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'timeline' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            History Timeline
          </button>

          <button
            onClick={() => handleNav('shelf')}
            className={`w-full text-left px-3 py-2 rounded flex items-center justify-between ${
              currentView === 'shelf' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            <span>My Shelf</span>
            {shelfCount > 0 && (
              <span className="px-2 py-0.5 bg-[var(--gold)] text-black text-xs font-semibold rounded-full">
                {shelfCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('finder')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'finder' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Find a Book
          </button>

          <button
            onClick={() => handleNav('wafq')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'wafq' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Magic Square Maker
          </button>

          <button
            onClick={() => handleNav('amals')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'amals' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Amals
          </button>

          <button
            onClick={() => handleNav('tools')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'tools' || currentView.startsWith('tools-') ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Study Tools
          </button>

          <button
            onClick={() => handleNav('favorites')}
            className={`w-full text-left px-3 py-2 rounded flex items-center justify-between ${
              currentView === 'favorites' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="px-2 py-0.5 bg-[var(--gold)] text-black text-xs font-semibold rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('info')}
            className={`w-full text-left px-3 py-2 rounded ${
              currentView === 'info' ? 'bg-[var(--bg-accent)] font-medium text-[var(--text-main)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Info
          </button>

          <button
            onClick={() => handleNav('admin')}
            className={`w-full text-left px-3 py-2 rounded flex items-center justify-between ${
              currentView === 'admin'
                ? 'bg-[var(--gold)] text-black font-semibold'
                : 'text-[var(--text-muted)]'
            }`}
          >
            <span>Admin</span>
            {isAdmin && <span className="text-xs font-medium text-emerald-400">Authenticated</span>}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSettingsOpen(true);
            }}
            className="w-full text-left px-3 py-2 rounded text-[var(--text-muted)] hover:bg-[var(--bg-hover)] flex items-center justify-between"
          >
            <span>Settings</span>
            <SettingsIcon className="w-4 h-4 text-[var(--gold)]" />
          </button>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={userSettings}
      />
    </header>
  );
};
