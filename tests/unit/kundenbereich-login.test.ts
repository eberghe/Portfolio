import { describe, expect, it, vi } from 'vitest';
import { inviteLink, requestLink, siteOrigin, type Konto, type LoginDeps } from '@/lib/kundenbereich/login';
import { ACCESS, REFRESH, refreshCookies, sessionCookies, tokenExpired } from '@/lib/kundenbereich/session';
import { supabaseDb } from './helpers/supabase-pglite';

// functions/kundenbereich/login.md

const ANNA: Konto = { art: 'kunde', ansprechpartnerId: 'ap-anna', userId: 'user-anna', name: 'Anna', sprache: 'de' };

function deps(konto: Konto | null = ANNA, recent = { email: 0, ip: 0 }) {
  return {
    konto: vi.fn<LoginDeps['konto']>(async () => konto),
    recent: vi.fn<LoginDeps['recent']>(async () => recent),
    logAttempt: vi.fn<LoginDeps['logAttempt']>(async () => {}),
    createUser: vi.fn<LoginDeps['createUser']>(async () => 'user-neu'),
    linkUser: vi.fn<LoginDeps['linkUser']>(async () => {}),
    generateCode: vi.fn<LoginDeps['generateCode']>(async () => 'code-123'),
    sendMail: vi.fn<LoginDeps['sendMail']>(async () => {}),
  };
}

const form = (email: string) => {
  const fd = new FormData();
  fd.set('email', email);
  return fd;
};
const hash = (v: string) => `h(${v})`;
const run = (email: string, d: ReturnType<typeof deps> | null, host: string | null = 'erik-bergheimer.de') =>
  requestLink(form(email), { deps: d, host, ip: '1.2.3.4', hash });

/** Unsigniertes JWT mit Ablaufzeit (Sekunden) */
const jwt = (exp: number) => `x.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.y`;

