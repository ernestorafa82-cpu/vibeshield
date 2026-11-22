'use client';

import React, {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import {
  LOCALE_STORAGE_KEY,
  type Currency,
  type Dictionary,
  type Locale,
} from '@/types/vibeshield';

export interface LocaleContextValue {
  locale: Locale;
  currency: Currency;
  dict: Dictionary;
  setLocale: (next: Locale) => void;
}

export interface LocaleProviderProps {
  dictionaries: Record<Locale, Dictionary>;
  initialLocale?: Locale;
  children: React.ReactNode;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function parseLocale(value: string | null | undefined): Locale | null {
  if (value === 'es' || value === 'en') {
    return value;
  }
  return null;
}

function safeGetStoredLocale(): Locale | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return parseLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
}

function safeSetStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage errors in private browsing or restricted contexts
  }
}

function updateUrlLocaleParam(locale: Locale): void {
  if (
    typeof window === 'undefined' ||
    typeof window.history?.replaceState !== 'function'
  ) {
    return;
  }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', locale);
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );
  } catch {
    // Ignore history API errors in restricted environments
  }
}

interface LocaleUrlSyncProps {
  fallbackLocale: Locale;
  onResolve: (locale: Locale) => void;
}

function LocaleUrlSync({ fallbackLocale, onResolve }: LocaleUrlSyncProps) {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');

  useEffect(() => {
    const urlLocale = parseLocale(langParam);
    if (urlLocale) {
      onResolve(urlLocale);
      return;
    }

    const storedLocale = safeGetStoredLocale();
    if (storedLocale) {
      onResolve(storedLocale);
      return;
    }

    onResolve(fallbackLocale);
  }, [langParam, fallbackLocale, onResolve]);

  return null;
}

/**
 * Provides active locale, derived currency, and localized dictionary.
 */
export function LocaleProvider({
  dictionaries,
  initialLocale,
  children,
}: LocaleProviderProps) {
  const fallbackLocale = parseLocale(initialLocale) ?? 'es';
  const [locale, setLocaleState] = useState<Locale>(fallbackLocale);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const handleResolve = useCallback((resolved: Locale) => {
    setLocaleState(resolved);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    safeSetStoredLocale(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
    updateUrlLocaleParam(next);
  }, []);

  const currency: Currency = locale === 'es' ? 'EUR' : 'USD';
  const dict = dictionaries[locale];

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      currency,
      dict,
      setLocale,
    }),
    [locale, currency, dict, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      <Suspense fallback={null}>
        <LocaleUrlSync
          fallbackLocale={fallbackLocale}
          onResolve={handleResolve}
        />
      </Suspense>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Reads the current locale context. Must be called inside LocaleProvider.
 */
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
