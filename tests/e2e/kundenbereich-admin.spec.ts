import { expect, test, type Page } from '@playwright/test';
import { axe, openHydrated } from './helpers';

// functions/kundenbereich/admin.md, gegen das nachgebildete Supabase (tests/e2e/fixtures/fake-supabase.mjs)

const K1 = '10000000-0000-4000-8000-00000000000a';
const P1 = '20000000-0000-4000-8000-00000000000b';

const token = (sub: string) =>
  `x.${Buffer.from(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.y`;
async function login(page: Page, sub: string) {
  await page.context().addCookies([
    { name: 'kb_zugang', value: token(sub), url: 'http://localhost:3100' },
    { name: 'kb_erneuern', value: 'r', url: 'http://localhost:3100' },
  ]);
}
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const A1 = '30000000-0000-4000-8000-00000000000c';
const SEITEN = [
  '/kunden/admin',
  '/kunden/admin/anfragen',
  `/kunden/admin/anfragen/${A1}`,
  '/kunden/admin/projekte',
  '/kunden/admin/kunden',
  `/kunden/admin/kunden/${K1}`,
  `/kunden/admin/projekte/${P1}`,
  '/kunden/admin/projekte/neu',
  '/kunden/admin/einstellungen',
];
/** Öffnet das ⋯-Menü „Aktionen: <ziel>“ (admin-sidebar.md AK-7) */
async function menue(page: Page, ziel: string) {
  await page.getByRole('button', { name: `Aktionen: ${ziel}` }).click();
  return page.getByRole('menu', { name: `Aktionen: ${ziel}` });
}

test('AK-1: Verwaltung nur für Admins, sonst 404', async ({ page, request }) => {
  for (const path of SEITEN) expect((await request.get(path)).status(), path).toBe(404);
  await login(page, 'anna');
  for (const path of SEITEN) expect((await page.request.get(path)).status(), path).toBe(404);
  expect((await page.request.get(`/kunden/admin/logo/${K1}`, { maxRedirects: 0 })).status()).toBe(404);
});

