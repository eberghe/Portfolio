'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Magnetischer Medien-Platz im Hero (functions/seiten/startseite.md AK-49): folgt dem Mauszeiger in seiner
// Nähe ein Stück und federt zurück; das Kind (Bild) verschiebt sich leicht gegenläufig. Nur `transform`.
// Aktiv nur mit feinem Zeiger und erlaubter Bewegung (Klasse `smooth`, gesetzt vom Kopf-Skript).
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!document.documentElement.classList.contains('smooth')) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const inner = el.firstElementChild as HTMLElement | null;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      current = { x: current.x + (target.x - current.x) * 0.15, y: current.y + (target.y - current.y) * 0.15 };
      const settled = Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1;
      if (settled) current = { ...target };
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      if (inner) inner.style.setProperty('--magnet-x', `${current.x * -0.25}px`);
      if (inner) inner.style.setProperty('--magnet-y', `${current.y * -0.25}px`);
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Mittelpunkt ohne die aktuelle Verschiebung, sonst läuft das Element dem Zeiger davon
      const cx = r.left + r.width / 2 - current.x;
      const cy = r.top + r.height / 2 - current.y;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const radius = Math.max(r.width, r.height) * 1.1;
      target = Math.hypot(dx, dy) < radius ? { x: dx * strength, y: dy * strength } : { x: 0, y: 0 };
      start();
    };
    const onLeave = () => {
      target = { x: 0, y: 0 };
      start();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <span ref={ref} data-magnet className="inline-flex shrink-0 will-change-transform">
      {children}
    </span>
  );
}
