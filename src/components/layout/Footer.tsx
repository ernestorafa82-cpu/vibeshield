'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { getSiteConfig } from '@/lib/config';

/**
 * Quiet editorial studio footer on warm stone paper.
 */
export function Footer() {
  const { locale, dict } = useLocale();
  const pathname = usePathname();
  const config = getSiteConfig();

  const homeHref = `/?lang=${locale}`;
  const demoHref = `/demo?lang=${locale}`;
  const calculatorHref =
    pathname === '/demo' || pathname?.startsWith('/demo/')
      ? `/?lang=${locale}#calculator`
      : '#calculator';

  return (
    <footer className="border-t border-[#141311]/12 bg-[#F3EFE6] text-[#57534C]">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-md space-y-4">
            <Link
              href={homeHref}
              className="inline-flex items-center gap-3 text-[#141311] transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              <span className="inline-block h-2.5 w-2.5 bg-[#C94A22]" aria-hidden="true" />
              <span className="font-serif text-3xl tracking-tight">
                {config.brandName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#57534C]">
              {dict.footer.tagline}
            </p>
            <p className="font-mono text-xs text-[#857F75]">
              {config.contactEmail} · {locale === 'es' ? 'Madrid / Remoto UE' : 'Madrid / EU Remote'}
            </p>
          </div>

          <nav
            aria-label={
              locale === 'es' ? 'Navegación del pie de página' : 'Footer navigation'
            }
            className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#141311]"
          >
            <Link
              href={homeHref}
              className="transition-colors hover:text-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.footer.links.home}
            </Link>
            <a
              href={calculatorHref}
              className="transition-colors hover:text-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.footer.links.calculator}
            </a>
            <Link
              href={demoHref}
              className="transition-colors hover:text-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.footer.links.demo}
            </Link>
            <a
              href={`mailto:${config.contactEmail}`}
              className="transition-colors hover:text-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.footer.links.contact}
            </a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-[#141311]/10 pt-6 font-mono text-[11px] text-[#857F75] sm:flex-row sm:items-center">
          <p>{dict.footer.noDatabaseNote}</p>
          <p>{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
