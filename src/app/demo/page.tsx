import type { Metadata } from 'next';
import { DemoRadiographyView } from '@/components/demo/DemoRadiographyView';
import { DEFAULT_LOCALE, dictionaries } from '@/data/i18n';

export const metadata: Metadata = {
  title: dictionaries[DEFAULT_LOCALE].meta.demoTitle,
  description: dictionaries[DEFAULT_LOCALE].meta.demoDescription,
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-cream-dotted pt-24 text-[#0E2244]">
      <DemoRadiographyView />
    </main>
  );
}
