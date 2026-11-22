'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Terminal } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

/**
 * Above-the-fold hero section with primary diagnostic CTA, demo link, and Shield CI terminal preview.
 */
export function HeroSection() {
  const { locale, dict } = useLocale();
  const { hero } = dict;
  const demoHref = `/demo?lang=${locale}`;

  const handleDiagnosticCtaClick = () => {
    triggerDiagnosticSelection();
  };

  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80 bg-[#09090B] bg-tech-grid">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_62%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-xs font-medium tracking-wider text-emerald-300">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.85)]"
              />
              <span>{hero.badge}</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.06]">
              {hero.title}
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
              {hero.subtitle}
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={handleDiagnosticCtaClick}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_rgba(16,185,129,0.28)] transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:text-base"
              >
                {hero.primaryCta}
              </button>

              <Link
                href={demoHref}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900/60 px-5 py-3 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:text-base"
              >
                {hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glow-emerald overflow-hidden rounded-xl border border-zinc-800 bg-[#111114]">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-950/60 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-300">
                  <Terminal
                    className="h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span className="truncate font-mono font-semibold text-zinc-100">
                    {hero.pipelineCard.title}
                  </span>
                  <span className="shrink-0 font-mono text-zinc-500">
                    — {hero.pipelineCard.branch}
                  </span>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-300">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400"
                  />
                  <span>{hero.pipelineCard.statusLabel}</span>
                </span>
              </div>

              <ul className="divide-y divide-zinc-800/70 p-4 font-mono text-sm">
                {hero.pipelineCard.checks.map((check) => (
                  <li
                    key={check.id}
                    className="flex items-start gap-3 py-3 first:pt-1 last:pb-1"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-medium text-zinc-100">{check.label}</p>
                      <p className="text-xs leading-relaxed text-zinc-400">
                        {check.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
