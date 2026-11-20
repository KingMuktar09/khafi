import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Layers,
  FileText,
  ChevronRight,
  Sparkles,
  Compass,
  Instagram,
  Search,
  Moon,
  Eye,
} from 'lucide-react';
import { appState } from '../state/appState';
import { router } from '../router/router';
import { siteConfig } from '../config/siteConfig';
import { CompactAdvisoryBanner } from '../components/ui/CompactAdvisoryBanner';
import { WisdomOfTheDay } from '../components/special/WisdomOfTheDay';
import { HijriDate } from '../components/special/HijriDate';
import { ReadingStats } from '../components/special/ReadingStats';
import { RandomBookCard } from '../components/books/RandomBookCard';
import { localizeJourney, resolveJourneys, journeyProgress } from '../data/specialFeatures';
import { getTopicOfTheDay, formatTopicDate, topicRouteFor } from '../data/topicsContent';
import { greetingForHour } from '../utils/greeting';
import { t, tf } from '../data/i18n';
import { HomeSkyCards } from '../components/special/HomeSkyCards';
import { HomeReckonBox } from '../components/special/HomeReckonBox';

export const HomeView: React.FC = () => {
  // Browse by topic and category, NOT by folders: the folders only say
  // where a file lives on Drive, they are never the way to find a book.
  const categories = appState.getCategories();
  const topics = appState.getTopics();
  const allBooks = appState.getVisibleBooks();
  const booksInProgress = appState.getBooksInProgress();
  const lang = appState.settings.language;
  const journeys = resolveJourneys(allBooks).map((j) => localizeJourney(j, lang));
  const topicOfTheDay = getTopicOfTheDay(new Date());

  // Recent books (sorted by id or added date if available)
  const recentBooks = [...allBooks].slice(0, 5);
  // Show every category as its own card — including the Ahmad al-Buni
  // Collection — so no collection hides behind a "view all" button.
  const shownCategories = categories;
  const [homeSearch, setHomeSearch] = useState('');

  const submitHomeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = homeSearch.trim();
    if (!q) return;
    appState.setGlobalSearchQuery(q);
    router.navigate('library', { searchQuery: q });
  };

  const greeting = greetingForHour(new Date().getHours(), lang);

  return (
    <div className="space-y-6 animate-fade-in py-2 font-sans">
      
      {/* Hero — Ilm-e-Ghayb Library */}
      <div className="hero-glow hero-sheen ms-panel rounded-2xl p-6 sm:p-10 shadow-2xl">
        <div aria-hidden="true" className="halftone halftone-corner" />
        <div className="max-w-2xl space-y-4">
          {/* Official logo, whole and centred in its square frame */}
          <img
            src={siteConfig.logo}
            alt={t('home.logoAltLong', lang)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[var(--gold)]/40 shadow-lg shadow-black/40 animate-fade-up"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ animationDelay: '0ms' }}
          />
          <div className="flex flex-wrap items-center gap-2 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full flex items-center gap-1.5 tracking-wide">
              <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Ghayb Chronicles • {t('home.hero.eyebrow', lang)}</span>
            </span>
            <HijriDate />
          </div>
          {/* Big greeting, in large display serif. The `ms-greeting` class is
              the hook for the soft gold glow added by the animation pass. */}
          <p className="ms-greeting font-display font-semibold text-4xl sm:text-5xl text-[var(--text-main)] leading-[1.05] animate-fade-up" style={{ animationDelay: '20ms' }}>
            {greeting}.
          </p>
          <p className="ms-eyebrow animate-fade-up" style={{ animationDelay: '40ms' }}>{t('home.hero.tagline', lang)}</p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--text-main)] leading-[1.05] animate-fade-up" style={{ animationDelay: '70ms' }}>
            Ilm-e-Ghayb <span className="gold-shimmer">Library</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: '140ms' }}>
            {t('home.hero.intro1', lang)}
          </p>
          <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: '170ms' }}>
            {t('home.hero.intro2', lang)}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 animate-fade-up" style={{ animationDelay: '210ms' }}>
            <button
              onClick={() => router.navigate('library')}
              className="tap-target px-5 py-3 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('home.hero.browse', lang)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://instagram.com/ghayb.chronicles"
              target="_blank"
              rel="noreferrer"
              className="tap-target px-5 py-3 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Instagram className="w-4 h-4 text-[var(--gold)]" />
              <span>{t('home.hero.follow', lang)}</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 border-t border-[var(--border-subtle)] animate-fade-up" style={{ animationDelay: '280ms' }}>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{categories.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">{t('home.hero.statCategories', lang)}</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{allBooks.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">{t('gate.books', lang)}</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{topics.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">{t('home.hero.statBookTopics', lang)}</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--gold)]">{t('gate.free', lang)}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">{t('gate.afterFollow', lang)}</p>
            </div>
          </div>

          {/* Big search — find a book by title, topic or collection, in one tap. */}
          <form onSubmit={submitHomeSearch} className="relative pt-1 animate-fade-up" style={{ animationDelay: '340ms' }} role="search">
            <Search className="w-5 h-5 text-[var(--gold)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              placeholder={t('home.hero.searchPlaceholder', lang)}
              aria-label={t('home.hero.searchAria', lang)}
              className="tap-target w-full pl-11 pr-24 py-3.5 text-sm sm:text-base bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-xl focus:outline-none focus:border-[var(--gold)] shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs sm:text-sm rounded-lg cursor-pointer transition-colors"
            >
              {t('home.hero.searchButton', lang)}
            </button>
          </form>
        </div>
      </div>

      {/* The sky right now: live stat cards, then the reckon box. */}
      <HomeSkyCards />
      <HomeReckonBox />

      {/* Continue Reading Section (If books are in progress) */}
      {booksInProgress.length > 0 && (
        <section className="space-y-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-semibold text-base text-[var(--text-main)] flex items-center gap-2">
              <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                <Clock className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <span>{t('home.continue.title', lang)}</span>
            </h2>
            <button
              onClick={() => router.navigate('favorites')}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <span>{t('home.continue.viewHistory', lang)}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {booksInProgress.slice(0, 3).map(({ book, progress }, i) => (
              <div
                key={book.id}
                onClick={() => router.navigate('read', { bookId: book.id })}
                style={{ '--motion-i': i } as React.CSSProperties}
                className="motion-item motion-card p-3.5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/40 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-2.5 flex flex-col justify-between shadow-2xs group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-11 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg flex items-center justify-center shrink-0 text-[var(--gold)] group-hover:scale-105 group-hover:border-[var(--gold)]/50 transition-all shadow-2xs">
                    <FileText className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors truncate">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                      {book.author}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-medium">
                    <span>
                      {t('home.continue.progress', lang)}
                      {progress.currentPage ? ` • ${progress.totalPages ? tf('home.continue.pageOf', lang, { page: progress.currentPage, total: progress.totalPages }) : tf('home.continue.pageOnly', lang, { page: progress.currentPage })}` : ''}
                      {appState.getBookmarksForBook(book.id).length > 0 ? ` • ${appState.getBookmarksForBook(book.id).length === 1 ? tf('home.continue.bookmarksOne', lang, { n: appState.getBookmarksForBook(book.id).length }) : tf('home.continue.bookmarksMany', lang, { n: appState.getBookmarksForBook(book.id).length })}` : ''}
                    </span>
                    <span className="font-bold text-[var(--gold)]">{progress.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <div
                      className="h-full bg-[var(--gold)] transition-all duration-300 rounded-full"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Wisdom of the Day — one teaching a day, from a real book here. */}
      <WisdomOfTheDay />

      {/* Reading Stats — local only: shelf, progress, journeys, streak. */}
      <ReadingStats />

      {/* Surprise Me — one-tap random real book. */}
      <RandomBookCard />

      {/* Tools — the special things no normal library has. */}
      <section className="space-y-3 animate-fade-up">
        <div className="px-1">
          <h2 className="font-display font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
            <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            </div>
            <span>{t('home.tools.title', lang)}</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {t('home.tools.blurb', lang)}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: t('nav.myShelf', lang), blurb: t('home.tools.shelfBlurb', lang), view: 'shelf' as const },
            { title: t('home.tools.findTitle', lang), blurb: t('home.tools.findBlurb', lang), view: 'finder' as const },
            { title: t('nav.magicSquareMaker', lang), blurb: t('home.tools.squareBlurb', lang), view: 'wafq' as const },
            { title: t('home.tools.amalsTitle', lang), blurb: t('home.tools.amalsBlurb', lang), view: 'amals' as const },
          ].map((tool) => (
            <div
              key={tool.view}
              onClick={() => router.navigate(tool.view)}
              className="motion-item card-lift p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-2 group shadow-2xs"
            >
              <h3 className="font-display font-semibold text-base text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors flex items-center justify-between gap-2">
                <span>{tool.title}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--gold)] shrink-0" />
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{tool.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topic of the Day: one pre-made topic per day, in fixed order. */}
      <section className="space-y-3 animate-fade-up" style={{ animationDelay: '90ms' }}>
        <div
          onClick={() => router.navigate(topicRouteFor(topicOfTheDay.topic.id))}
          className="motion-item card-lift p-5 bg-[var(--bg-surface)] border border-[var(--gold)]/40 hover:border-[var(--gold)] rounded-xl cursor-pointer space-y-2 shadow-2xs"
        >
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--gold)] font-semibold">
            {tf('home.topic.label', lang, { day: topicOfTheDay.dayNumber, date: formatTopicDate(topicOfTheDay.date) })}
          </p>
          <h2 className="font-display font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
            <span>{topicOfTheDay.topic.title}</span>
            <ArrowRight className="w-4 h-4 text-[var(--gold)] shrink-0" aria-hidden="true" />
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">{topicOfTheDay.topic.subtitle}</p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-[var(--gold)] font-medium">{t('home.topic.readToday', lang)}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.navigate('topics');
              }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{t('home.topic.allTopics', lang)}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Guided Reading Journeys — paths through real books, with progress. */}
      <section className="space-y-3 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-display font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
              <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                <Compass className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <span>{t('nav.readingPaths', lang)}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {t('home.journey.subtitle', lang)}
            </p>
          </div>
          <button
            onClick={() => router.navigate('journeys')}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{t('home.journey.allJourneys', lang)}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {journeys.slice(0, 3).map((journey) => {
            const done = appState.getJourneyDone(journey.id);
            const pct = journeyProgress(done, journey);
            return (
              <div
                key={journey.id}
                onClick={() => router.navigate('journeys')}
                className="motion-item card-lift p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-3 group shadow-2xs"
              >
                <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full">
                  {journey.level} • {tf('home.journey.booksCount', lang, { n: journey.steps.length })}
                </span>
                <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors">
                  {journey.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">{journey.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-medium">
                    <span>{tf('home.journey.readCount', lang, { done: done.length, total: journey.steps.length })}</span>
                    <span className="font-bold text-[var(--gold)]">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <div className="h-full bg-[var(--gold)] transition-all duration-300 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 px-1">
          <button
            onClick={() => router.navigate('timeline')}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{t('home.journey.knowledgeMap', lang)}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Main Collections Hub */}
      <section className="space-y-3 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-display font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
              <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                <Layers className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <span>{t('home.category.title', lang)}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {t('home.category.subtitle', lang)}
            </p>
          </div>

          <button
            onClick={() => router.navigate('library')}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{t('home.category.allBooks', lang)}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* All Books — flat view, every book in 1 tap, no folders to open. */}
          <div
            onClick={() => router.navigate('library')}
            className="motion-item card-lift p-5 bg-[var(--gold-faint)] border border-[var(--gold)]/40 hover:border-[var(--gold)] rounded-xl cursor-pointer space-y-3 group shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-[var(--gold)] flex items-center justify-center text-black group-hover:scale-110 transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] px-2.5 py-0.5 bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-main)] rounded-full font-medium flex items-center gap-1">
                <Layers className="w-3 h-3 text-[var(--gold)]" />
                <span>{tf('home.category.bookCountMany', lang, { n: allBooks.length })}</span>
              </span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors flex items-center justify-between gap-2">
                <span className="min-w-0 truncate">{t('home.category.allBooks', lang)}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--gold)] shrink-0" />
              </h3>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                {t('home.category.allBooksBlurb', lang)}
              </p>
            </div>
          </div>
          {shownCategories.map((category, i) => {
            const count = allBooks.filter((b) => b.category === category).length;
            const categoryTopics = appState.getTopicsForCategory(category).slice(0, 3);
            return (
              <div
                key={category}
                onClick={() => router.navigate('library', { category })}
                style={{ '--motion-i': Math.min(i, 11) } as React.CSSProperties}
                className="motion-item card-lift p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-3 group shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] group-hover:scale-110 group-hover:border-[var(--gold)] transition-all">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-main)] rounded-full font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[var(--gold)]" />
                    <span>{count === 1 ? tf('home.category.bookCountOne', lang, { n: count }) : tf('home.category.bookCountMany', lang, { n: count })}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate">{category}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--gold)] shrink-0" />
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                    {categoryTopics.length > 0 ? categoryTopics.join(' • ') : t('home.category.booksFallback', lang)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {categories.length > shownCategories.length && (
          <div className="flex justify-center pt-1">
            <button
              onClick={() => router.navigate('library')}
              className="tap-target px-5 py-2.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{tf('home.category.viewAll', lang, { n: categories.length })}</span>
              <ArrowRight className="w-4 h-4 text-[var(--gold)]" />
            </button>
          </div>
        )}
      </section>

      {/* Ghayb Chronicles — the channel behind the library */}
      <section className="hero-glow relative overflow-hidden ms-panel rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-up" style={{ animationDelay: '170ms' }}>
        <div aria-hidden="true" className="halftone halftone-corner" />
        <div className="flex items-center gap-3">
          <img
            src={siteConfig.logo}
            alt=""
            className="w-10 h-10 rounded-lg object-cover border border-[var(--gold)]/40 shadow-md shadow-black/40 shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full tracking-wide">
            Ghayb Chronicles
          </span>
        </div>
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] mt-3 leading-tight">
          {t('home.channel.titleA', lang)} <span className="gold-shimmer">{t('home.channel.titleB', lang)}</span>
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl mt-2">
          {t('home.channel.intro', lang)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
            <Moon className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-semibold text-sm text-[var(--text-main)] mt-2">{t('home.channel.sufiTitle', lang)}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
              {t('home.channel.sufiBlurb', lang)}
            </p>
          </div>
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
            <Eye className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-semibold text-sm text-[var(--text-main)] mt-2">{t('home.channel.sourcesTitle', lang)}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
              {t('home.channel.sourcesBlurb', lang)}
            </p>
          </div>
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
            <BookOpen className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-semibold text-sm text-[var(--text-main)] mt-2">{t('home.channel.connectTitle', lang)}</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
              {t('home.channel.connectBlurb', lang)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <a
            href="https://instagram.com/ghayb.chronicles"
            target="_blank"
            rel="noreferrer"
            className="tap-target px-5 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg"
            style={{ background: 'linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}
          >
            <Instagram className="w-4 h-4" />
            <span>{t('home.hero.follow', lang)}</span>
          </a>
          <button
            onClick={() => router.navigate('library')}
            className="tap-target px-5 py-3 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[var(--gold)]" />
            <span>{t('home.channel.readBooks', lang)}</span>
          </button>
        </div>
      </section>

      {/* Catalog Highlights / Recent Volumes */}
      {recentBooks.length > 0 && (
        <section className="space-y-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-display font-semibold text-base text-[var(--text-main)] flex items-center gap-2">
                <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                  <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                </div>
                <span>{t('home.highlights.title', lang)}</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {t('home.highlights.subtitle', lang)}
              </p>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl overflow-hidden text-xs shadow-2xs">
            <div className="divide-y divide-[var(--border-subtle)]">
              {recentBooks.map((book, i) => (
                <div
                  key={book.id}
                  onClick={() => router.navigate('book', { bookId: book.id })}
                  style={{ '--motion-i': Math.min(i, 11) } as React.CSSProperties}
                  className="motion-item p-3.5 flex items-center justify-between gap-4 hover:bg-[var(--bg-hover)] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-10 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg flex items-center justify-center text-[var(--gold)] shrink-0 group-hover:border-[var(--gold)]/50 transition-colors shadow-2xs">
                      <FileText className="w-4 h-4 text-[var(--gold)]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors truncate">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                        {book.author} • <span className="text-[var(--gold)] font-medium">{book.category}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline font-medium">
                      {book.pageCount ? tf('home.highlights.pages', lang, { n: book.pageCount }) : t('home.highlights.document', lang)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--gold)] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reader Advisory Banner */}
      <CompactAdvisoryBanner />

      {/* Bottom Banner — browse by topic, not by directory */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-center sm:text-left">
          <BookOpen className="w-4 h-4 text-[var(--gold)] shrink-0 hidden sm:block" />
          <span>{t('home.bottom.question', lang)}</span>
        </div>
        <button
          onClick={() => router.navigate('library')}
          className="px-3.5 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>{t('home.bottom.explore', lang)}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--gold)]" />
        </button>
      </div>

    </div>
  );
};
