import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyStackChange,
  buildCalculatorShareHref,
  buildMailtoHref,
  buildQuoteSummaryText,
  calculateEstimate,
  formatCurrency,
  getCurrencyForLocale,
  parseModulesQuery,
  resolveInitialModules,
  resolveInitialStack,
} from '@/lib/calculator';
import { getSiteConfig } from '@/lib/config';
import { RECOMMENDED_PACK_IDS } from '@/data/modules';
import type { Dictionary, Locale, ModuleId } from '@/types/vibeshield';

function createMockDictionary(locale: Locale): Dictionary {
  const isEs = locale === 'es';
  return {
    meta: {
      homeTitle: 'VibeShield',
      homeDescription: 'VibeShield',
      demoTitle: 'Demo',
      demoDescription: 'Demo',
    },
    nav: {
      howItWorks: 'How',
      calculator: 'Calc',
      demoXray: 'Demo',
      diagnosticCta: 'Diag',
      demoBreadcrumbRoot: 'Home',
      demoBreadcrumbSection: 'Demo',
      demoCaseName: 'Case',
      loadModulesCta: 'Load',
      switchLanguageLabel: 'Lang',
    },
    hero: {
      badge: 'Badge',
      title: 'Title',
      subtitle: 'Sub',
      primaryCta: 'Primary',
      secondaryCta: 'Secondary',
      pipelineCard: {
        title: 'Pipe',
        branch: 'main',
        statusLabel: 'OK',
        checks: [],
      },
    },
    problemSolution: {
      sectionTitle: 'PS',
      sectionSubtitle: 'PS',
      problem: {
        badge: 'P',
        title: 'P',
        statHighlight: '1',
        description: 'P',
        bullets: [],
      },
      solution: {
        badge: 'S',
        title: 'S',
        description: 'S',
        pillars: [],
      },
    },
    journey: {
      sectionTitle: 'J',
      sectionSubtitle: 'J',
      steps: [],
    },
    calculator: {
      sectionTitle: isEs ? 'Calculadora' : 'Calculator',
      sectionSubtitle: 'Sub',
      stackLabel: 'Stack',
      stacks: {
        web: { label: isEs ? 'Web / SaaS' : 'Web / SaaS', hint: 'Web' },
        mobile: { label: isEs ? 'Móvil (Flutter)' : 'Mobile (Flutter)', hint: 'Mobile' },
        both: { label: isEs ? 'Web + Móvil' : 'Web + Mobile', hint: 'Both' },
      },
      modules: {
        auth_rls: {
          title: isEs ? 'Auth & RLS Hardening' : 'Auth & RLS Hardening',
          description: 'Auth',
          deliverables: [],
        },
        anti_regression_ci: {
          title: isEs ? 'CI Anti-Regresión' : 'Anti-Regression CI',
          description: 'CI',
          deliverables: [],
        },
        eaa_compliance: {
          title: isEs ? 'Cumplimiento EAA' : 'EAA Compliance',
          description: 'EAA',
          deliverables: [],
        },
        flutter_mobile: {
          title: isEs ? 'Rescate Flutter Mobile' : 'Flutter Mobile Rescue',
          description: 'Flutter',
          deliverables: [],
        },
        perf_sentry: {
          title: isEs ? 'Performance & Sentry' : 'Performance & Sentry',
          description: 'Perf',
          deliverables: [],
        },
      },
      diagnosticAddon: {
        title: isEs ? 'Diagnóstico 48h' : '48h Diagnostic',
        subtitle: 'Sub',
        badge: '48h',
      },
      summary: {
        heading: isEs ? 'Resumen de rescate' : 'Rescue summary',
        modulesCountLabel: isEs ? 'Módulos' : 'Modules',
        stackSummaryLabel: isEs ? 'Stack seleccionado' : 'Selected stack',
        subtotalLabel: isEs ? 'Subtotal módulos' : 'Modules subtotal',
        diagnosticFeeLabel: isEs ? 'Diagnóstico 48h' : '48h Diagnostic',
        diagnosticCreditLabel: isEs
          ? 'Crédito Diagnóstico 48h (100% acreditado)'
          : '48h Diagnostic credit (100% credited)',
        totalLabel: isEs ? 'Total estimado' : 'Estimated total',
        timelineLabel: isEs ? 'Plazo estimado' : 'Estimated timeline',
        daysUnit: isEs ? 'días' : 'days',
        requestCta: 'Request',
        resetCta: 'Reset',
        emptyWarning: 'Empty',
        diagnosticOnlyBadge: isEs ? 'Solo Diagnóstico 48h' : '48h Diagnostic Only',
      },
    },
    modal: {
      title: 'Modal',
      subtitle: 'Sub',
      closeLabel: 'Close',
      fields: {
        nameLabel: isEs ? 'Nombre' : 'Name',
        namePlaceholder: '',
        emailLabel: isEs ? 'Email' : 'Email',
        emailPlaceholder: '',
        repoLabel: isEs ? 'Repositorio' : 'Repository',
        repoPlaceholder: '',
        notesLabel: isEs ? 'Notas' : 'Notes',
        notesPlaceholder: '',
      },
      summaryHeading: isEs ? 'Solicitud de Presupuesto VibeShield' : 'VibeShield Quote Request',
      copyButton: 'Copy',
      copiedFeedback: 'Copied',
      copyErrorFeedback: 'Error',
      mailtoButton: 'Mail',
      bookingButton: 'Book',
      mailtoSubjectPrefix: 'VibeShield',
      footerNote: '',
    },
    guaranteesFaq: {
      guaranteesTitle: 'G',
      guarantees: [],
      faqTitle: 'F',
      faqSubtitle: 'F',
      faqs: [],
    },
    footer: {
      tagline: 'T',
      rights: 'R',
      noDatabaseNote: 'N',
      links: {
        home: 'H',
        demo: 'D',
        calculator: 'C',
        contact: 'C',
      },
    },
    demo: {
      kicker: 'K',
      title: 'T',
      verdictPrefix: 'V',
      verdictLabel: 'V',
      kpis: {
        healthScoreLabel: 'H',
        criticalRisksLabel: 'C',
        rescueDaysLabel: 'R',
        daysUnit: 'd',
      },
      tabs: {
        security: 'S',
        telemetry: 'T',
        pr: 'P',
      },
      securityTab: {
        simulateButton: 'Sim',
        simulatingLabel: 'Sim',
        resetSimulationButton: 'Res',
        simulationActiveNotice: 'Act',
        viewModeLabels: { split: 'Split', before: 'Before', after: 'After' },
        beforeBadge: 'B',
        afterBadge: 'A',
        unauthLabel: 'U',
        testResultLabel: 'T',
      },
      telemetryTab: {
        sectionTitle: 'T',
        beforeLabel: 'B',
        afterLabel: 'A',
        sonarqubeTitle: 'S',
        devtoolsTitle: 'D',
        sentryTitle: 'S',
      },
      prTab: {
        prTitle: 'P',
        branchLabel: 'B',
        checksHeading: 'C',
        filesHeading: 'F',
        allChecksPassedLabel: 'A',
      },
      summaryRow: {
        sonarqubeLabel: 'S',
        devtoolsLabel: 'D',
        prPreviewLabel: 'P',
        checksSuffix: 'checks',
      },
    },
  };
}

