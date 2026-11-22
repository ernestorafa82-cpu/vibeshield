import {
  DIAGNOSTIC_OFFER,
  RECOMMENDED_PACK_IDS,
  RESCUE_MODULES,
} from '@/data/modules';
import type {
  CalculatorEstimate,
  CalculatorInput,
  Currency,
  Dictionary,
  Locale,
  ModuleId,
  QuoteModalFormValues,
  RescueModule,
  StackType,
} from '@/types/vibeshield';

const MODULE_MAP: ReadonlyMap<ModuleId, RescueModule> = new Map(
  RESCUE_MODULES.map((mod) => [mod.id, mod])
);

function canonicalizeModules(
  candidates: readonly string[],
  predicate?: (mod: RescueModule) => boolean
): ModuleId[] {
  const candidateSet = new Set(candidates);
  return RESCUE_MODULES.filter(
    (mod) => candidateSet.has(mod.id) && (!predicate || predicate(mod))
  ).map((mod) => mod.id);
}

/** Maps a supported UI locale to its billing display currency. */
export function getCurrencyForLocale(locale: Locale): Currency {
  return locale === 'es' ? 'EUR' : 'USD';
}

/** Formats a monetary integer deterministically without Intl runtime quirks. */
export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: Locale
): string {
  const rounded = Math.round(Number.isFinite(amount) ? amount : 0);
  const isNegative = rounded < 0;
  const absDigits = Math.abs(rounded).toString();
  const separator = locale === 'es' ? '.' : ',';
  const grouped = absDigits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  const sign = isNegative ? '-' : '';

  return currency === 'USD' ? `${sign}$${grouped}` : `${sign}${grouped} €`;
}

/**
 * Parses and sanitizes the `?modules=` query parameter.
 * Returns `null` when the parameter is absent so callers can distinguish
 * default visits from an explicit empty `?modules=` selection.
 */
export function parseModulesQuery(rawParam: string | null): ModuleId[] | null {
  if (rawParam === null) {
    return null;
  }

  const trimmed = rawParam.trim();
  if (trimmed === '') {
    return [];
  }

  const tokens = trimmed
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  return canonicalizeModules(tokens);
}

/** Resolves initial module selection from URL query, falling back to the recommended pack. */
export function resolveInitialModules(rawParam: string | null): ModuleId[] {
  const parsed = parseModulesQuery(rawParam);
  return parsed === null ? [...RECOMMENDED_PACK_IDS] : parsed;
}

/** Infers the initial stack toggle from a sanitized list of selected modules. */
export function resolveInitialStack(modules: readonly ModuleId[]): StackType {
  const validIds = canonicalizeModules(modules);
  const hasMobile = validIds.includes('flutter_mobile');
  const hasWeb = validIds.some((id) => id !== 'flutter_mobile');

  if (hasMobile && hasWeb) {
    return 'both';
  }
  if (hasMobile) {
    return 'mobile';
  }
  return 'web';
}

/** Filters currently selected modules to those compatible with `nextStack`. */
export function applyStackChange(
  currentModules: readonly ModuleId[],
  nextStack: StackType
): ModuleId[] {
  return canonicalizeModules(currentModules, (mod) =>
    mod.supportedStacks.includes(nextStack)
  );
}

/** Computes pricing, 48h diagnostic credit, timeline and selection flags. */
export function calculateEstimate(input: CalculatorInput): CalculatorEstimate {
  const selectedModules = canonicalizeModules(input.selectedModules, (mod) =>
    mod.supportedStacks.includes(input.stack)
  );

  const modulesSubtotal = selectedModules.reduce((sum, id) => {
    const mod = MODULE_MAP.get(id);
    return sum + (mod ? mod.price[input.currency] : 0);
  }, 0);

  const diagnosticFee = input.includeDiagnostic
    ? DIAGNOSTIC_OFFER.price[input.currency]
    : 0;

  const diagnosticDiscount =
    input.includeDiagnostic &&
    selectedModules.length > 0 &&
    DIAGNOSTIC_OFFER.deductibleOnRescue
      ? diagnosticFee
      : 0;

  const totalPrice = modulesSubtotal + diagnosticFee - diagnosticDiscount;

  const estimatedDays =
    selectedModules.length > 0
      ? selectedModules.reduce((sum, id) => {
          const mod = MODULE_MAP.get(id);
          return sum + (mod ? mod.estimatedDays : 0);
        }, 0)
      : input.includeDiagnostic
        ? DIAGNOSTIC_OFFER.estimatedDays
        : 0;

  const isDiagnosticOnly =
    selectedModules.length === 0 && input.includeDiagnostic;
  const hasSelection = selectedModules.length > 0 || input.includeDiagnostic;

  return {
    selectedModules,
    includeDiagnostic: input.includeDiagnostic,
    stack: input.stack,
    currency: input.currency,
    modulesSubtotal,
    diagnosticFee,
    diagnosticDiscount,
    totalPrice,
    estimatedDays,
    isDiagnosticOnly,
    hasSelection,
  };
}

