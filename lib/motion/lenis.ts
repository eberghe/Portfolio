import type Lenis from 'lenis';

// Laufende Lenis-Instanz, damit Komponenten sofort springen können, ohne dass Lenis
// mit einer alten Zielposition dagegen animiert (functions/seiten/ueber-mich.md AK-32)
let current: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  current = lenis;
}

/** Springt ohne Animation an eine Position; hält Lenis dabei synchron */
export function jumpTo(top: number) {
  if (current) current.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: 'instant' });
}

/** Hält laufenden Schwung von Lenis an der aktuellen Position an */
export function halt() {
  if (current?.isScrolling) current.scrollTo(window.scrollY, { immediate: true, force: true });
}
