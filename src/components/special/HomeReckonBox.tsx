import React, { useMemo, useState } from 'react';
import { valueOfText } from '../../utils/abjad';
import { router } from '../../router/router';

/**
 * Home reckon box: type a name in Arabic, see its abjad value live.
 *
 * Kabir values, Mashriqi school, the same code the Huruf tool uses.
 * The total updates with every keystroke, with the per-letter
 * breakdown under it. Nothing is sent anywhere; the counting happens
 * on this device. Other systems and schools are in the Huruf tool.
 */
export const HomeReckonBox: React.FC = () => {
  const [name, setName] = useState('');

  const reckoned = useMemo(
    () => (name.trim().length > 0 ? valueOfText(name, 'kabir', 'mashriqi') : null),
    [name],
  );

  return (
    <section aria-label="Reckon a name" className="ms-card p-5 space-y-3 animate-fade-up">
      <p className="ms-label">Reckon a name</p>
      <h2 className="font-display font-semibold text-xl text-[var(--text-main)]">
        What is a name worth in numbers?
      </h2>
      <p className="ms-body">
        Type a name in Arabic. Its letters are counted in the abjad system, live, as you type.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اكتب اسماً هنا"
          aria-label="Type a name in Arabic to reckon its value"
          dir="rtl"
          lang="ar"
          className="tap-target flex-1 px-4 py-3 text-lg bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-xl focus:outline-none focus:border-[var(--gold)] ms-arabic-sm"
        />
        <div className="shrink-0 text-center sm:text-left">
          <p className="ms-label">Value, Kabir Mashriqi</p>
          <p className="font-display font-semibold text-3xl text-[var(--gold)]">
            {reckoned ? reckoned.total : '-'}
          </p>
        </div>
      </div>
      {reckoned && reckoned.letters.length > 0 && (
        <div className="flex flex-wrap gap-2" dir="rtl" lang="ar">
          {reckoned.letters.map((entry, i) => (
            <span
              key={`${entry.letter}-${i}`}
              className="text-center px-3 py-1.5 rounded border border-[var(--border-main)]"
            >
              <span className="ms-arabic-sm block">{entry.letter}</span>
              <span className="block text-xs text-[var(--text-muted)]" lang="en">
                {entry.value}
              </span>
            </span>
          ))}
        </div>
      )}
      {reckoned && reckoned.letters.length === 0 && (
        <p className="ms-note">No Arabic letters found in that text.</p>
      )}
      {!reckoned && (
        <p className="ms-note">Type a name in Arabic to see its value.</p>
      )}
      <p className="ms-note">
        Kabir values, Mashriqi school. Other systems and schools are in the Huruf tool.
      </p>
      <button
        onClick={() => router.navigate('tools-huruf')}
        className="text-xs text-[var(--gold)] font-medium flex items-center gap-1 cursor-pointer"
      >
        <span>Open the Huruf tool</span>
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
};
