import React from 'react';
import { ArrowRight } from 'lucide-react';
import { router } from '../../router/router';
import { TOOLS_INDEX } from '../../data/toolsIndex';
import { ToolsLayout } from './ToolsLayout';

/** Landing page for the study-tools section: one card per tool. */
export const ToolsHubView: React.FC = () => {
  return (
    <ToolsLayout
      title="Study Tools"
      subtitle="Small tools for studying letters, numbers and your own reading notes. Nothing here promises an outcome — it is all for study."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {TOOLS_INDEX.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => router.navigate(tool.route)}
            className="text-left bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl p-5 space-y-2 hover:border-[var(--gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] transition-colors"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-display font-semibold text-lg text-[var(--text-main)]">{tool.title}</span>
              <ArrowRight className="w-5 h-5 text-[var(--gold)] shrink-0" aria-hidden="true" />
            </span>
            <span className="block text-sm text-[var(--text-muted)] leading-relaxed">{tool.blurb}</span>
          </button>
        ))}
      </div>

      <p className="text-sm text-[var(--text-muted)] text-center pt-2">
        More tools are coming in later phases — planetary hours, the moon and mansions, and magic squares.
      </p>
    </ToolsLayout>
  );
};
