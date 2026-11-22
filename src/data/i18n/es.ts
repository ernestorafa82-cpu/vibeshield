import type { Dictionary } from '@/types/vibeshield';

export const esDictionary: Dictionary = {
  meta: {
    homeTitle: 'VibeShield — De prototipo IA a producción blindada en 7–10 días',
    homeDescription:
      'Rescatamos aplicaciones generadas con Lovable, Bolt y Cursor con seguridad real, tests anti-regresión, SonarQube Quality Gate y precios cerrados.',
    demoTitle: 'Radiografía Demo: PulseCRM — VibeShield',
    demoDescription:
      'Inspecciona un rescate real en formato interactivo: seguridad RLS antes y después, telemetría SonarQube/LCP/Sentry y el primer Pull Request verificado.',
  },
  nav: {
    howItWorks: 'Cómo funciona',
    calculator: 'Calculadora',
    demoXray: 'Demo Radiografía',
    diagnosticCta: 'Diagnóstico 48h',
    demoBreadcrumbRoot: 'VibeShield',
    demoBreadcrumbSection: 'demo',
    demoCaseName: 'PulseCRM',
    loadModulesCta: 'Cargar módulos en calculadora',
    switchLanguageLabel: 'English',
  },
  hero: {
    badge: 'ESCUDO ANTI-VIBE • WEB & FLUTTER',
    title: 'De prototipo IA a producción blindada.',
    subtitle:
      'Rescatamos apps creadas con Lovable, Bolt y Cursor en 7–10 días con seguridad real, tests anti-regresión y precios públicos.',
    primaryCta: 'Diagnóstico 48h — 590 €',
    secondaryCta: 'Ver Radiografía Demo →',
    pipelineCard: {
      title: 'Shield CI Pipeline',
      branch: 'main',
      statusLabel: 'PASS',
      checks: [
        {
          id: 'auth-rls',
          label: 'Auth & RLS Policies Locked',
          detail: 'Supabase RLS + verificación JWT en rutas privadas',
        },
        {
          id: 'sonarqube-gate',
          label: 'SonarQube Quality Gate: PASS',
          detail: '0 vulnerabilidades críticas · duplicación < 3%',
        },
        {
          id: 'anti-regression',
          label: '48/48 Anti-Regression Tests',
          detail: 'Contratos de API, RLS y flujos críticos en verde',
        },
        {
          id: 'agents-guardrails',
          label: 'AGENTS.md Guardrails Installed',
          detail: 'Reglas de arquitectura para Cursor, Claude y Copilot',
        },
      ],
    },
  },
  problemSolution: {
    sectionTitle: 'Por qué los prototipos con IA se rompen justo antes de lanzar',
    sectionSubtitle:
      'El código generado por prompts acelera el día 1, pero acumula deuda estructural invisible hasta que entra el primer cliente real.',
    problem: {
      badge: 'EL DIAGNÓSTICO',
      title: 'El muro del 67%',
      statHighlight: '67% de apps vibecodeadas fallan al escalar de demo a producción',
      description:
        'La aplicación pinta bien en la demo, pero debajo faltan los cimientos de seguridad, aislamiento de datos y verificación automática.',
      bullets: [
        'Tablas en Supabase o reglas de Firestore abiertas sin RLS ni validación real de sesión.',
        'API keys privadas, secretos de servicio o lógica sensible expuestos en el bundle del cliente.',
        'Cero tests automatizados y cero contratos de tipos: cada cambio en producción es una lotería.',
        'Cada prompt nuevo en Cursor o Lovable arregla una pantalla mientras rompe dos flujos anteriores.',
      ],
    },
    solution: {
      badge: 'LA ARQUITECTURA',
      title: 'El Escudo Anti-Vibe',
      description:
        'No reescribimos por capricho ni vendemos horas opacas. Instalamos cuatro capas de ingeniería verificable sobre tu propio repositorio.',
      pillars: [
        {
          key: 'agents-md',
          title: 'AGENTS.md + reglas a medida',
          detail:
            'Guardrails explícitos en el repo para que tus futuros prompts respeten contratos, capas y seguridad.',
        },
        {
          key: 'ci-gate',
          title: 'Candado CI Quality Gate',
          detail:
            'Pipeline en GitHub Actions con lint, typecheck estricto, secret scanning y SonarQube bloqueando merges rotos.',
        },
        {
          key: 'anti-regression',
          title: 'Tests anti-regresión automatizados',
          detail:
            'Suite reproducible sobre permisos RLS, flujos de pago/auth y endpoints críticos antes de tocar producción.',
        },
        {
          key: 'clean-prs',
          title: 'Pull Requests limpios verificados',
          detail:
            'Entregas atómicas en tu repo con diffs auditables, métricas antes/después y cero cajas negras.',
        },
      ],
    },
  },
  journey: {
    sectionTitle: 'Tres pasos claros, sin presupuestos sorpresa',
    sectionSubtitle:
      'Empieza por una radiografía técnica en 48 horas. Si decides rescatar la app, descontamos el 100% del diagnóstico.',
    steps: [
      {
        stepNumber: '01',
        title: 'Diagnóstico 48h',
        priceRange: '590 €',
        duration: '48h',
        description:
          'Radiografía interactiva del repositorio, semáforo honesto Rescatar vs. Rehacer y el 1.er PR real en preview resolviendo el riesgo más crítico.',
        highlight: '100% descontable si contratas el rescate',
      },
      {
        stepNumber: '02',
        title: 'Rescate Anti-Regresión',
        priceRange: '2.500 € – 6.000 €',
        duration: '7–10 días',
        description:
          'Blindaje de BD y Auth, refactor modular de deuda crítica, suite de tests anti-regresión, instalación del Escudo Anti-Vibe y Dossier Production-Ready.',
        highlight: 'Precio cerrado por módulos antes de empezar',
      },
      {
        stepNumber: '03',
        title: 'Guardián de Producción',
        priceRange: '600 € – 1.200 €/mes',
        duration: 'Mensual',
        description:
          'Monitorización activa con Sentry, revisión técnica de PRs generados con IA por tu equipo y mantenimiento continuo de reglas CI y dependencias.',
        highlight: 'Opcional · Sin permanencia forzosa',
      },
    ],
  },
  calculator: {
    sectionTitle: 'Calculadora modular de rescate',
    sectionSubtitle:
      'Configura los módulos exactos que necesita tu codebase y obtén una estimación cerrada en segundos.',
    stackLabel: 'Stack objetivo',
    stacks: {
      web: {
        label: 'Web (Next.js / React / Supabase)',
        hint: 'Aplicaciones web con Lovable, Bolt, v0 o Cursor',
      },
      mobile: {
        label: 'Móvil (Flutter / Firebase)',
        hint: 'Apps iOS/Android con FlutterFlow, Cursor o Firebase',
      },
      both: {
        label: 'Híbrido (Web + Flutter)',
        hint: 'Backend compartido con clientes web y móvil',
      },
    },
    modules: {
      auth_rls: {
        title: 'Blindaje Auth & BD',
        description:
          'Cierre de acceso anónimo, políticas Row Level Security por tenant/usuario, rotación de secretos fuera del cliente y validación server-side.',
        deliverables: [
          'Auditoría y migraciones SQL RLS / Firestore Rules',
          'Middleware de sesión y validación JWT estricta',
          'Limpieza de claves expuestas + secret scanner en CI',
        ],
      },
      anti_regression_ci: {
        title: 'Suite Anti-Regresión + CI',
        description:
          'Cobertura automatizada de flujos críticos, contratos tipados, SonarQube Quality Gate y reglas AGENTS.md para frenar regresiones por prompts.',
        deliverables: [
          'Tests de integración y regresión sobre flujos clave',
          'GitHub Actions con typecheck, lint y Quality Gate',
          'Archivo AGENTS.md adaptado a la arquitectura del repo',
        ],
      },
      eaa_compliance: {
        title: 'Cumplimiento EAA / WCAG 2.2',
        description:
          'Adecuación técnica de accesibilidad web exigida por el European Accessibility Act (contraste, teclado, semántica y lectores de pantalla).',
        deliverables: [
          'Auditoría WCAG 2.2 AA sobre flujos principales',
          'Corrección de foco, landmarks ARIA y formularios',
          'Informe técnico de conformidad y checks en CI',
        ],
      },
      flutter_mobile: {
        title: 'Rescate Móvil Flutter',
        description:
          'Estabilización de estado, manejo seguro de tokens en dispositivo, permisos nativos, builds reproducibles y pruebas de widget/integración.',
        deliverables: [
          'Refactor de estado y navegación sin fugas ni crashes',
          'Almacenamiento seguro de tokens y reglas Firebase/API',
          'Pipeline de build Android/iOS + tests automatizados',
        ],
      },
      perf_sentry: {
        title: 'Rendimiento LCP & Sentry',
        description:
          'Optimización de Core Web Vitals, eliminación de memory leaks y consultas N+1, más telemetría de errores en tiempo real con alertas accionables.',
        deliverables: [
          'Perfilado LCP/INP con Chrome DevTools y reducción de bundle',
          'Resolución de fugas de memoria y re-renders bloqueantes',
          'Integración de Sentry con source maps y alertas limpias',
        ],
      },
    },
    diagnosticAddon: {
      title: 'Incluir Diagnóstico 48h (590 €)',
      subtitle:
        'Auditoría inicial en 48h con semáforo Rescatar vs. Rehacer y primer PR de mitigación en preview.',
      badge: '100% descontable en rescate',
    },
    summary: {
      heading: 'Estimación cerrada',
      modulesCountLabel: 'Módulos seleccionados',
      stackSummaryLabel: 'Stack',
      subtotalLabel: 'Subtotal módulos',
      diagnosticFeeLabel: 'Diagnóstico 48h',
      diagnosticCreditLabel: 'Descuento diagnóstico aplicado',
      totalLabel: 'Total estimado',
      timelineLabel: 'Plazo',
      daysUnit: 'días',
      requestCta: 'Solicitar con esta configuración',
      resetCta: 'Restablecer pack recomendado',
      emptyWarning:
        'Selecciona al menos un módulo o activa el Diagnóstico 48h para generar una configuración.',
      diagnosticOnlyBadge: 'Solo Diagnóstico 48h',
    },
  },
  modal: {
    title: 'Solicitar diagnóstico o rescate',
    subtitle:
      'Sin formularios eternos ni bases de datos intermediarias: copia el resumen técnico o ábrelo directo en tu cliente de correo.',
    closeLabel: 'Cerrar modal',
    fields: {
      nameLabel: 'Nombre',
      namePlaceholder: 'Ej. Laura Martínez',
      emailLabel: 'Email profesional',
      emailPlaceholder: 'laura@empresa.com',
      repoLabel: 'URL del repositorio (opcional)',
      repoPlaceholder: 'https://github.com/tu-org/tu-app',
      notesLabel: 'Contexto breve del proyecto',
      notesPlaceholder:
        'Ej. App hecha con Lovable + Supabase, 1.400 usuarios en beta y errores frecuentes tras últimos prompts.',
    },
    summaryHeading: 'Resumen de configuración',
    copyButton: 'Copiar resumen técnico',
    copiedFeedback: 'Resumen copiado al portapapeles',
    copyErrorFeedback: 'No se pudo copiar automáticamente; selecciona el texto manualmente.',
    mailtoButton: 'Enviar por email',
    bookingButton: 'Reservar llamada 20 min',
    mailtoSubjectPrefix: '[VibeShield] Solicitud de configuración',
    footerNote:
      'Tu configuración no se envía a servidores de terceros desde esta web; tú controlas el envío.',
  },
  guaranteesFaq: {
    guaranteesTitle: 'Tres garantías contractuales, sin letra pequeña',
    guarantees: [
      {
        id: 'honesty',
        title: 'Honestidad Rescatar vs. Rehacer',
        description:
          'Si en el Diagnóstico 48h detectamos que la arquitectura es inviable de parchear, te lo decimos con pruebas técnicas antes de gastar en un rescate.',
      },
      {
        id: 'ownership',
        title: 'Código 100% tuyo en tu repo',
        description:
          'Trabajamos mediante ramas y Pull Requests directamente sobre tu repositorio GitHub/GitLab. Sin dependencias propietarias ni lock-in.',
      },
      {
        id: 'fixed-price',
        title: 'Precios cerrados sin horas infladas',
        description:
          'Cada módulo tiene alcance, entregables y tarifa pública. Sabes exactamente qué se blinda, cuánto cuesta y en cuántos días se entrega.',
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqSubtitle: 'Respuestas directas de ingeniería sobre cómo rescatamos tu aplicación.',
    faqs: [
      {
        id: 'tools-supported',
        question: '¿Qué herramientas de origen rescatáis habitualmente?',
        answer:
          'Trabajamos a diario sobre repositorios generados con Lovable, Bolt.new, v0, Cursor, Replit y FlutterFlow, normalmente sobre Next.js/React, Supabase, Firebase y Flutter.',
      },
      {
        id: 'stop-shipping',
        question: '¿Tengo que congelar el producto mientras hacéis el rescate?',
        answer:
          'No hace falta parar el negocio. Trabajamos sobre ramas aisladas con PRs incrementales y verificados en preview para que el despliegue a main sea limpio y sin cortes.',
      },
      {
        id: 'diagnostic-credit',
        question: '¿Cómo funciona el descuento del Diagnóstico 48h?',
        answer:
          'Pagas 590 € por la radiografía completa y el primer PR en 48 horas. Si apruebas cualquier paquete de rescate, esos 590 € se descuentan íntegramente del total.',
      },
      {
        id: 'after-rescue',
        question: '¿Qué evita que la app vuelva a romperse cuando usemos IA después?',
        answer:
          'Dejamos instalado el Escudo Anti-Vibe: archivo AGENTS.md con las reglas de tu arquitectura, tests anti-regresión y un Quality Gate en CI que rechaza PRs inseguros o rotos.',
      },
      {
        id: 'nda-access',
        question: '¿Cómo gestionáis el acceso al código y los secretos?',
        answer:
          'Operamos bajo NDA estándar si lo necesitas, con acceso mínimo al repositorio y rotación inmediata de claves expuestas hacia variables de entorno en servidor.',
      },
    ],
  },
  footer: {
    tagline: 'Ingeniería de rescate y blindaje para aplicaciones creadas con IA.',
    rights: '© 2026 VibeShield. Ingeniería senior orientada a producción.',
    noDatabaseNote:
      'Sitio estático sin cookies invasivas ni almacenamiento de leads en servidor.',
    links: {
      home: 'Inicio',
      demo: 'Demo Radiografía',
      calculator: 'Calculadora',
      contact: 'Diagnóstico 48h',
    },
  },
  demo: {
    kicker: 'Radiografía Interactiva',
    title: 'Caso Demo: PulseCRM (Lovable + Supabase)',
    verdictPrefix: 'VEREDICTO:',
    verdictLabel: 'RESCATABLE CON REFACTOR MODULAR',
    kpis: {
      healthScoreLabel: 'Índice de Salud',
      criticalRisksLabel: 'Riesgos Críticos',
      rescueDaysLabel: 'Plazo de Rescate',
      daysUnit: 'días',
    },
    tabs: {
      security: '1. Seguridad Antes / Después',
      telemetry: '2. Telemetría (SonarQube & LCP)',
      pr: '3. Primer PR Real (#142)',
    },
    securityTab: {
      simulateButton: 'Simular petición sin token',
      simulatingLabel: 'Ejecutando petición anónima...',
      resetSimulationButton: 'Restablecer simulación',
      simulationActiveNotice:
        'Simulación en vivo: petición anónima contra /rest/v1/customers comparando el estado vulnerable previo vs. el blindaje RLS actual.',
      viewModeLabels: {
        split: 'Comparativa',
        before: 'Solo Antes',
        after: 'Solo Después',
      },
      beforeBadge: 'ANTES · VULNERABLE',
      afterBadge: 'DESPUÉS · BLINDADO',
      unauthLabel: 'Petición sin cabecera Authorization',
      testResultLabel: 'Verificación automática',
    },
    telemetryTab: {
      sectionTitle: 'Evidencia de herramientas reales de auditoría',
      beforeLabel: 'Antes',
      afterLabel: 'Después',
      sonarqubeTitle: 'SonarQube Quality Gate',
      devtoolsTitle: 'Chrome DevTools · Rendimiento y Memoria',
      sentryTitle: 'Sentry · Estabilidad en Producción',
    },
    prTab: {
      prTitle: 'PR #142 · fix(security): lock customers RLS policies & install AGENTS.md',
      branchLabel: 'Rama',
      checksHeading: 'Checks de CI obligatorios',
      filesHeading: 'Archivos auditados en el diff',
      allChecksPassedLabel: '4/4 checks en verde · Listo para merge',
    },
    summaryRow: {
      sonarqubeLabel: 'SonarQube Gate',
      devtoolsLabel: 'LCP (DevTools)',
      prPreviewLabel: 'Primer PR',
      checksSuffix: 'checks en verde',
    },
  },
};
