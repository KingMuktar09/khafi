import React from 'react';
import {
  Settings as SettingsIcon,
  X,
  Check,
  Sun,
  Moon,
  Monitor,
  LayoutList,
  LayoutGrid,
  Zap,
  ZapOff,
} from 'lucide-react';
import { appState } from '../../state/appState';
import {
  AppearanceSetting,
  AccentColorSetting,
  ViewModeSetting,
  FontSizeSetting,
  AnimationsSetting,
  UserSettings,
} from '../../types';
import { ACCENT_PALETTES } from '../../config/accentPalettes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<UserSettings>) => {
    appState.updateSettings(partial);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between bg-[var(--bg-header)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[var(--gold-faint)] border border-[var(--border-main)] flex items-center justify-center text-[var(--gold)]">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="font-bold text-base text-[var(--text-main)] leading-tight">
                Settings
              </h2>
              <p className="text-xs text-[var(--text-muted)]">Personalize KHAFI LIBRARY</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
            aria-label="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content / Form Options */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          
          {/* 1. APPEARANCE */}
          <section className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
              Appearance
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Appearance">
              {(
                [
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'system', label: 'System', icon: Monitor },
                ] as const
              ).map((item) => {
                const isSelected = settings.appearance === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate({ appearance: item.id })}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[var(--gold-faint)] border-[var(--gold)] text-[var(--gold)] font-semibold shadow-sm'
                        : 'bg-[var(--bg-main)] border-[var(--border-main)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5 shrink-0 text-[var(--gold)]" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. ACCENT COLOR */}
          <section className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
              Accent Color
            </label>
            <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Accent Color">
              {(['gold', 'blue', 'green', 'purple', 'rose'] as AccentColorSetting[]).map((colorKey) => {
                const palette = ACCENT_PALETTES[colorKey];
                const isSelected = settings.accentColor === colorKey;
                return (
                  <button
                    key={colorKey}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate({ accentColor: colorKey })}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-xs font-medium gap-1.5 ${
                      isSelected
                        ? 'bg-[var(--gold-faint)] border-[var(--gold)] text-[var(--text-main)] font-semibold'
                        : 'bg-[var(--bg-main)] border-[var(--border-main)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                    }`}
                    title={palette.name}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-black/20 shadow-inner flex items-center justify-center shrink-0"
                      style={{ backgroundColor: palette.hex }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </div>
                    <span className="text-[11px] leading-none capitalize">{palette.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. VIEW */}
          <section className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
              Default View Mode
            </label>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Default View Mode">
              {(
                [
                  { id: 'list', label: 'List View', icon: LayoutList },
                  { id: 'grid', label: 'Grid View', icon: LayoutGrid },
                ] as const
              ).map((item) => {
                const isSelected = settings.viewMode === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate({ viewMode: item.id })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[var(--gold-faint)] border-[var(--gold)] text-[var(--gold)] font-semibold'
                        : 'bg-[var(--bg-main)] border-[var(--border-main)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-1 text-[var(--gold)]" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. FONT SIZE */}
          <section className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
              Font Scale
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Font Scale">
              {(
                [
                  { id: 'small', label: 'Small', detail: '14px' },
                  { id: 'medium', label: 'Medium', detail: '16px' },
                  { id: 'large', label: 'Large', detail: '18px' },
                ] as const
              ).map((item) => {
                const isSelected = settings.fontSize === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate({ fontSize: item.id })}
                    className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'bg-[var(--gold-faint)] border-[var(--gold)] text-[var(--gold)] font-semibold'
                        : 'bg-[var(--bg-main)] border-[var(--border-main)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-medium">
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-[var(--gold)]" />}
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] font-normal">{item.detail}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. ANIMATIONS */}
          <section className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
              Animations
            </label>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Animations">
              {(
                [
                  { id: 'normal', label: 'Normal', desc: 'Subtle transitions', icon: Zap },
                  { id: 'reduced', label: 'Reduced Motion', desc: 'Minimal motion', icon: ZapOff },
                ] as const
              ).map((item) => {
                const isSelected = settings.animations === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate({ animations: item.id })}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-[var(--gold-faint)] border-[var(--gold)] text-[var(--gold)] font-semibold'
                        : 'bg-[var(--bg-main)] border-[var(--border-main)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs">{item.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[var(--gold)] shrink-0" />}
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block truncate">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-header)] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-semibold text-xs rounded-md transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
