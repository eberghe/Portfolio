import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// functions/kundenbereich/login.md AK-1, AK-7, AK-8

vi.mock('@/app/actions/kundenbereich', () => ({
  requestLoginLink: vi.fn(),
  confirmLogin: vi.fn(),
  logout: vi.fn(),
}));
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));

const { Welcome } = await import('@/components/kundenbereich/KundenPage');
const { default: ConfirmPage } = await import('@/components/kundenbereich/ConfirmPage');
const { kundenMetadata } = await import('@/lib/pages/kundenbereich');
const { sitePaths } = await import('@/lib/routes');
const { localizedPath } = await import('@/lib/i18n');

describe('Kundenbereich Seiten', () => {
  it('AK-1: noindex, nicht in der Sitemap, englische Pfade', () => {
    expect(kundenMetadata('/kunden', 'de').robots).toEqual({ index: false, follow: false });
    expect(sitePaths().some((p) => p.startsWith('/kunden'))).toBe(false);
    expect(localizedPath('/kunden', 'en')).toBe('/en/clients');
    expect(localizedPath('/kunden/anmelden', 'en')).toBe('/en/clients/sign-in');
  });

  it('AK-7: Bestätigung erst per Button, ungültiger Code zeigt Link zum Formular', () => {
    const { container, unmount } = render(<ConfirmPage locale="de" code="abc" invalid={false} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Anmeldung bestätigen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jetzt anmelden' })).toHaveAttribute('type', 'submit');
    expect(container.querySelector('input[name="code"]')).toHaveValue('abc');
    unmount();
    render(<ConfirmPage locale="en" code="abc" invalid />);
    expect(screen.getByRole('heading', { level: 1, name: 'This link no longer works' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request a new link' })).toHaveAttribute('href', '/en/clients');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('Kritiker 1: Titel der Bestätigungsseiten wird nur einmal angesagt', () => {
    const { unmount } = render(<ConfirmPage locale="de" code="abc" invalid={false} />);
    expect(screen.getAllByRole('heading', { name: 'Anmeldung bestätigen' })).toHaveLength(1);
    expect(screen.getByRole('region', { name: 'Anmeldung bestätigen' })).toBeInTheDocument();
    unmount();
    render(<ConfirmPage locale="de" code="" invalid />);
    expect(screen.getAllByRole('heading', { name: 'Dieser Link funktioniert nicht mehr' })).toHaveLength(1);
  });

  it('AK-8: angemeldet mit Namen und Abmelden, Admin gekennzeichnet', () => {
    const { unmount } = render(<Welcome locale="de" profil={{ art: 'kunde', name: 'Anna', sprache: 'de' }} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Hallo, Anna' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abmelden' })).toHaveAttribute('type', 'submit');
    unmount();
    render(<Welcome locale="en" profil={{ art: 'admin', name: 'Erik', sprache: 'de' }} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Hello, Erik Admin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });
});
