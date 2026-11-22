import type {
  DiagnosticOffer,
  ModuleId,
  RescueModule,
} from '@/types/vibeshield';

export const DIAGNOSTIC_OFFER: DiagnosticOffer = {
  id: 'diagnostic_48h',
  price: {
    EUR: 590,
    USD: 590,
  },
  estimatedDays: 2,
  deductibleOnRescue: true,
};

export const RESCUE_MODULES: readonly RescueModule[] = [
  {
    id: 'auth_rls',
    category: 'security',
    price: { EUR: 690, USD: 690 },
    estimatedDays: 2,
    supportedStacks: ['web', 'mobile', 'both'],
    recommendedByDefault: true,
  },
  {
    id: 'anti_regression_ci',
    category: 'quality',
    price: { EUR: 890, USD: 890 },
    estimatedDays: 3,
    supportedStacks: ['web', 'mobile', 'both'],
    recommendedByDefault: true,
  },
  {
    id: 'eaa_compliance',
    category: 'compliance',
    price: { EUR: 790, USD: 790 },
    estimatedDays: 3,
    supportedStacks: ['web', 'both'],
    recommendedByDefault: true,
  },
  {
    id: 'flutter_mobile',
    category: 'mobile',
    price: { EUR: 990, USD: 990 },
    estimatedDays: 4,
    supportedStacks: ['mobile', 'both'],
    recommendedByDefault: false,
  },
  {
    id: 'perf_sentry',
    category: 'performance',
    price: { EUR: 590, USD: 590 },
    estimatedDays: 2,
    supportedStacks: ['web', 'mobile', 'both'],
    recommendedByDefault: false,
  },
] as const;

export const RECOMMENDED_PACK_IDS: readonly ModuleId[] = [
  'auth_rls',
  'anti_regression_ci',
  'eaa_compliance',
] as const;

export const DEMO_RECOMMENDED_MODULES: readonly ModuleId[] = [
  'auth_rls',
  'anti_regression_ci',
  'eaa_compliance',
] as const;
