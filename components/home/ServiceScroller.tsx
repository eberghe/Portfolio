'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';

// Leistungen auf der Startseite: links mitlaufende Liste, rechts die Leistungen untereinander
// (functions/seiten/startseite.md AK-71 bis AK-74). Ohne JavaScript bleibt die erste hervorgehoben.
export interface ServiceItem {
  slug: string;
  href: string;
  title: string;
  description: string;
  features: string[];
  more: string;
  /** Bild der Leistung; ohne echtes Bild ein dekorativer Platzhalter mit Icon. TODO(Erik): Bilder für die übrigen Leistungen */
  media: ReactNode;
  /** true, wenn `media` ein echtes Bild mit Alt-Text ist (leistungen.md AK-38) */
  photo?: boolean;
}

export default function ServiceScroller({ items, navLabel }: { items: ServiceItem[]; navLabel: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  // Hervorgehoben ist die Leistung, die gerade die Bildschirmmitte kreuzt (AK-73)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = refs.current.indexOf(e.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // Ab md reicht der rechte Bereich (Bänder und Linien) bis an den Fensterrand; --bleed ist der Abstand von der
    // Containerkante zum Rand. Bild und Text holen ihn als Innenabstand zurück und bleiben gleich groß (AK-82).
    <div
      data-services-grid
      className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] border-t md:border-t-0 border-border [--bleed:max(3rem,calc((100vw-1280px)/2+3rem))]"
    >
      <div className="hidden md:block md:border-t border-border">
        <div data-services-rail data-no-reveal className="md:sticky md:top-24 pt-14 md:pr-8">
          <nav aria-label={navLabel}>
            <ol role="list" className="grid gap-1">
              {items.map((s, i) => {
                const on = active === i;
                return (
                  <li key={s.slug}>
                    <a
                      href={`#leistung-${s.slug}`}
                      aria-current={on ? 'location' : undefined}
                      onClick={() => setActive(i)}
                      className={`relative block py-2 pl-6 text-[18px] lg:text-[22px] font-medium leading-snug tracking-tight rounded-sm motion-safe:transition-colors motion-safe:duration-300 hover:text-foreground ${
                        on ? 'text-foreground' : 'text-text2'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-primary motion-safe:transition-opacity motion-safe:duration-300 ${
                          on ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      {s.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      <div className="md:border-l md:border-t border-border md:-mr-[var(--bleed)]">
        {items.map((s, i) => (
          <article
            key={s.slug}
            id={`leistung-${s.slug}`}
            aria-labelledby={`leistung-${s.slug}-titel`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="scroll-mt-24 border-b border-border last:border-b-0"
          >
            <div data-service-text className="pt-10 md:pt-14 pb-10 md:pb-12 md:pl-12 lg:pl-20 md:mr-[var(--bleed)]">
              <div className="max-w-[720px] text-[22px] sm:text-[26px] lg:text-[32px] font-semibold leading-[1.22] tracking-[-0.02em] text-pretty">
                <h3 id={`leistung-${s.slug}-titel`} className="inline font-bold text-foreground">
                  {s.title}
                </h3>
                <span aria-hidden="true" className="text-foreground">
                  .
                </span>{' '}
                <p id={`leistung-${s.slug}-text`} className="inline text-text2">
                  {s.description}
                </p>
              </div>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-1.5 list-disc pl-5 marker:text-primary-text max-w-[720px]">
                {s.features.map((f) => (
                  <li key={f} className="text-[14px] md:text-[15px] text-text2">
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={s.href}
                className="group/more mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary-text"
              >
                {s.more}
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="motion-safe:transition-transform motion-safe:group-hover/more:translate-x-1"
                />
              </Link>
            </div>
            <div
              data-service-band
              className="bg-bg2 border-t border-border rounded-xl md:rounded-none p-4 sm:p-6 md:py-12 md:pl-12 lg:pl-20 md:pr-[var(--bleed)] mb-10 md:mb-0"
            >
              <div
                data-service-media
                aria-hidden={s.photo ? undefined : true}
                className="relative aspect-[16/10] md:aspect-[2/1] rounded-xl overflow-hidden bg-[#0b1219] dark:bg-white/[0.07] dark:ring-1 dark:ring-inset dark:ring-white/10 text-white flex items-center justify-center"
              >
                {s.media}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
