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
const SEITEN = [
  '/kunden/admin',
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

test('Verhalten 1-4: Erik kommt von der Übersicht zum Kunden und zum Projekt', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden');
  await page.getByRole('link', { name: 'Verwaltung' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Verwaltung' })).toBeVisible();
  await expect(page.getByText('Logo-Freigabe erteilt am 8. Okt. 2026')).toBeVisible();
  await page.getByRole('link', { name: 'Bäckerei Beispiel' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Bäckerei Beispiel' })).toBeVisible();
  const logo = page.getByRole('img', { name: 'Aktuelles Logo von Bäckerei Beispiel' });
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.naturalWidth > 0)).toBe(true);
  await page.getByRole('link', { name: 'Relaunch der Website' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Relaunch der Website' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: /Anna/ })).toBeChecked();
  // Kritiker Verwaltung 1: Schritte eingeklappt, Sprungmarke zu den Terminen
  await page.getByRole('navigation', { name: 'Auf dieser Seite' }).getByRole('link', { name: 'Termine' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Termine' })).toBeInViewport();
  const hoehe = await page.getByRole('main').evaluate((el) => el.scrollHeight);
  expect(hoehe).toBeLessThan(7000);
});

test('AK-3: Kunde anlegen mit Prüfung und Weiterleitung', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin');
  const form = page.getByRole('form', { name: 'Kunde anlegen' });
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

test('Dashboard: Kennzahlen, Umsatzprognose, Termine und Anfragen (admin-dashboard.md)', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden/admin');
  const kennzahlen = page.getByRole('list', { name: 'Kennzahlen' });
  await expect(kennzahlen).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Umsatzprognose' })).toBeVisible();
  const tabelle = page.getByRole('table');
  await expect(tabelle).toContainText('2026');
  await expect(tabelle).toContainText('2027');
  await expect(page.getByRole('link', { name: /Meet beitreten: Design-Review/ })).toBeVisible();
  await expect(page.getByText('Clara Muster').first()).toBeVisible();
  // Kritiker Dashboard 1/10: Projektlinks führen zur Projektseite, Status lässt sich speichern
  const projekte = page.getByRole('region', { name: 'Projekte' });
  const href = await projekte.getByRole('link', { name: 'Relaunch der Website' }).getAttribute('href');
  expect((await page.request.get(href!)).status(), href!).toBe(200);
  const anfragen = page.getByRole('region', { name: 'Anfragen' });
  await anfragen.getByRole('combobox', { name: 'Status: Clara Muster' }).selectOption('beantwortet');
  await anfragen.getByRole('button', { name: 'Status speichern: Clara Muster' }).click();
  await expect(anfragen.getByText('Status gespeichert.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projekt anlegen: Clara Muster' })).toHaveAttribute(
    'href',
    /\/kunden\/admin\/projekte\/neu\?anfrage=/,
  );
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
