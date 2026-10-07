'use client';

import { ArrowUpRight, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';

// Firmenleiste: jede Kachel öffnet ein Fenster mit Rolle, Zeitraum und Tätigkeit
// (functions/seiten/startseite.md AK-75 bis AK-78). Ohne JavaScript bleiben die Kacheln Links (AK-75).
export interface CompanyTile {
  name: string;
  url: string;
  role: string;
  current?: boolean;
  period: string;
  summary: string;
  duties: string[];
  /** Linktext „Website von <Firma>“ */
  website: string;
  logo: ReactNode;
}

export interface CompanyLabels {
  current: string;
  newTab: string;
  role: string;
  period: string;
  duties: string;
  close: string;
}

const noop = () => () => {};

export default function CompanyTiles({ items, labels }: { items: CompanyTile[]; labels: CompanyLabels }) {
  // Erst im Browser wird aus dem Link ein Schalter; der Server rendert Links (AK-75)
  const ready = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState<number | null>(null);
  const tiles = useRef<(HTMLElement | null)[]>([]);

  // Nach dem Schließen springt der Fokus zurück auf die Kachel (AK-77); erst wenn das Fenster weg ist,
  // sonst ist die Seite noch inert und der Fokus geht verloren
  const last = useRef<number | null>(null);
  useEffect(() => {
    if (open !== null) last.current = open;
    else if (last.current !== null) {
      tiles.current[last.current]?.focus();
      last.current = null;
    }
  }, [open]);
  const close = () => setOpen(null);

  return (
    <>
      <ul className="md:w-[calc(100%-6rem)] md:max-w-[calc(1280px-6rem)] mx-auto grid grid-cols-2 md:grid-cols-4 auto-rows-fr md:border-l border-border">
        {items.map((c, i) => {
          const name = [c.name, c.current ? labels.current : null, c.role].filter(Boolean).join(', ');
          const className = `group relative flex flex-col items-center text-center gap-3 w-full h-full min-h-[120px] md:min-h-[150px] px-4 pt-9 pb-6 md:pt-11 text-foreground motion-safe:transition-colors focus-visible:outline-offset-[-2px] ${c.current ? 'bg-primary-light' : 'hover:bg-bg2'}`;
          const body = (
            <>
              {/* Feste Logo-Höhe: Logos und Rollen stehen in allen Kacheln auf einer Linie */}
              <span className="flex items-center justify-center h-10 lg:h-12">{c.logo}</span>
              {c.current && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-text">
                  <span aria-hidden="true" className="w-[6px] h-[6px] bg-primary rounded-full" />
                  {labels.current}
                </span>
              )}
              <span className={`text-[12px] ${c.current ? 'text-foreground' : 'text-text2'}`}>{c.role}</span>
            </>
          );
          return (
            <li
              key={c.name}
              data-reveal
              style={{ '--reveal-i': i } as CSSProperties}
              className="border-border [&:nth-child(odd)]:border-r md:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0"
            >
              {ready ? (
                <button
                  type="button"
                  ref={(el) => {
                    tiles.current[i] = el;
                  }}
                  aria-haspopup="dialog"
                  aria-label={name}
                  onClick={() => setOpen(i)}
                  className={className}
                >
                  {body}
                  <span
                    data-company-plus
                    aria-hidden="true"
                    className="absolute top-2.5 right-2.5 flex items-center justify-center w-7 h-7 rounded-full border border-border text-text2 motion-safe:transition-colors group-hover:border-primary group-hover:text-primary-text group-focus-visible:border-primary group-focus-visible:text-primary-text"
                  >
                    <Plus size={14} strokeWidth={2} />
                  </span>
                </button>
              ) : (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} ${labels.newTab}`}
                  className={className}
                >
                  {body}
                </a>
              )}
            </li>
          );
        })}
      </ul>
      {open !== null && <CompanyDialog item={items[open]!} labels={labels} onClose={close} />}
    </>
  );
}

function CompanyDialog({ item, labels, onClose }: { item: CompanyTile; labels: CompanyLabels; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `firma-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    // Seite dahinter sperren; SmoothScroll hält Lenis an, solange <html> overflow: hidden hat (AK-78)
    // Breite der verschwindenden Scrollleiste ausgleichen, damit die Seite nicht seitlich springt (AK-80)
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = '';
      html.style.paddingRight = '';
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-modal="true"
      aria-labelledby={titleId}
      // Escape löst „cancel“ aus; wir schließen selbst, damit der Fokus sicher zurückspringt (AK-77)
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // Klick auf die abgedunkelte Fläche trifft das <dialog> selbst, nicht seinen Inhalt
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="company-dialog m-auto w-[calc(100%-2rem)] max-w-[560px] max-h-[calc(100svh-2rem)] overflow-hidden rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl"
    >
      {/* Das X liegt außerhalb des Scrollbereichs und bleibt stehen (AK-80) */}
      <button
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className="absolute z-10 top-3 right-3 flex items-center justify-center w-11 h-11 rounded-full bg-background text-text2 hover:bg-bg2 hover:text-foreground motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <X size={20} aria-hidden="true" />
      </button>
      {/* Nur dieser Bereich scrollt; data-lenis-prevent, weil Lenis bei gesperrter Seite sonst jedes Mausrad schluckt (AK-80).
          Er füllt das Fenster; die schlanke Scrollleiste ohne Spur kommt aus .company-dialog-scroll (AK-81) */}
      <div
        data-dialog-scroll
        data-lenis-prevent
        className="company-dialog-scroll max-h-[calc(100svh-2rem-2px)] overflow-y-auto overflow-x-hidden overscroll-contain"
      >
        <div className="px-5 py-4 sm:px-7 sm:py-6">
          <div className="flex items-center h-10 mb-6 pr-12">{item.logo}</div>
          <h2 id={titleId} className="text-[26px] sm:text-[30px] font-bold leading-tight tracking-tight pr-12">
            {item.name}
          </h2>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px]">
            <dt className="text-text2">{labels.role}</dt>
            <dd className="font-medium">{item.role}</dd>
            <dt className="text-text2">{labels.period}</dt>
            <dd className="font-medium">{item.period}</dd>
          </dl>
          <p className="mt-6 text-[16px] leading-relaxed">{item.summary}</p>
          {item.duties.length > 0 && (
            <>
              <h3 className="mt-6 text-[15px] font-bold">{labels.duties}</h3>
              <ul className="mt-2 grid gap-1.5 list-disc pl-5 marker:text-primary-text text-[15px] text-text2">
                {item.duties.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary-text"
          >
            {item.website}
            <span className="sr-only"> {labels.newTab}</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </dialog>
  );
}
