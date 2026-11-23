import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { LocaleProvider, useLocale } from '@/context/LocaleContext';
import { getSiteConfig } from '@/lib/config';
import {
  DIAGNOSTIC_CTA_EVENT,
  LOCALE_STORAGE_KEY,
  type Dictionary,
  type Locale,
} from '@/types/vibeshield';

const mockUsePathname = vi.fn<() => string>();
const mockUseSearchParams = vi.fn<() => URLSearchParams>();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

function createMockDictionary(locale: Locale): Dictionary {
  const isEs = locale === 'es';
  const moduleStub = {
    title: isEs ? 'Módulo' : 'Module',
    description: isEs ? 'Descripción' : 'Description',
    deliverables: ['Item'],
  };

  return {
    meta: {
      homeTitle: 'VibeShield',
      homeDescription: 'Rescue engineering',
      demoTitle: 'VibeShield Demo',
      demoDescription: 'Demo',
    },
    nav: {
      howItWorks: isEs ? 'Cómo funciona' : 'How it works',
      calculator: isEs ? 'Calculadora' : 'Calculator',
      demoXray: isEs ? 'Demo X-Ray' : 'Demo X-Ray',
      diagnosticCta: isEs ? 'Diagnóstico 48h' : '48h Diagnostic',
      demoBreadcrumbRoot: 'VibeShield',
      demoBreadcrumbSection: 'demo',
      demoCaseName: 'PulseCRM',
      loadModulesCta: isEs
        ? 'Cargar módulos recomendados'
        : 'Load recommended modules',
      switchLanguageLabel: isEs ? 'Cambiar idioma' : 'Switch language',
    },
    hero: {
      badge: 'VibeShield',
      title: 'Title',
      subtitle: 'Subtitle',
      primaryCta: 'Primary',
      secondaryCta: 'Secondary',
      pipelineCard: {
        title: 'Pipeline',
        branch: 'main',
        statusLabel: 'Passing',
        checks: [{ id: 'c1', label: 'Check', detail: 'OK' }],
      },
    },
    problemSolution: {
      sectionTitle: 'Problem',
      sectionSubtitle: 'Subtitle',
      problem: {
        badge: 'Risk',
        title: 'Problem title',
        statHighlight: '80%',
        description: 'Desc',
        bullets: ['Bullet'],
      },
      solution: {
        badge: 'Fix',
        title: 'Solution title',
        description: 'Desc',
        pillars: [{ key: 'p1', title: 'Pillar', detail: 'Detail' }],
      },
    },
    journey: {
      sectionTitle: 'Journey',
      sectionSubtitle: 'Steps',
      steps: [
        {
          stepNumber: '01',
          title: 'Step 1',
          priceRange: '590',
          duration: '48h',
          description: 'Desc',
        },
      ],
    },
    calculator: {
      sectionTitle: 'Calculator',
      sectionSubtitle: 'Estimate',
      stackLabel: 'Stack',
      stacks: {
        web: { label: 'Web', hint: 'Web hint' },
        mobile: { label: 'Mobile', hint: 'Mobile hint' },
        both: { label: 'Both', hint: 'Both hint' },
      },
      modules: {
        auth_rls: moduleStub,
        anti_regression_ci: moduleStub,
        perf_sentry: moduleStub,
        eaa_compliance: moduleStub,
        flutter_mobile: moduleStub,
      },
      diagnosticAddon: {
        title: 'Diagnostic',
        subtitle: '48h',
        badge: 'Deductible',
      },
      summary: {
        heading: 'Summary',
        modulesCountLabel: 'Modules',
        stackSummaryLabel: 'Stack',
        subtotalLabel: 'Subtotal',
        diagnosticFeeLabel: 'Diagnostic',
        diagnosticCreditLabel: 'Credit',
        totalLabel: 'Total',
        timelineLabel: 'Timeline',
        daysUnit: 'days',
        requestCta: 'Request',
        resetCta: 'Reset',
        emptyWarning: 'Select',
        diagnosticOnlyBadge: 'Diagnostic only',
      },
    },
    modal: {
      title: 'Modal',
      subtitle: 'Subtitle',
      closeLabel: 'Close',
      fields: {
        nameLabel: 'Name',
        namePlaceholder: 'Jane',
        emailLabel: 'Email',
        emailPlaceholder: 'jane@example.com',
        repoLabel: 'Repo',
        repoPlaceholder: 'https://github.com/org/repo',
        notesLabel: 'Notes',
        notesPlaceholder: 'Notes',
      },
      summaryHeading: 'Summary',
      copyButton: 'Copy',
      copiedFeedback: 'Copied',
      copyErrorFeedback: 'Copy error',
      mailtoButton: 'Email',
      bookingButton: 'Book',
      mailtoSubjectPrefix: 'VibeShield',
      footerNote: 'Note',
    },
    guaranteesFaq: {
      guaranteesTitle: 'Guarantees',
      guarantees: [{ id: 'g1', title: 'Guarantee', description: 'Desc' }],
      faqTitle: 'FAQ',
      faqSubtitle: 'Answers',
      faqs: [{ id: 'f1', question: 'Q?', answer: 'A.' }],
    },
    footer: {
      tagline: isEs
        ? 'Ingeniería de rescate para apps creadas con IA.'
        : 'Rescue engineering for AI-built apps.',
      rights: isEs
        ? '© 2026 VibeShield. Todos los derechos reservados.'
        : '© 2026 VibeShield. All rights reserved.',
      noDatabaseNote: isEs
        ? 'Sin tracking invasivo ni almacenamiento en servidor.'
        : 'No invasive tracking or server-side storage.',
      links: {
        home: isEs ? 'Inicio' : 'Home',
        demo: isEs ? 'Demo X-Ray' : 'Demo X-Ray',
        calculator: isEs ? 'Calculadora' : 'Calculator',
        contact: isEs ? 'Contacto' : 'Contact',
      },
    },
    demo: {
      kicker: 'X-Ray',
      title: 'PulseCRM',
      verdictPrefix: 'Verdict',
      verdictLabel: 'Hardened',
      kpis: {
        healthScoreLabel: 'Health',
        criticalRisksLabel: 'Risks',
        rescueDaysLabel: 'Days',
        daysUnit: 'days',
      },
      tabs: {
        security: 'Security',
        telemetry: 'Telemetry',
        pr: 'PR',
      },
      securityTab: {
        simulateButton: 'Simulate',
        simulatingLabel: 'Simulating',
        resetSimulationButton: 'Reset',
        simulationActiveNotice: 'Active',
        viewModeLabels: {
          split: 'Split',
          before: 'Before',
          after: 'After',
        },
        beforeBadge: 'Before',
        afterBadge: 'After',
        unauthLabel: 'Unauth',
        testResultLabel: 'Test',
      },
      telemetryTab: {
        sectionTitle: 'Telemetry',
        beforeLabel: 'Before',
        afterLabel: 'After',
        sonarqubeTitle: 'SonarQube',
        devtoolsTitle: 'DevTools',
        sentryTitle: 'Sentry',
      },
      prTab: {
        prTitle: 'PR #42',
        branchLabel: 'Branch',
        checksHeading: 'Checks',
        filesHeading: 'Files',
        allChecksPassedLabel: 'All passed',
      },
      summaryRow: {
        sonarqubeLabel: 'SonarQube',
        devtoolsLabel: 'DevTools',
        prPreviewLabel: 'PR',
        checksSuffix: 'checks',
      },
    },
  };
}

