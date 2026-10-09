'use client';

import { useEffect } from 'react';

// Signal für E2E-Tests im Kundenbereich, dort fehlt die Navbar, die es sonst setzt (rahmen.md)
export default function Hydriert() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';
  }, []);
  return null;
}
