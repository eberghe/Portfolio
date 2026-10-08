'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';

// Referenzen auf der Startseite (functions/seiten/startseite.md AK-53 bis AK-56): große Karten nebeneinander.
// Mit erlaubter Bewegung (Klasse `smooth`) klebt das Band, und senkrechtes Scrollen schiebt die Karten nach links.
// Ohne JavaScript und bei reduzierter Bewegung ist die Reihe seitlich wischbar.
export interface RailItem {
  id: string;
  href: string;
  title: string;
  year: string;
  kind: string;
  category: string;
  image: { src: string; width: number; height: number };
  color: string;
}

const CARD = 'w-[max(240px,min(82vw,calc((100svh-360px)*1.6)))] md:w-[max(300px,min(46vw,calc((100svh-360px)*1.6)))]';

export default function ProjectRail({
  items,
  toProject,
  children,
}: {
  items: RailItem[];
  toProject: string;
  children: ReactNode;
}) {
  const [pinned, setPinned] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  /** Wie weit die Karten breiter als der Bildschirm sind (= zusätzlicher Scrollweg) */
  const distance = useRef(0);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Auf niedrigen Bildschirmen (Handy quer) passen Überschrift und Karten nicht in eine Bildschirmhöhe
    const tall = window.matchMedia('(min-height: 560px)');
    const update = () => setPinned(html.classList.contains('smooth') && !reduce.matches && tall.matches);
    update();
    reduce.addEventListener('change', update);
    tall.addEventListener('change', update);
    return () => {
      reduce.removeEventListener('change', update);
      tall.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const el = area.current;
    const tr = track.current;
    const st = sticky.current;
    if (!pinned || !el || !tr || !st) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(Math.max(-el.getBoundingClientRect().top, 0), distance.current);
      tr.style.transform = `translate3d(${-progress}px, 0, 0)`;
    };
    const measure = () => {
      distance.current = Math.max(0, tr.scrollWidth - st.clientWidth);
      el.style.height = `calc(100svh + ${distance.current}px)`;
      update();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(st);
    observer.observe(tr);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      el.style.height = '';
      tr.style.transform = '';
    };
  }, [pinned]);

  // Tastaturfokus: Seite so weit scrollen, dass die fokussierte Karte ganz im Bild ist (AK-55)
  const onFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    const el = area.current;
    const tr = track.current;
    if (!pinned || !el || !tr) return;
    const li = (e.target as HTMLElement).closest('li');
    if (!li) return;
    const pad = parseFloat(getComputedStyle(tr).paddingLeft) || 0;
    const target = Math.min(Math.max(li.offsetLeft - pad, 0), distance.current);
    const top = el.getBoundingClientRect().top + window.scrollY + target;
    window.scrollTo({ top, behavior: 'instant' });
  };

  // Kreis „Zum Projekt“ folgt dem Mauszeiger (AK-56)
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const media = e.currentTarget.querySelector<HTMLElement>('[data-media]');
    if (!media) return;
    const r = media.getBoundingClientRect();
    media.style.setProperty('--cx', `${e.clientX - r.left}px`);
    media.style.setProperty('--cy', `${e.clientY - r.top}px`);
  };
  const onLeave = (e: PointerEvent<HTMLElement>) => {
    const media = e.currentTarget.querySelector<HTMLElement>('[data-media]');
    media?.style.removeProperty('--cx');
    media?.style.removeProperty('--cy');
  };

  return (
    <div ref={area} data-rail data-pinned={pinned || undefined}>
      <div
        ref={sticky}
        data-rail-sticky
        className={
          pinned
            ? 'sticky top-0 h-[100svh] overflow-x-clip flex flex-col justify-center pt-[65px] pb-6'
            : 'py-16 md:py-24'
        }
      >
        {children}
        <div
          data-rail-scroller
          className={pinned ? '' : 'overflow-x-auto overscroll-x-contain snap-x snap-mandatory pt-2 pb-4'}
        >
          <ul
            ref={track}
            data-rail-track
            onFocus={onFocus}
            className="flex w-max gap-5 md:gap-7 px-6 sm:px-8 md:px-[max(3rem,calc((100%-1280px)/2+3rem))] will-change-transform"
          >
            {items.map((p) => (
              <li key={p.id} className={`${CARD} shrink-0 snap-start scroll-ml-6 sm:scroll-ml-8 md:scroll-ml-12`}>
                <Link
                  href={p.href}
                  aria-labelledby={`projekt-${p.id}`}
                  aria-describedby={`projekt-${p.id}-meta projekt-${p.id}-kategorie`}
                  onPointerMove={onMove}
                  onPointerLeave={onLeave}
                  className="group block rounded-xl text-white focus-visible:outline-white"
                >
                  <div
                    data-media
                    className="relative block overflow-hidden rounded-xl aspect-[16/10]"
                    style={{ background: p.color }}
                  >
                    <Image
                      src={p.image.src}
                      quality={90}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 46vw, 82vw"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden="true"
                      data-cursor
                      className="pointer-events-none absolute left-[var(--cx,50%)] top-[var(--cy,50%)] flex items-center justify-center w-28 h-28 md:w-32 md:h-32 -ml-14 -mt-14 md:-ml-16 md:-mt-16 rounded-full bg-[#0b1219]/90 text-white text-[15px] md:text-[17px] font-semibold opacity-0 scale-50 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 motion-safe:transition-[opacity,transform] motion-safe:duration-300"
                    >
                      {toProject}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 mt-4 md:mt-5">
                    <div className="min-w-0">
                      <h3
                        id={`projekt-${p.id}`}
                        className="text-[22px] md:text-[30px] font-bold leading-tight tracking-tight"
                      >
                        {p.title}
                      </h3>
                      <span id={`projekt-${p.id}-meta`} className="block mt-1 text-[14px] md:text-[16px] text-white/70">
                        {p.year} — {p.kind}
                      </span>
                    </div>
                    <span
                      id={`projekt-${p.id}-kategorie`}
                      className="shrink-0 pt-1.5 md:pt-2.5 text-[14px] md:text-[16px] text-white/70"
                    >
                      {p.category}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
