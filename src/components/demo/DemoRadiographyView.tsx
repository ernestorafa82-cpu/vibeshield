'use client';

import React, { useRef, useState } from 'react';
import { DemoHeader } from '@/components/demo/DemoHeader';
import { DemoSummaryCards } from '@/components/demo/DemoSummaryCards';
import { PrPreviewTab } from '@/components/demo/PrPreviewTab';
import { SecurityBeforeAfterTab } from '@/components/demo/SecurityBeforeAfterTab';
import { TelemetryTab } from '@/components/demo/TelemetryTab';
import { useLocale } from '@/context/LocaleContext';
import { getDemoCaseData } from '@/data/demo-case';
import type { DemoTabId } from '@/types/vibeshield';

const TAB_ORDER: readonly DemoTabId[] = ['security', 'telemetry', 'pr'];

/**
 * Editorial forensic audit dossier orchestrator for the /demo PulseCRM case study.
 */
export function DemoRadiographyView() {
  const { locale, dict } = useLocale();
  const demoCase = getDemoCaseData(locale);
  const [activeTab, setActiveTab] = useState<DemoTabId>('security');
  const tabRefs = useRef<Partial<Record<DemoTabId, HTMLButtonElement | null>>>({});

  const focusAndSelectTab = (nextTab: DemoTabId) => {
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TAB_ORDER.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = TAB_ORDER.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      focusAndSelectTab(TAB_ORDER[nextIndex]);
    }
  };

  return (
    <div className="mx-auto max-w-[1320px] space-y-8 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <DemoHeader demoCase={demoCase} />

      <div className="space-y-6">
        <div
          role="tablist"
          aria-label={dict.demo.kicker}
          className="flex flex-wrap gap-2 border-b border-[#141311]/15"
        >
          {TAB_ORDER.map((tabId, index) => {
            const isSelected = activeTab === tabId;
            return (
              <button
                key={tabId}
                ref={(el) => {
                  tabRefs.current[tabId] = el;
                }}
                type="button"
                role="tab"
                id={`demo-tab-${tabId}`}
                aria-selected={isSelected}
                aria-controls={`demo-panel-${tabId}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tabId)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`-mb-px border-b-2 px-4 py-3 font-mono text-xs tracking-wider uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] ${
                  isSelected
                    ? 'border-[#C94A22] font-semibold text-[#141311]'
                    : 'border-transparent text-[#857F75] hover:text-[#141311]'
                }`}
              >
                {dict.demo.tabs[tabId]}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`demo-panel-${activeTab}`}
          aria-labelledby={`demo-tab-${activeTab}`}
          tabIndex={0}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
        >
          {activeTab === 'security' && (
            <SecurityBeforeAfterTab demoCase={demoCase} />
          )}
          {activeTab === 'telemetry' && <TelemetryTab demoCase={demoCase} />}
          {activeTab === 'pr' && <PrPreviewTab demoCase={demoCase} />}
        </div>
      </div>

      <DemoSummaryCards demoCase={demoCase} onSelectTab={setActiveTab} />
    </div>
  );
}
