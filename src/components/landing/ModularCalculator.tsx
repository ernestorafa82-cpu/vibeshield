'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, Check, RotateCcw } from 'lucide-react';
import { RequestModal } from '@/components/landing/RequestModal';
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
  auth_rls: 'MOD-01',
  anti_regression_ci: 'MOD-02',
  eaa_compliance: 'MOD-03',
  flutter_mobile: 'MOD-04',
  perf_sentry: 'MOD-05',
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
 * Editorial Swiss architectural fee schedule & live proposal configurator.
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
      className="bg-[#FBF9F5] py-24 text-[#141311] lg:py-32"
    >
      <Suspense fallback={null}>
        <CalculatorUrlSync onSync={handleUrlSync} />
      </Suspense>

      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="grid gap-8 border-b border-[#141311]/12 pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#C94A22] uppercase">
              DOC. 02 · {locale === 'es' ? 'TARIFAS PÚBLICAS' : 'PUBLISHED FEES'}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.04] tracking-[-0.02em] text-[#141311] sm:text-5xl">
              {dict.calculator.sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-[#57534C]">
              {dict.calculator.sectionSubtitle}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left: Stack Selector + Specification Rows */}
          <div className="space-y-8 lg:col-span-8">
            {/* Stack Selector Bar */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#857F75] uppercase">
                  {dict.calculator.stackLabel}
                </span>
                <span className="text-xs text-[#57534C]">
                  {dict.calculator.stacks[stack].hint}
                </span>
              </div>

              <div
                role="group"
                aria-label={dict.calculator.stackLabel}
                className="mt-3 grid grid-cols-1 border border-[#141311]/15 bg-white sm:grid-cols-3 sm:divide-x sm:divide-[#141311]/12"
              >
                {STACK_OPTIONS.map((option) => {
                  const isActive = stack === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleStackChange(option)}
                      className={`px-4 py-3.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C94A22] ${
                        isActive
                          ? 'bg-[#141311] text-[#FBF9F5]'
                          : 'bg-white text-[#57534C] hover:bg-[#F3EFE6]/60 hover:text-[#141311]'
                      }`}
                    >
                      {dict.calculator.stacks[option].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specification Sheet Module Rows */}
            <div className="border border-[#141311]/15 bg-white divide-y divide-[#141311]/12">
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
                    className={`group flex w-full flex-col gap-4 p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C94A22] sm:p-7 ${
                      isSelected
                        ? 'bg-[#F3EFE6]/75'
                        : 'bg-white hover:bg-[#FBF9F5]'
                    }`}
                  >
                    <div className="flex w-full items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                            isSelected
                              ? 'border-[#C94A22] bg-[#C94A22] text-[#FBF9F5]'
                              : 'border-[#141311]/35 bg-white text-transparent group-hover:border-[#141311]'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.75]" />
                        </span>

                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-[11px] tracking-[0.14em] text-[#857F75]">
                              {MODULE_REF_CODES[mod.id]}
                            </span>
                            {isIncompatibleWithStack && (
                              <span className="border border-[#141311]/15 bg-[#F3EFE6] px-2 py-0.5 font-mono text-[10px] text-[#57534C]">
                                {locale === 'es'
                                  ? 'Activa stack híbrido'
                                  : 'Enables hybrid stack'}
                              </span>
                            )}
                          </div>
                          <span className="mt-1 block text-base font-semibold tracking-tight text-[#141311]">
                            {copy.title}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="block font-mono text-base font-semibold text-[#141311] tabular-nums">
                          {priceFormatted}
                        </span>
                        <span className="block font-mono text-[11px] text-[#857F75] tabular-nums">
                          {mod.estimatedDays} {dict.calculator.summary.daysUnit}
                        </span>
                      </div>
                    </div>

                    <div className="pl-9 space-y-3">
                      <p className="text-sm leading-relaxed text-[#57534C]">
                        {copy.description}
                      </p>

                      <ul className="grid gap-1.5 border-t border-[#141311]/8 pt-3 sm:grid-cols-3">
                        {copy.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs leading-snug text-[#57534C]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1 w-1 shrink-0 bg-[#C94A22]"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional 48h Diagnostic Addon Row */}
            <button
              type="button"
              role="checkbox"
              aria-checked={includeDiagnostic}
              onClick={() => setIncludeDiagnostic((prev) => !prev)}
              className={`group flex w-full flex-col gap-3 border p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] sm:flex-row sm:items-center sm:justify-between sm:p-7 ${
                includeDiagnostic
                  ? 'border-[#1A6340] bg-[#EDF5F0]'
                  : 'border-[#141311]/15 bg-[#F3EFE6]/60 hover:border-[#141311]/35'
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
                    includeDiagnostic
                      ? 'border-[#1A6340] bg-[#1A6340] text-[#FBF9F5]'
                      : 'border-[#141311]/35 bg-white text-transparent group-hover:border-[#141311]'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[2.75]" />
                </span>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-base font-semibold text-[#141311]">
                      {dict.calculator.diagnosticAddon.title}
                    </span>
                    <span className="border border-[#1A6340]/35 bg-white/80 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-[#1A6340] uppercase">
                      {dict.calculator.diagnosticAddon.badge}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#57534C]">
                    {dict.calculator.diagnosticAddon.subtitle}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-9 text-left sm:pl-4 sm:text-right">
                <span className="block font-mono text-base font-semibold text-[#141311] tabular-nums">
                  {diagnosticPriceFormatted}
                </span>
                <span className="block font-mono text-[11px] text-[#857F75]">
                  48h
                </span>
              </div>
            </button>
          </div>

          {/* Right: Floating Pure-White Proposal Folio */}
          <aside className="border border-[#141311]/18 bg-white p-7 editorial-shadow sm:p-8 lg:sticky lg:top-24 lg:col-span-4">
            <div className="flex items-center justify-between border-b border-[#141311] pb-4">
              <h3 className="font-mono text-xs font-medium tracking-[0.16em] text-[#141311] uppercase">
                {dict.calculator.summary.heading}
              </h3>
              {estimate.isDiagnosticOnly && (
                <span className="border border-[#1A6340]/35 bg-[#EDF5F0] px-2 py-0.5 font-mono text-[10px] font-medium text-[#1A6340]">
                  {dict.calculator.summary.diagnosticOnlyBadge}
                </span>
              )}
            </div>

            <div className="mt-6">
              <div
                data-testid="calculator-total-price"
                className="font-serif text-5xl tracking-tight text-[#141311] tabular-nums sm:text-6xl"
              >
                {totalFormatted}
              </div>

              <div
                data-testid="calculator-timeline"
                className="mt-2.5 font-mono text-xs tracking-wider text-[#57534C] uppercase tabular-nums"
              >
                {dict.calculator.summary.timelineLabel}:{' '}
                <strong className="font-semibold text-[#141311]">
                  {estimate.estimatedDays} {dict.calculator.summary.daysUnit}
                </strong>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-[#141311]/12 pt-5 text-sm">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono tracking-wider text-[#857F75] uppercase">
                  {dict.calculator.summary.stackSummaryLabel}
                </span>
                <span className="font-medium text-[#141311]">
                  {dict.calculator.stacks[estimate.stack].label}
                </span>
              </div>

              {estimate.selectedModules.length > 0 && (
                <div className="space-y-2 border-t border-[#141311]/10 pt-3">
                  <div className="font-mono text-[11px] tracking-wider text-[#857F75] uppercase">
                    {dict.calculator.summary.modulesCountLabel} (
                    {estimate.selectedModules.length})
                  </div>
                  <ul className="space-y-1.5">
                    {estimate.selectedModules.map((moduleId) => {
                      const mod = RESCUE_MODULES.find((m) => m.id === moduleId);
                      if (!mod) return null;
                      return (
                        <li
                          key={moduleId}
                          className="flex items-baseline justify-between gap-3 text-xs"
                        >
                          <span className="text-[#57534C]">
                            {dict.calculator.modules[moduleId].title}
                          </span>
                          <span className="shrink-0 font-mono text-[#141311] tabular-nums">
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
                  <div className="flex items-center justify-between border-t border-[#141311]/10 pt-2.5 text-xs">
                    <span className="text-[#57534C]">
                      {dict.calculator.summary.subtotalLabel}
                    </span>
                    <span className="font-mono font-medium text-[#141311] tabular-nums">
                      {subtotalFormatted}
                    </span>
                  </div>
                </div>
              )}

              {estimate.includeDiagnostic && (
                <div className="space-y-1.5 border-t border-[#141311]/10 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#57534C]">
                      {dict.calculator.summary.diagnosticFeeLabel}
                    </span>
                    <span className="font-mono text-[#141311] tabular-nums">
                      {diagnosticFeeFormatted}
                    </span>
                  </div>
                  {estimate.diagnosticDiscount > 0 && (
                    <div className="flex items-center justify-between font-medium text-[#1A6340]">
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
                className="mt-5 flex items-start gap-2.5 border border-[#C94A22]/40 bg-[#FDF3EF] p-3.5 text-xs text-[#9C3515]"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
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
                className="inline-flex w-full items-center justify-center bg-[#141311] px-5 py-4 font-mono text-xs font-medium tracking-[0.1em] text-[#FBF9F5] uppercase transition-colors hover:bg-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] disabled:cursor-not-allowed disabled:bg-[#D8D3C8] disabled:text-[#857F75]"
              >
                {dict.calculator.summary.requestCta}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex w-full items-center justify-center gap-2 border border-[#141311]/15 bg-transparent px-4 py-2.5 font-mono text-[11px] tracking-wider text-[#57534C] uppercase transition-colors hover:border-[#141311] hover:text-[#141311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
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
