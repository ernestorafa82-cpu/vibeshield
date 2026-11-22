'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Check,
  Clock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
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

interface CalculatorUrlSyncProps {
  readonly onSync: (
    rawModules: string | null,
    diagnosticParam: string | null,
  ) => void;
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
 * Interactive modular rescue calculator with URL query sync, stack filtering,
 * 48h diagnostic credit logic, and sticky estimate summary.
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
    const isCurrentlySelected = estimate.selectedModules.includes(mod.id);
    const isCompatible = mod.supportedStacks.includes(stack);

    if (!isCompatible) {
      // Auto-expand stack to 'both' so selecting a cross-stack module works seamlessly
      // without discarding already selected modules.
      const nextStack: StackType = 'both';
      setStack(nextStack);
      setSelectedModules((prev) => {
        const filtered = applyStackChange(prev, nextStack);
        return filtered.includes(mod.id) ? filtered : [...filtered, mod.id];
      });
      return;
    }

    setSelectedModules((prev) =>
      isCurrentlySelected
        ? prev.filter((id) => id !== mod.id)
        : [...prev, mod.id],
    );
  };

  const handleReset = () => {
    setSelectedModules([...RECOMMENDED_PACK_IDS]);
    setStack('web');
    setIncludeDiagnostic(false);
  };

  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="relative border-t border-zinc-800/80 bg-[#09090B] py-20 sm:py-24"
    >
      <Suspense fallback={null}>
        <CalculatorUrlSync onSync={handleUrlSync} />
      </Suspense>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl space-y-3">
          <h2
            id="calculator-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            {dict.calculator.sectionTitle}
          </h2>
          <p className="text-base leading-relaxed text-zinc-400">
            {dict.calculator.sectionSubtitle}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            {/* Stack selector */}
            <div className="rounded-2xl border border-zinc-800 bg-[#111114] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {dict.calculator.stackLabel}
                </span>
                <p className="text-xs text-zinc-500">
                  {dict.calculator.stacks[stack].hint}
                </p>
              </div>

              <div
                role="group"
                aria-label={dict.calculator.stackLabel}
                className="mt-3 grid gap-2 sm:grid-cols-3"
              >
                {STACK_OPTIONS.map((stackKey) => {
                  const isActive = stack === stackKey;
                  return (
                    <button
                      key={stackKey}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleStackChange(stackKey)}
                      className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                        isActive
                          ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200'
                          : 'border-zinc-800 bg-[#09090B] text-zinc-300 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {dict.calculator.stacks[stackKey].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5 modular rescue cards */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              {RESCUE_MODULES.map((mod) => {
                const modCopy = dict.calculator.modules[mod.id];
                const isSelected = estimate.selectedModules.includes(mod.id);
                const isCompatible = mod.supportedStacks.includes(stack);
                const priceFormatted = formatCurrency(
                  mod.price[currency],
                  currency,
                  locale,
                );

                return (
                  <button
                    key={mod.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    onClick={() => handleToggleModule(mod)}
                    className={`group flex h-full flex-col justify-between rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      isSelected
                        ? 'border-emerald-500/60 bg-[#111114] shadow-[0_0_24px_-12px_rgba(16,185,129,0.4)]'
                        : isCompatible
                          ? 'border-zinc-800 bg-[#111114]/70 hover:border-zinc-700 hover:bg-[#111114]'
                          : 'border-zinc-800/70 bg-[#111114]/40 opacity-80 hover:border-zinc-700 hover:opacity-100'
                    }`}
                  >
                    <span className="block w-full space-y-3">
                      <span className="flex items-start justify-between gap-3">
                        <span className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-zinc-700 bg-[#09090B] text-transparent group-hover:border-zinc-500'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.75]" />
                          </span>
                          <span className="text-base font-semibold leading-snug text-white">
                            {modCopy.title}
                          </span>
                        </span>

                        <span className="shrink-0 text-right">
                          <span className="block font-mono text-sm font-semibold text-emerald-300 tabular-nums">
                            {priceFormatted}
                          </span>
                          <span className="block text-[11px] text-zinc-500">
                            {mod.estimatedDays} {dict.calculator.summary.daysUnit}
                          </span>
                        </span>
                      </span>

                      <span className="block text-xs leading-relaxed text-zinc-400">
                        {modCopy.description}
                      </span>

                      <span className="block space-y-1.5 border-t border-zinc-800/80 pt-3">
                        {modCopy.deliverables.map((item) => (
                          <span
                            key={item}
                            className="flex items-start gap-2 text-xs text-zinc-300"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400"
                            />
                            <span>{item}</span>
                          </span>
                        ))}
                      </span>
                    </span>

                    {!isCompatible && (
                      <span className="mt-3 inline-flex w-fit items-center rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[11px] text-cyan-300">
                        {dict.calculator.stacks.both.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 48h Diagnostic toggle card */}
            <button
              type="button"
              role="checkbox"
              aria-checked={includeDiagnostic}
              onClick={() => setIncludeDiagnostic((prev) => !prev)}
              className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                includeDiagnostic
                  ? 'border-emerald-500/60 bg-emerald-500/10'
                  : 'border-zinc-800 bg-[#111114] hover:border-zinc-700'
              }`}
            >
              <span className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    includeDiagnostic
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-zinc-700 bg-[#09090B] text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[2.75]" />
                </span>

                <span className="block space-y-1.5">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-white">
                      {dict.calculator.diagnosticAddon.title}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      {dict.calculator.diagnosticAddon.badge}
                    </span>
                  </span>
                  <span className="block text-xs leading-relaxed text-zinc-400">
                    {dict.calculator.diagnosticAddon.subtitle}
                  </span>
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="block font-mono text-sm font-semibold text-white tabular-nums">
                  {formatCurrency(
                    DIAGNOSTIC_OFFER.price[currency],
                    currency,
                    locale,
                  )}
                </span>
                <span className="block text-[11px] text-zinc-500">
                  {DIAGNOSTIC_OFFER.estimatedDays}{' '}
                  {dict.calculator.summary.daysUnit}
                </span>
              </span>
            </button>
          </div>

          {/* Sticky summary panel */}
          <aside className="rounded-2xl border border-zinc-800 bg-[#111114] p-6 lg:sticky lg:top-24 lg:col-span-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                {dict.calculator.summary.heading}
              </h3>

              {estimate.isDiagnosticOnly && (
                <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                  {dict.calculator.summary.diagnosticOnlyBadge}
                </span>
              )}
            </div>

            <div className="mt-4 border-b border-zinc-800 pb-5">
              <div
                data-testid="calculator-total-price"
                className="text-4xl font-bold tracking-tight text-white tabular-nums"
              >
                {formatCurrency(estimate.totalPrice, estimate.currency, locale)}
              </div>
              <div
                data-testid="calculator-timeline"
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-300"
              >
                <Clock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span>
                  {dict.calculator.summary.timelineLabel}:{' '}
                  <strong className="font-semibold text-white">
                    {estimate.estimatedDays} {dict.calculator.summary.daysUnit}
                  </strong>
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 text-zinc-400">
                <span>{dict.calculator.summary.stackSummaryLabel}</span>
                <span className="text-right font-medium text-zinc-200">
                  {dict.calculator.stacks[estimate.stack].label}
                </span>
              </div>

              {estimate.selectedModules.length > 0 && (
                <div className="space-y-2 border-t border-zinc-800/80 pt-3">
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {dict.calculator.summary.modulesCountLabel} (
                    {estimate.selectedModules.length})
                  </div>
                  <ul className="space-y-2">
                    {estimate.selectedModules.map((id) => {
                      const mod = RESCUE_MODULES.find((item) => item.id === id);
                      if (!mod) {
                        return null;
                      }
                      return (
                        <li
                          key={id}
                          className="flex items-center justify-between gap-3 text-zinc-300"
                        >
                          <span className="truncate">
                            {dict.calculator.modules[id].title}
                          </span>
                          <span className="shrink-0 font-mono text-xs text-zinc-200 tabular-nums">
                            {formatCurrency(
                              mod.price[estimate.currency],
                              estimate.currency,
                              locale,
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 text-zinc-400">
                    <span>{dict.calculator.summary.subtotalLabel}</span>
                    <span className="font-mono text-zinc-200 tabular-nums">
                      {formatCurrency(
                        estimate.modulesSubtotal,
                        estimate.currency,
                        locale,
                      )}
                    </span>
                  </div>
                </div>
              )}

              {estimate.includeDiagnostic && (
                <div className="space-y-2 border-t border-zinc-800/80 pt-3">
                  <div className="flex items-center justify-between gap-3 text-zinc-300">
                    <span>{dict.calculator.summary.diagnosticFeeLabel}</span>
                    <span className="font-mono text-zinc-200 tabular-nums">
                      {formatCurrency(
                        estimate.diagnosticFee,
                        estimate.currency,
                        locale,
                      )}
                    </span>
                  </div>

                  {estimate.diagnosticDiscount > 0 && (
                    <div className="flex items-center justify-between gap-3 text-emerald-300">
                      <span>
                        {dict.calculator.summary.diagnosticCreditLabel}
                      </span>
                      <span className="font-mono font-semibold tabular-nums">
                        -
                        {formatCurrency(
                          estimate.diagnosticDiscount,
                          estimate.currency,
                          locale,
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!estimate.hasSelection && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-200"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <span>{dict.calculator.summary.emptyWarning}</span>
              </div>
            )}

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                disabled={!estimate.hasSelection}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>{dict.calculator.summary.requestCta}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-transparent px-4 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
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
