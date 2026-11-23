import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DemoRadiographyView } from '@/components/demo/DemoRadiographyView';
import { LocaleProvider } from '@/context/LocaleContext';
import { dictionaries } from '@/data/i18n';
import type { Locale } from '@/types/vibeshield';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

function renderDemoView(initialLocale: Locale = 'es') {
  return render(
    <LocaleProvider dictionaries={dictionaries} initialLocale={initialLocale}>
      <DemoRadiographyView />
    </LocaleProvider>,
  );
}

describe('DemoRadiographyView', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'es';
    window.history.replaceState(null, '', '/demo');
  });

  it('renders executive header with title, verdict badge, and before/after KPIs', () => {
    renderDemoView('es');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Caso Demo: PulseCRM (Lovable + Supabase)',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/RESCATABLE CON REFACTOR MODULAR/),
    ).toBeInTheDocument();

    const banner = screen.getByRole('region', {
      name: 'Caso Demo: PulseCRM (Lovable + Supabase)',
    });
    expect(within(banner).getByText('34')).toBeInTheDocument();
    expect(within(banner).getByText('96')).toBeInTheDocument();
    expect(within(banner).getByText('4')).toBeInTheDocument();
    expect(within(banner).getByText('0')).toBeInTheDocument();
    expect(within(banner).getByText('8 días')).toBeInTheDocument();
  });

  it('supports WAI-ARIA tablist keyboard navigation (ArrowRight, ArrowLeft, End, Home)', () => {
    renderDemoView('es');

    const tablist = screen.getByRole('tablist');
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs).toHaveLength(3);

    const [securityTab, telemetryTab, prTab] = tabs;
    expect(securityTab).toHaveAttribute('aria-selected', 'true');
    expect(securityTab).toHaveAttribute('tabindex', '0');
    expect(telemetryTab).toHaveAttribute('aria-selected', 'false');
    expect(telemetryTab).toHaveAttribute('tabindex', '-1');
    expect(prTab).toHaveAttribute('aria-selected', 'false');
    expect(prTab).toHaveAttribute('tabindex', '-1');

    let panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', securityTab.id);
    expect(
      within(panel).getByText(dictionaries.es.demo.securityTab.beforeBadge),
    ).toBeInTheDocument();

    securityTab.focus();
    fireEvent.keyDown(securityTab, { key: 'ArrowRight' });
    expect(telemetryTab).toHaveFocus();
    expect(telemetryTab).toHaveAttribute('aria-selected', 'true');
    panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', telemetryTab.id);
    expect(
      within(panel).getByText(dictionaries.es.demo.telemetryTab.sectionTitle),
    ).toBeInTheDocument();

    fireEvent.keyDown(telemetryTab, { key: 'ArrowRight' });
    expect(prTab).toHaveFocus();
    expect(prTab).toHaveAttribute('aria-selected', 'true');
    panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', prTab.id);
    expect(
      within(panel).getByText(dictionaries.es.demo.prTab.checksHeading),
    ).toBeInTheDocument();

    // Wraps around from last tab to first tab on ArrowRight
    fireEvent.keyDown(prTab, { key: 'ArrowRight' });
    expect(securityTab).toHaveFocus();
    expect(securityTab).toHaveAttribute('aria-selected', 'true');

    // Wraps around from first tab to last tab on ArrowLeft
    fireEvent.keyDown(securityTab, { key: 'ArrowLeft' });
    expect(prTab).toHaveFocus();
    expect(prTab).toHaveAttribute('aria-selected', 'true');

    // Home jumps to first tab; End jumps to last tab
    fireEvent.keyDown(prTab, { key: 'Home' });
    expect(securityTab).toHaveFocus();
    expect(securityTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(securityTab, { key: 'End' });
    expect(prTab).toHaveFocus();
    expect(prTab).toHaveAttribute('aria-selected', 'true');
  });

  it('simulates unauthenticated request and filters before/after cards in Security tab', () => {
    renderDemoView('es');

    const panel = screen.getByRole('tabpanel');
    const simulateBtn = within(panel).getByRole('button', {
      name: dictionaries.es.demo.securityTab.simulateButton,
    });

    fireEvent.click(simulateBtn);

    const statusRegion = within(panel).getByRole('status');
    expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    expect(statusRegion).toHaveTextContent(
      dictionaries.es.demo.securityTab.simulationActiveNotice,
    );
    expect(
      within(panel).getByText('GET /rest/v1/customers?select=* HTTP/1.1'),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText('Authorization: (ausente)'),
    ).toBeInTheDocument();

    const beforeOnlyBtn = within(panel).getByRole('button', {
      name: dictionaries.es.demo.securityTab.viewModeLabels.before,
    });
    const afterOnlyBtn = within(panel).getByRole('button', {
      name: dictionaries.es.demo.securityTab.viewModeLabels.after,
    });
    const splitBtn = within(panel).getByRole('button', {
      name: dictionaries.es.demo.securityTab.viewModeLabels.split,
    });

    expect(splitBtn).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(beforeOnlyBtn);
    expect(beforeOnlyBtn).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(panel).getByText(dictionaries.es.demo.securityTab.beforeBadge),
    ).toBeInTheDocument();
    expect(
      within(panel).queryByText(dictionaries.es.demo.securityTab.afterBadge),
    ).not.toBeInTheDocument();

    fireEvent.click(afterOnlyBtn);
    expect(afterOnlyBtn).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(panel).queryByText(dictionaries.es.demo.securityTab.beforeBadge),
    ).not.toBeInTheDocument();
    expect(
      within(panel).getByText(dictionaries.es.demo.securityTab.afterBadge),
    ).toBeInTheDocument();

    const resetBtn = within(panel).getByRole('button', {
      name: dictionaries.es.demo.securityTab.resetSimulationButton,
    });
    fireEvent.click(resetBtn);
    expect(
      within(panel).queryByText('Authorization: (ausente)'),
    ).not.toBeInTheDocument();
  });

  it('displays SonarQube, Chrome DevTools (with LCP sparkline), and Sentry metrics in Telemetry tab', () => {
    renderDemoView('es');

    fireEvent.click(
      screen.getByRole('tab', { name: dictionaries.es.demo.tabs.telemetry }),
    );

    const panel = screen.getByRole('tabpanel');
    expect(
      within(panel).getByText(dictionaries.es.demo.telemetryTab.sonarqubeTitle),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText(dictionaries.es.demo.telemetryTab.devtoolsTitle),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText(dictionaries.es.demo.telemetryTab.sentryTitle),
    ).toBeInTheDocument();

    expect(within(panel).getByText('31%')).toBeInTheDocument();
    expect(within(panel).getByText('2.4%')).toBeInTheDocument();
    expect(within(panel).getByText('4.8s')).toBeInTheDocument();
    expect(within(panel).getByText('1.2s')).toBeInTheDocument();
    expect(within(panel).getByText('84 errores/día')).toBeInTheDocument();
    expect(panel).toHaveAttribute('tabindex', '0');
    expect(
      within(panel).getByLabelText('Tendencia de Largest Contentful Paint (LCP)'),
    ).toBeInTheDocument();
  });

  it('displays all 4 CI checks and switches between PR diff files including AGENTS.md', () => {
    renderDemoView('es');

    fireEvent.click(
      screen.getByRole('tab', { name: dictionaries.es.demo.tabs.pr }),
    );

    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByText('lint')).toBeInTheDocument();
    expect(within(panel).getByText('typecheck')).toBeInTheDocument();
    expect(within(panel).getByText('security-rules')).toBeInTheDocument();
    expect(within(panel).getByText('e2e-regression')).toBeInTheDocument();
    expect(
      within(panel).getByText(
        dictionaries.es.demo.prTab.allChecksPassedLabel,
      ),
    ).toBeInTheDocument();

    expect(
      within(panel).getByText(
        'ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;',
      ),
    ).toBeInTheDocument();

    const agentsFileBtn = within(panel).getByRole('button', {
      name: /AGENTS\.md/i,
    });
    fireEvent.click(agentsFileBtn);

    expect(
      within(panel).getByText('# PulseCRM — VibeShield Repo Guardrails'),
    ).toBeInTheDocument();
  });

  it('keeps DemoSummaryCards visible across all tabs and allows switching tabs via cards', () => {
    renderDemoView('es');

    const summaryRegion = screen.getByRole('region', {
      name: 'Resumen rápido de telemetría y PR',
    });

    expect(
      within(summaryRegion).getByText(
        dictionaries.es.demo.summaryRow.sonarqubeLabel,
      ),
    ).toBeInTheDocument();
    expect(
      within(summaryRegion).getByText(
        dictionaries.es.demo.summaryRow.devtoolsLabel,
      ),
    ).toBeInTheDocument();
    expect(
      within(summaryRegion).getByText(
        dictionaries.es.demo.summaryRow.prPreviewLabel,
      ),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('tab', { name: dictionaries.es.demo.tabs.telemetry }),
    );
    expect(
      within(summaryRegion).getByText(/4\/4 checks aprobados/),
    ).toBeInTheDocument();

    const prSummaryButton = within(summaryRegion).getByRole('button', {
      name: new RegExp(dictionaries.es.demo.summaryRow.prPreviewLabel, 'i'),
    });
    fireEvent.click(prSummaryButton);

    expect(
      screen.getByRole('tab', { name: dictionaries.es.demo.tabs.pr }),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('translates the entire interface to English when initialLocale is "en"', () => {
    renderDemoView('en');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Demo Case: PulseCRM (Lovable + Supabase)',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/RESCUABLE WITH MODULAR REFACTOR/),
    ).toBeInTheDocument();
    expect(screen.getByText('8 days')).toBeInTheDocument();

    expect(
      screen.getByRole('tab', { name: dictionaries.en.demo.tabs.security }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: dictionaries.en.demo.tabs.telemetry }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: dictionaries.en.demo.tabs.pr }),
    ).toBeInTheDocument();

    const panel = screen.getByRole('tabpanel');
    fireEvent.click(
      within(panel).getByRole('button', {
        name: dictionaries.en.demo.securityTab.simulateButton,
      }),
    );
    expect(within(panel).getByRole('status')).toHaveTextContent(
      dictionaries.en.demo.securityTab.simulationActiveNotice,
    );
    expect(
      within(panel).getByText('Authorization: (missing)'),
    ).toBeInTheDocument();
  });
});
