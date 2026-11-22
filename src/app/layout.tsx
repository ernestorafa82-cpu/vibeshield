import type { Metadata } from 'next';
import { DM_Sans, IBM_Plex_Mono, Instrument_Serif } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { LocaleProvider } from '@/context/LocaleContext';
import { DEFAULT_LOCALE, dictionaries } from '@/data/i18n';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: dictionaries[DEFAULT_LOCALE].meta.homeTitle,
  description: dictionaries[DEFAULT_LOCALE].meta.homeDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${dmSans.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable}`}
    >
      <body className="paper-grain flex min-h-screen flex-col bg-[#FBF9F5] font-sans text-[#141311] antialiased selection:bg-[#C94A22]/15 selection:text-[#141311]">
        <LocaleProvider
          dictionaries={dictionaries}
          initialLocale={DEFAULT_LOCALE}
        >
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
