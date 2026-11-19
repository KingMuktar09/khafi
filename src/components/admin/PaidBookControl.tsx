import React from 'react';
import { IndianRupee } from 'lucide-react';
import { Book } from '../../types';

interface PaidBookControlProps {
  /** The book being edited. Only isPaid, price and paymentNote are used here. */
  book: Partial<Book>;
  onChange: (patch: Partial<Book>) => void;
}

/**
 * The one place where a book is made paid or free.
 *
 * - One toggle: "Paid book". Off = free, anyone can read it.
 * - One optional price field in ₹ (INR), shown only when paid. The price
 *   is kept for reference only: paid books are FREE for followers, no
 *   payment is ever taken, so a paid book needs no price.
 * - One optional note for readers.
 */
export const PaidBookControl: React.FC<PaidBookControlProps> = ({ book, onChange }) => {
  const isPaid = Boolean(book.isPaid);

  return (
    <div
      className={`p-3 rounded border space-y-3 ${
        isPaid
          ? 'bg-[var(--gold-faint)] border-[var(--gold)]/40'
          : 'bg-[var(--bg-main)] border-[var(--border-main)]'
      }`}
    >
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isPaid}
          onChange={(e) =>
            e.target.checked
              ? onChange({ isPaid: true })
              : onChange({ isPaid: false, price: undefined, paymentNote: undefined })
          }
          className="w-4 h-4 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer"
        />
        <IndianRupee className="w-4 h-4 text-[var(--gold)] shrink-0" />
        <span className="font-semibold text-[var(--text-main)] text-xs">
          Paid book
        </span>
        <span className="text-[11px] text-[var(--text-muted)]">
          {isPaid ? 'Followers read it free once unlocked.' : 'Free — anyone can read it.'}
        </span>
      </label>

      {isPaid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[var(--text-muted)] mb-1 font-medium text-xs">
              Price (₹ INR) (optional, reference only — no payment is taken)
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={book.price ?? ''}
              onChange={(e) =>
                onChange({
                  price: e.target.value === '' ? undefined : Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
              placeholder="e.g. 99"
            />
          </div>
          <div>
            <label className="block text-[var(--text-muted)] mb-1 font-medium text-xs">
              Note for readers (optional)
            </label>
            <input
              type="text"
              value={book.paymentNote || ''}
              onChange={(e) => onChange({ paymentNote: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-main)] rounded focus:outline-none focus:border-[var(--gold)] text-xs font-medium"
              placeholder="e.g. Key is in the broadcast channel"
            />
          </div>
        </div>
      )}

      <p className="text-[11px] text-[var(--text-faint)] leading-relaxed">
        Paid books need their own key — locked visitors see a
        key lock screen, never a payment screen.
      </p>
    </div>
  );
};
