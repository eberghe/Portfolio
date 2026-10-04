import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

/** Wartet, bis alle endlichen Animationen (z. B. Einblenden) fertig sind, damit axe Endfarben misst. */
export async function settleAnimations(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .filter((a) => a.effect?.getTiming().iterations !== Infinity)
      .every((a) => a.playState !== 'running'),
  );
}

export async function axe(page: Page, include: string[] = []) {
  await settleAnimations(page);
  let builder = new AxeBuilder({ page }).withTags(AXE_TAGS);
  for (const sel of include) builder = builder.include(sel);
  return (await builder.analyze()).violations;
}

/**
 * Seite laden, ohne auf alle Bilder zu warten, und dann auf React warten.
 * Bildlastige Seiten erreichen „load" in CI erst spät, solange die Bildoptimierung noch kalt ist.
 */
export async function openHydrated(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
}
