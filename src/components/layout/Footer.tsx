'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { getSiteConfig } from '@/lib/config';

/**
 * Site footer with brand mark, quick navigation links, and privacy note.
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
    <footer className="border-t border-zinc-800/80 bg-[#09090B] text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm space-y-3">
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2.5 text-zinc-100 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="font-semibold tracking-tight">
                {config.brandName}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              {dict.footer.tagline}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
          >
            <Link
              href={homeHref}
              className="transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {dict.footer.links.home}
            </Link>
            <a
              href={calculatorHref}
              className="transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {dict.footer.links.calculator}
            </a>
            <Link
              href={demoHref}
              className="transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {dict.footer.links.demo}
            </Link>
            <a
              href={`mailto:${config.contactEmail}`}
              className="transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {dict.footer.links.contact}
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>{dict.footer.noDatabaseNote}</p>
          <p>{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
