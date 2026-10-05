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
  await page.getByRole('checkbox', { name: /einverstanden/ }).check();
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

test('Kritiker 1: „Anfrage senden" erst im letzten Schritt', async ({ page }) => {
  await open(page, '/contact');
  await expect(page.getByRole('button', { name: 'Weiter' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Anfrage senden' })).toBeHidden();
});

test('Kritiker 7: Fehlerliste und Schritt-Überschrift haben sichtbaren Fokus', async ({ page }) => {
  await open(page, '/contact');
  await page.getByRole('button', { name: 'Weiter' }).focus();
  await page.keyboard.press('Enter');
  const outline = () => page.evaluate(() => parseFloat(getComputedStyle(document.activeElement!).outlineWidth));
  await expect(page.getByRole('group', { name: /Bitte prüfe/ })).toBeFocused();
  expect(await outline()).toBeGreaterThanOrEqual(2);
  await page.getByRole('checkbox', { name: 'Webflow-Entwicklung' }).check();
  await page.getByRole('button', { name: 'Weiter' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /Schritt 2 von 4/ })).toBeFocused();
  expect(await outline()).toBeGreaterThanOrEqual(2);
});

test('AK-9: Vorauswahl über die Leistungsseite', async ({ page }) => {
  await open(page, '/services/accessibility');
  await page.getByRole('link', { name: 'Kostenloses Erstgespräch' }).first().click();
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
    await page.getByRole('checkbox', { name: /einverstanden/ }).check();
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

// functions/seiten/kontakt.md AK-6: Assistent ohne Scrollen bedienbar
test('seite AK-6: Assistent im ersten Bildschirm', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '/contact');
  const visible = async (name: string) => {
    const box = (await page.getByRole('button', { name, exact: true }).boundingBox())!;
    const height = page.viewportSize()!.height;
    expect(box.y + box.height, name).toBeLessThanOrEqual(height);
  };
  const lastOption = (await page.getByRole('checkbox').last().boundingBox())!;
  expect(lastOption.y + lastOption.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await visible('Weiter');
  if (info.project.name === 'mobile-360') return;
  await page.getByRole('checkbox', { name: 'Webflow-Entwicklung' }).check();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('textbox', { name: /Beschreibung/ }).fill('Wir brauchen einen barrierefreien Relaunch.');
  await visible('Weiter');
  await page.getByRole('button', { name: 'Weiter' }).click();
  await visible('Weiter');
  await page.getByRole('button', { name: 'Weiter' }).click();
  await visible('Anfrage senden');
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('seite AK-7: Schritt-Buttons verdecken kein fokussiertes Feld', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-360', 'Leiste klebt nur auf dem Handy');
  await open(page, '/contact');
  const boxes = page.getByRole('checkbox');
  const bar = page.getByRole('button', { name: 'Weiter' });
  for (let i = 0; i < (await boxes.count()); i++) {
    await boxes.nth(i).focus();
    await page.waitForTimeout(50);
    const field = (await boxes.nth(i).locator('xpath=..').boundingBox())!;
    const barTop = (await bar.locator('xpath=..').boundingBox())!.y;
    expect(field.y + field.height, `Option ${i}`).toBeLessThanOrEqual(barTop + 1);
  }
});

test('seite AK-8: Einleitung vor dem Assistenten vorgelesen', async ({ page }) => {
  await open(page, '/contact');
  const order = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
    const texts: string[] = [];
    while (walker.nextNode()) {
      const el = walker.currentNode.parentElement!;
      if (el.closest('[aria-hidden="true"]') || getComputedStyle(el).display === 'none') continue;
      texts.push(walker.currentNode.textContent!.trim());
    }
    const all = texts.join(' ');
    return { intro: all.indexOf('vier kurzen Schritten'), form: all.indexOf('Projekt anfragen') };
  });
  expect(order.intro).toBeGreaterThanOrEqual(0);
  expect(order.intro).toBeLessThan(order.form);
});
