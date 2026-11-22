'use client';

import React, { useState } from 'react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { SilkReveal } from '@/components/motion/SilkReveal';
import { useLocale } from '@/context/LocaleContext';
import { getSiteConfig } from '@/lib/config';

/**
 * Sticky-left editorial header + pure-white rounded FAQ accordion cards
 * with champagne-gold numerals, directly inspired by biologique.es .faqs.
 */
export function GuaranteesFaqSection() {
  const { locale, dict } = useLocale();
  const { guaranteesTitle, guarantees, faqTitle, faqSubtitle, faqs } =
    dict.guaranteesFaq;
  const config = getSiteConfig();

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
    <section className="bg-cream-dotted py-20 text-[#0E2244] sm:py-28">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-10">
        {/* Top 3 Contractual Guarantees Strip */}
        <SilkReveal className="mb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow-rule text-[#7F6330]">
                {locale === 'es' ? 'GARANTÍAS' : 'TERMS'}
              </span>
              <h2 className="mt-3 font-serif text-4xl leading-[1.04] font-normal text-[#0E2244] sm:text-5xl">
                {guaranteesTitle}
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {guarantees.map((item, idx) => (
              <article
                key={item.id}
                className="rounded-[24px] border border-[#0E2244]/10 bg-white p-7 shadow-luxury transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#D6B878]/65"
              >
                <span className="font-serif text-3xl text-[#B8975A]">
                  0{idx + 1}
                </span>
                <h3 className="mt-3 font-serif text-2xl font-medium text-[#0E2244]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#5A6378]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </SilkReveal>

        {/* Sticky-Left / Rounded-Card FAQ Layout */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <SilkReveal className="space-y-5 lg:sticky lg:top-28 lg:col-span-4">
            <span className="eyebrow-rule text-[#7F6330]">
              {locale === 'es' ? 'TE AYUDAMOS' : 'QUESTIONS'}
            </span>
            <h2 className="font-serif text-5xl leading-[0.98] font-normal text-[#0E2244] sm:text-[56px]">
              {faqTitle}
            </h2>
            <p className="text-base leading-relaxed text-[#5A6378]">
              {faqSubtitle}
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${config.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#0E2244] px-6 py-3.5 text-sm font-semibold text-[#F3EFE6] transition-all hover:bg-[#1D3A6E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
              >
                <span>
                  {locale === 'es'
                    ? '¿Otra duda? Escríbenos'
                    : 'Another question? Write us'}
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </SilkReveal>

          <div className="space-y-4 lg:col-span-8">
            {faqs.map((faq, idx) => {
              const isOpen = Boolean(openFaqIds[faq.id]);
              const triggerId = `faq-trigger-${faq.id}`;
              const panelId = `faq-panel-${faq.id}`;

              return (
                <div
                  key={faq.id}
                  className={`rounded-[24px] border bg-white transition-all duration-300 ${
                    isOpen
                      ? 'border-[#D6B878] shadow-luxury'
                      : 'border-[#0E2244]/10 hover:border-[#0E2244]/25'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6B878] sm:px-7 sm:py-6"
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          aria-hidden="true"
                          className="font-serif text-xl font-medium text-[#B8975A]"
                        >
                          0{idx + 1}
                        </span>
                        <span className="font-serif text-xl font-medium text-[#0E2244] sm:text-2xl">
                          {faq.question}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isOpen
                            ? 'border-[#0E2244] bg-[#0E2244] text-[#F3EFE6]'
                            : 'border-[#0E2244]/20 bg-[#F3EFE6] text-[#0E2244]'
                        }`}
                      >
                        {isOpen ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                    className="px-6 pb-6 pl-16 text-sm leading-relaxed text-[#5A6378] sm:px-7 sm:pb-7 sm:pl-[70px]"
                  >
                    {faq.answer}
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
