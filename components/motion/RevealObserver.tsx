'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Blendet [data-reveal]-Elemente beim Hinscrollen ein. Siehe functions/infrastruktur/animationen.md
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
    const observe = () => pending().forEach((el) => observer.observe(el));
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
