'use client';

import React from 'react';
import { buildSparklinePoints } from '@/components/demo/sparkline';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData, DemoTabId } from '@/types/vibeshield';

export interface DemoSummaryCardsProps {
  demoCase: DemoCaseData;
  onSelectTab?: (tab: DemoTabId) => void;
}

/**
 * Unified architectural white-to-ice-blue bottom telemetry & PR strip for /demo.
 */
export function DemoSummaryCards({
  demoCase,
  onSelectTab,
}: DemoSummaryCardsProps) {
  const { locale, dict } = useLocale();
  const totalChecks = demoCase.pullRequest.checks.length;
  const passedChecks = demoCase.pullRequest.checks.filter(
    (c) => c.status === 'passed',
  ).length;

  return (
    <section
      aria-label={
        locale === 'es'
          ? 'Resumen rápido de telemetría y PR'
          : 'Quick telemetry and PR summary'
      }
      className="bg-ice-luxury grid divide-y divide-[#BFDBFE]/70 overflow-hidden rounded-[26px] border border-[#BFDBFE]/80 shadow-luxury md:grid-cols-3 md:divide-x md:divide-y-0"
    >
      <button
        type="button"
        onClick={() => onSelectTab?.('telemetry')}
        className="p-6 text-left transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#1D4ED8] uppercase">
            {dict.demo.summaryRow.sonarqubeLabel}
          </span>
          <span className="font-mono text-xs font-semibold">
            <span className="text-[#B91C1C]">
              {demoCase.telemetry.sonarqubeGateBefore}
            </span>{' '}
            <span className="text-[#52607A]" aria-hidden="true">
              →
            </span>{' '}
            <span className="text-[#146C43]">
              {demoCase.telemetry.sonarqubeGateAfter}
            </span>
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#52607A]">
            <span>
              {demoCase.telemetry.duplicationBefore} →{' '}
              {demoCase.telemetry.duplicationAfter}
            </span>
            <span className="text-[#146C43]">OK</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#DBEAFE]">
            <div className="h-full w-[92%] rounded-full bg-[#2563EB]" />
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab?.('telemetry')}
        className="p-6 text-left transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#1D4ED8] uppercase">
            {dict.demo.summaryRow.devtoolsLabel}
          </span>
          <span className="font-mono text-xs font-semibold">
            <span className="text-[#B91C1C]">{demoCase.telemetry.lcpBefore}</span>{' '}
            <span className="text-[#52607A]" aria-hidden="true">
              →
            </span>{' '}
            <span className="text-[#146C43]">
              {demoCase.telemetry.lcpAfter}
            </span>
          </span>
        </div>

        <div className="mt-3">
          <svg
            viewBox="0 0 110 28"
            aria-hidden="true"
            className="h-7 w-full overflow-visible"
          >
            <polyline
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={buildSparklinePoints(demoCase.telemetry.lcpSparkline, {
                width: 110,
                height: 28,
                padX: 4,
                padY: 4,
              })}
            />
          </svg>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab?.('pr')}
        className="p-6 text-left transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#1D4ED8] uppercase">
            {dict.demo.summaryRow.prPreviewLabel}
          </span>
          <span className="font-mono text-xs font-semibold text-[#146C43]">
            #{demoCase.pullRequest.number}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-semibold text-[#146C43]">
            {passedChecks}/{totalChecks} {dict.demo.summaryRow.checksSuffix}
          </span>
          <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#146C43]">
            READY
          </span>
        </div>
      </button>
    </section>
  );
}
