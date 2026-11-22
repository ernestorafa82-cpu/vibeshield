'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { SilkReveal } from '@/components/motion/SilkReveal';
import { useLocale } from '@/context/LocaleContext';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

const FINDING_TAGS = [
  'rls_enabled = false',
  'NEXT_PUBLIC_SECRET',
  '0 automated tests',
  'cyclic imports',
] as const;

/**
 * Asymmetric luxury Bento Grid on warm dotted silk cream inspired by biologique.es:
 * Deep Parisian-navy 2-row featured intervention card + elevated pure-white finding cards
 * + signature champagne-gold metallic diagnostic CTA card.
 */
export function ProblemSolutionSection() {
  const { locale, dict } = useLocale();
  const { sectionTitle, sectionSubtitle, problem, solution } =
    dict.problemSolution;
  const demoHref = `/demo?lang=${locale}`;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-cream-dotted py-20 text-[#0E2244] sm:py-28"
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
        {/* 2-Column Editorial Header (biologique.es .p50 header rhythm) */}
        <SilkReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow-rule text-[#7F6330]">{problem.badge}</span>
            <h2 className="mt-4 font-serif text-4xl leading-[1.02] font-normal tracking-[-0.015em] text-[#0E2244] sm:text-5xl lg:text-[58px]">
              {sectionTitle}
            </h2>
          </div>

          <div className="space-y-5 lg:col-span-5 lg:pb-1">
            <p className="text-base leading-relaxed text-[#5A6378]">
              {sectionSubtitle}
            </p>
            <Link
              href={demoHref}
              className="inline-flex items-center gap-2 rounded-full border border-[#0E2244]/25 bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0E2244] transition-all hover:border-[#0E2244] hover:bg-[#0E2244] hover:text-[#F3EFE6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              <span>{dict.hero.secondaryCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </SilkReveal>

        {/* Asymmetric Luxury Bento Grid */}
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* Left Featured Deep Parisian Navy Card (spans 5 cols, 2 rows) */}
          <SilkReveal
            direction="left"
            className="bg-navy-pinstripe gold-shimmer-top flex flex-col justify-between rounded-[28px] border border-[#D6B878]/30 p-8 text-[#F3EFE6] shadow-luxury-dark sm:p-10 lg:col-span-5 lg:row-span-2"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D6B878]/45 bg-[#D6B878]/15 px-3.5 py-1 font-sans text-[11px] font-semibold tracking-[0.2em] text-[#D6B878] uppercase">
                ✦ {solution.badge}
              </span>

              <h3 className="mt-6 font-serif text-3xl leading-[1.08] font-normal text-[#F3EFE6] sm:text-4xl">
                {solution.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-[#F3EFE6]/76">
                {solution.description}
              </p>

              <ul className="mt-8 space-y-4">
                {solution.pillars.map((pillar, idx) => (
                  <li
                    key={pillar.key}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-[#D6B878]/35"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="font-serif text-xl font-medium text-[#D6B878]">
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-[#F3EFE6]">
                          {pillar.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#F3EFE6]/70">
                          {pillar.detail}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#D6B878]/20 pt-5 text-xs text-[#D6B878]">
              <span className="inline-flex items-center gap-2 font-mono">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>{problem.statHighlight}</span>
              </span>
            </div>
          </SilkReveal>

          {/* Right Top: 4 Elevated Pure-White Rounded Finding Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {problem.bullets.map((bullet, idx) => (
              <SilkReveal
                key={bullet}
                delay={0.06 * idx}
                className="flex flex-col justify-between rounded-[24px] border border-[#0E2244]/10 bg-white p-6 shadow-luxury transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#D6B878]/60 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-sans text-[11px] font-semibold tracking-[0.22em] text-[#7F6330] uppercase">
                      {locale === 'es' ? `HALLAZGO 0${idx + 1}` : `FINDING 0${idx + 1}`}
                    </span>
                    <span className="rounded-full bg-[#ECECE8] px-2.5 py-1 font-mono text-[10px] font-medium text-[#0E2244]">
                      {FINDING_TAGS[idx] ?? 'audit'}
                    </span>
                  </div>

                  <p className="mt-5 font-serif text-xl leading-[1.3] text-[#0E2244]">
                    {bullet}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#0E2244]/8 pt-3.5 text-xs text-[#5A6378]">
                  <span>
                    {locale === 'es' ? 'Riesgo de producción' : 'Production risk'}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#C94A22]">
                    HIGH
                  </span>
                </div>
              </SilkReveal>
            ))}
          </div>

          {/* Right Bottom: Signature Champagne-Gold Metallic Diagnostic Banner Card */}
          <SilkReveal
            delay={0.18}
            direction="scale"
            className="bg-gold-metallic flex flex-col justify-between gap-6 rounded-[26px] border border-white/50 p-7 text-[#0E2244] shadow-luxury sm:flex-row sm:items-center sm:p-8 lg:col-span-7"
          >
            <div className="max-w-lg space-y-2">
              <p className="font-sans text-[11px] font-semibold tracking-[0.24em] text-[#0E2244]/75 uppercase">
                {locale === 'es'
                  ? '¿NO SABES SI RESCATAR O REHACER?'
                  : 'NOT SURE WHETHER TO RESCUE OR REBUILD?'}
              </p>
              <h3 className="font-serif text-3xl leading-tight font-medium text-[#0E2244]">
                {problem.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#0E2244]/80">
                {problem.description}
              </p>
            </div>

            <button
              type="button"
              onClick={triggerDiagnosticSelection}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0E2244] px-6 py-3.5 text-sm font-semibold text-[#F3EFE6] transition-all hover:bg-[#1D3A6E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E2244]"
            >
              <span>{dict.nav.diagnosticCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </SilkReveal>
        </div>
      </div>
    </section>
  );
}
