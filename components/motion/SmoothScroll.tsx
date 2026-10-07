'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { setLenis } from '@/lib/motion/lenis';

// Weiches Scrollen mit Lenis (functions/infrastruktur/animationen.md AK-9). Das Kopf-Skript setzt `smooth` am <html>,
// wenn Bewegung erlaubt ist; Touch bleibt nativ. Offenes Mobilmenü (<html> mit overflow: hidden) hält Lenis an.
export default function SmoothScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!html.classList.contains('smooth') || reduce.matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.12 });
    setLenis(lenis);
    // Während der Ladeanimation steht die Seite still (animationen.md AK-7)
    let wait = 0;
    if (html.classList.contains('preload')) {
      lenis.stop();
      wait = window.setTimeout(() => lenis.start(), 1600);
    }
    const sync = () => (html.style.overflow === 'hidden' ? lenis.stop() : lenis.start());
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ['style'] });
    const onReduce = () => {
      if (reduce.matches) {
        setLenis(null);
        lenis.destroy();
      }
    };
    reduce.addEventListener('change', onReduce);
    return () => {
      window.clearTimeout(wait);
      observer.disconnect();
      reduce.removeEventListener('change', onReduce);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
  return null;
}
