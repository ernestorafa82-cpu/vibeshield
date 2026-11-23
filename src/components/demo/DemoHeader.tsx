'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData } from '@/types/vibeshield';

export interface DemoHeaderProps {
  demoCase: DemoCaseData;
}

/**
 * Deep navy pinstripe audit dossier executive header with frosted glacier-blue KPIs.
 */
export function DemoHeader({ demoCase }: DemoHeaderProps) {
  const { dict } = useLocale();

  return (
    <section
      aria-labelledby="demo-case-title"
      className="bg-navy-pinstripe ice-shimmer-top overflow-hidden rounded-[30px] border border-[#93C5FD]/30 text-white shadow-luxury-dark"
    >
      <div className="grid lg:grid-cols-12">
        <div className="p-7 sm:p-10 lg:col-span-7 lg:border-r lg:border-white/12">
          <span className="eyebrow-rule text-[#93C5FD]">{dict.demo.kicker}</span>

          <h1
            id="demo-case-title"
            className="mt-4 font-serif text-4xl leading-[1.04] font-normal text-white sm:text-5xl"
          >
            {dict.demo.title}
          </h1>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#93C5FD]/40 bg-[#DBEAFE]/12 px-4 py-1.5 font-sans text-xs font-semibold tracking-wider text-[#DBEAFE] uppercase">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#93C5FD]" aria-hidden="true" />
            <span>
              {dict.demo.verdictPrefix} {dict.demo.verdictLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-white/12 border-t border-white/12 bg-black/15 lg:col-span-5 lg:border-t-0">
          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#93C5FD] uppercase">
              {dict.demo.kpis.healthScoreLabel}
            </p>
            <p className="mt-2 font-serif text-2xl font-medium text-white tabular-nums sm:text-3xl">
              <span className="text-lg text-white/45 line-through">
                {demoCase.healthScore.before}
              </span>{' '}
              <span aria-hidden="true" className="text-[#93C5FD]/65">
                →
              </span>{' '}
              <span className="text-[#DBEAFE]">{demoCase.healthScore.after}</span>
            </p>
            <span className="font-mono text-[11px] text-white/55">
              / {demoCase.healthScore.max}
            </span>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#93C5FD] uppercase">
              {dict.demo.kpis.criticalRisksLabel}
            </p>
            <p className="mt-2 font-serif text-2xl font-medium tabular-nums sm:text-3xl">
              <span className="text-[#FCA5A5]">
                {demoCase.criticalRisks.before}
              </span>{' '}
              <span aria-hidden="true" className="text-[#93C5FD]/65">
                →
              </span>{' '}
              <span className="text-[#6EE7B7]">
                {demoCase.criticalRisks.after}
              </span>
            </p>
            <span className="font-mono text-[11px] text-white/55">
              CVEs / RLS
            </span>
          </div>

          <div className="flex flex-col justify-center p-5 sm:p-6">
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-[#93C5FD] uppercase">
              {dict.demo.kpis.rescueDaysLabel}
            </p>
            <p className="mt-2 font-serif text-2xl font-medium text-white tabular-nums sm:text-3xl">
              {demoCase.rescueDays} {dict.demo.kpis.daysUnit}
            </p>
            <span className="font-mono text-[11px] text-white/55">
              3 {dict.demo.kpis.daysUnit === 'días' ? 'módulos' : 'modules'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
