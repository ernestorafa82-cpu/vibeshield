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
      className="inline-flex items-center rounded-full border border-[#93C5FD]/30 bg-white/10 p-0.5 font-mono text-[11px]"
    >
      {LOCALE_OPTIONS.map((option) => {
        const isActive = locale === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.code)}
            className={`rounded-full px-2.5 py-1 font-medium tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] ${
              isActive
                ? 'bg-[#EEF5FF] text-[#0E2244]'
                : 'text-white/90 hover:text-white'
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
 * Floating luxury navigation bar: transparent over Hero at y=0, morphing smoothly
 * into a centered glassmorphic navy pill with crisp ice-blue accents on scroll.
 */
export function Navbar() {
  const { locale, dict, setLocale } = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isDemoPage = pathname === '/demo' || pathname?.startsWith('/demo/');
  const homeHref = `/?lang=${locale}`;
  const demoHref = `/demo?lang=${locale}`;
  const loadModulesHref = `/?modules=${DEMO_RECOMMENDED_MODULES.join(',')}&lang=${locale}#calculator`;

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const showFloatingPill = isScrolled || isDemoPage;

  return (
    <header
      className={`fixed inset-x-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        showFloatingPill ? 'top-3 px-4 sm:px-6' : 'top-0 px-0'
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showFloatingPill
            ? 'h-[66px] max-w-5xl rounded-full border border-[#93C5FD]/30 bg-[#0E2244]/88 px-5 text-white shadow-luxury-dark backdrop-blur-xl sm:px-7'
            : 'h-[82px] max-w-[1440px] bg-transparent px-5 text-white sm:px-10'
        }`}
      >
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={homeHref}
            className="group inline-flex flex-col leading-none text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            <span className="font-serif text-xl font-medium tracking-[0.22em] uppercase sm:text-2xl">
              {dict.nav.demoBreadcrumbRoot}
            </span>
            <span className="mt-0.5 font-sans text-[9px] font-semibold tracking-[0.34em] text-[#93C5FD] uppercase">
              {locale === 'es' ? 'BY VELNEA · UE' : 'BY VELNEA · EU'}
            </span>
          </Link>

          {isDemoPage && (
            <div
              aria-label={ariaBreadcrumb}
              className="hidden items-center gap-2 border-l border-white/20 pl-4 font-mono text-xs text-white/70 sm:flex"
            >
              <span>{dict.nav.demoBreadcrumbSection}</span>
              <span aria-hidden="true" className="text-[#93C5FD]/60">
                /
              </span>
              <span className="font-medium text-[#DBEAFE]">
                {dict.nav.demoCaseName}
              </span>
            </div>
          )}
        </div>

        {!isDemoPage && (
          <nav
            aria-label={ariaPrimaryNav}
            className="hidden items-center gap-2 text-[12px] font-medium tracking-[0.15em] uppercase md:flex"
          >
            <a
              href="#how-it-works"
              className="rounded-full px-3.5 py-2 text-white/88 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href="#calculator"
              className="rounded-full px-3.5 py-2 text-white/88 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {dict.nav.calculator}
            </a>
            <Link
              href={demoHref}
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-white/88 transition-colors hover:bg-white/10 hover:text-[#DBEAFE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <span>{dict.nav.demoXray}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
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
              className="inline-flex items-center rounded-full bg-[#EEF5FF] px-4 py-2 text-xs font-semibold text-[#0E2244] transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] sm:px-5"
            >
              {dict.nav.loadModulesCta}
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDiagnosticClick}
                className="hidden items-center rounded-full bg-[#EEF5FF] px-5 py-2 text-xs font-semibold text-[#0E2244] transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] md:inline-flex"
              >
                {dict.nav.diagnosticCta}
              </button>

              <button
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-menu"
                aria-label={ariaMenuToggle}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#93C5FD]/35 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD] md:hidden"
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
          className="mx-auto mt-2 max-w-5xl rounded-3xl border border-[#93C5FD]/25 bg-[#0E2244]/95 px-6 py-5 text-white shadow-2xl backdrop-blur-xl md:hidden"
        >
          <nav aria-label={ariaMobileNav} className="flex flex-col gap-3 text-sm">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full px-3 py-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full px-3 py-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {dict.nav.calculator}
            </a>
            <Link
              href={demoHref}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full px-3 py-2 text-white/85 transition-colors hover:bg-white/10 hover:text-[#DBEAFE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {dict.nav.demoXray}
            </Link>
            <button
              type="button"
              onClick={handleDiagnosticClick}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#EEF5FF] px-4 py-2.5 text-sm font-semibold text-[#0E2244] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {dict.nav.diagnosticCta}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
