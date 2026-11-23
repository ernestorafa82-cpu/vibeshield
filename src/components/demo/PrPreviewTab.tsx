'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  FileCode2,
  GitBranch,
  GitPullRequest,
} from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import type { DemoCaseData } from '@/types/vibeshield';

export interface PrPreviewTabProps {
  demoCase: DemoCaseData;
}

/**
 * Interactive PR #142 inspection tab with CI checks and deep-navy diff viewer.
 */
export function PrPreviewTab({ demoCase }: PrPreviewTabProps) {
  const { dict } = useLocale();
  const { pullRequest } = demoCase;
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    pullRequest.files[0]?.path ?? '',
  );

  const activeFile =
    pullRequest.files.find((file) => file.path === selectedFilePath) ??
    pullRequest.files[0];

  return (
    <div className="space-y-6">
      <section className="rounded-[26px] border border-[#BFDBFE]/75 bg-white p-6 shadow-luxury sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#52607A]">
              <GitPullRequest
                className="h-4 w-4 text-[#146C43]"
                aria-hidden="true"
              />
              <span className="font-semibold text-[#0E2244]">
                #{pullRequest.number}
              </span>
              <span className="text-[#0E2244]/30">·</span>
              <span>{pullRequest.author}</span>
            </div>

            <h2 className="font-serif text-3xl text-[#0E2244]">
              {dict.demo.prTab.prTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#52607A]">
              <GitBranch className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
              <span>{dict.demo.prTab.branchLabel}:</span>
              <span className="rounded-full border border-[#BFDBFE]/70 bg-[#EEF5FF] px-3 py-0.5 text-[#0E2244]">
                {pullRequest.branch}
              </span>
              <span aria-hidden="true">→</span>
              <span className="rounded-full border border-[#BFDBFE]/70 bg-[#EEF5FF] px-3 py-0.5 text-[#0E2244]">
                {pullRequest.baseBranch}
              </span>
            </div>

            <p className="max-w-3xl pt-1 text-sm leading-relaxed text-[#52607A]">
              {pullRequest.summary}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-4 py-1.5 font-mono text-xs font-semibold text-[#146C43]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{dict.demo.prTab.allChecksPassedLabel}</span>
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-[26px] border border-[#BFDBFE]/75 bg-white shadow-luxury">
        <div className="bg-ice-luxury border-b border-[#BFDBFE]/65 px-6 py-4 sm:px-7">
          <h3 className="font-sans text-xs font-semibold tracking-[0.22em] text-[#1D4ED8] uppercase">
            {dict.demo.prTab.checksHeading}
          </h3>
        </div>
        <ul className="divide-y divide-[#0E2244]/8">
          {pullRequest.checks.map((check) => (
            <li
              key={check.id}
              className="flex items-start justify-between gap-4 px-6 py-4 sm:px-7"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#146C43]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-mono text-xs font-semibold text-[#0E2244]">
                    {check.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#52607A]">{check.detail}</p>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-[#52607A]">
                {check.duration}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-[26px] border border-[#BFDBFE]/75 bg-white shadow-luxury">
        <div className="bg-ice-luxury flex flex-wrap items-center justify-between gap-3 border-b border-[#BFDBFE]/65 px-6 py-4">
          <h3 className="font-sans text-xs font-semibold tracking-[0.22em] text-[#1D4ED8] uppercase">
            {dict.demo.prTab.filesHeading}
          </h3>
          <div className="flex flex-wrap gap-2">
            {pullRequest.files.map((file) => {
              const isSelected = activeFile?.path === file.path;
              return (
                <button
                  key={file.path}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isSelected
                      ? 'border-[#0E2244] bg-[#0E2244] text-white'
                      : 'border-[#BFDBFE] bg-white text-[#52607A] hover:border-[#2563EB] hover:text-[#0E2244]'
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{file.path}</span>
                  <span
                    className={
                      isSelected ? 'text-[#93C5FD]' : 'text-[#146C43]'
                    }
                  >
                    +{file.additions}
                  </span>
                  {file.deletions > 0 && (
                    <span
                      className={isSelected ? 'text-red-300' : 'text-[#C94A22]'}
                    >
                      -{file.deletions}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeFile && (
          <div className="overflow-x-auto bg-[#0B1A33] font-mono text-xs">
            <div className="border-b border-white/10 px-6 py-2.5 text-[11px] text-[#93C5FD]">
              {activeFile.path} · {activeFile.language}
            </div>
            <div className="divide-y divide-white/[0.04]">
              {activeFile.lines.map((line, index) => {
                const rowClass =
                  line.type === 'add'
                    ? 'bg-emerald-500/12 text-emerald-200'
                    : line.type === 'remove'
                      ? 'bg-red-500/12 text-red-200'
                      : 'text-[#E2EFFF]/88';
                const prefix =
                  line.type === 'add'
                    ? '+'
                    : line.type === 'remove'
                      ? '-'
                      : ' ';

                return (
                  <div
                    key={`${activeFile.path}-${index}`}
                    className={`flex items-baseline gap-4 px-6 py-1.5 ${rowClass}`}
                  >
                    <span className="w-6 shrink-0 select-none text-right text-[11px] text-white/35">
                      {line.lineNumber}
                    </span>
                    <span className="w-3 shrink-0 select-none text-center font-bold">
                      {prefix}
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
