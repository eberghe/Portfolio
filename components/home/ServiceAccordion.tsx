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
    <ol role="list">
      {items.map((s, i) => {
        const isOpen = open === i;
        const panel = `${id}-${s.slug}`;
        return (
          <li
            key={s.slug}
            className={`border motion-safe:transition-colors motion-safe:duration-300 ${
              isOpen ? 'border-primary rounded-xl' : 'border-transparent [&:not(:last-child)]:border-b-border'
            }`}
          >
            <h3 className="font-bold">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group w-full flex items-center gap-4 sm:gap-6 md:gap-12 px-3 sm:px-4 md:px-6 py-5 md:py-7 text-left rounded-xl"
              >
                <span
                  aria-hidden="true"
                  className="w-7 sm:w-10 md:w-14 shrink-0 text-[17px] sm:text-[22px] md:text-[28px] font-medium text-text2"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>{' '}
                <span className="flex-1 min-w-0 break-words hyphens-auto text-[20px] sm:text-[22px] md:text-[30px] font-bold leading-tight tracking-tight text-foreground group-hover:text-primary-text motion-safe:transition-colors">
                  {s.title}
                </span>
                <span aria-hidden="true" className="shrink-0 text-primary-text">
                  {isOpen ? (
                    <Minus className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" strokeWidth={1.5} />
                  ) : (
                    <Plus className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]" strokeWidth={1.5} />
                  )}
                </span>
              </button>
            </h3>
            <div id={panel} data-open={isOpen || undefined} className="service-panel">
              <div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 px-3 sm:px-4 md:px-0 pb-4 md:pb-0">
                  <div
                    data-service-media
                    aria-hidden="true"
                    className="relative aspect-[4/3] md:aspect-auto md:min-h-[300px] rounded-lg md:rounded-none md:rounded-bl-xl overflow-hidden bg-[#0b1219] dark:bg-white/[0.07] dark:ring-1 dark:ring-inset dark:ring-white/10 text-white flex items-center justify-center"
                  >
                    {s.media}
                  </div>
                  <div className="flex flex-col md:py-6 md:pr-8">
                    <p id={`${panel}-text`} className="text-[15px] md:text-[16px] leading-relaxed text-foreground">
                      {s.description}
                    </p>
                    <ul className="mt-6 grid gap-1.5 list-disc pl-5 marker:text-primary-text">
                      {s.features.map((f) => (
                        <li key={f} className="text-[14px] text-text2">
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
