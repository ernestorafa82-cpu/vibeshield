'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type {
  DemoCaseData,
  SecuritySnapshot,
  SecurityViewMode,
} from '@/types/vibeshield';

export interface SecurityBeforeAfterTabProps {
  demoCase: DemoCaseData;
}

const VIEW_MODES: readonly SecurityViewMode[] = ['split', 'before', 'after'];

interface TerminalCardProps {
  snapshot: SecuritySnapshot;
  badgeText: string;
  testResultLabel: string;
  isSimulating: boolean;
}

function SecurityEvidenceCard({
  snapshot,
  badgeText,
  testResultLabel,
  isSimulating,
}: TerminalCardProps) {
  const isVulnerable = snapshot.status === 'vulnerable';

  return (
    <article
      className={`rounded-[24px] border bg-white p-6 shadow-luxury transition-all ${
        isVulnerable
          ? isSimulating
            ? 'border-[#C94A22] ring-1 ring-[#C94A22]'
            : 'border-[#BFDBFE]/70'
          : isSimulating
            ? 'border-[#146C43] ring-1 ring-[#146C43]'
            : 'border-[#BFDBFE]/70'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0E2244]/8 pb-4">
        <span
          className={`inline-flex items-center gap-2 font-sans text-xs font-semibold tracking-wider uppercase ${
            isVulnerable ? 'text-[#C94A22]' : 'text-[#146C43]'
          }`}
        >
          {isVulnerable ? (
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{badgeText}</span>
        </span>

        <span
          className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${
            isVulnerable
              ? 'bg-[#FEF2F2] text-[#B91C1C]'
              : 'bg-[#ECFDF5] text-[#146C43]'
          }`}
        >
          {snapshot.httpStatus} {snapshot.httpStatusText}
        </span>
      </div>

      {/* Cool Deep Navy HTTP Trace Artifact */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#93C5FD]/25 bg-[#0B1A33] text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-xs">
          <span className="truncate">
            <span className="text-[#93C5FD]">{snapshot.method}</span>{' '}
            <span>{snapshot.endpoint}</span>
          </span>
          <span
            className={isVulnerable ? 'text-[#FCA5A5]' : 'text-[#6EE7B7]'}
          >
            → {snapshot.httpStatus} {snapshot.httpStatusText}
          </span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#E2EFFF]">
          <code>{snapshot.payloadJson}</code>
        </pre>
      </div>

      <ul className="mt-5 divide-y divide-[#0E2244]/8 border-t border-[#0E2244]/8">
        {snapshot.highlights.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 py-2.5 text-xs text-[#0E2244]"
          >
            {isVulnerable ? (
              <XCircle
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C94A22]"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#146C43]"
                aria-hidden="true"
              />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#0E2244]/8 pt-3.5 font-mono text-xs">
        <span className="text-[#52607A]">{testResultLabel}</span>
        <span
          className={`font-semibold ${
            snapshot.testPassed ? 'text-[#146C43]' : 'text-[#C94A22]'
          }`}
        >
          {snapshot.testBadge}
        </span>
      </div>
    </article>
  );
}

/**
 * Interactive RLS before/after forensic evidence tab with live anonymous request trace.
 */
export function SecurityBeforeAfterTab({
  demoCase,
}: SecurityBeforeAfterTabProps) {
  const { dict } = useLocale();
  const [viewMode, setViewMode] = useState<SecurityViewMode>('split');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const showBefore = viewMode === 'split' || viewMode === 'before';
  const showAfter = viewMode === 'split' || viewMode === 'after';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#BFDBFE]/70 bg-white p-4 shadow-luxury">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSimulating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0E2244] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A3B75] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <Play className="h-3.5 w-3.5 text-[#93C5FD]" aria-hidden="true" />
            <span>
              {isSimulating
                ? dict.demo.securityTab.simulatingLabel
                : dict.demo.securityTab.simulateButton}
            </span>
          </button>

          {isSimulating && (
            <button
              type="button"
              onClick={() => setIsSimulating(false)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EEF5FF] px-4 py-2.5 text-xs font-medium text-[#0E2244] transition-colors hover:border-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{dict.demo.securityTab.resetSimulationButton}</span>
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label={dict.demo.tabs.security}
          className="inline-flex rounded-full border border-[#BFDBFE]/80 bg-[#EEF5FF] p-1 text-xs"
        >
          {VIEW_MODES.map((mode) => {
            const isPressed = viewMode === mode;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={isPressed}
                onClick={() => setViewMode(mode)}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  isPressed
                    ? 'bg-[#0E2244] text-white'
                    : 'text-[#52607A] hover:text-[#0E2244]'
                }`}
              >
                {dict.demo.securityTab.viewModeLabels[mode]}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={
          isSimulating
            ? 'bg-ice-luxury rounded-[22px] border border-[#93C5FD] p-5 shadow-luxury'
            : 'sr-only'
        }
      >
        {isSimulating && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#0E2244]">
              {dict.demo.securityTab.simulationActiveNotice}
            </p>
            <div className="rounded-xl bg-[#0B1A33] p-4 font-mono text-xs text-[#E2EFFF]">
              <p className="mb-2 text-[10px] tracking-[0.2em] text-[#93C5FD] uppercase">
                {dict.demo.securityTab.unauthLabel}
              </p>
              {demoCase.security.simulatedRequestHeaders.map((header) => (
                <div key={header} className="leading-relaxed">
                  {header}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={`grid gap-6 ${
          viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {showBefore && (
          <SecurityEvidenceCard
            snapshot={demoCase.security.before}
            badgeText={dict.demo.securityTab.beforeBadge}
            testResultLabel={dict.demo.securityTab.testResultLabel}
            isSimulating={isSimulating}
          />
        )}

        {showAfter && (
          <SecurityEvidenceCard
            snapshot={demoCase.security.after}
            badgeText={dict.demo.securityTab.afterBadge}
            testResultLabel={dict.demo.securityTab.testResultLabel}
            isSimulating={isSimulating}
          />
        )}
      </div>
    </div>
  );
}
