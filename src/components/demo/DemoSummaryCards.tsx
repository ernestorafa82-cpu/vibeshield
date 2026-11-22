'use client';

import React from 'react';
import { Gauge, GitPullRequest, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData, DemoTabId } from '@/types/vibeshield';

export interface DemoSummaryCardsProps {
  demoCase: DemoCaseData;
  onSelectTab?: (tab: DemoTabId) => void;
}

function buildMiniSparklinePoints(points: readonly number[]): string {
  if (points.length === 0) {
    return '';
  }
  const width = 110;
  const height = 28;
  const pad = 4;
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const span = maxVal - minVal || 1;

  return points
    .map((val, index) => {
      const x =
        points.length === 1
          ? width / 2
          : pad + (index / (points.length - 1)) * (width - pad * 2);
      const y = pad + (1 - (val - minVal) / span) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

/**
 * Persistent bottom summary strip highlighting SonarQube Gate, LCP, and PR #142 status.
 */
export function DemoSummaryCards({
  demoCase,
  onSelectTab,
}: DemoSummaryCardsProps) {
  const { dict } = useLocale();
  const totalChecks = demoCase.pullRequest.checks.length;
  const passedChecks = demoCase.pullRequest.checks.filter(
    (c) => c.status === 'passed',
  ).length;

  return (
    <section
      aria-label={dict.demo.summaryRow.sonarqubeLabel}
      className="grid gap-4 md:grid-cols-3"
    >
      <button
        type="button"
        onClick={() => onSelectTab?.('telemetry')}
        className="group rounded-2xl border border-zinc-800 bg-[#111114] p-4 text-left transition-colors hover:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>{dict.demo.summaryRow.sonarqubeLabel}</span>
          </span>
          <span className="font-mono text-xs font-semibold">
            <span className="text-red-400">
              {demoCase.telemetry.sonarqubeGateBefore}
            </span>{' '}
            <span className="text-zinc-600" aria-hidden="true">
              →
            </span>{' '}
            <span className="text-emerald-400">
              {demoCase.telemetry.sonarqubeGateAfter}
            </span>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-xs text-zinc-300">
          <span>
            {demoCase.telemetry.duplicationBefore} →{' '}
            <span className="text-emerald-400">
              {demoCase.telemetry.duplicationAfter}
            </span>
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-[92%] rounded-full bg-emerald-500" />
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab?.('telemetry')}
        className="group rounded-2xl border border-zinc-800 bg-[#111114] p-4 text-left transition-colors hover:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <Gauge className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span>{dict.demo.summaryRow.devtoolsLabel}</span>
          </span>
          <span className="font-mono text-xs font-semibold">
            <span className="text-red-400">{demoCase.telemetry.lcpBefore}</span>{' '}
            <span className="text-zinc-600" aria-hidden="true">
              →
            </span>{' '}
            <span className="text-emerald-400">
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
              stroke="#10B981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={buildMiniSparklinePoints(demoCase.telemetry.lcpSparkline)}
            />
          </svg>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab?.('pr')}
        className="group rounded-2xl border border-zinc-800 bg-[#111114] p-4 text-left transition-colors hover:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <GitPullRequest
              className="h-4 w-4 text-emerald-400"
              aria-hidden="true"
            />
            <span>{dict.demo.summaryRow.prPreviewLabel}</span>
          </span>
          <span className="font-mono text-xs text-zinc-400">
            #{demoCase.pullRequest.number}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 font-mono text-sm font-semibold text-emerald-400">
          <span>
            {passedChecks}/{totalChecks} {dict.demo.summaryRow.checksSuffix}
          </span>
        </div>
      </button>
    </section>
  );
}
