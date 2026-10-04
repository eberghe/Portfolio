import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { InquiryState } from '@/lib/contact/submit';

// functions/kontakt/anfrage-assistent.md, functions/seiten/kontakt.md

const action = vi.fn<(prev: InquiryState, fd: FormData) => Promise<InquiryState>>();
vi.mock('@/app/actions/inquiry', () => ({ submitInquiry: (p: InquiryState, fd: FormData) => action(p, fd) }));

const { default: InquiryWizard } = await import('@/components/contact/InquiryWizard');
const { default: ContactPage } = await import('@/components/contact/ContactPage');
const { default: ServiceDetail } = await import('@/components/services/ServiceDetail');
const { validateInquiry } = await import('@/lib/contact/validate');
const { handleInquiry } = await import('@/lib/contact/submit');
const { inquiryMailto } = await import('@/lib/contact/mailto');
const { supabaseStore, resendNotifier } = await import('@/lib/contact/supabase');
const { contactPageJsonLd } = await import('@/lib/structured-data');
const { contactMetadata } = await import('@/lib/pages/contact');
const { services } = await import('@/lib/content/services');
const { sitePaths } = await import('@/lib/routes');

const valid = {
  leistungen: ['webflow-development', 'accessibility'],
  beschreibung: 'Wir brauchen einen barrierefreien Relaunch unserer Website.',
  website: 'beispiel.de',
  zeitrahmen: 'bald',
  budget: 'offen',
  name: 'Alex Muster',
  email: 'alex@beispiel.de',
  telefon: '+49 821 123456',
  einwilligung: 'ja',
  sprache: 'de',
};

function formData(values: Record<string, string | string[]> = valid) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) for (const x of [v].flat()) fd.append(k, x);
  return fd;
}

const without = (...keys: string[]) =>
  Object.fromEntries(Object.entries(valid).filter(([k]) => !keys.includes(k))) as Record<string, string | string[]>;

describe('AK-6: Prüfregeln', () => {
  it('gültige Anfrage wird normalisiert', () => {
    const r = validateInquiry(formData());
    expect(r.errors).toEqual({});
    expect(r.data).toMatchObject({
      leistungen: ['webflow-development', 'accessibility'],
      website: 'https://beispiel.de',
      telefon: '+49 821 123456',
      sprache: 'de',
    });
  });

  it.each([
    ['leistungen', without('leistungen'), 'required'],
    ['leistungen', { ...valid, leistungen: ['hacking'] }, 'invalid'],
    ['beschreibung', { ...valid, beschreibung: 'zu kurz' }, 'tooShort'],
    ['beschreibung', { ...valid, beschreibung: 'x'.repeat(3001) }, 'tooLong'],
    ['beschreibung', without('beschreibung'), 'required'],
    ['website', { ...valid, website: 'javascript:alert(1)' }, 'invalid'],
    ['website', { ...valid, website: 'ftp://beispiel.de' }, 'invalid'],
    ['zeitrahmen', { ...valid, zeitrahmen: 'gestern' }, 'invalid'],
    ['budget', { ...valid, budget: 'eine Million' }, 'invalid'],
    ['name', { ...valid, name: 'A' }, 'tooShort'],
    ['name', { ...valid, name: 'A'.repeat(101) }, 'tooLong'],
    ['email', { ...valid, email: 'alex@' }, 'invalid'],
    ['email', without('email'), 'required'],
    ['telefon', { ...valid, telefon: '0821 abc' }, 'invalid'],
    ['einwilligung', without('einwilligung'), 'required'],
  ])('%s: %j → %s', (field, values, code) => {
    expect(validateInquiry(formData(values as Record<string, string>)).errors).toMatchObject({ [field]: code });
  });

  it('optionale Felder dürfen fehlen, Zeitrahmen und Budget sind dann „offen"', () => {
    const r = validateInquiry(formData(without('website', 'telefon', 'zeitrahmen', 'budget')));
    expect(r.errors).toEqual({});
    expect(r.data).toMatchObject({ website: null, telefon: null, zeitrahmen: 'offen', budget: 'offen' });
  });

  it('prüft auf Wunsch nur einzelne Felder (ein Schritt)', () => {
    expect(validateInquiry(formData({ leistungen: 'ux-ui-design' }), ['leistungen']).errors).toEqual({});
  });
});

