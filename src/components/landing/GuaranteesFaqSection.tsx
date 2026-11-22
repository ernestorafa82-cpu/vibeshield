'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

/**
 * Asymmetric editorial terms column paired with a WAI-ARIA hairline FAQ accordion.
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
    <section className="border-t border-[#141311]/10 bg-[#FBF9F5] py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Left: Contractual Working Terms */}
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#857F75] uppercase">
              DOC. 03 · COMPROMISO
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.06] tracking-[-0.02em] text-[#141311]">
              {guaranteesTitle}
            </h2>

            <div className="mt-10 divide-y divide-[#141311]/12 border-t border-b border-[#141311]/12">
              {guarantees.map((item, idx) => (
                <article key={item.id} className="py-6">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[#C94A22]">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#141311]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#57534C]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right: Editorial Hairline FAQ Accordion */}
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#857F75] uppercase">
              FAQ
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.06] tracking-[-0.02em] text-[#141311]">
              {faqTitle}
            </h2>
            <p className="mt-3 text-base text-[#57534C]">{faqSubtitle}</p>

            <div className="mt-10 divide-y divide-[#141311]/12 border-t border-b border-[#141311]/12">
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
                        className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium text-[#141311] transition-colors hover:text-[#C94A22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94A22]"
                      >
                        <span>{faq.question}</span>
                        <span
                          aria-hidden="true"
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[#141311]/15 text-[#57534C]"
                        >
                          {isOpen ? (
                            <Minus className="h-3.5 w-3.5" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      hidden={!isOpen}
                      className="pb-6 pr-10 text-sm leading-relaxed text-[#57534C]"
                    >
                      {faq.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
