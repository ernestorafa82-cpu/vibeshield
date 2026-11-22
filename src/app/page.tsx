import { GuaranteesFaqSection } from '@/components/landing/GuaranteesFaqSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { JourneySection } from '@/components/landing/JourneySection';
import { ModularCalculator } from '@/components/landing/ModularCalculator';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionSection';

export default function HomePage() {
  return (
    <main className="bg-[#09090B] text-zinc-100">
      <HeroSection />
      <ProblemSolutionSection />
      <JourneySection />
      <ModularCalculator />
      <GuaranteesFaqSection />
    </main>
  );
}
