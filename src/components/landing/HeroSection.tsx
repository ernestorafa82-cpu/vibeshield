'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Code2,
  GitPullRequest,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { HeroCanvasScene } from '@/components/landing/HeroCanvasScene';
import { SILK_EASE } from '@/components/motion/SilkReveal';
import { useLocale } from '@/context/LocaleContext';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

type InspectionMode = 'before' | 'after';

/**
 * Full-viewport cinematic luxury Hero modeled on biologique.es proportions:
 * - Upper stage (58% height): Shaded 3D crystal monolith Canvas + 4 portrait
 *   Polaroid-style artifact cards with mouse parallax + interactive glass hotspot pill.
 * - Lower focal stage (100% above the fold at 1440x900): clean dark gradient backdrop,
 *   1-line monumental Cormorant Garamond headline, subtitle, and dual pill CTAs.
 * - Overlapping pinstripe Parisian-navy Trust Ribbon transitioning onto cream paper.
 */
export function HeroSection() {
  const { locale, dict } = useLocale();
  const { hero } = dict;
  const [mode, setMode] = useState<InspectionMode>('after');
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const demoHref = `/demo?lang=${locale}`;
  const isHardened = mode === 'after';

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
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

  // Highlight after the comma in champagne-gold italic serif (exact biologique.es elegance)
  const commaIndex = hero.title.indexOf(',');
  const leadClause =
    commaIndex !== -1 ? hero.title.slice(0, commaIndex + 1) : hero.title;
  const italicClause =
    commaIndex !== -1 ? hero.title.slice(commaIndex + 1).trim() : '';

  const trustItems =
    locale === 'es'
      ? [
          {
            icon: Clock,
            title: 'Diagnóstico en 48h',
            caption: 'Informe real + veredicto honesto',
          },
          {
            icon: GitPullRequest,
            title: '1.er PR en preview',
            caption: 'Fallo crítico cerrado desde el día 2',
          },
          {
            icon: Sparkles,
            title: '100 % descontable',
            caption: 'Crédito íntegro en tu rescate',
          },
          {
            icon: Code2,
            title: 'Código 100 % tuyo',
            caption: 'Entregas limpias en tu GitHub',
          },
        ]
      : [
          {
            icon: Clock,
            title: '48h Diagnostic',
            caption: 'Live dossier + honest verdict',
          },
          {
            icon: GitPullRequest,
            title: '1st PR on preview',
            caption: 'Critical fix shipped on day 2',
          },
          {
            icon: Sparkles,
            title: '100% credited',
            caption: 'Deducted in full from rescue',
          },
          {
            icon: Code2,
            title: '100% client-owned',
            caption: 'Clean PRs inside your GitHub',
          },
        ];

  return (
    <div className="bg-cream-dotted">
      {/* Full-Viewport Atmospheric Dark Luxury Stage (fits 100% above the fold at 1440x900) */}
      <section
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="bg-hero-stage relative flex min-h-[760px] flex-col justify-between overflow-hidden pt-20 pb-20 text-[#F3EFE6] lg:h-[min(100svh,880px)] lg:pb-24"
      >
        {/* Interactive 60fps 3D Shaded Crystal Monolith & Rising Champagne Motes */}
        <HeroCanvasScene mode={mode} mouseX={mouse.x} mouseY={mouse.y} />

        {/* Bottom Studio Gradient Backdrop guaranteeing crystal-clear text legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,18,34,0.35)_0%,transparent_28%,rgba(7,18,34,0.45)_54%,rgba(7,18,34,0.94)_78%,rgba(7,18,34,1)_100%)]"
        />

        {/* UPPER STAGE: Heritage Stamp + 4 Portrait Polaroid Luxury Artifact Cards + Hotspot Pill */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-5 pb-6 sm:px-10">
          {/* Left Heritage Editorial Stamp */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SILK_EASE }}
            className="absolute top-6 left-10 hidden max-w-[180px] xl:block"
          >
            <span className="block h-px w-9 bg-[#D6B878]/70" aria-hidden="true" />
            <p className="mt-3 font-sans text-[11px] leading-[1.7] font-medium tracking-[0.26em] text-[#F3EFE6]/72 uppercase">
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

          {/* 4 Portrait Polaroid-Style Luxury Artifact Cards flanking the 3D crystal */}
          <div className="pointer-events-none absolute inset-x-10 top-4 bottom-2 hidden xl:block">
            {/* Upper-Left Portrait Ivory Polaroid Card (Health Score Dial) */}
            <div
              className="pointer-events-auto absolute top-2 left-[18%] w-[166px] transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mouse.x * -14}px, ${mouse.y * -10}px, 0)`,
              }}
            >
              <div className="animate-float-a rounded-[22px] border border-white/70 bg-[#FAF8F3] p-2.5 text-center text-[#0E2244] shadow-luxury-dark">
                <div className="flex h-[108px] flex-col items-center justify-center rounded-[15px] bg-[#ECECE8] px-3">
                  <svg viewBox="0 0 80 48" className="h-11 w-20" aria-hidden="true">
                    <path
                      d="M 10 42 A 30 30 0 0 1 70 42"
                      fill="none"
                      stroke="rgba(14,34,68,0.14)"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d={
                        isHardened
                          ? 'M 10 42 A 30 30 0 0 1 68 36'
                          : 'M 10 42 A 30 30 0 0 1 28 16'
                      }
                      fill="none"
                      stroke={isHardened ? '#1A6340' : '#C94A22'}
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="mt-1 font-serif text-2xl leading-none font-semibold tabular-nums">
                    {isHardened ? '96 / 100' : '34 / 100'}
                  </span>
                </div>
                <p className="mt-2.5 font-serif text-base font-medium text-[#0E2244]">
                  {locale === 'es' ? 'Salud de código' : 'Code health'}
                </p>
                <p className="pb-1 font-sans text-[9px] font-semibold tracking-[0.18em] text-[#7F6330] uppercase">
                  SONARQUBE GATE
                </p>
              </div>
            </div>

            {/* Lower-Left Portrait Deep Navy Polaroid Card */}
            <div
              className="pointer-events-auto absolute bottom-4 left-[6%] w-[166px] transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mouse.x * -22}px, ${mouse.y * -14}px, 0)`,
              }}
            >
              <div className="animate-float-d rounded-[22px] border border-white/60 bg-[#FAF8F3] p-2.5 text-center text-[#0E2244] shadow-luxury-dark">
                <div className="bg-navy-pinstripe flex h-[108px] flex-col items-center justify-center rounded-[15px] text-[#D6B878]">
                  <ShieldCheck className="h-9 w-9 stroke-[1.5]" aria-hidden="true" />
                  <span className="mt-2 font-mono text-[10px] tracking-[0.2em] text-[#F3EFE6]/85 uppercase">
                    48 HORAS
                  </span>
                </div>
                <p className="mt-2.5 font-serif text-base font-medium text-[#0E2244]">
                  {locale === 'es' ? 'Diagnóstico 48h' : '48h Diagnostic'}
                </p>
                <p className="pb-1 font-sans text-[9px] font-semibold tracking-[0.18em] text-[#7F6330] uppercase">
                  {locale === 'es' ? '100 % DESCONTABLE' : '100% CREDITED'}
                </p>
              </div>
            </div>

            {/* Upper-Right Portrait Champagne-Gold Polaroid Card */}
            <div
              className="pointer-events-auto absolute top-0 right-[17%] w-[166px] transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mouse.x * 16}px, ${mouse.y * -12}px, 0)`,
              }}
            >
              <div className="animate-float-b rounded-[22px] border border-white/70 bg-[#FAF8F3] p-2.5 text-center text-[#0E2244] shadow-luxury-dark">
                <div className="bg-gold-metallic flex h-[108px] flex-col items-center justify-center rounded-[15px] text-[#0E2244]">
                  <Lock className="h-8 w-8 stroke-[1.5]" aria-hidden="true" />
                  <span className="mt-2 font-mono text-xs font-bold tracking-wider">
                    {isHardened ? 'HTTP 403' : 'HTTP 200'}
                  </span>
                </div>
                <p className="mt-2.5 font-serif text-base font-medium text-[#0E2244]">
                  {isHardened ? 'PR #142 · RLS' : 'RLS Abierto'}
                </p>
                <p className="pb-1 font-sans text-[9px] font-semibold tracking-[0.18em] text-[#7F6330] uppercase">
                  {isHardened
                    ? locale === 'es'
                      ? 'FUGA BLOQUEADA'
                      : 'LEAK LOCKED'
                    : locale === 'es'
                      ? '1.420 EXPUESTOS'
                      : '1,420 EXPOSED'}
                </p>
              </div>
            </div>

            {/* Lower-Right Portrait Ivory Telemetry Polaroid Card */}
            <div
              className="pointer-events-auto absolute right-[6%] bottom-2 w-[166px] transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mouse.x * 24}px, ${mouse.y * 12}px, 0)`,
              }}
            >
              <div className="animate-float-c rounded-[22px] border border-white/70 bg-[#FAF8F3] p-2.5 text-center text-[#0E2244] shadow-luxury-dark">
                <div className="flex h-[108px] flex-col items-center justify-center rounded-[15px] bg-[#ECECE8] px-3">
                  <svg viewBox="0 0 100 38" className="h-9 w-24" aria-hidden="true">
                    <polyline
                      fill="none"
                      stroke={isHardened ? '#0E2244' : '#C94A22'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={
                        isHardened
                          ? '6,8 24,11 44,17 66,26 94,32'
                          : '6,30 28,26 52,18 76,12 94,8'
                      }
                    />
                  </svg>
                  <span className="mt-1 font-serif text-2xl leading-none font-semibold tabular-nums">
                    {isHardened ? '1.2 s' : '4.8 s'}
                  </span>
                </div>
                <p className="mt-2.5 font-serif text-base font-medium text-[#0E2244]">
                  LCP &amp; Tests CI
                </p>
                <p className="pb-1 font-sans text-[9px] font-semibold tracking-[0.18em] text-[#7F6330] uppercase">
                  {isHardened ? '48/48 PASS' : '0 TESTS'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Hotspot Pill positioned beside/below the 3D crystal, cleanly ABOVE the H1 */}
          <div className="flex justify-center pt-40 sm:pt-48 lg:pt-56">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: SILK_EASE }}
              className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-[#D6B878]/45 bg-[#F3EFE6]/95 py-1.5 pr-2 pl-4 text-[#0E2244] shadow-luxury-dark backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    isHardened ? 'bg-[#1A6340]' : 'bg-[#C94A22]'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#7F6330] uppercase">
                  {hero.pipelineCard.title}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                    isHardened
                      ? 'bg-[#EDF5F0] text-[#1A6340]'
                      : 'bg-[#FDF3EF] text-[#C94A22]'
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
                className="inline-flex rounded-full bg-[#0E2244]/8 p-0.5 font-mono text-[11px]"
              >
                <button
                  type="button"
                  aria-pressed={!isHardened}
                  onClick={() => setMode('before')}
                  className={`rounded-full px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E2244] ${
                    !isHardened
                      ? 'bg-[#C94A22] text-white'
                      : 'text-[#5A6378] hover:text-[#0E2244]'
                  }`}
                >
                  {locale === 'es' ? 'Prototipo IA' : 'AI Prototype'}
                </button>
                <button
                  type="button"
                  aria-pressed={isHardened}
                  onClick={() => setMode('after')}
                  className={`rounded-full px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E2244] ${
                    isHardened
                      ? 'bg-[#0E2244] text-[#F3EFE6]'
                      : 'text-[#5A6378] hover:text-[#0E2244]'
                  }`}
                >
                  {locale === 'es' ? 'Tras Velnea' : 'After Velnea'}
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0E2244] text-[#F3EFE6] transition-transform hover:scale-105 hover:bg-[#1D3A6E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* LOWER FOCAL STACK: Single-Line Sculptural Headline + Subtitle + Both CTAs 100% Above Fold */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: SILK_EASE }}
            className="font-sans text-[11px] font-semibold tracking-[0.3em] text-[#D6B878] uppercase"
          >
            {hero.badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.18, ease: SILK_EASE }}
            className="mx-auto mt-3 font-serif text-4xl leading-[1.02] font-normal tracking-[-0.015em] text-[#F3EFE6] sm:text-6xl lg:text-[68px]"
          >
            {leadClause}
            {italicClause && (
              <>
                {' '}
                <em className="italic text-[#D6B878]">{italicClause}</em>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: SILK_EASE }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#F3EFE6]/82 sm:text-base"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: SILK_EASE }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              type="button"
              onClick={handleDiagnosticCtaClick}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#F3EFE6] px-7 py-3.5 text-sm font-semibold text-[#0E2244] shadow-luxury-dark transition-all hover:bg-[#D6B878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              <span>{hero.primaryCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <Link
              href={demoHref}
              className="inline-flex items-center gap-2 rounded-full border border-[#F3EFE6]/35 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-[#F3EFE6] backdrop-blur-md transition-all hover:border-[#D6B878] hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              <span>{hero.secondaryCta}</span>
            </Link>
          </motion.div>

          <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 font-mono text-[10px] text-[#F3EFE6]/58">
            {hero.pipelineCard.checks.map((check) => (
              <li key={check.id} className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rotate-45 bg-[#D6B878]"
                />
                <span>{check.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Overlapping Trust Ribbon (.confianza signature transitioning into warm silk cream) */}
      <div className="relative z-20 mx-auto -mt-10 max-w-[1360px] px-5 sm:px-8 lg:px-10">
        <div className="bg-navy-pinstripe gold-shimmer-top rounded-[26px] border border-[#D6B878]/30 px-6 py-7 text-[#F3EFE6] shadow-luxury-dark sm:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="relative flex items-center gap-4 lg:pr-4"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D6B878]/45 bg-[#D6B878]/10 text-[#D6B878]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-serif text-xl font-medium text-[#F3EFE6]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#F3EFE6]/68">
                      {item.caption}
                    </p>
                  </div>
                  {idx < trustItems.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="animate-sparkle absolute top-1/2 -right-2 hidden -translate-y-1/2 text-xs text-[#D6B878] lg:inline-block"
                    >
                      ✦
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
