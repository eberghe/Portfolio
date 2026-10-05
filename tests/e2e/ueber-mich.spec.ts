import { expect, test, type Page } from '@playwright/test';

// functions/seiten/ueber-mich.md AK-16 bis AK-25 (Zeitleiste „Mein Weg“)
const panels = (page: Page) => page.locator('[data-journey] ol > li');
const box = async (page: Page, i: number) => (await panels(page).nth(i).boundingBox())!;

async function scrollToJourney(page: Page, where: 'start' | 'end') {
  await page.evaluate((w) => {
    const s = document.querySelector('[data-journey]') as HTMLElement;
    const top = s.getBoundingClientRect().top + scrollY;
    scrollTo({ top: w === 'start' ? top : top + s.offsetHeight - innerHeight, behavior: 'instant' });
  }, where);
  await page.waitForTimeout(400);
}

test('AK-16: auf allen Größen kleben die Stationen und wechseln beim Scrollen', async ({ page }) => {
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  const last = (await panels(page).count()) - 1;

  await scrollToJourney(page, 'start');
  await expect(panels(page).first()).toHaveAttribute('data-active', 'true');
  await scrollToJourney(page, 'end');
  await expect(panels(page).nth(last)).toHaveAttribute('data-active', 'true');
  await expect(panels(page).first()).not.toHaveAttribute('data-active', 'true');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test.describe('AK-17: reduzierte Bewegung', () => {
  test.use({ reducedMotion: 'reduce' });
  test('Tafeln untereinander', async ({ page }) => {
    await page.goto('/about');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    await expect(page.locator('[data-journey]')).not.toHaveAttribute('data-pinned', 'true');
    const [a, b] = [await box(page, 0), await box(page, 1)];
    expect(b.y).toBeGreaterThanOrEqual(a.y + a.height - 1);
  });
});

test.describe('AK-17: ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('Tafeln untereinander, Text sichtbar', async ({ page }) => {
    await page.goto('/about');
    const [a, b] = [await box(page, 0), await box(page, 1)];
    expect(b.y).toBeGreaterThanOrEqual(a.y + a.height - 1);
    await expect(panels(page).first().locator('h3')).toBeVisible();
  });
});

test('AK-18: Abdunklung mindestens 55 % Schwarz', async ({ page }) => {
  await page.goto('/about');
  const alphas = await page.$$eval('[data-journey] [data-shade]', (els) =>
    els.map((el) => {
      const m = getComputedStyle(el).backgroundColor.match(/rgba?\(0, 0, 0(?:, ([\d.]+))?\)/);
      return m ? Number(m[1] ?? 1) : 0;
    }),
  );
  expect(alphas.length).toBeGreaterThan(0);
  expect(alphas.every((a) => a >= 0.55)).toBe(true);
});

test('AK-20: beim Kleben füllt jede Tafel den Bildschirm', async ({ page }) => {
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  await scrollToJourney(page, 'start');
  const { width, height } = page.viewportSize()!;
  for (const i of [0, 1]) {
    const b = await box(page, i);
    expect(Math.abs(b.width - width)).toBeLessThanOrEqual(1);
    expect(Math.abs(b.height - height)).toBeLessThanOrEqual(1);
  }
  expect(Math.abs((await box(page, 0)).x)).toBeLessThanOrEqual(1);
});

test.describe('AK-20: untereinander', () => {
  test.use({ reducedMotion: 'reduce' });
  test('Tafel randlos über die volle Breite', async ({ page }) => {
    await page.goto('/about');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    const width = page.viewportSize()!.width;
    const b = await box(page, 0);
    expect(b.x).toBeLessThanOrEqual(0.5);
    expect(Math.abs(b.width - width)).toBeLessThanOrEqual(1);
  });
});

test('AK-21: beim Wechsel der Darstellung bleibt die Station im Blick', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1280');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await page.evaluate(() => {
    const li = document.querySelectorAll('[data-journey] ol > li')[7] as HTMLElement;
    scrollTo({ top: li.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  await page.waitForTimeout(400);
  await expect(panels(page).nth(7)).toHaveAttribute('data-active', 'true');
  expect(Math.abs((await box(page, 7)).y)).toBeLessThan(2);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-journey]')).not.toHaveAttribute('data-pinned', 'true');
  await page.waitForTimeout(400);
  const c = await box(page, 7);
  expect(c.y).toBeGreaterThan(-c.height / 2);
  expect(c.y).toBeLessThan(800 / 2);
});

test('AK-22: Text und Jahreszahl stehen fest, nur der Hintergrund wechselt', async ({ page }) => {
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  const h3 = (i: number) => panels(page).nth(i).locator('h3');
  const at = async (i: number) => {
    await page.evaluate((i) => {
      const s = document.querySelector('[data-journey]') as HTMLElement;
      const area = s.querySelector('ol')!.parentElement!.parentElement as HTMLElement;
      const n = s.querySelectorAll('ol > li').length;
      const top = area.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + (i / (n - 1)) * (area.offsetHeight - innerHeight), behavior: 'instant' });
    }, i);
    await page.waitForTimeout(900);
  };
  const opacityOf = (i: number) =>
    h3(i).evaluate((el) => {
      let o = 1;
      for (let n: Element | null = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
      return o;
    });

  await at(0);
  const first = (await h3(0).boundingBox())!;
  expect(await opacityOf(0)).toBe(1);
  expect(await opacityOf(3)).toBe(0);

  await at(3);
  const fourth = (await h3(3).boundingBox())!;
  expect(Math.abs(fourth.x - first.x)).toBeLessThanOrEqual(2);
  expect(await opacityOf(3)).toBe(1);
  expect(await opacityOf(0)).toBe(0);
  // Hintergrund der vierten Station füllt den Bildschirm
  expect(Math.abs((await box(page, 3)).x)).toBeLessThan(5);
  const year = page.locator('[data-journey] [data-year]');
  await expect(year).toHaveAttribute(
    'data-year',
    (await panels(page).nth(3).locator('time').getAttribute('datetime'))!.slice(0, 4),
  );
});

