'use client';

import React, { useState } from 'react';
import { ChevronDown, Code2, Lock, Shield, type LucideIcon } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

const GUARANTEE_ICON_MAP: Record<string, LucideIcon> = {
  honesty: Shield,
  ownership: Code2,
  'fixed-price': Lock,
};

/**
 * Contractual guarantees grid paired with a WAI-ARIA accessible FAQ accordion.
 */
export function GuaranteesFaqSection() {
  const { dict } = useLocale();
  const { guaranteesTitle, guarantees, faqTitle, faqSubtitle, faqs } =
    dict.guaranteesFaq;

  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>(() =>
    faqs[0] ? { [faqs[0].id]: true } : {},
  );

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="bg-[#09090B] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6">
        <div className="space-y-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {guaranteesTitle}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {guarantees.map((guarantee) => {
              const Icon = GUARANTEE_ICON_MAP[guarantee.id] ?? Shield;
              return (
                <article
                  key={guarantee.id}
                  className="rounded-xl border border-zinc-800 bg-[#111114] p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {guarantee.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {guarantee.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {faqTitle}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
              {faqSubtitle}
            </p>
          </div>

          <div className="divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800 bg-[#111114]">
            {faqs.map((faq) => {
              const isOpen = Boolean(openFaqIds[faq.id]);
              const triggerId = `faq-trigger-${faq.id}`;
              const panelId = `faq-panel-${faq.id}`;

              return (
                <div key={faq.id}>
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400 sm:px-6 sm:py-5 sm:text-base"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-emerald-400' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                    className="px-5 pb-5 text-sm leading-relaxed text-zinc-400 sm:px-6"
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
