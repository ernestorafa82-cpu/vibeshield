'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Terminal,
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

interface SecuritySnapshotCardProps {
  snapshot: SecuritySnapshot;
  badgeText: string;
  testResultLabel: string;
  isSimulating: boolean;
}

function SecuritySnapshotCard({
  snapshot,
  badgeText,
  testResultLabel,
  isSimulating,
}: SecuritySnapshotCardProps) {
  const isVulnerable = snapshot.status === 'vulnerable';

  const cardToneClass = isVulnerable
    ? `border-red-500/35 glow-crimson ${isSimulating ? 'ring-2 ring-red-500/60' : ''}`
    : `border-emerald-500/35 glow-emerald ${isSimulating ? 'ring-2 ring-emerald-500/60' : ''}`;

  const badgeToneClass = isVulnerable
    ? 'border-red-500/40 bg-red-500/15 text-red-300'
    : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300';

  const statusToneClass = isVulnerable
    ? 'border-red-500/40 bg-red-500/15 text-red-300'
    : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300';

  const highlightToneClass = isVulnerable
    ? 'border-red-500/30 bg-red-500/10 text-red-200'
    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';

  return (
    <article
      className={`flex flex-col justify-between rounded-2xl border bg-[#111114] p-5 transition-all ${cardToneClass}`}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold ${badgeToneClass}`}
          >
            {isVulnerable ? (
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{badgeText}</span>
          </span>

          {isSimulating && (
            <span
              className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium ${
                isVulnerable ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full animate-pulse ${
                  isVulnerable ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                aria-hidden="true"
              />
              <span>
                {snapshot.httpStatus} {snapshot.httpStatusText}
              </span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-200">
            <Terminal className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
            <span>
              {snapshot.method} {snapshot.endpoint}
            </span>
          </div>
          <span
            className={`rounded-md border px-2 py-0.5 font-semibold ${statusToneClass}`}
          >
            {snapshot.httpStatus} {snapshot.httpStatusText}
          </span>
        </div>

        <pre className="overflow-x-auto rounded-xl border border-zinc-800/90 bg-[#09090B] p-4 font-mono text-xs leading-relaxed text-zinc-200">
          <code>{snapshot.payloadJson}</code>
        </pre>

        <ul className="flex flex-wrap gap-2">
          {snapshot.highlights.map((highlight) => (
            <li
              key={highlight}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${highlightToneClass}`}
            >
              {isVulnerable ? (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-400" aria-hidden="true" />
              ) : (
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                  aria-hidden="true"
                />
              )}
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 pt-3.5 text-xs">
        <span className="text-zinc-400">{testResultLabel}</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono font-semibold ${statusToneClass}`}
        >
          {snapshot.testPassed ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
          )}
          <span>{snapshot.testBadge}</span>
        </span>
      </div>
    </article>
  );
}

/**
 * Interactive Before/After RLS security comparison tab with live unauthenticated simulation.
 */
export function SecurityBeforeAfterTab({
  demoCase,
}: SecurityBeforeAfterTabProps) {
  const { dict } = useLocale();
  const [isSimulating, setIsSimulating] = useState(false);
  const [viewMode, setViewMode] = useState<SecurityViewMode>('split');

  const showBefore = viewMode === 'split' || viewMode === 'before';
  const showAfter = viewMode === 'split' || viewMode === 'after';

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-[#111114] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            aria-pressed={isSimulating}
            onClick={() => setIsSimulating((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isSimulating
                ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-200'
                : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
            }`}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            <span>{dict.demo.securityTab.simulateButton}</span>
          </button>

          {isSimulating && (
            <button
              type="button"
              onClick={() => setIsSimulating(false)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{dict.demo.securityTab.resetSimulationButton}</span>
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label={dict.demo.tabs.security}
          className="inline-flex items-center rounded-xl border border-zinc-800 bg-[#09090B] p-1"
        >
          {VIEW_MODES.map((mode) => {
            const active = viewMode === mode;
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={active}
                onClick={() => setViewMode(mode)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  active
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
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
            ? 'rounded-2xl border border-cyan-500/40 bg-[#111114] p-4'
            : 'sr-only'
        }
      >
        {isSimulating ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <span
                  className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"
                  aria-hidden="true"
                />
                <span>{dict.demo.securityTab.simulatingLabel}</span>
              </div>
              <span className="font-mono text-xs text-zinc-400">
                {dict.demo.securityTab.unauthLabel}
              </span>
            </div>

            <p className="text-xs text-zinc-300">
              {dict.demo.securityTab.simulationActiveNotice}
            </p>

            <div className="rounded-xl border border-zinc-800 bg-[#09090B] p-3 font-mono text-xs text-zinc-300">
              {demoCase.security.simulatedRequestHeaders.map((header) => (
                <div key={header} className="leading-relaxed">
                  {header}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div
        className={`grid gap-5 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}
      >
        {showBefore && (
          <SecuritySnapshotCard
            snapshot={demoCase.security.before}
            badgeText={dict.demo.securityTab.beforeBadge}
            testResultLabel={dict.demo.securityTab.testResultLabel}
            isSimulating={isSimulating}
          />
        )}

        {showAfter && (
          <SecuritySnapshotCard
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
