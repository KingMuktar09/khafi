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
      eyebrow="The Study Tools"
      subtitle="Small tools for studying letters, numbers and your own reading notes. Nothing here promises an outcome — it is all for study."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS_INDEX.map((tool, index) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => router.navigate(tool.route)}
            className="ms-card ms-card-hover text-left space-y-3"
          >
            <span className="ms-hub-index block">{String(index + 1).padStart(2, '0')}</span>
            <span className="flex items-center justify-between gap-3">
              <span className="ms-hub-title">{tool.title}</span>
              <ArrowRight className="w-5 h-5 ms-gold shrink-0" aria-hidden="true" />
            </span>
            <span className="ms-body block">{tool.blurb}</span>
          </button>
        ))}
      </div>

      <p className="ms-body text-center pt-2">
        The shells below are empty for now — they hold only content supplied with its source and page.
      </p>
    </ToolsLayout>
  );
};
