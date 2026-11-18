import React, { useRef, useState } from 'react';
import { Download, Plus, Trash2, Upload } from 'lucide-react';
import { appState } from '../../state/appState';
import {
  downloadTextFile,
  importGrimoireJson,
  loadGrimoire,
  saveGrimoire,
  uid,
} from '../../utils/toolsStorage';
import type { GrimoireItem, GrimoireKind } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';

const DEVICE_NOTE = 'Everything you save here stays on this device. Nothing is sent anywhere.';

const KIND_LABELS: Record<GrimoireKind, string> = {
  name: 'Name',
  bast: 'Unfolded text',
  note: 'Note',
};

/**
 * Saved items shelf: names saved from Asma, unfoldings saved from Bast,
 * and notes added by hand. Delete, export and import as JSON.
 */
export const GrimoireView: React.FC = () => {
  const [items, setItems] = useState<GrimoireItem[]>(() => loadGrimoire());
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const persist = (next: GrimoireItem[]) => {
    setItems(next);
    saveGrimoire(next);
  };

  const addNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() && !detail.trim()) {
      appState.showToast('Write a title or some detail first', 'error');
      return;
    }
    const now = Date.now();
    persist([{ id: uid(), kind: 'note', title: title.trim() || 'Untitled note', detail, createdAt: now }, ...items]);
    setTitle('');
    setDetail('');
    appState.showToast('Note saved to Grimoire', 'success');
  };

  const remove = (id: string) => {
    persist(items.filter((item) => item.id !== id));
    appState.showToast('Item deleted', 'info');
  };

  const exportJson = () => {
    downloadTextFile('ilmeghayb-grimoire.json', JSON.stringify(items, null, 2));
    appState.showToast('Grimoire exported', 'success');
  };

  const onImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importGrimoireJson(String(reader.result ?? ''));
      if (result.ok) {
        setItems(loadGrimoire());
        appState.showToast(
          `Imported ${result.imported?.grimoire ?? 0} item${result.imported?.grimoire === 1 ? '' : 's'}`,
          'success',
        );
      } else {
        appState.showToast(result.error ?? 'That file could not be imported.', 'error');
      }
    };
    reader.onerror = () => appState.showToast('That file could not be read.', 'error');
    reader.readAsText(file);
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <ToolsLayout
      title="Grimoire — Saved Items"
      subtitle="Names, unfolded texts and notes you saved from the other tools, all in one place."
    >
      <p className="text-xs sm:text-sm text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl px-4 py-3">
        {DEVICE_NOTE}
      </p>

      <form
        onSubmit={addNote}
        className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3"
      >
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Add a note</h2>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--text-muted)]" htmlFor="grimoire-title">
            Title
          </label>
          <input
            id="grimoire-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What is this about?"
            className="w-full min-h-11 px-3.5 rounded-xl bg-[var(--bg-list)] border border-[var(--border-main)] text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--text-muted)]" htmlFor="grimoire-detail">
            Detail
          </label>
          <textarea
            id="grimoire-detail"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            rows={3}
            placeholder="Write the detail you want to keep…"
            className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-list)] border border-[var(--border-main)] text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] resize-y"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-[var(--gold-faint)] border border-[var(--gold)] text-sm font-medium text-[var(--gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Save note
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={exportJson}
          className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-main)] text-sm font-medium text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-main)] text-sm font-medium text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          Import JSON
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} aria-label="Import grimoire JSON file" />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl px-4 py-5 text-center">
          Nothing saved yet. Save a Name from the Asma page, an unfolding from the Bast page, or add a note above.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs px-2 py-0.5 bg-[var(--gold-faint)] border border-[var(--border-main)] text-[var(--gold)] font-semibold rounded">
                    {KIND_LABELS[item.kind]}
                  </span>
                  <h3 className="font-medium text-[var(--text-main)] mt-1.5">{item.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{formatDate(item.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Delete ${item.title}`}
                  className="shrink-0 p-2.5 rounded-xl text-[var(--text-muted)] hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              {item.detail ? (
                <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap break-words">{item.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </ToolsLayout>
  );
};
