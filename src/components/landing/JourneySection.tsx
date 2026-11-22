'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';

/**
 * High-contrast warm matte charcoal editorial chapter outlining the three engagement phases.
 */
export function JourneySection() {
  const { dict } = useLocale();
  const { sectionTitle, sectionSubtitle, steps } = dict.journey;

  return (
    <section className="bg-[#161514] py-24 text-[#F5F2EB] lg:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 border-b border-white/12 pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#E07A54] uppercase">
              PROCESO · 01 — 03
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.04] tracking-[-0.02em] text-[#FBF9F5] sm:text-5xl">
              {sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-white/65">
              {sectionSubtitle}
            </p>
          </div>
        </div>

        <div className="mt-12 grid divide-y divide-white/12 border-b border-white/12 md:grid-cols-3 md:divide-x md:divide-y-0">
          {steps.map((step) => (
            <article
              key={step.stepNumber}
              className="flex flex-col justify-between py-10 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-5xl text-white/25">
                    {step.stepNumber}
                  </span>
                  <span className="border border-white/15 px-2.5 py-1 font-mono text-[11px] tracking-wider text-white/70 uppercase">
                    {step.duration}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-medium tracking-tight text-[#FBF9F5]">
                  {step.title}
                </h3>

                <p className="mt-3 font-serif text-4xl tracking-tight text-[#FBF9F5] tabular-nums">
                  {step.priceRange}
                </p>

                <p className="mt-5 text-sm leading-relaxed text-white/65">
                  {step.description}
                </p>
              </div>

              {step.highlight && (
                <div className="mt-8 border-t border-white/12 pt-4 font-mono text-xs text-[#E07A54]">
                  {step.highlight}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
