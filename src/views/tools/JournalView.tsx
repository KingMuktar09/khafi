import React, { useRef, useState } from 'react';
import { Download, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { appState } from '../../state/appState';
import {
  downloadTextFile,
  importJournalJson,
  loadJournal,
  saveJournal,
  uid,
} from '../../utils/toolsStorage';
import type { JournalEntry } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';

const DEVICE_NOTE = 'Everything you write here stays on this device. Nothing is sent anywhere.';

/**
 * Reading-notes journal, device-only: add, edit and delete entries,
 * export as JSON, and import a JSON file (validated, then merged).
 */
export const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => loadJournal());
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const persist = (next: JournalEntry[]) => {
    setEntries(next);
    saveJournal(next);
  };

  const resetForm = () => {
    setTitle('');
    setText('');
    setEditingId(null);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() && !text.trim()) {
      appState.showToast('Write a title or some text first', 'error');
      return;
    }
    const now = Date.now();
    if (editingId) {
      persist(
        entries.map((entry) =>
          entry.id === editingId
            ? { ...entry, title: title.trim() || 'Untitled note', text, updatedAt: now }
            : entry,
        ),
      );
      appState.showToast('Note updated', 'success');
    } else {
      persist([
        { id: uid(), title: title.trim() || 'Untitled note', text, createdAt: now, updatedAt: now },
        ...entries,
      ]);
      appState.showToast('Note added', 'success');
    }
    resetForm();
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setText(entry.text);
  };

  const remove = (id: string) => {
    persist(entries.filter((entry) => entry.id !== id));
    if (editingId === id) resetForm();
    appState.showToast('Note deleted', 'info');
  };

  const exportJson = () => {
    downloadTextFile('ilmeghayb-journal.json', JSON.stringify(entries, null, 2));
    appState.showToast('Journal exported', 'success');
  };

  const onImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importJournalJson(String(reader.result ?? ''));
      if (result.ok) {
        setEntries(loadJournal());
        appState.showToast(
          `Imported ${result.imported?.journal ?? 0} note${result.imported?.journal === 1 ? '' : 's'}`,
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
      title="Journal — Reading Notes"
      subtitle="Notes on what you read, kept on this device only."
    >
      <p className="text-xs sm:text-sm text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl px-4 py-3">
        {DEVICE_NOTE}
      </p>

      <form
        onSubmit={submit}
        className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-3"
      >
        <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">
          {editingId ? 'Edit note' : 'New note'}
        </h2>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--text-muted)]" htmlFor="journal-title">
            Title
          </label>
          <input
            id="journal-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What is this note about?"
            className="w-full min-h-11 px-3.5 rounded-xl bg-[var(--bg-list)] border border-[var(--border-main)] text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--text-muted)]" htmlFor="journal-text">
            Note
          </label>
          <textarea
            id="journal-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={4}
            placeholder="Write what you learned, questions you have, or a quote to remember…"
            className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-list)] border border-[var(--border-main)] text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] resize-y"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-xl bg-[var(--gold-faint)] border border-[var(--gold)] text-sm font-medium text-[var(--gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {editingId ? 'Save changes' : 'Add note'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="min-h-11 px-4 rounded-xl border border-[var(--border-main)] text-sm font-medium text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            >
              Cancel
            </button>
          ) : null}
        </div>
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
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} aria-label="Import journal JSON file" />
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl px-4 py-5 text-center">
          No notes yet. Add your first note above.
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium text-[var(--text-main)]">{entry.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {formatDate(entry.createdAt)}
                    {entry.updatedAt !== entry.createdAt ? ` · edited ${formatDate(entry.updatedAt)}` : ''}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(entry)}
                    aria-label={`Edit ${entry.title}`}
                    className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(entry.id)}
                    aria-label={`Delete ${entry.title}`}
                    className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {entry.text ? (
                <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap break-words">{entry.text}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </ToolsLayout>
  );
};
