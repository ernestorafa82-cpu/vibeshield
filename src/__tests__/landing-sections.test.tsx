import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GuaranteesFaqSection } from '@/components/landing/GuaranteesFaqSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { JourneySection } from '@/components/landing/JourneySection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionSection';
import { LocaleProvider } from '@/context/LocaleContext';
import { dictionaries } from '@/data/i18n';
import { DIAGNOSTIC_CTA_EVENT, type Locale } from '@/types/vibeshield';

const mockUseSearchParams = vi.fn<() => URLSearchParams>();

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

function renderWithLocale(ui: React.ReactElement, locale: Locale = 'es') {
  return render(
    <LocaleProvider dictionaries={dictionaries} initialLocale={locale}>
      {ui}
    </LocaleProvider>,
  );
}

describe('Landing sections', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it('HeroSection renders badge, title, Shield CI Pipeline card, /demo?lang=es link, and dispatches DIAGNOSTIC_CTA_EVENT on primary CTA click', () => {
    const calcTarget = document.createElement('section');
    calcTarget.id = 'calculator';
    const scrollIntoViewMock = vi.fn();
    calcTarget.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(calcTarget);

    const eventListener = vi.fn();
    window.addEventListener(DIAGNOSTIC_CTA_EVENT, eventListener);

    try {
      renderWithLocale(<HeroSection />, 'es');
      const es = dictionaries.es.hero;

      expect(screen.getByText(es.badge)).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 1, name: es.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(es.subtitle)).toBeInTheDocument();

      expect(screen.getByText(es.pipelineCard.title)).toBeInTheDocument();
      expect(screen.getByText(es.pipelineCard.statusLabel)).toBeInTheDocument();
      for (const check of es.pipelineCard.checks) {
        expect(screen.getByText(check.label)).toBeInTheDocument();
      }

      // Interactive before/after hero hotspot toggle
      fireEvent.click(screen.getByRole('button', { name: 'Prototipo IA' }));
      expect(screen.getByText('EXPUESTO')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Tras Velnea' }));
      expect(screen.getByText(es.pipelineCard.statusLabel)).toBeInTheDocument();

      const demoLink = screen.getByRole('link', { name: es.secondaryCta });
      expect(demoLink).toHaveAttribute('href', '/demo?lang=es');

      const primaryButton = screen.getByRole('button', { name: es.primaryCta });
      fireEvent.click(primaryButton);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    } finally {
      window.removeEventListener(DIAGNOSTIC_CTA_EVENT, eventListener);
      calcTarget.remove();
    }
  });

  it('ProblemSolutionSection exposes id="how-it-works" and renders the 67% wall plus the Anti-Vibe Shield pillars', () => {
    const { container } = renderWithLocale(<ProblemSolutionSection />, 'es');
    const es = dictionaries.es.problemSolution;

    const section = container.querySelector('section#how-it-works');
    expect(section).not.toBeNull();

    expect(
      screen.getByRole('heading', { name: es.sectionTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText(es.problem.title)).toBeInTheDocument();
    expect(screen.getByText(es.problem.statHighlight)).toBeInTheDocument();
    for (const bullet of es.problem.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }

    expect(screen.getByText(es.solution.title)).toBeInTheDocument();
    for (const pillar of es.solution.pillars) {
      expect(screen.getByText(pillar.title)).toBeInTheDocument();
      expect(screen.getByText(pillar.detail)).toBeInTheDocument();
    }
  });

  it('JourneySection renders the 3 steps (01, 02, 03) with pricing, duration, and highlights', () => {
    renderWithLocale(<JourneySection />, 'es');
    const es = dictionaries.es.journey;

    expect(
      screen.getByRole('heading', { name: es.sectionTitle }),
    ).toBeInTheDocument();

    for (const step of es.steps) {
      expect(screen.getByText(step.stepNumber)).toBeInTheDocument();
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.priceRange)).toBeInTheDocument();
      expect(screen.getByText(step.duration)).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
      if (step.highlight) {
        expect(screen.getByText(step.highlight)).toBeInTheDocument();
      }
    }
  });

  it('GuaranteesFaqSection renders the 3 guarantees and toggles FAQ accordion aria-expanded and panel visibility', () => {
    renderWithLocale(<GuaranteesFaqSection />, 'es');
    const es = dictionaries.es.guaranteesFaq;

    expect(
      screen.getByRole('heading', { name: es.guaranteesTitle }),
    ).toBeInTheDocument();
    for (const guarantee of es.guarantees) {
      expect(screen.getByText(guarantee.title)).toBeInTheDocument();
      expect(screen.getByText(guarantee.description)).toBeInTheDocument();
    }

    expect(
      screen.getByRole('heading', { name: es.faqTitle }),
    ).toBeInTheDocument();

    const firstFaq = es.faqs[0];
    const secondFaq = es.faqs[1];

    const firstTrigger = screen.getByRole('button', {
      name: firstFaq.question,
    });
    const firstPanelId = firstTrigger.getAttribute('aria-controls');
    expect(firstPanelId).toBe(`faq-panel-${firstFaq.id}`);
    const firstPanel = document.getElementById(firstPanelId!);
    expect(firstPanel).not.toBeNull();
    expect(firstPanel).toHaveAttribute('role', 'region');
    expect(firstPanel).toHaveAttribute('aria-labelledby', firstTrigger.id);

    expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(firstPanel).toBeVisible();

    fireEvent.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(firstPanel).not.toBeVisible();

    fireEvent.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(firstPanel).toBeVisible();

    const secondTrigger = screen.getByRole('button', {
      name: secondFaq.question,
    });
    const secondPanel = document.getElementById(
      secondTrigger.getAttribute('aria-controls')!,
    );
    expect(secondPanel).not.toBeNull();

    expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(secondPanel).not.toBeVisible();

    fireEvent.click(secondTrigger);
    expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(secondPanel).toBeVisible();

    fireEvent.click(secondTrigger);
    expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(secondPanel).not.toBeVisible();
  });

  it('renders English copy across all landing sections when initialLocale="en"', () => {
    renderWithLocale(
      <>
        <HeroSection />
        <ProblemSolutionSection />
        <JourneySection />
        <GuaranteesFaqSection />
      </>,
      'en',
    );
    const en = dictionaries.en;

    expect(
      screen.getByRole('heading', { level: 1, name: en.hero.title }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: en.hero.secondaryCta })[0],
    ).toHaveAttribute('href', '/demo?lang=en');

    expect(screen.getByText(en.problemSolution.problem.title)).toBeInTheDocument();
    expect(screen.getByText(en.problemSolution.solution.title)).toBeInTheDocument();

    expect(screen.getByText(en.journey.steps[0].title)).toBeInTheDocument();
    expect(screen.getByText(en.journey.steps[1].priceRange)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: en.guaranteesFaq.guaranteesTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: en.guaranteesFaq.faqs[0].question }),
    ).toBeInTheDocument();
  });
});
