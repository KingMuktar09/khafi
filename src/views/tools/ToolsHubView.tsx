import React from 'react';
import { ArrowRight } from 'lucide-react';
import { router } from '../../router/router';
import { TOOLS_INDEX } from '../../data/toolsIndex';
import { appState } from '../../state/appState';
import { localizeTool, tTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/** Landing page for the study-tools section: one card per tool. */
export const ToolsHubView: React.FC = () => {
  const lang = appState.settings.language;
  return (
    <ToolsLayout
      title={tTools('tools.hub.title', lang)}
      eyebrow={tTools('tools.hub.eyebrow', lang)}
      subtitle={tTools('tools.hub.subtitle', lang)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS_INDEX.map((tool, index) => {
          const localized = localizeTool(tool, lang);
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => router.navigate(tool.route)}
              className="ms-card ms-card-hover text-left space-y-3"
            >
              <span className="ms-hub-index block">{String(index + 1).padStart(2, '0')}</span>
              <span className="flex items-center justify-between gap-3">
                <span className="ms-hub-title">{localized.title}</span>
                <ArrowRight className="w-5 h-5 ms-gold shrink-0" aria-hidden="true" />
              </span>
              <span className="ms-body block">{localized.blurb}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => router.navigate('topics')}
        className="ms-card ms-card-hover text-left space-y-3 w-full"
      >
        <span className="ms-hub-index block">T</span>
        <span className="flex items-center justify-between gap-3">
          <span className="ms-hub-title">{tTools('tools.hub.topicsTitle', lang)}</span>
          <ArrowRight className="w-5 h-5 ms-gold shrink-0" aria-hidden="true" />
        </span>
        <span className="ms-body block">
          Longer discussions from the books, with their sources named. 2 topics so far.
        </span>
      </button>

    </ToolsLayout>
  );
};
