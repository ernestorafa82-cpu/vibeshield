'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SilkReveal } from '@/components/motion/SilkReveal';
import { useLocale } from '@/context/LocaleContext';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

/**
 * Deep Parisian-navy feature panel featuring a spacious ruled 3-phase editorial list
 * (replacing narrow dark mini-cards) paired with a frosted white-to-ice-blue Audit Pass.
 */
export function JourneySection() {
  const { locale, dict } = useLocale();
  const { sectionTitle, sectionSubtitle, steps } = dict.journey;

  return (
    <section className="bg-porcelain-canvas py-12 text-[#0E2244] sm:py-20">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
        <SilkReveal
          direction="scale"
          className="bg-navy-pinstripe ice-shimmer-top overflow-hidden rounded-[32px] border border-[#93C5FD]/25 p-8 text-white shadow-luxury-dark sm:p-12 lg:p-14"
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left: Spacious Ruled 3-Phase Editorial List (NO cramped mini-cards) */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                <span className="eyebrow-rule text-[#93C5FD]">
                  {locale === 'es' ? 'PROCESO EN 3 FASES' : 'THREE-PHASE PROCESS'}
                </span>
                <h2 className="mt-4 font-serif text-4xl leading-[1.04] font-normal text-white sm:text-5xl">
                  {sectionTitle}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
                  {sectionSubtitle}
                </p>
              </div>

              <div className="divide-y divide-white/12 border-t border-b border-white/12">
                {steps.map((step) => (
                  <article
                    key={step.stepNumber}
                    className="grid gap-4 py-6 sm:grid-cols-12 sm:items-start"
                  >
                    <div className="flex items-baseline gap-3 sm:col-span-5">
                      <span className="font-mono text-xs font-semibold text-[#93C5FD]">
                        {step.stepNumber}
                      </span>
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-white">
                          {step.title}
                        </h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 font-mono text-xs text-[#BFDBFE] tabular-nums">
                          <span>{step.priceRange}</span>
                          <span aria-hidden="true" className="text-white/35">
                            ·
                          </span>
                          <span>{step.duration}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-7">
                      <p className="text-sm leading-relaxed text-white/75">
                        {step.description}
                      </p>
                      {step.highlight && (
                        <p className="font-mono text-[11px] text-[#93C5FD]">
                          {step.highlight}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              <div>
                <button
                  type="button"
                  onClick={triggerDiagnosticSelection}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#EEF5FF] px-7 py-3.5 text-sm font-semibold text-[#0E2244] transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
                >
                  <span>{dict.hero.primaryCta}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right: Frosted White-to-Ice-Blue Perforated Audit Pass (replaces burnt yellow ticket) */}
            <div className="flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-md transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 lg:rotate-[2deg]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-[36px] bg-[#93C5FD]/18 blur-2xl"
                />

                <div className="bg-ice-luxury relative overflow-hidden rounded-[26px] border border-white/85 text-[#0E2244] shadow-luxury-dark">
                  {/* Side semicircle ticket punch cutouts */}
                  <span
                    aria-hidden="true"
                    className="absolute top-[58%] -left-3 h-6 w-6 rounded-full bg-[#0E2244]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-[58%] -right-3 h-6 w-6 rounded-full bg-[#0E2244]"
                  />

                  <div className="p-7 pb-6">
                    <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.22em] text-[#1D4ED8] uppercase">
                      <span>VELNEA · AUDIT PASS</span>
                      <span>REV. 2026</span>
                    </div>

                    <p className="mt-4 font-serif text-3xl leading-tight font-medium text-[#0E2244]">
                      {locale === 'es'
                        ? 'Diagnóstico 48h + 1.er PR verificado'
                        : '48h Diagnostic + 1st verified PR'}
                    </p>

                    <p className="mt-2.5 text-xs leading-relaxed text-[#52607A]">
                      {locale === 'es'
                        ? 'Recibes expediente navegable, semáforo Rescatar vs. Rehacer y el parche más urgente listo en preview.'
                        : 'Receive an interactive dossier, a Rescue vs. Rebuild verdict, and your most urgent fix live on a preview URL.'}
                    </p>
                  </div>

                  {/* Perforated tear divider */}
                  <div className="border-t-2 border-dashed border-[#0E2244]/15" />

                  {/* Unified Deep Navy SLA Bar */}
                  <div className="p-7 pt-6">
                    <div className="grid grid-cols-3 divide-x divide-white/15 overflow-hidden rounded-2xl bg-[#0E2244] text-center text-white">
                      <div className="px-3 py-3.5">
                        <div className="font-serif text-2xl text-[#DBEAFE] tabular-nums">
                          48h
                        </div>
                        <div className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-white/65 uppercase">
                          {locale === 'es' ? 'INFORME' : 'DOSSIER'}
                        </div>
                      </div>
                      <div className="px-3 py-3.5">
                        <div className="font-serif text-2xl text-[#DBEAFE] tabular-nums">
                          7–10d
                        </div>
                        <div className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-white/65 uppercase">
                          {locale === 'es' ? 'RESCATE' : 'RESCUE'}
                        </div>
                      </div>
                      <div className="px-3 py-3.5">
                        <div className="font-serif text-2xl text-[#DBEAFE] tabular-nums">
                          100%
                        </div>
                        <div className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-white/65 uppercase">
                          {locale === 'es' ? 'CRÉDITO' : 'CREDIT'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SilkReveal>
      </div>
    </section>
  );
}
