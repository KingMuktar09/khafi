import React, { useState } from 'react';
import { submitTopicRequest, type TopicRequestKind } from '../../services/topicRequests';
import { tt, ttf } from '../../data/i18n-topics';
import { appState } from '../../state/appState';

/** Instagram DM to @ghayb.chronicles. Always offered as a fallback link. */
export const INSTAGRAM_DM_URL = 'https://ig.me/m/ghayb.chronicles';

interface InstagramSendBoxProps {
  kind: TopicRequestKind;
  /** Topic slug the note is about, or 'general' for hub and Questions page notes. */
  topic: string;
  /** Human label for the topic, used in the copied text for comments. */
  topicLabel?: string;
  title: string;
  messageLabel: string;
  messagePlaceholder: string;
  /** Short note shown under the title. */
  note: string;
  /** Message shown when the note is saved in Supabase. */
  doneMessage: string;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea method.
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Request / question / comment box. The visitor writes their message,
 * with their Instagram name if they want to show who they are, or
 * they choose "Post as anonymous" and no name is asked for. Anonymous
 * posts are stored with the name "Anonymous" and shown that way.
 *
 * When Supabase is configured, the note is saved there (status pending,
 * shown only after approval) and the visitor is told it is saved.
 * When it is not configured yet, or the save fails, the note is copied
 * to the clipboard and the Instagram DM to @ghayb.chronicles opens, so
 * the visitor can paste it there. The DM link is always shown too.
 * No backend of our own is needed.
 */
export const InstagramSendBox: React.FC<InstagramSendBoxProps> = ({
  kind,
  topic,
  topicLabel,
  title,
  messageLabel,
  messagePlaceholder,
  note,
  doneMessage,
}) => {
  const lang = appState.settings.language;
  const [instagramName, setInstagramName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'saved' | 'copied' | 'copy-failed'>('idle');
  const [fallbackText, setFallbackText] = useState('');

  const canSend = message.trim().length > 0 && (anonymous || instagramName.trim().length > 0);

  const copyLabel =
    kind === 'request'
      ? tt('sendbox.topicWant', lang)
      : kind === 'question'
        ? tt('sendbox.myQuestion', lang)
        : ttf('sendbox.commentOn', lang, { label: topicLabel ?? 'this topic' });

  const buildText = (name: string, text: string): string =>
    anonymous
      ? `Instagram: Anonymous\n${copyLabel}: ${text.trim()}`
      : `Instagram: @${name.replace(/^@/, '').trim()}\n${copyLabel}: ${text.trim()}`;

  const onSend = async () => {
    if (!canSend || status === 'sending') return;
    setStatus('sending');
    const name = anonymous ? 'Anonymous' : instagramName.trim().replace(/^@/, '');
    const text = message.trim();
    const stored = await submitTopicRequest({ instagramName: name, kind, topic, message: text });
    if (stored.stored) {
      setStatus('saved');
      setInstagramName('');
      setMessage('');
      return;
    }
    const fullText = buildText(name, text);
    const copied = await copyText(fullText);
    window.open(INSTAGRAM_DM_URL, '_blank', 'noopener,noreferrer');
    if (copied) {
      setStatus('copied');
      setInstagramName('');
      setMessage('');
    } else {
      setFallbackText(fullText);
      setStatus('copy-failed');
    }
  };

  return (
    <section className="ms-card space-y-3" aria-label={title}>
      <h2 className="ms-h2">{title}</h2>
      <p className="ms-body">{note}</p>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor={`ig-name-${kind}-${topic}`}>
          {tt('sendbox.instagramName', lang)}
        </label>
        <input
          id={`ig-name-${kind}-${topic}`}
          type="text"
          value={instagramName}
          onChange={(event) => setInstagramName(event.target.value)}
          placeholder="@yourname"
          autoComplete="off"
          disabled={anonymous}
          className="ms-field w-full disabled:opacity-50"
        />
        <label className="flex items-center gap-2 text-sm ms-body cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(event) => {
              setAnonymous(event.target.checked);
              if (event.target.checked) setInstagramName('');
            }}
            className="w-4 h-4 accent-[var(--ms-gold)]"
          />
          {tt('sendbox.postAnonymous', lang)}
        </label>
      </div>

      <div className="space-y-1.5">
        <label className="ms-label" htmlFor={`ig-msg-${kind}-${topic}`}>
          {messageLabel}
        </label>
        <textarea
          id={`ig-msg-${kind}-${topic}`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={messagePlaceholder}
          rows={3}
          className="ms-field w-full"
        />
      </div>

      <button type="button" onClick={onSend} disabled={!canSend || status === 'sending'} className="ms-btn-gold">
        {status === 'sending' ? tt('sendbox.sending', lang) : tt('sendbox.send', lang)}
      </button>

      {status === 'saved' ? <p className="ms-body" role="status">{doneMessage}</p> : null}
      {status === 'copied' ? (
        <p className="ms-body" role="status">
          {tt('sendbox.copied', lang)}
        </p>
      ) : null}
      {status === 'copy-failed' ? (
        <div className="space-y-2" role="status">
          <p className="ms-body">{tt('sendbox.copyFailed', lang)}</p>
          <textarea readOnly value={fallbackText} rows={4} className="ms-field w-full" aria-label={tt('sendbox.copyTextLabel', lang)} />
        </div>
      ) : null}

      <p className="ms-body text-sm">
        {tt('sendbox.orSend', lang)}
        <a
          href={INSTAGRAM_DM_URL}
          target="_blank"
          rel="noreferrer"
          className="ms-gold underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)] rounded"
        >
          @ghayb.chronicles
        </a>
      </p>
    </section>
  );
};
