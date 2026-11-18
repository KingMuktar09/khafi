import React from 'react';
import {
  MAGIC_SQUARE_SOURCE,
  UNSUPPORTED_MODES,
  magicConstant,
  methodForOrder,
} from '../../utils/magicSquare';
import { appState } from '../../state/appState';
import { localizeUnsupportedMode, tTools, tfTools } from '../../data/i18n-tools';
import { ToolsLayout } from './ToolsLayout';

/**
 * Qawa'id — the rules of the Wafq Forge, in plain words.
 * Which construction is used for each order type, when a target can
 * be reached and when it is refused, how the separate validator
 * works, and which modes are not built because no rule and worked
 * example has been supplied for them. Nothing here promises any
 * outcome.
 */
export const QawaidView: React.FC = () => {
  const lang = appState.settings.language;
  return (
    <ToolsLayout
      title={tTools('tools.qawaid.title', lang)}
      eyebrow={tTools('tools.qawaid.eyebrow', lang)}
      subtitle={tTools('tools.qawaid.subtitle', lang)}
    >
      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.qawaid.whatTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.qawaid.whatBody', lang)}</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.qawaid.methodTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.qawaid.methodIntro', lang)}</p>
        <div className="space-y-3">
          <div>
            <h3 className="ms-h3">{tfTools('tools.qawaid.oddTitle', lang, { method: methodForOrder(3) })}</h3>
            <p className="ms-body">{tTools('tools.qawaid.oddBody', lang)}</p>
          </div>
          <div>
            <h3 className="ms-h3">{tfTools('tools.qawaid.doublyTitle', lang, { method: methodForOrder(4) })}</h3>
            <p className="ms-body">{tTools('tools.qawaid.doublyBody', lang)}</p>
          </div>
          <div>
            <h3 className="ms-h3">{tfTools('tools.qawaid.singlyTitle', lang, { method: methodForOrder(6) })}</h3>
            <p className="ms-body">{tTools('tools.qawaid.singlyBody', lang)}</p>
          </div>
        </div>
        <p className="ms-note">{tfTools('tools.qawaid.sourceNote', lang, { source: MAGIC_SQUARE_SOURCE })}</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.qawaid.reachTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.qawaid.reachBody', lang)}</p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>
            {tTools('tools.qawaid.reachEx1', lang)}
          </li>
          <li>
            {tTools('tools.qawaid.reachEx2', lang)}
          </li>
          <li>
            {tTools('tools.qawaid.reachEx3', lang)}
          </li>
          <li>
            {tTools('tools.qawaid.reachEx4', lang)}
          </li>
          <li>
            {tTools('tools.qawaid.reachEx5', lang)}
          </li>
        </ul>
        <p className="ms-body">
          {tTools('tools.qawaid.refusedNote', lang)}
        </p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.qawaid.validatorTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.qawaid.validatorBody1', lang)}</p>
        <p className="ms-body">{tTools('tools.qawaid.validatorBody2', lang)}</p>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.qawaid.refusedTitle', lang)}</h2>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          <li>{tTools('tools.qawaid.refused1', lang)}</li>
          <li>{tTools('tools.qawaid.refused2', lang)}</li>
          <li>{tTools('tools.qawaid.refused3', lang)}</li>
          <li>{tTools('tools.qawaid.refused4', lang)}</li>
          <li>{tTools('tools.qawaid.refused5', lang)}</li>
        </ul>
      </section>

      <section className="ms-card space-y-3">
        <h2 className="ms-h2">{tTools('tools.qawaid.modesTitle', lang)}</h2>
        <p className="ms-body">{tTools('tools.qawaid.modesIntro', lang)}</p>
        <ul className="list-disc pl-5 space-y-1.5 ms-body">
          {UNSUPPORTED_MODES.map((mode) => (
            <li key={mode.id}>
              <span className="font-medium ms-ink">{localizeUnsupportedMode(mode, lang).label}: </span>
              {localizeUnsupportedMode(mode, lang).note}
            </li>
          ))}
        </ul>
      </section>

      <p className="ms-note">
        {tTools('tools.qawaid.baseConstants', lang)} 3x3 = {magicConstant(3)}, 4x4 = {magicConstant(4)}, 5x5 ={' '}
        {magicConstant(5)}, 6x6 = {magicConstant(6)}, 7x7 = {magicConstant(7)}, 8x8 ={' '}
        {magicConstant(8)}, 9x9 = {magicConstant(9)}, 10x10 = {magicConstant(10)}.
      </p>
    </ToolsLayout>
  );
};
