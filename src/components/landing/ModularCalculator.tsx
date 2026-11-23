'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { RequestModal } from '@/components/landing/RequestModal';
import { SilkReveal } from '@/components/motion/SilkReveal';
import { useLocale } from '@/context/LocaleContext';
import {
  DIAGNOSTIC_OFFER,
  RECOMMENDED_PACK_IDS,
  RESCUE_MODULES,
} from '@/data/modules';
import {
  applyStackChange,
  calculateEstimate,
  formatCurrency,
  resolveInitialModules,
  resolveInitialStack,
} from '@/lib/calculator';
import {
  DIAGNOSTIC_CTA_EVENT,
  type ModuleId,
  type RescueModule,
  type StackType,
} from '@/types/vibeshield';

const STACK_OPTIONS: readonly StackType[] = ['web', 'mobile', 'both'];

const MODULE_REF_CODES: Readonly<Record<ModuleId, string>> = {
  auth_rls: 'MOD 01',
  anti_regression_ci: 'MOD 02',
  eaa_compliance: 'MOD 03',
  flutter_mobile: 'MOD 04',
  perf_sentry: 'MOD 05',
};

interface CalculatorUrlSyncProps {
  onSync: (rawModules: string | null, diagnosticParam: string | null) => void;
}

function CalculatorUrlSync({ onSync }: CalculatorUrlSyncProps) {
  const searchParams = useSearchParams();
  const rawModules = searchParams.get('modules');
  const diagnosticParam = searchParams.get('diagnostic');

  useEffect(() => {
    onSync(rawModules, diagnosticParam);
  }, [rawModules, diagnosticParam, onSync]);

  return null;
}

/**
 * Clean porcelain & frosted pale ice-blue modular fee schedule
 * (unified full-width specification sheet rows — zero diamond symbols or burnt yellow).
 */
