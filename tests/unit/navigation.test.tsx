import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

// functions/seiten/navigation-und-footer.md
let pathname = '/about';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

beforeEach(() => {
  pathname = '/about';
  document.documentElement.className = '';
  localStorage.clear();
});

describe('Navbar', () => {
  it('AK-1: nav mit sprachrichtigem Namen', () => {
    render(<Navbar locale="de" />);
    expect(screen.getByRole('navigation', { name: 'Hauptnavigation' })).toBeInTheDocument();
  });

  it('AK-1: englischer Name auf englischen Seiten', () => {
    pathname = '/en/about';
    render(<Navbar locale="en" />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('AK-2: aktueller Link hat aria-current="page"', () => {
    render(<Navbar locale="de" />);
    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' });
    const links = within(nav).getAllByRole('link', { name: 'Über mich' });
    expect(links[0]).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getAllByRole('link', { name: 'Projekte' })[0]).not.toHaveAttribute('aria-current');
  });

  it('AK-3: Sprachlink zeigt auf das englische Gegenstück', () => {
    render(<Navbar locale="de" />);
    const link = screen.getByRole('link', { name: 'English' });
    expect(link).toHaveAttribute('href', '/en/about');
    expect(link).toHaveAttribute('lang', 'en');
    expect(link).toHaveAttribute('hreflang', 'en');
  });

  it('AK-3: auf Englisch zeigt der Sprachlink auf Deutsch', () => {
    pathname = '/en/about';
    render(<Navbar locale="en" />);
    const link = screen.getByRole('link', { name: 'Deutsch' });
    expect(link).toHaveAttribute('href', '/about');
    expect(link).toHaveAttribute('lang', 'de');
  });

  it('AK-4: Burger steuert das mobile Menü, geschlossen ist es nicht erreichbar', () => {
    render(<Navbar locale="de" />);
    const burger = screen.getByRole('button', { name: 'Menü' });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
    const menu = document.getElementById(burger.getAttribute('aria-controls')!);
    expect(menu).not.toBeNull();
    expect(menu).not.toBeVisible();

    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toBeVisible();
  });

  it('AK-4: Escape schließt das Menü und fokussiert den Burger', () => {
    render(<Navbar locale="de" />);
    const burger = screen.getByRole('button', { name: 'Menü' });
    fireEvent.click(burger);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
    expect(burger).toHaveFocus();
  });

  it('AK-5: Dunkelmodus-Button schaltet, zeigt Zustand und speichert', () => {
    render(<Navbar locale="de" />);
    const toggle = screen.getByRole('button', { name: 'Dunkelmodus' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});

describe('Footer', () => {
  it('AK-2: aktueller Link im Footer hat aria-current="page"', () => {
    render(<Footer locale="de" />);
    for (const link of screen.getAllByRole('link', { name: 'Über mich' }))
      expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('AK-15: Footer ist im Dunkelmodus durch eine Linie abgegrenzt', () => {
    const { container } = render(<Footer locale="de" />);
    expect(container.querySelector('footer')).toHaveClass('dark:border-t', 'dark:border-white/10');
  });

  it('AK-8: englischer Satz auf der deutschen Seite ist als Englisch ausgezeichnet', () => {
    render(<Footer locale="de" />);
    for (const el of screen.getAllByText(/made with/)) expect(el).toHaveAttribute('lang', 'en');
  });

  it('AK-1: Footer-Links liegen auf allen Breiten in einer Navigation', () => {
    render(<Footer locale="de" />);
    const navs = screen.getAllByRole('navigation', { name: 'Fußzeile' });
    const linksInNav = navs.flatMap((n) => within(n).queryAllByRole('link', { name: 'Projekte' }));
    expect(linksInNav).toHaveLength(screen.getAllByRole('link', { name: 'Projekte' }).length);
  });

  it('AK-6: Social-Links sind echte Links', () => {
    render(<Footer locale="de" />);
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/erik.bergheimer/',
    );
    expect(screen.getByRole('link', { name: 'E-Mail' })).toHaveAttribute('href', expect.stringMatching(/^mailto:/));
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/erik-bergheimer/',
    );
  });

  it('AK-8: Links folgen der Sprache', () => {
    render(<Footer locale="en" />);
    // Desktop- und Mobil-Variante liegen beide im DOM, CSS zeigt je Viewport nur eine.
    for (const link of screen.getAllByRole('link', { name: 'Imprint' }))
      expect(link).toHaveAttribute('href', '/en/impressum');
    for (const link of screen.getAllByRole('link', { name: 'Back to top' }))
      expect(link).toHaveAttribute('href', '#seitenanfang');
  });
});
