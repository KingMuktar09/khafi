import React, { useRef, useState } from 'react';
import { Download, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { appState } from '../../state/appState';
import { localizeImportError, tTools, tfTools } from '../../data/i18n-tools';
import {
  downloadTextFile,
  importJournalJson,
  loadJournal,
  saveJournal,
  uid,
} from '../../utils/toolsStorage';
import type { JournalEntry } from '../../utils/toolsStorage';
import { ToolsLayout } from './ToolsLayout';



/**
 * Reading-notes journal, device-only: add, edit and delete entries,
 * export as JSON, and import a JSON file (validated, then merged).
 */
export const JournalView: React.FC = () => {
  const lang = appState.settings.language;
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
      appState.showToast(tTools('tools.journal.emptySubmit', lang), 'error');
      return;
    }
    const now = Date.now();
    if (editingId) {
      persist(
        entries.map((entry) =>
          entry.id === editingId
            ? { ...entry, title: title.trim() || tTools('tools.common.untitledNote', lang), text, updatedAt: now }
            : entry,
        ),
      );
      appState.showToast(tTools('tools.journal.updated', lang), 'success');
    } else {
      persist([
        { id: uid(), title: title.trim() || tTools('tools.common.untitledNote', lang), text, createdAt: now, updatedAt: now },
        ...entries,
      ]);
      appState.showToast(tTools('tools.journal.added', lang), 'success');
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
    appState.showToast(tTools('tools.journal.deleted', lang), 'info');
  };

  const exportJson = () => {
    downloadTextFile('ilmeghayb-journal.json', JSON.stringify(entries, null, 2));
    appState.showToast(tTools('tools.journal.exported', lang), 'success');
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
          (result.imported?.journal ?? 0) === 1
            ? tTools('tools.journal.importedOne', lang)
            : tfTools('tools.journal.importedMany', lang, { n: result.imported?.journal ?? 0 }),
          'success',
        );
      } else {
        appState.showToast(result.error ? localizeImportError(result.error, lang) : tTools('tools.common.importFail', lang), 'error');
      }
    };
    reader.onerror = () => appState.showToast(tTools('tools.common.readFail', lang), 'error');
    reader.readAsText(file);
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <ToolsLayout
      title={tTools('tools.journal.title', lang)}
      eyebrow={tTools('tools.journal.eyebrow', lang)}
      subtitle={tTools('tools.journal.subtitle', lang)}
    >
      <p className="ms-note-box">
        {tTools('tools.journal.deviceNote', lang)}
      </p>

      <form
        onSubmit={submit}
        className="ms-card space-y-3"
      >
        <h2 className="ms-h2">
          {editingId ? tTools('tools.journal.editNote', lang) : tTools('tools.journal.newNote', lang)}
        </h2>
        <div className="space-y-1.5">
          <label className="ms-label block" htmlFor="journal-title">
            {tTools('tools.journal.titleLabel', lang)}
          </label>
          <input
            id="journal-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={tTools('tools.journal.titlePlaceholder', lang)}
            className="ms-field w-full min-h-11 px-3.5 text-base"
          />
        </div>
        <div className="space-y-1.5">
          <label className="ms-label block" htmlFor="journal-text">
            {tTools('tools.journal.noteLabel', lang)}
          </label>
          <textarea
            id="journal-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={4}
            placeholder={tTools('tools.journal.notePlaceholder', lang)}
            className="ms-field w-full px-3.5 py-3 text-base resize-y"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="ms-btn-gold"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {editingId ? tTools('tools.journal.saveChanges', lang) : tTools('tools.journal.addNote', lang)}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="ms-btn"
            >
              {tTools('tools.common.cancel', lang)}
            </button>
          ) : null}
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={exportJson}
          className="ms-btn"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          {tTools('tools.common.exportJson', lang)}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="ms-btn"
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          {tTools('tools.common.importJson', lang)}
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} aria-label={tTools('tools.journal.importAria', lang)} />
      </div>

      {entries.length === 0 ? (
        <p className="ms-body ms-surface px-4 py-5 text-center">
          {tTools('tools.journal.empty', lang)}
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="ms-surface p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium ms-ink">{entry.title}</h3>
                  <p className="text-xs ms-muted">
                    {formatDate(entry.createdAt)}
                    {entry.updatedAt !== entry.createdAt ? ` · ${tfTools('tools.journal.edited', lang, { date: formatDate(entry.updatedAt) })}` : ''}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(entry)}
                    aria-label={tfTools('tools.journal.editAria', lang, { title: entry.title })}
                    className="p-2.5 rounded-xl ms-muted hover:text-[var(--ms-gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)]"
                  >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(entry.id)}
                    aria-label={tfTools('tools.journal.deleteAria', lang, { title: entry.title })}
                    className="p-2.5 rounded-xl ms-muted hover:text-[var(--ms-red)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ms-gold)]"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {entry.text ? (
                <p className="ms-body whitespace-pre-wrap break-words">{entry.text}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </ToolsLayout>
  );
};
