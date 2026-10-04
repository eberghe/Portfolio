import { expect, test, type Page } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/kontakt.md, functions/kontakt/anfrage-assistent.md
// In der Testumgebung ist Supabase nicht eingerichtet: Absenden führt zum E-Mail-Ausweichweg (AK-7).

/** Seite laden und warten, bis React die Klicks übernimmt */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
}

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

async function fillAll(page: Page) {
  await page.getByRole('checkbox', { name: 'Webflow-Entwicklung' }).check();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('textbox', { name: /Beschreibung/ }).fill('Wir brauchen einen barrierefreien Relaunch.');
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('radio', { name: 'In 1 bis 3 Monaten' }).check();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('textbox', { name: /^Name/ }).fill('Alex Muster');
  await page.getByRole('textbox', { name: /^E-Mail/ }).fill('alex@beispiel.de');
  await page.getByRole('checkbox', { name: /Datenschutzerklärung/ }).check();
}

test('seite AK-1: erreichbar mit eigenem Title, canonical und hreflang', async ({ request }) => {
  for (const path of ['/contact', '/en/contact']) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<title>[^<]+\| Erik Bergheimer<\/title>/);
    expect(html).toContain(`<link rel="canonical" href="https://erik-bergheimer.de${path}"`);
    expect(html).toMatch(/hreflang="en"/i);
  }
  expect(await (await request.get('/sitemap.xml')).text()).toContain('https://erik-bergheimer.de/contact');
});

test('AK-1/AK-7: Anfrage per Tastatur bis zum Ausweichweg', async ({ page }) => {
  await open(page, '/contact');
  await fillAll(page);
  await page.getByRole('button', { name: 'Anfrage senden' }).click();
  const link = page.getByRole('link', { name: /Anfrage per E-Mail senden/ });
  await expect(link).toBeVisible();
  expect(await link.getAttribute('href')).toMatch(/^mailto:erb1209@outlook\.de\?subject=/);
  await expect(page.getByRole('textbox', { name: /^Name/ })).toHaveValue('Alex Muster');
});

test('AK-1: Schrittwechsel setzt den Fokus auf die neue Überschrift', async ({ page }) => {
  await open(page, '/contact');
  await page.getByRole('checkbox', { name: 'UX/UI Design' }).check();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await expect(page.getByRole('heading', { name: 'Schritt 2 von 4: Projekt' })).toBeFocused();
});

test('AK-2: Fehlerliste bekommt den Fokus, Link führt zum Feld', async ({ page }) => {
  await open(page, '/contact');
  await page.getByRole('button', { name: 'Weiter' }).click();
  const summary = page.getByRole('group', { name: /Bitte prüfe/ });
  await expect(summary).toBeFocused();
  await summary.getByRole('link').click();
  await expect(page.getByRole('checkbox').first()).toBeFocused();
});

test('AK-9: Vorauswahl über die Leistungsseite', async ({ page }) => {
  await open(page, '/services/accessibility');
  await page.getByRole('link', { name: 'Kostenloses Erstgespräch' }).click();
  await expect(page).toHaveURL(/\/contact\?leistung=accessibility$/);
  await expect(page.getByRole('checkbox', { name: 'Barrierefreiheit-Beratung' })).toBeChecked();
});

test.describe('ohne JavaScript', () => {
  // reducedMotion: ohne sanftes Scrollen, damit Klicks auf weit unten liegende Felder sofort stabil sind
  test.use({ javaScriptEnabled: false, reducedMotion: 'reduce' });
  test('AK-10: alle Schritte sichtbar und absendbar', async ({ page }) => {
    await page.goto('/contact');
    for (const step of ['Leistung', 'Projekt', 'Rahmen', 'Kontakt'])
      await expect(page.getByRole('group', { name: new RegExp(`von 4: ${step}`) })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Weiter' })).toBeHidden();
    await page.getByRole('checkbox', { name: 'Webflow-Entwicklung' }).check();
    await page.getByRole('textbox', { name: /Beschreibung/ }).fill('Wir brauchen einen barrierefreien Relaunch.');
    await page.getByRole('textbox', { name: /^Name/ }).fill('Alex Muster');
    await page.getByRole('textbox', { name: /^E-Mail/ }).fill('alex@beispiel.de');
    await page.getByRole('checkbox', { name: /Datenschutzerklärung/ }).check();
    await page.getByRole('button', { name: 'Anfrage senden' }).click();
    await expect(page.getByRole('link', { name: /Anfrage per E-Mail senden/ })).toBeVisible();
  });
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of ['/contact', '/en/contact']) {
      test(`seite AK-4: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await open(page, path);
        expect(await axe(page)).toEqual([]);
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      });
    }
    test('seite AK-4: mit Fehlermeldungen und Ausweichweg', async ({ page }) => {
      await open(page, '/contact');
      await page.getByRole('button', { name: 'Weiter' }).click();
      await expect(page.getByRole('group', { name: /Bitte prüfe/ })).toBeFocused();
      expect(await axe(page)).toEqual([]);
      await page.reload();
      await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
      await fillAll(page);
      await page.getByRole('button', { name: 'Anfrage senden' }).click();
      await expect(page.getByRole('link', { name: /Anfrage per E-Mail senden/ })).toBeVisible();
      expect(await axe(page)).toEqual([]);
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });
  });
}
