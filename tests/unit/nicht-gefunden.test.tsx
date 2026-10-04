import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from '@/components/NotFound';

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

describe('AK-4: ohne Sprachzuordnung', () => {
  it('englischer Abschnitt mit lang="en" und Link zur englischen Startseite', () => {
    const { container } = render(<NotFound locale="de" bilingual />);
    const en = container.querySelector('[lang="en"]')!;
    expect(en).not.toBeNull();
    expect(en).toHaveTextContent('Page not found');
    expect(within(en as HTMLElement).getByRole('link')).toHaveAttribute('href', '/en');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