describe('calculator currency and formatting', () => {
  it('maps locale to currency deterministically', () => {
    expect(getCurrencyForLocale('es')).toBe('EUR');
    expect(getCurrencyForLocale('en')).toBe('USD');
  });

  it('formats EUR/es and USD/en amounts deterministically without Intl quirks', () => {
    expect(formatCurrency(2370, 'EUR', 'es')).toBe('2.370 €');
    expect(formatCurrency(590, 'EUR', 'es')).toBe('590 €');
    expect(formatCurrency(0, 'EUR', 'es')).toBe('0 €');

    expect(formatCurrency(2370, 'USD', 'en')).toBe('$2,370');
    expect(formatCurrency(590, 'USD', 'en')).toBe('$590');
    expect(formatCurrency(0, 'USD', 'en')).toBe('$0');

    expect(formatCurrency(1234567, 'EUR', 'es')).toBe('1.234.567 €');
    expect(formatCurrency(1234567, 'USD', 'en')).toBe('$1,234,567');
    expect(formatCurrency(2370, 'EUR', 'en')).toBe('2,370 €');
    expect(formatCurrency(2370, 'USD', 'es')).toBe('$2.370');
  });
});

describe('query parsing, initial modules and stack resolution', () => {
  it('returns default recommended pack when modules param is null', () => {
    expect(parseModulesQuery(null)).toBeNull();
    expect(resolveInitialModules(null)).toEqual([...RECOMMENDED_PACK_IDS]);
  });

  it('returns empty array when ?modules= is explicitly empty (distinct from null)', () => {
    expect(parseModulesQuery('')).toEqual([]);
    expect(parseModulesQuery('   ')).toEqual([]);
    expect(resolveInitialModules('')).toEqual([]);
  });

  it('deduplicates, ignores invalid IDs, preserves canonical order, and resolves stack to both', () => {
    const parsed = parseModulesQuery('auth_rls,invalid_id,auth_rls,flutter_mobile');
    expect(parsed).toEqual(['auth_rls', 'flutter_mobile']);
    expect(resolveInitialModules('flutter_mobile,invalid_id,auth_rls')).toEqual([
      'auth_rls',
      'flutter_mobile',
    ]);
    expect(resolveInitialStack(parsed ?? [])).toBe('both');
  });

  it('resolves stack to mobile when only flutter_mobile is selected and web otherwise', () => {
    expect(resolveInitialStack(['flutter_mobile'])).toBe('mobile');
    expect(resolveInitialStack(['auth_rls', 'eaa_compliance'])).toBe('web');
    expect(resolveInitialStack([])).toBe('web');
  });

  it('filters incompatible modules cleanly when switching stacks', () => {
    const mixed: ModuleId[] = [
      'flutter_mobile',
      'eaa_compliance',
      'auth_rls',
      'auth_rls',
    ];
    expect(applyStackChange(mixed, 'web')).toEqual(['auth_rls', 'eaa_compliance']);
    expect(applyStackChange(mixed, 'mobile')).toEqual(['auth_rls', 'flutter_mobile']);
    expect(applyStackChange(mixed, 'both')).toEqual([
      'auth_rls',
      'eaa_compliance',
      'flutter_mobile',
    ]);
  });
});

