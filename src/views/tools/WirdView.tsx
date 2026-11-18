import React, { useEffect, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { appState } from '../../state/appState';
import { tTools, tfTools } from '../../data/i18n-tools';
import { loadWird, saveWird } from '../../utils/toolsStorage';
import type { WirdData } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';



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
  const lang = appState.settings.language;
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
    appState.showToast(tfTools('tools.wird.resetPhraseToast', lang, { phrase: selected }), 'info');
  };

  const resetAll = () => {
    setData((prev) => ({ ...prev, counts: {} }));
    appState.showToast(tTools('tools.wird.resetAllToast', lang), 'info');
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
    appState.showToast(tTools('tools.wird.phraseAdded', lang), 'success');
  };

  const selectedPreset = PRESETS.find((preset) => preset.label === selected);

  return (
    <ToolsLayout
      title={tTools('tools.wird.title', lang)}
      eyebrow={tTools('tools.wird.eyebrow', lang)}
      subtitle={tTools('tools.wird.subtitle', lang)}
    >
      <p className="ms-note-box">
        {tTools('tools.wird.deviceNote', lang)}
      </p>

      <div className="flex flex-wrap gap-2" role="group" aria-label={tTools('tools.wird.choosePhrase', lang)}>
        {phrases.map((phrase) => (
          <button
            key={phrase}
            type="button"
            aria-pressed={selected === phrase}
            onClick={() => setSelected(phrase)}
            className="ms-toggle ms-toggle-chip"
          >
            {phrase}
          </button>
        ))}
      </div>

      <form onSubmit={addCustom} className="flex gap-2">
        <label htmlFor="wird-custom" className="sr-only">{tTools('tools.wird.addPhraseLabel', lang)}</label>
        <input
          id="wird-custom"
          type="text"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          placeholder={tTools('tools.wird.addPhrasePlaceholder', lang)}
          className="ms-field flex-1 min-w-0 min-h-11 px-3.5 text-base"
        />
        <button
          type="submit"
          aria-label={tTools('tools.wird.addAria', lang)}
          className="ms-btn shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          {tTools('tools.common.add', lang)}
        </button>
      </form>

      <section className="ms-card space-y-4 text-center">
        {selectedPreset ? (
          <p className="ms-arabic-xl ms-gold" dir="rtl" lang="ar">{selectedPreset.arabic}</p>
        ) : null}
        <h2 className="ms-h2">{selected}</h2>
        <p className="ms-count" aria-live="polite">
          {count}
        </p>
        <p className="ms-body ms-num">
          {tfTools('tools.wird.ofTarget', lang, { count, target, progress })}
        </p>
        <div
          className="ms-progress"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={target}
          aria-label={tfTools('tools.wird.progressAria', lang, { target })}
        >
          <div style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          onClick={tap}
          aria-label={tfTools('tools.wird.countAria', lang, { phrase: selected })}
          className="ms-btn-solid"
        >
          {tTools('tools.wird.tapBtn', lang)}
        </button>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <label className="inline-flex items-center gap-2 ms-body" htmlFor="wird-target">
            {tTools('tools.wird.targetLabel', lang)}
            <input
              id="wird-target"
              type="number"
              min={1}
              inputMode="numeric"
              value={target}
              onChange={(event) => setTarget(Number(event.target.value))}
              className="ms-field w-20 min-h-10 px-2.5 text-base text-center"
            />
          </label>
          <button
            type="button"
            onClick={resetPhrase}
            className="ms-btn"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            {tTools('tools.wird.resetPhrase', lang)}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="ms-btn"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            {tTools('tools.wird.resetAll', lang)}
          </button>
        </div>
      </section>
    </ToolsLayout>
  );
};
