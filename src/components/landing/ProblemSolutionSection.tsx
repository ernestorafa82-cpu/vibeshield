'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';

const FINDING_TAGS = [
  'rls_enabled = false',
  'NEXT_PUBLIC_SECRET',
  '0 automated tests',
  'cyclic imports',
] as const;

/**
 * Asymmetric Swiss editorial section detailing real recurring audit findings
 * and Velnea's four-layer engineering intervention.
 */
export function ProblemSolutionSection() {
  const { dict } = useLocale();
  const { sectionTitle, sectionSubtitle, problem, solution } =
    dict.problemSolution;

  return (
    <section
      id="how-it-works"
      className="border-b border-[#141311]/10 bg-[#FBF9F5] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
        {/* Asymmetric Header */}
        <div className="grid gap-8 border-b border-[#141311]/12 pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#C94A22] uppercase">
              {problem.badge}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.04] tracking-[-0.02em] text-[#141311] sm:text-5xl">
              {sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-[#57534C]">
              {sectionSubtitle}
            </p>
          </div>
        </div>

        {/* Part 1: Numbered Forensic Findings Ledger */}
        <div className="grid gap-10 border-b border-[#141311]/12 py-14 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <h3 className="font-serif text-3xl leading-tight text-[#141311]">
              {problem.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#57534C]">
              {problem.description}
            </p>
            <p className="border-l-2 border-[#C94A22] pl-4 font-mono text-xs text-[#141311]">
              {problem.statHighlight}
            </p>
          </div>

          <ol className="divide-y divide-[#141311]/12 border-t border-[#141311]/12 lg:col-span-8 lg:border-t-0">
            {problem.bullets.map((bullet, idx) => (
              <li
                key={bullet}
                className="grid gap-3 py-5 first:pt-0 sm:grid-cols-12 sm:items-baseline"
              >
                <span className="font-mono text-xs font-medium text-[#C94A22] sm:col-span-1">
                  0{idx + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-[#141311] sm:col-span-8">
                  {bullet}
                </p>
                <span className="font-mono text-[11px] text-[#857F75] sm:col-span-3 sm:text-right">
                  {FINDING_TAGS[idx] ?? 'audit'}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Part 2: Velnea Intervention Architectural Grid */}
        <div className="grid gap-10 pt-14 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#1A6340] uppercase">
              {solution.badge}
            </p>
            <h3 className="font-serif text-3xl leading-tight text-[#141311]">
              {solution.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#57534C]">
              {solution.description}
            </p>
          </div>

          <div className="grid border border-[#141311]/12 bg-white sm:grid-cols-2 lg:col-span-8">
            {solution.pillars.map((pillar, idx) => (
              <div
                key={pillar.key}
                className={`p-7 sm:p-8 ${
                  idx % 2 === 0 ? 'sm:border-r sm:border-[#141311]/12' : ''
                } ${idx < 2 ? 'border-b border-[#141311]/12' : ''} ${
                  idx === 2 ? 'border-b border-[#141311]/12 sm:border-b-0' : ''
                }`}
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-[#857F75] uppercase">
                  SPEC · 0{idx + 1}
                </span>
                <h4 className="mt-3 text-base font-semibold tracking-tight text-[#141311]">
                  {pillar.title}
                </h4>
                <p className="mt-2.5 text-sm leading-relaxed text-[#57534C]">
                  {pillar.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
