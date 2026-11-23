'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
 * Clean porcelain-and-ice-blue editorial section replacing AI mini-cards with:
 * - Left deep-navy ruled specification ledger (no nested mini-cards)
 * - Right continuous white findings sheet + frosted white-blue diagnostic banner
 */
export function ProblemSolutionSection() {
  const { locale, dict } = useLocale();
  const { sectionTitle, sectionSubtitle, problem, solution } =
    dict.problemSolution;
  const demoHref = `/demo?lang=${locale}`;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-porcelain-canvas py-20 text-[#0E2244] sm:py-28"
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
        {/* Editorial 2-Column Header */}
        <SilkReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow-rule text-[#2563EB]">{problem.badge}</span>
            <h2 className="mt-4 font-serif text-4xl leading-[1.02] font-normal tracking-[-0.015em] text-[#0E2244] sm:text-5xl lg:text-[56px]">
              {sectionTitle}
            </h2>
          </div>

          <div className="space-y-5 lg:col-span-5 lg:pb-1">
            <p className="text-base leading-relaxed text-[#52607A]">
              {sectionSubtitle}
            </p>
            <Link
              href={demoHref}
              className="inline-flex items-center gap-2 rounded-full border border-[#0E2244]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#0E2244] transition-all hover:border-[#0E2244] hover:bg-[#0E2244] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <span>{dict.hero.secondaryCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </SilkReveal>

        {/* Asymmetric Layout: Ruled Navy Column + Continuous White Sheet & Frosted Ice-Blue Banner */}
        <div className="mt-14 grid gap-7 lg:grid-cols-12">
          {/* Left Tall Parisian-Navy Panel (Clean Ruled Index — NO nested mini-cards) */}
          <SilkReveal
            direction="left"
            className="bg-navy-pinstripe ice-shimmer-top flex flex-col justify-between rounded-[28px] border border-[#93C5FD]/25 p-8 text-white shadow-luxury-dark sm:p-10 lg:col-span-5"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#93C5FD] uppercase">
                {solution.badge}
              </span>

              <h3 className="mt-5 font-serif text-3xl leading-[1.08] font-normal text-white sm:text-4xl">
                {solution.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {solution.description}
              </p>

              <ol className="mt-8 divide-y divide-white/12 border-t border-white/12">
                {solution.pillars.map((pillar, idx) => (
                  <li key={pillar.key} className="flex items-start gap-4 py-5">
                    <span className="pt-0.5 font-mono text-xs font-semibold text-[#93C5FD]">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {pillar.title}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-white/68">
                        {pillar.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-6 border-t border-white/12 pt-5 font-mono text-xs text-[#BFDBFE]">
              {problem.statHighlight}
            </p>
          </SilkReveal>

          {/* Right Column: Unified White Findings Sheet + Frosted White-Blue Banner */}
          <div className="flex flex-col justify-between gap-7 lg:col-span-7">
            <SilkReveal className="rounded-[28px] border border-[#0E2244]/10 bg-white p-7 shadow-luxury sm:p-9">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#0E2244]/10 pb-5">
                <div>
                  <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#2563EB] uppercase">
                    {locale === 'es' ? 'AUDITORÍA DE CÓDIGO REAL' : 'LIVE CODEBASE AUDIT'}
                  </span>
                  <h3 className="mt-2 font-serif text-3xl font-normal text-[#0E2244]">
                    {problem.title}
                  </h3>
                </div>
              </div>

              <ol className="divide-y divide-[#0E2244]/10">
                {problem.bullets.map((bullet, idx) => (
                  <li
                    key={bullet}
                    className="grid gap-3 py-5 sm:grid-cols-12 sm:items-baseline"
                  >
                    <span className="font-mono text-xs font-semibold text-[#2563EB] sm:col-span-1">
                      0{idx + 1}
                    </span>
                    <p className="text-[15px] leading-relaxed text-[#0E2244] sm:col-span-8">
                      {bullet}
                    </p>
                    <span className="font-mono text-[11px] text-[#52607A] sm:col-span-3 sm:text-right">
                      {FINDING_TAGS[idx] ?? 'audit'}
                    </span>
                  </li>
                ))}
              </ol>
            </SilkReveal>

            {/* Frosted White-to-Ice-Blue Banner (replaces burnt yellow card) */}
            <SilkReveal
              delay={0.12}
              direction="scale"
              className="bg-ice-luxury flex flex-col justify-between gap-6 rounded-[28px] border border-[#BFDBFE] p-7 text-[#0E2244] shadow-luxury sm:flex-row sm:items-center sm:p-9"
            >
              <div className="max-w-lg space-y-2">
                <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#1D4ED8] uppercase">
                  {locale === 'es'
                    ? '¿RESCATAR O REHACER EL BACKEND?'
                    : 'RESCUE OR REBUILD THE BACKEND?'}
                </p>
                <p className="font-serif text-3xl leading-tight font-normal text-[#0E2244]">
                  {locale === 'es'
                    ? 'Sal de dudas en 48 horas con evidencia real.'
                    : 'Get a straight answer in 48 hours with real evidence.'}
                </p>
                <p className="text-sm leading-relaxed text-[#52607A]">
                  {problem.description}
                </p>
              </div>

              <button
                type="button"
                onClick={triggerDiagnosticSelection}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0E2244] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                <span>{dict.nav.diagnosticCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </SilkReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
