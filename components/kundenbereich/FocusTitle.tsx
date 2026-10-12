'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// h1, die nach einem Seitenwechsel durch eine Server Action den Fokus bekommt (Befund Blinder Kritiker, login.md)
export default function FocusTitle({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <h1 ref={ref} tabIndex={-1} className={`${className} outline-none`}>
      {children}
    </h1>
  );
}
