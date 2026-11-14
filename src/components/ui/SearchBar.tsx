import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { appState } from '../../state/appState';
import { router } from '../../router/router';
import { Book } from '../../types';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Execute search command...',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(appState.searchQuery || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(appState.searchQuery || '');
  }, [appState.searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    appState.setGlobalSearchQuery(val);
    setIsOpen(val.trim().length > 0);
  };

  const clearQuery = () => {
    setQuery('');
    appState.setGlobalSearchQuery('');
    setIsOpen(false);
  };

  const trimmed = query.trim().toLowerCase();
  const visibleBooks = appState.getVisibleBooks();
  
  const results: Book[] = trimmed
    ? visibleBooks.filter((book) => {
        return (
          book.title.toLowerCase().includes(trimmed) ||
          book.author.toLowerCase().includes(trimmed) ||
          book.category.toLowerCase().includes(trimmed) ||
          (book.description || '').toLowerCase().includes(trimmed) ||
          (book.tags || []).some((t) => t.toLowerCase().includes(trimmed))
        );
      })
    : [];

  const handleSelectBook = (bookId: string) => {
    setIsOpen(false);
    router.navigate('book', { bookId });
  };

  const handleExecuteQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.navigate('library', { searchQuery: query.trim() });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleExecuteQuery} className="flex border border-white/15 bg-white/[0.02]">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-white/30 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsOpen(query.trim().length > 0)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full bg-transparent border-none text-lg sm:text-xl outline-none pl-12 pr-10 py-3.5 text-white font-sans placeholder:text-white/30"
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-3 p-1 text-white/40 hover:text-white transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-[#E2FF00] hover:bg-[#d8f500] text-black font-mono font-bold text-xs sm:text-sm px-6 uppercase tracking-wider transition-colors cursor-pointer shrink-0"
        >
          Query
        </button>
      </form>

      {/* Live Search Results Dropdown */}
      {isOpen && trimmed.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-[#0d0d0d] border border-white/20 shadow-2xl overflow-hidden animate-fade-in max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div>
              <div className="px-4 py-2 bg-white/5 font-mono text-[10px] text-[#E2FF00] font-bold uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                <span>QUERY_MATCHES ({results.length})</span>
                <span className="text-white/30 font-normal">[ PRESS_ENTER ]</span>
              </div>
              <div className="divide-y divide-white/5">
                {results.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleSelectBook(book.id)}
                    className="w-full text-left p-3.5 hover:bg-white/5 transition-colors flex items-center justify-between gap-4 group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[9px] text-[#E2FF00] font-bold tracking-widest uppercase block mb-0.5">
                        / {book.category}
                      </span>
                      <h4 className="text-sm font-sans font-bold text-white group-hover:text-[#E2FF00] truncate transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs font-mono text-white/40 truncate">
                        BY {book.author}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#E2FF00] shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center font-mono text-xs text-white/40">
              [ NO_QUERY_MATCHES_FOUND ]
            </div>
          )}
        </div>
      )}
    </div>
  );
};
