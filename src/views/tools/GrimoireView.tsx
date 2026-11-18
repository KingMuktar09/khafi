import React, { useRef, useState } from 'react';
import { Download, Plus, Trash2, Upload } from 'lucide-react';
import { appState } from '../../state/appState';
import { localizeImportError, tTools, tfTools } from '../../data/i18n-tools';
import {
  downloadTextFile,
  importGrimoireJson,
  loadGrimoire,
  saveGrimoire,
  uid,
} from '../../utils/toolsStorage';
import type { GrimoireItem, GrimoireKind } from '../../utils/toolsStorage';
import type { SiteLanguage } from '../../types';
import { ToolsLayout } from './ToolsLayout';



function kindLabel(kind: GrimoireKind, lang: SiteLanguage): string {
  if (kind === 'name') return tTools('tools.grimoire.kindName', lang);
  if (kind === 'bast') return tTools('tools.grimoire.kindBast', lang);
  return tTools('tools.grimoire.kindNote', lang);
}

/**
 * Saved items shelf: names saved from Asma, unfoldings saved from Bast,
 * and notes added by hand. Delete, export and import as JSON.
 */
export const GrimoireView: React.FC = () => {
  const lang = appState.settings.language;
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
      appState.showToast(tTools('tools.grimoire.emptySubmit', lang), 'error');
      return;
    }
    const now = Date.now();
    persist([{ id: uid(), kind: 'note', title: title.trim() || tTools('tools.common.untitledNote', lang), detail, createdAt: now }, ...items]);
    setTitle('');
    setDetail('');
    appState.showToast(tTools('tools.grimoire.saved', lang), 'success');
  };

  const remove = (id: string) => {
    persist(items.filter((item) => item.id !== id));
    appState.showToast(tTools('tools.grimoire.deleted', lang), 'info');
  };

  const exportJson = () => {
    downloadTextFile('ilmeghayb-grimoire.json', JSON.stringify(items, null, 2));
    appState.showToast(tTools('tools.grimoire.exported', lang), 'success');
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
          (result.imported?.grimoire ?? 0) === 1
            ? tTools('tools.grimoire.importedOne', lang)
            : tfTools('tools.grimoire.importedMany', lang, { n: result.imported?.grimoire ?? 0 }),
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
      title={tTools('tools.grimoire.title', lang)}
      eyebrow={tTools('tools.grimoire.eyebrow', lang)}
      subtitle={tTools('tools.grimoire.subtitle', lang)}
    >
      <p className="ms-note-box">
        {tTools('tools.grimoire.deviceNote', lang)}
      </p>

      <form
        onSubmit={addNote}
        className="ms-card space-y-3"
      >
        <h2 className="ms-h2">{tTools('tools.grimoire.addNoteTitle', lang)}</h2>
        <div className="space-y-1.5">
          <label className="ms-label block" htmlFor="grimoire-title">
            {tTools('tools.grimoire.titleLabel', lang)}
          </label>
          <input
            id="grimoire-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={tTools('tools.grimoire.titlePlaceholder', lang)}
            className="ms-field w-full min-h-11 px-3.5 text-base"
          />
        </div>
        <div className="space-y-1.5">
          <label className="ms-label block" htmlFor="grimoire-detail">
            {tTools('tools.grimoire.detailLabel', lang)}
          </label>
          <textarea
            id="grimoire-detail"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            rows={3}
            placeholder={tTools('tools.grimoire.detailPlaceholder', lang)}
            className="ms-field w-full px-3.5 py-3 text-base resize-y"
          />
        </div>
        <button
          type="submit"
          className="ms-btn-gold"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          {tTools('tools.grimoire.saveNote', lang)}
        </button>
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
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} aria-label={tTools('tools.grimoire.importAria', lang)} />
      </div>

      {items.length === 0 ? (
        <p className="ms-body ms-surface px-4 py-5 text-center">
          {tTools('tools.grimoire.empty', lang)}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="ms-surface p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="ms-pill">
                    {kindLabel(item.kind, lang)}
                  </span>
                  <h3 className="font-medium ms-ink mt-1.5">{item.title}</h3>
                  <p className="text-xs ms-muted">{formatDate(item.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={tfTools('tools.grimoire.deleteAria', lang, { title: item.title })}
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
