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
import { JOURNEYS, resolveJourneys, journeyProgress } from '../data/specialFeatures';

export const HomeView: React.FC = () => {
  // Browse by topic and category, NOT by folders: the folders only say
  // where a file lives on Drive, they are never the way to find a book.
  const categories = appState.getCategories();
  const topics = appState.getTopics();
  const allBooks = appState.getVisibleBooks();
  const booksInProgress = appState.getBooksInProgress();
  const journeys = resolveJourneys(allBooks);

  // Recent books (sorted by id or added date if available)
  const recentBooks = [...allBooks].slice(0, 5);
  const shownCategories = categories.slice(0, 9);
  const [homeSearch, setHomeSearch] = useState('');

  const submitHomeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = homeSearch.trim();
    if (!q) return;
    appState.setGlobalSearchQuery(q);
    router.navigate('library', { searchQuery: q });
  };

  return (
    <div className="space-y-6 animate-fade-in py-2 font-sans">
      
      {/* Hero — Ilm-e-Ghayb Library */}
      <div className="hero-glow hero-sheen bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-6 sm:p-10 shadow-2xl">
        <div aria-hidden="true" className="halftone halftone-corner" />
        <div className="max-w-2xl space-y-4">
          {/* Official logo, whole and centred in its square frame */}
          <img
            src={siteConfig.logo}
            alt="Ilm-e-Ghayb Library logo — halftone gold arch doorway with a geometric star"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[var(--gold)]/40 shadow-lg shadow-black/40 animate-fade-up"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ animationDelay: '0ms' }}
          />
          <div className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full flex items-center gap-1.5 tracking-wide">
              <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Ghayb Chronicles • Islamic history and wisdom</span>
            </span>
            <HijriDate />
          </div>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--text-main)] leading-[1.05] animate-fade-up" style={{ animationDelay: '70ms' }}>
            Ilm-e-Ghayb <span className="gold-shimmer">Library</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: '140ms' }}>
            Hidden knowledge, Sufi wisdom, and the books behind it: the Quran (the Muslim holy book), Tafseer
            (explaining the Quran), Hadith (the Prophet's sayings), Seerah (the Prophet's life), and history —
            with sources in every entry.
          </p>
          <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: '170ms' }}>
            Everyone is welcome here — you don't need to be Muslim to read and learn.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 animate-fade-up" style={{ animationDelay: '210ms' }}>
            <button
              onClick={() => router.navigate('library')}
              className="tap-target px-5 py-3 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse the Library</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://instagram.com/ghayb.chronicles"
              target="_blank"
              rel="noreferrer"
              className="tap-target px-5 py-3 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Instagram className="w-4 h-4 text-[var(--gold)]" />
              <span>Follow @ghayb.chronicles</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 border-t border-[var(--border-subtle)] animate-fade-up" style={{ animationDelay: '280ms' }}>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{categories.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Categories</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{allBooks.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Books</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{topics.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Topics</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--gold)]">Free</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">After follow</p>
            </div>
          </div>

          {/* Big search — find a book by title, topic or collection, in one tap. */}
          <form onSubmit={submitHomeSearch} className="relative pt-1 animate-fade-up" style={{ animationDelay: '340ms' }} role="search">
            <Search className="w-5 h-5 text-[var(--gold)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
              placeholder="Search books — try “Sufi”, “Tafsir”, “Ibn Kathir” or “notes”…"
              aria-label="Search books by title, author or topic"
              className="tap-target w-full pl-11 pr-24 py-3.5 text-sm sm:text-base bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-xl focus:outline-none focus:border-[var(--gold)] shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs sm:text-sm rounded-lg cursor-pointer transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Continue Reading Section (If books are in progress) */}
      {booksInProgress.length > 0 && (
        <section className="space-y-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold text-base text-[var(--text-main)] flex items-center gap-2">
              <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                <Clock className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <span>Continue Reading</span>
            </h2>
            <button
              onClick={() => router.navigate('favorites')}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <span>View History</span>
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
                      Progress
                      {progress.currentPage ? ` • page ${progress.currentPage}${progress.totalPages ? ` of ${progress.totalPages}` : ''}` : ''}
                      {appState.getBookmarksForBook(book.id).length > 0 ? ` • ${appState.getBookmarksForBook(book.id).length} bookmark${appState.getBookmarksForBook(book.id).length === 1 ? '' : 's'}` : ''}
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
          <h2 className="font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
            <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            </div>
            <span>Tools</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Made for this library — your shelf, a book finder, the magic square maker, and daily amals.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: 'My Shelf', blurb: 'Save books with a status — To Read, Reading, Finished.', view: 'shelf' as const },
            { title: 'Find My Next Book', blurb: 'Three quick questions, three real books for your mood.', view: 'finder' as const },
            { title: 'Magic Square Maker', blurb: 'Build a magic number square — 3×3, 4×4, 5×5 or 7×7 — and check every row adds up.', view: 'wafq' as const },
            { title: 'Daily Amals', blurb: 'Small daily practices — tick them off, keep your streak going.', view: 'amals' as const },
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

      {/* Guided Reading Journeys — paths through real books, with progress. */}
      <section className="space-y-3 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
              <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                <Compass className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <span>Reading Paths</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              A path through the books, in order, with your place saved.
            </p>
          </div>
          <button
            onClick={() => router.navigate('journeys')}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>All journeys</span>
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
                  {journey.level} • {journey.steps.length} books
                </span>
                <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors">
                  {journey.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">{journey.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-medium">
                    <span>{done.length} of {journey.steps.length} read</span>
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
            <span>Or see the Knowledge Map — the masters in order of time</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Main Collections Hub */}
      <section className="space-y-3 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
              <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                <Layers className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <span>Browse by Category</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Topics and categories — not folders. Tap a card to see its books.
            </p>
          </div>

          <button
            onClick={() => router.navigate('library')}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>All Books</span>
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
                <span>{allBooks.length} books</span>
              </span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors flex items-center justify-between gap-2">
                <span className="min-w-0 truncate">All Books</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--gold)] shrink-0" />
              </h3>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                Every book in the library, flat — tap a category chip to filter, tap a book to open it. No folders to dig through.
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
                    <span>{count} {count === 1 ? 'book' : 'books'}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate">{category}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--gold)] shrink-0" />
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                    {categoryTopics.length > 0 ? categoryTopics.join(' • ') : 'Books in this category.'}
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
              <span>View all {categories.length} categories</span>
              <ArrowRight className="w-4 h-4 text-[var(--gold)]" />
            </button>
          </div>
        )}
      </section>

      {/* Ghayb Chronicles — the channel behind the library */}
      <section className="hero-glow relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--gold)]/30 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-up" style={{ animationDelay: '170ms' }}>
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
          The channel behind the <span className="gold-shimmer">library</span>
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl mt-2">
          Ghayb Chronicles is a channel about Islamic history and wisdom — Sufism (the spiritual side of
          Islam), hidden knowledge, and the old books behind it. Every reel and post is
          built from real sources, with the source named in every entry, so you
          can check it yourself instead of taking our word for it.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
            <Moon className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-semibold text-sm text-[var(--text-main)] mt-2">Sufism — the spiritual path</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
              Sufism is the spiritual side of Islam. Ibn Arabi, Rumi, Attar and Ghazali — their ideas, in simple words.
            </p>
          </div>
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
            <Eye className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-semibold text-sm text-[var(--text-main)] mt-2">Sources in every entry</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
              History, religious teachings, literary stories and theories are kept separate — and cited.
            </p>
          </div>
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl">
            <BookOpen className="w-5 h-5 text-[var(--gold)]" />
            <h3 className="font-semibold text-sm text-[var(--text-main)] mt-2">How the library connects</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
              The books quoted in the channel live here. Read the full book behind any reel, free after follow.
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
            <span>Follow @ghayb.chronicles</span>
          </a>
          <button
            onClick={() => router.navigate('library')}
            className="tap-target px-5 py-3 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[var(--gold)]" />
            <span>Read the books</span>
          </button>
        </div>
      </section>

      {/* Catalog Highlights / Recent Volumes */}
      {recentBooks.length > 0 && (
        <section className="space-y-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-semibold text-base text-[var(--text-main)] flex items-center gap-2">
                <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                  <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                </div>
                <span>Catalog Highlights</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Some books to start with.
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
                      {book.pageCount ? `${book.pageCount} pages` : 'Document'}
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
          <span>Looking for a book by topic or category, with search and filters?</span>
        </div>
        <button
          onClick={() => router.navigate('library')}
          className="px-3.5 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>Explore All Books</span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--gold)]" />
        </button>
      </div>

    </div>
  );
};
