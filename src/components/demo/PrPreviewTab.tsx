'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  FileCode2,
  GitBranch,
  GitPullRequest,
} from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData, PrDiffLine } from '@/types/vibeshield';

export interface PrPreviewTabProps {
  demoCase: DemoCaseData;
}

function getLineStyle(type: PrDiffLine['type']): {
  rowClass: string;
  symbol: string;
} {
  if (type === 'add') {
    return {
      rowClass: 'bg-emerald-500/10 text-emerald-200',
      symbol: '+',
    };
  }
  if (type === 'remove') {
    return {
      rowClass: 'bg-red-500/10 text-red-200',
      symbol: '-',
    };
  }
  return {
    rowClass: 'text-zinc-400',
    symbol: ' ',
  };
}

/**
 * Pull Request #142 verification preview tab showing CI checks and interactive file diffs.
 */
export function PrPreviewTab({ demoCase }: PrPreviewTabProps) {
  const { dict } = useLocale();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const { pullRequest } = demoCase;
  const activeFile = pullRequest.files[selectedFileIndex] ?? pullRequest.files[0];

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-zinc-800 bg-[#111114] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <GitPullRequest
                className="h-5 w-5 text-emerald-400"
                aria-hidden="true"
              />
              <h2 className="text-lg font-semibold text-zinc-100">
                {dict.demo.prTab.prTitle}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-[#09090B] px-2.5 py-1 text-cyan-300">
                <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {dict.demo.prTab.branchLabel}: {pullRequest.branch} →{' '}
                  {pullRequest.baseBranch}
                </span>
              </span>
              <span>@{pullRequest.author}</span>
            </div>

            <p className="max-w-3xl text-sm text-zinc-300">
              {pullRequest.summary}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-emerald-300 glow-emerald">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>{dict.demo.prTab.allChecksPassedLabel}</span>
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#111114] p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-200">
          {dict.demo.prTab.checksHeading}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {pullRequest.checks.map((check) => (
            <div
              key={check.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/25 bg-[#09090B] p-3.5"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-mono text-xs font-semibold text-zinc-100">
                    {check.name}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-400">
                    {check.detail}
                  </div>
                </div>
              </div>
              <span className="shrink-0 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-emerald-300">
                {check.duration}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#111114] p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-200">
          {dict.demo.prTab.filesHeading}
        </h3>

        <div className="mb-4 flex flex-wrap gap-2">
          {pullRequest.files.map((file, index) => {
            const isSelected = index === selectedFileIndex;
            return (
              <button
                key={file.path}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedFileIndex(index)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isSelected
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
                    : 'border-zinc-800 bg-[#09090B] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <FileCode2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{file.path}</span>
                <span className="text-emerald-400">+{file.additions}</span>
                <span className="text-red-400">-{file.deletions}</span>
              </button>
            );
          })}
        </div>

        {activeFile && (
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#09090B]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/60 px-4 py-2.5 font-mono text-xs">
              <span className="text-zinc-200">{activeFile.path}</span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">+{activeFile.additions}</span>
                <span className="text-red-400">-{activeFile.deletions}</span>
              </div>
            </div>

            <div className="overflow-x-auto py-2 font-mono text-xs">
              {activeFile.lines.map((line, idx) => {
                const { rowClass, symbol } = getLineStyle(line.type);
                return (
                  <div
                    key={`${activeFile.path}-${idx}-${line.lineNumber}`}
                    className={`flex items-baseline px-4 py-0.5 leading-relaxed ${rowClass}`}
                  >
                    <span className="w-8 shrink-0 select-none text-zinc-600">
                      {line.lineNumber}
                    </span>
                    <span className="w-4 shrink-0 select-none font-bold">
                      {symbol}
                    </span>
                    <span className="whitespace-pre">{line.content}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
