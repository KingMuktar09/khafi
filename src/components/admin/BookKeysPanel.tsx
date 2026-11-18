import React, { useCallback, useEffect, useState } from 'react';
import { KeyRound, Plus, Copy, Check, Ban, Trash2, RefreshCw, Users, KeySquare } from 'lucide-react';
import { appState } from '../../state/appState';
import { api } from '../../services/api';

/**
 * Admin: paid-book keys (Muktar's key system).
 *
 * - Only PAID books get keys. Free books need no key.
 * - Muktar picks a paid book, sets the use limit (default 100), and
 *   generates a key. The plain key is shown ONCE, right here, to copy and
 *   share with a follower who needs that book — after that it is never
 *   shown again (only the hash is stored on the server). The books are
 *   free; the key is free too, never a payment.
 * - Each key belongs to ONE paid book only and can be used up to the limit
 *   Muktar set. After the limit, or when revoked, it stops working.
 * - Monitor: how many times each key was used, when it was last used,
 *   uses left, and totals across all keys and per paid book.
 */
export const BookKeysPanel: React.FC = () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [totals, setTotals] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookId, setBookId] = useState('');
  const [maxUses, setMaxUses] = useState(100);
  const [label, setLabel] = useState('');
  const [generating, setGenerating] = useState(false);
  const [newPlainKey, setNewPlainKey] = useState('');
  const [newKeyBook, setNewKeyBook] = useState('');
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  const paidBooks = (appState.catalog.books || []).filter((b: any) => b.isPaid);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.getBookKeys();
    setKeys(res.keys || []);
    setTotals(res.totals || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!bookId && paidBooks.length > 0) setBookId(paidBooks[0].id);
  }, [paidBooks.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerate = async () => {
    if (!bookId) {
      setNotice({ text: 'Pick a paid book first.', ok: false });
      return;
    }
    const limit = Math.min(10000, Math.max(1, Math.floor(Number(maxUses)) || 100));
    setGenerating(true);
    setNotice(null);
    setNewPlainKey('');
    const res = await api.generateBookKey(bookId, limit, label);
    setGenerating(false);
    if (!res.success || !res.plainKey) {
      setNotice({ text: res.error || 'Could not generate a key.', ok: false });
      return;
    }
    setNewPlainKey(res.plainKey);
    const book = paidBooks.find((b: any) => b.id === bookId);
    setNewKeyBook(book ? book.title : bookId);
    setCopied(false);
    setNotice({
      text: `Key generated for "${book ? book.title : bookId}" — ${limit} uses. Copy it NOW: it will never be shown again.${res.durableWarning ? ' ' + res.durableWarning : ''}`,
      ok: true,
    });
    setLabel('');
    await load();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newPlainKey);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleRevoke = async (id: string) => {
    const res = await api.revokeBookKey(id);
    if (!res.success) {
      setNotice({ text: res.error || 'Could not revoke the key.', ok: false });
      return;
    }
    setNotice({ text: 'Key revoked — it stops working at once.', ok: true });
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this key entirely? It will stop working at once.')) return;
    const res = await api.deleteBookKey(id);
    if (!res.success) {
      setNotice({ text: res.error || 'Could not delete the key.', ok: false });
      return;
    }
    setNotice({ text: 'Key deleted.', ok: true });
    await load();
  };

  return (
    <section id="admin-book-keys" className="space-y-3">
      <div>
        <h3 className="font-display font-semibold text-base text-[var(--text-main)] flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[var(--gold)]" />
          <span>Book Keys — paid books only</span>
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
          Each paid book has its own key. You generate a key here, share it with a follower who needs this book, and they enter it on the book to unlock it. One key opens one book only, up to the use limit you set (default 100 uses). Free books need no key.
        </p>
      </div>

      {totals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-3">
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Keys</p>
            <p className="text-lg font-bold text-[var(--text-main)]">{totals.totalKeys}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{totals.activeKeys} active · {totals.revokedKeys} revoked</p>
          </div>
          <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-3">
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> People entered</p>
            <p className="text-lg font-bold text-[var(--text-main)]">{totals.totalUses}</p>
            <p className="text-[11px] text-[var(--text-muted)]">successful key entries, all keys</p>
          </div>
          <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-3">
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Uses left</p>
            <p className="text-lg font-bold text-[var(--text-main)]">{totals.totalUsesLeft}</p>
            <p className="text-[11px] text-[var(--text-muted)]">across all keys</p>
          </div>
          <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-3">
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Paid books</p>
            <p className="text-lg font-bold text-[var(--text-main)]">{paidBooks.length}</p>
            <p className="text-[11px] text-[var(--text-muted)]">with keys available</p>
          </div>
        </div>
      )}

      {/* Generate a key */}
      <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-4 space-y-3">
        <p className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[var(--gold)]" />
          <span>Generate a new key</span>
        </p>
        {paidBooks.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">No paid books yet. Mark a book as paid first, then come back here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2">
            <label className="space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-semibold">Paid book</span>
              <select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--gold)]"
              >
                {paidBooks.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] text-[var(--text-muted)] font-semibold">Use limit</span>
              <input
                type="number"
                min={1}
                max={10000}
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--gold)]"
              />
            </label>
          </div>
        )}
        <label className="space-y-1 block">
          <span className="text-[11px] text-[var(--text-muted)] font-semibold">Note for you (optional, e.g. “Batch 1 — WhatsApp followers”)</span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Batch 1 — WhatsApp followers"
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)]"
          />
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || paidBooks.length === 0}
          className="tap-target px-4 py-2.5 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black transition-all cursor-pointer text-sm disabled:opacity-50 flex items-center gap-2"
        >
          <KeySquare className="w-4 h-4" />
          <span>{generating ? 'Generating…' : 'Generate key'}</span>
        </button>
        {newPlainKey && (
          <div className="rounded-xl border border-[var(--gold)]/50 bg-[var(--gold-faint)] p-3 space-y-2">
            <p className="text-xs font-bold text-[var(--text-main)]">Your key for “{newKeyBook}” — copy it NOW. It will never be shown again.</p>
            <div className="flex gap-2 items-center">
              <code className="flex-1 min-w-0 break-all px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)] text-sm font-mono text-[var(--text-main)]">{newPlainKey}</code>
              <button
                type="button"
                onClick={handleCopy}
                className="tap-target shrink-0 px-3 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-main)] text-sm font-semibold text-[var(--text-main)] flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Share this key with the follower who needs this book. Anyone with it can open this book, up to its use limit.</p>
          </div>
        )}
        {notice && (
          <p className={`text-xs leading-relaxed ${notice.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{notice.text}</p>
        )}
      </div>

      {/* Keys table / monitor */}
      <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-[var(--text-main)]">All keys — monitor</p>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="tap-target px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-main)] text-xs font-semibold text-[var(--text-main)] flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{loading ? 'Loading…' : 'Refresh'}</span>
          </button>
        </div>
        {keys.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">No keys yet. Generate one above.</p>
        ) : (
          <div className="space-y-2">
            {keys.map((k: any) => (
              <div key={k.id} className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-main)] p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-main)] truncate">{k.bookTitle || k.bookId}</p>
                    {k.label && <p className="text-[11px] text-[var(--text-muted)] truncate">{k.label}</p>}
                  </div>
                  <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border ${k.revoked ? 'text-rose-400 border-rose-400/40 bg-rose-400/10' : !k.usable ? 'text-amber-400 border-amber-400/40 bg-amber-400/10' : 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'}`}>
                    {k.revoked ? 'Revoked' : !k.usable ? 'Used up' : 'Active'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Used <span className="font-semibold text-[var(--text-main)]">{k.uses}</span> of {k.maxUses} ·{' '}
                  <span className="font-semibold text-[var(--text-main)]">{k.usesLeft} left</span>
                  {k.lastUsedAt ? ` · last used ${new Date(k.lastUsedAt).toLocaleString()}` : ' · never used yet'}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">Created {new Date(k.createdAt).toLocaleString()} · ID {k.id}</p>
                <div className="flex gap-2 pt-1">
                  {!k.revoked && (
                    <button
                      type="button"
                      onClick={() => handleRevoke(k.id)}
                      className="tap-target px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-main)] text-xs font-semibold text-[var(--text-main)] flex items-center gap-1 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(k.id)}
                    className="tap-target px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-main)] text-xs font-semibold text-rose-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {totals && totals.byBook && (
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Per paid book</p>
            {Object.entries(totals.byBook).map(([bookId, t]: [string, any]) => {
              const book = paidBooks.find((b: any) => b.id === bookId);
              return (
                <p key={bookId} className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {book ? book.title : bookId}: {t.keys} {t.keys === 1 ? 'key' : 'keys'} · {t.uses} entries · {t.usesLeft} uses left
                </p>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
