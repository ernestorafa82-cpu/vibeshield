export type Locale = 'es' | 'en';
export type Currency = 'EUR' | 'USD';
export type StackType = 'web' | 'mobile' | 'both';

export type ModuleId =
  | 'auth_rls'
  | 'anti_regression_ci'
  | 'perf_sentry'
  | 'eaa_compliance'
  | 'flutter_mobile';

export type ModuleCategory =
  | 'security'
  | 'quality'
  | 'performance'
  | 'compliance'
  | 'mobile';

export type DemoTabId = 'security' | 'telemetry' | 'pr';
export type SecurityViewMode = 'split' | 'before' | 'after';

export const DIAGNOSTIC_CTA_EVENT = 'vibeshield:select-diagnostic' as const;
export const LOCALE_STORAGE_KEY = 'vibeshield_locale' as const;

export interface RescueModule {
  readonly id: ModuleId;
  readonly category: ModuleCategory;
  readonly price: Readonly<Record<Currency, number>>;
  readonly estimatedDays: number;
  readonly supportedStacks: readonly StackType[];
  readonly recommendedByDefault: boolean;
}

export interface DiagnosticOffer {
  readonly id: 'diagnostic_48h';
  readonly price: Readonly<Record<Currency, number>>;
  readonly estimatedDays: number;
  readonly deductibleOnRescue: boolean;
}

export interface CalculatorInput {
  readonly selectedModules: readonly ModuleId[];
  readonly includeDiagnostic: boolean;
  readonly stack: StackType;
  readonly currency: Currency;
}

export interface CalculatorEstimate {
  readonly selectedModules: readonly ModuleId[];
  readonly includeDiagnostic: boolean;
  readonly stack: StackType;
  readonly currency: Currency;
  readonly modulesSubtotal: number;
  readonly diagnosticFee: number;
  readonly diagnosticDiscount: number;
  readonly totalPrice: number;
  readonly estimatedDays: number;
  readonly isDiagnosticOnly: boolean;
  readonly hasSelection: boolean;
}

export interface QuoteModalFormValues {
  readonly clientName: string;
  readonly clientEmail: string;
  readonly repositoryUrl: string;
  readonly notes: string;
}

export interface SiteConfig {
  readonly brandName: string;
  readonly siteUrl: string;
  readonly contactEmail: string;
  readonly bookingUrl: string | null;
  readonly defaultLocale: Locale;
}

export interface Dictionary {
  readonly meta: {
    readonly homeTitle: string;
    readonly homeDescription: string;
    readonly demoTitle: string;
    readonly demoDescription: string;
  };
  readonly nav: {
    readonly howItWorks: string;
    readonly calculator: string;
    readonly demoXray: string;
    readonly diagnosticCta: string;
    readonly demoBreadcrumbRoot: string;
    readonly demoBreadcrumbSection: string;
    readonly demoCaseName: string;
    readonly loadModulesCta: string;
    readonly switchLanguageLabel: string;
  };
  readonly hero: {
    readonly badge: string;
    readonly title: string;
    readonly subtitle: string;
    readonly primaryCta: string;
    readonly secondaryCta: string;
    readonly pipelineCard: {
      readonly title: string;
      readonly branch: string;
      readonly statusLabel: string;
      readonly checks: readonly {
        readonly id: string;
        readonly label: string;
        readonly detail: string;
      }[];
    };
  };
  readonly problemSolution: {
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly problem: {
      readonly badge: string;
      readonly title: string;
      readonly statHighlight: string;
      readonly description: string;
      readonly bullets: readonly string[];
    };
    readonly solution: {
      readonly badge: string;
      readonly title: string;
      readonly description: string;
      readonly pillars: readonly {
        readonly key: string;
        readonly title: string;
        readonly detail: string;
      }[];
    };
  };
  readonly journey: {
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly steps: readonly {
      readonly stepNumber: string;
      readonly title: string;
      readonly priceRange: string;
      readonly duration: string;
      readonly description: string;
      readonly highlight?: string;
    }[];
  };
  readonly calculator: {
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly stackLabel: string;
    readonly stacks: Readonly<
      Record<StackType, { readonly label: string; readonly hint: string }>
    >;
    readonly modules: Readonly<
      Record<
        ModuleId,
        {
          readonly title: string;
          readonly description: string;
          readonly deliverables: readonly string[];
        }
      >
    >;
    readonly diagnosticAddon: {
      readonly title: string;
      readonly subtitle: string;
      readonly badge: string;
    };
    readonly summary: {
      readonly heading: string;
      readonly modulesCountLabel: string;
      readonly stackSummaryLabel: string;
      readonly subtotalLabel: string;
      readonly diagnosticFeeLabel: string;
      readonly diagnosticCreditLabel: string;
      readonly totalLabel: string;
      readonly timelineLabel: string;
      readonly daysUnit: string;
      readonly requestCta: string;
      readonly resetCta: string;
      readonly emptyWarning: string;
      readonly diagnosticOnlyBadge: string;
    };
  };
  readonly modal: {
    readonly title: string;
    readonly subtitle: string;
    readonly closeLabel: string;
    readonly fields: {
      readonly nameLabel: string;
      readonly namePlaceholder: string;
      readonly emailLabel: string;
      readonly emailPlaceholder: string;
      readonly repoLabel: string;
      readonly repoPlaceholder: string;
      readonly notesLabel: string;
      readonly notesPlaceholder: string;
    };
    readonly summaryHeading: string;
    readonly copyButton: string;
    readonly copiedFeedback: string;
    readonly copyErrorFeedback: string;
    readonly mailtoButton: string;
    readonly bookingButton: string;
    readonly mailtoSubjectPrefix: string;
    readonly footerNote: string;
  };
  readonly guaranteesFaq: {
    readonly guaranteesTitle: string;
    readonly guarantees: readonly {
      readonly id: string;
      readonly title: string;
      readonly description: string;
    }[];
    readonly faqTitle: string;
    readonly faqSubtitle: string;
    readonly faqs: readonly {
      readonly id: string;
      readonly question: string;
      readonly answer: string;
    }[];
  };
  readonly footer: {
    readonly tagline: string;
    readonly rights: string;
    readonly noDatabaseNote: string;
    readonly links: {
      readonly home: string;
      readonly demo: string;
      readonly calculator: string;
      readonly contact: string;
    };
  };
  readonly demo: {
    readonly kicker: string;
    readonly title: string;
    readonly verdictPrefix: string;
    readonly verdictLabel: string;
    readonly kpis: {
      readonly healthScoreLabel: string;
      readonly criticalRisksLabel: string;
      readonly rescueDaysLabel: string;
      readonly daysUnit: string;
    };
    readonly tabs: {
      readonly security: string;
      readonly telemetry: string;
      readonly pr: string;
    };
    readonly securityTab: {
      readonly simulateButton: string;
      readonly simulatingLabel: string;
      readonly resetSimulationButton: string;
      readonly simulationActiveNotice: string;
      readonly viewModeLabels: Readonly<Record<SecurityViewMode, string>>;
      readonly beforeBadge: string;
      readonly afterBadge: string;
      readonly unauthLabel: string;
      readonly testResultLabel: string;
    };
    readonly telemetryTab: {
      readonly sectionTitle: string;
      readonly beforeLabel: string;
      readonly afterLabel: string;
      readonly sonarqubeTitle: string;
      readonly devtoolsTitle: string;
      readonly sentryTitle: string;
    };
    readonly prTab: {
      readonly prTitle: string;
      readonly branchLabel: string;
      readonly checksHeading: string;
      readonly filesHeading: string;
      readonly allChecksPassedLabel: string;
    };
    readonly summaryRow: {
      readonly sonarqubeLabel: string;
      readonly devtoolsLabel: string;
      readonly prPreviewLabel: string;
      readonly checksSuffix: string;
    };
  };
}

