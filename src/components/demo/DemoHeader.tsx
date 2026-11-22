'use client';

import React from 'react';
import { CheckCircle2, Clock, ShieldAlert, TrendingUp } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData } from '@/types/vibeshield';

export interface DemoHeaderProps {
  demoCase: DemoCaseData;
}

/**
 * Executive summary header for the PulseCRM interactive X-Ray case study.
 */
export function DemoHeader({ demoCase }: DemoHeaderProps) {
  const { dict } = useLocale();

  return (
    <section
      aria-labelledby="demo-case-heading"
      className="rounded-2xl border border-zinc-800 bg-[#111114] p-6 sm:p-7"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400">
              {dict.demo.kicker}
            </span>
            <span className="text-zinc-700" aria-hidden="true">
              •
            </span>
            <span className="font-mono text-xs text-zinc-400">
              {demoCase.sourceStack}
            </span>
          </div>

          <h1
            id="demo-case-heading"
            className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl"
          >
            {dict.demo.title}
          </h1>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-300 glow-emerald">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            <span>
              {dict.demo.verdictPrefix} {dict.demo.verdictLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:shrink-0">
          <div className="rounded-xl border border-zinc-800 bg-[#09090B]/80 px-4 py-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              <span>{dict.demo.kpis.healthScoreLabel}</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5 font-mono text-lg font-semibold">
              <span className="text-zinc-400">{demoCase.healthScore.before}</span>
              <span className="text-zinc-600" aria-hidden="true">
                →
              </span>
              <span className="text-emerald-400">{demoCase.healthScore.after}</span>
              <span className="text-xs font-normal text-zinc-500">
                / {demoCase.healthScore.max}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#09090B]/80 px-4 py-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
              <span>{dict.demo.kpis.criticalRisksLabel}</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5 font-mono text-lg font-semibold">
              <span className="text-red-400">{demoCase.criticalRisks.before}</span>
              <span className="text-zinc-600" aria-hidden="true">
                →
              </span>
              <span className="text-emerald-400">{demoCase.criticalRisks.after}</span>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#09090B]/80 px-4 py-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
              <span>{dict.demo.kpis.rescueDaysLabel}</span>
            </div>
            <div className="mt-1.5 font-mono text-lg font-semibold text-cyan-400">
              {demoCase.rescueDays} {dict.demo.kpis.daysUnit}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
