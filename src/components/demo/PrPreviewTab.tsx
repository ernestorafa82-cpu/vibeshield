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
 * Interactive PR #142 inspection tab with CI checks and matte obsidian diff viewer.
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
      {/* PR Header */}
      <section className="border border-[#141311]/15 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#57534C]">
              <GitPullRequest
                className="h-4 w-4 text-[#1A6340]"
                aria-hidden="true"
              />
              <span className="font-semibold text-[#141311]">
                #{pullRequest.number}
              </span>
              <span className="text-[#141311]/30">·</span>
              <span>{pullRequest.author}</span>
            </div>

            <h2 className="font-serif text-2xl text-[#141311] sm:text-3xl">
              {dict.demo.prTab.prTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#57534C]">
              <GitBranch className="h-3.5 w-3.5 text-[#857F75]" aria-hidden="true" />
              <span>{dict.demo.prTab.branchLabel}:</span>
              <span className="border border-[#141311]/15 bg-[#F3EFE6] px-2 py-0.5 text-[#141311]">
                {pullRequest.branch}
              </span>
              <span aria-hidden="true">→</span>
              <span className="border border-[#141311]/15 bg-[#F3EFE6] px-2 py-0.5 text-[#141311]">
                {pullRequest.baseBranch}
              </span>
            </div>

            <p className="max-w-3xl pt-1 text-sm leading-relaxed text-[#57534C]">
              {pullRequest.summary}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 border border-[#1A6340]/40 bg-[#EDF5F0] px-3 py-1.5 font-mono text-xs font-semibold text-[#1A6340]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{dict.demo.prTab.allChecksPassedLabel}</span>
          </span>
        </div>
      </section>

      {/* CI Checks Grid */}
      <section className="border border-[#141311]/15 bg-white p-6">
        <h3 className="mb-4 font-mono text-xs font-semibold tracking-[0.16em] text-[#857F75] uppercase">
          {dict.demo.prTab.checksHeading}
        </h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {pullRequest.checks.map((check) => (
            <li
              key={check.id}
              className="flex items-start justify-between gap-3 border border-[#141311]/12 bg-[#FBF9F5] p-4"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#1A6340]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-mono text-xs font-semibold text-[#141311]">
                    {check.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#57534C]">{check.detail}</p>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-[#857F75]">
                {check.duration}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Matte Obsidian Diff Viewer */}
      <section className="overflow-hidden border border-[#141311]/15 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141311]/12 bg-[#F3EFE6]/70 px-5 py-3.5">
          <h3 className="font-mono text-xs font-semibold tracking-[0.16em] text-[#57534C] uppercase">
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
                  className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22] ${
                    isSelected
                      ? 'border-[#141311] bg-[#141311] text-[#FBF9F5]'
                      : 'border-[#141311]/15 bg-white text-[#57534C] hover:border-[#141311] hover:text-[#141311]'
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{file.path}</span>
                  <span
                    className={
                      isSelected ? 'text-emerald-300' : 'text-[#1A6340]'
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
          <div className="overflow-x-auto bg-[#161514] font-mono text-xs">
            <div className="border-b border-white/10 px-5 py-2.5 text-[11px] text-white/50">
              {activeFile.path} · {activeFile.language}
            </div>
            <div className="divide-y divide-white/[0.04]">
              {activeFile.lines.map((line, index) => {
                const rowClass =
                  line.type === 'add'
                    ? 'bg-emerald-500/12 text-emerald-200'
                    : line.type === 'remove'
                      ? 'bg-red-500/12 text-red-200'
                      : 'text-[#E7E2D8]';
                const prefix =
                  line.type === 'add'
                    ? '+'
                    : line.type === 'remove'
                      ? '-'
                      : ' ';

                return (
                  <div
                    key={`${activeFile.path}-${index}`}
                    className={`flex items-baseline gap-4 px-5 py-1.5 ${rowClass}`}
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
