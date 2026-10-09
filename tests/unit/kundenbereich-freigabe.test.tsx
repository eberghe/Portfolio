import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// functions/kundenbereich/logo-freigabe.md

vi.mock('@/app/actions/kundenbereich', () => ({
  requestLoginLink: vi.fn(),
  confirmLogin: vi.fn(),
  logout: vi.fn(),
  logoFreigabe: vi.fn(async () => ({ status: 'idle' })),
}));
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));

const { logoFreigabe } = await import('@/lib/kundenbereich/freigabe');
const { authApi, loginDeps } = await import('@/lib/kundenbereich/supabase');
const { default: Projektuebersicht } = await import('@/components/kundenbereich/Projektuebersicht');
const { legal } = await import('@/lib/content/legal');
type MeinKunde = import('@/lib/kundenbereich/freigabe').MeinKunde;

const ANNA = { art: 'kunde' as const, name: 'Anna', sprache: 'de' as const };
const ERIK = { art: 'admin' as const, name: 'Erik', sprache: 'de' as const };
const MK: MeinKunde = {
  ansprechpartnerId: 'a1',
  kundeId: 'k1',
  kunde: 'Bäckerei',
  freigabe: 'offen',
  letzte: null,
};
const fd = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};

afterEach(() => vi.unstubAllGlobals());

