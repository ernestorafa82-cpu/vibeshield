'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData } from '@/types/vibeshield';

export interface DemoHeaderProps {
  demoCase: DemoCaseData;
}

/**
 * Swiss editorial audit dossier header with stamped verdict and tabular KPI cells.
 */
export function DemoHeader({ demoCase }: DemoHeaderProps) {
  const { dict } = useLocale();

  return (
    <section
      aria-labelledby="demo-case-title"
      className="border border-[#141311]/15 bg-white"
    >
      <div className="grid lg:grid-cols-12">
        <div className="p-7 sm:p-9 lg:col-span-7 lg:border-r lg:border-[#141311]/12">
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-[#857F75] uppercase">
            {dict.demo.kicker}
          </p>

          <h1
            id="demo-case-title"
            className="mt-3 font-serif text-4xl leading-[1.06] tracking-[-0.02em] text-[#141311] sm:text-5xl"
          >
            {dict.demo.title}
          </h1>

          <div className="mt-5 inline-flex items-center gap-2 border border-[#1A6340]/40 bg-[#EDF5F0] px-3.5 py-1.5 font-mono text-xs font-medium tracking-wider text-[#1A6340] uppercase">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              {dict.demo.verdictPrefix} {dict.demo.verdictLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-[#141311]/12 border-t border-[#141311]/12 bg-[#F3EFE6]/70 lg:col-span-5 lg:border-t-0">
          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-mono text-[10px] tracking-[0.16em] text-[#857F75] uppercase">
              {dict.demo.kpis.healthScoreLabel}
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-[#141311] tabular-nums sm:text-2xl">
              <span className="text-[#857F75] line-through text-sm sm:text-base">
                {demoCase.healthScore.before}
              </span>{' '}
              <span aria-hidden="true" className="text-[#857F75]">
                →
              </span>{' '}
              <span className="text-[#1A6340]">{demoCase.healthScore.after}</span>
            </p>
            <span className="font-mono text-[11px] text-[#857F75]">
              / {demoCase.healthScore.max}
            </span>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-mono text-[10px] tracking-[0.16em] text-[#857F75] uppercase">
              {dict.demo.kpis.criticalRisksLabel}
            </p>
            <p className="mt-2 font-mono text-lg font-semibold tabular-nums sm:text-2xl">
              <span className="text-[#C94A22]">
                {demoCase.criticalRisks.before}
              </span>{' '}
              <span aria-hidden="true" className="text-[#857F75]">
                →
              </span>{' '}
              <span className="text-[#1A6340]">
                {demoCase.criticalRisks.after}
              </span>
            </p>
            <span className="font-mono text-[11px] text-[#857F75]">CVEs / RLS</span>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-mono text-[10px] tracking-[0.16em] text-[#857F75] uppercase">
              {dict.demo.kpis.rescueDaysLabel}
            </p>
            <p className="mt-2 font-serif text-2xl text-[#141311] tabular-nums sm:text-3xl">
              {demoCase.rescueDays} {dict.demo.kpis.daysUnit}
            </p>
            <span className="font-mono text-[11px] text-[#857F75]">
              3 {dict.demo.kpis.daysUnit === 'días' ? 'módulos' : 'modules'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
