import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Navbar from '@/components/Navbar';
import NotFound from '@/components/NotFound';

let pathname = '/projects/xyz';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

// functions/seiten/nicht-gefunden.md
describe('AK-2: Aufbau', () => {
  it.each([
    ['de', 'Seite nicht gefunden', ['/', '/services', '/projects', '/contact']],
    ['en', 'Page not found', ['/en', '/en/services', '/en/projects', '/en/contact']],
  ] as const)('%s', (locale, title, hrefs) => {
    render(<NotFound locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    const list = screen.getByRole('list');
    expect(
      within(list)
        .getAllByRole('link')
        .map((l) => l.getAttribute('href')),
    ).toEqual(hrefs);
  });
});

describe('AK-4: Abschnitt in der anderen Sprache', () => {
  it.each([
    ['de', 'en', 'Page not found', '/en'],
    ['en', 'de', 'Seite nicht gefunden', '/'],
  ] as const)('%s-Seite mit %s-Abschnitt', (locale, other, title, href) => {
    const { container } = render(<NotFound locale={locale} />);
    const section = container.querySelector(`[lang="${other}"]`)!;
    expect(section).not.toBeNull();
    expect(section).toHaveTextContent(title);
    expect(within(section as HTMLElement).getByRole('link')).toHaveAttribute('href', href);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});

describe('AK-6: Navigation auf der 404', () => {
  it.each([
    ['de', '/projects/xyz', '/en'],
    ['en', '/en/foo', '/'],
  ] as const)('%s: kein Menüpunkt aktiv, Sprachwechsel zur Startseite', (locale, path, home) => {
    pathname = path;
    const { container } = render(<Navbar locale={locale} notFound />);
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(0);
    expect(container.querySelector(`a[hreflang="${locale === 'de' ? 'en' : 'de'}"]`)).toHaveAttribute('href', home);
  });
});