export function ModularCalculator() {
  const { locale, currency, dict } = useLocale();
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([
    ...RECOMMENDED_PACK_IDS,
  ]);
  const [stack, setStack] = useState<StackType>('web');
  const [includeDiagnostic, setIncludeDiagnostic] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleUrlSync = useCallback(
    (rawModules: string | null, diagnosticParam: string | null) => {
      if (rawModules !== null) {
        const resolved = resolveInitialModules(rawModules);
        setSelectedModules(resolved);
        setStack(resolveInitialStack(resolved));
      } else {
        setSelectedModules([...RECOMMENDED_PACK_IDS]);
        setStack('web');
      }

      setIncludeDiagnostic(diagnosticParam === '1');
    },
    [],
  );

  useEffect(() => {
    const handleDiagnosticEvent = () => {
      setIncludeDiagnostic(true);
    };

    window.addEventListener(DIAGNOSTIC_CTA_EVENT, handleDiagnosticEvent);
    return () => {
      window.removeEventListener(DIAGNOSTIC_CTA_EVENT, handleDiagnosticEvent);
    };
  }, []);

  const estimate = useMemo(
    () =>
      calculateEstimate({
        selectedModules,
        includeDiagnostic,
        stack,
        currency,
      }),
    [selectedModules, includeDiagnostic, stack, currency],
  );

  const handleStackChange = (nextStack: StackType) => {
    setStack(nextStack);
    setSelectedModules((prev) => applyStackChange(prev, nextStack));
  };

  const handleToggleModule = (mod: RescueModule) => {
    const isCurrentlySelected = selectedModules.includes(mod.id);
    if (isCurrentlySelected) {
      setSelectedModules((prev) => prev.filter((id) => id !== mod.id));
      return;
    }

    if (!mod.supportedStacks.includes(stack)) {
      const nextStack: StackType = mod.supportedStacks.includes('both')
        ? 'both'
        : mod.supportedStacks[0];
      setStack(nextStack);
    }

    setSelectedModules((prev) =>
      prev.includes(mod.id) ? prev : [...prev, mod.id],
    );
  };

  const handleReset = () => {
    setStack('web');
    setSelectedModules([...RECOMMENDED_PACK_IDS]);
    setIncludeDiagnostic(false);
  };

  const diagnosticPriceFormatted = formatCurrency(
    DIAGNOSTIC_OFFER.price[currency],
    currency,
    locale,
  );
  const totalFormatted = formatCurrency(estimate.totalPrice, currency, locale);
  const subtotalFormatted = formatCurrency(
    estimate.modulesSubtotal,
    currency,
    locale,
  );
  const diagnosticFeeFormatted = formatCurrency(
    estimate.diagnosticFee,
    currency,
    locale,
  );
  const diagnosticDiscountFormatted = formatCurrency(
    estimate.diagnosticDiscount,
    currency,
    locale,
  );

  return (
    <section
      id="calculator"
      className="scroll-mt-24 bg-porcelain-canvas py-20 text-[#0E2244] sm:py-28"
    >
      <Suspense fallback={null}>
        <CalculatorUrlSync onSync={handleUrlSync} />
      </Suspense>

      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
        {/* Editorial Header */}
        <SilkReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow-rule text-[#2563EB]">
              {locale === 'es' ? 'TARIFAS TRANSPARENTES' : 'PUBLISHED FEES'}
            </span>
            <h2 className="mt-4 font-serif text-4xl leading-[1.02] font-normal text-[#0E2244] sm:text-5xl lg:text-[56px]">
              {dict.calculator.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-[#52607A]">
              {dict.calculator.sectionSubtitle}
            </p>
          </div>
        </SilkReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Stack Pill Switcher + Unified Porcelain/Ice-Blue Specification Sheet */}
          <div className="space-y-6 lg:col-span-8">
            {/* Stack Selector */}
            <div className="rounded-[24px] border border-[#0E2244]/10 bg-white p-5 shadow-luxury">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#2563EB] uppercase">
                  {dict.calculator.stackLabel}
                </span>
                <span className="text-xs text-[#52607A]">
                  {dict.calculator.stacks[stack].hint}
                </span>
              </div>

              <div
                role="group"
                aria-label={dict.calculator.stackLabel}
                className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-3"
              >
                {STACK_OPTIONS.map((option) => {
                  const isActive = stack === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleStackChange(option)}
                      className={`rounded-full border px-4 py-2.5 text-center text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] sm:text-sm ${
                        isActive
                          ? 'border-[#0E2244] bg-[#0E2244] text-white shadow-sm'
                          : 'border-[#0E2244]/12 bg-[#F8FAFD] text-[#52607A] hover:border-[#93C5FD] hover:bg-[#EEF5FF] hover:text-[#0E2244]'
                      }`}
                    >
                      {dict.calculator.stacks[option].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unified Specification List (clean full-width rows, pale ice-blue when selected) */}
            <div className="overflow-hidden rounded-[26px] border border-[#0E2244]/10 bg-white shadow-luxury divide-y divide-[#0E2244]/10">
              {RESCUE_MODULES.map((mod) => {
                const isSelected = estimate.selectedModules.includes(mod.id);
                const copy = dict.calculator.modules[mod.id];
                const priceFormatted = formatCurrency(
                  mod.price[currency],
                  currency,
                  locale,
                );
                const isIncompatibleWithStack =
                  !mod.supportedStacks.includes(stack);

                return (
                  <button
                    key={mod.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    onClick={() => handleToggleModule(mod)}
                    className={`group flex w-full flex-col gap-3.5 p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB] sm:p-7 ${
                      isSelected
                        ? 'bg-[#EEF5FF]/80'
                        : 'bg-white hover:bg-[#F8FAFD]'
                    }`}
                  >
                    <div className="flex w-full items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span
                          aria-hidden="true"
                          className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isSelected
                              ? 'border-[#2563EB] bg-[#2563EB] text-white'
                              : 'border-[#0E2244]/25 bg-white text-transparent group-hover:border-[#0E2244]'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.75]" />
                        </span>

                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#2563EB] uppercase">
                              {MODULE_REF_CODES[mod.id]}
                            </span>
                            {isIncompatibleWithStack && (
                              <span className="rounded-full bg-[#E6EFFC] px-2.5 py-0.5 font-mono text-[10px] text-[#1A3B75]">
                                {locale === 'es'
                                  ? 'Activa stack híbrido'
                                  : 'Enables hybrid stack'}
                              </span>
                            )}
                          </div>
                          <span className="mt-1 block font-serif text-2xl leading-snug font-medium text-[#0E2244]">
                            {copy.title}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="block font-serif text-2xl font-medium text-[#0E2244] tabular-nums">
                          {priceFormatted}
                        </span>
                        <span className="block font-mono text-[11px] text-[#52607A] tabular-nums">
                          {mod.estimatedDays} {dict.calculator.summary.daysUnit}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pl-10">
                      <p className="text-sm leading-relaxed text-[#52607A]">
                        {copy.description}
                      </p>

                      <ul className="grid gap-2 border-t border-[#0E2244]/8 pt-3 sm:grid-cols-3">
                        {copy.deliverables.map((item) => (
                          <li
                            key={item}
                            className="border-l-2 border-[#BFDBFE] pl-2.5 text-xs leading-snug text-[#0E2244]/80"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional 48h Diagnostic Addon Row in Frosted White-Blue */}
            <button
              type="button"
              role="checkbox"
              aria-checked={includeDiagnostic}
              onClick={() => setIncludeDiagnostic((prev) => !prev)}
              className={`group flex w-full flex-col gap-4 rounded-[24px] border p-6 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] sm:flex-row sm:items-center sm:justify-between sm:p-7 ${
                includeDiagnostic
                  ? 'bg-ice-luxury border-[#60A5FA] text-[#0E2244] shadow-luxury'
                  : 'border-[#BFDBFE] bg-white text-[#0E2244] hover:bg-[#F5F9FF]'
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    includeDiagnostic
                      ? 'border-[#0E2244] bg-[#0E2244] text-white'
                      : 'border-[#0E2244]/30 bg-white text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[2.75]" />
                </span>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-serif text-2xl font-medium text-[#0E2244]">
                      {dict.calculator.diagnosticAddon.title}
                    </span>
                    <span className="rounded-full bg-[#DBEAFE] px-3 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[#1D4ED8] uppercase">
                      {dict.calculator.diagnosticAddon.badge}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#52607A]">
                    {dict.calculator.diagnosticAddon.subtitle}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-10 text-left sm:pl-4 sm:text-right">
                <span className="block font-serif text-2xl font-medium text-[#0E2244] tabular-nums">
                  {diagnosticPriceFormatted}
                </span>
                <span className="block font-mono text-[11px] text-[#52607A]">
                  48h
                </span>
              </div>
            </button>
          </div>

          {/* Right: Sticky Deep Parisian-Navy Proposal Folio */}
          <aside className="bg-navy-pinstripe ice-shimmer-top rounded-[28px] border border-[#93C5FD]/25 p-7 text-white shadow-luxury-dark sm:p-8 lg:sticky lg:top-28 lg:col-span-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <h3 className="font-mono text-[11px] font-semibold tracking-[0.24em] text-[#93C5FD] uppercase">
                {dict.calculator.summary.heading}
              </h3>
              {estimate.isDiagnosticOnly && (
                <span className="rounded-full border border-[#93C5FD]/40 bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-[#DBEAFE]">
                  {dict.calculator.summary.diagnosticOnlyBadge}
                </span>
              )}
            </div>

            <div className="mt-6">
              <div
                data-testid="calculator-total-price"
                className="font-serif text-6xl leading-none font-normal tracking-tight text-white tabular-nums"
              >
                {totalFormatted}
              </div>

              <div
                data-testid="calculator-timeline"
                className="mt-3 font-mono text-xs tracking-wider text-[#93C5FD] uppercase tabular-nums"
              >
                {dict.calculator.summary.timelineLabel}:{' '}
                <strong className="font-semibold text-white">
                  {estimate.estimatedDays} {dict.calculator.summary.daysUnit}
                </strong>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-white/12 pt-5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-white/60">
                  {dict.calculator.summary.stackSummaryLabel}
                </span>
                <span className="font-medium text-white">
                  {dict.calculator.stacks[estimate.stack].label}
                </span>
              </div>

              {estimate.selectedModules.length > 0 && (
                <div className="space-y-2 border-t border-white/12 pt-3">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#93C5FD] uppercase">
                    {dict.calculator.summary.modulesCountLabel} (
                    {estimate.selectedModules.length})
                  </div>
                  <ul className="space-y-2">
                    {estimate.selectedModules.map((moduleId) => {
                      const mod = RESCUE_MODULES.find((m) => m.id === moduleId);
                      if (!mod) return null;
                      return (
                        <li
                          key={moduleId}
                          className="flex items-baseline justify-between gap-3"
                        >
                          <span className="text-white/78">
                            {dict.calculator.modules[moduleId].title}
                          </span>
                          <span className="shrink-0 font-mono text-white tabular-nums">
                            {formatCurrency(
                              mod.price[currency],
                              currency,
                              locale,
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex items-center justify-between border-t border-white/12 pt-2.5">
                    <span className="text-white/65">
                      {dict.calculator.summary.subtotalLabel}
                    </span>
                    <span className="font-mono font-medium text-white tabular-nums">
                      {subtotalFormatted}
                    </span>
                  </div>
                </div>
              )}

              {estimate.includeDiagnostic && (
                <div className="space-y-1.5 border-t border-white/12 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">
                      {dict.calculator.summary.diagnosticFeeLabel}
                    </span>
                    <span className="font-mono text-white tabular-nums">
                      {diagnosticFeeFormatted}
                    </span>
                  </div>
                  {estimate.diagnosticDiscount > 0 && (
                    <div className="flex items-center justify-between font-medium text-[#93C5FD]">
                      <span>
                        {dict.calculator.summary.diagnosticCreditLabel}
                      </span>
                      <span className="font-mono tabular-nums">
                        −{diagnosticDiscountFormatted}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!estimate.hasSelection && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#93C5FD]/40 bg-white/10 p-3.5 text-xs text-white"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#93C5FD]"
                  aria-hidden="true"
                />
                <span>{dict.calculator.summary.emptyWarning}</span>
              </div>
            )}

            <div className="mt-7 space-y-2.5">
              <button
                type="button"
                disabled={!estimate.hasSelection}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#EEF5FF] px-6 py-4 text-sm font-semibold text-[#0E2244] transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
              >
                <span>{dict.calculator.summary.requestCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/18 bg-transparent px-4 py-2.5 text-xs font-medium text-white/72 transition-colors hover:border-[#93C5FD]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{dict.calculator.summary.resetCta}</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        estimate={estimate}
      />
    </section>
  );
}
