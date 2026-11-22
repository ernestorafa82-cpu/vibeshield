'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

/**
 * Three-step rescue journey overview with transparent pricing bands and delivery timelines.
 */
export function JourneySection() {
  const { dict } = useLocale();
  const { sectionTitle, sectionSubtitle, steps } = dict.journey;

  return (
    <section className="border-b border-zinc-800/80 bg-[#09090B] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
            {sectionSubtitle}
          </p>
        </div>

        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.stepNumber}
              className="relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-[#111114] p-6 transition-colors hover:border-zinc-700"
            >
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 top-10 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-[#09090B] text-zinc-500 md:flex"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-3xl font-bold tracking-tight text-emerald-400">
                    {step.stepNumber}
                  </span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 font-mono text-xs font-medium text-zinc-300">
                    {step.duration}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="font-mono text-lg font-semibold text-emerald-300">
                    {step.priceRange}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>

              {step.highlight && (
                <div className="mt-6 border-t border-zinc-800/80 pt-4">
                  <p className="font-mono text-xs font-medium text-cyan-300">
                    {step.highlight}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