describe('Logo-Freigabe', () => {
  it('AK-2/AK-3: trägt die Entscheidung im eigenen Namen ein, sonst nichts', async () => {
    const api = { meinKunde: vi.fn(async () => MK), freigeben: vi.fn(async () => {}) };
    expect(await logoFreigabe(fd({ entscheidung: 'erteilt', sprache: 'de' }), { access: 'tok', api })).toEqual({
      status: 'ok',
      message: 'Danke! Ich darf das Logo jetzt zeigen.',
    });
    expect(api.meinKunde).toHaveBeenCalledWith('tok');
    expect(api.freigeben).toHaveBeenCalledWith('tok', {
      kunde_id: 'k1',
      ansprechpartner_id: 'a1',
      entscheidung: 'erteilt',
    });
    expect(await logoFreigabe(fd({ entscheidung: 'widerrufen', sprache: 'en' }), { access: 'tok', api })).toEqual({
      status: 'ok',
      message: 'Revoked. I will no longer show the logo.',
    });

    api.freigeben.mockClear();
    expect(await logoFreigabe(fd({ entscheidung: 'vielleicht' }), { access: 'tok', api })).toMatchObject({
      status: 'error',
    });
    expect(await logoFreigabe(fd({ entscheidung: 'erteilt' }), { access: undefined, api })).toMatchObject({
      status: 'error',
    });
    api.meinKunde.mockResolvedValueOnce(null as unknown as MeinKunde);
    expect(await logoFreigabe(fd({ entscheidung: 'erteilt' }), { access: 'tok', api })).toMatchObject({
      status: 'error',
    });
    expect(api.freigeben).not.toHaveBeenCalled();
  });

  it('AK-2: Supabase-Aufrufe mit dem Token des Nutzers', async () => {
    const fetchMock = vi.fn<(u: string, i?: RequestInit) => Promise<Response>>(async (u) =>
      u.includes('/auth/v1/user')
        ? new Response(JSON.stringify({ id: 'u-anna' }))
        : u.includes('/rest/v1/ansprechpartner')
          ? new Response(
              JSON.stringify([
                {
                  id: 'a1',
                  kunde_id: 'k1',
                  kunden: {
                    name: 'Bäckerei',
                    logo_freigabe: 'erteilt',
                    logo_freigaben: [
                      { entscheidung: 'erteilt', am: '2026-10-08T09:00:00Z', ansprechpartner: { name: 'Anna' } },
                    ],
                  },
                },
              ]),
            )
          : new Response(null, { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const api = authApi({
      SUPABASE_URL: 'https://db.example',
      SUPABASE_ANON_KEY: 'anon',
      SUPABASE_SERVICE_ROLE_KEY: 'geheim',
    })!;
    expect(await api.meinKunde('tok')).toEqual({
      ansprechpartnerId: 'a1',
      kundeId: 'k1',
      kunde: 'Bäckerei',
      freigabe: 'erteilt',
      letzte: { entscheidung: 'erteilt', am: '2026-10-08T09:00:00Z', name: 'Anna' },
    });
    const ap = new URL(fetchMock.mock.calls[1]![0]);
    expect(ap.searchParams.get('user_id')).toBe('eq.u-anna');
    await api.freigeben('tok', { kunde_id: 'k1', ansprechpartner_id: 'a1', entscheidung: 'widerrufen' });
    const [url, init] = fetchMock.mock.calls[2]!;
    expect(url).toBe('https://db.example/rest/v1/logo_freigaben');
    expect(JSON.parse(init!.body as string)).toEqual({
      kunde_id: 'k1',
      ansprechpartner_id: 'a1',
      entscheidung: 'widerrufen',
    });
    for (const [, i] of fetchMock.mock.calls)
      expect((i!.headers as Record<string, string>).Authorization).toBe('Bearer tok');
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain('geheim');
  });

  it('AK-1/AK-4: Abschnitt für Ansprechpartner mit Stand und Button, nicht für Admins', () => {
    const { unmount } = render(<Projektuebersicht locale="de" profil={ANNA} projekte={[]} logo={MK} />);
    const s = screen.getByRole('region', { name: 'Logo auf meiner Website' });
    expect(s).toHaveTextContent('Darf ich das Logo von Bäckerei auf erik-bergheimer.de als Referenz zeigen?');
    expect(s).toHaveTextContent('Noch nicht freigegeben');
    expect(within(s).getByRole('button', { name: 'Ja, Logo freigeben' })).toHaveAttribute('type', 'submit');
    expect(s.querySelector('input[name="entscheidung"]')).toHaveValue('erteilt');
    unmount();

    const erteilt: MeinKunde = {
      ...MK,
      freigabe: 'erteilt',
      letzte: { entscheidung: 'erteilt', am: '2026-10-08T09:00:00Z', name: 'Anna' },
    };
    const r = render(<Projektuebersicht locale="en" profil={ANNA} projekte={[]} logo={erteilt} />);
    const en = screen.getByRole('region', { name: 'Logo on my website' });
    expect(en).toHaveTextContent('Approved on 8 Oct 2026 by Anna');
    expect(within(en).getByRole('button', { name: 'Revoke approval' })).toBeInTheDocument();
    expect(en.querySelector('input[name="entscheidung"]')).toHaveValue('widerrufen');
    r.unmount();

    render(<Projektuebersicht locale="de" profil={ERIK} projekte={[]} logo={null} />);
    expect(screen.queryByRole('region', { name: 'Logo auf meiner Website' })).toBeNull();
  });

  it('AK-5: Datenschutzerklärung beschreibt den Kundenbereich und die Cookies', () => {
    for (const [locale, title, cookies] of [
      ['de', 'Kundenbereich', /außerhalb des Kundenbereichs/i],
      ['en', 'Client area', /outside the client area/i],
    ] as const) {
      const d = legal.datenschutz[locale];
      const s = d.sections.find((x) => x.title === title);
      expect(s, locale).toBeDefined();
      const text = s!.paragraphs.join(' ');
      for (const p of [/Supabase/, /Frankfurt/, /Resend/, /kb_zugang/, /kb_erneuern/, /Art\. 6/, /24/, /TDDDG/])
        expect(text, `${locale} ${p}`).toMatch(p);
      expect(JSON.stringify(d.sections.find((x) => /Cookies/.test(x.title)))).toMatch(cookies);
    }
  });

  it('AK-6: Anmeldeversuche älter als 24 Stunden werden beim Eintragen gelöscht', async () => {
    const fetchMock = vi.fn<(u: string, i?: RequestInit) => Promise<Response>>(
      async () => new Response(null, { status: 204 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const deps = loginDeps({
      SUPABASE_URL: 'https://db.example',
      SUPABASE_ANON_KEY: 'a',
      SUPABASE_SERVICE_ROLE_KEY: 's',
      RESEND_API_KEY: 'r',
    })!;
    await deps.logAttempt('h', null);
    const del = fetchMock.mock.calls.find(([, i]) => i?.method === 'DELETE');
    expect(del).toBeDefined();
    const u = new URL(del![0]);
    expect(u.pathname).toBe('/rest/v1/anmeldeversuche');
    const since = Date.parse(u.searchParams.get('created_at')!.replace(/^lt\./, ''));
    expect(Date.now() - since).toBeGreaterThanOrEqual(24 * 3600 * 1000 - 5000);
    expect(Date.now() - since).toBeLessThan(24 * 3600 * 1000 + 5000);
  });
});
