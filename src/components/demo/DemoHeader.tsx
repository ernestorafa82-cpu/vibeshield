'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData } from '@/types/vibeshield';

export interface DemoHeaderProps {
  demoCase: DemoCaseData;
}

/**
 * Deep Parisian-navy pinstripe audit dossier executive header with champagne-gold KPIs.
 */
export function DemoHeader({ demoCase }: DemoHeaderProps) {
  const { dict } = useLocale();

  return (
    <section
      aria-labelledby="demo-case-title"
      className="bg-navy-pinstripe gold-shimmer-top overflow-hidden rounded-[30px] border border-[#D6B878]/35 text-[#F3EFE6] shadow-luxury-dark"
    >
      <div className="grid lg:grid-cols-12">
        <div className="p-7 sm:p-10 lg:col-span-7 lg:border-r lg:border-white/12">
          <span className="eyebrow-rule text-[#D6B878]">{dict.demo.kicker}</span>

          <h1
            id="demo-case-title"
            className="mt-4 font-serif text-4xl leading-[1.04] font-normal text-[#F3EFE6] sm:text-5xl"
          >
            {dict.demo.title}
          </h1>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D6B878]/45 bg-[#D6B878]/15 px-4 py-1.5 font-sans text-xs font-semibold tracking-wider text-[#D6B878] uppercase">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {dict.demo.verdictPrefix} {dict.demo.verdictLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-white/12 border-t border-white/12 bg-black/15 lg:col-span-5 lg:border-t-0">
          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#D6B878] uppercase">
              {dict.demo.kpis.healthScoreLabel}
            </p>
            <p className="mt-2 font-serif text-2xl font-medium text-[#F3EFE6] tabular-nums sm:text-3xl">
              <span className="text-lg text-[#F3EFE6]/45 line-through">
                {demoCase.healthScore.before}
              </span>{' '}
              <span aria-hidden="true" className="text-[#D6B878]/60">
                →
              </span>{' '}
              <span className="text-[#D6B878]">{demoCase.healthScore.after}</span>
            </p>
            <span className="font-mono text-[11px] text-[#F3EFE6]/55">
              / {demoCase.healthScore.max}
            </span>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#D6B878] uppercase">
              {dict.demo.kpis.criticalRisksLabel}
            </p>
            <p className="mt-2 font-serif text-2xl font-medium tabular-nums sm:text-3xl">
              <span className="text-[#F87171]">
                {demoCase.criticalRisks.before}
              </span>{' '}
              <span aria-hidden="true" className="text-[#D6B878]/60">
                →
              </span>{' '}
              <span className="text-[#34D399]">
                {demoCase.criticalRisks.after}
              </span>
            </p>
            <span className="font-mono text-[11px] text-[#F3EFE6]/55">
              CVEs / RLS
            </span>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#D6B878] uppercase">
              {dict.demo.kpis.rescueDaysLabel}
            </p>
            <p className="mt-2 font-serif text-2xl font-medium text-[#F3EFE6] tabular-nums sm:text-3xl">
              {demoCase.rescueDays} {dict.demo.kpis.daysUnit}
            </p>
            <span className="font-mono text-[11px] text-[#F3EFE6]/55">
              3 {dict.demo.kpis.daysUnit === 'días' ? 'módulos' : 'modules'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
