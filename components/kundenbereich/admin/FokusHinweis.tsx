'use client';

import { useEffect, useRef } from 'react';

// Meldung nach einer Weiterleitung, z. B. „Projekt angelegt.“: bekommt den Fokus,
// weil Screenreader eine schon vorhandene Statusmeldung oft nicht ansagen (Kritiker Dashboard 4)
export default function FokusHinweis({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <p
      ref={ref}
      role="status"
      tabIndex={-1}
      className="border border-primary-border bg-primary-light rounded-lg px-3 py-2 text-[14px] text-foreground mb-6"
    >
      {children}
    </p>
  );
}
