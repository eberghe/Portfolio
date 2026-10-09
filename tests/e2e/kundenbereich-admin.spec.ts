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
];

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
  await expect(page.getByRole('heading', { level: 1, name: 'Verwaltung' })).toBeVisible();
  const bereiche = page.getByRole('navigation', { name: 'Bereiche der Verwaltung' });
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
  await page.getByRole('button', { name: 'Zuordnung ändern' }).click();
  const dialog = page.getByRole('dialog', { name: 'Ansprechpartner im Projekt' });
  await expect(dialog.getByRole('checkbox', { name: /Anna/ })).toBeChecked();
  expect(await axe(page)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Zuordnung ändern' })).toBeFocused();
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
  await page.getByRole('combobox', { name: 'Status: Clara Muster' }).selectOption('beantwortet');
  await page.getByRole('button', { name: 'Status speichern: Clara Muster' }).click();
  await expect(page.getByText('Status gespeichert.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projekt anlegen: Clara Muster' })).toHaveAttribute(
    'href',
    /\/kunden\/admin\/projekte\/neu\?anfrage=/,
  ); // Zurück auf „Neu“, das nachgebildete Supabase teilt den Stand zwischen den Geräten
  await page.getByRole('combobox', { name: 'Status: Clara Muster' }).selectOption('neu');
  await page.getByRole('button', { name: 'Status speichern: Clara Muster' }).click();
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
