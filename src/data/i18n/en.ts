import type { Dictionary } from '@/types/vibeshield';

export const enDictionary: Dictionary = {
  meta: {
    homeTitle: 'Velnea — Technical Audits & Production Rescue for AI-Built Software',
    homeDescription:
      'We audit your repository in 48 hours and stabilize Lovable, Cursor, and Bolt apps within one week with real security, regression tests, and fixed fees.',
    demoTitle: 'Sample Technical Dossier: PulseCRM — Velnea',
    demoDescription:
      'Inspect a real sample rescue dossier: before/after RLS security, SonarQube/LCP/Sentry telemetry, and the first verified Pull Request.',
  },
  nav: {
    howItWorks: 'Method',
    calculator: 'Fee Schedule',
    demoXray: 'Sample Dossier',
    diagnosticCta: '48h Diagnostic',
    demoBreadcrumbRoot: 'Velnea',
    demoBreadcrumbSection: 'dossier',
    demoCaseName: 'PulseCRM',
    loadModulesCta: 'Load in fee schedule',
    switchLanguageLabel: 'Language switcher',
  },
  hero: {
    badge: 'VELNEA · AUDIT & RESCUE · WEB & FLUTTER',
    title: 'Your AI app, ready to charge.',
    subtitle:
      'We audit your repository in 48 hours and within one week close data leaks, wire regression tests, and hand back maintainable production code.',
    primaryCta: '48h Diagnostic — $590',
    secondaryCta: 'Read sample dossier',
    pipelineCard: {
      title: 'Architecture inspection',
      branch: 'main',
      statusLabel: 'VERIFIED',
      checks: [
        {
          id: 'auth-rls',
          label: 'RLS policies & JWT auth',
          detail: 'Tenant isolation verified with HTTP 403',
        },
        {
          id: 'sonarqube-gate',
          label: 'Static analysis & CVEs',
          detail: '0 critical findings · duplication under 3%',
        },
        {
          id: 'anti-regression',
          label: 'Automated regression suite',
          detail: '48 checks across billing, auth, and API',
        },
        {
          id: 'agents-guardrails',
          label: 'Repo boundaries (AGENTS.md)',
          detail: 'Explicit rules so AI tools stop breaking main',
        },
      ],
    },
  },
  problemSolution: {
    sectionTitle: 'What we find when opening prompt-built repositories',
    sectionSubtitle:
      'Shipping a prototype now takes a weekend. The cracks appear the moment paying users arrive—or when the next prompt breaks yesterday’s checkout flow.',
    problem: {
      badge: 'COMMON FINDINGS',
      title: 'Four failures that show up in almost every audit',
      statHighlight: 'We inspect live code on staging, not slide decks.',
      description:
        'The UI looks sharp in a sales call, while the data layer and deployment setup stay wide open underneath.',
      bullets: [
        'Supabase tables or Firestore rules readable without authentication because RLS was never enabled.',
        'Private API keys or billing checks accidentally shipped inside the client bundle.',
        'Zero automated tests: every production deploy is a guess.',
        'Circular dependencies and duplicated modules causing Cursor or Lovable to break old screens when adding new ones.',
      ],
    },
    solution: {
      badge: 'VELNEA INTERVENTION',
      title: 'How we stabilize your codebase without throwing it away',
      description:
        'We work inside your Git repository through small, reviewable Pull Requests with measurable checks.',
      pillars: [
        {
          key: 'agents-md',
          title: 'Repo-level rules (AGENTS.md)',
          detail:
            'Explicit contracts, data boundaries, and conventions so future prompts respect your architecture.',
        },
        {
          key: 'ci-gate',
          title: 'Automated checks on every merge',
          detail:
            'GitHub Actions running strict typecheck, lint, secret scanning, and a Quality Gate before release.',
        },
        {
          key: 'anti-regression',
          title: 'Tests around what costs money',
          detail:
            'Reproducible coverage on RLS permissions, payments, auth flows, and core endpoints.',
        },
        {
          key: 'clean-prs',
          title: 'Delivered directly in your Git',
          detail:
            'Readable diffs, before/after telemetry, and 100% client code ownership from day one.',
        },
      ],
    },
  },
  journey: {
    sectionTitle: 'Three phases with fixed fees before we start',
    sectionSubtitle:
      'We measure the actual state of your repository in 48 hours. If you proceed with the rescue, 100% of the diagnostic fee is credited.',
    steps: [
      {
        stepNumber: '01',
        title: 'Technical diagnostic',
        priceRange: '$590',
        duration: '48 hours',
        description:
          'Interactive audit dossier with prioritized risks, an honest rescue-vs-rebuild verdict, and your first real Pull Request deployed to a preview URL.',
        highlight: '100% credited toward any rescue package',
      },
      {
        stepNumber: '02',
        title: 'Rescue & stabilization',
        priceRange: '$2,500 – $6,000',
        duration: '7–10 days',
        description:
          'Database and auth hardening, modular cleanup of blocking debt, regression test suite, CI/Sentry setup, and a production-readiness dossier for investors or enterprise buyers.',
        highlight: 'Fixed fee per selected module',
      },
      {
        stepNumber: '03',
        title: 'Ongoing oversight',
        priceRange: '$600 – $1,200/mo',
        duration: 'Monthly',
        description:
          'Regular review of AI-assisted Pull Requests from your team, Sentry alert triage, and maintenance of CI rules and dependencies.',
        highlight: 'Optional · Cancel anytime',
      },
    ],
  },
  calculator: {
    sectionTitle: 'Modular fee schedule',
    sectionSubtitle:
      'Select the exact modules your repository needs to calculate a fixed fee and realistic timeline.',
    stackLabel: 'Stack',
    stacks: {
      web: {
        label: 'Web (Next.js / React / Supabase)',
        hint: 'Web apps built with Lovable, Bolt, v0, or Cursor',
      },
      mobile: {
        label: 'Mobile (Flutter / Firebase)',
        hint: 'iOS and Android apps with unstable state or builds',
      },
      both: {
        label: 'Hybrid (Web + Flutter)',
        hint: 'Multi-platform product sharing one backend',
      },
    },
    modules: {
      auth_rls: {
        title: 'Auth security & DB policies (RLS / Firestore)',
        description:
          'Lock down anonymous reads, enforce tenant-level database isolation, rotate leaked keys out of the client, and validate JWTs server-side.',
        deliverables: [
          'SQL RLS migrations or Firestore Rules with denial tests',
          'Strict server-side session and role validation',
          'Leaked secret removal and CI secret scanning',
        ],
      },
      anti_regression_ci: {
        title: 'Regression tests, CI & repo rules',
        description:
          'Automated coverage on critical flows, GitHub Actions gates, and a tailored AGENTS.md so future prompts stop breaking production.',
        deliverables: [
          'Integration and regression tests on core journeys',
          'GitHub Actions workflow with typecheck, lint, and Quality Gate',
          'Tailored AGENTS.md architecture boundary file',
        ],
      },
      eaa_compliance: {
        title: 'European EAA / WCAG 2.2 AA',
        description:
          'Real source-code remediation to meet the European Accessibility Act and EN 301 549 for EU-facing SaaS and e-commerce.',
        deliverables: [
          'Semantic HTML, contrast, and full keyboard navigation',
          'ARIA patterns on forms, tabs, and dialogs',
          'Technical conformance report ready for buyers',
        ],
      },
      flutter_mobile: {
        title: 'Mobile stabilization (Flutter / Android)',
        description:
          'State architecture cleanup, secure token storage, crash fixes, and deterministic Android/iOS build verification.',
        deliverables: [
          'Strict static analysis and widget tests on key flows',
          'Mobile session, permission, and performance audit',
          'Reliable Android / iOS release pipeline',
        ],
      },
      perf_sentry: {
        title: 'LCP performance, memory & Sentry',
        description:
          'Live Chrome DevTools profiling, memory leak and slow-query fixes, and clean production error alerting in Sentry.',
        deliverables: [
          'Initial load (LCP) and bundle size optimization',
          'Memory leak and runtime console error fixes',
          'Sentry alerts configured with readable source maps',
        ],
      },
    },
    diagnosticAddon: {
      title: 'Include 48h technical diagnostic',
      subtitle:
        'Full repository dossier + your first Pull Request on a preview URL before starting the rescue. 100% credited toward rescue modules.',
      badge: '100% credited',
    },
    summary: {
      heading: 'Proposal summary',
      modulesCountLabel: 'Selected modules',
      stackSummaryLabel: 'Stack',
      subtotalLabel: 'Modules subtotal',
      diagnosticFeeLabel: '48h Diagnostic',
      diagnosticCreditLabel: 'Diagnostic credit (−100%)',
      totalLabel: 'Fixed fee',
      timelineLabel: 'Estimated timeline',
      daysUnit: 'days',
      requestCta: 'Prepare fixed proposal',
      resetCta: 'Reset selection',
      emptyWarning:
        'Select at least one module or the 48h Diagnostic to prepare a proposal.',
      diagnosticOnlyBadge: '48h Diagnostic only',
    },
  },
  modal: {
    title: 'Prepare technical request',
    subtitle:
      'Add your details to personalize the brief. Copy it to your clipboard or open it directly in your email client.',
    closeLabel: 'Close dialog',
    fields: {
      nameLabel: 'Your name',
      namePlaceholder: 'e.g. Laura Martinez',
      emailLabel: 'Contact email',
      emailPlaceholder: 'laura@company.com',
      repoLabel: 'Repository or staging URL (optional)',
      repoPlaceholder: 'https://github.com/your-org/your-app',
      notesLabel: 'Technical context (optional)',
      notesPlaceholder:
        'Briefly share what is breaking or your target launch date...',
    },
    summaryHeading: 'Proposal breakdown',
    copyButton: 'Copy summary',
    copiedFeedback: 'Summary copied to clipboard',
    copyErrorFeedback:
      'Clipboard access unavailable. Select and copy the summary text manually.',
    mailtoButton: 'Send via email',
    bookingButton: 'Book 15-min call',
    mailtoSubjectPrefix: '[Velnea] Technical proposal',
    footerNote:
      'This site sends zero data to third-party servers; you control when and how you contact us.',
  },
  guaranteesFaq: {
    guaranteesTitle: 'Working terms',
    guarantees: [
      {
        id: 'honesty',
        title: 'Straight answer in 48 hours',
        description:
          'If your data model is fundamentally broken and rebuilding the backend is cheaper, we tell you in the diagnostic before quoting a single dollar more.',
      },
      {
        id: 'ownership',
        title: '100% client-owned code',
        description:
          'Every fix lands via Pull Requests in your GitHub repository. Zero proprietary runtime dependencies and zero lock-in to Velnea.',
      },
      {
        id: 'fixed-price',
        title: 'Fixed fee per deliverable',
        description:
          'Each module has a published fee, written scope, and objective exit criteria: clean build, green tests, and passing Quality Gate.',
      },
    ],
    faqTitle: 'Frequently asked questions',
    faqSubtitle:
      'Direct answers on timelines, confidentiality, and how we work inside your repository.',
    faqs: [
      {
        id: 'faq-after-rescue',
        question: 'Can we keep using Cursor or Lovable afterward?',
        answer:
          'Yes. We leave an AGENTS.md file tailored to your architecture plus CI checks that block any future change that breaks tests or security policies.',
      },
      {
        id: 'faq-diagnostic-credit',
        question: 'How does the 48h Diagnostic credit work?',
        answer:
          'You pay $590 for the audit, interactive dossier, and first preview PR. If you book a rescue within 30 days, the full $590 is deducted from your invoice.',
      },
      {
        id: 'faq-nda',
        question: 'Do you sign an NDA and how do you access the repo?',
        answer:
          'We sign a mutual NDA before viewing a single line of code. During the diagnostic we use temporary read-only access, and during rescue we work on a dedicated branch without production credentials.',
      },
      {
        id: 'faq-flutter',
        question: 'Do you also rescue Flutter mobile applications?',
        answer:
          'Yes. We audit state management, secure token storage, Firebase rules, runtime crashes, and Android/iOS release builds.',
      },
      {
        id: 'faq-eaa',
        question: 'Does the EAA module replace accessibility overlay widgets?',
        answer:
          'Single-line JavaScript overlays do not satisfy the European Accessibility Act or EN 301 549. We remediate semantic HTML, keyboard focus, color contrast, and ARIA directly in source code.',
      },
    ],
  },
  footer: {
    tagline:
      'Velnea — Technical studio for software audits, security hardening, and codebase rescue.',
    rights: '© 2026 Velnea. All rights reserved.',
    noDatabaseNote:
      'Static site with zero tracking cookies and zero intermediary servers.',
    links: {
      home: 'Home',
      demo: 'Sample Dossier',
      calculator: 'Fee Schedule',
      contact: 'Contact',
    },
  },
  demo: {
    kicker: 'Sample technical dossier · VL-AUDIT-142',
    title: 'Demo Case: PulseCRM (Lovable + Supabase)',
    verdictPrefix: 'VERDICT:',
    verdictLabel: 'RESCUABLE WITH MODULAR REFACTOR',
    kpis: {
      healthScoreLabel: 'Health score',
      criticalRisksLabel: 'Critical findings',
      rescueDaysLabel: 'Rescue timeline',
      daysUnit: 'days',
    },
    tabs: {
      security: '01. RLS Security',
      telemetry: '02. Telemetry (SonarQube & LCP)',
      pr: '03. First Real PR (#142)',
    },
    securityTab: {
      simulateButton: 'Simulate unauthenticated request',
      simulatingLabel: 'Anonymous request executed',
      resetSimulationButton: 'Hide trace',
      simulationActiveNotice:
        'GET request without Authorization header: previously returned 1,420 customer records with tax IDs; after PR #142 Postgres RLS blocks it with HTTP 403.',
      viewModeLabels: {
        split: 'Side by side',
        before: 'Before only',
        after: 'After only',
      },
      beforeBadge: 'BEFORE · EXPOSED',
      afterBadge: 'AFTER · VERIFIED',
      unauthLabel: 'Request without Authorization header',
      testResultLabel: 'CI verification',
    },
    telemetryTab: {
      sectionTitle: 'Audit measurements (before vs. after)',
      beforeLabel: 'Before',
      afterLabel: 'After',
      sonarqubeTitle: 'SonarQube',
      devtoolsTitle: 'Chrome DevTools',
      sentryTitle: 'Sentry',
    },
    prTab: {
      prTitle: 'PR #142 — Lock customers RLS, anti-leak tests & AGENTS.md',
      branchLabel: 'Branch',
      checksHeading: 'CI checks (4/4)',
      filesHeading: 'Changed files (3)',
      allChecksPassedLabel: '4/4 checks passed',
    },
    summaryRow: {
      sonarqubeLabel: 'SonarQube Gate',
      devtoolsLabel: 'LCP (DevTools)',
      prPreviewLabel: 'First PR #142',
      checksSuffix: 'checks passed',
    },
  },
};
