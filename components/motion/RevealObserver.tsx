'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Blendet [data-reveal]-Elemente beim Hinscrollen ein. Siehe functions/infrastruktur/animationen.md
/** Inhaltsbausteine, die automatisch einblenden (AK-10) */
const BLOCKS = 'h1, h2, h3, h4, p, li, img, figure, blockquote, dl, details, form, table, article, a, button';
/** Bereiche ohne automatisches Einblenden (AK-11) */
const SKIP = '[aria-hidden="true"], [data-no-reveal], [data-journey] ol, header, footer, nav, dialog, .hero-rise';

/** Markiert alle noch nicht animierten Bausteine im Hauptbereich, je Verschachtelung nur das äußerste */
function tagBlocks() {
  const main = document.getElementById('inhalt');
  if (!main || !document.documentElement.classList.contains('smooth')) return;
  const steps = new Map<Element, number>();
  main.querySelectorAll<HTMLElement>(BLOCKS).forEach((el) => {
    if (el.closest('[data-reveal]') || el.closest(SKIP)) return;
    if (el.querySelector('[data-reveal], .hero-word')) return;
    const parent = el.parentElement!;
    const i = steps.get(parent) ?? 0;
    steps.set(parent, i + 1);
    if (!el.style.getPropertyValue('--reveal-i')) el.style.setProperty('--reveal-i', String(Math.min(i, 4)));
    // Schon im Bild: sofort sichtbar, damit nach dem Laden nichts flackert
    if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute('data-revealed', '');
    el.setAttribute('data-reveal', '');
  });
}

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])');
    const show = (el: Element) => el.setAttribute('data-revealed', '');
    if (!('IntersectionObserver' in window)) {
      pending().forEach(show);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    const observe = () => {
      tagBlocks();
      pending().forEach((el) => observer.observe(el));
    };
    observe();
    // Nach Sprüngen (Anker, Suche, Ende-Taste) auch übersprungene Elemente oberhalb zeigen
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        pending().forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) show(el);
        }),
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Was beim Laden schon im Bild ist (auch im unteren Rand), sofort zeigen (AK-4)
    onScroll();
    // Inhalte, die nach dem Seitenwechsel nachgeladen werden (Streaming), ebenfalls beobachten
    const mutations = new MutationObserver(observe);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