const mockDictionaries: Record<Locale, Dictionary> = {
  es: createMockDictionary('es'),
  en: createMockDictionary('en'),
};

function LocaleProbe() {
  const { locale, currency, dict } = useLocale();
  return (
    <div>
      <span data-testid="probe-locale">{locale}</span>
      <span data-testid="probe-currency">{currency}</span>
      <span data-testid="probe-tagline">{dict.footer.tagline}</span>
    </div>
  );
}

describe('LocaleContext, Navbar, and Footer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    document.documentElement.lang = 'es';
    window.history.replaceState(null, '', '/');
    mockUsePathname.mockReturnValue('/');
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it('throws a clear error when useLocale is called outside LocaleProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<LocaleProbe />)).toThrow(/LocaleProvider/i);
    consoleSpy.mockRestore();
  });

  it('prioritizes valid ?lang=en over localStorage("es") and resolves currency USD', async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'es');
    mockUseSearchParams.mockReturnValue(new URLSearchParams('lang=en'));

    render(
      <LocaleProvider dictionaries={mockDictionaries}>
        <LocaleProbe />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe-locale')).toHaveTextContent('en');
      expect(screen.getByTestId('probe-currency')).toHaveTextContent('USD');
      expect(screen.getByTestId('probe-tagline')).toHaveTextContent(
        mockDictionaries.en.footer.tagline,
      );
    });
  });

  it('ignores invalid ?lang=fr and falls back to localStorage("en") or default "es"', async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'en');
    mockUseSearchParams.mockReturnValue(new URLSearchParams('lang=fr'));

    const { unmount } = render(
      <LocaleProvider dictionaries={mockDictionaries}>
        <LocaleProbe />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe-locale')).toHaveTextContent('en');
      expect(screen.getByTestId('probe-currency')).toHaveTextContent('USD');
    });

    unmount();
    window.localStorage.clear();

    render(
      <LocaleProvider dictionaries={mockDictionaries}>
        <LocaleProbe />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe-locale')).toHaveTextContent('es');
      expect(screen.getByTestId('probe-currency')).toHaveTextContent('EUR');
    });
  });

  it('tolerates SecurityError when localStorage.getItem and setItem throw', async () => {
    const securityError = new DOMException('Blocked', 'SecurityError');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw securityError;
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw securityError;
    });

    render(
      <LocaleProvider dictionaries={mockDictionaries}>
        <Navbar />
        <LocaleProbe />
      </LocaleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe-locale')).toHaveTextContent('es');
    });

    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    expect(screen.getByTestId('probe-locale')).toHaveTextContent('en');
    expect(screen.getByTestId('probe-currency')).toHaveTextContent('USD');
    expect(document.documentElement.lang).toBe('en');
  });

  it('switches ES <-> EN interactively via Navbar updating locale, currency, document.lang, and URL preserving hash', async () => {
    window.history.replaceState(null, '', '/?lang=es#calculator');

    render(
      <LocaleProvider dictionaries={mockDictionaries}>
        <Navbar />
        <LocaleProbe />
      </LocaleProvider>,
    );

    const esButton = screen.getByRole('button', { name: 'ES' });
    const enButton = screen.getByRole('button', { name: 'EN' });

    expect(esButton).toHaveAttribute('aria-pressed', 'true');
    expect(enButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('probe-currency')).toHaveTextContent('EUR');

    await act(async () => {
      fireEvent.click(enButton);
    });

    expect(screen.getByTestId('probe-locale')).toHaveTextContent('en');
    expect(screen.getByTestId('probe-currency')).toHaveTextContent('USD');
    expect(document.documentElement.lang).toBe('en');
    expect(enButton).toHaveAttribute('aria-pressed', 'true');
    expect(esButton).toHaveAttribute('aria-pressed', 'false');
    expect(window.location.search).toContain('lang=en');
    expect(window.location.hash).toBe('#calculator');

    await act(async () => {
      fireEvent.click(esButton);
    });

    expect(screen.getByTestId('probe-locale')).toHaveTextContent('es');
    expect(screen.getByTestId('probe-currency')).toHaveTextContent('EUR');
    expect(document.documentElement.lang).toBe('es');
    expect(window.location.search).toContain('lang=es');
    expect(window.location.hash).toBe('#calculator');
  });

  it('adapts Navbar between / (nav links + diagnostic event CTA) and /demo (breadcrumb + recommended modules CTA)', () => {
    const eventListener = vi.fn();
    window.addEventListener(DIAGNOSTIC_CTA_EVENT, eventListener);

    const { unmount } = render(
      <LocaleProvider dictionaries={mockDictionaries}>
        <Navbar />
      </LocaleProvider>,
    );

    expect(
      screen.getByRole('link', { name: mockDictionaries.es.nav.howItWorks }),
    ).toHaveAttribute('href', '#how-it-works');
    expect(
      screen.getByRole('link', { name: mockDictionaries.es.nav.calculator }),
    ).toHaveAttribute('href', '#calculator');
    expect(
      screen.getByRole('link', { name: mockDictionaries.es.nav.demoXray }),
    ).toHaveAttribute('href', '/demo?lang=es');

    const diagnosticBtn = screen.getByRole('button', {
      name: mockDictionaries.es.nav.diagnosticCta,
    });
    fireEvent.click(diagnosticBtn);
    expect(eventListener).toHaveBeenCalledTimes(1);

    window.removeEventListener(DIAGNOSTIC_CTA_EVENT, eventListener);
    unmount();

    mockUsePathname.mockReturnValue('/demo');
    render(
      <LocaleProvider dictionaries={mockDictionaries}>
        <Navbar />
      </LocaleProvider>,
    );

    expect(screen.getByText('PulseCRM')).toBeInTheDocument();
    const loadModulesLink = screen.getByRole('link', {
      name: mockDictionaries.es.nav.loadModulesCta,
    });
    expect(loadModulesLink).toHaveAttribute(
      'href',
      '/?modules=auth_rls,anti_regression_ci,eaa_compliance&lang=es#calculator',
    );
  });

  it('renders Footer with mailto link from getSiteConfig() and localized notes', () => {
    const config = getSiteConfig();

    render(
      <LocaleProvider dictionaries={mockDictionaries}>
        <Footer />
      </LocaleProvider>,
    );

    const mailtoLink = screen.getByRole('link', {
      name: mockDictionaries.es.footer.links.contact,
    });
    expect(mailtoLink).toHaveAttribute('href', `mailto:${config.contactEmail}`);
    expect(
      screen.getByText(mockDictionaries.es.footer.tagline),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockDictionaries.es.footer.noDatabaseNote),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockDictionaries.es.footer.rights),
    ).toBeInTheDocument();
  });
});
