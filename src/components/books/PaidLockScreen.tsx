import React, { useEffect, useState } from 'react';
import { Check, Copy, IndianRupee, QrCode } from 'lucide-react';
import { Book, EMPTY_PAYMENT_SETTINGS, PaymentSettings } from '../../types';
import { api } from '../../services/api';

interface PaidLockScreenProps {
  book: Book;
  /** Optional back action (e.g. the reader view goes back to the book page). */
  onBack?: () => void;
  backLabel?: string;
}

/**
 * Locked pay screen for a paid book, shown to normal (non-admin) users
 * instead of any reader, download or "Open in Drive" link.
 *
 * No payment gateway and no automatic verification: the visitor pays by
 * UPI and messages @ghayb.chronicles with proof, and the admin unlocks
 * access manually. Admins never see this screen — they read paid books
 * directly.
 */
export const PaidLockScreen: React.FC<PaidLockScreenProps> = ({ book, onBack, backLabel }) => {
  const [paySettings, setPaySettings] = useState<PaymentSettings>(EMPTY_PAYMENT_SETTINGS);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (book?.isPaid) {
      api.getPaymentSettings().then(setPaySettings).catch(() => {});
    }
  }, [book?.isPaid]);

  const copyUpiId = async () => {
    if (!paySettings.upiId) return;
    try {
      await navigator.clipboard.writeText(paySettings.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // clipboard unavailable; the ID is shown in full for manual copying
    }
  };

  const priceLabel =
    typeof book.price === 'number' ? `₹${book.price.toLocaleString('en-IN')}` : 'price set by the library';

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] bg-[var(--gold-faint)] border border-[var(--gold)]/40 rounded-full px-3 py-1 w-fit">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Paid book — locked</span>
        </p>
        <p className="font-display font-semibold text-lg text-[var(--text-main)]">
          This book is paid — {priceLabel}
        </p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Pay by UPI below. After payment, message{' '}
          <a href="https://instagram.com/ghayb.chronicles" target="_blank" rel="noreferrer" className="text-[var(--gold)] font-semibold underline underline-offset-2">
            @ghayb.chronicles on Instagram
          </a>{' '}
          with your payment proof — access is unlocked manually. There is no automatic payment check on this free site.
        </p>
      </div>

      {book.paymentLink ? (
        <a
          href={book.paymentLink}
          target="_blank"
          rel="noreferrer"
          className="tap-target w-full py-3 px-4 rounded-xl font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <IndianRupee className="w-4 h-4" />
          <span>Pay {typeof book.price === 'number' ? priceLabel : ''} now</span>
        </a>
      ) : null}

      {/* UPI checkout */}
      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl space-y-3">
        <p className="font-semibold text-sm flex items-center gap-2">
          <QrCode className="w-4 h-4 text-[var(--gold)]" />
          <span>Pay by UPI</span>
        </p>
        {paySettings.upiId ? (
          <>
            {paySettings.displayName && (
              <p className="text-xs text-[var(--text-muted)]">
                Pay to: <span className="font-semibold text-[var(--text-main)]">{paySettings.displayName}</span>
              </p>
            )}
            <div className="flex items-center gap-2">
              <code className="flex-1 min-w-0 break-all text-sm font-semibold bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg px-3 py-2.5">
                {paySettings.upiId}
              </code>
              <button
                type="button"
                onClick={copyUpiId}
                className="tap-target shrink-0 px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-main)] hover:border-[var(--gold)]/60 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[var(--gold)]" />}
                <span>{copiedUpi ? 'Copied' : 'Copy UPI ID'}</span>
              </button>
            </div>
            {paySettings.upiQrUrl && (
              <div className="flex flex-col items-center gap-2 pt-1">
                <img
                  src={paySettings.upiQrUrl}
                  alt="UPI QR code for payment"
                  className="w-52 h-52 max-w-full object-contain rounded-xl border border-[var(--border-main)] bg-white p-2"
                />
                <p className="text-[11px] text-[var(--text-muted)]">Scan with any UPI app to pay</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            UPI payment details are not set yet. Please message{' '}
            <a href="https://instagram.com/ghayb.chronicles" target="_blank" rel="noreferrer" className="text-[var(--gold)] font-semibold underline underline-offset-2">
              @ghayb.chronicles
            </a>{' '}
            on Instagram to pay for this book.
          </p>
        )}
        {book.paymentNote && (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] pt-2">
            {book.paymentNote}
          </p>
        )}
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="tap-target w-full py-2.5 px-4 rounded-xl font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] transition-colors cursor-pointer text-sm"
        >
          {backLabel || 'Back to book details'}
        </button>
      )}
    </div>
  );
};