describe('Anmeldelink anfordern', () => {
  it('AK-2: ungültige Adresse liefert Fehler, nichts wird verschickt', async () => {
    const d = deps();
    for (const email of ['', 'kein-at', 'a@b', 'x'.repeat(250) + '@a.de']) {
      expect(await run(email, d)).toEqual({ status: 'invalid', email });
    }
    expect(d.konto).not.toHaveBeenCalled();
    expect(d.sendMail).not.toHaveBeenCalled();
  });

  it('AK-3: hinterlegte Adresse bekommt genau eine Mail mit Link, unbekannte keine, Antwort gleich', async () => {
    const d = deps();
    const known = await run(' Anna@A.example ', d);
    expect(d.konto).toHaveBeenCalledWith('anna@a.example');
    expect(d.generateCode).toHaveBeenCalledWith('anna@a.example');
    expect(d.sendMail).toHaveBeenCalledTimes(1);
    const mail = d.sendMail.mock.calls[0]![0];
    expect(mail.to).toBe('anna@a.example');
    expect(mail.text).toContain('https://erik-bergheimer.de/kunden/anmelden?code=code-123');
    expect(mail.subject).toMatch(/Kundenbereich/);

    const en = deps({ ...ANNA, sprache: 'en' });
    await run('anna@a.example', en);
    expect(en.sendMail.mock.calls[0]![0].text).toContain('https://erik-bergheimer.de/en/clients/sign-in?code=code-123');
    expect(en.sendMail.mock.calls[0]![0].subject).toMatch(/client area/i);

    const u = deps(null);
    const unknown = await run('fremd@example.org', u);
    expect(u.generateCode).not.toHaveBeenCalled();
    expect(u.createUser).not.toHaveBeenCalled();
    expect(u.sendMail).not.toHaveBeenCalled();
    expect(unknown).toEqual(known);
    expect(known).toEqual({ status: 'sent' });
    expect(u.logAttempt).toHaveBeenCalledWith('h(fremd@example.org)', 'h(1.2.3.4)');
  });

  it('AK-4: fehlender Supabase-Nutzer wird angelegt und verknüpft', async () => {
    const d = deps({ ...ANNA, userId: null });
    await run('anna@a.example', d);
    expect(d.createUser).toHaveBeenCalledWith('anna@a.example');
    expect(d.linkUser).toHaveBeenCalledWith('ap-anna', 'user-neu');
    expect(d.createUser.mock.invocationCallOrder[0]!).toBeLessThan(d.generateCode.mock.invocationCallOrder[0]!);

    const admin = deps({ art: 'admin', ansprechpartnerId: null, userId: 'user-erik', name: 'Erik', sprache: 'de' });
    await run('erb1209@outlook.de', admin);
    expect(admin.createUser).not.toHaveBeenCalled();
    expect(admin.sendMail).toHaveBeenCalledTimes(1);
  });

  it('AK-5: Limits pro Adresse und pro Absender, Antwort bleibt gleich', async () => {
    for (const recent of [
      { email: 3, ip: 0 },
      { email: 0, ip: 10 },
    ]) {
      const d = deps(ANNA, recent);
      expect(await run('anna@a.example', d)).toEqual({ status: 'sent' });
      expect(d.generateCode).not.toHaveBeenCalled();
      expect(d.sendMail).not.toHaveBeenCalled();
    }
    const d = deps(ANNA, { email: 2, ip: 9 });
    await run('anna@a.example', d);
    expect(d.sendMail).toHaveBeenCalledTimes(1);
    const [emailHash, ipHash, sinceEmail, sinceIp] = d.recent.mock.calls[0]!;
    expect([emailHash, ipHash]).toEqual(['h(anna@a.example)', 'h(1.2.3.4)']);
    expect(Date.now() - Date.parse(sinceEmail)).toBeGreaterThanOrEqual(15 * 60 * 1000 - 1000);
    expect(Date.now() - Date.parse(sinceEmail)).toBeLessThan(16 * 60 * 1000);
    expect(Date.now() - Date.parse(sinceIp)).toBeGreaterThanOrEqual(60 * 60 * 1000 - 1000);
  });

  it('AK-6: Link nur auf erlaubte Adressen', () => {
    expect(siteOrigin('erik-bergheimer.de')).toBe('https://erik-bergheimer.de');
    expect(siteOrigin('www.erik-bergheimer.de')).toBe('https://www.erik-bergheimer.de');
    expect(siteOrigin('erikbergheimer-git-claude-kundenbereich-q1t6v6-org-8b0b.vercel.app')).toBe(
      'https://erikbergheimer-git-claude-kundenbereich-q1t6v6-org-8b0b.vercel.app',
    );
    expect(siteOrigin('localhost:3100')).toBe('http://localhost:3100');
    for (const bad of ['evil.example', 'erik-bergheimer.de.evil.example', 'evil-org-8b0b.vercel.app', null, ''])
      expect(siteOrigin(bad), String(bad)).toBe('https://erik-bergheimer.de');
  });

  it('AK-10: ohne Zugang zu Supabase/Resend „nicht erreichbar“, bei Fehler ebenso', async () => {
    expect(await run('anna@a.example', null)).toEqual({ status: 'unavailable' });
    const d = deps();
    d.sendMail.mockRejectedValueOnce(new Error('Resend 500'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await run('anna@a.example', d)).toEqual({ status: 'unavailable' });
  });
});

describe('Einladung aus der Verwaltung', () => {
  it('admin.md Verhalten 5: schickt den Link, meldet Limit und unbekannte Adresse ehrlich', async () => {
    const d = deps();
    expect(await inviteLink('anna@a.example', { deps: d, host: 'erik-bergheimer.de', hash })).toBe('sent');
    expect(d.sendMail).toHaveBeenCalledTimes(1);
    expect(d.logAttempt).toHaveBeenCalledWith('h(anna@a.example)', null);
    expect(await inviteLink('x@a.example', { deps: deps(null), host: null, hash })).toBe('unknown');
    const voll = deps(ANNA, { email: 3, ip: 0 });
    expect(await inviteLink('anna@a.example', { deps: voll, host: null, hash })).toBe('limit');
    expect(voll.sendMail).not.toHaveBeenCalled();
    expect(await inviteLink('anna@a.example', { deps: null, host: null, hash })).toBe('unavailable');
  });
});

describe('Sitzung', () => {
  it('AK-7: Cookies httpOnly, sameSite lax, Laufzeiten', () => {
    const cookies = sessionCookies({ access_token: 'a', refresh_token: 'r', expires_in: 3600 }, true);
    expect(cookies.map((c) => c.name)).toEqual([ACCESS, REFRESH]);
    for (const c of cookies)
      expect(c.options).toMatchObject({ httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
    expect(cookies[0]!.options.maxAge).toBe(3600);
    expect(cookies[1]!.options.maxAge).toBe(30 * 24 * 3600);
    expect(sessionCookies({ access_token: 'a', refresh_token: 'r', expires_in: 3600 }, false)[0]!.options.secure).toBe(
      false,
    );
  });

  it('AK-9: abgelaufener Token wird erneuert, ungültiger Refresh löscht', async () => {
    const now = 1_800_000_000;
    expect(tokenExpired(jwt(now + 600), now)).toBe(false);
    expect(tokenExpired(jwt(now + 10), now)).toBe(true);
    expect(tokenExpired('kaputt', now)).toBe(true);

    const refresh = vi.fn(async () => ({ access_token: 'neu', refresh_token: 'r2', expires_in: 3600 }));
    expect(await refreshCookies(jwt(now + 600), 'r', refresh, true, now)).toBeNull();
    expect(await refreshCookies(undefined, undefined, refresh, true, now)).toBeNull();
    expect(refresh).not.toHaveBeenCalled();

    const result = await refreshCookies(jwt(now - 5), 'r', refresh, true, now);
    expect(refresh).toHaveBeenCalledWith('r');
    expect(result).toEqual({
      set: sessionCookies({ access_token: 'neu', refresh_token: 'r2', expires_in: 3600 }, true),
    });

    expect(await refreshCookies(undefined, 'r', async () => null, true, now)).toEqual({ clear: true });
  });
});

describe('Datenbank für den Login', () => {
  it('AK-3/AK-4: kundenbereich_konto findet Ansprechpartner und Admins, nur für den Server', async () => {
    const db = await supabaseDb(
      'supabase/migrations/20261008000000_kundenbereich.sql',
      'supabase/migrations/20261008100000_anmeldeversuche.sql',
    );
    const erik = '00000000-0000-4000-8000-000000000001';
    const kunde = '10000000-0000-4000-8000-00000000000a';
    await db.exec(`
      insert into auth.users (id, email) values ('${erik}', 'erb1209@outlook.de');
      insert into public.admins (user_id) values ('${erik}');
      insert into public.kunden (id, name) values ('${kunde}', 'Kunde A');
      insert into public.ansprechpartner (kunde_id, name, email, sprache) values ('${kunde}', 'Anna', 'anna@a.example', 'en');
    `);
    const konto = async (email: string) =>
      (await db.query<Record<string, unknown>>('select * from public.kundenbereich_konto($1)', [email])).rows;
    expect(await konto('ANNA@a.example')).toEqual([
      expect.objectContaining({ art: 'kunde', name: 'Anna', sprache: 'en', user_id: null }),
    ]);
    expect(await konto('erb1209@outlook.de')).toEqual([
      expect.objectContaining({ art: 'admin', user_id: erik, ansprechpartner_id: null }),
    ]);
    expect(await konto('fremd@example.org')).toEqual([]);

    for (const user of [null, erik]) {
      await db.as(user, async () => {
        await expect(db.query('select * from public.kundenbereich_konto($1)', ['anna@a.example'])).rejects.toThrow(
          /permission/,
        );
        await expect(db.query('select * from public.anmeldeversuche')).rejects.toThrow(/permission/);
      });
    }
    await db.as(erik, async () => {
      expect((await db.query('select * from public.kundenbereich_profil()')).rows).toEqual([
        expect.objectContaining({ art: 'admin', name: 'Erik' }),
      ]);
    });
  }, 30_000);
});
