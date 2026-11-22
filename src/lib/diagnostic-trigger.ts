import { DIAGNOSTIC_CTA_EVENT } from '@/types/vibeshield';

/**
 * Dispatches the diagnostic selection event and smoothly scrolls to #calculator.
 */
export function triggerDiagnosticSelection(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(DIAGNOSTIC_CTA_EVENT));

  const calculatorEl = document.getElementById('calculator');
  if (calculatorEl && typeof calculatorEl.scrollIntoView === 'function') {
    calculatorEl.scrollIntoView({ behavior: 'smooth' });
  }
}
