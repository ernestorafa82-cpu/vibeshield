'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Calendar, Check, Copy, Mail, X } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import {
  buildMailtoHref,
  buildQuoteSummaryText,
  formatCurrency,
} from '@/lib/calculator';
import { getSiteConfig } from '@/lib/config';
import type { CalculatorEstimate, QuoteModalFormValues } from '@/types/vibeshield';

export interface RequestModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly estimate: CalculatorEstimate;
}

const INITIAL_FORM_VALUES: QuoteModalFormValues = {
  clientName: '',
  clientEmail: '',
  repositoryUrl: '',
  notes: '',
};

type CopyStatus = 'idle' | 'copied' | 'error';

/**
 * Porcelain-white and deep-navy accessible proposal dialog with WAI-ARIA focus trap.
 */
export function RequestModal({ isOpen, onClose, estimate }: RequestModalProps) {
  const { locale, dict } = useLocale();
  const [formValues, setFormValues] =
    useState<QuoteModalFormValues>(INITIAL_FORM_VALUES);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const nameId = useId();
  const emailId = useId();
  const repoId = useId();
  const notesId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const getFocusableElements = (): HTMLElement[] => {
      const container = dialogRef.current;
      if (!container) {
        return [];
      }
      const selector =
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll<HTMLElement>(selector));
    };

    const focusablesOnOpen = getFocusableElements();
    if (focusablesOnOpen.length > 0) {
      focusablesOnOpen[0].focus();
    } else {
      dialogRef.current?.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCopyStatus('idle');
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusables = getFocusableElements();
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (event.shiftKey) {
          if (active === first || !dialogRef.current?.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !dialogRef.current?.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const summaryText = useMemo(
    () => buildQuoteSummaryText(estimate, formValues, locale, dict),
    [estimate, formValues, locale, dict],
  );

  if (!isOpen) {
    return null;
  }

  const config = getSiteConfig();
  const totalFormatted = formatCurrency(
    estimate.totalPrice,
    estimate.currency,
    locale,
  );
  const mailtoSubject = `${dict.modal.mailtoSubjectPrefix} (${totalFormatted})`;
  const mailtoHref = buildMailtoHref(
    config.contactEmail,
    mailtoSubject,
    summaryText,
  );

  const handleClose = () => {
    setCopyStatus('idle');
    onClose();
  };

  const updateField = <K extends keyof QuoteModalFormValues>(
    field: K,
    value: QuoteModalFormValues[K],
  ) => {
    setCopyStatus('idle');
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopySummary = async () => {
    try {
      if (
        typeof navigator === 'undefined' ||
        !navigator.clipboard ||
        typeof navigator.clipboard.writeText !== 'function'
      ) {
        setCopyStatus('error');
        return;
      }

      await navigator.clipboard.writeText(summaryText);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        aria-hidden="true"
        onClick={handleClose}
        className="fixed inset-0 bg-[#091833]/72 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
        tabIndex={-1}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-[#BFDBFE] bg-[#F8FAFD] text-[#0E2244] shadow-luxury-dark focus:outline-none"
      >
        <div className="bg-navy-pinstripe flex items-start justify-between gap-4 border-b border-white/15 px-6 py-5 text-white sm:px-8">
          <div className="space-y-1">
            <div className="font-mono text-xs font-medium tracking-[0.18em] text-[#93C5FD] uppercase tabular-nums">
              {totalFormatted} · {estimate.estimatedDays}{' '}
              {dict.calculator.summary.daysUnit}
            </div>
            <h2
              id="request-modal-title"
              className="font-serif text-3xl font-normal text-white"
            >
              {dict.modal.title}
            </h2>
            <p className="text-xs text-white/72 sm:text-sm">
              {dict.modal.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label={dict.modal.closeLabel}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-[#EEF5FF] hover:text-[#0E2244] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor={nameId}
                className="block font-sans text-[11px] font-semibold tracking-[0.16em] text-[#2563EB] uppercase"
              >
                {dict.modal.fields.nameLabel}
              </label>
              <input
                id={nameId}
                type="text"
                value={formValues.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                placeholder={dict.modal.fields.namePlaceholder}
                className="w-full rounded-xl border border-[#0E2244]/15 bg-white px-4 py-2.5 text-sm text-[#0E2244] placeholder:text-[#52607A]/65 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={emailId}
                className="block font-sans text-[11px] font-semibold tracking-[0.16em] text-[#2563EB] uppercase"
              >
                {dict.modal.fields.emailLabel}
              </label>
              <input
                id={emailId}
                type="email"
                value={formValues.clientEmail}
                onChange={(e) => updateField('clientEmail', e.target.value)}
                placeholder={dict.modal.fields.emailPlaceholder}
                className="w-full rounded-xl border border-[#0E2244]/15 bg-white px-4 py-2.5 text-sm text-[#0E2244] placeholder:text-[#52607A]/65 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={repoId}
              className="block font-sans text-[11px] font-semibold tracking-[0.16em] text-[#2563EB] uppercase"
            >
              {dict.modal.fields.repoLabel}
            </label>
            <input
              id={repoId}
              type="url"
              value={formValues.repositoryUrl}
              onChange={(e) => updateField('repositoryUrl', e.target.value)}
              placeholder={dict.modal.fields.repoPlaceholder}
              className="w-full rounded-xl border border-[#0E2244]/15 bg-white px-4 py-2.5 font-mono text-xs text-[#0E2244] placeholder:text-[#52607A]/65 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={notesId}
              className="block font-sans text-[11px] font-semibold tracking-[0.16em] text-[#2563EB] uppercase"
            >
              {dict.modal.fields.notesLabel}
            </label>
            <textarea
              id={notesId}
              rows={2}
              value={formValues.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder={dict.modal.fields.notesPlaceholder}
              className="w-full resize-none rounded-xl border border-[#0E2244]/15 bg-white px-4 py-2.5 text-sm text-[#0E2244] placeholder:text-[#52607A]/65 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div className="space-y-2">
            <span className="block font-sans text-[11px] font-semibold tracking-[0.16em] text-[#2563EB] uppercase">
              {dict.modal.summaryHeading}
            </span>
            <pre
              data-testid="modal-summary-preview"
              className="max-h-52 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-[#93C5FD]/25 bg-[#0E2244] p-4 font-mono text-xs leading-relaxed text-[#EEF5FF]"
            >
              {summaryText}
            </pre>
          </div>

          {copyStatus !== 'idle' && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-xl border px-4 py-2.5 text-xs font-medium ${
                copyStatus === 'copied'
                  ? 'border-[#146C43]/35 bg-[#DCFCE7] text-[#146C43]'
                  : 'border-[#C94A22]/35 bg-[#FEE2E2] text-[#991B1B]'
              }`}
            >
              {copyStatus === 'copied'
                ? dict.modal.copiedFeedback
                : dict.modal.copyErrorFeedback}
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-[#0E2244]/10 bg-white px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#0E2244]/20 bg-white px-5 py-3 text-xs font-semibold text-[#0E2244] transition-colors hover:border-[#2563EB] hover:bg-[#EEF5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              {copyStatus === 'copied' ? (
                <Check className="h-4 w-4 text-[#146C43]" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{dict.modal.copyButton}</span>
            </button>

            <a
              href={mailtoHref}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0E2244] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{dict.modal.mailtoButton}</span>
            </a>

            {config.bookingUrl !== null && (
              <a
                href={config.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#DBEAFE] px-5 py-3 text-xs font-semibold text-[#0E2244] transition-colors hover:bg-[#BFDBFE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] sm:w-auto"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>{dict.modal.bookingButton}</span>
              </a>
            )}
          </div>

          <p className="text-center text-[11px] text-[#52607A]">
            {dict.modal.footerNote}
          </p>
        </div>
      </div>
    </div>
  );
}
