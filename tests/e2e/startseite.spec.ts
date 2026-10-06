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

  test('AK-65: ohne JavaScript sind alle Leistungen offen', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('section[aria-labelledby="angebot"] a[href^="/services/"]');
    await expect(links).toHaveCount(7);
    for (const link of await links.all()) await expect(link).toBeVisible();
  });
});

test('AK-67: Leistungen so breit wie der Container, große Überschrift', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1280', 'Maße ab 768 px');
  await page.goto('/');
  const section = page.locator('section[aria-labelledby="angebot"]');
  const list = section.locator('ol');
  const box = (await list.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(1280 - 2 * 48 - 20);
  // Containerbreite (design-tokens.md AK-11): bei breitem Bildschirm nicht breiter als 1280 − 2 × 48
  await page.setViewportSize({ width: 1600, height: 900 });
  expect((await list.boundingBox())!.width).toBeLessThanOrEqual(1184 + 1);
  const size = (sel: string) =>
    section
      .locator(sel)
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(await size('h2')).toBeGreaterThanOrEqual(56);
  expect(await size('h3 button span:nth-child(2)')).toBeGreaterThanOrEqual(40);
});

test('AK-68: grüner Rahmen nur beim Tastaturfokus', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  const section = page.locator('section[aria-labelledby="angebot"]');
  const style = (el: Element) => {
    const li = el.closest('li')!;
    const cs = getComputedStyle(el);
    return { outline: cs.outlineStyle, outlineColor: cs.outlineColor, liBorder: getComputedStyle(li).borderLeftWidth };
  };
  const primary = await page.evaluate(() => {
    const d = document.createElement('div');
    d.style.color = 'hsl(var(--primary))';
    document.body.append(d);
    const c = getComputedStyle(d).color;
    d.remove();
    return c;
  });
  const second = section.getByRole('button').nth(1);
  await second.click();
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  const clicked = await second.evaluate(style);
  expect(clicked.outline).toBe('none');
  expect(clicked.liBorder).toBe('0px');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(second).toBeFocused();
  const keyboard = await second.evaluate(style);
  expect(keyboard.outline).toBe('solid');
  expect(keyboard.outlineColor).toBe(primary);
});

test('AK-65: Akkordeon per Tastatur, geschlossene Felder unsichtbar', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  const section = page.locator('section[aria-labelledby="angebot"]');
  const buttons = section.getByRole('button');
  await expect(section.getByRole('link', { name: 'Mehr zu UX/UI Design' })).toBeVisible();
  const second = buttons.nth(1);
  const panel = page.locator(`#${await second.getAttribute('aria-controls')}`);
  await expect(panel.locator('a')).toBeHidden();
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(buttons.first()).toHaveAttribute('aria-expanded', 'false');
  await expect(panel.getByRole('link')).toBeVisible();
  await expect(section.getByRole('link', { name: 'Mehr zu UX/UI Design' })).toBeHidden();
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
  const aligns = await page.$$eval('section[aria-labelledby="unternehmen"] ul a', (els) =>
    els.map((el) => getComputedStyle(el).textAlign),
  );
  expect(aligns.every((a) => a === 'center')).toBe(true);
  const logos = page.locator('section[aria-labelledby="unternehmen"] ul img');
  await expect(logos).toHaveCount(4);
  await expect
    .poll(() => logos.evaluateAll((imgs) => imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0)))
    .toBe(true);
});

