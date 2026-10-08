import { expect, test, type Page } from '@playwright/test';
import { axe, openHydrated } from './helpers';

// functions/kundenbereich/projektuebersicht.md
// Angemeldet über ein Token für das nachgebildete Supabase (tests/e2e/fixtures/fake-supabase.mjs).

const token = (sub: string) =>
  `x.${Buffer.from(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.y`;

async function login(page: Page, sub: string) {
  await page.context().addCookies([
    { name: 'kb_zugang', value: token(sub), url: 'http://localhost:3100' },
    { name: 'kb_erneuern', value: 'r', url: 'http://localhost:3100' },
  ]);
}

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test('AK-3/AK-4: Projekt mit Ablauf und nächsten Schritten', async ({ page }) => {
  await login(page, 'anna');
  await openHydrated(page, '/kunden');
  await expect(page.getByRole('heading', { level: 1, name: 'Kundenbereich' })).toBeVisible();
  await expect(page.getByText('Hallo, Anna')).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Relaunch der Website' })).toBeVisible();
  const ablauf = page.getByRole('list', { name: 'Ablauf' });
  await expect(ablauf.getByRole('listitem')).toHaveCount(6);
  await expect(ablauf.locator('[aria-current="step"]')).toContainText('Konzept und Design');
  await expect(page.getByRole('list', { name: 'Nächste Schritte' }).getByRole('listitem')).toHaveCount(3);
  await expect(page.getByRole('navigation', { name: 'Deine Projekte' })).toHaveCount(0);
});

test('termine.md AK-3/AK-6: nächster Termin mit Meet-Link und Kalenderdatei', async ({ page }) => {
  await login(page, 'anna');
  await openHydrated(page, '/kunden');
  const termin = page.getByRole('region', { name: 'Nächster Termin' });
  await expect(termin.getByText('Design-Review')).toBeVisible();
  await expect(termin.locator('time').first()).toHaveAttribute('datetime', /T08:00:00/);
  await expect(termin.getByRole('link', { name: /Google Meet beitreten/ })).toHaveAttribute('target', '_blank');
  await expect(termin.getByText('Erstgespräch')).toHaveCount(0);
  await expect(termin.getByRole('listitem')).toHaveCount(1);

  const res = await page.request.get('/kunden/termine/t-review?sprache=de');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toMatch(/^text\/calendar/);
  expect(await res.text()).toContain('SUMMARY:Design-Review (Relaunch der Website)');
  expect((await page.request.get('/kunden/termine/fremd')).status()).toBe(404);
  await page.context().clearCookies();
  expect((await page.request.get('/kunden/termine/t-review')).status()).toBe(401);
});

test('dokumente.md AK-3/AK-5: Dokumente mit Angaben, Download über signierten Link', async ({ page }) => {
  await login(page, 'anna');
  await openHydrated(page, '/kunden');
  const docs = page.getByRole('region', { name: 'Dokumente' });
  await expect(
    docs.getByRole('link', { name: 'Vertrag Relaunch, PDF, 182 KB, Version 2, 8. Okt. 2026, Aktuell' }),
  ).toBeVisible();
  const logo = docs.getByRole('img', { name: 'Logo: Logo dunkel' });
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.content()).not.toContain('token=');

  const res = await page.request.get('/kunden/dokumente/d-vertrag-2', { maxRedirects: 0 });
  expect(res.status()).toBe(303);
  const location = new URL(res.headers()['location']!);
  expect(location.searchParams.get('token')).toBe('signiert');
  expect(location.searchParams.get('download')).toBe('vertrag-v2.pdf');
  expect((await page.request.get('/kunden/dokumente/fremd', { maxRedirects: 0 })).status()).toBe(404);
  await page.context().clearCookies();
  expect((await page.request.get('/kunden/dokumente/d-vertrag-2', { maxRedirects: 0 })).status()).toBe(401);
});

test('AK-6: Admin wechselt zwischen Projekten', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden');
  const nav = page.getByRole('navigation', { name: 'Deine Projekte' });
  await expect(nav.getByRole('link', { name: 'Neues Logo' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { level: 2, name: 'Neues Logo' })).toBeVisible();
  await nav.getByRole('link', { name: 'Relaunch der Website' }).click();
  await expect(page).toHaveURL(/\/kunden\?projekt=p-relaunch$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Relaunch der Website' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Relaunch der Website' })).toHaveAttribute('aria-current', 'page');
});

test('AK-7: ohne Projekt Leer-Hinweis; Abmelden löscht die Cookies', async ({ page }) => {
  await login(page, 'leer');
  await openHydrated(page, '/kunden');
  await expect(page.getByText(/Hier ist noch kein Projekt hinterlegt/)).toBeVisible();
  await page.getByRole('button', { name: 'Abmelden' }).click();
  await expect(page.getByRole('button', { name: 'Anmeldelink schicken' })).toBeVisible();
  expect((await page.context().cookies()).filter((c) => c.name.startsWith('kb_'))).toEqual([]);
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const [sub, path] of [
      ['anna', '/kunden'],
      ['anna', '/en/clients'],
      ['erik', '/kunden?projekt=p-relaunch'],
    ] as const) {
      test(`AK-9: ${sub} ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await login(page, sub);
        await openHydrated(page, path);
        await expect(page.getByRole('list', { name: /Ablauf|Process/ })).toBeVisible();
        expect(await axe(page)).toEqual([]);
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    }
  });
}