test('AK-23: Bilder wechseln animiert statt zu gleiten', async ({ page }) => {
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  // Abschnitt klebt: Anfang des Scrollbereichs der Stationen
  await page.evaluate(() => {
    const area = document.querySelector('[data-journey] ol')!.parentElement!.parentElement!;
    scrollTo({ top: area.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  // Alle Stationen liegen deckungsgleich, keine steht seitlich daneben
  for (const i of [0, 1, 5]) {
    const b = await box(page, i);
    expect(Math.abs(b.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(b.y)).toBeLessThanOrEqual(1);
  }
  const clip = (i: number) =>
    panels(page)
      .nth(i)
      .evaluate((el) => getComputedStyle(el).clipPath);
  expect(await clip(0)).toMatch(/inset\(0(px|%)?\)|inset\(0% 0% 0% 0%\)|none/);
  expect(await clip(1)).toMatch(/inset\(100%/);
  // Die nächste Station deckt per Maske auf und zoomt dabei heraus
  const transition = await panels(page)
    .nth(1)
    .evaluate((el) => getComputedStyle(el).transitionProperty);
  expect(transition).toContain('clip-path');
  // Kritiker: Tailwind erzeugte die Dauer nicht, die Maske lief in 150 ms als harter Schnitt
  const seconds = await panels(page)
    .nth(1)
    .evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
  expect(seconds).toBeGreaterThanOrEqual(0.8);
});

test('AK-24: Pfeile blättern zwischen den Stationen', async ({ page }) => {
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  await page.evaluate(() => {
    const area = document.querySelector('[data-journey] ol')!.parentElement!.parentElement!;
    scrollTo({ top: area.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  });
  const prev = page.getByRole('button', { name: 'Vorherige Station' });
  const next = page.getByRole('button', { name: 'Nächste Station' });
  await expect(prev).toBeDisabled();
  await expect(next).toBeEnabled();
  for (const b of [await prev.boundingBox(), await next.boundingBox()]) {
    expect(b!.width).toBeGreaterThanOrEqual(44);
    expect(b!.height).toBeGreaterThanOrEqual(44);
  }
  await next.click();
  await expect(panels(page).nth(1)).toHaveAttribute('data-active', 'true');
  await next.click();
  await expect(panels(page).nth(2)).toHaveAttribute('data-active', 'true');
  await prev.click();
  await expect(panels(page).nth(1)).toHaveAttribute('data-active', 'true');
  await expect(prev).toBeEnabled();
  // Tastatur
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(panels(page).nth(2)).toHaveAttribute('data-active', 'true');
  // Ende
  const last = (await panels(page).count()) - 1;
  await scrollToJourney(page, 'end');
  await expect(panels(page).nth(last)).toHaveAttribute('data-active', 'true');
  await expect(next).toBeDisabled();
  // Fokus bleibt am Ende auf dem Knopf (Kritiker)
  await next.focus();
  await next.press('Enter');
  await expect(next).toBeFocused();
  // Wechsel per Pfeil wird angesagt
  await prev.click();
  await expect(page.locator('[data-journey] [aria-live="polite"]')).toContainText(`${last} / ${last + 1}`);
});

test('AK-25: jede Station passt ohne Abschneiden in den Bildschirm', async ({ page }) => {
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  const n = await panels(page).count();
  const { width, height } = page.viewportSize()!;
  const next = await page.getByRole('button', { name: 'Nächste Station' }).boundingBox();
  for (let i = 0; i < n; i++) {
    await page.evaluate((i) => {
      const area = document.querySelector('[data-journey] ol')!.parentElement!.parentElement!;
      const n = document.querySelectorAll('[data-journey] ol > li').length;
      const top = area.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + (i / (n - 1)) * (area.offsetHeight - innerHeight), behavior: 'instant' });
    }, i);
    await expect(panels(page).nth(i)).toHaveAttribute('data-active', 'true');
    for (const sel of ['h3', 'time', 'p']) {
      const b = (await panels(page).nth(i).locator(sel).first().boundingBox())!;
      expect(b.x, `${i} ${sel}`).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width, `${i} ${sel}`).toBeLessThanOrEqual(width + 1);
      expect(b.y + b.height, `${i} ${sel}`).toBeLessThanOrEqual(height);
      // Text überlappt die Pfeile nicht
      const clear = b.y + b.height <= next!.y || b.x + b.width <= next!.x;
      expect(clear, `${i} ${sel} unter den Pfeilen`).toBe(true);
    }
  }
});

test('AK-28: mobil steht der Stationstext unten, Gesichter oben bleiben frei', async ({ page }, info) => {
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  await page.evaluate(() => {
    const area = document.querySelector('[data-journey] ol')!.parentElement!.parentElement!;
    scrollTo({ top: area.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  const { height } = page.viewportSize()!;
  const h3 = (await panels(page).first().locator('h3').boundingBox())!;
  if (info.project.name === 'mobile-360') expect(h3.y).toBeGreaterThan(height / 2);
  else expect(h3.y).toBeLessThan(height / 2);
});
