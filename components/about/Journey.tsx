'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { TimelineItem } from '@/lib/content/about';
import type { Locale } from '@/lib/i18n';
import { halt, jumpTo } from '@/lib/motion/lenis';

// „Mein Weg“: bildschirmfüllende Stationen, die beim Scrollen kleben bleiben und animiert wechseln
// (functions/seiten/ueber-mich.md AK-15 bis AK-23). Ohne JavaScript, unter 768 px und bei reduzierter Bewegung
// stehen die Tafeln untereinander.
/** Scrollweg je Station in Fensterhöhen */
const STEP = 0.9;
/** Wechsel der Hintergründe: Wisch-Maske von unten und leichter Zoom (AK-23). Als Inline-Stil, weil
 * tailwindcss-animate beliebige duration-/ease-Werte mehrdeutig macht und Tailwind sie dann nicht erzeugt. */
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const WIPE = `clip-path 0.9s ${EASE}`;
const ZOOM = `transform 1.4s ${EASE}`;
/** Große Jahreszahl; feste Kopie und Platzhalter in der Tafel teilen sich Größe und Lage */
const YEAR = 'font-light leading-none tracking-[-0.04em] text-[72px] sm:text-[96px] md:text-[160px]';
const PINNED_TOP = 'top-28 md:top-32';
const PINNED = 'pt-28 md:pt-32';

