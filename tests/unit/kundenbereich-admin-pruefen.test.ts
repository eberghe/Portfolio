import { describe, expect, it } from 'vitest';
import {
  ansprechpartnerDaten,
  berlinZuUtc,
  dateiPruefen,
  dokumentPfad,
  istId,
  kundeDaten,
  logoPfad,
  naechsteVersion,
  projektDaten,
  projektNeu,
  schrittDaten,
  terminDaten,
} from '@/lib/kundenbereich/admin/pruefen';

// functions/kundenbereich/admin.md, Abschnitt „Prüfungen“

const fd = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};

describe('Prüfungen der Verwaltung', () => {
  it('AK-3: Kunde mit Name und optionaler Website', () => {
    expect(kundeDaten(fd({ name: ' Bäckerei ', website_url: '' }))).toEqual({
      ok: true,
      data: { name: 'Bäckerei', website_url: null },
    });
    expect(kundeDaten(fd({ name: 'B', website_url: 'https://b.example' }))).toMatchObject({
      data: { website_url: 'https://b.example' },
    });
    expect(kundeDaten(fd({ name: '', website_url: 'b.example' }))).toEqual({
      ok: false,
      errors: { name: 'Bitte gib einen Namen ein.', website_url: 'Bitte gib eine Adresse mit https:// ein.' },
    });
    expect(kundeDaten(fd({ name: 'x'.repeat(201) }))).toMatchObject({
      ok: false,
      errors: { name: expect.any(String) },
    });
  });

  it('AK-4: Ansprechpartner mit gültiger E-Mail, klein, Sprache aus der Liste', () => {
    expect(
      ansprechpartnerDaten(fd({ name: 'Anna', email: ' Anna@A.Example ', rolle: '', telefon: '', sprache: 'en' })),
    ).toEqual({
      ok: true,
      data: { name: 'Anna', email: 'anna@a.example', rolle: null, telefon: null, sprache: 'en' },
    });
    expect(ansprechpartnerDaten(fd({ name: '', email: 'kein-at', sprache: 'fr' }))).toEqual({
      ok: false,
      errors: {
        name: 'Bitte gib einen Namen ein.',
        email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
        sprache: 'Bitte wähle eine Sprache.',
      },
    });
  });

  it('AK-6: Projekt anlegen und bearbeiten', () => {
    expect(projektNeu(fd({ titel: 'Relaunch' }))).toEqual({ ok: true, data: { titel: 'Relaunch' } });
    expect(projektNeu(fd({ titel: ' ' }))).toMatchObject({ ok: false, errors: { titel: expect.any(String) } });
    expect(
      projektDaten(
        fd({
          titel: 'Relaunch',
          status: 'abstimmung',
          phase: 'Design',
          beschreibung_de: 'Text',
          beschreibung_en: '',
          website_url: '',
          staging_url: 'http://staging.example',
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        titel: 'Relaunch',
        status: 'abstimmung',
        phase: 'Design',
        beschreibung_de: 'Text',
        beschreibung_en: null,
        website_url: null,
        staging_url: 'http://staging.example',
      },
    });
    expect(projektDaten(fd({ titel: 'A', status: 'fertig' }))).toMatchObject({
      ok: false,
      errors: { status: expect.any(String) },
    });
  });

  it('AK-7: Schritt mit Reihenfolge, Stand, Fälligkeit, Zuständigkeit', () => {
    expect(
      schrittDaten(
        fd({
          reihenfolge: '3',
          titel_de: 'Design',
          titel_en: '',
          beschreibung_de: '',
          beschreibung_en: '',
          status: 'aktiv',
          faellig_am: '2026-10-24',
          verantwortlich: 'kunde',
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        reihenfolge: 3,
        titel_de: 'Design',
        titel_en: null,
        beschreibung_de: null,
        beschreibung_en: null,
        status: 'aktiv',
        faellig_am: '2026-10-24',
        verantwortlich: 'kunde',
      },
    });
    expect(
      schrittDaten(
        fd({ reihenfolge: 'x', titel_de: '', status: 'nein', faellig_am: '24.10.2026', verantwortlich: 'x' }),
      ),
    ).toMatchObject({
      ok: false,
      errors: {
        reihenfolge: expect.any(String),
        titel_de: expect.any(String),
        status: expect.any(String),
        faellig_am: expect.any(String),
        verantwortlich: expect.any(String),
      },
    });
  });

  it('AK-8: Termin in Berliner Zeit nach UTC, Ende nach Beginn, Meet nur https', () => {
    expect(berlinZuUtc('2026-10-15', '10:00')).toBe('2026-10-15T08:00:00.000Z');
    expect(berlinZuUtc('2026-12-15', '10:00')).toBe('2026-12-15T09:00:00.000Z');
    // Tag der Zeitumstellung (25. Okt. 2026, 3:00 → 2:00)
    expect(berlinZuUtc('2026-10-25', '12:00')).toBe('2026-10-25T11:00:00.000Z');
    expect(berlinZuUtc('2026-03-29', '12:00')).toBe('2026-03-29T10:00:00.000Z');
    expect(berlinZuUtc('2026-02-30', '10:00')).toBeNull();
    expect(berlinZuUtc('2026-10-15', '25:00')).toBeNull();

    expect(
      terminDaten(
        fd({
          datum: '2026-10-15',
          beginn: '10:00',
          ende: '11:00',
          titel_de: 'Review',
          titel_en: '',
          meet_url: 'https://meet.google.com/abc',
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        beginn: '2026-10-15T08:00:00.000Z',
        ende: '2026-10-15T09:00:00.000Z',
        titel_de: 'Review',
        titel_en: null,
        meet_url: 'https://meet.google.com/abc',
      },
    });
    expect(terminDaten(fd({ datum: '2026-10-15', beginn: '11:00', ende: '10:00', meet_url: 'http://x' }))).toEqual({
      ok: false,
      errors: {
        ende: 'Das Ende muss nach dem Beginn liegen.',
        meet_url: 'Bitte gib einen Link mit https:// ein.',
      },
    });
    expect(terminDaten(fd({ datum: '', beginn: '', ende: '' }))).toMatchObject({
      ok: false,
      errors: { datum: expect.any(String), beginn: expect.any(String), ende: expect.any(String) },
    });
  });

  it('AK-5/AK-9: Dateien nach Typ und Größe, Pfade vom Server', () => {
    expect(dateiPruefen('kundenlogos', { name: 'logo.svg', type: 'image/svg+xml', size: 4000 })).toBeNull();
    expect(dateiPruefen('kundenlogos', { name: 'logo.pdf', type: 'application/pdf', size: 4000 })).toBe(
      'Bitte wähle ein Bild (PNG, JPEG, SVG oder WebP).',
    );
    expect(dateiPruefen('kundenlogos', { name: 'l.png', type: 'image/png', size: 6 * 1024 * 1024 })).toBe(
      'Die Datei ist zu groß (höchstens 5 MB).',
    );
    expect(
      dateiPruefen('kundendokumente', { name: 'v.pdf', type: 'application/pdf', size: 20 * 1024 * 1024 }),
    ).toBeNull();
    expect(dateiPruefen('kundendokumente', { name: 'v.exe', type: 'application/x-msdownload', size: 10 })).toBe(
      'Dieser Dateityp geht nicht. Erlaubt sind PDF, PNG, JPEG, SVG, WebP und ZIP.',
    );
    expect(dateiPruefen('kundendokumente', { name: 'leer.pdf', type: 'application/pdf', size: 0 })).toBe(
      'Die Datei ist leer.',
    );

    const k = '10000000-0000-4000-8000-00000000000a';
    const p = '20000000-0000-4000-8000-00000000000b';
    expect(logoPfad(k, 'Mein Logo.SVG', new Date('2026-10-08T11:00:00Z'))).toBe(`${k}/logo-20261008110000.svg`);
    expect(dokumentPfad(k, p, '../Vertrag Ä 2026 (final).pdf', 'abc123')).toBe(
      `${k}/${p}/abc123-vertrag-ae-2026-final.pdf`,
    );
    expect(dokumentPfad(k, p, '....', 'abc123')).toBe(`${k}/${p}/abc123-datei`);
    expect(istId(k)).toBe(true);
    expect(istId('../x')).toBe(false);
  });

  it('AK-9: nächste Version bei gleicher Art und gleichem Titel', () => {
    const docs = [
      { art: 'vertrag', titel: 'Vertrag', version: 1 },
      { art: 'vertrag', titel: 'Vertrag', version: 3 },
      { art: 'rechnung', titel: 'Vertrag', version: 7 },
    ];
    expect(naechsteVersion(docs, 'vertrag', 'Vertrag')).toBe(4);
    expect(naechsteVersion(docs, 'vertrag', 'vertrag')).toBe(4);
    expect(naechsteVersion(docs, 'datei', 'Neu')).toBe(1);
  });
});
