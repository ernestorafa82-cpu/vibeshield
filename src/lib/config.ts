import type { SiteConfig } from '@/types/vibeshield';

function sanitizeExternalUrl(rawUrl: string | undefined): string | null {
  if (!rawUrl) {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function getSiteConfig(): SiteConfig {
  const siteUrl =
    sanitizeExternalUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    'https://velnea.dev';
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'hello@velnea.dev';
  const bookingUrl = sanitizeExternalUrl(process.env.NEXT_PUBLIC_BOOKING_URL);

  return {
    brandName: 'Velnea',
    siteUrl,
    contactEmail,
    bookingUrl,
    defaultLocale: 'es',
  };
}