describe('AK-3/AK-5/AK-7: Verarbeitung auf dem Server', () => {
  const store = () => ({ save: vi.fn(async () => {}), recentCount: vi.fn(async () => 0) });

  it('speichert gültige Anfragen und benachrichtigt Erik (AK-5)', async () => {
    const s = store();
    const notify = vi.fn(async () => {});
    const state = await handleInquiry(formData(), { store: s, notify, ipHash: 'h1' });
    expect(state.status).toBe('sent');
    expect(s.save).toHaveBeenCalledWith(expect.objectContaining({ email: 'alex@beispiel.de' }), 'h1');
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alex Muster' }));
  });

  it('fehlgeschlagene Benachrichtigung ändert nichts am Erfolg (AK-5)', async () => {
    const notify = vi.fn(async () => {
      throw new Error('mail down');
    });
    expect((await handleInquiry(formData(), { store: store(), notify, ipHash: null })).status).toBe('sent');
  });

  it('ungültige Anfragen liefern Fehler und Eingaben zurück', async () => {
    const s = store();
    const state = await handleInquiry(formData(without('email')), { store: s, ipHash: null });
    expect(state).toMatchObject({ status: 'invalid', errors: { email: 'required' } });
    expect(state.status === 'invalid' && state.values.name).toBe('Alex Muster');
    expect(s.save).not.toHaveBeenCalled();
  });

  it('Honeypot: meldet Erfolg, speichert nichts (AK-3)', async () => {
    const s = store();
    const state = await handleInquiry(formData({ ...valid, fax: 'spam' }), { store: s, ipHash: 'h1' });
    expect(state.status).toBe('sent');
    expect(s.save).not.toHaveBeenCalled();
  });

  it('ab der 4. Anfrage pro Stunde: Hinweis statt Speichern (AK-3)', async () => {
    const s = { ...store(), recentCount: vi.fn(async () => 3) };
    const state = await handleInquiry(formData(), { store: s, ipHash: 'h1' });
    expect(state.status).toBe('limited');
    expect(s.save).not.toHaveBeenCalled();
    const since = new Date((s.recentCount.mock.calls[0] as unknown as [string, string])[1]).getTime();
    expect(Date.now() - since).toBeGreaterThanOrEqual(59 * 60 * 1000);
  });

  it('ohne Supabase: E-Mail-Ausweichweg (AK-7)', async () => {
    const state = await handleInquiry(formData(), { store: null, ipHash: null });
    expect(state).toMatchObject({ status: 'fallback', reason: 'unavailable' });
    expect(state.status === 'fallback' && state.mailto).toMatch(/^mailto:erb1209@outlook\.de\?subject=/);
  });

  it('Speicherfehler: E-Mail-Ausweichweg (AK-7)', async () => {
    const s = {
      ...store(),
      save: vi.fn(async () => {
        throw new Error('db down');
      }),
    };
    expect(await handleInquiry(formData(), { store: s, ipHash: null })).toMatchObject({
      status: 'fallback',
      reason: 'failed',
    });
  });

  it('mailto enthält Betreff und alle Angaben (AK-7)', () => {
    const data = validateInquiry(formData()).data!;
    const url = new URL(inquiryMailto(data));
    const body = url.searchParams.get('body')!;
    expect(url.searchParams.get('subject')).toContain('Alex Muster');
    for (const v of ['Webflow', 'barrierefreien Relaunch', 'https://beispiel.de', 'alex@beispiel.de', '+49 821 123456'])
      expect(body).toContain(v);
  });
});

