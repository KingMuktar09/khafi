import React from 'react';
import { ASMA_SOURCE } from '../../data/asmaNames';
import { QURAN_TEXT_SOURCE, TRANSLITERATION_SOURCE } from '../../data/quranTexts';
import { appState } from '../../state/appState';
import { tTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * About the study-tools section, written from what was actually built:
 * what the tools are, where their numbers come from, what was tested,
 * and what they cannot do. Nothing copied from any other site.
 */
export const AboutView: React.FC = () => {
  const lang = appState.settings.language;
  return (
    <ToolsLayout
      title={tTools('tools.about.title', lang)}
      eyebrow={tTools('tools.about.eyebrow', lang)}
      subtitle={tTools('tools.about.subtitle', lang)}
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.about.whatTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.about.whatBody1', lang)}</p>
        <p className="ms-body">{tTools('tools.about.whatBody2', lang)}</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.about.builtTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.about.builtIntro', lang)}</p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.builtLettersLabel', lang)}</span>
            {tTools('tools.about.builtLettersBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.builtTimeLabel', lang)}</span>
            {tTools('tools.about.builtTimeBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.builtSquaresLabel', lang)}</span>
            {tTools('tools.about.builtSquaresBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.builtNotesLabel', lang)}</span>
            {tTools('tools.about.builtNotesBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.builtSelfLabel', lang)}</span>
            {tTools('tools.about.builtSelfBody', lang)}
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.about.notBuiltTitle', lang)}</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>{tTools('tools.about.notBuilt1', lang)}</li>
          <li>{tTools('tools.about.notBuilt2', lang)}</li>
          <li>{tTools('tools.about.notBuilt3', lang)}</li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.about.sourcesTitle', lang)}</h2>
        <ul className="list-disc pl-5 space-y-2 ms-body">
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcAbjadLabel', lang)}</span>
            {tTools('tools.about.srcAbjadBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcQuranLabel', lang)}</span>
            {QURAN_TEXT_SOURCE}. {tTools('tools.about.srcQuranBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcTranslitLabel', lang)}</span>
            {TRANSLITERATION_SOURCE}. {tTools('tools.about.srcTranslitBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcNamesLabel', lang)}</span>
            {ASMA_SOURCE}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcAstroLabel', lang)}</span>
            {tTools('tools.about.srcAstroBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcMansionsLabel', lang)}</span>
            {tTools('tools.about.srcMansionsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcSignsLabel', lang)}</span>
            {tTools('tools.about.srcSignsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcPlanetsLabel', lang)}</span>
            {tTools('tools.about.srcPlanetsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcSquaresLabel', lang)}</span>
            {tTools('tools.about.srcSquaresBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.srcNotesLabel', lang)}</span>
            {tTools('tools.about.srcNotesBody', lang)}
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.about.convTitle', lang)}</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.convSchoolsLabel', lang)}</span>
            {tTools('tools.about.convSchoolsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.convCountingLabel', lang)}</span>
            {tTools('tools.about.convCountingBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.convHoursLabel', lang)}</span>
            {tTools('tools.about.convHoursBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.convHijriLabel', lang)}</span>
            {tTools('tools.about.convHijriBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.convMansionsLabel', lang)}</span>
            {tTools('tools.about.convMansionsBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.convSignsLabel', lang)}</span>
            {tTools('tools.about.convSignsBody', lang)}
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.about.testedTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.about.testedIntro', lang)}</p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.testedAbjadLabel', lang)}</span>
            {tTools('tools.about.testedAbjadBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.testedQuranLabel', lang)}</span>
            {tTools('tools.about.testedQuranBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.testedTimeLabel', lang)}</span>
            {tTools('tools.about.testedTimeBody', lang)}
          </li>
          <li>
            <span className="font-medium ms-ink">{tTools('tools.about.testedStorageLabel', lang)}</span>
            {tTools('tools.about.testedStorageBody', lang)}
          </li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.about.limitsTitle', lang)}</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>{tTools('tools.about.limit1', lang)}</li>
          <li>{tTools('tools.about.limit2', lang)}</li>
          <li>{tTools('tools.about.limit3', lang)}</li>
          <li>{tTools('tools.about.limit4', lang)}</li>
          <li>{tTools('tools.about.limit5', lang)}</li>
          <li>{tTools('tools.about.limit6', lang)}</li>
          <li>{tTools('tools.about.limit7', lang)}</li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.about.whoTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.about.whoBody', lang)}</p>
      </section>
    </ToolsLayout>
  );
};
