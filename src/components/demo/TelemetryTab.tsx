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
 * Editorial ruled specification sheets grouping SonarQube, Chrome DevTools, and Sentry evidence.
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
              className="overflow-hidden rounded-[26px] border border-[#BFDBFE]/75 bg-white shadow-luxury"
            >
              <div className="bg-ice-luxury flex items-center justify-between border-b border-[#BFDBFE]/65 px-6 py-4 sm:px-7">
                <h3 className="font-sans text-xs font-semibold tracking-[0.22em] text-[#1D4ED8] uppercase">
                  {group.title}
                </h3>
                <span className="font-mono text-[11px] text-[#52607A]">
                  {metrics.length}{' '}
                  {locale === 'es' ? 'mediciones' : 'measurements'}
                </span>
              </div>

              <div className="divide-y divide-[#0E2244]/8">
                {metrics.map((metric) => {
                  const progressWidth =
                    PROGRESS_PERCENT_BY_METRIC[metric.id] ?? 95;

                  return (
                    <div
                      key={metric.id}
                      className="grid items-center gap-5 px-6 py-5 sm:px-7 lg:grid-cols-12"
                    >
                      <div className="lg:col-span-4">
                        <p className="font-serif text-xl font-medium text-[#0E2244]">
                          {metric.label}
                        </p>
                        <span className="mt-1 inline-block rounded-full bg-[#ECFDF5] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#146C43]">
                          {metric.improvementBadge}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 font-mono text-sm lg:col-span-4">
                        <div>
                          <span className="block text-[10px] tracking-wider text-[#52607A] uppercase">
                            {dict.demo.telemetryTab.beforeLabel}
                          </span>
                          <span className="font-semibold text-[#C94A22]">
                            {metric.beforeValue}
                          </span>
                        </div>

                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-[#2563EB]"
                          aria-hidden="true"
                        />

                        <div>
                          <span className="block text-[10px] tracking-wider text-[#52607A] uppercase">
                            {dict.demo.telemetryTab.afterLabel}
                          </span>
                          <span className="font-semibold text-[#146C43]">
                            {metric.afterValue}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 lg:col-span-4">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#DBEAFE]">
                          <div
                            className="h-full rounded-full bg-[#2563EB]"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>

                        {metric.sparklinePoints &&
                          metric.sparklinePoints.length > 1 && (
                            <div className="rounded-xl border border-[#BFDBFE]/70 bg-[#F8FAFD] px-3 py-2">
                              <svg
                                viewBox="0 0 180 44"
                                role="img"
                                aria-label={
                                  locale === 'es'
                                    ? `Tendencia de ${metric.label}`
                                    : `${metric.label} trend`
                                }
                                className="h-10 w-full overflow-visible"
                              >
                                <polyline
                                  fill="none"
                                  stroke="#2563EB"
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