describe('AK-4: Speicherung nur serverseitig', () => {
  it('ohne Umgebungsvariablen kein Store, keine Benachrichtigung', () => {
    expect(supabaseStore({})).toBeNull();
    expect(resendNotifier({})).toBeNull();
  });

  it('schreibt per REST mit Service-Role-Schlüssel in „anfragen"', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const s = supabaseStore({ SUPABASE_URL: 'https://x.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'geheim' })!;
    await s.save(validateInquiry(formData()).data!, 'h1');
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://x.supabase.co/rest/v1/anfragen');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({ apikey: 'geheim', Authorization: 'Bearer geheim' });
    expect(JSON.parse(init.body as string)).toMatchObject({
      leistungen: ['webflow-development', 'accessibility'],
      email: 'alex@beispiel.de',
      ip_hash: 'h1',
      sprache: 'de',
    });
    vi.unstubAllGlobals();
  });

  it('wirft bei Fehlerantwort, damit der Ausweichweg greift', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('nope', { status: 500 })),
    );
    const s = supabaseStore({ NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'k' })!;
    await expect(s.save(validateInquiry(formData()).data!, null)).rejects.toThrow();
    vi.unstubAllGlobals();
  });

  it('Migration: RLS aktiv, keine Policies, kein Zugriff für anon', () => {
    const dir = 'supabase/migrations';
    const sql = readdirSync(dir)
      .filter((f) => f.endsWith('_anfragen.sql'))
      .map((f) => readFileSync(join(dir, f), 'utf8'))
      .join('\n')
      .toLowerCase();
    expect(sql).toContain('create table');
    expect(sql).toContain('alter table public.anfragen enable row level security');
    expect(sql).not.toContain('create policy');
    expect(sql).toMatch(/revoke all on (table )?public\.anfragen from anon, authenticated/);
  });

  it('keine Client-Komponente greift auf den Supabase-Store zu', () => {
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));
    for (const f of files('components')) {
      const src = readFileSync(f, 'utf8');
      expect(src, f).not.toMatch(/lib\/contact\/(supabase|submit)/);
      expect(src, f).not.toMatch(/SERVICE_ROLE/);
    }
  });
});

