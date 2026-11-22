'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

type InspectionMode = 'before' | 'after';

interface LayerNode {
  readonly code: string;
  readonly labelEs: string;
  readonly labelEn: string;
  readonly beforeTag: string;
  readonly afterTag: string;
}

const ARCHITECTURE_LAYERS: readonly LayerNode[] = [
  {
    code: 'L-01',
    labelEs: 'Bundle cliente',
    labelEn: 'Client bundle',
    beforeTag: 'KEY EXPOSED',
    afterTag: 'SERVER ONLY',
  },
  {
    code: 'L-02',
    labelEs: 'Sesión & JWT',
    labelEn: 'Auth & JWT',
    beforeTag: 'UNCHECKED',
    afterTag: 'VERIFIED',
  },
  {
    code: 'L-03',
    labelEs: 'Políticas RLS / BD',
    labelEn: 'DB RLS policies',
    beforeTag: 'HTTP 200 LEAK',
    afterTag: 'HTTP 403 LOCK',
  },
  {
    code: 'L-04',
    labelEs: 'CI + AGENTS.md',
    labelEn: 'CI + AGENTS.md',
    beforeTag: '0 TESTS',
    afterTag: '48/48 PASS',
  },
];

/**
 * Luminous Daylight-inspired editorial hero paired with a bespoke interactive
 * architectural inspection plate (before vs. after Velnea intervention).
 */
