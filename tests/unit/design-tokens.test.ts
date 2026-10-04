import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio, readTokens } from '@/lib/contrast';

// functions/infrastruktur/design-tokens.md
const css = readFileSync(resolve(process.cwd(), 'app/globals.css'), 'utf8');
// error-text: Fehlermeldungen des Anfrage-Assistenten (functions/kontakt/anfrage-assistent.md AK-2)
const TEXT = ['foreground', 'text2', 'text3', 'primary-text', 'error-text'];
const BACKGROUNDS = ['background', 'bg2', 'bg3'];

describe.each([
  ['hell', ':root'],
  ['dunkel', '.dark'],
])('Design-Tokens (%s)', (_mode, selector) => {
  const tokens = readTokens(css, selector);

  it('AK-2: definiert alle Text- und Hintergrund-Tokens', () => {
    for (const name of [...TEXT, ...BACKGROUNDS, 'primary', 'primary-foreground']) {
      expect(tokens[name], `--${name}`).toBeDefined();
    }
  });

  it.each(TEXT.flatMap((t) => BACKGROUNDS.map((b) => [t, b])))(
    'AK-4: --%s auf --%s erreicht mindestens 4,5:1',
    (text, bg) => {
      expect(contrastRatio(tokens[text]!, tokens[bg]!)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('AK-4: Button-Text auf --primary erreicht mindestens 4,5:1', () => {
    expect(contrastRatio(tokens['primary-foreground']!, tokens.primary!)).toBeGreaterThanOrEqual(4.5);
  });

  it('AK-5: Button-Text auf --primary-hover (Hover-Zustand) erreicht mindestens 4,5:1', () => {
    expect(contrastRatio(tokens['primary-foreground']!, tokens['primary-hover']!)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('AK-5: Hover-Zustand der Buttons', () => {
  it('kein Aufhellen per Deckkraft (white auf 90 % Grün liegt unter 4,5:1)', () => {
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));
    for (const f of files('components')) expect(readFileSync(f, 'utf8'), f).not.toContain('hover:opacity-90');
  });
});
