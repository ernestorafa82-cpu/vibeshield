import type { Dictionary } from '@/types/vibeshield';

export const enDictionary: Dictionary = {
  meta: {
    homeTitle: 'VibeShield — From AI prototype to hardened production in 7–10 days',
    homeDescription:
      'We rescue applications built with Lovable, Bolt, and Cursor with real security, anti-regression tests, SonarQube Quality Gate, and transparent pricing.',
    demoTitle: 'Demo X-Ray: PulseCRM — VibeShield',
    demoDescription:
      'Inspect an interactive rescue X-ray: before/after RLS security, SonarQube/LCP/Sentry telemetry, and the first verified Pull Request.',
  },
  nav: {
    howItWorks: 'How it works',
    calculator: 'Calculator',
    demoXray: 'Demo X-Ray',
    diagnosticCta: '48h Diagnostic',
    demoBreadcrumbRoot: 'VibeShield',
    demoBreadcrumbSection: 'demo',
    demoCaseName: 'PulseCRM',
    loadModulesCta: 'Load modules in calculator',
    switchLanguageLabel: 'Español',
  },
  hero: {
    badge: 'ANTI-VIBE SHIELD • WEB & FLUTTER',
    title: 'From AI prototype to hardened production.',
    subtitle:
      'We rescue apps built with Lovable, Bolt, and Cursor in 7–10 days with real security, anti-regression tests, and transparent pricing.',
    primaryCta: '48h Diagnostic — $590',
    secondaryCta: 'View Demo X-Ray →',
    pipelineCard: {
      title: 'Shield CI Pipeline',
      branch: 'main',
      statusLabel: 'PASS',
      checks: [
        {
          id: 'auth-rls',
          label: 'Auth & RLS Policies Locked',
          detail: 'Supabase RLS + strict JWT verification on private routes',
        },
        {
          id: 'sonarqube-gate',
          label: 'SonarQube Quality Gate: PASS',
          detail: '0 critical vulnerabilities · duplication < 3%',
        },
        {
          id: 'anti-regression',
          label: '48/48 Anti-Regression Tests',
          detail: 'API contracts, RLS, and critical flows passing',
        },
        {
          id: 'agents-guardrails',
          label: 'AGENTS.md Guardrails Installed',
          detail: 'Architecture rules for Cursor, Claude, and Copilot',
        },
      ],
    },
  },
  problemSolution: {
    sectionTitle: 'Why AI prototypes break right before launch',
    sectionSubtitle:
      'Prompt-generated code accelerates day one, but accumulates invisible structural debt until the first real customer signs in.',
    problem: {
      badge: 'THE DIAGNOSIS',
      title: 'The 67% Wall',
      statHighlight: '67% of vibecoded apps fail when scaling from demo to production',
      description:
        'The app looks polished in a demo, but underneath it lacks data isolation, security boundaries, and automated verification.',
      bullets: [
        'Open Supabase tables or Firestore rules with missing RLS and no real session checks.',
        'Private API keys, service secrets, or sensitive logic exposed in the client bundle.',
        'Zero automated tests and zero type contracts: every production deploy is a gamble.',
        'Every new prompt in Cursor or Lovable fixes one screen while silently breaking two existing flows.',
      ],
    },
    solution: {
      badge: 'THE ARCHITECTURE',
      title: 'The Anti-Vibe Shield',
      description:
        'We do not rewrite from scratch on a whim or bill opaque hours. We install four verifiable engineering layers directly in your repository.',
      pillars: [
        {
          key: 'agents-md',
          title: 'AGENTS.md + tailored rules',
          detail:
            'Explicit repo guardrails so every future AI prompt respects your contracts, layers, and security boundaries.',
        },
        {
          key: 'ci-gate',
          title: 'CI Quality Gate lock',
          detail:
            'GitHub Actions pipeline with lint, strict typecheck, secret scanning, and SonarQube blocking broken merges.',
        },
        {
          key: 'anti-regression',
          title: 'Automated anti-regression tests',
          detail:
            'Reproducible test suite covering RLS permissions, auth/billing flows, and critical endpoints before shipping.',
        },
        {
          key: 'clean-prs',
          title: 'Verified clean Pull Requests',
          detail:
            'Atomic deliveries in your own repo with auditable diffs, before/after telemetry, and zero black boxes.',
        },
      ],
    },
  },
  journey: {
    sectionTitle: 'Three clear steps, zero surprise invoices',
    sectionSubtitle:
      'Start with a 48-hour technical X-ray. If you proceed with a rescue, 100% of the diagnostic fee is credited.',
    steps: [
      {
        stepNumber: '01',
        title: '48h Diagnostic',
        priceRange: '$590',
        duration: '48h',
        description:
          'Interactive repository X-ray, an honest Rescue vs. Rebuild scorecard, and your 1st real preview PR mitigating the highest-risk vulnerability.',
        highlight: '100% credited if you book a rescue',
      },
      {
        stepNumber: '02',
        title: 'Anti-Regression Rescue',
        priceRange: '$2,500 – $6,000',
        duration: '7–10 days',
        description:
          'DB & Auth hardening, modular refactor of critical debt, anti-regression test suite, Anti-Vibe Shield installation, and Production-Ready Dossier.',
        highlight: 'Fixed modular pricing locked before kickoff',
      },
      {
        stepNumber: '03',
        title: 'Production Guardian',
        priceRange: '$600 – $1,200/mo',
        duration: 'Monthly',
        description:
          'Active Sentry error monitoring, engineering review of AI-generated PRs from your team, and ongoing CI rule & dependency maintenance.',
        highlight: 'Optional · No long-term lock-in',
      },
    ],
  },
  calculator: {
    sectionTitle: 'Modular rescue calculator',
    sectionSubtitle:
      'Select the exact hardening modules your codebase needs and get a fixed-scope estimate in seconds.',
    stackLabel: 'Target stack',
    stacks: {
      web: {
        label: 'Web (Next.js / React / Supabase)',
        hint: 'Web apps built with Lovable, Bolt, v0, or Cursor',
      },
      mobile: {
        label: 'Mobile (Flutter / Firebase)',
        hint: 'iOS/Android apps built with FlutterFlow, Cursor, or Firebase',
      },
      both: {
        label: 'Hybrid (Web + Flutter)',
        hint: 'Shared backend serving both web and mobile clients',
      },
    },
    modules: {
      auth_rls: {
        title: 'Auth & DB Hardening',
        description:
          'Lock down anonymous access, enforce tenant/user Row Level Security policies, rotate client-leaked secrets, and add server-side validation.',
        deliverables: [
          'SQL RLS migrations / Firestore security rules audit',
          'Strict JWT verification and session middleware',
          'Exposed key rotation + CI secret scanner',
        ],
      },
      anti_regression_ci: {
        title: 'Anti-Regression Suite + CI',
        description:
          'Automated coverage of critical flows, typed contracts, SonarQube Quality Gate, and AGENTS.md guardrails to stop prompt regressions.',
        deliverables: [
          'Integration & regression tests on core user flows',
          'GitHub Actions with typecheck, lint, and Quality Gate',
          'Tailored AGENTS.md rules aligned with repo architecture',
        ],
      },
      eaa_compliance: {
        title: 'EAA / WCAG 2.2 Compliance',
        description:
          'Technical web accessibility remediation required by the European Accessibility Act (contrast, keyboard navigation, semantics, and screen readers).',
        deliverables: [
          'WCAG 2.2 AA audit across primary user journeys',
          'Focus management, ARIA landmarks, and form fixes',
          'Compliance report + automated accessibility CI checks',
        ],
      },
      flutter_mobile: {
        title: 'Flutter Mobile Rescue',
        description:
          'State stabilization, secure on-device token storage, native permissions hardening, reproducible builds, and widget/integration tests.',
        deliverables: [
          'Leak-free state and navigation refactor',
          'Secure token storage and Firebase/API rules hardening',
          'Android/iOS build pipeline + automated widget tests',
        ],
      },
      perf_sentry: {
        title: 'LCP Performance & Sentry',
        description:
          'Core Web Vitals optimization, memory leak and N+1 query elimination, plus real-time error telemetry with actionable alerts.',
        deliverables: [
          'Chrome DevTools LCP/INP profiling & bundle reduction',
          'Memory leak and blocking re-render resolution',
          'Sentry integration with source maps and clean alerts',
        ],
      },
    },
    diagnosticAddon: {
      title: 'Include 48h Diagnostic ($590)',
      subtitle:
        '48-hour initial audit with Rescue vs. Rebuild verdict and first mitigation PR in preview.',
      badge: '100% credited toward rescue',
    },
    summary: {
      heading: 'Fixed estimate',
      modulesCountLabel: 'Selected modules',
      stackSummaryLabel: 'Stack',
      subtotalLabel: 'Modules subtotal',
      diagnosticFeeLabel: '48h Diagnostic',
      diagnosticCreditLabel: 'Diagnostic credit applied',
      totalLabel: 'Estimated total',
      timelineLabel: 'Timeline',
      daysUnit: 'days',
      requestCta: 'Request with this configuration',
      resetCta: 'Reset recommended pack',
      emptyWarning:
        'Select at least one module or enable the 48h Diagnostic to generate a configuration.',
      diagnosticOnlyBadge: '48h Diagnostic Only',
    },
  },
  modal: {
    title: 'Request diagnostic or rescue',
    subtitle:
      'No bloated intake forms or intermediary databases: copy the technical summary or open it directly in your email client.',
    closeLabel: 'Close modal',
    fields: {
      nameLabel: 'Name',
      namePlaceholder: 'e.g. Alex Rivera',
      emailLabel: 'Work email',
      emailPlaceholder: 'alex@company.com',
      repoLabel: 'Repository URL (optional)',
      repoPlaceholder: 'https://github.com/your-org/your-app',
      notesLabel: 'Brief project context',
      notesPlaceholder:
        'e.g. Built with Lovable + Supabase, 1,400 beta users, recent prompts keep breaking auth.',
    },
    summaryHeading: 'Configuration summary',
    copyButton: 'Copy technical summary',
    copiedFeedback: 'Summary copied to clipboard',
    copyErrorFeedback: 'Could not copy automatically; please select and copy the text manually.',
    mailtoButton: 'Send via email',
    bookingButton: 'Book 20-min call',
    mailtoSubjectPrefix: '[VibeShield] Configuration Request',
    footerNote:
      'Your configuration is never sent to third-party servers from this site; you control the submission.',
  },
  guaranteesFaq: {
    guaranteesTitle: 'Three contractual guarantees, zero fine print',
    guarantees: [
      {
        id: 'honesty',
        title: 'Honest Rescue vs. Rebuild Verdict',
        description:
          'If our 48h Diagnostic reveals the architecture cannot be safely patched, we tell you upfront with hard evidence before you spend on a rescue.',
      },
      {
        id: 'ownership',
        title: '100% Your Code in Your Repo',
        description:
          'We work via branches and Pull Requests directly inside your GitHub/GitLab repository. Zero proprietary runtime lock-in.',
      },
      {
        id: 'fixed-price',
        title: 'Fixed Pricing, Zero Padded Hours',
        description:
          'Every module has a public rate, clear deliverables, and a fixed delivery window. You know exactly what gets hardened and what it costs.',
      },
    ],
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'Direct engineering answers on how we rescue and harden your codebase.',
    faqs: [
      {
        id: 'tools-supported',
        question: 'Which AI app builders do you routinely rescue?',
        answer:
          'We work daily on repositories generated with Lovable, Bolt.new, v0, Cursor, Replit, and FlutterFlow, typically running on Next.js/React, Supabase, Firebase, and Flutter.',
      },
      {
        id: 'stop-shipping',
        question: 'Do we have to freeze product development during the rescue?',
        answer:
          'No feature freeze required. We work on isolated branches with incremental, preview-verified PRs so merging back into main stays clean and uninterrupted.',
      },
      {
        id: 'diagnostic-credit',
        question: 'How does the 48h Diagnostic credit work?',
        answer:
          'You pay $590 for the full X-ray and your first mitigation PR within 48 hours. When you approve any rescue package, that $590 is 100% credited toward the total.',
      },
      {
        id: 'after-rescue',
        question: 'What keeps AI prompts from breaking the app again afterward?',
        answer:
          'We leave the Anti-Vibe Shield installed: a tailored AGENTS.md rulebook, automated anti-regression tests, and a CI Quality Gate that rejects unsafe or broken PRs.',
      },
      {
        id: 'nda-access',
        question: 'How do you handle repository access and secrets?',
        answer:
          'We operate under a standard NDA whenever required, with least-privilege repo access and immediate rotation of any leaked keys into server-side environment variables.',
      },
    ],
  },
  footer: {
    tagline: 'Rescue and production-hardening engineering for AI-built applications.',
    rights: '© 2026 VibeShield. Senior production-grade engineering.',
    noDatabaseNote:
      'Static site with zero intrusive cookies and zero server-side lead storage.',
    links: {
      home: 'Home',
      demo: 'Demo X-Ray',
      calculator: 'Calculator',
      contact: '48h Diagnostic',
    },
  },
  demo: {
    kicker: 'Interactive X-Ray',
    title: 'Demo Case: PulseCRM (Lovable + Supabase)',
    verdictPrefix: 'VERDICT:',
    verdictLabel: 'RESCUABLE WITH MODULAR REFACTOR',
    kpis: {
      healthScoreLabel: 'Health Score',
      criticalRisksLabel: 'Critical Risks',
      rescueDaysLabel: 'Rescue Timeline',
      daysUnit: 'days',
    },
    tabs: {
      security: '1. Security Before / After',
      telemetry: '2. Telemetry (SonarQube & LCP)',
      pr: '3. First Real PR (#142)',
    },
    securityTab: {
      simulateButton: 'Simulate unauthenticated request',
      simulatingLabel: 'Running anonymous request...',
      resetSimulationButton: 'Reset simulation',
      simulationActiveNotice:
        'Live simulation: anonymous request against /rest/v1/customers comparing the previous vulnerable state against hardened RLS.',
      viewModeLabels: {
        split: 'Split View',
        before: 'Before Only',
        after: 'After Only',
      },
      beforeBadge: 'BEFORE · VULNERABLE',
      afterBadge: 'AFTER · HARDENED',
      unauthLabel: 'Request without Authorization header',
      testResultLabel: 'Automated verification',
    },
    telemetryTab: {
      sectionTitle: 'Evidence from real engineering audit tools',
      beforeLabel: 'Before',
      afterLabel: 'After',
      sonarqubeTitle: 'SonarQube Quality Gate',
      devtoolsTitle: 'Chrome DevTools · Performance & Memory',
      sentryTitle: 'Sentry · Production Stability',
    },
    prTab: {
      prTitle: 'PR #142 · fix(security): lock customers RLS policies & install AGENTS.md',
      branchLabel: 'Branch',
      checksHeading: 'Mandatory CI checks',
      filesHeading: 'Audited diff files',
      allChecksPassedLabel: '4/4 checks passed · Ready to merge',
    },
    summaryRow: {
      sonarqubeLabel: 'SonarQube Gate',
      devtoolsLabel: 'LCP (DevTools)',
      prPreviewLabel: 'First PR',
      checksSuffix: 'checks passed',
    },
  },
};
