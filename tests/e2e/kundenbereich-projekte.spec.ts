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
