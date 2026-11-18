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

      <button
        type="button"
        onClick={() => router.navigate('topics')}
        className="ms-card ms-card-hover text-left space-y-3 w-full"
      >
        <span className="ms-hub-index block">T</span>
        <span className="flex items-center justify-between gap-3">
          <span className="ms-hub-title">Topics</span>
          <ArrowRight className="w-5 h-5 ms-gold shrink-0" aria-hidden="true" />
        </span>
        <span className="ms-body block">
          Longer discussions from the books, with their sources named. 2 topics so far.
        </span>
      </button>

    </ToolsLayout>
  );
};