describe('Anfrage-Assistent im Browser', () => {
  beforeEach(() => {
    action.mockReset();
    window.history.replaceState(null, '', '/contact');
  });

  const next = (name = 'Weiter') => fireEvent.click(screen.getByRole('button', { name }));
  const check = (name: string | RegExp) => fireEvent.click(screen.getByRole('checkbox', { name }));
  const type = (name: string | RegExp, value: string) =>
    fireEvent.change(screen.getByRole('textbox', { name }), { target: { value } });

  it('AK-1: Fortschritt sichtbar, Fokus auf Überschrift des neuen Schritts', async () => {
    render(<InquiryWizard locale="de" />);
    const progress = screen.getByRole('list', { name: 'Fortschritt' });
    expect(within(progress).getAllByRole('listitem')).toHaveLength(4);
    expect(within(progress).getByText('Leistung').closest('li')).toHaveAttribute('aria-current', 'step');
    check('Webflow-Entwicklung');
    next();
    const heading = await screen.findByRole('heading', { name: 'Schritt 2 von 4: Projekt' });
    expect(heading).toHaveFocus();
    expect(within(progress).getByText('Projekt').closest('li')).toHaveAttribute('aria-current', 'step');
    fireEvent.click(screen.getByRole('button', { name: 'Zurück' }));
    expect(await screen.findByRole('heading', { name: 'Schritt 1 von 4: Leistung' })).toHaveFocus();
    expect(screen.getByRole('checkbox', { name: 'Webflow-Entwicklung' })).toBeChecked();
  });

  it('AK-2: Fehler am Feld und gesammelt, Fokus auf die Fehlerliste', async () => {
    render(<InquiryWizard locale="de" />);
    next();
    const summary = await screen.findByRole('group', { name: /Bitte prüfe 1 Angabe/ });
    expect(summary).toHaveFocus();
    const link = within(summary).getByRole('link', { name: /Wähle mindestens eine Leistung/ });
    expect(link.getAttribute('href')).toMatch(/^#/);
    const group = screen.getByRole('group', { name: /Schritt 1 von 4/ });
    expect(group).toHaveAccessibleDescription(/Wähle mindestens eine Leistung/);
    check('Webflow-Entwicklung');
    next();
    type(/Beschreibung/, 'kurz');
    next();
    const field = screen.getByRole('textbox', { name: /Beschreibung/ });
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription(/mindestens 20 Zeichen/);
  });

  it('AK-2: Server-Fehler öffnen den Schritt des ersten Fehlers', async () => {
    action.mockResolvedValue({ status: 'invalid', errors: { beschreibung: 'tooShort' }, values: {} });
    render(<InquiryWizard locale="de" />);
    check('Webflow-Entwicklung');
    next();
    type(/Beschreibung/, valid.beschreibung);
    next();
    next();
    type(/^Name/, valid.name);
    type(/E-Mail/, valid.email);
    check(/einverstanden/);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Anfrage senden' })));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Schritt 2 von 4: Projekt' })).toBeVisible());
    expect(screen.getByRole('group', { name: /Bitte prüfe 1 Angabe/ })).toHaveFocus();
  });

  it('AK-8: Bestätigung mit Namen und Zusammenfassung, Fokus darauf', async () => {
    action.mockImplementation(async (_p, fd) => ({
      status: 'sent',
      summary: validateInquiry(fd).data!,
    }));
    render(<InquiryWizard locale="de" />);
    check('Webflow-Entwicklung');
    next();
    type(/Beschreibung/, valid.beschreibung);
    next();
    next();
    type(/^Name/, valid.name);
    type(/E-Mail/, valid.email);
    check(/einverstanden/);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Anfrage senden' })));
    const thanks = await screen.findByRole('heading', { name: 'Danke, Alex Muster.' });
    expect(thanks).toHaveFocus();
    expect(document.body).toHaveTextContent('Webflow-Entwicklung');
    expect(document.body).toHaveTextContent('Erstgespräch');
    const sent = action.mock.calls[0]![1];
    expect(sent.get('sprache')).toBe('de');
    expect(sent.getAll('leistungen')).toEqual(['webflow-development']);
  });

  it('AK-7: Ausweichweg zeigt E-Mail-Link, Eingaben bleiben', async () => {
    action.mockResolvedValue({
      status: 'fallback',
      reason: 'unavailable',
      mailto: 'mailto:erb1209@outlook.de?subject=x',
      text: 'x',
    });
    render(<InquiryWizard locale="en" />);
    check('Webflow development');
    next('Next');
    type(/Description/, valid.beschreibung);
    next('Next');
    next('Next');
    type(/^Name/, valid.name);
    type(/Email/, valid.email);
    check(/I agree/);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' })));
    const link = await screen.findByRole('link', { name: /Send enquiry by email/ });
    expect(link).toHaveAttribute('href', 'mailto:erb1209@outlook.de?subject=x');
    expect(screen.getByRole('textbox', { name: /^Name/ })).toHaveValue(valid.name);
  });

  it('AK-9: ?leistung= wählt die Leistung vor, unbekannte werden ignoriert', async () => {
    window.history.replaceState(null, '', '/contact?leistung=accessibility');
    const { unmount } = render(<InquiryWizard locale="de" />);
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Barrierefreiheit-Beratung' })).toBeChecked());
    unmount();
    window.history.replaceState(null, '', '/contact?leistung=%22%5D');
    render(<InquiryWizard locale="de" />);
    expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0);
  });

  it('AK-9: Leistungsseite verlinkt die Kontaktseite mit Vorauswahl', () => {
    const service = services.find((s) => s.slug === 'accessibility')!;
    render(<ServiceDetail service={service} locale="en" />);
    expect(screen.getByRole('link', { name: 'Free intro call' })).toHaveAttribute(
      'href',
      '/en/contact?leistung=accessibility',
    );
  });

  it('AK-6/A11y: Pflichtfelder sind ausgeschrieben, Autocomplete gesetzt, Honeypot versteckt', () => {
    const { container } = render(<InquiryWizard locale="de" />);
    // Schritt 4 ist noch ausgeblendet
    expect(screen.getByRole('textbox', { name: /^Name \(Pflicht\)/, hidden: true })).toHaveAttribute(
      'autocomplete',
      'name',
    );
    expect(screen.getByRole('textbox', { name: /^E-Mail \(Pflicht\)/, hidden: true })).toHaveAttribute(
      'autocomplete',
      'email',
    );
    expect(container.querySelector('input[name="telefon"]')).toHaveAttribute('autocomplete', 'tel');
    expect(container.querySelector('input[name="website"]')).toHaveAttribute('autocomplete', 'url');
    const fax = container.querySelector('input[name="fax"]')!;
    expect(fax).toHaveAttribute('tabindex', '-1');
    expect(fax.closest('[aria-hidden="true"]')).not.toBeNull();
    // alle Leistungen plus „Noch unklar"
    expect(container.querySelectorAll('input[name="leistungen"]')).toHaveLength(services.length + 1);
  });
});

