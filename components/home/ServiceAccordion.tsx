'use client';

import { ArrowRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useId, useState, type ReactNode } from 'react';

// Leistungen auf der Startseite als Akkordeon (functions/seiten/startseite.md AK-64 bis AK-66).
// Ohne JavaScript sind alle Felder offen; zugeklappt wird nur unter `html.js` (globals.css `.service-panel`).
export interface AccordionItem {
  slug: string;
  href: string;
  title: string;
  description: string;
  features: string[];
  more: string;
  /** Dekoratives Bild; vorerst Platzhalter mit Icon. TODO(Erik): echte Bilder je Leistung */
  media: ReactNode;
}

export default function ServiceAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <ol role="list" className="border-t border-border">
      {items.map((s, i) => {
        const isOpen = open === i;
        const panel = `${id}-${s.slug}`;
        return (
          <li key={s.slug} className="border-b border-border">
            <h3 className="font-bold">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group w-full flex items-center gap-4 sm:gap-8 md:gap-16 lg:gap-24 py-6 md:py-10 text-left rounded-lg focus-visible:outline-primary focus-visible:outline-offset-0"
              >
                <span
                  aria-hidden="true"
                  className="w-8 sm:w-12 md:w-20 shrink-0 text-[20px] sm:text-[28px] md:text-[44px] lg:text-[52px] font-medium leading-none tracking-tight text-foreground"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>{' '}
                <span className="flex-1 min-w-0 break-words hyphens-auto text-[20px] sm:text-[28px] md:text-[44px] lg:text-[52px] font-semibold leading-[1.05] tracking-tight text-foreground group-hover:text-primary-text motion-safe:transition-colors">
                  {s.title}
                </span>
                <span aria-hidden="true" className="shrink-0 text-primary-text">
                  {isOpen ? (
                    <Minus className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1.75} />
                  ) : (
                    <Plus className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1.75} />
                  )}
                </span>
              </button>
            </h3>
            <div id={panel} data-open={isOpen || undefined} className="service-panel">
              <div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 pb-8 md:pb-12">
                  <div
                    data-service-media
                    aria-hidden="true"
                    className="relative aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden bg-[#0b1219] dark:bg-white/[0.07] dark:ring-1 dark:ring-inset dark:ring-white/10 text-white flex items-center justify-center"
                  >
                    {s.media}
                  </div>
                  <div className="flex flex-col md:py-2">
                    <p
                      id={`${panel}-text`}
                      className="text-[16px] md:text-[18px] leading-relaxed text-foreground max-w-[560px]"
                    >
                      {s.description}
                    </p>
                    <ul className="mt-6 grid gap-1.5 list-disc pl-5 marker:text-primary-text">
                      {s.features.map((f) => (
                        <li key={f} className="text-[14px] md:text-[15px] text-text2">
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={s.href}
                      aria-describedby={`${panel}-text`}
                      className="group/more mt-8 md:mt-auto md:pt-8 inline-flex items-center gap-1.5 self-start text-[14px] font-semibold text-primary-text"
                    >
                      {s.more}
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="motion-safe:transition-transform motion-safe:group-hover/more:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
