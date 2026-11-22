'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, Check, RotateCcw, Sparkles } from 'lucide-react';
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
  auth_rls: 'MOD · 01',
  anti_regression_ci: 'MOD · 02',
  eaa_compliance: 'MOD · 03',
  flutter_mobile: 'MOD · 04',
  perf_sentry: 'MOD · 05',
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
 * Luxury editorial modular fee configurator on warm dotted silk cream
 * with elevated pure-white module cards and a sticky Parisian-navy Proposal Folio.
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
      className="scroll-mt-24 bg-cream-dotted py-20 text-[#0E2244] sm:py-28"
    >
      <Suspense fallback={null}>
        <CalculatorUrlSync onSync={handleUrlSync} />
      </Suspense>

      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
        {/* Editorial Header */}
        <SilkReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow-rule text-[#7F6330]">
              {locale === 'es' ? 'TARIFAS TRANSPARENTES' : 'PUBLISHED FEES'}
            </span>
            <h2 className="mt-4 font-serif text-4xl leading-[1.02] font-normal text-[#0E2244] sm:text-5xl lg:text-[58px]">
              {dict.calculator.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-[#5A6378]">
              {dict.calculator.sectionSubtitle}
            </p>
          </div>
        </SilkReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Stack Pill Switcher + Luxury Module Cards */}
          <div className="space-y-6 lg:col-span-8">
            {/* Stack Selector */}
            <div className="rounded-[24px] border border-[#0E2244]/10 bg-white p-5 shadow-luxury">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-sans text-[11px] font-semibold tracking-[0.22em] text-[#7F6330] uppercase">
                  {dict.calculator.stackLabel}
                </span>
                <span className="text-xs text-[#5A6378]">
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
                      className={`rounded-full border px-4 py-2.5 text-center text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] sm:text-sm ${
                        isActive
                          ? 'border-[#0E2244] bg-[#0E2244] text-[#F3EFE6] shadow-md'
                          : 'border-[#0E2244]/15 bg-[#F3EFE6]/60 text-[#5A6378] hover:border-[#0E2244]/40 hover:text-[#0E2244]'
                      }`}
                    >
                      {dict.calculator.stacks[option].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Module Selection Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
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
                    className={`group flex flex-col justify-between rounded-[24px] border p-6 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] ${
                      isSelected
                        ? 'border-[#D6B878] bg-white shadow-luxury ring-1 ring-[#D6B878]/50'
                        : 'border-[#0E2244]/10 bg-white/80 hover:-translate-y-0.5 hover:border-[#0E2244]/25 hover:bg-white'
                    }`}
                  >
                    <div className="w-full space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isSelected
                                ? 'border-[#0E2244] bg-[#0E2244] text-[#D6B878]'
                                : 'border-[#0E2244]/25 bg-[#F3EFE6] text-transparent group-hover:border-[#0E2244]'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.75]" />
                          </span>

                          <div>
                            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#7F6330] uppercase">
                              {MODULE_REF_CODES[mod.id]}
                            </span>
                            <span className="mt-0.5 block font-serif text-xl leading-snug font-medium text-[#0E2244]">
                              {copy.title}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="block font-serif text-2xl font-medium text-[#0E2244] tabular-nums">
                            {priceFormatted}
                          </span>
                          <span className="block font-mono text-[11px] text-[#5A6378] tabular-nums">
                            {mod.estimatedDays} {dict.calculator.summary.daysUnit}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-[#5A6378]">
                        {copy.description}
                      </p>

                      <ul className="space-y-1.5 border-t border-[#0E2244]/8 pt-3">
                        {copy.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs text-[#0E2244]/85"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#D6B878]"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isIncompatibleWithStack && (
                      <div className="mt-4 w-full border-t border-[#0E2244]/8 pt-2.5">
                        <span className="inline-block rounded-full bg-[#ECECE8] px-2.5 py-0.5 font-mono text-[10px] text-[#5A6378]">
                          {locale === 'es'
                            ? 'Activa stack híbrido'
                            : 'Enables hybrid stack'}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Optional 48h Diagnostic Addon */}
            <button
              type="button"
              role="checkbox"
              aria-checked={includeDiagnostic}
              onClick={() => setIncludeDiagnostic((prev) => !prev)}
              className={`group flex w-full flex-col gap-4 rounded-[24px] border p-6 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] sm:flex-row sm:items-center sm:justify-between ${
                includeDiagnostic
                  ? 'bg-gold-metallic border-white/60 text-[#0E2244] shadow-luxury'
                  : 'border-[#D6B878]/50 bg-[#FAF6EC] text-[#0E2244] hover:border-[#D6B878]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    includeDiagnostic
                      ? 'border-[#0E2244] bg-[#0E2244] text-[#D6B878]'
                      : 'border-[#0E2244]/35 bg-white text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[2.75]" />
                </span>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif text-xl font-medium text-[#0E2244]">
                      {dict.calculator.diagnosticAddon.title}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0E2244] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#D6B878] uppercase">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      {dict.calculator.diagnosticAddon.badge}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#0E2244]/80">
                    {dict.calculator.diagnosticAddon.subtitle}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-9 text-left sm:pl-4 sm:text-right">
                <span className="block font-serif text-2xl font-medium text-[#0E2244] tabular-nums">
                  {diagnosticPriceFormatted}
                </span>
                <span className="block font-mono text-[11px] text-[#0E2244]/70">
                  48h
                </span>
              </div>
            </button>
          </div>

          {/* Right: Sticky Deep Parisian-Navy Luxury Proposal Folio */}
          <aside className="bg-navy-pinstripe gold-shimmer-top rounded-[28px] border border-[#D6B878]/35 p-7 text-[#F3EFE6] shadow-luxury-dark sm:p-8 lg:sticky lg:top-28 lg:col-span-4">
            <div className="flex items-center justify-between border-b border-[#D6B878]/25 pb-4">
              <h3 className="font-sans text-[11px] font-semibold tracking-[0.26em] text-[#D6B878] uppercase">
                {dict.calculator.summary.heading}
              </h3>
              {estimate.isDiagnosticOnly && (
                <span className="rounded-full border border-[#D6B878]/45 bg-[#D6B878]/15 px-2.5 py-0.5 font-mono text-[10px] text-[#D6B878]">
                  {dict.calculator.summary.diagnosticOnlyBadge}
                </span>
              )}
            </div>

            <div className="mt-6">
              <div
                data-testid="calculator-total-price"
                className="font-serif text-6xl leading-none font-normal tracking-tight text-[#F3EFE6] tabular-nums"
              >
                {totalFormatted}
              </div>

              <div
                data-testid="calculator-timeline"
                className="mt-3 font-mono text-xs tracking-wider text-[#D6B878] uppercase tabular-nums"
              >
                {dict.calculator.summary.timelineLabel}:{' '}
                <strong className="font-semibold text-[#F3EFE6]">
                  {estimate.estimatedDays} {dict.calculator.summary.daysUnit}
                </strong>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-white/12 pt-5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#F3EFE6]/60">
                  {dict.calculator.summary.stackSummaryLabel}
                </span>
                <span className="font-medium text-[#F3EFE6]">
                  {dict.calculator.stacks[estimate.stack].label}
                </span>
              </div>

              {estimate.selectedModules.length > 0 && (
                <div className="space-y-2 border-t border-white/12 pt-3">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#D6B878] uppercase">
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
                          <span className="text-[#F3EFE6]/78">
                            {dict.calculator.modules[moduleId].title}
                          </span>
                          <span className="shrink-0 font-mono text-[#F3EFE6] tabular-nums">
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
                    <span className="text-[#F3EFE6]/65">
                      {dict.calculator.summary.subtotalLabel}
                    </span>
                    <span className="font-mono font-medium text-[#F3EFE6] tabular-nums">
                      {subtotalFormatted}
                    </span>
                  </div>
                </div>
              )}

              {estimate.includeDiagnostic && (
                <div className="space-y-1.5 border-t border-white/12 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F3EFE6]/70">
                      {dict.calculator.summary.diagnosticFeeLabel}
                    </span>
                    <span className="font-mono text-[#F3EFE6] tabular-nums">
                      {diagnosticFeeFormatted}
                    </span>
                  </div>
                  {estimate.diagnosticDiscount > 0 && (
                    <div className="flex items-center justify-between font-medium text-[#D6B878]">
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
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#D6B878]/45 bg-[#D6B878]/12 p-3.5 text-xs text-[#F3EFE6]"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#D6B878]"
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D6B878] px-6 py-4 text-sm font-semibold text-[#0E2244] transition-all hover:bg-[#E4CB93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
              >
                <span>{dict.calculator.summary.requestCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/18 bg-transparent px-4 py-2.5 text-xs font-medium text-[#F3EFE6]/72 transition-colors hover:border-[#D6B878]/60 hover:text-[#F3EFE6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
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
