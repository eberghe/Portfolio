import { expect, test, type Page } from '@playwright/test';
import { openHydrated } from './helpers';

// functions/kundenbereich/rahmen.md, gegen das nachgebildete Supabase (tests/e2e/fixtures/fake-supabase.mjs)

const token = (sub: string) =>
  `x.${Buffer.from(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.y`;
async function login(page: Page, sub: string) {
  await page.context().addCookies([
    { name: 'kb_zugang', value: token(sub), url: 'http://localhost:3100' },
    { name: 'kb_erneuern', value: 'r', url: 'http://localhost:3100' },
  ]);
}

async function ohneWebsiteRahmen(page: Page) {
  await expect(page.getByRole('navigation', { name: /Hauptnavigation|Main navigation/ })).toHaveCount(0);
  await expect(page.getByRole('contentinfo')).toHaveCount(0);
  await expect(page.locator('[data-preloader]')).toHaveCount(0);
  const html = await page.evaluate(() => ({
    smooth: document.documentElement.classList.contains('smooth'),
    lenis: document.documentElement.classList.contains('lenis'),
    behavior: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(html).toEqual({ smooth: false, lenis: false, behavior: 'auto' });
}

test('AK-1/AK-2/AK-3: Anmeldung ohne Navigation, Footer und weiches Scrollen', async ({ page }) => {
  for (const [path, link, ziel] of [
    ['/kunden', 'Zur Website', '/'],
    ['/en/clients', 'Back to website', '/en'],
    ['/kunden/anmelden?code=x', 'Zur Website', '/'],
  ] as const) {
    await openHydrated(page, `${path}${path.includes('?') ? '&' : '?'}animationstest`);
    await ohneWebsiteRahmen(page);
    await expect(page.getByRole('banner').getByRole('link', { name: link })).toHaveAttribute('href', ziel);
  }
});

test('AK-1/AK-4: Admin landet auf der Verwaltung, ohne Website-Rahmen', async ({ page }) => {
  await login(page, 'erik');
  await openHydrated(page, '/kunden?animationstest');
  await expect(page).toHaveURL(/\/kunden\/admin/);
  await expect(page.getByRole('heading', { level: 1, name: 'Verwaltung' })).toBeVisible();
  await ohneWebsiteRahmen(page);
  await page.getByRole('link', { name: 'Zur Website' }).click();
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Kundenbereich' })).toHaveAttribute('href', '/kunden');
});

test('AK-4: Kundin bleibt auf ihrer Projektübersicht', async ({ page }) => {
  await login(page, 'anna');
  await openHydrated(page, '/kunden');
  await expect(page).toHaveURL(/\/kunden$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Relaunch der Website' })).toBeVisible();
});
