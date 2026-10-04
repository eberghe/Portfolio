/** WCAG-2-Kontrast für HSL-Werte im Format der CSS-Variablen ("207 30% 13%"). */

export function parseHsl(value: string): [number, number, number] {
  const m = value.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!m) throw new Error(`Kein undurchsichtiger HSL-Wert: "${value}"`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) => lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function luminance([r, g, b]: [number, number, number]): number {
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(hslToRgb(...parseHsl(a)));
  const lb = luminance(hslToRgb(...parseHsl(b)));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Liest die CSS-Variablen eines Blocks (z. B. ":root" oder ".dark") aus einer CSS-Datei. */
export function readTokens(css: string, selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!block?.[1]) throw new Error(`Block ${selector} nicht gefunden`);
  const tokens: Record<string, string> = {};
  for (const m of block[1].matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    tokens[m[1]!] = m[2]!.trim();
  }
  return tokens;
}
