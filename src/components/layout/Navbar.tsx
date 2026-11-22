'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Shield, X } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { DEMO_RECOMMENDED_MODULES } from '@/data/modules';
import { DIAGNOSTIC_CTA_EVENT, type Locale } from '@/types/vibeshield';

const LOCALE_OPTIONS: readonly { readonly code: Locale; readonly label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
];

interface LocaleSwitcherProps {
  locale: Locale;
  label: string;
  onSelect: (next: Locale) => void;
}

function LocaleSwitcher({ locale, label, onSelect }: LocaleSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5"
    >
      {LOCALE_OPTIONS.map((option) => {
        const isActive = locale === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.code)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Sticky top navigation bar adapting between the landing page and /demo X-Ray view.
 */
export function Navbar() {
  const { locale, dict, setLocale } = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDemoPage = pathname === '/demo' || pathname?.startsWith('/demo/');
  const homeHref = `/?lang=${locale}`;
  const demoHref = `/demo?lang=${locale}`;
  const loadModulesHref = `/?modules=${DEMO_RECOMMENDED_MODULES.join(',')}&lang=${locale}#calculator`;

  const handleDiagnosticClick = () => {
    setMobileMenuOpen(false);
    const calculatorEl = document.getElementById('calculator');
    if (calculatorEl && typeof calculatorEl.scrollIntoView === 'function') {
      calculatorEl.scrollIntoView({ behavior: 'smooth' });
    }
    window.dispatchEvent(new CustomEvent(DIAGNOSTIC_CTA_EVENT));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#09090B]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={homeHref}
            className="group inline-flex items-center gap-2.5 text-zinc-100 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.28)] transition-shadow group-hover:shadow-[0_0_20px_rgba(16,185,129,0.45)]">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-semibold tracking-tight text-zinc-100">
              VibeShield
            </span>
          </Link>

          {isDemoPage && (
            <div
              aria-label="Breadcrumb"
              className="hidden items-center gap-2 text-sm text-zinc-400 sm:flex"
            >
              <span aria-hidden="true" className="text-zinc-600">
                /
              </span>
              <span className="font-mono text-xs text-zinc-400">
                {dict.nav.demoBreadcrumbSection}
              </span>
              <span aria-hidden="true" className="text-zinc-600">
                /
              </span>
              <span className="font-mono text-xs font-medium text-emerald-300">
                {dict.nav.demoCaseName}
              </span>
            </div>
          )}
        </div>

        {!isDemoPage && (
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 text-sm font-medium text-zinc-300 md:flex"
          >
            <a
              href="#how-it-works"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href="#calculator"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {dict.nav.calculator}
            </a>
            <Link
              href={demoHref}
              className="transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {dict.nav.demoXray}
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2.5 sm:gap-3">
          <LocaleSwitcher
            locale={locale}
            label={dict.nav.switchLanguageLabel}
            onSelect={setLocale}
          />

          {isDemoPage ? (
            <Link
              href={loadModulesHref}
              className="inline-flex items-center rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:text-sm"
            >
              {dict.nav.loadModulesCta}
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDiagnosticClick}
                className="hidden items-center rounded-lg bg-emerald-500 px-3.5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 md:inline-flex"
              >
                {dict.nav.diagnosticCta}
              </button>

              <button
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {!isDemoPage && mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-zinc-800/80 bg-[#09090B] px-4 py-4 md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-3 text-sm">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-2 py-1.5 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-2 py-1.5 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              {dict.nav.calculator}
            </a>
            <Link
              href={demoHref}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-2 py-1.5 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-emerald-300"
            >
              {dict.nav.demoXray}
            </Link>
            <button
              type="button"
              onClick={handleDiagnosticClick}
              className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3.5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              {dict.nav.diagnosticCta}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
