'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Calendar, Check, Copy, Mail, ShieldCheck, X } from 'lucide-react';
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
 * Accessible modal displaying an editable request form, live plain-text summary,
 * clipboard copy with safe fallback, mailto action, and optional sanitized booking link.
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
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
        tabIndex={-1}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#111114] text-zinc-100 shadow-2xl focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>{totalFormatted} · {estimate.estimatedDays} {dict.calculator.summary.daysUnit}</span>
            </div>
            <h2
              id="request-modal-title"
              className="text-xl font-semibold tracking-tight text-white"
            >
              {dict.modal.title}
            </h2>
            <p className="text-sm text-zinc-400">{dict.modal.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label={dict.modal.closeLabel}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor={nameId}
                className="block text-xs font-medium text-zinc-300"
              >
                {dict.modal.fields.nameLabel}
              </label>
              <input
                id={nameId}
                type="text"
                value={formValues.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                placeholder={dict.modal.fields.namePlaceholder}
                className="w-full rounded-lg border border-zinc-800 bg-[#09090B] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={emailId}
                className="block text-xs font-medium text-zinc-300"
              >
                {dict.modal.fields.emailLabel}
              </label>
              <input
                id={emailId}
                type="email"
                value={formValues.clientEmail}
                onChange={(e) => updateField('clientEmail', e.target.value)}
                placeholder={dict.modal.fields.emailPlaceholder}
                className="w-full rounded-lg border border-zinc-800 bg-[#09090B] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={repoId}
              className="block text-xs font-medium text-zinc-300"
            >
              {dict.modal.fields.repoLabel}
            </label>
            <input
              id={repoId}
              type="url"
              value={formValues.repositoryUrl}
              onChange={(e) => updateField('repositoryUrl', e.target.value)}
              placeholder={dict.modal.fields.repoPlaceholder}
              className="w-full rounded-lg border border-zinc-800 bg-[#09090B] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={notesId}
              className="block text-xs font-medium text-zinc-300"
            >
              {dict.modal.fields.notesLabel}
            </label>
            <textarea
              id={notesId}
              rows={2}
              value={formValues.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder={dict.modal.fields.notesPlaceholder}
              className="w-full resize-none rounded-lg border border-zinc-800 bg-[#09090B] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                {dict.modal.summaryHeading}
              </span>
            </div>
            <pre
              data-testid="modal-summary-preview"
              className="max-h-52 overflow-y-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#09090B] p-4 font-mono text-xs leading-relaxed text-zinc-200"
            >
              {summaryText}
            </pre>
          </div>

          {copyStatus !== 'idle' && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                copyStatus === 'copied'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-200'
              }`}
            >
              {copyStatus === 'copied'
                ? dict.modal.copiedFeedback
                : dict.modal.copyErrorFeedback}
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-zinc-800 bg-[#09090B]/80 px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {copyStatus === 'copied' ? (
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              )}
              <span>{dict.modal.copyButton}</span>
            </button>

            <a
              href={mailtoHref}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{dict.modal.mailtoButton}</span>
            </a>

            {config.bookingUrl !== null && (
              <a
                href={config.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:border-cyan-400/60 hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:w-auto"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>{dict.modal.bookingButton}</span>
              </a>
            )}
          </div>

          <p className="text-center text-xs text-zinc-500">
            {dict.modal.footerNote}
          </p>
        </div>
      </div>
    </div>
  );
}
