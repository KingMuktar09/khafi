import React from 'react';
import { ASMA_SOURCE } from '../../data/asmaNames';
import { NORMALIZATION_RULES } from '../../utils/abjad';
import { appState } from '../../state/appState';
import { localizeNormalizationRule, tTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * How these tools work: where the numbers come from, how letters are
 * counted, what was tested, and what the tools cannot do.
 * Plain words; nothing copied from any other site.
 */
export const MethodView: React.FC = () => {
  const lang = appState.settings.language;
  return (
    <ToolsLayout
      title={tTools('tools.method.title', lang)}
      eyebrow={tTools('tools.method.eyebrow', lang)}
      subtitle={tTools('tools.method.subtitle', lang)}
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.method.whatTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.method.whatBody', lang)}</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.method.sourcesTitle', lang)}</h2>
        <ul className="list-disc pl-5 space-y-2 ms-body">
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.srcAbjadLabel', lang)}</span>
            {tTools('tools.method.srcAbjadBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.srcNamesLabel', lang)}</span>
            {ASMA_SOURCE}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.srcAstroLabel', lang)}</span>
            {tTools('tools.method.srcAstroBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.srcMansionsLabel', lang)}</span>
            {tTools('tools.method.srcMansionsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.srcSignsLabel', lang)}</span>
            {tTools('tools.method.srcSignsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.srcPlanetsLabel', lang)}</span>
            {tTools('tools.method.srcPlanetsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.srcSquaresLabel', lang)}</span>
            {tTools('tools.method.srcSquaresBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.srcNotesLabel', lang)}</span>
            {tTools('tools.method.srcNotesBody', lang)}
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.method.timeTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.method.timeIntro', lang)}</p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.timeLibLabel', lang)}</span>
            {tTools('tools.method.timeLibBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.timeNoLocLabel', lang)}</span>
            {tTools('tools.method.timeNoLocBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.timePolarLabel', lang)}</span>
            {tTools('tools.method.timePolarBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.timeLocLabel', lang)}</span>
            {tTools('tools.method.timeLocBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.timeHijriLabel', lang)}</span>
            {tTools('tools.method.timeHijriBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.timeMansionsLabel', lang)}</span>
            {tTools('tools.method.timeMansionsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.timeSignsLabel', lang)}</span>
            {tTools('tools.method.timeSignsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.timeMoonLabel', lang)}</span>
            {tTools('tools.method.timeMoonBody', lang)}
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.method.squaresTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.method.squaresIntro', lang)}</p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.sqReachLabel', lang)}</span>
            {tTools('tools.method.sqReachBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.sqValidatorLabel', lang)}</span>
            {tTools('tools.method.sqValidatorBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.sqExportLabel', lang)}</span>
            {tTools('tools.method.sqExportBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.method.sqModesLabel', lang)}</span>
            {tTools('tools.method.sqModesBody', lang)}
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.method.lettersTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.method.lettersIntro', lang)}</p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          {NORMALIZATION_RULES.map((rule) => (
            <li key={rule}>{localizeNormalizationRule(rule, lang)}</li>
          ))}
        </ul>
        <p className="ms-body">{tTools('tools.method.bareNote', lang)}</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.method.testedTitle', lang)}</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>{tTools('tools.method.tested1', lang)}</li>
          <li>{tTools('tools.method.tested2', lang)}</li>
          <li>{tTools('tools.method.tested3', lang)}</li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.method.limitsTitle', lang)}</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>{tTools('tools.method.limit1', lang)}</li>
          <li>{tTools('tools.method.limit2', lang)}</li>
          <li>{tTools('tools.method.limit3', lang)}</li>
          <li>{tTools('tools.method.limit4', lang)}</li>
          <li>{tTools('tools.method.limit5', lang)}</li>
        </ul>
      </section>
    </ToolsLayout>
  );
};
