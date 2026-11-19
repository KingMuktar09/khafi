import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, Check, Instagram, MessageSquare, RefreshCw, Send } from 'lucide-react';
import { api } from '../../services/api';
import {
  instagramDmUrl,
  countUnreadTopicRequests,
  type TopicRequestWithReply,
} from '../../services/topicRequests';

/**
 * Admin inbox: messages from visitors (comments, requests, questions).
 *
 * The bell in the admin header shows the same unread count — this
 * component owns the count and reports it up through onUnreadChange.
 * It polls every 30 seconds while the admin panel is open, and has a
 * refresh button too. This is an in-panel bell, not a phone push
 * notification: new messages appear here when the panel is open.
 *
 * Each message shows on its own: name, type, topic, message, date,
 * status, the reply when one was sent, an Approve button for new ones,
 * a reply box, and a DM link when the visitor gave an Instagram name.
 * Approving makes the comment show on the public Topics pages, with the
 * reply under it.
 */
export const TopicInbox: React.FC<{
  initialItems?: TopicRequestWithReply[];
  initialUnread?: number;
  onUnreadChange?: (count: number) => void;
}> = ({ initialItems, initialUnread, onUnreadChange }) => {
  const [items, setItems] = useState<TopicRequestWithReply[]>(initialItems || []);
  const [unread, setUnread] = useState<number>(initialUnread ?? 0);
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  // The parent callback changes identity on every AdminView render, so
  // keep it in a ref — the poll effect must not restart because of it.
  const onUnreadChangeRef = useRef(onUnreadChange);
  onUnreadChangeRef.current = onUnreadChange;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getTopicRequests();
      const count = await api.getTopicRequestsUnread();
      setItems(list.items || []);
      setNotConfigured(Boolean(list.notConfigured));
      if (list.error) {
        setNotice({ text: list.error, ok: false });
      } else {
        setNotice(null);
      }
      const n = count.unread;
      setUnread(n);
      onUnreadChangeRef.current?.(n);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, [load]);

  const handleApprove = async (id: number | string) => {
    setBusyId(String(id));
    setNotice(null);
    const res = await api.approveTopicRequest(id);
    setBusyId(null);
    if (!res.success) {
      setNotice({ text: res.error || 'Could not approve this message.', ok: false });
      return;
    }
    setNotice({ text: 'Approved — it now shows on the public site.', ok: true });
    await load();
  };

  const handleSendReply = async (id: number | string) => {
    const text = (drafts[String(id)] || '').trim();
    if (!text) {
      setNotice({ text: 'Write a reply first.', ok: false });
      return;
    }
    setBusyId(String(id));
    setNotice(null);
    const res = await api.replyToTopicRequest(id, text);
    setBusyId(null);
    if (!res.success) {
      setNotice({ text: res.error || 'Could not send the reply.', ok: false });
      return;
    }
    setDrafts((prev) => ({ ...prev, [String(id)]: '' }));
    setNotice({ text: 'Reply sent.', ok: true });
    await load();
  };

  const kindLabel = (kind: string) =>
    kind === 'request' ? 'Request' : kind === 'question' ? 'Question' : 'Comment';

  const formatDate = (value: string) => {
    try {
      return new Date(value).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return value;
    }
  };

  const unreadFromItems = countUnreadTopicRequests(items);

  return (
    <div id="admin-inbox" className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">Messages from visitors</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Comments, requests and questions from the site. New ones stay hidden from the public site until you approve them.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)]"
            title={`${unread} new message${unread === 1 ? '' : 's'}`}
            aria-label={`${unread} new messages`}
          >
            <Bell className="w-4 h-4 text-[var(--gold)]" />
            <span>New</span>
            {unread > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-[var(--gold)] text-black text-[10px] font-bold inline-flex items-center justify-center">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="tap-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/60 text-xs font-semibold text-[var(--text-main)] disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--gold)] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Loading…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {notice && (
        <p className={`text-xs leading-relaxed rounded-lg px-3 py-2 border ${notice.ok ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'}`}>
          {notice.text}
        </p>
      )}

      {notConfigured && (
        <p className="text-xs leading-relaxed rounded-lg px-3 py-2 border bg-amber-500/10 text-amber-300 border-amber-500/20">
          Replies are not set up yet. Run supabase/migrations/001_topic_replies.sql in the Supabase SQL Editor,
          then add SUPABASE_SERVICE_ROLE_KEY in Vercel and redeploy. Until then you can read messages here,
          but approving and replying will not work.
        </p>
      )}

      {items.length === 0 && !loading ? (
        <p className="text-xs text-[var(--text-muted)]">No messages yet. When a visitor writes from the Topics pages, it shows up here.</p>
      ) : null}

      <ul className="space-y-3">
        {items.map((item) => {
          const dmUrl = instagramDmUrl(item.instagram_name);
          const draft = drafts[String(item.id)] || '';
          const busy = busyId === String(item.id);
          return (
            <li key={String(item.id)} className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-main)]">
                    {item.instagram_name.toLowerCase() === 'anonymous' ? 'Anonymous' : `@${item.instagram_name}`}
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--gold-faint)] border border-[var(--border-main)] text-[11px] font-semibold text-[var(--gold)]">
                      {kindLabel(item.kind)}
                    </span>
                    <span
                      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${
                        item.status === 'new'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      }`}
                    >
                      {item.status === 'new' ? 'New' : 'Approved'}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    On: {item.topic} · {formatDate(item.created_at)}
                  </p>
                </div>
                {dmUrl && (
                  <a
                    href={dmUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/60 text-xs font-semibold text-[var(--text-main)] shrink-0"
                  >
                    <Instagram className="w-4 h-4 text-[var(--gold)]" />
                    <span>DM on Instagram</span>
                  </a>
                )}
              </div>

              <p className="text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-wrap">{item.message}</p>

              {item.reply ? (
                <div className="rounded-lg border-l-2 border-[var(--gold)] bg-[var(--gold-faint)] px-3 py-2 space-y-1">
                  <p className="text-xs font-semibold text-[var(--gold)]">Your reply · {formatDate(item.reply.created_at)}</p>
                  <p className="text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-wrap">{item.reply.reply}</p>
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--text-muted)]" htmlFor={`inbox-reply-${item.id}`}>
                  Reply
                </label>
                <textarea
                  id={`inbox-reply-${item.id}`}
                  value={draft}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [String(item.id)]: e.target.value }))}
                  rows={2}
                  maxLength={2000}
                  placeholder="Write your reply…"
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded-lg focus:outline-none focus:border-[var(--gold)] text-sm resize-y"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSendReply(item.id)}
                    disabled={busy || !draft.trim()}
                    className="tap-target inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--gold)] hover:bg-[var(--gold-light)] disabled:opacity-60 text-black text-xs font-bold cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{busy ? 'Sending…' : 'Send reply'}</span>
                  </button>
                  {item.status === 'new' && (
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      disabled={busy}
                      className="tap-target inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-main)] hover:border-[var(--gold)]/60 disabled:opacity-60 text-xs font-semibold text-[var(--text-main)] cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-[var(--gold)]" />
                      <span>Approve</span>
                    </button>
                  )}
                  {item.status !== 'new' && !item.reply && (
                    <span className="text-xs text-[var(--text-muted)]">Approved — no reply sent yet.</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {items.length > 0 && (
        <p className="text-xs text-[var(--text-muted)]">
          {unreadFromItems} new · {items.length} total. New messages appear here on their own — check back any time, or press Refresh.
        </p>
      )}
    </div>
  );
};