test.describe('AK-34: Logos im Dunkelmodus weiß', () => {
  test.use({ colorScheme: 'dark' });
  test('Filter invertiert', async ({ page }) => {
    await page.goto('/');
    const filters = await page.$$eval('section[aria-labelledby="unternehmen"] ul img', (els) =>
      els.map((el) => getComputedStyle(el).filter),
    );
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
  const sizes = await page.$$eval('section[aria-labelledby="unternehmen"] ul > li', (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return [Math.round(r.width), Math.round(r.height)];
    }),
  );
  expect(sizes).toHaveLength(4);
  for (const s of sizes) expect(s).toEqual(sizes[0]);
});

test.describe('AK-55: Referenzen beim senkrechten Scrollen', () => {
  test('Band klebt und schiebt die Karten nach links bis zur letzten', async ({ page }) => {
    await page.goto('/?animationstest');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    const rail = page.locator('[data-rail]');
    await expect(rail).toHaveAttribute('data-pinned', 'true');
    const track = page.locator('[data-rail-track]');
    const top = await rail.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const extra = await rail.evaluate((el) => (el as HTMLElement).offsetHeight - window.innerHeight);
    expect(extra).toBeGreaterThan(100);
    // Mitte: Band steht, Karten sind ein Stück nach links gewandert
    await page.evaluate((y) => window.scrollTo(0, y), top + extra / 2);
    await expect
      .poll(() => track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41))
      .toBeLessThan(-50);
    const sticky = page.locator('[data-rail-sticky]');
    expect(Math.abs((await sticky.boundingBox())!.y)).toBeLessThanOrEqual(2);
    // Ende: letzte Karte ganz im Bild
    await page.evaluate((y) => window.scrollTo(0, y), top + extra);
    await expect
      .poll(() =>
        page.$eval(
          '[data-rail-track] > li:last-child',
          (el) => el.getBoundingClientRect().right <= window.innerWidth + 1,
        ),
      )
      .toBe(true);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('Tastaturfokus holt die Karte ins Bild', async ({ page }) => {
    await page.goto('/?animationstest');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    await expect(page.locator('[data-rail]')).toHaveAttribute('data-pinned', 'true');
    await page.locator('[data-rail-track] > li:last-child a').focus();
    await expect
      .poll(() =>
        page.$eval('[data-rail-track] > li:last-child', (el) => {
          const r = el.getBoundingClientRect();
          return r.left >= -1 && r.right <= window.innerWidth + 1 && r.top < window.innerHeight;
        }),
      )
      .toBe(true);
  });

  test.describe('reduzierte Bewegung', () => {
    test.use({ reducedMotion: 'reduce' });
    test('seitlich wischbar, kein Kleben', async ({ page }) => {
      await page.goto('/');
      await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
      const rail = page.locator('[data-rail]');
      await expect(rail).not.toHaveAttribute('data-pinned', 'true');
      const scroller = page.locator('[data-rail-scroller]');
      expect(await scroller.evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto');
      expect(await scroller.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
      expect(await rail.evaluate((el) => (el as HTMLElement).offsetHeight <= window.innerHeight * 1.5)).toBe(true);
    });
  });
});

test('AK-56: Kreis „Zum Projekt“ folgt dem Zeiger', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-360', 'Touch');
  await page.goto('/?animationstest');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  const card = page.locator('[data-rail-track] > li').first().locator('a');
  await card.scrollIntoViewIfNeeded();
  // Weiches Scrollen (Lenis) zur Ruhe kommen lassen
  await page.waitForTimeout(1000);
  const circle = card.locator('[data-cursor]');
  await expect(circle).toHaveCSS('opacity', '0');
  const img = (await card.locator('img').boundingBox())!;
  await page.mouse.move(img.x + 60, img.y + 60);
  await page.mouse.move(img.x + 80, img.y + 90, { steps: 3 });
  await expect(circle).toHaveCSS('opacity', '1');
  const c = (await circle.boundingBox())!;
  expect(Math.abs(c.x + c.width / 2 - (img.x + 80))).toBeLessThan(30);
  expect(Math.abs(c.y + c.height / 2 - (img.y + 90))).toBeLessThan(30);
  await expect(circle).toHaveText('Zum Projekt');
});

test('AK-57: Faktenleiste mit Linien bis an den Rand', async ({ page }, info) => {
  await page.goto('/');
  const dl = page.locator('section[aria-labelledby="ueber-mich"] dl');
  const lineWidth = await dl.evaluate((el) => el.parentElement!.getBoundingClientRect().width);
  expect(Math.round(lineWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth));
  const first = dl.locator('> div').first();
  const last = dl.locator('> div').last();
  if (info.project.name === 'mobile-360') {
    expect(await dl.evaluate((el) => getComputedStyle(el).borderLeftWidth)).toBe('0px');
  } else {
    expect(await dl.evaluate((el) => getComputedStyle(el).borderLeftWidth)).toBe('1px');
    expect(await last.evaluate((el) => getComputedStyle(el).borderRightWidth)).toBe('1px');
    expect(await first.textContent()).toContain('6+');
    expect(await last.textContent()).toContain('Augsburg');
  }
});

test.describe('AK-53: Fokusrahmen auf dunklen Flächen hell', () => {
  test.use({ colorScheme: 'light' });
  test('Referenz-Karte, „Alle Projekte ansehen“ und Footer-Link', async ({ page }) => {
    await page.goto('/');
    for (const link of [
      page.locator('[data-rail-track] a').first(),
      page.getByRole('link', { name: 'Alle Projekte ansehen' }),
      page.locator('footer').getByRole('link', { name: 'Impressum' }).first(),
    ]) {
      await link.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      expect(await link.evaluate((el) => getComputedStyle(el).outlineColor)).toBe('rgb(255, 255, 255)');
    }
  });
});

test('AK-59: Ablauf mit Hintergrund wie „Über mich“, linke Spalte klebt', async ({ page }, info) => {
  await page.goto('/');
  const process = page.locator('section[aria-labelledby="ablauf"]');
  const about = page.locator('section[aria-labelledby="ueber-mich"]');
  const bg = (l: typeof process) => l.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(await bg(process)).toBe(await bg(about));
  const aside = process.locator('[data-process-intro]');
  if (info.project.name === 'mobile-360') {
    expect(await aside.evaluate((el) => getComputedStyle(el).position)).toBe('static');
    return;
  }
  expect(await aside.evaluate((el) => getComputedStyle(el).position)).toBe('sticky');
  // Beim Scrollen durch die Schritte bleibt die Spalte im Bild
  const last = process.locator('ol > li').last();
  await last.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = (await aside.boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeLessThan(page.viewportSize()!.height / 2);
});

test.describe('AK-61: Linien füllen sich beim Scrollen', () => {
  test('mit Bewegung: Füllung wächst', async ({ page }) => {
    await page.goto('/');
    const fill = page.locator('section[aria-labelledby="ablauf"] [data-step-line] > span').first();
    // Linie an eine Stelle im Fenster scrollen (Anteil der Fensterhöhe) und den Füllgrad lesen.
    // Erneut scrollen bei jedem Versuch, falls sich das Layout beim Laden (Schrift, Bilder) noch verschiebt.
    const at = (f: number) =>
      fill.evaluate(async (el, f) => {
        const line = el.parentElement!;
        window.scrollTo(0, line.getBoundingClientRect().top + window.scrollY - window.innerHeight * f);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return new DOMMatrix(getComputedStyle(el).transform).d;
      }, f);
    await expect.poll(() => at(0.95)).toBe(0);
    await expect.poll(() => at(0.1)).toBe(1);
  });
  test.describe('reduzierte Bewegung', () => {
    test.use({ reducedMotion: 'reduce' });
    test('ganz gefüllt', async ({ page }) => {
      await page.goto('/');
      const fill = page.locator('section[aria-labelledby="ablauf"] [data-step-line] > span').first();
      expect(await fill.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).d)).toBe(1);
    });
  });
});

test('AK-62: Firmenleiste mit durchgehenden Linien bis zum Rand', async ({ page }, info) => {
  await page.goto('/');
  const ul = page.locator('section[aria-labelledby="unternehmen"] ul').first();
  const band = ul.locator('xpath=..');
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  expect(Math.round((await band.boundingBox())!.width)).toBe(width);
  expect(await band.evaluate((el) => getComputedStyle(el).borderTopStyle)).toBe('solid');
  expect(await band.evaluate((el) => getComputedStyle(el).borderBottomStyle)).toBe('solid');
  const styles = await ul.locator('> li').evaluateAll((els) =>
    els.flatMap((el) => {
      const cs = getComputedStyle(el);
      return [cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle, cs.borderTopStyle];
    }),
  );
  expect(styles).not.toContain('dashed');
  if (info.project.name !== 'mobile-360') {
    expect(await ul.evaluate((el) => getComputedStyle(el).borderLeftWidth)).toBe('1px');
    expect(
      await ul
        .locator('> li')
        .last()
        .evaluate((el) => getComputedStyle(el).borderRightWidth),
    ).toBe('1px');
  }
});

test('AK-63: Hero-Überschrift auf dem Handy groß im Verhältnis zum Absatz', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-360', 'nur unter 640 px');
  for (const width of [320, 360, 390, 430]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const h1 = await page.locator('h1').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const p = await page
      .locator('main section')
      .first()
      .locator('p')
      .last()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(h1 / p).toBeGreaterThanOrEqual(2.25);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    // Keine Wortteile ragen aus der Zeile: jedes Wort bleibt innerhalb des Fensters
    const outside = await page.$$eval(
      'h1 [data-word]',
      (els) =>
        els.filter((el) => {
          const r = el.getBoundingClientRect();
          return r.left < 0 || r.right > window.innerWidth;
        }).length,
    );
    expect(outside).toBe(0);
  }
});

test('AK-69: Foto in „Über mich“ groß', async ({ page }, info) => {
  await page.goto('/');
  const img = page.locator('section[aria-labelledby="ueber-mich"] img').first();
  await img.scrollIntoViewIfNeeded();
  const { width } = (await img.boundingBox())!;
  const vw = page.viewportSize()!.width;
  if (info.project.name === 'desktop-1280') expect(width).toBeGreaterThanOrEqual(480);
  if (info.project.name === 'mobile-360') expect(width).toBeGreaterThanOrEqual(vw - 2 * 24 - 3); // minus 1 px Rahmen je Seite
});
