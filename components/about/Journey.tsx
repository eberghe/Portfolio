'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { TimelineItem } from '@/lib/content/about';
import type { Locale } from '@/lib/i18n';

// „Mein Weg“ als Tafel-Reihe, die beim senkrechten Scrollen waagerecht durchläuft (functions/seiten/ueber-mich.md
// AK-15 bis AK-18, AK-20: jede Tafel bildschirmfüllend). Ohne JavaScript, unter 768 px und bei reduzierter Bewegung stehen die Tafeln untereinander.
/** Senkrechter Scrollweg je Pixel waagerechter Bewegung */
const SPEED = 0.6;

export default function Journey({
  items,
  locale,
  title,
  intro,
  hint,
}: {
  items: TimelineItem[];
  locale: Locale;
  title: string;
  intro: string;
  hint: string;
}) {
  const [horizontal, setHorizontal] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  // Station, die beim Wechsel der Darstellung im Blick bleiben soll (AK-21)
  const pending = useRef<number | null>(null);
  // Station, die in der waagerechten Reihe gerade vorne steht
  const shown = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const update = (first?: boolean) => {
      const el = area.current;
      const list = track.current;
      if (!first && el && list) {
        const r = el.getBoundingClientRect();
        if (shown.current !== null) pending.current = shown.current;
        else if (r.top < window.innerHeight && r.bottom > 0) {
          // Station, deren Mitte der Fenstermitte am nächsten liegt
          let best = 0;
          let gap = Infinity;
          Array.from(list.children).forEach((li, i) => {
            const b = li.getBoundingClientRect();
            const d = Math.hypot(
              b.left + b.width / 2 - window.innerWidth / 2,
              b.top + b.height / 2 - window.innerHeight / 2,
            );
            if (d < gap) [best, gap] = [i, d];
          });
          pending.current = best;
        }
      }
      setHorizontal(query.matches);
    };
    update(true);
    const change = () => update();
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    const el = area.current;
    const list = track.current;
    if (!el || !list) return;
    const keep = pending.current;
    pending.current = null;
    if (!horizontal) {
      const li = keep === null ? null : (list.children[keep] as HTMLElement | undefined);
      if (li) window.scrollTo({ top: li.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
      return;
    }
    let frame = 0;
    let progress = 0;
    // Waagerechter Weg = Breite der Reihe minus Bildschirmbreite. Senkrecht braucht es davon nur SPEED,
    // damit der Abschnitt nicht zu lang wird (Kritiker: 20 Bildschirmhöhen)
    const sticky = list.parentElement!;
    const distance = () => Math.max(0, list.scrollWidth - sticky.clientWidth);
    const range = () => el.offsetHeight - window.innerHeight;
    const apply = () => {
      list.style.transform = `translate3d(${-progress * distance()}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      const inside = el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0;
      shown.current = inside ? Math.round((progress * distance()) / sticky.clientWidth) : null;
    };
    const move = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = range();
        progress = r > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / r)) : 0;
        apply();
      });
    };
    // Beim Ändern der Fenstergröße bleibt die aktuelle Station stehen
    const resize = () => {
      const kept = progress;
      const inside = el.getBoundingClientRect().top <= 0 && el.getBoundingClientRect().bottom >= window.innerHeight;
      el.style.height = `${distance() * SPEED + window.innerHeight}px`;
      if (inside) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + kept * range(), behavior: 'instant' });
      }
      progress = kept;
      move();
    };
    // Seitliches Wischen und waagerechtes Mausrad bewegen die Reihe ebenfalls
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaX * SPEED, behavior: 'instant' });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(sticky);
    window.addEventListener('scroll', move, { passive: true });
    sticky.addEventListener('wheel', wheel, { passive: false });
    resize();
    if (keep !== null && distance() > 0) {
      progress = Math.min(1, (keep * sticky.clientWidth) / distance());
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY + progress * range(),
        behavior: 'instant',
      });
      move();
    }
    return () => {
      cancelAnimationFrame(frame);
      shown.current = null;
      observer.disconnect();
      window.removeEventListener('scroll', move);
      sticky.removeEventListener('wheel', wheel);
      el.style.height = '';
      list.style.transform = '';
    };
  }, [horizontal]);

  const format = (date: string) =>
    new Date(`${date}-01`).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric' });

  return (
    <section aria-labelledby="mein-weg" data-journey data-horizontal={horizontal || undefined}>
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 pt-20 md:pt-28 pb-10 md:pb-14">
        <h2
          id="mein-weg"
          className="text-[36px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] mb-4"
          data-reveal
        >
          {title}
        </h2>
        <p className="text-[16px] md:text-[18px] text-text2 leading-relaxed max-w-[560px]" data-reveal>
          {intro}
        </p>
        {horizontal && (
          <p aria-hidden="true" className="mt-6 text-[12px] font-medium tracking-widest uppercase text-text3">
            {hint} ↓
          </p>
        )}
      </div>
      <div ref={area} className="relative">
        {/* Container-Einheit statt vw, damit eine Bildlaufleiste die Tafel nicht breiter als das Fenster macht */}
        <div className={horizontal ? 'sticky top-0 h-screen overflow-hidden [container-type:inline-size]' : ''}>
          <ol ref={track} className={horizontal ? 'flex h-full w-max will-change-transform' : 'flex flex-col gap-1'}>
            {items.map((item, i) => (
              <li
                key={`${item.date}-${item[locale].title}`}
                className={`relative overflow-hidden bg-[hsl(var(--primary))] text-white ${
                  horizontal
                    ? 'h-full w-[100cqw] shrink-0'
                    : item.image
                      ? 'min-h-[100svh]'
                      : 'min-h-[340px] md:min-h-[560px]'
                }`}
              >
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt[locale]}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : (
                  // Platzhalter, bis Erik Bilder schickt (AK-15)
                  <span
                    data-placeholder
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,hsl(var(--primary)),hsl(161_40%_20%))]"
                  />
                )}
                {/* Abdunklung nur über Fotos; auf dem grünen Platzhalter ist weiße Schrift ohnehin kontrastreich (AK-18) */}
                {item.image && (
                  <span
                    data-shade
                    aria-hidden="true"
                    className="absolute inset-0 bg-[rgba(0,0,0,0.6)] bg-gradient-to-t from-black/30 to-transparent"
                  />
                )}
                <div
                  className={`relative h-full flex flex-col gap-4 p-6 sm:p-10 md:p-14 ${horizontal ? 'justify-center md:pt-24' : 'justify-end'}`}
                >
                  <span
                    aria-hidden="true"
                    className="font-light leading-none tracking-[-0.04em] text-[72px] sm:text-[96px] md:text-[160px]"
                  >
                    {item.date.slice(0, 4)}
                  </span>
                  <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 lg:gap-12 items-start max-w-[1000px]">
                    {/* Überschrift zuerst im DOM (Überschriften-Navigation hört das Datum), optisch darunter */}
                    <div className="flex flex-col-reverse gap-1">
                      <h3 className="text-[24px] lg:text-[34px] font-bold leading-tight text-balance">
                        {item[locale].title}
                      </h3>
                      <time dateTime={item.date} className="block text-[13px] font-medium text-white/90">
                        {format(item.date)}
                      </time>
                    </div>
                    <p className="text-[15px] md:text-[17px] leading-relaxed text-white/95">{item[locale].text}</p>
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className={`absolute right-6 sm:right-10 text-[13px] font-medium text-white/90 ${horizontal ? 'top-24' : 'top-6 sm:top-10'}`}
                >
                  {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ol>
          {horizontal && (
            <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-1 bg-white/20">
              <span ref={bar} className="block h-full bg-primary origin-left scale-x-0" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