test('Verhalten 1-4: Erik kommt über die Bereiche zum Kunden und zum Projekt', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden');
  await expect(page).toHaveURL(/\/kunden\/admin$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Übersicht' })).toBeVisible();
  const bereiche = page.getByRole('navigation', { name: 'Verwaltung' });
  await bereiche.getByRole('link', { name: 'Kunden' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Kunden' })).toBeVisible();
  await expect(page.getByText('Logo-Freigabe erteilt am 8. Okt. 2026')).toBeVisible();
  await page.getByRole('link', { name: 'Bäckerei Beispiel' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Bäckerei Beispiel' })).toBeVisible();
  const logo = page.getByRole('img', { name: 'Aktuelles Logo von Bäckerei Beispiel' });
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.naturalWidth > 0)).toBe(true);
  await page.getByRole('link', { name: 'Relaunch der Website' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Relaunch der Website' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Ansprechpartner' })).toContainText('Anna');
  // admin-aufbau.md AK-7: Formulare hinter Buttons, die Seite bleibt kurz
  await expect(page.getByRole('main').locator('input:not([type="hidden"]), textarea, select')).toHaveCount(0);
  const hoehe = await page.getByRole('main').evaluate((el) => el.scrollHeight);
  expect(hoehe).toBeLessThan(4000);
  // admin-bearbeiten.md AK-10: Aktionen im ⋯-Menü der Karte
  await (await menue(page, 'Ansprechpartner')).getByRole('menuitem', { name: 'Zuordnung ändern' }).click();
  const dialog = page.getByRole('dialog', { name: 'Ansprechpartner im Projekt' });
  await expect(dialog.getByRole('checkbox', { name: /Anna/ })).toBeChecked();
  expect(await axe(page)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Aktionen: Ansprechpartner' })).toBeFocused();
});

test('AK-3: Kunde anlegen im Dialog mit Prüfung und Weiterleitung', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin/kunden');
  await page.getByRole('button', { name: 'Kunde anlegen' }).click();
  const form = page.getByRole('dialog', { name: 'Kunde anlegen' });
  await expect(form.getByLabel(/^Name/)).toBeFocused();
  await form.getByLabel(/^Website/).fill('kunde.example');
  await form.getByRole('button', { name: 'Kunde anlegen' }).click();
  await expect(form.getByLabel(/^Name/)).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByLabel(/^Name/)).toBeFocused();
  await expect(form.getByLabel(/^Website/)).toHaveValue('kunde.example');
  // Kritiker Verwaltung 6: Feld mit Fehler ist auch ohne Fokus rot umrandet
  await form.getByLabel(/^Website/).blur();
  const website = form.getByLabel(/^Website/);
  await expect
    .poll(() =>
      website.evaluate(
        (el) =>
          getComputedStyle(el).borderColor === getComputedStyle(el.parentElement!.querySelector('.text-error')!).color,
      ),
    )
    .toBe(true);
  const name = `Testkunde ${test.info().project.name}`;
  await form.getByLabel(/^Name/).fill(name);
  await form.getByLabel(/^Website/).fill('https://test.example');
  await form.getByRole('button', { name: 'Kunde anlegen' }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await expect(page).toHaveURL(/\/kunden\/admin\/kunden\/10000000-/);
});

test('Dashboard: Kennzahlen, Diagramme, Hilfe, Termine und Anfragen (admin-aufbau.md)', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin');
  await expect(page.getByRole('list', { name: 'Kennzahlen' })).toBeVisible();
  const prognose = page.getByRole('region', { name: 'Umsatzprognose' });
  await expect(prognose.locator('svg[data-diagramm]')).toBeVisible();
  await expect(prognose.getByRole('table')).toBeHidden();
  await prognose.getByText('Als Tabelle').click();
  await expect(prognose.getByRole('table')).toContainText('2027');
  await expect(page.getByRole('region', { name: 'Auftragswert nach Status' })).toContainText('In Arbeit');
  const hilfe = page.getByRole('button', { name: 'Erklärung: Umsatzprognose' });
  await hilfe.click();
  await expect(hilfe).toHaveAttribute('aria-expanded', 'true');
  await expect(prognose).toContainText('Gewichtet: Angebote');
  await page.keyboard.press('Escape');
  await expect(hilfe).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('link', { name: /Meet beitreten: Design-Review/ })).toBeVisible();
  // Kritiker Dashboard 1: Projektlinks führen zur Projektseite
  const projekte = page.getByRole('region', { name: 'Laufende Projekte' });
  const href = await projekte.getByRole('link', { name: 'Relaunch der Website' }).getAttribute('href');
  expect((await page.request.get(href!)).status(), href!).toBe(200);
  // Anfragen: kurz im Dashboard, alles auf der eigenen Seite
  await page.getByRole('region', { name: 'Neue Anfragen' }).getByRole('link', { name: 'Clara Muster' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Clara Muster' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Wir brauchen eine neue Website.');
  // admin-sidebar.md AK-7: Status im ⋯-Menü, speichert sofort
  await (await menue(page, 'Clara Muster')).getByRole('menuitemradio', { name: 'Beantwortet' }).click();
  await expect(page.locator('#admin-meldung')).toHaveText('Clara Muster: Status ist jetzt „Beantwortet“.');
  await expect(page.getByRole('main')).toContainText('Beantwortet');
  await expect(page.getByRole('link', { name: 'Projekt anlegen: Clara Muster' })).toHaveAttribute(
    'href',
    /\/kunden\/admin\/projekte\/neu\?anfrage=/,
  ); // Zurück auf „Neu“, das nachgebildete Supabase teilt den Stand zwischen den Geräten
  const zurueck = (await menue(page, 'Clara Muster')).getByRole('menuitemradio', { name: 'Neu' });
  await expect(zurueck).toHaveAttribute('aria-checked', 'false');
  await zurueck.click();
  await expect.poll(async () => (await page.request.get('/kunden/admin')).text()).toContain('Clara Muster');
});

