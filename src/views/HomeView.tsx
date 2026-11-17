import React from 'react';
import {
  Folder as FolderIcon,
  BookOpen,
  ArrowRight,
  Clock,
  Layers,
  FileText,
  ChevronRight,
  Sparkles,
  Compass,
  FolderTree,
  Instagram,
} from 'lucide-react';
import { appState } from '../state/appState';
import { router } from '../router/router';
import { CompactAdvisoryBanner } from '../components/ui/CompactAdvisoryBanner';

export const HomeView: React.FC = () => {
  // The catalog has one root collection ("All Islamic History Books"); show its
  // categories as the collections on the home page.
  const roots = appState.getChildFolders(null);
  const collections = roots.length === 1 ? appState.getChildFolders(roots[0].id) : roots;
  const rootFolderId = roots.length === 1 ? roots[0].id : null;
  const allBooks = appState.getVisibleBooks();
  const booksInProgress = appState.getBooksInProgress();
  const subCollections = collections.reduce(
    (n, f) => n + appState.getChildFolders(f.id).length,
    0
  );

  // Recent books (sorted by id or added date if available)
  const recentBooks = [...allBooks].slice(0, 5);
  const shownCollections = collections.slice(0, 9);

  return (
    <div className="space-y-6 animate-fade-in py-2 font-sans">
      
      {/* Hero — Ilm-e-Ghayb Library */}
      <div className="hero-glow bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-6 sm:p-10 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 bg-[var(--gold-faint)] border border-[var(--gold)]/30 text-[var(--gold)] font-semibold rounded-full flex items-center gap-1.5 tracking-wide">
              <Compass className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Ghayb Chronicles • Islamic esoteric knowledge</span>
            </span>
          </div>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--text-main)] leading-[1.05]">
            Ilm-e-Ghayb <span className="text-[var(--gold)]">Library</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
            Hidden knowledge, Sufi wisdom, and the books behind it. Quran, Tafseer,
            Hadith, Seerah and history — with sources in every entry.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => router.navigate('library', rootFolderId ? { folderId: rootFolderId } : undefined)}
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

          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 border-t border-[var(--border-subtle)]">
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{collections.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Collections</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{allBooks.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Books</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--text-main)]">{subCollections}</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Sub-collections</p>
            </div>
            <div>
              <p className="font-display font-semibold text-2xl text-[var(--gold)]">Free</p>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">After follow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Reading Section (If books are in progress) */}
      {booksInProgress.length > 0 && (
        <section className="space-y-3">
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
            {booksInProgress.slice(0, 3).map(({ book, progress }) => (
              <div
                key={book.id}
                onClick={() => router.navigate('read', { bookId: book.id })}
                className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/40 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer transition-all space-y-2.5 flex flex-col justify-between shadow-2xs group"
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
                    <span>Progress</span>
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

      {/* Main Collections Hub */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-semibold text-lg text-[var(--text-main)] flex items-center gap-2">
              <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                <Layers className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <span>Library Collections</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Primary canonical categories and research archives.
            </p>
          </div>

          <button
            onClick={() => router.navigate('library')}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>All Collections</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shownCollections.map((folder) => {
            const itemCount = appState.getItemCountForFolder(folder.id);
            return (
              <div
                key={folder.id}
                onClick={() => router.navigate('library', { folderId: folder.id })}
                className="card-lift p-5 bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 hover:bg-[var(--bg-hover)] rounded-xl cursor-pointer space-y-3 group shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] group-hover:scale-110 group-hover:border-[var(--gold)] transition-all">
                    <FolderIcon className="w-5 h-5 fill-[var(--gold)]/20" />
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-main)] rounded-full font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[var(--gold)]" />
                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate">{folder.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--gold)] shrink-0" />
                  </h3>
                  {folder.description && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                      {folder.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {collections.length > shownCollections.length && (
          <div className="flex justify-center pt-1">
            <button
              onClick={() => router.navigate('library', rootFolderId ? { folderId: rootFolderId } : undefined)}
              className="tap-target px-5 py-2.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/50 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View all {collections.length} collections</span>
              <ArrowRight className="w-4 h-4 text-[var(--gold)]" />
            </button>
          </div>
        )}
      </section>

      {/* Catalog Highlights / Recent Volumes */}
      {recentBooks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-semibold text-base text-[var(--text-main)] flex items-center gap-2">
                <div className="p-1 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)]">
                  <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                </div>
                <span>Catalog Highlights</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Featured volumes and recent submissions.
              </p>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl overflow-hidden text-xs shadow-2xs">
            <div className="divide-y divide-[var(--border-subtle)]">
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => router.navigate('book', { bookId: book.id })}
                  className="p-3.5 flex items-center justify-between gap-4 hover:bg-[var(--bg-hover)] cursor-pointer transition-colors group"
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

      {/* Bottom Directory Banner */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-center sm:text-left">
          <FolderTree className="w-4 h-4 text-[var(--gold)] shrink-0 hidden sm:block" />
          <span>Looking for full file manager view, format filtering, and directory search?</span>
        </div>
        <button
          onClick={() => router.navigate('library')}
          className="px-3.5 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>Explore Directory</span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--gold)]" />
        </button>
      </div>

    </div>
  );
};
