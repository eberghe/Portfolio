import { expect, test, type Page } from '@playwright/test';

// functions/seiten/ueber-mich.md AK-16 bis AK-18 (Zeitleiste als waagerechte Tafel-Reihe)
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

test('AK-16: ab 768 px kleben die Stationen und wechseln beim Scrollen', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-360');
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

test('AK-17: unter 768 px stehen die Tafeln untereinander', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-360');
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  const [a, b] = [await box(page, 0), await box(page, 1)];
  expect(b.y).toBeGreaterThanOrEqual(a.y + a.height - 1);
  expect(Math.abs(a.x - b.x)).toBeLessThan(2);
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

test('AK-20: in der waagerechten Reihe füllt jede Tafel den Bildschirm', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-360');
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

test('AK-20: untereinander reicht die Tafel randlos über die volle Breite', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-360');
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  const width = page.viewportSize()!.width;
  const b = await box(page, 0);
  expect(b.x).toBeLessThanOrEqual(0.5);
  expect(Math.abs(b.width - width)).toBeLessThanOrEqual(1);
});

test('AK-21: beim Wechsel der Darstellung bleibt die Station im Blick', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1280');
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await page.evaluate(() => {
    const li = document.querySelectorAll('[data-journey] ol > li')[7] as HTMLElement;
    scrollTo({ top: li.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-pinned', 'true');
  await page.waitForTimeout(400);
  const b = await box(page, 7);
  expect(Math.abs(b.x)).toBeLessThan(40);
  expect(Math.abs(b.y)).toBeLessThan(2);

  await page.setViewportSize({ width: 360, height: 780 });
  await expect(page.locator('[data-journey]')).not.toHaveAttribute('data-pinned', 'true');
  await page.waitForTimeout(400);
  const c = await box(page, 7);
  expect(c.y).toBeGreaterThan(-c.height / 2);
  expect(c.y).toBeLessThan(780 / 2);
});

test('AK-22: Text und Jahreszahl stehen fest, nur der Hintergrund wechselt', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-360');
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

test('AK-23: Bilder wechseln animiert statt zu gleiten', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-360');
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