describe('Kontaktseite', () => {
  it.each(['de', 'en'] as const)('AK-2: eine h1, Direktkontakt als Links (%s)', (locale) => {
    render(<ContactPage locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const list = screen.getByRole('list', { name: locale === 'de' ? 'Direktkontakt' : 'Direct contact' });
    const links = within(list).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      'mailto:erb1209@outlook.de',
      expect.stringContaining('linkedin.com/in/erik-bergheimer'),
      expect.stringContaining('instagram.com/erik.bergheimer'),
    ]);
    expect(links[0]).toHaveAccessibleName(/erb1209@outlook\.de/);
    expect(links[1]).toHaveAccessibleName(/LinkedIn/);
  });

  it('AK-3: ContactPage-JSON-LD verweist auf die Person', () => {
    const data = contactPageJsonLd('de');
    expect(data['@type']).toBe('ContactPage');
    expect(data.url).toBe('https://erik-bergheimer.de/contact');
    expect(data.about).toEqual({ '@id': 'https://erik-bergheimer.de/#person' });
    // Kritiker-Befund 10: Name und Kontaktweg direkt auf der Seite
    expect(data.name).toBeTruthy();
    expect(data.mainEntity).toMatchObject({
      '@type': 'Person',
      email: 'erb1209@outlook.de',
      contactPoint: { '@type': 'ContactPoint', email: 'erb1209@outlook.de', availableLanguage: ['de', 'en'] },
    });
  });

  it.each(['de', 'en'] as const)('AK-1: Meta-Daten und Sitemap (%s)', (locale) => {
    const meta = contactMetadata(locale);
    expect(String(meta.title)).toMatch(/\| Erik Bergheimer$/);
    expect(String(meta.description).length).toBeLessThanOrEqual(160);
    expect(meta.alternates?.canonical).toBe(
      locale === 'de' ? 'https://erik-bergheimer.de/contact' : 'https://erik-bergheimer.de/en/contact',
    );
    expect(sitePaths()).toContain('/contact');
  });
});

