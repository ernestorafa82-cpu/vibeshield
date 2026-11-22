import type { Dictionary } from '@/types/vibeshield';

export const esDictionary: Dictionary = {
  meta: {
    homeTitle: 'Velnea — Auditoría y estabilización de software generado con IA',
    homeDescription:
      'Auditamos tu repositorio en 48 horas y en una semana dejamos tu app de Lovable, Cursor o Bolt lista para cobrar con seguridad real, tests y precios públicos.',
    demoTitle: 'Expediente Técnico: PulseCRM — Velnea',
    demoDescription:
      'Ejemplo real de auditoría técnica: fugas RLS antes y después, telemetría de rendimiento y primer Pull Request verificado.',
  },
  nav: {
    howItWorks: 'Método',
    calculator: 'Tarifario',
    demoXray: 'Expediente Demo',
    diagnosticCta: 'Diagnóstico 48h',
    demoBreadcrumbRoot: 'Velnea',
    demoBreadcrumbSection: 'expediente',
    demoCaseName: 'PulseCRM',
    loadModulesCta: 'Cargar en tarifario',
    switchLanguageLabel: 'Selector de idioma',
  },
  hero: {
    badge: 'VELNEA · AUDITORÍA & RESCATE · WEB Y FLUTTER',
    title: 'Tu app de IA, lista para cobrar.',
    subtitle:
      'Auditamos tu repositorio en 48 horas y en una semana cerramos fugas de datos, fijamos tests de regresión y te entregamos código mantenible.',
    primaryCta: 'Diagnóstico 48h — 590 €',
    secondaryCta: 'Ver expediente demo',
    pipelineCard: {
      title: 'Inspección de arquitectura',
      branch: 'main',
      statusLabel: 'VERIFICADO',
      checks: [
        {
          id: 'auth-rls',
          label: 'Políticas RLS y sesión JWT',
          detail: 'Aislamiento por cuenta verificado con HTTP 403',
        },
        {
          id: 'sonarqube-gate',
          label: 'Análisis estático y CVEs',
          detail: '0 críticos · duplicación por debajo del 3 %',
        },
        {
          id: 'anti-regression',
          label: 'Suite de regresión automatizada',
          detail: '48 pruebas sobre pagos, permisos y API',
        },
        {
          id: 'agents-guardrails',
          label: 'Reglas de arquitectura (AGENTS.md)',
          detail: 'Límites explícitos para seguir iterando con IA',
        },
      ],
    },
  },
  problemSolution: {
    sectionTitle: 'Lo que encontramos al abrir repositorios hechos con prompts',
    sectionSubtitle:
      'Generar un prototipo hoy lleva un fin de semana. El problema aparece cuando entra el primer cliente real o cuando el siguiente cambio rompe lo que ayer funcionaba.',
    problem: {
      badge: 'HALLAZGOS HABITUALES',
      title: 'Cuatro fallos que se repiten en casi todas las auditorías',
      statHighlight: 'Revisamos código real en staging, no diapositivas.',
      description:
        'La interfaz convence en una llamada comercial, pero la capa de datos y despliegue queda expuesta desde el primer día.',
      bullets: [
        'Tablas de Supabase o reglas de Firestore legibles sin autenticación porque nunca se activó RLS.',
        'Claves privadas de API o lógica de facturación filtradas en el código del navegador.',
        'Ningún test automático: cada ajuste en producción obliga a cruzar los dedos.',
        'Dependencias circulares y archivos duplicados que hacen que Cursor o Lovable rompan pantallas antiguas al añadir una nueva.',
      ],
    },
    solution: {
      badge: 'INTERVENCIÓN VELNEA',
      title: 'Cómo estabilizamos tu repositorio sin reescribirlo entero',
      description:
        'Trabajamos directamente en tu Git con Pull Requests pequeños, medibles y auditables por tu equipo.',
      pillars: [
        {
          key: 'agents-md',
          title: 'Reglas en el repo (AGENTS.md)',
          detail:
            'Documentamos contratos, fronteras de datos y convenciones para que futuros prompts respeten la arquitectura.',
        },
        {
          key: 'ci-gate',
          title: 'Control automático en cada merge',
          detail:
            'GitHub Actions con typecheck estricto, linter, escáner de secretos y Quality Gate antes de publicar.',
        },
        {
          key: 'anti-regression',
          title: 'Pruebas sobre lo que cuesta dinero',
          detail:
            'Tests reproducibles cubriendo permisos RLS, cobros, login y endpoints críticos.',
        },
        {
          key: 'clean-prs',
          title: 'Entregas en tu propio repositorio',
          detail:
            'Diffs claros, métricas de antes y después y propiedad del 100 % del código desde el minuto uno.',
        },
      ],
    },
  },
  journey: {
    sectionTitle: 'Tres fases con precio cerrado antes de empezar',
    sectionSubtitle:
      'Primero medimos el estado real en 48 horas. Si decides ejecutar el rescate con nosotros, descontamos íntegramente el importe del diagnóstico.',
    steps: [
      {
        stepNumber: '01',
        title: 'Diagnóstico técnico',
        priceRange: '590 €',
        duration: '48 horas',
        description:
          'Expediente interactivo con riesgos priorizados, veredicto honesto sobre si conviene rescatar o rehacer el backend y un primer Pull Request real desplegado en preview.',
        highlight: '100 % descontable si contratas el rescate',
      },
      {
        stepNumber: '02',
        title: 'Rescate y estabilización',
        priceRange: '2.500 € – 6.000 €',
        duration: '7–10 días',
        description:
          'Cierre de brechas de base de datos y autenticación, limpieza de deuda bloqueante, suite de tests, configuración de CI/Sentry y dossier ejecutivo para inversores o clientes B2B.',
        highlight: 'Tarifa cerrada por módulos seleccionados',
      },
      {
        stepNumber: '03',
        title: 'Acompañamiento técnico',
        priceRange: '600 € – 1.200 €/mes',
        duration: 'Mensual',
        description:
          'Revisión periódica de Pull Requests generados por tu equipo, seguimiento de alertas en Sentry y mantenimiento de reglas y dependencias críticas.',
        highlight: 'Opcional · Cancela cuando quieras',
      },
    ],
  },
  calculator: {
    sectionTitle: 'Tarifario modular',
    sectionSubtitle:
      'Selecciona los bloques que necesita tu proyecto para calcular un presupuesto cerrado y un plazo real.',
    stackLabel: 'Tecnología',
    stacks: {
      web: {
        label: 'Web (Next.js / React / Supabase)',
        hint: 'Proyectos creados con Lovable, Bolt, v0 o Cursor',
      },
      mobile: {
        label: 'Móvil (Flutter / Firebase)',
        hint: 'Apps iOS y Android con compilación o estado inestable',
      },
      both: {
        label: 'Híbrido (Web + Flutter)',
        hint: 'Producto multiplataforma compartiendo backend',
      },
    },
    modules: {
      auth_rls: {
        title: 'Seguridad Auth y políticas BD (RLS / Firestore)',
        description:
          'Cierre de lecturas anónimas, aislamiento por cuenta en base de datos, rotación de secretos fuera del cliente y validación JWT en servidor.',
        deliverables: [
          'Migraciones SQL RLS o Firestore Rules con tests de denegación',
          'Validación de sesión y permisos en rutas privadas',
          'Limpieza de claves expuestas y control en CI',
        ],
      },
      anti_regression_ci: {
        title: 'Tests de regresión, CI y reglas de repo',
        description:
          'Pruebas automatizadas sobre flujos críticos, pipeline en GitHub Actions y archivo AGENTS.md para evitar que nuevos prompts rompan producción.',
        deliverables: [
          'Suite de integración y regresión sobre rutas clave',
          'Workflow CI con typecheck, lint y Quality Gate',
          'Guía técnica AGENTS.md adaptada a tu arquitectura',
        ],
      },
      eaa_compliance: {
        title: 'Adecuación EAA / WCAG 2.2 AA',
        description:
          'Correcciones reales en código para cumplir la Ley 11/2023 y la norma UNE-EN 301 549 en e-commerce y SaaS europeos.',
        deliverables: [
          'Semántica HTML, contraste y navegación completa por teclado',
          'Atributos ARIA en formularios, pestañas y modales',
          'Informe técnico de conformidad listo para clientes',
        ],
      },
      flutter_mobile: {
        title: 'Estabilización móvil (Flutter / Android)',
        description:
          'Limpieza de arquitectura de estado, almacenamiento seguro de tokens, corrección de cierres inesperados y verificación de builds.',
        deliverables: [
          'Análisis estático estricto y tests de widgets críticos',
          'Auditoría de permisos, sesión y rendimiento en móvil',
          'Pipeline estable de compilación Android / iOS',
        ],
      },
      perf_sentry: {
        title: 'Rendimiento LCP, memoria y Sentry',
        description:
          'Perfilado real en Chrome DevTools, corrección de fugas de memoria y consultas lentas, e instrumentación completa de errores en Sentry.',
        deliverables: [
          'Optimización de carga inicial (LCP) y peso del bundle',
          'Resolución de fugas de memoria y errores de consola',
          'Alertas en Sentry con source maps legibles',
        ],
      },
    },
    diagnosticAddon: {
      title: 'Añadir diagnóstico técnico 48h',
      subtitle:
        'Expediente completo de tu repositorio + 1.er PR en preview antes de empezar el rescate. Se descuenta al 100 % si ejecutas módulos.',
      badge: '100 % descontable',
    },
    summary: {
      heading: 'Resumen de propuesta',
      modulesCountLabel: 'Módulos seleccionados',
      stackSummaryLabel: 'Stack',
      subtotalLabel: 'Subtotal módulos',
      diagnosticFeeLabel: 'Diagnóstico 48h',
      diagnosticCreditLabel: 'Crédito diagnóstico (−100 %)',
      totalLabel: 'Importe cerrado',
      timelineLabel: 'Plazo estimado',
      daysUnit: 'días',
      requestCta: 'Preparar propuesta cerrada',
      resetCta: 'Restablecer selección',
      emptyWarning:
        'Marca al menos un módulo o el Diagnóstico 48h para generar una propuesta.',
      diagnosticOnlyBadge: 'Solo diagnóstico 48h',
    },
  },
  modal: {
    title: 'Preparar solicitud técnica',
    subtitle:
      'Añade tus datos si quieres personalizar el resumen. Puedes copiarlo o abrirlo directamente en tu correo.',
    closeLabel: 'Cerrar ventana',
    fields: {
      nameLabel: 'Tu nombre',
      namePlaceholder: 'Ej. Laura Martínez',
      emailLabel: 'Correo de contacto',
      emailPlaceholder: 'laura@empresa.es',
      repoLabel: 'URL del repositorio o web (opcional)',
      repoPlaceholder: 'https://github.com/tu-org/tu-app',
      notesLabel: 'Contexto técnico (opcional)',
      notesPlaceholder:
        'Cuéntanos brevemente qué está fallando o qué fecha de lanzamiento tienes...',
    },
    summaryHeading: 'Detalle de la propuesta',
    copyButton: 'Copiar resumen',
    copiedFeedback: 'Resumen copiado al portapapeles',
    copyErrorFeedback:
      'No se pudo acceder al portapapeles. Puedes seleccionar y copiar el texto manualmente.',
    mailtoButton: 'Enviar por correo',
    bookingButton: 'Reservar llamada de 15 min',
    mailtoSubjectPrefix: '[Velnea] Propuesta técnica',
    footerNote:
      'Esta web no envía tus datos a ningún servidor de terceros; tú decides cuándo y cómo escribirnos.',
  },
  guaranteesFaq: {
    guaranteesTitle: 'Condiciones de trabajo',
    guarantees: [
      {
        id: 'honesty',
        title: 'Dictamen honesto en 48 horas',
        description:
          'Si el modelo de datos está roto de raíz y resulta más barato rehacer el backend, te lo decimos en el diagnóstico antes de presupuestar nada más.',
      },
      {
        id: 'ownership',
        title: 'El código siempre es tuyo',
        description:
          'Trabajamos por Pull Requests en tu propio GitHub. Sin librerías propietarias, sin permanencias y sin dependencias hacia Velnea.',
      },
      {
        id: 'fixed-price',
        title: 'Tarifa cerrada por entregable',
        description:
          'Cada módulo tiene precio fijo, alcance escrito y criterios verificables: build limpio, tests en verde y Quality Gate aprobado.',
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqSubtitle:
      'Respuestas directas sobre plazos, confidencialidad y cómo trabajamos sobre tu repositorio.',
    faqs: [
      {
        id: 'faq-after-rescue',
        question: '¿Podremos seguir usando Cursor o Lovable después?',
        answer:
          'Sí. Dejamos configurado un archivo AGENTS.md con las reglas de tu arquitectura y un pipeline CI que frena cualquier cambio que rompa tests o permisos.',
      },
      {
        id: 'faq-diagnostic-credit',
        question: '¿Cómo funciona el descuento del Diagnóstico 48h?',
        answer:
          'Pagas 590 € por la auditoría, el expediente interactivo y el primer PR en preview. Si en los siguientes 30 días contratas cualquier rescate, esos 590 € se descuentan del total.',
      },
      {
        id: 'faq-nda',
        question: '¿Firmáis NDA y cómo accedéis al código?',
        answer:
          'Firmamos acuerdo de confidencialidad antes de ver una sola línea. Trabajamos con acceso temporal de solo lectura durante el diagnóstico y en rama dedicada durante el rescate, sin pedir credenciales de producción.',
      },
      {
        id: 'faq-flutter',
        question: '¿Auditáis también aplicaciones móviles en Flutter?',
        answer:
          'Sí. Revisamos gestión de estado, seguridad de tokens, reglas de Firebase, rendimiento y compilación de releases Android e iOS.',
      },
      {
        id: 'faq-eaa',
        question: '¿El módulo EAA sustituye a un widget de accesibilidad?',
        answer:
          'Los widgets flotantes de una línea de JavaScript no cumplen la Ley 11/2023 ni UNE-EN 301 549. Corregimos el HTML, el foco por teclado, el contraste y los atributos ARIA directamente en tu código.',
      },
    ],
  },
  footer: {
    tagline:
      'Velnea — Estudio técnico de auditoría, seguridad y estabilización de software.',
    rights: '© 2026 Velnea. Todos los derechos reservados.',
    noDatabaseNote:
      'Sitio estático sin cookies de rastreo ni servidores intermedios.',
    links: {
      home: 'Inicio',
      demo: 'Expediente Demo',
      calculator: 'Tarifario',
      contact: 'Contacto',
    },
  },
  demo: {
    kicker: 'Expediente técnico de muestra · VL-AUDIT-142',
    title: 'Caso Demo: PulseCRM (Lovable + Supabase)',
    verdictPrefix: 'VEREDICTO:',
    verdictLabel: 'RESCATABLE CON REFACTOR MODULAR',
    kpis: {
      healthScoreLabel: 'Índice de salud',
      criticalRisksLabel: 'Hallazgos críticos',
      rescueDaysLabel: 'Plazo de rescate',
      daysUnit: 'días',
    },
    tabs: {
      security: '01. Seguridad RLS',
      telemetry: '02. Telemetría (SonarQube & LCP)',
      pr: '03. Primer PR Real (#142)',
    },
    securityTab: {
      simulateButton: 'Simular petición sin token',
      simulatingLabel: 'Petición anónima ejecutada',
      resetSimulationButton: 'Ocultar trazas',
      simulationActiveNotice:
        'Petición GET sin cabecera Authorization: antes devolvía 1.420 registros con CIF y correo; tras el PR #142 el motor RLS bloquea la consulta con HTTP 403.',
      viewModeLabels: {
        split: 'Comparativa',
        before: 'Solo Antes',
        after: 'Solo Después',
      },
      beforeBadge: 'ANTES · EXPUESTO',
      afterBadge: 'DESPUÉS · VERIFICADO',
      unauthLabel: 'Petición sin cabecera Authorization',
      testResultLabel: 'Verificación CI',
    },
    telemetryTab: {
      sectionTitle: 'Mediciones reales de auditoría (antes vs. después)',
      beforeLabel: 'Antes',
      afterLabel: 'Después',
      sonarqubeTitle: 'SonarQube',
      devtoolsTitle: 'Chrome DevTools',
      sentryTitle: 'Sentry',
    },
    prTab: {
      prTitle: 'PR #142 — Cierre RLS en customers, tests anti-fuga y AGENTS.md',
      branchLabel: 'Rama',
      checksHeading: 'Comprobaciones CI (4/4)',
      filesHeading: 'Archivos modificados (3)',
      allChecksPassedLabel: '4/4 checks aprobados',
    },
    summaryRow: {
      sonarqubeLabel: 'SonarQube Gate',
      devtoolsLabel: 'LCP (DevTools)',
      prPreviewLabel: 'Primer PR #142',
      checksSuffix: 'checks aprobados',
    },
  },
};
