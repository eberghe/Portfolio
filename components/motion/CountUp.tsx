'use client';

import { useEffect, useRef, useState } from 'react';

// Zahl, die beim Hinscrollen von 0 auf ihren Wert hochzählt (functions/seiten/startseite.md AK-38).
// Endwert steht im HTML (ohne JavaScript, für Screenreader); gezählt wird nur bei erlaubter Bewegung.
export default function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || !document.documentElement.classList.contains('smooth')) return;
    // Schon im Bild: Endwert stehen lassen, sonst flackert die Zahl nach dem Laden
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setShown(`0${suffix}`);
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1200);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(`${Math.round(eased * target)}${suffix}`);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur beim Einhängen
  }, []);

  if (!match) return <>{value}</>;
  return (
    <>
      <span ref={ref} aria-hidden="true" data-count={value} className="tabular-nums">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
