import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// functions/kundenbereich/rahmen.md

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT ${url}`);
  }),
}));
vi.mock('next/navigation', () => ({ redirect, usePathname: () => '/kunden', useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: (n: string) => (n === 'kb_zugang' ? { value: 'token' } : undefined) }),
  headers: vi.fn(),
}));
vi.mock('@/app/actions/kundenbereich', () => ({ requestLoginLink: vi.fn(), confirmLogin: vi.fn(), logout: vi.fn() }));
let art: 'admin' | 'kunde' = 'admin';
vi.mock('@/lib/kundenbereich/supabase', () => ({
  authApi: () => ({
    profil: async () => ({ art, name: art === 'admin' ? 'Erik' : 'Anna', sprache: 'de' }),
    projekte: async () => [],
    meinKunde: async () => null,
  }),
}));

const { default: KundenLeiste } = await import('@/components/kundenbereich/KundenLeiste');
const { default: KundenPage } = await import('@/components/kundenbereich/KundenPage');

beforeEach(() => {
  redirect.mockClear();
});

describe('Rahmen des Kundenbereichs', () => {
  it('AK-2: Leiste mit Logo und Link zurück zur Website', () => {
    const { unmount } = render(<KundenLeiste locale="de" />);
    const banner = screen.getByRole('banner');
    expect(screen.getByRole('link', { name: 'Zur Website' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Erik Bergheimer, zur Website' })).toHaveAttribute('href', '/');
    expect(banner.querySelector('nav')).toBeNull();
    unmount();
    render(<KundenLeiste locale="en" />);
    expect(screen.getByRole('link', { name: 'Back to website' })).toHaveAttribute('href', '/en');
  });

  it('AK-4: Admins ohne ?projekt landen auf der Verwaltung, Kunden nicht', async () => {
    art = 'admin';
    await expect(KundenPage({ locale: 'de' })).rejects.toThrow('REDIRECT /kunden/admin');
    await expect(KundenPage({ locale: 'en' })).rejects.toThrow('REDIRECT /kunden/admin');
    redirect.mockClear();
    await expect(KundenPage({ locale: 'de', auswahl: 'p1' })).resolves.toBeTruthy();
    art = 'kunde';
    await expect(KundenPage({ locale: 'de' })).resolves.toBeTruthy();
    expect(redirect).not.toHaveBeenCalled();
  });
});
