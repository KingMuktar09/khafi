import React from 'react';
import { BookOpen, ExternalLink, Instagram, Send, User, MapPin, Quote } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { router } from '../router/router';

export const InfoView: React.FC = () => {
  const { creator } = siteConfig;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-6 space-y-2">
        <span className="text-xs px-2.5 py-0.5 bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)] font-semibold rounded">
          About & Creator
        </span>
        <h1 className="font-bold text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
          Ilm-e-Ghayb Library
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
          A personal digital space designed for collecting, organizing, exploring, and preserving sacred, scholarly, and beneficial knowledge.
        </p>
      </div>

      {/* Creator Profile Section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <User className="w-5 h-5 text-[var(--gold)]" />
          <h2 className="font-semibold text-lg text-[var(--text-main)]">
            Creator Identity
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">
              {creator.name}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--gold)] font-medium mt-0.5">
              {creator.tagline}
            </p>
          </div>
        </div>

        {/* Minimal Details Rows */}
        <div className="bg-[var(--bg-list)] border border-[var(--border-subtle)] rounded-lg p-4 divide-y divide-[var(--border-subtle)] text-xs sm:text-sm">
          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)] font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--gold)]" />
              <span>Public Identity</span>
            </span>
            <span className="font-semibold text-[var(--text-main)]">
              {creator.name}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)] font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--gold)]" />
              <span>Based in</span>
            </span>
            <span className="font-semibold text-[var(--text-main)]">
              {creator.location}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)] font-medium flex items-center gap-2">
              <Instagram className="w-4 h-4 text-[var(--gold)]" />
              <span>Instagram</span>
            </span>
            {creator.socials.instagram.handle ? (
              <a
                href={creator.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--gold)] hover:underline inline-flex items-center gap-1.5"
              >
                <span>{creator.socials.instagram.handle}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-[var(--text-muted)] italic">
                Configurable
              </span>
            )}
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)] font-medium flex items-center gap-2">
              <Send className="w-4 h-4 text-[var(--gold)]" />
              <span>Telegram</span>
            </span>
            {creator.socials.telegram.handle ? (
              <a
                href={creator.socials.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--gold)] hover:underline inline-flex items-center gap-1.5"
              >
                <span>{creator.socials.telegram.handle}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-[var(--text-muted)] italic">
                Configurable
              </span>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-6 space-y-3">
        <h2 className="font-semibold text-lg text-[var(--text-main)]">
          About Ilm-e-Ghayb Library
        </h2>
        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
          <p>
            Ilm-e-Ghayb Library, by Ghayb Chronicles, is a private space for Ilm — hidden knowledge, Sufi wisdom, and the books behind it.
          </p>
          <p>
            The library has a particular interest in Islamic knowledge, Quran, Sunnah, spirituality, history, philosophy, and beneficial knowledge from different traditions and disciplines, with sources in every entry.
          </p>
        </div>
      </section>

      {/* Creator Note Quote Block */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2 text-[var(--gold)]">
          <Quote className="w-5 h-5 rotate-180" />
          <h2 className="font-semibold text-base text-[var(--text-main)]">
            Creator Note
          </h2>
        </div>
        <blockquote className="border-l-2 border-[var(--gold)] pl-4 py-1 space-y-2">
          <p className="text-sm sm:text-base italic font-serif text-[var(--text-main)] leading-relaxed whitespace-pre-line">
            "{creator.note.quote}"
          </p>
          <footer className="text-xs text-[var(--gold)] font-medium">
            — {creator.note.author}
          </footer>
        </blockquote>
      </section>

      {/* Connect Section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg text-[var(--text-main)]">
          Connect
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          For inquiries, recommendations, or scholarly discussions, feel free to connect via social platforms below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {creator.socials.instagram.handle ? (
            <a
              href={creator.socials.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-lg flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)]">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Instagram</span>
                  <span className="text-xs font-semibold text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors">
                    {creator.socials.instagram.handle}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--gold)] transition-colors" />
            </a>
          ) : null}

          {creator.socials.telegram.handle ? (
            <a
              href={creator.socials.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-main)] rounded-lg flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)]">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Telegram</span>
                  <span className="text-xs font-semibold text-[var(--text-main)] group-hover:text-[var(--gold)] transition-colors">
                    {creator.socials.telegram.handle}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--gold)] transition-colors" />
            </a>
          ) : (
            <div className="p-3.5 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)]">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[var(--text-muted)] block">Telegram</span>
                <span className="text-xs font-semibold text-[var(--text-muted)] italic">
                  To be added
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Explore CTA */}
      <div className="pt-2 text-center">
        <button
          onClick={() => router.navigate('library')}
          className="bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold text-xs px-6 py-2.5 rounded-md transition-all inline-flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Explore Library</span>
        </button>
      </div>

    </div>
  );
};
