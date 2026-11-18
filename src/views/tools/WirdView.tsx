import React, { useEffect, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { appState } from '../../state/appState';
import { loadWird, saveWird } from '../../utils/toolsStorage';
import type { WirdData } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';

const DEVICE_NOTE = 'Everything you count here stays on this device. Nothing is sent anywhere.';

const PRESETS: { arabic: string; label: string }[] = [
  { arabic: 'سُبْحَانَ اللهِ', label: 'SubhanAllah' },
  { arabic: 'الْحَمْدُ لِلَّهِ', label: 'Alhamdulillah' },
  { arabic: 'اللهُ أَكْبَرُ', label: 'Allahu Akbar' },
  { arabic: 'لَا إِلَهَ إِلَّا اللهُ', label: 'La ilaha illallah' },
  { arabic: 'أَسْتَغْفِرُ اللهَ', label: 'Astaghfirullah' },
];

const DEFAULT_TARGET = 33;

/**
 * Remembrance counter: tap to count, per-phrase counts and targets
 * saved on this device, with a reset. No counts are promised as
 * anything — it is only a counter.
 */
export const WirdView: React.FC = () => {
  const [data, setData] = useState<WirdData>(() => loadWird());
  const [selected, setSelected] = useState<string>(PRESETS[0].label);
  const [custom, setCustom] = useState('');

  useEffect(() => {
    saveWird(data);
  }, [data]);

  const phrases = [...PRESETS.map((preset) => preset.label), ...Object.keys(data.counts).filter(
    (phrase) => !PRESETS.some((preset) => preset.label === phrase),
  )];

  const count = data.counts[selected] ?? 0;
  const target = data.targets[selected] ?? DEFAULT_TARGET;
  const progress = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;

  const tap = () => {
    setData((prev) => ({
      ...prev,
      counts: { ...prev.counts, [selected]: (prev.counts[selected] ?? 0) + 1 },
    }));
  };

  const resetPhrase = () => {
    setData((prev) => ({ ...prev, counts: { ...prev.counts, [selected]: 0 } }));
    appState.showToast(`Reset ${selected}`, 'info');
  };

  const resetAll = () => {
    setData((prev) => ({ ...prev, counts: {} }));
    appState.showToast('All counts reset', 'info');
  };

  const setTarget = (value: number) => {
    const safe = Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_TARGET;
    setData((prev) => ({ ...prev, targets: { ...prev.targets, [selected]: safe } }));
  };

  const addCustom = (event: React.FormEvent) => {
    event.preventDefault();
    const phrase = custom.trim();
    if (!phrase) return;
    setData((prev) => ({
      counts: { ...prev.counts, [phrase]: prev.counts[phrase] ?? 0 },
      targets: { ...prev.targets, [phrase]: prev.targets[phrase] ?? DEFAULT_TARGET },
    }));
    setSelected(phrase);
    setCustom('');
    appState.showToast('Phrase added', 'success');
  };

  const selectedPreset = PRESETS.find((preset) => preset.label === selected);

  return (
    <ToolsLayout
      title="Wird — Remembrance Counter"
      subtitle="A simple counter. Pick a phrase, tap the big button, and set a target if you like."
    >
      <p className="text-xs sm:text-sm text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl px-4 py-3">
        {DEVICE_NOTE}
      </p>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a phrase">
        {phrases.map((phrase) => (
          <button
            key={phrase}
            type="button"
            aria-pressed={selected === phrase}
            onClick={() => setSelected(phrase)}
            className={`min-h-11 px-3.5 rounded-xl border text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${
              selected === phrase
                ? 'bg-[var(--gold-faint)] border-[var(--gold)] text-[var(--gold)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-main)] text-[var(--text-muted)]'
            }`}
          >
            {phrase}
          </button>
        ))}
      </div>

      <form onSubmit={addCustom} className="flex gap-2">
        <label htmlFor="wird-custom" className="sr-only">Add your own phrase</label>
        <input
          id="wird-custom"
          type="text"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          placeholder="Add your own phrase…"
          className="flex-1 min-w-0 min-h-11 px-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-main)] text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        />
        <button
          type="submit"
          aria-label="Add phrase"
          className="shrink-0 inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-main)] text-sm font-medium text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add
        </button>
      </form>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-4 text-center">
        {selectedPreset ? (
          <p className="font-arabic text-3xl text-[var(--gold)]" dir="rtl" lang="ar">{selectedPreset.arabic}</p>
        ) : null}
        <h2 className="font-display font-semibold text-xl text-[var(--text-main)]">{selected}</h2>
        <p className="font-display text-6xl font-semibold text-[var(--text-main)] tabular-nums" aria-live="polite">
          {count}
        </p>
        <p className="text-sm text-[var(--text-muted)] tabular-nums">
          {count} of {target} · {progress}%
        </p>
        <div
          className="h-2.5 rounded-full bg-[var(--bg-list)] overflow-hidden"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={target}
          aria-label={`Progress towards ${target}`}
        >
          <div className="h-full bg-[var(--gold)] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          onClick={tap}
          aria-label={`Count one for ${selected}`}
          className="w-full min-h-16 rounded-2xl bg-[var(--gold)] text-black text-lg font-semibold hover:opacity-90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--gold)]"
        >
          Tap to count
        </button>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)]" htmlFor="wird-target">
            Target
            <input
              id="wird-target"
              type="number"
              min={1}
              inputMode="numeric"
              value={target}
              onChange={(event) => setTarget(Number(event.target.value))}
              className="w-20 min-h-10 px-2.5 rounded-xl bg-[var(--bg-list)] border border-[var(--border-main)] text-base text-center text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            />
          </label>
          <button
            type="button"
            onClick={resetPhrase}
            className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-xl border border-[var(--border-main)] text-sm font-medium text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reset this phrase
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 min-h-10 px-3.5 rounded-xl border border-[var(--border-main)] text-sm font-medium text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reset all
          </button>
        </div>
      </section>
    </ToolsLayout>
  );
};
