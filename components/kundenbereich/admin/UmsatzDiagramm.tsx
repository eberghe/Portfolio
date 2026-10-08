import { euro } from '@/lib/kundenbereich/admin/dashboard';

// Gestapelte Säulen „Sicher“ + „Gewichtet“ je Jahr (functions/kundenbereich/admin-dashboard.md Verhalten 3).
// Das Diagramm ist dekorativ (aria-hidden); die Tabelle daneben trägt dieselben Werte.

type Jahr = { jahr: number; sicher: number; gewichtet: number };

const H = 180; // Höhe der Zeichenfläche
const TOP = 22; // Platz für die Summe über der Säule
const BOTTOM = 22; // Platz für die Jahreszahl
const SLOT = 64;
const BAR = 24;
const GAP = 2; // Trennung der Segmente in der Hintergrundfarbe

/** Rechteck mit 4 px Rundung oben, gerade an der Grundlinie */
function oben(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, h, w / 2);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

export const schraffur =
  'repeating-linear-gradient(45deg, var(--chart-gewichtet) 0 4px, color-mix(in srgb, var(--chart-gewichtet) 55%, hsl(var(--background))) 4px 6px)';

export default function UmsatzDiagramm({ jahre }: { jahre: Jahr[] }) {
  const max = Math.max(...jahre.map((j) => j.sicher + j.gewichtet), 1);
  const breite = Math.max(jahre.length * SLOT, 200);
  const plot = H - TOP - BOTTOM;
  const y0 = TOP + plot;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${breite} ${H}`}
      className="w-full h-auto max-h-[240px] overflow-visible"
      style={{ maxWidth: breite * 1.6 }}
    >
      <defs>
        <pattern
          id="schraffur-gewichtet"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="6" fill="var(--chart-gewichtet)" />
          <rect width="2" height="6" fill="hsl(var(--background))" opacity="0.45" />
        </pattern>
      </defs>
      <line x1="0" x2={breite} y1={y0 + 0.5} y2={y0 + 0.5} stroke="hsl(var(--foreground) / 0.15)" strokeWidth="1" />
      {jahre.map((j, i) => {
        const x = i * SLOT + (SLOT - BAR) / 2 + (breite - jahre.length * SLOT) / 2;
        const hs = (j.sicher / max) * plot;
        const hg = (j.gewichtet / max) * plot;
        const summe = j.sicher + j.gewichtet;
        // oberes Segment bekommt die Rundung, darunter 2 px Abstand
        const gapG = hs > 0 && hg > 0 ? GAP : 0;
        return (
          <g key={j.jahr}>
            <title>{`${j.jahr}: sicher ${euro(j.sicher)}, gewichtet ${euro(j.gewichtet)}`}</title>
            {hs > 0 &&
              (hg > 0 ? (
                <rect x={x} y={y0 - hs} width={BAR} height={hs} fill="var(--chart-sicher)" />
              ) : (
                <path d={oben(x, y0 - hs, BAR, hs)} fill="var(--chart-sicher)" />
              ))}
            {hg > gapG && <path d={oben(x, y0 - hs - hg, BAR, hg - gapG)} fill="url(#schraffur-gewichtet)" />}
            {summe > 0 && (
              <text
                x={x + BAR / 2}
                y={y0 - hs - hg - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="hsl(var(--foreground))"
              >
                {kurz(summe)}
              </text>
            )}
            <text x={x + BAR / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="hsl(var(--text2))">
              {j.jahr}
            </text>
            {/* größere Trefferfläche für den Tooltip */}
            <rect x={x - (SLOT - BAR) / 2} y={TOP} width={SLOT} height={plot} fill="transparent" />
          </g>
        );
      })}
    </svg>
  );
}

/** „16 T€“, „1,2 Mio. €“ für die Beschriftung über der Säule */
function kurz(n: number) {
  return new Intl.NumberFormat('de-DE', {
    notation: 'compact',
    maximumFractionDigits: 1,
    style: 'currency',
    currency: 'EUR',
  }).format(n);
}
