'use client';

import React from 'react';
import { Activity, ArrowRight, Bug, Gauge, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData, TelemetryMetric } from '@/types/vibeshield';

export interface TelemetryTabProps {
  demoCase: DemoCaseData;
}

const PROGRESS_PERCENT_BY_METRIC: Readonly<Record<string, number>> = {
  'sq-gate': 100,
  'sq-duplication': 92,
  'sq-cves': 100,
  'cdt-lcp': 75,
  'cdt-memleak': 100,
  'sentry-errors': 100,
};

function buildSparklinePoints(points: readonly number[]): string {
  if (points.length === 0) {
    return '';
  }
  const width = 180;
  const height = 44;
  const padX = 6;
  const padY = 6;
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const span = maxVal - minVal || 1;

  return points
    .map((val, index) => {
      const x =
        points.length === 1
          ? width / 2
          : padX + (index / (points.length - 1)) * (width - padX * 2);
      const y =
        padY + (1 - (val - minVal) / span) * (height - padY * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

interface TelemetryGroupConfig {
  readonly tool: TelemetryMetric['tool'];
  readonly title: string;
  readonly icon: React.ReactNode;
}

/**
 * Telemetry evidence tab grouping SonarQube, Chrome DevTools, and Sentry metrics.
 */
export function TelemetryTab({ demoCase }: TelemetryTabProps) {
  const { dict } = useLocale();

  const groups: readonly TelemetryGroupConfig[] = [
    {
      tool: 'sonarqube',
      title: dict.demo.telemetryTab.sonarqubeTitle,
      icon: <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />,
    },
    {
      tool: 'chrome_devtools',
      title: dict.demo.telemetryTab.devtoolsTitle,
      icon: <Gauge className="h-4 w-4 text-cyan-400" aria-hidden="true" />,
    },
    {
      tool: 'sentry',
      title: dict.demo.telemetryTab.sentryTitle,
      icon: <Bug className="h-4 w-4 text-emerald-400" aria-hidden="true" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
        <Activity className="h-4 w-4 text-cyan-400" aria-hidden="true" />
        <h2>{dict.demo.telemetryTab.sectionTitle}</h2>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const metrics = demoCase.telemetry.metrics.filter(
            (metric) => metric.tool === group.tool,
          );
          if (metrics.length === 0) {
            return null;
          }

          return (
            <section
              key={group.tool}
              className="rounded-2xl border border-zinc-800 bg-[#111114] p-5"
            >
              <div className="mb-4 flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                {group.icon}
                <h3 className="text-sm font-semibold tracking-wide text-zinc-100">
                  {group.title}
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric) => {
                  const progressWidth =
                    PROGRESS_PERCENT_BY_METRIC[metric.id] ?? 90;
                  const beforeColor =
                    metric.statusBefore === 'failed'
                      ? 'text-red-400'
                      : 'text-amber-400';

                  return (
                    <div
                      key={metric.id}
                      className="flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-[#09090B] p-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-zinc-200">
                            {metric.label}
                          </span>
                          <span className="shrink-0 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-300">
                            {metric.improvementBadge}
                          </span>
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border border-zinc-800/70 bg-[#111114] px-3 py-2.5">
                          <div>
                            <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                              {dict.demo.telemetryTab.beforeLabel}
                            </div>
                            <div className={`font-mono text-sm font-semibold ${beforeColor}`}>
                              {metric.beforeValue}
                            </div>
                          </div>

                          <ArrowRight
                            className="h-4 w-4 text-zinc-600"
                            aria-hidden="true"
                          />

                          <div className="text-right">
                            <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                              {dict.demo.telemetryTab.afterLabel}
                            </div>
                            <div className="font-mono text-sm font-semibold text-emerald-400">
                              {metric.afterValue}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2.5">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>

                        {metric.sparklinePoints &&
                          metric.sparklinePoints.length > 1 && (
                            <div className="rounded-lg border border-zinc-800/70 bg-[#111114] p-2">
                              <svg
                                viewBox="0 0 180 44"
                                role="img"
                                aria-label={`${metric.label} sparkline`}
                                className="h-11 w-full overflow-visible"
                              >
                                <polyline
                                  fill="none"
                                  stroke="#10B981"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={buildSparklinePoints(
                                    metric.sparklinePoints,
                                  )}
                                />
                              </svg>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
