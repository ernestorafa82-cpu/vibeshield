'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { DEMO_RECOMMENDED_MODULES } from '@/data/modules';
import { triggerDiagnosticSelection } from '@/lib/diagnostic-trigger';
import type { Locale } from '@/types/vibeshield';

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
      className="inline-flex items-center border border-[#141311]/15 bg-[#F3EFE6]/70 p-0.5 font-mono text-[11px]"
    >
      {LOCALE_OPTIONS.map((option) => {
        const isActive = locale === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.code)}
            className={`px-2.5 py-1 font-medium tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] ${
              isActive
                ? 'bg-[#141311] text-[#FBF9F5]'
                : 'text-[#57534C] hover:text-[#141311]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function VelneaMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="1" y="1" width="18" height="18" stroke="#141311" strokeWidth="1.25" />
      <path d="M5 5.5L10 14.5L15 5.5" stroke="#141311" strokeWidth="1.5" />
      <rect x="8.5" y="4.5" width="3" height="3" fill="#C94A22" />
    </svg>
  );
}

/**
 * Floating editorial navigation bar adapting between the landing page and /demo dossier view.
 */
export function Navbar() {
  const { locale, dict, setLocale } = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDemoPage = pathname === '/demo' || pathname?.startsWith('/demo/');
  const homeHref = `/?lang=${locale}`;
  const demoHref = `/demo?lang=${locale}`;
  const loadModulesHref = `/?modules=${DEMO_RECOMMENDED_MODULES.join(',')}&lang=${locale}#calculator`;

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleDiagnosticClick = () => {
    setMobileMenuOpen(false);
    triggerDiagnosticSelection();
  };

  const ariaBreadcrumb = locale === 'es' ? 'Ruta de navegación' : 'Breadcrumb';
  const ariaPrimaryNav =
    locale === 'es' ? 'Navegación principal' : 'Primary navigation';
  const ariaMobileNav = locale === 'es' ? 'Menú móvil' : 'Mobile navigation';
  const ariaMenuToggle = mobileMenuOpen
    ? locale === 'es'
      ? 'Cerrar menú'
      : 'Close menu'
    : locale === 'es'
      ? 'Abrir menú'
      : 'Open menu';

  return (
    <header className="sticky top-0 z-40 border-b border-[#141311]/10 bg-[#FBF9F5]/88 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={homeHref}
            className="group inline-flex items-center gap-3 text-[#141311] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
          >
            <VelneaMark />
            <span className="text-sm font-semibold tracking-[0.24em] uppercase">
              {dict.nav.demoBreadcrumbRoot}
            </span>
          </Link>

          {isDemoPage ? (
            <div
              aria-label={ariaBreadcrumb}
              className="hidden items-center gap-2 border-l border-[#141311]/15 pl-4 font-mono text-xs text-[#57534C] sm:flex"
            >
              <span>{dict.nav.demoBreadcrumbSection}</span>
              <span aria-hidden="true" className="text-[#141311]/30">
                /
              </span>
              <span className="font-medium text-[#141311]">
                {dict.nav.demoCaseName}
              </span>
            </div>
          ) : (
            <span className="hidden border-l border-[#141311]/15 pl-4 font-mono text-[11px] tracking-[0.14em] text-[#857F75] uppercase lg:inline-block">
              {locale === 'es' ? 'Auditoría & Rescate' : 'Audit & Rescue'}
            </span>
          )}
        </div>

        {!isDemoPage && (
          <nav
            aria-label={ariaPrimaryNav}
            className="hidden items-center gap-9 text-sm text-[#57534C] md:flex"
          >
            <a
              href="#how-it-works"
              className="transition-colors hover:text-[#141311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href="#calculator"
              className="transition-colors hover:text-[#141311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.nav.calculator}
            </a>
            <Link
              href={demoHref}
              className="inline-flex items-center gap-1 transition-colors hover:text-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              <span>{dict.nav.demoXray}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <LocaleSwitcher
            locale={locale}
            label={dict.nav.switchLanguageLabel}
            onSelect={setLocale}
          />

          {isDemoPage ? (
            <Link
              href={loadModulesHref}
              className="inline-flex items-center bg-[#141311] px-4 py-2 font-mono text-xs tracking-wide text-[#FBF9F5] transition-colors hover:bg-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.nav.loadModulesCta}
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDiagnosticClick}
                className="hidden items-center bg-[#141311] px-4 py-2 font-mono text-xs tracking-wide text-[#FBF9F5] transition-colors hover:bg-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] md:inline-flex"
              >
                {dict.nav.diagnosticCta}
              </button>

              <button
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-menu"
                aria-label={ariaMenuToggle}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center border border-[#141311]/15 bg-[#F3EFE6] text-[#141311] transition-colors hover:border-[#141311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] md:hidden"
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
          className="border-t border-[#141311]/10 bg-[#FBF9F5] px-5 py-5 md:hidden"
        >
          <nav aria-label={ariaMobileNav} className="flex flex-col gap-3 text-sm">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-[#57534C] transition-colors hover:text-[#141311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-[#57534C] transition-colors hover:text-[#141311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.nav.calculator}
            </a>
            <Link
              href={demoHref}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-[#57534C] transition-colors hover:text-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.nav.demoXray}
            </Link>
            <button
              type="button"
              onClick={handleDiagnosticClick}
              className="mt-2 inline-flex w-full items-center justify-center bg-[#141311] px-4 py-2.5 font-mono text-xs tracking-wide text-[#FBF9F5] transition-colors hover:bg-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              {dict.nav.diagnosticCta}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
