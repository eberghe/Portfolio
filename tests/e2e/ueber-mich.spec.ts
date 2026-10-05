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

test('AK-16: ab 768 px läuft die Reihe beim Scrollen waagerecht durch', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-360');
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('[data-journey]')).toHaveAttribute('data-horizontal', 'true');
  const vw = page.viewportSize()!.width;
  const last = (await panels(page).count()) - 1;

  await scrollToJourney(page, 'start');
  const first = await box(page, 0);
  expect(first.x).toBeGreaterThanOrEqual(-1);
  expect(first.x).toBeLessThan(vw / 2);
  expect((await box(page, last)).x).toBeGreaterThan(vw);

  await scrollToJourney(page, 'end');
  const end = await box(page, last);
  expect(end.x + end.width).toBeLessThanOrEqual(vw + 1);
  expect(end.x).toBeGreaterThanOrEqual(0);
  expect((await box(page, 0)).x + (await box(page, 0)).width).toBeLessThan(0);

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
    await expect(page.locator('[data-journey]')).not.toHaveAttribute('data-horizontal', 'true');
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
