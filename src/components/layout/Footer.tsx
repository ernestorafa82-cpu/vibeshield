'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { getSiteConfig } from '@/lib/config';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

/**
 * Clean Parisian-navy footer with frosted ice-blue CTA strip and zero decorative stars.
 */
export function Footer() {
  const { locale, dict } = useLocale();
  const pathname = usePathname();
  const config = getSiteConfig();

  const homeHref = `/?lang=${locale}`;
  const demoHref = `/demo?lang=${locale}`;
  const isDemoPage = pathname === '/demo' || pathname?.startsWith('/demo/');
  const calculatorHref = isDemoPage
    ? `/?lang=${locale}#calculator`
    : '#calculator';

  return (
    <footer className="bg-navy-pinstripe ice-shimmer-top text-white">
      <div className="mx-auto max-w-[1440px] px-5 pt-14 pb-12 sm:px-8 lg:px-10">
        {/* Top Floating CTA Banner */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-[#93C5FD]/25 bg-white/[0.05] px-7 py-7 backdrop-blur-md sm:px-9 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#93C5FD] uppercase">
              {locale === 'es' ? 'PRÓXIMO PASO' : 'NEXT STEP'}
            </p>
            <p className="font-serif text-2xl leading-snug text-white sm:text-3xl">
              {locale === 'es' ? (
                <>
                  Diagnóstico técnico en{' '}
                  <em className="italic text-[#BFDBFE]">48 horas</em>, 100 %
                  descontable en tu rescate.
                </>
              ) : (
                <>
                  Technical diagnostic in{' '}
                  <em className="italic text-[#BFDBFE]">48 hours</em>, 100%
                  credited toward your rescue.
                </>
              )}
            </p>
          </div>

          {isDemoPage ? (
            <Link
              href={calculatorHref}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#EEF5FF] px-6 py-3.5 text-sm font-semibold text-[#0E2244] transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <span>{dict.nav.diagnosticCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={triggerDiagnosticSelection}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#EEF5FF] px-6 py-3.5 text-sm font-semibold text-[#0E2244] transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <span>{dict.nav.diagnosticCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Clean Footer Columns */}
        <div className="grid gap-10 pb-12 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <Link
              href={homeHref}
              className="inline-flex flex-col leading-none text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <span className="font-serif text-3xl font-medium tracking-[0.18em] uppercase">
                {config.brandName}
              </span>
              <span className="mt-1 font-sans text-[10px] font-semibold tracking-[0.34em] text-[#93C5FD] uppercase">
                {locale === 'es' ? 'AUDITORÍA & RESCATE' : 'AUDIT & RESCUE'}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              {dict.footer.tagline}
            </p>
          </div>

          <nav
            aria-label={
              locale === 'es' ? 'Navegación del pie de página' : 'Footer navigation'
            }
            className="grid gap-8 sm:grid-cols-2 md:col-span-7"
          >
            <div>
              <p className="font-sans text-[11px] font-semibold tracking-[0.26em] text-[#93C5FD] uppercase">
                {locale === 'es' ? 'NAVEGACIÓN' : 'NAVIGATION'}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { label: dict.footer.links.home, href: homeHref, isRoute: true },
                  { label: dict.footer.links.calculator, href: calculatorHref, isRoute: false },
                  { label: dict.footer.links.demo, href: demoHref, isRoute: true },
                ].map((item) => (
                  <li key={item.label}>
                    {item.isRoute ? (
                      <Link
                        href={item.href}
                        className="text-white/78 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-white/78 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[11px] font-semibold tracking-[0.26em] text-[#93C5FD] uppercase">
                {dict.footer.links.contact}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/78">
                <li>
                  <a
                    href={`mailto:${config.contactEmail}`}
                    aria-label={dict.footer.links.contact}
                    className="underline-offset-4 transition-colors hover:text-[#DBEAFE] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
                  >
                    {config.contactEmail}
                  </a>
                </li>
                <li className="text-xs text-white/55">
                  {locale === 'es'
                    ? 'Madrid · Remoto Unión Europea & Global'
                    : 'Madrid · EU Remote & Worldwide'}
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-white/12 pt-6 text-xs text-white/55 sm:flex-row sm:items-center">
          <p>{dict.footer.noDatabaseNote}</p>
          <p>{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
