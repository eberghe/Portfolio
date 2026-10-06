import { expect, test } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/startseite.md

test.describe('ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('AK-26: Hero-Überschrift sichtbar ohne JavaScript, keine halbe Uhrzeile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Königsbrunn', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1, name: 'Hey, ich bin Erik, Product Designer' })).toBeVisible();
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1, name: "Hey, I'm Erik, Product Designer" })).toBeVisible();
  });
});

test('AK-27/AK-30: Animation endet sichtbar, Uhrzeit ohne Hydration-Fehler', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect
    .poll(() => page.$$eval('h1 [data-word]', (els) => els.every((el) => getComputedStyle(el).opacity === '1')))
    .toBe(true);
  await expect(page.locator('time')).toHaveText(/^\d{2}:\d{2}/);
  expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
});

test('AK-10: Seitentitel je Sprache', async ({ page }) => {
  await page.goto('/');
  const de = await page.title();
  await page.goto('/en');
  expect(await page.title()).not.toBe('');
  expect(de).not.toBe('');
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });

    for (const path of ['/', '/en']) {
      test(`AK-9: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await page.goto(path);
        expect(await axe(page)).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

test('AK-15: fokussierte Elemente verschwinden nicht unter dem Header', async ({ page }) => {
  await page.goto('/');
  const padding = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop));
  expect(padding).toBeGreaterThanOrEqual(64);
});

test('AK-26: h1-Name je Sprache', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Hey, ich bin Erik, Product Designer');
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName("Hey, I'm Erik, Product Designer");
});

test('AK-42: Hero füllt den ersten Bildschirm, Firmenleiste beginnt darunter', async ({ page }) => {
  await page.goto('/');
  const vh = page.viewportSize()!.height;
  const hero = page.locator('main section').first();
  const box = (await hero.boundingBox())!;
  expect(box.y).toBe(0);
  expect(box.height).toBeGreaterThanOrEqual(vh - 1);
  const gradient = await hero.evaluate((el) =>
    [el, ...el.querySelectorAll('*')].some((n) => getComputedStyle(n).backgroundImage.includes('gradient')),
  );
  expect(gradient).toBe(false);
});

test('AK-43: nur Mona Sans, „Erik“ und „Designer“ kursiv', async ({ page }) => {
  await page.goto('/');
  const styles = await page.$$eval('h1 *', (els) =>
    els.map((el) => ({ family: getComputedStyle(el).fontFamily, style: getComputedStyle(el).fontStyle })),
  );
  for (const s of styles) expect(s.family).toContain('mona');
  expect(styles.filter((s) => s.style === 'italic').length).toBeGreaterThanOrEqual(2);
  await expect
    .poll(() => page.evaluate(() => [...document.fonts].some((f) => f.style === 'italic' && f.status === 'loaded')))
    .toBe(true);
  const size = await page.locator('h1').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeLessThanOrEqual(80);
});

test.describe('AK-47: Hero-Animation', () => {
  for (const motion of ['no-preference', 'reduce'] as const) {
    test.describe(motion, () => {
      test.use({ reducedMotion: motion });
      test(`Wörter und Medien (${motion})`, async ({ page }) => {
        await page.goto('/?animationstest');
        const names = (sel: string) => page.$$eval(sel, (els) => els.map((el) => getComputedStyle(el).animationName));
        const lines = await names('h1 .hero-line');
        const media = await names('h1 [data-hero-media]');
        expect(lines).toHaveLength(4);
        expect(media).toHaveLength(3);
        if (motion === 'reduce') {
          expect([...lines, ...media].every((n) => n === 'none')).toBe(true);
        } else {
          expect(lines.every((n) => n === 'hero-line-in')).toBe(true);
          expect(media.every((n) => n === 'hero-media-in')).toBe(true);
        }
        await expect
          .poll(() => page.$$eval('h1 .hero-line', (els) => els.every((el) => getComputedStyle(el).opacity === '1')), {
            timeout: 6000,
          })
          .toBe(true);
      });
    });
  }
});

test('AK-32/AK-34: Kacheln zentriert, Logos geladen', async ({ page }) => {
  await page.goto('/');
  const aligns = await page.$$eval('#unternehmen ~ ul a', (els) => els.map((el) => getComputedStyle(el).textAlign));
  expect(aligns.every((a) => a === 'center')).toBe(true);
  const logos = page.locator('#unternehmen ~ ul img');
  await expect(logos).toHaveCount(4);
  await expect
    .poll(() => logos.evaluateAll((imgs) => imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0)))
    .toBe(true);
});

test.describe('AK-34: Logos im Dunkelmodus weiß', () => {
  test.use({ colorScheme: 'dark' });
  test('Filter invertiert', async ({ page }) => {
    await page.goto('/');
    const filters = await page.$$eval('#unternehmen ~ ul img', (els) => els.map((el) => getComputedStyle(el).filter));
    expect(filters.every((f) => f.includes('invert(1)'))).toBe(true);
  });
});

test('AK-36: Navigation oben transparent, nach dem Scrollen deckend', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  const bg = () => page.locator('header').evaluate((el) => getComputedStyle(el).backgroundColor);
  await expect.poll(bg).toBe('rgba(0, 0, 0, 0)');
  // Der Hero beginnt ganz oben, unter der Navigation
  const heroTop = await page
    .locator('main section')
    .first()
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(heroTop).toBe(0);
  await page.mouse.wheel(0, 400);
  await page.mouse.wheel(0, -200);
  await expect.poll(bg).not.toBe('rgba(0, 0, 0, 0)');
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  expect(await bg()).not.toBe('rgba(0, 0, 0, 0)');
});

test.describe('AK-38: Zahlen zählen hoch', () => {
  test.use({ reducedMotion: 'no-preference' });
  test('von 0 auf den Endwert, sobald sichtbar', async ({ page }) => {
    await page.goto('/?animationstest');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    const counter = page.locator('dd [data-count]').first();
    const target = (await counter.getAttribute('data-count'))!;
    await expect(counter).toHaveText(/^0/);
    await counter.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(counter).toHaveText(target, { timeout: 4000 });
  });
});

test.describe('AK-38: reduzierte Bewegung', () => {
  test.use({ reducedMotion: 'reduce' });
  test('Endwert sofort', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    const counter = page.locator('dd [data-count]').first();
    await expect(counter).toHaveText((await counter.getAttribute('data-count'))!);
  });
});

test('AK-38: Faktenwerte bleiben einzeilig', async ({ page }) => {
  await page.goto('/');
  const dds = page.locator('section dl dd');
  const lines = await dds.evaluateAll((els) =>
    els.map((el) => ({
      text: el.textContent,
      ratio: el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).fontSize),
    })),
  );
  expect(lines.length).toBeGreaterThan(0);
  for (const l of lines) expect(l.ratio, String(l.text)).toBeLessThan(1.5);
});

test.describe('AK-49: Medien-Plätze magnetisch', () => {
  for (const motion of ['no-preference', 'reduce'] as const) {
    test.describe(motion, () => {
      test.use({ reducedMotion: motion });
      test(`folgen dem Zeiger (${motion})`, async ({ page }, info) => {
        test.skip(info.project.name === 'mobile-360', 'Touch');
        await page.goto('/?animationstest');
        await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
        const magnet = page.locator('h1 [data-magnet]').first();
        await expect
          .poll(() =>
            page.$$eval('h1 [data-hero-media]', (els) => els.every((el) => getComputedStyle(el).opacity === '1')),
          )
          .toBe(true);
        await page.waitForTimeout(1500);
        const box = (await magnet.boundingBox())!;
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.move(box.x + box.width + 30, box.y + box.height / 2, { steps: 5 });
        await page.waitForTimeout(600);
        const moved = await magnet.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
        if (motion === 'reduce') expect(moved).toBe(0);
        else expect(moved).toBeGreaterThan(3);
        // Weit weg: federt zurück
        await page.mouse.move(5, 5, { steps: 5 });
        await expect
          .poll(() => magnet.evaluate((el) => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41)))
          .toBeLessThan(1);
      });
    });
  }
});

test('AK-51: keine Linien um den Unternehmen-Abschnitt, Uhr nicht mehr dort', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('main section').first();
  const companies = page.locator('section[aria-labelledby="unternehmen"]');
  expect(await hero.evaluate((el) => getComputedStyle(el).borderBottomWidth)).toBe('0px');
  expect(await companies.evaluate((el) => getComputedStyle(el).borderBottomWidth)).toBe('0px');
  expect(await companies.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('0px');
  await expect(companies.locator('time')).toHaveCount(0);
});

test('AK-52: Unternehmens-Kacheln gleich groß', async ({ page }) => {
  await page.goto('/');
  const sizes = await page.$$eval('#unternehmen ~ ul > li', (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return [Math.round(r.width), Math.round(r.height)];
    }),
  );
  expect(sizes).toHaveLength(4);
  for (const s of sizes) expect(s).toEqual(sizes[0]);
});
