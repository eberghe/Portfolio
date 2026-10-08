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
const SEITEN = ['/kunden/admin', `/kunden/admin/kunden/${K1}`, `/kunden/admin/projekte/${P1}`];

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
  expect(await logo.evaluate((img: HTMLImageElement) => img.naturalWidth > 0)).toBe(true);
  await page.getByRole('link', { name: 'Relaunch der Website' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Relaunch der Website' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: /Anna/ })).toBeChecked();
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
  const name = `Testkunde ${test.info().project.name}`;
  await form.getByLabel(/^Name/).fill(name);
  await form.getByLabel(/^Website/).fill('https://test.example');
  await form.getByRole('button', { name: 'Kunde anlegen' }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await expect(page).toHaveURL(/\/kunden\/admin\/kunden\/10000000-/);
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