describe('calculateEstimate', () => {
  it('calculates default recommended pack as 2370 and 8 days', () => {
    const estimateEs = calculateEstimate({
      selectedModules: ['auth_rls', 'anti_regression_ci', 'eaa_compliance'],
      includeDiagnostic: false,
      stack: 'web',
      currency: 'EUR',
    });

    expect(estimateEs.modulesSubtotal).toBe(2370);
    expect(estimateEs.totalPrice).toBe(2370);
    expect(estimateEs.estimatedDays).toBe(8);
    expect(estimateEs.diagnosticFee).toBe(0);
    expect(estimateEs.diagnosticDiscount).toBe(0);
    expect(estimateEs.isDiagnosticOnly).toBe(false);
    expect(estimateEs.hasSelection).toBe(true);
    expect(formatCurrency(estimateEs.totalPrice, estimateEs.currency, 'es')).toBe(
      '2.370 €'
    );

    const estimateEn = calculateEstimate({
      selectedModules: ['auth_rls', 'anti_regression_ci', 'eaa_compliance'],
      includeDiagnostic: false,
      stack: 'web',
      currency: 'USD',
    });
    expect(formatCurrency(estimateEn.totalPrice, estimateEn.currency, 'en')).toBe(
      '$2,370'
    );
  });

  it('handles empty selection (?modules= empty) with 0 total, 0 days, hasSelection false', () => {
    const estimate = calculateEstimate({
      selectedModules: [],
      includeDiagnostic: false,
      stack: 'web',
      currency: 'EUR',
    });

    expect(estimate.modulesSubtotal).toBe(0);
    expect(estimate.totalPrice).toBe(0);
    expect(estimate.estimatedDays).toBe(0);
    expect(estimate.hasSelection).toBe(false);
    expect(estimate.isDiagnosticOnly).toBe(false);
    expect(formatCurrency(estimate.totalPrice, estimate.currency, 'es')).toBe(
      '0 €'
    );
  });

  it('calculates Diagnostic 48h alone vs Diagnostic 48h credited with modules', () => {
    const diagnosticOnly = calculateEstimate({
      selectedModules: [],
      includeDiagnostic: true,
      stack: 'web',
      currency: 'EUR',
    });

    expect(diagnosticOnly.modulesSubtotal).toBe(0);
    expect(diagnosticOnly.diagnosticFee).toBe(590);
    expect(diagnosticOnly.diagnosticDiscount).toBe(0);
    expect(diagnosticOnly.totalPrice).toBe(590);
    expect(diagnosticOnly.estimatedDays).toBe(2);
    expect(diagnosticOnly.isDiagnosticOnly).toBe(true);
    expect(diagnosticOnly.hasSelection).toBe(true);

    const diagnosticWithModules = calculateEstimate({
      selectedModules: ['auth_rls', 'anti_regression_ci', 'eaa_compliance'],
      includeDiagnostic: true,
      stack: 'web',
      currency: 'EUR',
    });

    expect(diagnosticWithModules.modulesSubtotal).toBe(2370);
    expect(diagnosticWithModules.diagnosticFee).toBe(590);
    expect(diagnosticWithModules.diagnosticDiscount).toBe(590);
    expect(diagnosticWithModules.totalPrice).toBe(2370);
    expect(diagnosticWithModules.estimatedDays).toBe(8);
    expect(diagnosticWithModules.isDiagnosticOnly).toBe(false);
    expect(diagnosticWithModules.hasSelection).toBe(true);
  });

  it('deduplicates and excludes modules unsupported by the active stack', () => {
    const estimate = calculateEstimate({
      selectedModules: ['auth_rls', 'auth_rls', 'flutter_mobile'],
      includeDiagnostic: false,
      stack: 'web',
      currency: 'USD',
    });

    expect(estimate.selectedModules).toEqual(['auth_rls']);
    expect(estimate.modulesSubtotal).toBe(690);
    expect(estimate.totalPrice).toBe(690);
    expect(estimate.estimatedDays).toBe(2);
  });
});

