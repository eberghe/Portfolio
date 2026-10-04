import { describe, expect, it } from 'vitest';
import { contrastRatio, parseHsl, readTokens } from '@/lib/contrast';

describe('contrastRatio', () => {
  it('Schwarz auf Weiß ergibt 21:1', () => {
    expect(contrastRatio('0 0% 0%', '0 0% 100%')).toBeCloseTo(21, 5);
  });

  it('gleiche Farben ergeben 1:1', () => {
    expect(contrastRatio('161 36% 34%', '161 36% 34%')).toBeCloseTo(1, 5);
  });

  it('lehnt transparente Werte ab', () => {
    expect(() => parseHsl('0 0% 0% / 0.08')).toThrow();
  });
});

describe('readTokens', () => {
  it('liest Variablen nur aus dem angefragten Block', () => {
    const css = ':root { --a: 1 2% 3%; } .dark { --a: 4 5% 6%; }';
    expect(readTokens(css, ':root')).toEqual({ a: '1 2% 3%' });
    expect(readTokens(css, '.dark')).toEqual({ a: '4 5% 6%' });
  });
});
