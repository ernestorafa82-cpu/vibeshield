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
 * Persistent bottom luxury summary cards for the /demo audit dossier.
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
      className="grid gap-5 md:grid-cols-3"
    >
      <button
        type="button"
        onClick={() => onSelectTab?.('telemetry')}
        className="rounded-[24px] border border-[#0E2244]/10 bg-white p-6 text-left shadow-luxury transition-all hover:-translate-y-0.5 hover:border-[#D6B878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#7F6330] uppercase">
            {dict.demo.summaryRow.sonarqubeLabel}
          </span>
          <span className="font-mono text-xs font-semibold">
            <span className="text-[#C94A22]">
              {demoCase.telemetry.sonarqubeGateBefore}
            </span>{' '}
            <span className="text-[#5A6378]" aria-hidden="true">
              →
            </span>{' '}
            <span className="text-[#1A6340]">
              {demoCase.telemetry.sonarqubeGateAfter}
            </span>
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#5A6378]">
            <span>
              {demoCase.telemetry.duplicationBefore} →{' '}
              {demoCase.telemetry.duplicationAfter}
            </span>
            <span className="text-[#1A6340]">OK</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0E2244]/10">
            <div className="h-full w-[92%] rounded-full bg-[#0E2244]" />
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab?.('telemetry')}
        className="rounded-[24px] border border-[#0E2244]/10 bg-white p-6 text-left shadow-luxury transition-all hover:-translate-y-0.5 hover:border-[#D6B878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#7F6330] uppercase">
            {dict.demo.summaryRow.devtoolsLabel}
          </span>
          <span className="font-mono text-xs font-semibold">
            <span className="text-[#C94A22]">{demoCase.telemetry.lcpBefore}</span>{' '}
            <span className="text-[#5A6378]" aria-hidden="true">
              →
            </span>{' '}
            <span className="text-[#1A6340]">
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
              stroke="#0E2244"
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
        className="rounded-[24px] border border-[#0E2244]/10 bg-white p-6 text-left shadow-luxury transition-all hover:-translate-y-0.5 hover:border-[#D6B878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#7F6330] uppercase">
            {dict.demo.summaryRow.prPreviewLabel}
          </span>
          <span className="font-mono text-xs font-semibold text-[#1A6340]">
            #{demoCase.pullRequest.number}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-semibold text-[#1A6340]">
            {passedChecks}/{totalChecks} {dict.demo.summaryRow.checksSuffix}
          </span>
          <span className="rounded-full bg-[#EDF5F0] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#1A6340]">
            READY
          </span>
        </div>
      </button>
    </section>
  );
}
