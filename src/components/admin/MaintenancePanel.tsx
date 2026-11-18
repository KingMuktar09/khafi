import React, { useEffect, useState } from 'react';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import { api } from '../../services/api';

/**
 * Admin: maintenance mode (simple, plain words).
 *
 * - ON: visitors see a beautiful maintenance page (logo, your message,
 *   Instagram link) and no books. The admin can still sign in and browse
 *   the site, and can turn it off here.
 * - OFF: the site works normally for everyone.
 * The message is yours — write it in plain words, e.g. "We are adding new
 * books. Back soon."
 */
export const MaintenancePanel: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    api.getSiteSettings().then((s) => {
      setEnabled(s.maintenance.enabled);
      setMessage(s.maintenance.message || '');
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setNotice(null);
    const res = await api.saveSiteSettings({ maintenance: { enabled, message } });
    setSaving(false);
    if (!res.success) {
      setNotice({ text: res.error || 'Could not save maintenance mode.', ok: false });
      return;
    }
    setNotice({
      text: enabled
        ? 'Maintenance mode is ON. Visitors see the maintenance page. You (admin) can still browse and turn it off here.'
        : 'Maintenance mode is OFF. The site is open for everyone.' +
          (res.durableWarning ? ' ' + res.durableWarning : ''),
      ok: true,
    });
  };

  return (
    <section id="admin-maintenance" className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)] shrink-0">
          <Wrench className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">Maintenance mode</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Turn the site off for visitors while you work on it. Visitors see a maintenance page. You can still browse as admin.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled((v) => !v)}
          className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold cursor-pointer transition-colors ${enabled ? 'bg-amber-500/15 border-amber-500/50 text-amber-300' : 'bg-[var(--bg-main)] border-[var(--border-main)] text-[var(--text-muted)]'}`}
        >
          {enabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{enabled ? 'ON — visitors see maintenance' : 'OFF — site is open'}</span>
        </button>
      </div>

      <label className="space-y-1 block">
        <span className="text-[11px] text-[var(--text-muted)] font-semibold">Message for visitors (shown on the maintenance page)</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          placeholder="We are adding new books. Back soon."
          className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] resize-y"
        />
      </label>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !loaded}
          className="tap-target px-4 py-2.5 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black transition-all cursor-pointer text-sm disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save maintenance mode'}
        </button>
        {notice && (
          <p className={`text-xs leading-relaxed ${notice.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{notice.text}</p>
        )}
      </div>
    </section>
  );
};
