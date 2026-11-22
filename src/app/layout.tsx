import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { LocaleProvider } from '@/context/LocaleContext';
import { DEFAULT_LOCALE, dictionaries } from '@/data/i18n';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
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
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[#09090B] font-sans text-zinc-100 antialiased">
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
