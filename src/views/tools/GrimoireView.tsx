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
      eyebrow="Saved Items"
      subtitle="Names, unfolded texts and notes you saved from the other tools, all in one place."
    >
      <p className="ms-note-box">
        {DEVICE_NOTE}
      </p>

      <form
        onSubmit={addNote}
        className="ms-card space-y-3"
      >
        <h2 className="ms-h2">Add a note</h2>
        <div className="space-y-1.5">
          <label className="ms-label block" htmlFor="grimoire-title">
            Title
          </label>
          <input
            id="grimoire-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What is this about?"
            className="ms-field w-full min-h-11 px-3.5 text-base"
          />
        </div>
        <div className="space-y-1.5">
          <label className="ms-label block" htmlFor="grimoire-detail">
            Detail
          </label>
          <textarea
            id="grimoire-detail"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            rows={3}
            placeholder="Write the detail you want to keep…"
            className="ms-field w-full px-3.5 py-3 text-base resize-y"
          />
        </div>
        <button
          type="submit"
          className="ms-btn-gold"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Save note
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={exportJson}
          className="ms-btn"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="ms-btn"
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          Import JSON
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} aria-label="Import grimoire JSON file" />
      </div>

      {items.length === 0 ? (
        <p className="ms-body ms-surface px-4 py-5 text-center">
          Nothing saved yet. Save a Name from the Asma page, an unfolding from the Bast page, or add a note above.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="ms-surface p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="ms-pill">
                    {KIND_LABELS[item.kind]}
                  </span>
                  <h3 className="font-medium ms-ink mt-1.5">{item.title}</h3>
                  <p className="text-xs ms-muted">{formatDate(item.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Delete ${item.title}`}
                  className="shrink-0 p-2.5 rounded-xl ms-muted hover:text-[var(--ms-red)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)]"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              {item.detail ? (
                <p className="ms-body whitespace-pre-wrap break-words">{item.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </ToolsLayout>
  );
};