describe('Befunde Blinder Kritiker (Runde 1)', () => {
  beforeEach(() => {
    action.mockReset();
    window.history.replaceState(null, '', '/contact');
  });

  it('AK-11: Einwilligung heißt ohne Linktext, Datenschutz-Link als Beschreibung', () => {
    render(<InquiryWizard locale="de" />);
    const box = screen.getByRole('checkbox', { name: /einverstanden/, hidden: true });
    expect(box).toHaveAccessibleName(
      'Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden. (Pflicht)',
    );
    expect(box).toHaveAccessibleDescription(/Datenschutzerklärung/);
  });

  it('AK-12: Hinweis nennt die Mindestlänge, Zähler ab 2500 Zeichen', async () => {
    render(<InquiryWizard locale="de" />);
    const field = screen.getByRole('textbox', { name: /Beschreibung/, hidden: true });
    expect(field).toHaveAccessibleDescription(/mindestens 20 Zeichen/);
    expect(screen.queryByText(/von 3000 Zeichen/)).toBeNull();
    fireEvent.change(field, { target: { value: 'x'.repeat(2600) } });
    const counter = await screen.findByText('2600 von 3000 Zeichen');
    expect(counter.closest('[aria-live="polite"]')).not.toBeNull();
  });

  it('AK-13: erledigte Schritte werden im Fortschritt angesagt', () => {
    render(<InquiryWizard locale="de" />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Webflow-Entwicklung' }));
    fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
    const progress = screen.getByRole('list', { name: 'Fortschritt' });
    expect(within(progress).getAllByRole('listitem')[0]).toHaveTextContent('Leistung (erledigt)');
    expect(within(progress).getAllByRole('listitem')[1]).not.toHaveTextContent('erledigt');
  });

  it('AK-14: Ausweichweg mit kurzem mailto und Kopier-Button für den vollen Text', async () => {
    action.mockResolvedValue({
      status: 'fallback',
      reason: 'unavailable',
      mailto: 'mailto:erb1209@outlook.de?subject=x',
      text: 'Voller Text der Anfrage',
    });
    const writeText = vi.fn(async () => {});
    Object.assign(navigator, { clipboard: { writeText } });
    render(<InquiryWizard locale="de" />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Webflow-Entwicklung' }));
    fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
    fireEvent.change(screen.getByRole('textbox', { name: /Beschreibung/ }), { target: { value: valid.beschreibung } });
    fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
    fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
    fireEvent.change(screen.getByRole('textbox', { name: /^Name/ }), { target: { value: valid.name } });
    fireEvent.change(screen.getByRole('textbox', { name: /E-Mail/ }), { target: { value: valid.email } });
    fireEvent.click(screen.getByRole('checkbox', { name: /einverstanden/ }));
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Anfrage senden' })));
    expect(
      await screen.findByRole('heading', { name: 'Das Formular lässt sich gerade nicht absenden.' }),
    ).toBeVisible();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Angaben kopieren' })));
    expect(writeText).toHaveBeenCalledWith('Voller Text der Anfrage');
    expect(await screen.findByText('Kopiert.')).toBeInTheDocument();
    // Absende-Button tritt hinter den E-Mail-Weg zurück
    expect(screen.getByRole('button', { name: 'Erneut senden' })).not.toHaveClass('bg-primary');
  });

  it('AK-14: mailto kürzt lange Beschreibungen, der Server liefert den vollen Text mit', async () => {
    const long = 'Wort '.repeat(600);
    const state = await handleInquiry(formData({ ...valid, beschreibung: long }), { store: null, ipHash: null });
    expect(state.status === 'fallback' && state.mailto.length).toBeLessThanOrEqual(2000);
    expect(state.status === 'fallback' && state.text).toContain(long.trim());
  });

  it('seite AK-6: Assistent steht vor dem Direktkontakt, kein Sprunglink mehr', () => {
    render(<ContactPage locale="de" />);
    expect(screen.queryByRole('link', { name: 'Zum Anfrageformular' })).toBeNull();
    const form = screen.getByRole('heading', { name: 'Projekt anfragen' });
    const direct = screen.getByRole('heading', { name: 'Direktkontakt' });
    expect(form.compareDocumentPosition(direct) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
