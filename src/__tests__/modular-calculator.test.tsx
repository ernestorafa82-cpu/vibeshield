import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ModularCalculator } from '@/components/landing/ModularCalculator';
import { LocaleProvider } from '@/context/LocaleContext';
import { dictionaries } from '@/data/i18n';
import { enDictionary } from '@/data/i18n/en';
import { esDictionary } from '@/data/i18n/es';
import { DIAGNOSTIC_CTA_EVENT } from '@/types/vibeshield';

const mockUseSearchParams = vi.fn<() => URLSearchParams>();

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderCalculator(initialLocale: 'es' | 'en' = 'es') {
  return render(
    <LocaleProvider dictionaries={dictionaries} initialLocale={initialLocale}>
      <ModularCalculator />
    </LocaleProvider>,
  );
}

describe('ModularCalculator & RequestModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    window.localStorage.clear();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders default recommended pack without query params: 2.370 € and 8 días in ES, $2,370 in EN', async () => {
    const { unmount } = renderCalculator('es');

    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
        '2.370 €',
      );
    });
    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('8 días');
    expect(
      screen.getByRole('button', { name: esDictionary.calculator.stacks.web.label }),
    ).toHaveAttribute('aria-pressed', 'true');

    unmount();

    mockUseSearchParams.mockReturnValue(new URLSearchParams('lang=en'));
    renderCalculator('en');

    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
        '$2,370',
      );
    });
    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('8 days');
  });

  it('updates total price and estimated days immediately when toggling modules', async () => {
    renderCalculator('es');

    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
        '2.370 €',
      );
    });

    const eaaCheckbox = screen.getByRole('checkbox', {
      name: new RegExp(
        escapeRegExp(esDictionary.calculator.modules.eaa_compliance.title),
        'i',
      ),
    });
    expect(eaaCheckbox).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(eaaCheckbox);

    expect(eaaCheckbox).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
      '1.580 €',
    );
    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('5 días');

    const perfCheckbox = screen.getByRole('checkbox', {
      name: new RegExp(
        escapeRegExp(esDictionary.calculator.modules.perf_sentry.title),
        'i',
      ),
    });
    fireEvent.click(perfCheckbox);

    expect(perfCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
      '2.170 €',
    );
    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('7 días');
  });

  it('auto-switches stack to both when clicking an incompatible module on web', async () => {
    renderCalculator('es');

    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
        '2.370 €',
      );
    });

    const flutterCheckbox = screen.getByRole('checkbox', {
      name: new RegExp(
        escapeRegExp(esDictionary.calculator.modules.flutter_mobile.title),
        'i',
      ),
    });
    expect(flutterCheckbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(flutterCheckbox);

    expect(
      screen.getByRole('button', { name: esDictionary.calculator.stacks.both.label }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(flutterCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
      '3.360 €',
    );
    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('12 días');
  });

  it('preselects sanitized modules from ?modules=auth_rls,invalid_id,auth_rls,flutter_mobile (1.680 €, 6 días, both) and drops flutter_mobile when switching to web (690 €)', async () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('modules=auth_rls,invalid_id,auth_rls,flutter_mobile'),
    );

    renderCalculator('es');

    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
        '1.680 €',
      );
    });

    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('6 días');
    expect(
      screen.getByRole('button', { name: esDictionary.calculator.stacks.both.label }),
    ).toHaveAttribute('aria-pressed', 'true');

    const authCheckbox = screen.getByRole('checkbox', {
      name: new RegExp(
        escapeRegExp(esDictionary.calculator.modules.auth_rls.title),
        'i',
      ),
    });
    const flutterCheckbox = screen.getByRole('checkbox', {
      name: new RegExp(
        escapeRegExp(esDictionary.calculator.modules.flutter_mobile.title),
        'i',
      ),
    });
    const ciCheckbox = screen.getByRole('checkbox', {
      name: new RegExp(
        escapeRegExp(esDictionary.calculator.modules.anti_regression_ci.title),
        'i',
      ),
    });
    expect(authCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(flutterCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(ciCheckbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(
      screen.getByRole('button', { name: esDictionary.calculator.stacks.web.label }),
    );

    expect(
      screen.getByRole('button', { name: esDictionary.calculator.stacks.web.label }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(flutterCheckbox).toHaveAttribute('aria-checked', 'false');
    expect(authCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('calculator-total-price')).toHaveTextContent('690 €');
    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('2 días');
  });

  it('disables request CTA and shows emptyWarning alert when ?modules= is empty, and restores recommended pack on reset', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('modules='));

    renderCalculator('es');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        esDictionary.calculator.summary.emptyWarning,
      );
    });

    const requestBtn = screen.getByRole('button', {
      name: esDictionary.calculator.summary.requestCta,
    });
    expect(requestBtn).toBeDisabled();
    expect(screen.getByTestId('calculator-total-price')).toHaveTextContent('0 €');

    fireEvent.click(
      screen.getByRole('button', {
        name: esDictionary.calculator.summary.resetCta,
      }),
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(requestBtn).toBeEnabled();
    expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
      '2.370 €',
    );
    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('8 días');
  });

  it('activates 48h Diagnostic on DIAGNOSTIC_CTA_EVENT enabling request CTA with 590 € and 2 días when no modules are selected', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('modules='));

    renderCalculator('es');

    const requestBtn = screen.getByRole('button', {
      name: esDictionary.calculator.summary.requestCta,
    });
    await waitFor(() => {
      expect(requestBtn).toBeDisabled();
    });

    act(() => {
      window.dispatchEvent(new CustomEvent(DIAGNOSTIC_CTA_EVENT));
    });

    await waitFor(() => {
      expect(requestBtn).toBeEnabled();
    });

    expect(screen.getByTestId('calculator-total-price')).toHaveTextContent('590 €');
    expect(screen.getByTestId('calculator-timeline')).toHaveTextContent('2 días');
    expect(
      screen.getByText(esDictionary.calculator.summary.diagnosticOnlyBadge),
    ).toBeInTheDocument();
  });

  it('supports RequestModal: Escape close, clipboard rejection fallback without crash, mailto link, and NEXT_PUBLIC_BOOKING_URL sanitization', async () => {
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', '');
    const writeTextMock = vi
      .fn<(text: string) => Promise<void>>()
      .mockRejectedValue(new Error('Clipboard denied'));

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: writeTextMock },
    });

    const { unmount } = renderCalculator('es');

    await waitFor(() => {
      expect(screen.getByTestId('calculator-total-price')).toHaveTextContent(
        '2.370 €',
      );
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: esDictionary.calculator.summary.requestCta,
      }),
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(
      within(dialog).queryByRole('link', {
        name: esDictionary.modal.bookingButton,
      }),
    ).not.toBeInTheDocument();

    const mailtoLink = within(dialog).getByRole('link', {
      name: esDictionary.modal.mailtoButton,
    });
    expect(mailtoLink.getAttribute('href')).toMatch(/^mailto:hello@vibeshield\.dev\?subject=/);

    const nameInput = within(dialog).getByLabelText(
      esDictionary.modal.fields.nameLabel,
    );
    fireEvent.change(nameInput, { target: { value: 'Laura Martínez' } });
    expect(within(dialog).getByTestId('modal-summary-preview')).toHaveTextContent(
      'Laura Martínez',
    );
    expect(mailtoLink.getAttribute('href')).toContain(
      encodeURIComponent('Laura Martínez'),
    );

    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole('button', {
          name: esDictionary.modal.copyButton,
        }),
      );
    });

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(
      within(dialog).getByText(esDictionary.modal.copyErrorFeedback),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    unmount();

    // Unsafe javascript: URL must NOT render booking link
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', 'javascript:alert(1)');
    const { unmount: unmountUnsafe } = renderCalculator('es');

    fireEvent.click(
      screen.getByRole('button', {
        name: esDictionary.calculator.summary.requestCta,
      }),
    );
    expect(
      screen.queryByRole('link', { name: esDictionary.modal.bookingButton }),
    ).not.toBeInTheDocument();
    unmountUnsafe();

    // Valid https:// booking URL MUST render booking link
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', 'https://cal.com/vibeshield');
    mockUseSearchParams.mockReturnValue(new URLSearchParams('lang=en'));
    renderCalculator('en');

    fireEvent.click(
      screen.getByRole('button', {
        name: enDictionary.calculator.summary.requestCta,
      }),
    );
    const bookingLink = screen.getByRole('link', {
      name: enDictionary.modal.bookingButton,
    });
    expect(bookingLink).toHaveAttribute('href', 'https://cal.com/vibeshield');
    expect(bookingLink).toHaveAttribute('target', '_blank');
    expect(bookingLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('traps keyboard focus inside RequestModal, restores focus on close, and handles clipboard success and missing API', async () => {
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', '');
    const writeTextSuccess = vi
      .fn<(text: string) => Promise<void>>()
      .mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: writeTextSuccess },
    });

    renderCalculator('es');

    const triggerBtn = screen.getByRole('button', {
      name: esDictionary.calculator.summary.requestCta,
    });
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    fireEvent.click(triggerBtn);

    const dialog = screen.getByRole('dialog');
    const closeBtn = within(dialog).getByRole('button', {
      name: esDictionary.modal.closeLabel,
    });
    const mailtoLink = within(dialog).getByRole('link', {
      name: esDictionary.modal.mailtoButton,
    });

    // Focus moves inside dialog on open
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toBe(closeBtn);

    // Shift+Tab from first element wraps to last focusable element inside dialog
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(mailtoLink);

    // Tab from last element wraps back to first focusable element inside dialog
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);

    // Clipboard copy success feedback
    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole('button', {
          name: esDictionary.modal.copyButton,
        }),
      );
    });
    expect(writeTextSuccess).toHaveBeenCalledTimes(1);
    expect(
      within(dialog).getByText(esDictionary.modal.copiedFeedback),
    ).toBeInTheDocument();

    // Missing navigator.clipboard API fallback without crashing
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole('button', {
          name: esDictionary.modal.copyButton,
        }),
      );
    });
    expect(
      within(dialog).getByText(esDictionary.modal.copyErrorFeedback),
    ).toBeInTheDocument();

    // Closing restores focus to original trigger button
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(triggerBtn);
  });
});