/** Ziffern, die beim Wechsel senkrecht zur neuen Ziffer rollen */
function Rolling({ value }: { value: string }) {
  return (
    <span className="inline-flex">
      {value.split('').map((digit, i) => (
        // Unsichtbare Ziffer gibt die Breite vor, damit „1“ nicht so breit wie „0“ wird
        <span key={i} className="relative inline-block h-[1em] overflow-hidden">
          <span className="invisible">{digit}</span>
          <span
            className="absolute left-1/2 top-0 flex flex-col items-center"
            style={{ transform: `translate(-50%, ${-Number(digit)}em)`, transition: `transform 0.7s ${EASE}` }}
          >
            {DIGITS.map((d) => (
              <span key={d} className="h-[1em]">
                {d}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function Journey({
  items,
  locale,
  title,
  intro,
  hint,
  prev,
  next,
}: {
  items: TimelineItem[];
  locale: Locale;
  title: string;
  intro: string;
  hint: string;
  prev: string;
  next: string;
}) {
  const [pinned, setPinned] = useState(false);
  // Aktive Station, solange die Tafeln kleben (AK-22)
  const [active, setActive] = useState(0);
  const area = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  // Ein Balkenteil je Station (AK-31)
  const segments = useRef<(HTMLSpanElement | null)[]>([]);
  // Station, die beim Wechsel der Darstellung im Blick bleiben soll (AK-21)
  const pending = useRef<number | null>(null);
  // Station, die beim Kleben gerade aktiv und im Bild ist
  const shown = useRef<number | null>(null);
  // Springt zu einer Station (Pfeile, AK-24)
  const goTo = useRef<(index: number) => void>(() => {});
  // Ansage für Screenreader nach einem Pfeil-Klick (Kritiker: Wechsel wurde nicht angesagt)
  const [announce, setAnnounce] = useState('');
  const viaArrow = useRef(false);
  useEffect(() => {
    if (!viaArrow.current) return;
    viaArrow.current = false;
    setAnnounce(`${active + 1} / ${items.length}: ${items[active]![locale].title}`);
  }, [active, items, locale]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: no-preference)');
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
            const d = Math.abs(b.top + b.height / 2 - window.innerHeight / 2);
            if (d < gap) [best, gap] = [i, d];
          });
          pending.current = best;
        }
      }
      setPinned(query.matches);
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
    if (!pinned) {
      const li = keep === null ? null : (list.children[keep] as HTMLElement | undefined);
      if (li) window.scrollTo({ top: li.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
      return;
    }
    let frame = 0;
    let progress = 0;
    const last = list.children.length - 1;
    const sticky = list.parentElement!;
    const range = () => el.offsetHeight - window.innerHeight;
    // Jede Station bekommt einen gleich langen Abschnitt des Scrollwegs; Balken und aktive Station folgen ihm (AK-31)
    const count = last + 1;
    const apply = () => {
      const index = Math.min(last, Math.floor(progress * count));
      setActive(index);
      segments.current.forEach((seg, i) => {
        if (!seg) return;
        const fill = Math.min(1, Math.max(0, progress * count - i));
        seg.style.transform = `scaleX(${fill})`;
        seg.dataset.fill = String(fill);
      });
      const inside = el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0;
      shown.current = inside ? index : null;
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
      el.style.height = `${count * STEP * window.innerHeight + window.innerHeight}px`;
      if (inside) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + kept * range(), behavior: 'instant' });
      }
      progress = kept;
      move();
    };
    // Pfeile und Gesten springen an den Anfang des Abschnitts der Station (AK-31); +1 px gegen Rundung an der Grenze
    goTo.current = (index) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const i = Math.min(last, Math.max(0, index));
      jumpTo(top + (i / count) * range() + (i > 0 ? 1 : 0));
    };
    // Eine Scroll-Geste = eine Station (AK-32). Trackpads feuern je Geste viele Rad-Ereignisse mit Nachschwung:
    // erst nach LOCK ms und einer Pause von QUIET ms zählt die nächste Geste.
    const LOCK = 700;
    const QUIET = 150;
    let jumped = -Infinity;
    // Zeit des vorletzten und letzten Rad-Ereignisses auf der ganzen Seite: eine Geste, die von oben in die
    // Stationen hineinläuft, zählt so nicht gleich als neuer Sprung
    let prevWheel = -Infinity;
    let lastWheel = -Infinity;
    const anyWheel = (e: WheelEvent) => {
      prevWheel = lastWheel;
      lastWheel = e.timeStamp;
    };
    const pinnedNow = () => {
      const r = el.getBoundingClientRect();
      return (
        r.top <= 0.5 && r.bottom >= window.innerHeight - 0.5 && document.documentElement.style.overflow !== 'hidden'
      );
    };
    // Richtung > 0 nach unten
    const step = (dir: number, now: number) => {
      if (now - jumped < LOCK || now - prevWheel < QUIET) return;
      const current = Math.min(last, Math.floor(progress * count));
      const top = el.getBoundingClientRect().top + window.scrollY;
      jumped = now;
      if (dir > 0 && current === last) {
        // Ohne toten Scrollweg hinaus: ans Ende der Stationen
        jumpTo(top + range() + 2);
        return;
      }
      if (dir < 0 && current === 0) {
        jumpTo(top - 2);
        return;
      }
      goTo.current(current + dir);
    };
    const wheel = (e: WheelEvent) => {
      if (!pinnedNow()) return;
      // Seitliches Wischen und waagerechtes Mausrad blättern ebenfalls
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      // Lenis (auf window) soll das Ereignis nicht mehr sehen
      e.preventDefault();
      e.stopPropagation();
      // Schwung von Lenis aus der Geste davor anhalten, sonst rollt die Seite über Stationen hinweg
      halt();
      step(Math.sign(delta), e.timeStamp);
    };
    // Mobil: ein Wisch = eine Station
    let touchY: number | null = null;
    const touchStart = (e: TouchEvent) => {
      // Nur ein Finger: Zwei-Finger-Zoom bleibt frei
      touchY = pinnedNow() && e.touches.length === 1 ? e.touches[0]!.clientY : null;
    };
    const touchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) touchY = null;
      if (touchY !== null) e.preventDefault();
    };
    const touchEnd = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = touchY - e.changedTouches[0]!.clientY;
      touchY = null;
      if (Math.abs(dy) < 30) return;
      prevWheel = -Infinity;
      jumped = -Infinity;
      step(Math.sign(dy), e.timeStamp);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(sticky);
    window.addEventListener('scroll', move, { passive: true });
    window.addEventListener('wheel', anyWheel, { passive: true, capture: true });
    sticky.addEventListener('wheel', wheel, { passive: false });
    sticky.addEventListener('touchstart', touchStart, { passive: true });
    sticky.addEventListener('touchmove', touchMove, { passive: false });
    sticky.addEventListener('touchend', touchEnd);
    resize();
    if (keep !== null && last > 0) {
      progress = (keep + 0.5) / count;
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
      window.removeEventListener('wheel', anyWheel, { capture: true });
      sticky.removeEventListener('wheel', wheel);
      sticky.removeEventListener('touchstart', touchStart);
      sticky.removeEventListener('touchmove', touchMove);
      sticky.removeEventListener('touchend', touchEnd);
      el.style.height = '';
    };
  }, [pinned]);

  const format = (date: string) =>
    new Date(`${date}-01`).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', { month: 'long', year: 'numeric' });

  return (
    <section aria-labelledby="mein-weg" data-journey data-pinned={pinned || undefined}>
      <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 pt-20 md:pt-28 pb-10 md:pb-14">
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
        {pinned && (
          <p aria-hidden="true" className="mt-6 text-[12px] font-medium tracking-widest uppercase text-text3">
            {hint} ↓
          </p>
        )}
      </div>
      <div ref={area} className="relative">
        <div className={pinned ? 'sticky top-0 h-[100svh] overflow-hidden' : ''}>
          <ol ref={track} className={pinned ? 'relative h-full' : 'flex flex-col gap-1'}>
            {items.map((item, i) => {
              // Kleben: alle Stationen liegen übereinander; die nächste deckt die aktive von unten auf (AK-23)
              const open = i <= active;
              const zoom = pinned ? { transform: `scale(${i > active ? 1.15 : 1})`, transition: ZOOM } : undefined;
              return (
                <li
                  key={`${item.date}-${item[locale].title}`}
                  data-active={pinned ? i === active || undefined : undefined}
                  className={`overflow-hidden bg-[hsl(var(--primary))] text-white ${
                    pinned
                      ? 'absolute inset-0'
                      : `relative ${item.image ? 'min-h-[100svh]' : 'min-h-[340px] md:min-h-[560px]'}`
                  }`}
                  style={
                    pinned
                      ? { zIndex: i, clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)', transition: WIPE }
                      : undefined
                  }
                >
                  {item.image ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt[locale]}
                      fill
                      sizes="100vw"
                      quality={85}
                      className="object-cover"
                      style={{ ...zoom, objectPosition: item.image.position }}
                    />
                  ) : (
                    // Platzhalter, bis Erik Bilder schickt (AK-15)
                    <span
                      data-placeholder
                      aria-hidden="true"
                      className={`absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,hsl(var(--primary)),hsl(161_40%_20%))] `}
                      style={zoom}
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
                  {/* Kleben: Text steht immer an derselben Stelle und blendet je Station ein (AK-22) */}
                  <div className={pinned ? 'absolute inset-0 pointer-events-none' : 'relative h-full flex flex-col'}>
                    <div
                      className={`h-full flex flex-col gap-4 p-6 sm:p-10 md:p-14 ${
                        pinned
                          ? // Mobil Text unten über den Pfeilen, damit Gesichter oben frei bleiben (AK-28)
                            `${PINNED} max-md:justify-end max-md:pb-24 md:justify-start transition-[opacity,transform] ease-out ${
                              // Alter Text geht schnell, neuer kommt kurz danach: kein Überlagern
                              i === active
                                ? 'opacity-100 translate-y-0 pointer-events-auto duration-500 delay-300'
                                : 'opacity-0 -translate-y-2 duration-200'
                            }`
                          : 'justify-end'
                      }`}
                    >
                      <span aria-hidden="true" className={`${YEAR} ${pinned ? 'invisible max-md:hidden' : ''}`}>
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
                  </div>
                  {!pinned && (
                    <span
                      aria-hidden="true"
                      className="absolute right-6 sm:right-10 top-6 sm:top-10 text-[13px] font-medium text-white/90"
                    >
                      {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {pinned && (
            // Feste Jahreszahl und Zähler, die Ziffer für Ziffer zur aktiven Station rollen (AK-22)
            <div aria-hidden="true" className="absolute inset-0 z-[100] pointer-events-none text-white">
              <span
                data-year={items[active]!.date.slice(0, 4)}
                className={`absolute left-6 sm:left-10 md:left-14 ${PINNED_TOP} ${YEAR}`}
              >
                <Rolling value={items[active]!.date.slice(0, 4)} />
              </span>
              <span className="absolute right-6 sm:right-10 top-24 text-[13px] font-medium text-white/90 leading-none">
                <Rolling value={String(active + 1).padStart(2, '0')} /> / {String(items.length).padStart(2, '0')}
              </span>
              {/* Fortschritt in Teilen, einer je Station (AK-31) */}
              <span className="absolute left-0 right-0 bottom-0 h-1 flex gap-[3px]">
                {items.map((item, i) => (
                  <span key={item.date} className="flex-1 h-full bg-white/20">
                    <span
                      data-journey-segment
                      data-fill="0"
                      ref={(el) => {
                        segments.current[i] = el;
                      }}
                      className="block h-full bg-white origin-left scale-x-0"
                    />
                  </span>
                ))}
              </span>
            </div>
          )}
          {pinned && (
            <p aria-live="polite" className="sr-only">
              {announce}
            </p>
          )}
          {pinned && (
            // Pfeile zum Blättern (AK-24); Fotos wechseln nacheinander von unten, daher Pfeile hoch/runter
            <div className="absolute right-6 sm:right-10 bottom-6 sm:bottom-10 z-[101] flex gap-2">
              {[
                { label: prev, Icon: ArrowUp, to: active - 1, off: active === 0 },
                { label: next, Icon: ArrowDown, to: active + 1, off: active === items.length - 1 },
              ].map(({ label, Icon, to, off }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  title={label}
                  // aria-disabled statt disabled: der Fokus bleibt am Ende auf dem Knopf (Kritiker)
                  aria-disabled={off || undefined}
                  onClick={() => {
                    if (off) return;
                    viaArrow.current = true;
                    goTo.current(to);
                  }}
                  className="grid place-items-center w-12 h-12 rounded-full border border-white/50 bg-black/30 text-white backdrop-blur-sm transition [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:text-[hsl(var(--primary))] aria-disabled:opacity-40 aria-disabled:cursor-default aria-disabled:[@media(hover:hover)]:hover:bg-black/30 aria-disabled:[@media(hover:hover)]:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                >
                  <Icon size={20} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
