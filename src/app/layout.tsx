import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeShield — De prototipo IA a producción blindada',
  description:
    'Rescatamos y blindamos apps creadas con Lovable, Bolt y Cursor en 7–10 días con seguridad real, tests anti-regresión y precios públicos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#09090B] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
