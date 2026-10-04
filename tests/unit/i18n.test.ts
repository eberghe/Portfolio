import { describe, expect, it } from 'vitest';
import { alternatePath, localizedPath, messages, splitLocale } from '@/lib/i18n';

// functions/seiten/navigation-und-footer.md, functions/mehrsprachigkeit/de-en.md
describe('Pfade je Sprache', () => {
  it.each([
    ['/', 'de', '/'],
    ['/', 'en', '/en'],
    ['/about', 'de', '/about'],
    ['/about', 'en', '/en/about'],
    ['/services/accessibility', 'en', '/en/services/accessibility'],
  ] as const)('localizedPath(%s, %s) = %s', (path, locale, expected) => {
    expect(localizedPath(path, locale)).toBe(expected);
  });

  it.each([
    ['/', { locale: 'de', path: '/' }],
    ['/about', { locale: 'de', path: '/about' }],
    ['/en', { locale: 'en', path: '/' }],
    ['/en/about', { locale: 'en', path: '/about' }],
    ['/english-page', { locale: 'de', path: '/english-page' }],
  ])('splitLocale(%s)', (pathname, expected) => {
    expect(splitLocale(pathname)).toEqual(expected);
  });

  it.each([
    ['/about', 'en', '/en/about'],
    ['/en/about', 'de', '/about'],
    ['/en', 'de', '/'],
    ['/', 'en', '/en'],
  ] as const)('AK-3: alternatePath(%s, %s) = %s', (pathname, target, expected) => {
    expect(alternatePath(pathname, target)).toBe(expected);
  });
});

describe('AK-8: Texte', () => {
  it('Deutsch und Englisch haben dieselben Schlüssel', () => {
    const keys = (o: object): string[] =>
      Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v).map((s) => `${k}.${s}`) : [k]));
    expect(keys(messages.en).sort()).toEqual(keys(messages.de).sort());
  });

  it('kein Text ist leer', () => {
    const values = (o: object): string[] =>
      Object.values(o).flatMap((v) => (typeof v === 'object' ? values(v) : [v as string]));
    for (const v of [...values(messages.de), ...values(messages.en)]) expect(v.trim()).not.toBe('');
  });
});
