import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// functions/seiten/navigation-und-footer.md
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

test('AK-3: Sprachlink wechselt auf die englische Seite mit lang="en"', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('AK-4: geschlossenes mobiles Menü ist per Tab nicht erreichbar', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-360', 'nur mobil');
  await page.goto('/');
  const burger = page.getByRole('button', { name: 'Menü' });
  await expect(burger).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    const inMenu = await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu'));
    expect(inMenu).toBe(false);
  }
  await burger.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(burger).toBeFocused();
});

test('AK-5: Dunkelmodus bleibt nach dem Neuladen erhalten, ohne Aufblitzen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Dunkelmodus' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test.describe('Systemeinstellung dunkel', () => {
  test.use({ colorScheme: 'dark' });

  test('AK-5: beim ersten Besuch gilt die Systemeinstellung', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });

    test('AK-7: keine axe-Verstöße in Navigation und Footer', async ({ page }) => {
      await page.goto('/');
      const results = await new AxeBuilder({ page }).include('header').include('footer').withTags(AXE_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });
  });
}
