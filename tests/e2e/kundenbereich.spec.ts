import { expect, test } from '@playwright/test';
import { axe, openHydrated } from './helpers';

// functions/kundenbereich/login.md
// In der Testumgebung fehlen Supabase und Resend: Absenden zeigt „gerade nicht erreichbar“ (AK-10).

const overflow = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test('AK-1: Anmeldeseite DE/EN mit h1, Feld und Button, noindex, nicht in der Sitemap', async ({ page, request }) => {
  for (const [path, h1, field, button] of [
    ['/kunden', 'Kundenbereich', 'E-Mail-Adresse', 'Anmeldelink schicken'],
    ['/en/clients', 'Client area', 'Email address', 'Send sign-in link'],
  ] as const) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"/);
    await openHydrated(page, path);
    await expect(page.getByRole('heading', { level: 1, name: h1 })).toBeVisible();
    await expect(page.getByRole('textbox', { name: field })).toHaveAttribute('autocomplete', 'email');
    await expect(page.getByRole('button', { name: button })).toBeVisible();
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toMatch(/kunden|clients/);
});

test('AK-2: ungültige Adresse zeigt Fehler am Feld', async ({ page }) => {
  await openHydrated(page, '/kunden');
  const field = page.getByRole('textbox', { name: 'E-Mail-Adresse' });
  await field.fill('kein-at');
  await page.getByRole('button', { name: 'Anmeldelink schicken' }).click();
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await expect(field).toBeFocused();
  await expect(field).toHaveAccessibleDescription(/gültige E-Mail-Adresse/);
});

test('AK-10: ohne Supabase-Zugang Hinweis mit Mail-Link, Fokus auf der Meldung', async ({ page }) => {
  await openHydrated(page, '/kunden');
  await page.getByRole('textbox', { name: 'E-Mail-Adresse' }).fill('anna@beispiel.de');
  await page.getByRole('button', { name: 'Anmeldelink schicken' }).click();
  await expect(page.getByRole('heading', { name: 'Der Kundenbereich ist gerade nicht erreichbar' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'erb1209@outlook.de' })).toHaveAttribute(
    'href',
    'mailto:erb1209@outlook.de',
  );
});

test('AK-7: Bestätigungsseite löst erst per Klick ein, ungültig zeigt Link zum Formular', async ({ page }) => {
  await openHydrated(page, '/kunden/anmelden?code=falsch');
  await expect(page.getByRole('heading', { level: 1, name: 'Anmeldung bestätigen' })).toBeVisible();
  await page.getByRole('button', { name: 'Jetzt anmelden' }).click();
  await expect(page).toHaveURL(/\/kunden\/anmelden\?ungueltig=1$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Dieser Link funktioniert nicht mehr' })).toBeVisible();
  // Kritiker 2: Fokus auf dem neuen Titel, damit der Wechsel angesagt wird
  await expect(page.getByRole('heading', { level: 1, name: 'Dieser Link funktioniert nicht mehr' })).toBeFocused();
  await page.getByRole('link', { name: 'Neuen Link anfordern' }).click();
  await expect(page).toHaveURL(/\/kunden$/);
  expect((await page.context().cookies()).filter((c) => c.name.startsWith('kb_'))).toEqual([]);
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of ['/kunden', '/en/clients', '/kunden/anmelden?code=x', '/en/clients/sign-in?ungueltig=1']) {
      test(`AK-11: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await openHydrated(page, path);
        expect(await axe(page)).toEqual([]);
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    }
  });
}
