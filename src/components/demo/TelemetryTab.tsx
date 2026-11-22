'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { buildSparklinePoints } from '@/components/demo/sparkline';
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

interface TelemetryGroupConfig {
  readonly tool: TelemetryMetric['tool'];
  readonly title: string;
}

/**
 * Luxury editorial telemetry tab grouping SonarQube, Chrome DevTools, and Sentry evidence.
 */
export function TelemetryTab({ demoCase }: TelemetryTabProps) {
  const { locale, dict } = useLocale();

  const groups: readonly TelemetryGroupConfig[] = [
    { tool: 'sonarqube', title: dict.demo.telemetryTab.sonarqubeTitle },
    { tool: 'chrome_devtools', title: dict.demo.telemetryTab.devtoolsTitle },
    { tool: 'sentry', title: dict.demo.telemetryTab.sentryTitle },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl text-[#0E2244]">
        {dict.demo.telemetryTab.sectionTitle}
      </h2>

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
              className="rounded-[26px] border border-[#0E2244]/10 bg-white p-6 shadow-luxury sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between border-b border-[#0E2244]/8 pb-3">
                <h3 className="font-sans text-xs font-semibold tracking-[0.22em] text-[#7F6330] uppercase">
                  {group.title}
                </h3>
                <span className="font-mono text-[11px] text-[#5A6378]">
                  {metrics.length}{' '}
                  {locale === 'es' ? 'mediciones' : 'measurements'}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric) => {
                  const progressWidth =
                    PROGRESS_PERCENT_BY_METRIC[metric.id] ?? 95;

                  return (
                    <div
                      key={metric.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-[#0E2244]/10 bg-[#F3EFE6]/55 p-5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-serif text-lg font-medium text-[#0E2244]">
                          {metric.label}
                        </p>
                        <span className="shrink-0 rounded-full bg-[#EDF5F0] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#1A6340]">
                          {metric.improvementBadge}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 font-mono text-sm">
                        <div className="flex-1 rounded-xl border border-[#0E2244]/10 bg-white px-3 py-2">
                          <span className="block text-[10px] tracking-wider text-[#5A6378] uppercase">
                            {dict.demo.telemetryTab.beforeLabel}
                          </span>
                          <span className="font-semibold text-[#C94A22]">
                            {metric.beforeValue}
                          </span>
                        </div>

                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-[#B8975A]"
                          aria-hidden="true"
                        />

                        <div className="flex-1 rounded-xl border border-[#1A6340]/25 bg-[#EDF5F0]/70 px-3 py-2">
                          <span className="block text-[10px] tracking-wider text-[#5A6378] uppercase">
                            {dict.demo.telemetryTab.afterLabel}
                          </span>
                          <span className="font-semibold text-[#1A6340]">
                            {metric.afterValue}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0E2244]/10">
                          <div
                            className="h-full rounded-full bg-[#0E2244]"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>

                        {metric.sparklinePoints &&
                          metric.sparklinePoints.length > 1 && (
                            <div className="rounded-xl border border-[#0E2244]/10 bg-white p-2.5">
                              <svg
                                viewBox="0 0 180 44"
                                role="img"
                                aria-label={
                                  locale === 'es'
                                    ? `Tendencia de ${metric.label}`
                                    : `${metric.label} trend`
                                }
                                className="h-11 w-full overflow-visible"
                              >
                                <polyline
                                  fill="none"
                                  stroke="#0E2244"
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={buildSparklinePoints(
                                    metric.sparklinePoints,
                                    { width: 180, height: 44, padX: 6, padY: 6 },
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
