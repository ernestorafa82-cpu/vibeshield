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
  isLightSurface: boolean;
}

function LocaleSwitcher({
  locale,
  label,
  onSelect,
  isLightSurface,
}: LocaleSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex items-center rounded-full border p-0.5 font-mono text-[11px] transition-colors ${
        isLightSurface
          ? 'border-[#0E2244]/18 bg-white/80'
          : 'border-[#D6B878]/30 bg-white/8'
      }`}
    >
      {LOCALE_OPTIONS.map((option) => {
        const isActive = locale === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.code)}
            className={`rounded-full px-2.5 py-1 font-medium tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] ${
              isActive
                ? isLightSurface
                  ? 'bg-[#0E2244] text-[#F3EFE6]'
                  : 'bg-[#D6B878] text-[#0E2244]'
                : isLightSurface
                  ? 'text-[#5A6378] hover:text-[#0E2244]'
                  : 'text-[#F3EFE6]/75 hover:text-[#F3EFE6]'
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
 * Luxury floating header inspired by biologique.es:
 * Transparent overlay over the dark Hero at y=0, morphing smoothly into a
 * centered glassmorphic Parisian-navy pill with champagne-gold hairline on scroll.
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

  // On /demo at top (light cream surface), use refined floating navy pill immediately
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
            ? 'h-[66px] max-w-5xl rounded-full border border-[#D6B878]/35 bg-[#0E2244]/88 px-5 text-[#F3EFE6] shadow-luxury-dark backdrop-blur-xl sm:px-7'
            : 'h-[82px] max-w-[1440px] bg-transparent px-5 text-[#F3EFE6] sm:px-10'
        }`}
      >
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={homeHref}
            className="group inline-flex flex-col leading-none text-[#F3EFE6] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
          >
            <span className="font-serif text-xl font-medium tracking-[0.22em] uppercase sm:text-2xl">
              {dict.nav.demoBreadcrumbRoot}
            </span>
            <span className="mt-0.5 font-sans text-[9px] font-semibold tracking-[0.34em] text-[#D6B878] uppercase">
              {locale === 'es' ? 'INGENIERÍA · UE' : 'ENGINEERING · EU'}
            </span>
          </Link>

          {isDemoPage && (
            <div
              aria-label={ariaBreadcrumb}
              className="hidden items-center gap-2 border-l border-[#D6B878]/25 pl-4 font-mono text-xs text-[#F3EFE6]/70 sm:flex"
            >
              <span>{dict.nav.demoBreadcrumbSection}</span>
              <span aria-hidden="true" className="text-[#D6B878]/50">
                /
              </span>
              <span className="font-medium text-[#D6B878]">
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
              className="rounded-full px-3.5 py-2 text-[#F3EFE6]/88 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href="#calculator"
              className="rounded-full px-3.5 py-2 text-[#F3EFE6]/88 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              {dict.nav.calculator}
            </a>
            <Link
              href={demoHref}
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[#F3EFE6]/88 transition-colors hover:bg-white/10 hover:text-[#D6B878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
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
            isLightSurface={false}
          />

          {isDemoPage ? (
            <Link
              href={loadModulesHref}
              className="inline-flex items-center rounded-full bg-[#D6B878] px-4 py-2 text-xs font-semibold text-[#0E2244] transition-all hover:bg-[#E4CB93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] sm:px-5"
            >
              {dict.nav.loadModulesCta}
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDiagnosticClick}
                className="hidden items-center rounded-full bg-[#D6B878] px-5 py-2 text-xs font-semibold text-[#0E2244] transition-all hover:bg-[#E4CB93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] md:inline-flex"
              >
                {dict.nav.diagnosticCta}
              </button>

              <button
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-menu"
                aria-label={ariaMenuToggle}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D6B878]/35 bg-white/10 text-[#F3EFE6] transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] md:hidden"
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
          className="mx-auto mt-2 max-w-5xl rounded-3xl border border-[#D6B878]/30 bg-[#0E2244]/95 px-6 py-5 text-[#F3EFE6] shadow-2xl backdrop-blur-xl md:hidden"
        >
          <nav aria-label={ariaMobileNav} className="flex flex-col gap-3 text-sm">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full px-3 py-2 text-[#F3EFE6]/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full px-3 py-2 text-[#F3EFE6]/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              {dict.nav.calculator}
            </a>
            <Link
              href={demoHref}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full px-3 py-2 text-[#F3EFE6]/85 transition-colors hover:bg-white/10 hover:text-[#D6B878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              {dict.nav.demoXray}
            </Link>
            <button
              type="button"
              onClick={handleDiagnosticClick}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#D6B878] px-4 py-2.5 text-sm font-semibold text-[#0E2244] transition-colors hover:bg-[#E4CB93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              {dict.nav.diagnosticCta}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
