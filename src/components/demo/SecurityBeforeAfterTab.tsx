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
      className={`border bg-white p-6 transition-all ${
        isVulnerable
          ? isSimulating
            ? 'border-[#C94A22] ring-1 ring-[#C94A22]'
            : 'border-[#141311]/15'
          : isSimulating
            ? 'border-[#1A6340] ring-1 ring-[#1A6340]'
            : 'border-[#141311]/15'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#141311]/10 pb-3.5">
        <span
          className={`inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider uppercase ${
            isVulnerable ? 'text-[#C94A22]' : 'text-[#1A6340]'
          }`}
        >
          {isVulnerable ? (
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{badgeText}</span>
        </span>

        <span
          className={`px-2.5 py-0.5 font-mono text-xs font-semibold ${
            isVulnerable
              ? 'bg-[#FDF3EF] text-[#C94A22]'
              : 'bg-[#EDF5F0] text-[#1A6340]'
          }`}
        >
          {snapshot.httpStatus} {snapshot.httpStatusText}
        </span>
      </div>

      {/* Matte Obsidian Code Artifact */}
      <div className="mt-4 bg-[#161514] text-[#E7E2D8]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-xs">
          <span className="truncate">
            <span className="text-white/45">{snapshot.method}</span>{' '}
            <span>{snapshot.endpoint}</span>
          </span>
          <span
            className={
              isVulnerable ? 'text-[#F87171]' : 'text-[#34D399]'
            }
          >
            → {snapshot.httpStatus} {snapshot.httpStatusText}
          </span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#E7E2D8]">
          <code>{snapshot.payloadJson}</code>
        </pre>
      </div>

      <ul className="mt-4 space-y-2">
        {snapshot.highlights.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-2.5 border-l-2 pl-3 text-xs leading-relaxed ${
              isVulnerable
                ? 'border-[#C94A22] text-[#46423C]'
                : 'border-[#1A6340] text-[#46423C]'
            }`}
          >
            {isVulnerable ? (
              <XCircle
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C94A22]"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1A6340]"
                aria-hidden="true"
              />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#141311]/10 pt-3.5 font-mono text-xs">
        <span className="text-[#857F75]">{testResultLabel}</span>
        <span
          className={`font-semibold ${
            snapshot.testPassed ? 'text-[#1A6340]' : 'text-[#C94A22]'
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
      <div className="flex flex-wrap items-center justify-between gap-3 border border-[#141311]/15 bg-[#F3EFE6]/70 p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSimulating(true)}
            className="inline-flex items-center gap-2 bg-[#141311] px-4 py-2 font-mono text-xs tracking-wider text-[#FBF9F5] uppercase transition-colors hover:bg-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
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
              className="inline-flex items-center gap-1.5 border border-[#141311]/20 bg-white px-3 py-2 font-mono text-xs text-[#57534C] transition-colors hover:border-[#141311] hover:text-[#141311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{dict.demo.securityTab.resetSimulationButton}</span>
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label={dict.demo.tabs.security}
          className="inline-flex border border-[#141311]/15 bg-white p-0.5 font-mono text-xs"
        >
          {VIEW_MODES.map((mode) => {
            const isPressed = viewMode === mode;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={isPressed}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] ${
                  isPressed
                    ? 'bg-[#141311] text-[#FBF9F5]'
                    : 'text-[#57534C] hover:text-[#141311]'
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
            ? 'border border-[#C94A22]/40 bg-[#FDF3EF] p-5 text-[#141311]'
            : 'sr-only'
        }
      >
        {isSimulating && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#9C3515]">
              {dict.demo.securityTab.simulationActiveNotice}
            </p>
            <div className="bg-[#161514] p-4 font-mono text-xs text-[#E7E2D8]">
              <p className="mb-2 text-[11px] tracking-wider text-white/50 uppercase">
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
        className={`grid gap-5 ${
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