test('Assistent: Projekt in sechs Schritten anlegen (projekt-assistent.md)', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin/projekte/neu');
  const weiter = page.getByRole('button', { name: 'Weiter' });
  await expect(page.getByRole('heading', { level: 2, name: 'Schritt 1 von 6: Kunde' })).toBeVisible();
  await page.getByRole('radio', { name: 'Bestehender Kunde' }).check();
  // AK-3: „Weiter“ blockiert ohne Auswahl, Fokus auf der Fehlerliste
  await weiter.click();
  await expect(page.getByRole('main').getByRole('alert')).toBeFocused();
  await page.getByLabel(/^Kunde auswählen/).selectOption({ label: 'Bäckerei Beispiel' });
  await weiter.click();
  const h2 = page.getByRole('heading', { level: 2, name: 'Schritt 2 von 6: Projekt' });
  await expect(h2).toBeFocused();
  await page.getByLabel(/^Titel/).fill('Onlineshop');
  await page.getByLabel(/^Auftragswert/).fill('8.500');
  await weiter.click();
  await page.getByRole('checkbox', { name: /Anna/ }).check();
  await weiter.click();
  await expect(page.getByRole('heading', { level: 2, name: 'Schritt 4 von 6: Ablauf' })).toBeFocused();
  await page.getByRole('button', { name: 'Zurück' }).click();
  await expect(page.getByRole('checkbox', { name: /Anna/ })).toBeChecked();
  await weiter.click();
  await weiter.click();
  await weiter.click();
  await expect(page.getByRole('heading', { level: 2, name: 'Schritt 6 von 6: Prüfen' })).toBeFocused();
  await expect(page.getByRole('main')).toContainText('Onlineshop');
  expect(await axe(page)).toEqual([]);
  await page.getByRole('button', { name: 'Projekt anlegen' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Onlineshop' })).toBeVisible();
  await expect(page).toHaveURL(/\/kunden\/admin\/projekte\/20000000-.*angelegt=1/);
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of SEITEN) {
      test(`AK-11: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await login(page, 'erik');
        await openHydrated(page, path);
        expect(await axe(page)).toEqual([]);
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    }
  });
}

// admin-sidebar.md AK-2 bis AK-5 (Erik, 2026-10-13)
test('AK-2/AK-3/AK-4/AK-5: Sidebar ab 1024 px, sonst Leiste unten', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin/projekte');
  const { width: breite, height: hoehe } = page.viewportSize()!;
  const nav = page.getByRole('navigation', { name: 'Verwaltung' });
  const namen = ['Übersicht', 'Projekte', 'Kunden', /^Anfragen/, 'Einstellungen'];
  await expect(nav.getByRole('link')).toHaveCount(5);
  // AK-5 mit Zahl im Unit-Test; hier teilen sich die Geräte den Stand der Anfragen
  await expect(nav.getByRole('link', { name: 'Projekte' })).toHaveAttribute('aria-current', 'page');
  const main = (await page.getByRole('main').boundingBox())!;
  if (breite >= 1024) {
    const leiste = (await page.getByRole('banner').boundingBox())!;
    expect(leiste.x).toBe(0);
    expect(leiste.height).toBeGreaterThanOrEqual(hoehe - 1);
    expect(main.x).toBeGreaterThanOrEqual(leiste.x + leiste.width - 1);
    // AK-3: einklappen, Namen bleiben, Wahl bleibt nach dem Neuladen
    const ein = page.getByRole('button', { name: 'Seitenleiste' });
    await expect(ein).toHaveAttribute('aria-expanded', 'true');
    await ein.click();
    await expect(ein).toHaveAttribute('aria-expanded', 'false');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Seitenleiste' })).toHaveAttribute('aria-expanded', 'false');
    expect((await page.getByRole('banner').boundingBox())!.width).toBeLessThanOrEqual(80);
    for (const name of namen) await expect(nav.getByRole('link', { name })).toBeVisible();
    expect(await axe(page)).toEqual([]);
    await page.getByRole('button', { name: 'Seitenleiste' }).click();
  } else {
    // AK-4: Leiste unten, fünf Ziele nebeneinander, mindestens 44 px hoch
    const n = (await nav.boundingBox())!;
    expect(Math.round(n.y + n.height)).toBe(hoehe);
    for (const name of namen) {
      const box = (await nav.getByRole('link', { name }).boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x + box.width).toBeLessThanOrEqual(breite + 0.5);
      expect(Math.abs(box.y - n.y)).toBeLessThan(2);
    }
    // der Inhalt endet über der Leiste
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const letzte = (await page.getByRole('main').locator('table, p').last().boundingBox())!;
    expect(letzte.y + letzte.height).toBeLessThanOrEqual(n.y + 1);
  }
  expect(await overflow(page)).toBeLessThanOrEqual(0);
});

// admin-aufbau.md AK-10, AK-15 (Erik, 2026-10-13)
test('AK-10/AK-15: Dialog-Fuß unten rechts, Kopf-Buttons in einer Zeile', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin');
  const anlegen = (await page.getByRole('button', { name: 'Kunde anlegen' }).boundingBox())!;
  const neu = (await page.getByRole('link', { name: 'Neues Projekt' }).boundingBox())!;
  expect(Math.abs(anlegen.y - neu.y)).toBeLessThan(2);

  await openHydrated(page, `/kunden/admin/projekte/${P1}`);
  await (await menue(page, 'Projekt')).getByRole('menuitem', { name: 'Projekt bearbeiten' }).click();
  const dialog = page.getByRole('dialog', { name: 'Projekt bearbeiten' });
  const fuss = dialog.locator('[data-dialog-fuss]');
  await expect(fuss).toBeVisible();
  const d = (await dialog.boundingBox())!;
  const f = (await fuss.boundingBox())!;
  // Fuß schließt den Dialog unten ab und ist ohne Scrollen sichtbar
  expect(Math.abs(d.y + d.height - (f.y + f.height))).toBeLessThan(2);
  expect(f.y + f.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  const speichern = (await fuss.getByRole('button', { name: 'Projekt speichern' }).boundingBox())!;
  const abbrechen = (await fuss.getByRole('button', { name: 'Abbrechen' }).boundingBox())!;
  expect(d.x + d.width - (speichern.x + speichern.width)).toBeLessThan(32);
  expect(abbrechen.x + abbrechen.width).toBeLessThanOrEqual(speichern.x);
  expect(Math.abs(abbrechen.y - speichern.y)).toBeLessThan(2);
  await fuss.getByRole('button', { name: 'Abbrechen' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Aktionen: Projekt' })).toBeFocused();
});

test('AK-20: ⋯-Menüs von Ablauf und Terminen rechts neben dem Titel', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, `/kunden/admin/projekte/${P1}`);
  const ablauf = page.getByRole('region', { name: 'Ablauf' });
  const titel = (await ablauf.getByText('1. Erstgespräch').boundingBox())!;
  const knopf = (await ablauf.getByRole('button', { name: 'Aktionen: Schritt Erstgespräch' }).boundingBox())!;
  expect(knopf.x).toBeGreaterThan(titel.x + titel.width - 1);
  expect(knopf.y).toBeLessThan(titel.y + titel.height);
  const termine = page.getByRole('region', { name: 'Termine' });
  const t = (await termine.getByRole('heading', { name: 'Design-Review' }).boundingBox())!;
  const weg = (await termine.getByRole('button', { name: 'Aktionen: Termin Design-Review' }).boundingBox())!;
  expect(weg.y).toBeLessThan(t.y + t.height);
});

test('admin-sidebar.md AK-16: unbekannte ID zeigt „Nicht gefunden“ in der Verwaltung', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin/projekte/20000000-0000-4000-8000-0000000000ff');
  await expect(page.getByRole('heading', { level: 1, name: 'Nicht gefunden' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Verwaltung' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Zur Übersicht' })).toHaveAttribute('href', '/kunden/admin');
  expect(await axe(page)).toEqual([]);
});

// functions/kundenbereich/admin-bearbeiten.md AK-12
test('admin-bearbeiten.md AK-12: Kunde löschen über die eigene Rückfrage', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin/kunden');
  const name = `Wegwerfkunde ${test.info().project.name}`;
  await page.getByRole('button', { name: 'Kunde anlegen' }).click();
  const form = page.getByRole('dialog', { name: 'Kunde anlegen' });
  await form.getByLabel(/^Name/).fill(name);
  await form.getByRole('button', { name: 'Kunde anlegen' }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await (await menue(page, name)).getByRole('menuitem', { name: 'Löschen' }).click();
  const frage = page.getByRole('dialog', { name: 'Kunde löschen?' });
  await expect(frage.getByRole('button', { name: 'Abbrechen' })).toBeFocused();
  expect(await axe(page)).toEqual([]);
  await frage.getByRole('button', { name: 'Kunde löschen' }).click();
  await expect(page).toHaveURL(/\/kunden\/admin\/kunden$/);
  await expect(page.getByText(`${name} gelöscht.`)).toBeVisible();
  await expect(page.getByRole('link', { name })).toHaveCount(0);
});

test('admin-bearbeiten.md AK-12: Ablauf per Ziehen sortieren', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, `/kunden/admin/projekte/${P1}`);
  const ablauf = page.getByRole('region', { name: 'Ablauf' });
  const griff = ablauf.getByRole('button', { name: 'Ziehen zum Sortieren: Erstgespräch' });
  // Mausbewegungen außerhalb des Fensters kommen nicht an, deshalb Ziel und Griff zuerst ins Bild
  await ablauf.getByText('3. Konzept und Design').scrollIntoViewIfNeeded();
  await griff.scrollIntoViewIfNeeded();
  // unteres Ende der dritten Zeile, also hinter deren Mitte
  const ziel = (await ablauf.getByRole('listitem').nth(2).boundingBox())!;
  const g = (await griff.boundingBox())!;
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
  await page.mouse.down();
  await page.mouse.move(g.x + g.width / 2, ziel.y + ziel.height - 2, { steps: 8 });
  await page.mouse.up();
  await expect(ablauf.getByText('3. Erstgespräch')).toBeVisible();
  await expect(ablauf.getByText('1. Analyse der bestehenden Website')).toBeVisible();
  await expect(page.getByText('Erstgespräch jetzt an Position 3 von 6.')).toBeVisible();
});

// functions/kundenbereich/angebote.md AK-4, AK-6, AK-7, AK-11
test('angebote.md: Angebot als Entwurf erstellen und an den Kunden freigeben', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, `/kunden/admin/projekte/${P1}`);
  const karte = page.getByRole('region', { name: 'Angebote' });
  await karte.getByRole('button', { name: 'Angebot erstellen' }).click();
  const dialog = page.getByRole('dialog', { name: 'Angebot erstellen' });
  expect(await dialog.getByLabel(/^Nummer/).inputValue()).toMatch(/^\d{4}-\d{3,}$/);
  // Tests laufen parallel gegen dieselben Daten, deshalb eine eigene Nummer je Lauf
  const nummer = `2026-${1000 + Math.floor(Math.random() * 9000)}`;
  await dialog.getByLabel(/^Nummer/).fill(nummer);
  await expect(dialog.getByLabel(/^Empfänger/)).toHaveValue('Bäckerei Beispiel\nAnna');
  const pos = dialog.getByRole('group', { name: 'Position 1' });
  await pos.getByLabel(/^Bezeichnung/).fill('Konzept und Design');
  await pos.getByLabel(/^Menge/).fill('2');
  await pos.getByLabel(/^Einheit/).fill('Tage');
  await pos.getByLabel(/^Einzelpreis/).fill('760');
  await expect(dialog.getByRole('status')).toContainText('Gesamt 1.808,80 €');
  expect(await axe(page)).toEqual([]);
  await dialog.getByRole('button', { name: 'Entwurf speichern' }).click();
  await expect(dialog).toHaveCount(0);

  const zeile = karte.getByRole('listitem').filter({ hasText: `Angebot ${nummer}` });
  await expect(zeile).toContainText('1.808,80 €');
  await expect(zeile).toContainText('Entwurf');
  const pdf = await page.request.get(`/kunden/admin/angebote/${await zeileId(page, nummer)}/pdf`, { maxRedirects: 0 });
  expect(pdf.status()).toBe(303);

  await zeile.getByRole('button', { name: `Aktionen: Angebot ${nummer}` }).click();
  await page.getByRole('menuitem', { name: 'An Kunden freigeben' }).click();
  const frage = page.getByRole('dialog', { name: `Angebot ${nummer} freigeben?` });
  expect(await axe(page)).toEqual([]);
  await frage.getByRole('button', { name: 'Freigeben' }).click();
  await expect(zeile).toContainText('Beim Kunden');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

/** ID eines Angebots aus dem Link „PDF ansehen“ */
async function zeileId(page: Page, nummer: string) {
  await page.getByRole('button', { name: `Aktionen: Angebot ${nummer}` }).click();
  const href = await page.getByRole('menuitem', { name: 'PDF ansehen' }).getAttribute('href');
  await page.keyboard.press('Escape');
  return href!.split('/')[4];
}
