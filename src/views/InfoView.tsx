import React from 'react';
import { BookOpen, ExternalLink, Instagram, Send, User, MapPin, Quote } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { appState } from '../state/appState';
import { t } from '../data/i18n';
import { router } from '../router/router';

export const InfoView: React.FC = () => {
  const { creator } = siteConfig;
  const lang = appState.settings.language;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-2 font-sans">
      
      {/* Header Banner */}
      <div className="ms-panel rounded-2xl p-6 space-y-2">
        <span className="text-xs px-2.5 py-0.5 bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)] font-semibold rounded">
          {t('info.tag', lang)}
        </span>
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight">
          Ilm-e-Ghayb Library
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
          {t('info.intro', lang)}
        </p>
      </div>

      {/* Creator Profile Section */}
      <section className="ms-panel rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <User className="w-5 h-5 text-[var(--gold)]" />
          <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
            {t('info.creatorTitle', lang)}
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">
              {creator.name}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--gold)] font-medium mt-0.5">
              {t('info.creatorTagline', lang)}
            </p>
          </div>
        </div>

        {/* Minimal Details Rows */}
        <div className="bg-[var(--bg-list)] border border-[var(--border-subtle)] rounded-lg p-4 divide-y divide-[var(--border-subtle)] text-xs sm:text-sm">
          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)] font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--gold)]" />
              <span>{t('info.publicIdentity', lang)}</span>
            </span>
            <span className="font-semibold text-[var(--text-main)]">
              {creator.name}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)] font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--gold)]" />
              <span>{t('info.basedIn', lang)}</span>
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
                {t('info.configurable', lang)}
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
                {t('info.configurable', lang)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="ms-panel rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
          {t('info.aboutTitle', lang)}
        </h2>
        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
          <p>
            {t('info.about1', lang)}
          </p>
          <p>
            {t('info.about2', lang)}
          </p>
        </div>
      </section>

      {/* Why we made this — in Khafi's voice, about Ghayb Chronicles
          and the library only. No personal details anywhere on this page. */}
      <section className="ms-panel rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
          {t('info.whyTitle', lang)}
        </h2>
        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
          <p>{t('info.why1', lang)}</p>
          <p>{t('info.why2', lang)}</p>
        </div>
      </section>

      {/* How it works — follow gate, categories, journeys, shelf, tools, keys. */}
      <section className="ms-panel rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
          {t('info.howTitle', lang)}
        </h2>
        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
          <p>{t('info.how1', lang)}</p>
          <p>{t('info.how2', lang)}</p>
          <p>{t('info.how3', lang)}</p>
          <p>{t('info.how4', lang)}</p>
        </div>
      </section>

      {/* Why some books are paid — when people pay, they value it and
          read it properly; free, many do not read it properly. */}
      <section className="ms-panel rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
          {t('info.paidTitle', lang)}
        </h2>
        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
          <p>{t('info.paid1', lang)}</p>
          <p>{t('info.paid2', lang)}</p>
        </div>
      </section>

      {/* Follow Ghayb Chronicles — new books and topics first on Instagram. */}
      <section className="ms-panel rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
          {t('info.followTitle', lang)}
        </h2>
        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
          <p>{t('info.follow1', lang)}</p>
        </div>
        <a
          href="https://instagram.com/ghayb.chronicles"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold text-xs rounded-lg cursor-pointer"
        >
          <Instagram className="w-4 h-4" />
          <span>@ghayb.chronicles</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>

      {/* What "Authentic" means */}
      <section className="ms-panel rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
          {t('info.authenticTitle', lang)}
        </h2>
        <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
          <p>
            {t('info.authentic1', lang)}
          </p>
          <p>
            {t('info.authentic2', lang)}
          </p>
          <p>
            {t('info.authentic3', lang)}
          </p>
        </div>
      </section>

      {/* Creator Note Quote Block */}
      <section className="ms-panel rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-[var(--gold)]">
          <Quote className="w-5 h-5 rotate-180" />
          <h2 className="font-semibold text-base text-[var(--text-main)]">
            {t('info.creatorNoteTitle', lang)}
          </h2>
        </div>
        <blockquote className="border-l-2 border-[var(--gold)] pl-4 py-1 space-y-2">
          <p className="text-sm sm:text-base italic font-serif text-[var(--text-main)] leading-relaxed whitespace-pre-line">
            "{t('info.creatorNoteQuote', lang)}"
          </p>
          <footer className="text-xs text-[var(--gold)] font-medium">
            — {creator.note.author}
          </footer>
        </blockquote>
      </section>

      {/* Connect Section */}
      <section className="ms-panel rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
          {t('info.connectTitle', lang)}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          {t('info.connectText', lang)}
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
                  {t('info.telegramToBeAdded', lang)}
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
          <span>{t('info.explore', lang)}</span>
        </button>
      </div>

    </div>
  );
};
