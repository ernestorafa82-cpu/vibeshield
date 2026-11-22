'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { getSiteConfig } from '@/lib/config';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';

/**
 * Luxury Parisian-navy pinstripe footer with floating gold-trimmed CTA banner
 * and rotating gold-diamond hover markers inspired by biologique.es.
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
    <footer className="bg-navy-pinstripe gold-shimmer-top text-[#F3EFE6]">
      <div className="mx-auto max-w-[1440px] px-5 pt-14 pb-12 sm:px-8 lg:px-10">
        {/* Top Floating CTA Strip (.aviso signature) */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 rounded-[26px] border border-[#D6B878]/30 bg-white/[0.04] px-6 py-6 backdrop-blur-md sm:px-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D6B878]/45 bg-[#0E2244] text-[#D6B878]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D6B878]/45 bg-[#1D3A6E] text-[#D6B878]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="font-serif text-xl leading-snug text-[#F3EFE6] sm:text-2xl">
              {locale === 'es' ? (
                <>
                  Diagnóstico técnico en{' '}
                  <em className="text-[#D6B878]">48 horas</em> ✦ 100 % descontable
                  en tu <em className="text-[#D6B878]">rescate modular</em>.
                </>
              ) : (
                <>
                  Technical diagnostic in{' '}
                  <em className="text-[#D6B878]">48 hours</em> ✦ 100% credited
                  toward your <em className="text-[#D6B878]">modular rescue</em>.
                </>
              )}
            </p>
          </div>

          {isDemoPage ? (
            <Link
              href={calculatorHref}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#D6B878] px-6 py-3 text-sm font-semibold text-[#0E2244] transition-all hover:bg-[#E4CB93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              <span>{dict.nav.diagnosticCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={triggerDiagnosticSelection}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#D6B878] px-6 py-3 text-sm font-semibold text-[#0E2244] transition-all hover:bg-[#E4CB93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              <span>{dict.nav.diagnosticCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Editorial 4-Column Footer Layout */}
        <div className="grid gap-10 pb-12 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <Link
              href={homeHref}
              className="inline-flex flex-col leading-none text-[#F3EFE6] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              <span className="font-serif text-3xl font-medium tracking-[0.18em] uppercase">
                {config.brandName}
              </span>
              <span className="mt-1 font-sans text-[10px] font-semibold tracking-[0.34em] text-[#D6B878] uppercase">
                {locale === 'es' ? 'AUDITORÍA & RESCATE' : 'AUDIT & RESCUE'}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#F3EFE6]/72">
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
              <p className="font-sans text-[11px] font-semibold tracking-[0.3em] text-[#D6B878] uppercase">
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
                        className="group inline-flex items-center gap-2.5 text-[#F3EFE6]/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block h-1.5 w-1.5 rotate-45 scale-0 bg-[#D6B878] transition-transform duration-300 group-hover:scale-100"
                        />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="group inline-flex items-center gap-2.5 text-[#F3EFE6]/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block h-1.5 w-1.5 rotate-45 scale-0 bg-[#D6B878] transition-transform duration-300 group-hover:scale-100"
                        />
                        <span>{item.label}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[11px] font-semibold tracking-[0.3em] text-[#D6B878] uppercase">
                {dict.footer.links.contact}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#F3EFE6]/78">
                <li>
                  <a
                    href={`mailto:${config.contactEmail}`}
                    aria-label={dict.footer.links.contact}
                    className="group inline-flex items-center gap-2.5 transition-colors hover:text-[#D6B878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 rotate-45 scale-0 bg-[#D6B878] transition-transform duration-300 group-hover:scale-100"
                    />
                    <span>{config.contactEmail}</span>
                  </a>
                </li>
                <li className="text-xs text-[#F3EFE6]/60">
                  {locale === 'es'
                    ? 'Madrid · Remoto Unión Europea & Global'
                    : 'Madrid · EU Remote & Worldwide'}
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-[#D6B878]/20 pt-6 text-xs text-[#F3EFE6]/55 sm:flex-row sm:items-center">
          <p>{dict.footer.noDatabaseNote}</p>
          <p>{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
