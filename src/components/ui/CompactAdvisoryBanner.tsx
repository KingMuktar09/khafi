import React, { useState } from 'react';
import { ShieldAlert, Info, ArrowRight } from 'lucide-react';
import { ReaderAdvisoryModal } from './ReaderAdvisoryModal';
import { appState } from '../../state/appState';

export const CompactAdvisoryBanner: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAcknowledged = appState.hasAcknowledgedAdvisory();

  const handleConfirm = () => {
    appState.acknowledgeAdvisory();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="p-3.5 sm:p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-lg text-xs font-sans transition-all space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-1.5 bg-[var(--gold-faint)] text-[var(--gold)] border border-[var(--border-main)] rounded shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-xs sm:text-sm text-[var(--text-main)]">
                  Reader Advisory
                </h4>
                {isAcknowledged && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded font-medium">
                    Session Acknowledged
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)] leading-relaxed">
                Some texts in Ilm-e-Ghayb Library may contain descriptions of sensitive historical, literary, or spiritual material provided for research and study only.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] font-medium rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Info className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Read Full Advisory</span>
              <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
            </button>
          </div>

        </div>
      </div>

      <ReaderAdvisoryModal
        isOpen={isModalOpen}
        isInformationalOnly={true}
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};
