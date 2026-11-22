'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { HeroCanvasScene } from '@/components/landing/HeroCanvasScene';
import { SILK_EASE } from '@/components/motion/SilkReveal';
import { useLocale } from '@/context/LocaleContext';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

type InspectionMode = 'before' | 'after';

/**
 * Full-viewport luminous sapphire-navy Hero:
 * - Pure architectural fluted-glass studio backdrop (/images/hero-backdrop.jpg) with mouse parallax.
 * - Dedicated in-flow 3D WebGL stage for the sculpted liquid metallic-glass "VSH" monogram
 *   (prevents any overlap with the pill, headline, or exhibits on mobile, laptop, and desktop).
 * - Two spacious frosted white-blue architectural exhibits flanking the 3D stage on xl screens.
 * - Zero decorative stars/sparkles; 1-line Cormorant headline & dual pill CTAs above the fold.
 */
export function HeroSection() {
  const { locale, dict } = useLocale();
  const { hero } = dict;
  const [mode, setMode] = useState<InspectionMode>('after');
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const demoHref = `/demo?lang=${locale}`;
  const isHardened = mode === 'after';

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x: nx, y: ny });
  };

  const handlePointerLeave = () => {
    setMouse({ x: 0, y: 0 });
  };

  const handleDiagnosticCtaClick = () => {
    triggerDiagnosticSelection();
  };

  const commaIndex = hero.title.indexOf(',');
  const leadClause =
    commaIndex !== -1 ? hero.title.slice(0, commaIndex + 1) : hero.title;
  const italicClause =
    commaIndex !== -1 ? hero.title.slice(commaIndex + 1).trim() : '';

  const proofRibbon =
    locale === 'es'
      ? [
          { index: '01', title: 'Diagnóstico en 48h', caption: 'Expediente interactivo y dictamen real' },
          { index: '02', title: '1.er PR en preview', caption: 'Fallo crítico cerrado desde el día 2' },
          { index: '03', title: '100 % descontable', caption: 'Crédito íntegro si contratas rescate' },
          { index: '04', title: 'Código 100 % tuyo', caption: 'Entregas auditables en tu GitHub' },
        ]
      : [
          { index: '01', title: '48h Diagnostic', caption: 'Interactive dossier and honest verdict' },
          { index: '02', title: '1st PR on preview', caption: 'Critical fix shipped on day 2' },
          { index: '03', title: '100% credited', caption: 'Deducted in full from your rescue' },
          { index: '04', title: '100% client-owned', caption: 'Auditable PRs inside your GitHub' },
        ];

  return (
    <div className="bg-porcelain-canvas">
      {/* Full-Viewport Studio Fluted-Light Hero with Dedicated In-Flow 3D VSH Stage */}
      <section
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="bg-hero-stage relative flex min-h-[720px] flex-col justify-between overflow-hidden pt-20 pb-16 text-white sm:pt-24 sm:pb-20 lg:min-h-[760px] lg:pb-24"
      >
        {/* Pure Atmospheric Fluted-Glass Architectural Backdrop with Parallax */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-backdrop.jpg"
            alt=""
            className="h-full w-full object-cover object-center opacity-90 transition-transform duration-500 ease-out will-change-transform select-none"
            style={{
              transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -9}px, 0) scale(1.06)`,
            }}
          />
          {/* Reactive ambient mode tint when inspecting vulnerable AI prototype */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isHardened ? 'opacity-0' : 'opacity-100'
            } bg-[radial-gradient(65%_55%_at_50%_34%,rgba(185,28,28,0.34)_0%,rgba(127,29,29,0.2)_45%,transparent_75%)]`}
          />
        </div>

        {/* Sculpted top & lower readability veil */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,20,43,0.78)_0%,rgba(7,20,43,0.72)_9%,rgba(7,20,43,0.18)_20%,transparent_34%,rgba(7,20,43,0.28)_55%,rgba(7,20,43,0.9)_76%,rgba(7,20,43,1)_100%)]"
        />

        {/* UPPER STAGE: Dedicated In-Flow 3D VSH Monogram + Flanking Exhibits + Hotspot Pill */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-5 pt-2 pb-6 sm:px-10">
          {/* Left Heritage Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SILK_EASE }}
            className="absolute top-2 left-8 hidden max-w-[190px] xl:block"
          >
            <span className="block h-px w-9 bg-[#93C5FD]/65" aria-hidden="true" />
            <p className="mt-3 font-sans text-[11px] leading-[1.7] font-medium tracking-[0.26em] text-white/75 uppercase">
              {locale === 'es' ? (
                <>
                  MADRID · UE
                  <br />
                  INGENIERÍA SENIOR
                  <br />
                  WEB &amp; FLUTTER
                </>
              ) : (
                <>
                  MADRID · EU
                  <br />
                  SENIOR ENGINEERING
                  <br />
                  WEB &amp; FLUTTER
                </>
              )}
            </p>
          </motion.div>

          {/* Two Large Frosted White-Blue Architectural Exhibits (xl+ flanking the 3D stage) */}
          <div className="pointer-events-none absolute inset-x-8 top-10 bottom-4 hidden xl:block">
            {/* Left Exhibit: Live RLS Policy & HTTP Trace Sheet */}
            <div
              className="pointer-events-auto absolute top-16 left-0 w-[276px] transition-transform duration-300 ease-out 2xl:w-[292px]"
              style={{
                transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -10}px, 0)`,
              }}
            >
              <div className="animate-float-left bg-ice-luxury rounded-[26px] border border-white/80 p-5 text-[#0E2244] shadow-luxury-dark">
                <div className="flex items-center justify-between gap-2 border-b border-[#0E2244]/10 pb-3">
                  <span className="whitespace-nowrap font-mono text-[10px] font-semibold tracking-[0.14em] text-[#52607A] uppercase">
                    {locale === 'es' ? 'INSPECCIÓN HTTP · RLS' : 'HTTP TRACE · RLS'}
                  </span>
                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                      isHardened
                        ? 'bg-[#DCFCE7] text-[#146C43]'
                        : 'bg-[#FEE2E2] text-[#B91C1C]'
                    }`}
                  >
                    {isHardened ? '403 LOCKED' : '200 LEAK'}
                  </span>
                </div>

                <div className="mt-3.5 rounded-2xl bg-[#0E2244] p-3.5 font-mono text-[11px] leading-relaxed text-[#E2ECFF]">
                  <div className="text-[#93C5FD]">GET /rest/v1/customers</div>
                  <div className="mt-1 text-white/85">
                    {isHardened
                      ? 'policy: tenant_uid = auth.uid()'
                      : 'rls_enabled: false (1,420 rows)'}
                  </div>
                </div>

                <div className="mt-3.5 flex items-baseline justify-between text-xs">
                  <span className="font-serif text-base font-medium text-[#0E2244]">
                    {locale === 'es' ? 'PR #142 en preview' : 'PR #142 on preview'}
                  </span>
                  <span className="font-mono text-[11px] text-[#1D4ED8]">
                    48h
                  </span>
                </div>
              </div>
            </div>

            {/* Right Exhibit: Real Latency & Quality Trajectory Curve */}
            <div
              className="pointer-events-auto absolute top-6 right-0 w-[276px] transition-transform duration-300 ease-out 2xl:w-[292px]"
              style={{
                transform: `translate3d(${mouse.x * 16}px, ${mouse.y * -10}px, 0)`,
              }}
            >
              <div className="animate-float-right bg-ice-luxury rounded-[26px] border border-white/80 p-5 text-[#0E2244] shadow-luxury-dark">
                <div className="flex items-center justify-between gap-2 border-b border-[#0E2244]/10 pb-3">
                  <span className="whitespace-nowrap font-mono text-[10px] font-semibold tracking-[0.14em] text-[#52607A] uppercase">
                    {locale === 'es' ? 'PERFILADO · DEVTOOLS' : 'PROFILING · DEVTOOLS'}
                  </span>
                  <span className="shrink-0 whitespace-nowrap font-mono text-[11px] font-semibold text-[#1D4ED8] tabular-nums">
                    {isHardened ? '96 / 100' : '34 / 100'}
                  </span>
                </div>

                <div className="mt-3.5 rounded-2xl border border-[#BFDBFE]/70 bg-white p-3.5">
                  <svg viewBox="0 0 220 62" className="h-14 w-full" aria-hidden="true">
                    <line
                      x1="0"
                      y1="52"
                      x2="220"
                      y2="52"
                      stroke="rgba(14,34,68,0.08)"
                      strokeWidth="1"
                    />
                    <polyline
                      fill="none"
                      stroke={isHardened ? '#2563EB' : '#C94A22'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={
                        isHardened
                          ? '8,14 52,18 96,26 144,38 212,48'
                          : '8,46 56,42 108,32 162,20 212,12'
                      }
                    />
                  </svg>
                </div>

                <div className="mt-3.5 flex items-baseline justify-between">
                  <span className="font-serif text-base font-medium text-[#0E2244]">
                    {isHardened ? 'LCP 1.2 s · 48/48 tests' : 'LCP 4.8 s · 0 tests'}
                  </span>
                  <span className="font-mono text-[11px] text-[#52607A]">
                    CI
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated In-Flow 3D Stage — guaranteed zero overlap on mobile, laptop, and desktop */}
          <div className="relative h-[160px] w-full max-w-[360px] sm:h-[205px] sm:max-w-[540px] lg:h-[235px] lg:max-w-[620px] 2xl:h-[255px] 2xl:max-w-[680px]">
            <HeroCanvasScene mode={mode} mouseX={mouse.x} mouseY={mouse.y} />
          </div>

          {/* Interactive Frosted Porcelain Hotspot Pill — placed in normal flow cleanly BELOW 3D stage */}
          <div className="mt-4 flex justify-center sm:mt-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: SILK_EASE }}
              className="inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-white/75 bg-[#F8FAFD]/95 py-1.5 pr-2 pl-4 text-[#0E2244] shadow-luxury-dark backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <span className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#52607A] uppercase">
                  {hero.pipelineCard.title}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                    isHardened
                      ? 'bg-[#DCFCE7] text-[#146C43]'
                      : 'bg-[#FEE2E2] text-[#B91C1C]'
                  }`}
                >
                  {isHardened
                    ? hero.pipelineCard.statusLabel
                    : locale === 'es'
                      ? 'EXPUESTO'
                      : 'EXPOSED'}
                </span>
              </div>

              <div
                role="group"
                aria-label={
                  locale === 'es'
                    ? 'Alternar estado del prototipo'
                    : 'Toggle prototype state'
                }
                className="inline-flex rounded-full bg-[#E6EFFC] p-0.5 font-mono text-[11px]"
              >
                <button
                  type="button"
                  aria-pressed={!isHardened}
                  onClick={() => setMode('before')}
                  className={`rounded-full px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    !isHardened
                      ? 'bg-[#C94A22] text-white'
                      : 'text-[#52607A] hover:text-[#0E2244]'
                  }`}
                >
                  {locale === 'es' ? 'Prototipo IA' : 'AI Prototype'}
                </button>
                <button
                  type="button"
                  aria-pressed={isHardened}
                  onClick={() => setMode('after')}
                  className={`rounded-full px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isHardened
                      ? 'bg-[#0E2244] text-white'
                      : 'text-[#52607A] hover:text-[#0E2244]'
                  }`}
                >
                  {locale === 'es' ? 'Tras VibeShield' : 'After VibeShield'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleDiagnosticCtaClick}
                aria-label={
                  locale === 'es'
                    ? 'Añadir diagnóstico 48h'
                    : 'Add 48h diagnostic'
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0E2244] text-white transition-transform hover:scale-105 hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFD]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* LOWER FOCAL STACK: 1-Line Sculptural Headline + Subtitle + Dual Pill CTAs */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: SILK_EASE }}
            className="font-sans text-[11px] font-semibold tracking-[0.3em] text-[#93C5FD] uppercase"
          >
            {hero.badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.18, ease: SILK_EASE }}
            className="mx-auto mt-3 font-serif text-4xl leading-[1.02] font-normal tracking-[-0.015em] text-white sm:text-6xl lg:text-[68px]"
          >
            {leadClause}
            {italicClause && (
              <>
                {' '}
                <em className="italic text-[#BFDBFE]">{italicClause}</em>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: SILK_EASE }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: SILK_EASE }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              type="button"
              onClick={handleDiagnosticCtaClick}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#EEF5FF] px-7 py-3.5 text-sm font-semibold text-[#0E2244] shadow-luxury-dark transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <span>{hero.primaryCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <Link
              href={demoHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-[#93C5FD] hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <span>{hero.secondaryCta}</span>
            </Link>
          </motion.div>

          {/* Clean typographic scope strip — zero diamond or star symbols */}
          <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 font-mono text-[10px] text-white/60">
            {hero.pipelineCard.checks.map((check) => (
              <li key={check.id}>{check.label}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Overlapping Trust Ribbon — crisp white-to-ice-blue frosted architectural strip, zero stars */}
      <div className="relative z-20 mx-auto -mt-10 max-w-[1360px] px-5 sm:px-8 lg:px-10">
        <div className="bg-ice-luxury rounded-[26px] border border-[#BFDBFE]/80 px-6 py-7 text-[#0E2244] shadow-luxury sm:px-10">
          <div className="grid gap-6 divide-y divide-[#0E2244]/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {proofRibbon.map((item) => (
              <div
                key={item.index}
                className="flex items-baseline gap-4 pt-4 first:pt-0 sm:pt-0 lg:px-6 lg:first:pl-0 lg:last:pr-0"
              >
                <span className="font-mono text-xs font-semibold text-[#1D4ED8]">
                  {item.index}
                </span>
                <div>
                  <p className="font-serif text-xl font-medium text-[#0E2244]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#52607A]">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
