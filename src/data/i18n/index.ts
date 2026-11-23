import { enDictionary } from '@/data/i18n/en';
import { esDictionary } from '@/data/i18n/es';
import type { Dictionary, Locale } from '@/types/vibeshield';

export const DEFAULT_LOCALE: Locale = 'es';

export const dictionaries: Record<Locale, Dictionary> = {
  es: esDictionary,
  en: enDictionary,
};

export function isValidLocale(
  value: string | null | undefined,
): value is Locale {
  return value === 'es' || value === 'en';
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}