export interface SecuritySnapshot {
  readonly status: 'vulnerable' | 'hardened';
  readonly method: 'GET' | 'POST';
  readonly endpoint: string;
  readonly httpStatus: number;
  readonly httpStatusText: string;
  readonly payloadJson: string;
  readonly highlights: readonly string[];
  readonly testBadge: string;
  readonly testPassed: boolean;
}

export interface TelemetryMetric {
  readonly id: string;
  readonly tool: 'sonarqube' | 'chrome_devtools' | 'sentry';
  readonly label: string;
  readonly beforeValue: string;
  readonly afterValue: string;
  readonly improvementBadge: string;
  readonly statusBefore: 'failed' | 'warning';
  readonly statusAfter: 'passed';
  readonly sparklinePoints?: readonly number[];
}

export interface PrDiffLine {
  readonly type: 'context' | 'add' | 'remove';
  readonly lineNumber: string;
  readonly content: string;
}

export interface PrDiffFile {
  readonly path: string;
  readonly language: 'sql' | 'typescript' | 'markdown';
  readonly additions: number;
  readonly deletions: number;
  readonly lines: readonly PrDiffLine[];
}

export interface CiCheckItem {
  readonly id: string;
  readonly name: string;
  readonly status: 'passed';
  readonly duration: string;
  readonly detail: string;
}

export interface DemoCaseData {
  readonly id: string;
  readonly clientName: string;
  readonly sourceStack: string;
  readonly recommendedModules: readonly ModuleId[];
  readonly healthScore: {
    readonly before: number;
    readonly after: number;
    readonly max: number;
  };
  readonly criticalRisks: {
    readonly before: number;
    readonly after: number;
  };
  readonly rescueDays: number;
  readonly security: {
    readonly before: SecuritySnapshot;
    readonly after: SecuritySnapshot;
    readonly simulatedRequestHeaders: readonly string[];
  };
  readonly telemetry: {
    readonly sonarqubeGateBefore: 'FAILED';
    readonly sonarqubeGateAfter: 'PASSED';
    readonly duplicationBefore: string;
    readonly duplicationAfter: string;
    readonly lcpBefore: string;
    readonly lcpAfter: string;
    readonly lcpSparkline: readonly number[];
    readonly metrics: readonly TelemetryMetric[];
  };
  readonly pullRequest: {
    readonly number: number;
    readonly title: string;
    readonly branch: string;
    readonly baseBranch: string;
    readonly author: string;
    readonly summary: string;
    readonly checks: readonly CiCheckItem[];
    readonly files: readonly PrDiffFile[];
  };
}
