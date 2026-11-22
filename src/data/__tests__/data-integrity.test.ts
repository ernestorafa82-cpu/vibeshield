import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  dictionaries,
  getDictionary,
  isValidLocale,
} from '@/data/i18n';
import { esDictionary } from '@/data/i18n/es';
import { enDictionary } from '@/data/i18n/en';
import { getDemoCaseData } from '@/data/demo-case';
import { DEMO_RECOMMENDED_MODULES, RESCUE_MODULES } from '@/data/modules';
import type { Locale, ModuleId } from '@/types/vibeshield';

function collectShapeAndCheckNonEmptyStrings(
  value: unknown,
  path: string,
  emptyPaths: string[],
): unknown {
  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      emptyPaths.push(path);
    }
    return 'string';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return typeof value;
  }

  if (Array.isArray(value)) {
    return value.map((item, idx) =>
      collectShapeAndCheckNonEmptyStrings(item, `${path}[${idx}]`, emptyPaths),
    );
  }

  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const shape: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      shape[key] = collectShapeAndCheckNonEmptyStrings(
        record[key],
        path ? `${path}.${key}` : key,
        emptyPaths,
      );
    }
    return shape;
  }

  return typeof value;
}

describe('i18n dictionaries integrity', () => {
  it('validates locales properly with isValidLocale and DEFAULT_LOCALE', () => {
    expect(DEFAULT_LOCALE).toBe('es');
    expect(isValidLocale('es')).toBe(true);
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('fr')).toBe(false);
    expect(isValidLocale('')).toBe(false);
    expect(isValidLocale(null)).toBe(false);
    expect(isValidLocale(undefined)).toBe(false);
  });

  it('returns the matching dictionary for each locale', () => {
    expect(getDictionary('es')).toBe(esDictionary);
    expect(getDictionary('en')).toBe(enDictionary);
    expect(dictionaries.es).toBe(esDictionary);
    expect(dictionaries.en).toBe(enDictionary);
  });

  it('has exact recursive key parity between es and en with zero empty strings', () => {
    const emptyEs: string[] = [];
    const emptyEn: string[] = [];

    const esShape = collectShapeAndCheckNonEmptyStrings(esDictionary, 'es', emptyEs);
    const enShape = collectShapeAndCheckNonEmptyStrings(enDictionary, 'en', emptyEn);

    expect(emptyEs).toEqual([]);
    expect(emptyEn).toEqual([]);
    expect(esShape).toEqual(enShape);
  });

  it('includes all 5 ModuleId entries in both es and en calculator modules', () => {
    const expectedIds: ModuleId[] = RESCUE_MODULES.map((m) => m.id);
    expect(expectedIds).toHaveLength(5);

    for (const locale of ['es', 'en'] as const satisfies readonly Locale[]) {
      const dict = getDictionary(locale);
      const moduleKeys = Object.keys(dict.calculator.modules).sort();
      expect(moduleKeys).toEqual([...expectedIds].sort());

      for (const id of expectedIds) {
        const mod = dict.calculator.modules[id];
        expect(mod.title.trim().length).toBeGreaterThan(0);
        expect(mod.description.trim().length).toBeGreaterThan(0);
        expect(mod.deliverables.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('demo-case data integrity', () => {
  it.each(['es', 'en'] as const)(
    'returns exact PulseCRM demo case metrics and artifacts for %s',
    (locale) => {
      const data = getDemoCaseData(locale);

      expect(data.recommendedModules).toEqual(DEMO_RECOMMENDED_MODULES);
      expect(data.healthScore).toEqual({ before: 34, after: 96, max: 100 });
      expect(data.criticalRisks).toEqual({ before: 4, after: 0 });
      expect(data.rescueDays).toBe(8);

      // Security before vs after
      expect(data.security.before.method).toBe('GET');
      expect(data.security.before.endpoint).toBe('/rest/v1/customers');
      expect(data.security.before.httpStatus).toBe(200);
      expect(data.security.before.httpStatusText).toBe('OK');
      expect(data.security.before.testPassed).toBe(false);
      expect(data.security.before.highlights.length).toBeGreaterThanOrEqual(2);

      expect(data.security.after.method).toBe('GET');
      expect(data.security.after.endpoint).toBe('/rest/v1/customers');
      expect(data.security.after.httpStatus).toBe(403);
      expect(data.security.after.httpStatusText).toBe('Forbidden');
      expect(data.security.after.testPassed).toBe(true);
      expect(data.security.after.highlights.length).toBeGreaterThanOrEqual(2);

      // Telemetry
      expect(data.telemetry.sonarqubeGateBefore).toBe('FAILED');
      expect(data.telemetry.sonarqubeGateAfter).toBe('PASSED');
      expect(data.telemetry.duplicationBefore).toBe('31%');
      expect(data.telemetry.duplicationAfter).toBe('2.4%');
      expect(data.telemetry.lcpBefore).toBe('4.8s');
      expect(data.telemetry.lcpAfter).toBe('1.2s');
      expect(data.telemetry.lcpSparkline).toEqual([4.8, 4.5, 3.9, 3.1, 2.2, 1.5, 1.2]);
      expect(data.telemetry.metrics).toHaveLength(6);

      const tools = new Set(data.telemetry.metrics.map((m) => m.tool));
      expect(tools.has('sonarqube')).toBe(true);
      expect(tools.has('chrome_devtools')).toBe(true);
      expect(tools.has('sentry')).toBe(true);

      // Pull request #142
      expect(data.pullRequest.number).toBe(142);
      expect(data.pullRequest.branch).toBe('fix/rls-customers-guardrails');
      expect(data.pullRequest.baseBranch).toBe('main');
      expect(data.pullRequest.checks).toHaveLength(4);
      expect(data.pullRequest.checks.every((c) => c.status === 'passed')).toBe(true);

      expect(data.pullRequest.files).toHaveLength(3);
      const filePaths = data.pullRequest.files.map((f) => f.path);
      expect(filePaths).toContain('AGENTS.md');
      expect(filePaths).toContain('supabase/migrations/20261122_lock_customers_rls.sql');
      expect(filePaths).toContain('src/security/__tests__/customers-rls.test.ts');
    },
  );
});