/** Builds a structured plain-text quote summary in the active locale. */
export function buildQuoteSummaryText(
  estimate: CalculatorEstimate,
  form: QuoteModalFormValues,
  locale: Locale,
  dict: Dictionary
): string {
  const lines: string[] = [dict.modal.summaryHeading, ''];

  const optionalFields: readonly [string, string][] = [
    [dict.modal.fields.nameLabel, form.clientName],
    [dict.modal.fields.emailLabel, form.clientEmail],
    [dict.modal.fields.repoLabel, form.repositoryUrl],
    [dict.modal.fields.notesLabel, form.notes],
  ];

  let hasClientInfo = false;
  for (const [label, rawValue] of optionalFields) {
    const value = rawValue.trim();
    if (value) {
      lines.push(`${label}: ${value}`);
      hasClientInfo = true;
    }
  }
  if (hasClientInfo) {
    lines.push('');
  }

  lines.push(
    `${dict.calculator.summary.stackSummaryLabel}: ${dict.calculator.stacks[estimate.stack].label}`
  );

  if (estimate.selectedModules.length > 0) {
    lines.push(
      `${dict.calculator.summary.modulesCountLabel} (${estimate.selectedModules.length}):`
    );
    for (const id of estimate.selectedModules) {
      const mod = MODULE_MAP.get(id);
      if (mod) {
        lines.push(
          `- ${dict.calculator.modules[id].title}: ${formatCurrency(
            mod.price[estimate.currency],
            estimate.currency,
            locale
          )}`
        );
      }
    }
    lines.push(
      `${dict.calculator.summary.subtotalLabel}: ${formatCurrency(
        estimate.modulesSubtotal,
        estimate.currency,
        locale
      )}`
    );
  }

  if (estimate.isDiagnosticOnly) {
    lines.push(
      `${dict.calculator.diagnosticAddon.title} (${dict.calculator.summary.diagnosticOnlyBadge}): ${formatCurrency(
        estimate.diagnosticFee,
        estimate.currency,
        locale
      )}`
    );
  } else if (estimate.includeDiagnostic) {
    lines.push(
      `${dict.calculator.summary.diagnosticFeeLabel}: ${formatCurrency(
        estimate.diagnosticFee,
        estimate.currency,
        locale
      )}`
    );
    lines.push(
      `${dict.calculator.summary.diagnosticCreditLabel}: -${formatCurrency(
        estimate.diagnosticDiscount,
        estimate.currency,
        locale
      )}`
    );
  }

  lines.push('');
  lines.push(
    `${dict.calculator.summary.totalLabel}: ${formatCurrency(
      estimate.totalPrice,
      estimate.currency,
      locale
    )}`
  );
  lines.push(
    `${dict.calculator.summary.timelineLabel}: ${estimate.estimatedDays} ${dict.calculator.summary.daysUnit}`
  );

  return lines.join('\n');
}

/** Builds a properly percent-encoded `mailto:` link. */
export function buildMailtoHref(
  contactEmail: string,
  subject: string,
  body: string
): string {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Builds a deep link back to `#calculator` with sanitized module IDs and locale. */
export function buildCalculatorShareHref(
  modules: readonly ModuleId[],
  locale: Locale,
  includeDiagnostic?: boolean
): string {
  const validModules = canonicalizeModules(modules);
  const queryParts = [`modules=${validModules.join(',')}`, `lang=${locale}`];

  if (includeDiagnostic === true) {
    queryParts.push('diagnostic=1');
  }

  return `/?${queryParts.join('&')}#calculator`;
}
