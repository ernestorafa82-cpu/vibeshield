'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SilkReveal } from '@/components/motion/SilkReveal';
import { useLocale } from '@/context/LocaleContext';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

/**
 * Unfolding deep Parisian-navy rounded feature panel with tilted champagne-gold
 * perforated "Audit Pass" ticket — directly inspired by biologique.es #sorteo.
 */
export function JourneySection() {
  const { locale, dict } = useLocale();
  const { sectionTitle, sectionSubtitle, steps } = dict.journey;

  return (
    <section className="bg-cream-dotted py-12 text-[#0E2244] sm:py-20">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
        <SilkReveal
          direction="scale"
          className="bg-navy-pinstripe gold-shimmer-top overflow-hidden rounded-[32px] border border-[#D6B878]/30 p-8 text-[#F3EFE6] shadow-luxury-dark sm:p-12 lg:p-14"
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left: Editorial Process Header + 3-Step Horizontal Sequence */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                <span className="eyebrow-rule text-[#D6B878]">
                  {locale === 'es' ? 'PROCESO EN 3 FASES' : 'THREE-PHASE PROCESS'}
                </span>
                <h2 className="mt-4 font-serif text-4xl leading-[1.04] font-normal text-[#F3EFE6] sm:text-5xl">
                  {sectionTitle}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#F3EFE6]/76">
                  {sectionSubtitle}
                </p>
              </div>

              {/* 3-Step Detailed Sequence */}
              <div className="grid gap-5 sm:grid-cols-3">
                {steps.map((step) => (
                  <article
                    key={step.stepNumber}
                    className="flex flex-col justify-between rounded-[22px] border border-white/12 bg-white/[0.04] p-5 transition-colors hover:border-[#D6B878]/40"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D6B878]/60 bg-[#D6B878]/15 font-mono text-xs font-semibold text-[#D6B878]">
                          {step.stepNumber}
                        </span>
                        <span className="font-mono text-[11px] text-[#F3EFE6]/60">
                          {step.duration}
                        </span>
                      </div>

                      <h3 className="mt-4 font-serif text-2xl font-medium text-[#F3EFE6]">
                        {step.title}
                      </h3>
                      <p className="mt-1 font-serif text-xl text-[#D6B878] tabular-nums">
                        {step.priceRange}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-[#F3EFE6]/72">
                        {step.description}
                      </p>
                    </div>

                    {step.highlight && (
                      <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-[#D6B878]">
                        {step.highlight}
                      </p>
                    )}
                  </article>
                ))}
              </div>

              <div>
                <button
                  type="button"
                  onClick={triggerDiagnosticSelection}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#D6B878] px-7 py-3.5 text-sm font-semibold text-[#0E2244] transition-all hover:bg-[#E4CB93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
                >
                  <span>{dict.hero.primaryCta}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right: Tilted Metallic-Gold Perforated Audit Pass Ticket (.boleto signature) */}
            <div className="flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-md transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 lg:rotate-[2.5deg]">
                {/* Ambient gold glow behind ticket */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-[36px] bg-[#D6B878]/20 blur-2xl"
                />

                <div className="bg-gold-metallic relative overflow-hidden rounded-[26px] border border-white/60 text-[#0E2244] shadow-luxury-dark">
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
                    <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.22em] text-[#0E2244]/75 uppercase">
                      <span>VELNEA · AUDIT PASS</span>
                      <span>REV. 2026</span>
                    </div>

                    <p className="mt-4 font-serif text-3xl leading-tight font-medium text-[#0E2244]">
                      {locale === 'es'
                        ? 'Diagnóstico 48h + 1.er PR verificado'
                        : '48h Diagnostic + 1st verified PR'}
                    </p>

                    <p className="mt-2 text-xs leading-relaxed text-[#0E2244]/80">
                      {locale === 'es'
                        ? 'Recibes expediente navegable, semáforo Rescatar vs. Rehacer y el parche más urgente listo en preview.'
                        : 'Receive an interactive dossier, a Rescue vs. Rebuild verdict, and your most urgent fix live on a preview URL.'}
                    </p>
                  </div>

                  {/* Perforated tear divider */}
                  <div className="border-t-2 border-dashed border-[#0E2244]/25" />

                  {/* Dark Navy Flip-Clock style SLA Strip */}
                  <div className="p-7 pt-6">
                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="rounded-xl bg-[#0E2244] px-3 py-3 text-[#F3EFE6]">
                        <div className="font-serif text-2xl text-[#D6B878] tabular-nums">
                          48h
                        </div>
                        <div className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-[#F3EFE6]/70 uppercase">
                          {locale === 'es' ? 'INFORME' : 'DOSSIER'}
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#0E2244] px-3 py-3 text-[#F3EFE6]">
                        <div className="font-serif text-2xl text-[#D6B878] tabular-nums">
                          7–10d
                        </div>
                        <div className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-[#F3EFE6]/70 uppercase">
                          {locale === 'es' ? 'RESCATE' : 'RESCUE'}
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#0E2244] px-3 py-3 text-[#F3EFE6]">
                        <div className="font-serif text-2xl text-[#D6B878] tabular-nums">
                          100%
                        </div>
                        <div className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-[#F3EFE6]/70 uppercase">
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
