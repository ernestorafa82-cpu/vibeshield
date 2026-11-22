'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

/**
 * Side-by-side comparison contrasting AI prototype failure modes with the Anti-Vibe Shield layers.
 */
export function ProblemSolutionSection() {
  const { dict } = useLocale();
  const { sectionTitle, sectionSubtitle, problem, solution } =
    dict.problemSolution;

  return (
    <section
      id="how-it-works"
      className="border-b border-zinc-800/80 bg-[#09090B] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
            {sectionSubtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="flex flex-col justify-between rounded-xl border border-red-500/25 bg-[#111114] p-6 sm:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-red-300">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{problem.badge}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {problem.title}
                </h3>
                <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 font-mono text-xs font-medium text-red-200 sm:text-sm">
                  {problem.statHighlight}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                {problem.description}
              </p>

              <ul className="space-y-3 pt-2">
                {problem.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300"
                  >
                    <XCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="glow-emerald flex flex-col justify-between rounded-xl border border-emerald-500/30 bg-[#111114] p-6 sm:p-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{solution.badge}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {solution.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {solution.description}
                </p>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {solution.pillars.map((pillar) => (
                  <div
                    key={pillar.key}
                    className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-zinc-100">
                          {pillar.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-zinc-400">
                          {pillar.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