describe('quote summary, mailto and share href helpers', () => {
  it('builds structured quote summary text in es and en', () => {
    const estimate = calculateEstimate({
      selectedModules: ['auth_rls', 'anti_regression_ci', 'eaa_compliance'],
      includeDiagnostic: true,
      stack: 'web',
      currency: 'EUR',
    });

    const summaryEs = buildQuoteSummaryText(
      estimate,
      {
        clientName: 'Ana Pérez',
        clientEmail: 'ana@example.com',
        repositoryUrl: 'https://github.com/acme/app',
        notes: 'Lanzamiento en 2 semanas',
      },
      'es',
      createMockDictionary('es')
    );

    expect(summaryEs).toContain('Ana Pérez');
    expect(summaryEs).toContain('ana@example.com');
    expect(summaryEs).toContain('https://github.com/acme/app');
    expect(summaryEs).toContain('Lanzamiento en 2 semanas');
    expect(summaryEs).toContain('Web / SaaS');
    expect(summaryEs).toContain('Auth & RLS Hardening');
    expect(summaryEs).toContain('690 €');
    expect(summaryEs).toContain('2.370 €');
    expect(summaryEs).toContain('8 días');
    expect(summaryEs).toContain('Crédito Diagnóstico 48h');

    const diagOnlyEstimate = calculateEstimate({
      selectedModules: [],
      includeDiagnostic: true,
      stack: 'mobile',
      currency: 'USD',
    });
    const summaryEn = buildQuoteSummaryText(
      diagOnlyEstimate,
      {
        clientName: '',
        clientEmail: '',
        repositoryUrl: '',
        notes: '',
      },
      'en',
      createMockDictionary('en')
    );
    expect(summaryEn).toContain('48h Diagnostic Only');
    expect(summaryEn).toContain('$590');
    expect(summaryEn).toContain('2 days');
  });

  it('encodes mailto href safely for accents, &, ? and newlines', () => {
    const href = buildMailtoHref(
      'hello@vibeshield.dev',
      'Rescate Auth & RLS? Urgente',
      'Hola:\nNecesito revisión rápida & segura?\nGracias.'
    );

    expect(href.startsWith('mailto:hello@vibeshield.dev?subject=')).toBe(true);
    expect(href).toContain(encodeURIComponent('Rescate Auth & RLS? Urgente'));
    expect(href).toContain(
      `body=${encodeURIComponent('Hola:\nNecesito revisión rápida & segura?\nGracias.')}`
    );
    expect(href).not.toContain('\n');
  });

  it('builds deterministic calculator share hrefs', () => {
    expect(
      buildCalculatorShareHref(
        ['flutter_mobile', 'auth_rls', 'flutter_mobile'],
        'es',
        true
      )
    ).toBe('/?modules=auth_rls,flutter_mobile&lang=es&diagnostic=1#calculator');

    expect(buildCalculatorShareHref([], 'en', false)).toBe(
      '/?modules=&lang=en#calculator'
    );
  });
});

describe('getSiteConfig URL sanitization', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('rejects javascript:alert(1) and accepts https://cal.com/vibeshield', () => {
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', 'javascript:alert(1)');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'javascript:alert(1)');

    const unsafeConfig = getSiteConfig();
    expect(unsafeConfig.bookingUrl).toBeNull();
    expect(unsafeConfig.siteUrl).toBe('https://vibeshield.dev');

    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', 'https://cal.com/vibeshield');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://vibeshield.dev');

    const safeConfig = getSiteConfig();
    expect(safeConfig.bookingUrl).toBe('https://cal.com/vibeshield');
    expect(safeConfig.siteUrl).toBe('https://vibeshield.dev/');
  });
});