export function HeroSection() {
  const { locale, dict } = useLocale();
  const { hero } = dict;
  const [mode, setMode] = useState<InspectionMode>('after');
  const demoHref = `/demo?lang=${locale}`;

  const handleDiagnosticCtaClick = () => {
    triggerDiagnosticSelection();
  };

  // Split title cleanly on the first period to highlight the resolution clause in editorial italic serif
  const periodIndex = hero.title.indexOf('.');
  const leadSentence =
    periodIndex !== -1 ? hero.title.slice(0, periodIndex + 1) : hero.title;
  const accentSentence =
    periodIndex !== -1 ? hero.title.slice(periodIndex + 1).trim() : '';

  const isHardened = mode === 'after';

  return (
    <section className="relative overflow-hidden border-b border-[#141311]/10 bg-[#FBF9F5] bg-daylight-wash">
      <div className="mx-auto max-w-[1320px] px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28 lg:px-10 lg:pt-28 lg:pb-32">
        {/* Top Editorial Monumental Headline */}
        <div className="max-w-4xl">
          <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#857F75] uppercase">
            {hero.badge}
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-[0.98] tracking-[-0.025em] text-[#141311] sm:text-6xl lg:text-[78px]">
            {leadSentence}
            {accentSentence && (
              <>
                {' '}
                <span className="italic text-[#C94A22]">{accentSentence}</span>
              </>
            )}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#57534C] sm:text-[19px] sm:leading-[1.6]">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleDiagnosticCtaClick}
              className="inline-flex items-center gap-2.5 bg-[#C94A22] px-7 py-4 font-mono text-xs font-medium tracking-[0.1em] text-[#FBF9F5] uppercase transition-colors hover:bg-[#141311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF9F5]"
            >
              <span>{hero.primaryCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <Link
              href={demoHref}
              className="inline-flex items-center gap-2 border border-[#141311]/25 bg-white/70 px-6 py-4 font-mono text-xs font-medium tracking-[0.1em] text-[#141311] uppercase transition-colors hover:border-[#141311] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              <span>{hero.secondaryCta}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bespoke Architectural Inspection Plate (Matte Obsidian Precision Artifact on Warm Paper) */}
        <div className="mt-16 border border-[#141311]/15 bg-[#161514] text-[#F5F2EB] editorial-shadow lg:mt-20">
          {/* Instrument Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4 sm:px-8">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase">
              <span
                className={`inline-block h-2 w-2 transition-colors ${
                  isHardened ? 'bg-[#34D399]' : 'bg-[#EF4444]'
                }`}
                aria-hidden="true"
              />
              <span className="text-[#F5F2EB]">{hero.pipelineCard.title}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/55">{hero.pipelineCard.branch}</span>
            </div>

            <div className="flex items-center gap-3">
              <div
                role="group"
                aria-label={
                  locale === 'es'
                    ? 'Comparar estado del repositorio'
                    : 'Compare repository state'
                }
                className="inline-flex border border-white/15 bg-black/30 p-0.5 font-mono text-[11px]"
              >
                <button
                  type="button"
                  aria-pressed={!isHardened}
                  onClick={() => setMode('before')}
                  className={`px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] ${
                    !isHardened
                      ? 'bg-[#C94A22] text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {locale === 'es' ? 'Prototipo IA' : 'AI Prototype'}
                </button>
                <button
                  type="button"
                  aria-pressed={isHardened}
                  onClick={() => setMode('after')}
                  className={`px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] ${
                    isHardened
                      ? 'bg-[#F5F2EB] text-[#141311]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {locale === 'es' ? 'Tras Velnea' : 'After Velnea'}
                </button>
              </div>

              <span
                className={`hidden border px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] uppercase sm:inline-block ${
                  isHardened
                    ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300'
                    : 'border-red-400/35 bg-red-400/10 text-red-300'
                }`}
              >
                {isHardened
                  ? hero.pipelineCard.statusLabel
                  : locale === 'es'
                    ? 'EXPUESTO'
                    : 'EXPOSED'}
              </span>
            </div>
          </div>

          {/* Two-Part Precision Schematic + Verified Ledger */}
          <div className="grid lg:grid-cols-12">
            {/* Left: Interactive 4-Layer Architectural Signal Diagram */}
            <div className="border-b border-white/10 p-6 sm:p-8 lg:col-span-6 lg:border-r lg:border-b-0">
              <div className="flex items-center justify-between font-mono text-[11px] text-white/45 uppercase">
                <span>
                  {locale === 'es'
                    ? 'TRAZADO DE CAPAS · REV. 26'
                    : 'LAYER TRACE · REV. 26'}
                </span>
                <span>
                  {isHardened
                    ? 'SCORE 96 / 100'
                    : 'SCORE 34 / 100'}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {ARCHITECTURE_LAYERS.map((layer, index) => (
                  <div
                    key={layer.code}
                    className={`relative flex items-center justify-between gap-4 border px-4 py-3.5 transition-all duration-300 ${
                      isHardened
                        ? 'border-white/12 bg-white/[0.03]'
                        : 'border-red-500/30 bg-red-500/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[11px] text-white/40">
                        {layer.code}
                      </span>
                      <span
                        className={`h-px w-5 transition-colors ${
                          isHardened ? 'bg-emerald-400/70' : 'bg-red-400/70'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium text-[#F5F2EB]">
                        {locale === 'es' ? layer.labelEs : layer.labelEn}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-[11px] tracking-wider ${
                        isHardened ? 'text-emerald-300' : 'text-red-300'
                      }`}
                    >
                      {isHardened ? layer.afterTag : layer.beforeTag}
                    </span>

                    {index < ARCHITECTURE_LAYERS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -bottom-3.5 left-8 h-3.5 w-px ${
                          isHardened ? 'bg-emerald-400/40' : 'bg-red-400/40'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Compact Bottom Metrics Bar */}
              <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 border border-white/10 bg-black/25 font-mono">
                <div className="p-3.5">
                  <div className="text-[10px] text-white/45 uppercase">LCP</div>
                  <div
                    className={`mt-1 text-base font-medium tabular-nums ${
                      isHardened ? 'text-[#F5F2EB]' : 'text-red-300'
                    }`}
                  >
                    {isHardened ? '1.2 s' : '4.8 s'}
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="text-[10px] text-white/45 uppercase">
                    {locale === 'es' ? 'DUPLICACIÓN' : 'DUPLICATION'}
                  </div>
                  <div
                    className={`mt-1 text-base font-medium tabular-nums ${
                      isHardened ? 'text-[#F5F2EB]' : 'text-red-300'
                    }`}
                  >
                    {isHardened ? '2.4 %' : '31.0 %'}
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="text-[10px] text-white/45 uppercase">
                    {locale === 'es' ? 'CRÍTICOS' : 'CRITICAL'}
                  </div>
                  <div
                    className={`mt-1 text-base font-medium tabular-nums ${
                      isHardened ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {isHardened ? '0' : '4'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Crisp Inspection Ledger from Dictionary */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.16em] text-white/45 uppercase">
                  {locale === 'es'
                    ? 'CRITERIOS DE ENTREGA VERIFICABLES'
                    : 'VERIFIABLE EXIT CRITERIA'}
                </p>

                <ul className="mt-5 divide-y divide-white/10">
                  {hero.pipelineCard.checks.map((check, idx) => (
                    <li
                      key={check.id}
                      className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <span className="pt-0.5 font-mono text-[11px] text-[#C94A22]">
                          0{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#F5F2EB]">
                            {check.label}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-white/55">
                            {check.detail}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] tracking-wider text-emerald-300 uppercase">
                        OK
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[11px] text-white/55">
                <span>
                  {locale === 'es'
                    ? 'Diagnóstico 48h · 100 % descontable en rescate'
                    : '48h Diagnostic · 100% credited toward rescue'}
                </span>
                <Link
                  href={demoHref}
                  className="text-[#F5F2EB] underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#C94A22] hover:decoration-[#C94A22]"
                >
                  {locale === 'es' ? 'Abrir expediente PulseCRM →' : 'Open PulseCRM dossier →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
