import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const FAKE_SUPABASE_PORT = 3199;
// Optional: vorinstalliertes Chromium nutzen (z. B. in Cloud-Sessions ohne Browser-Download)
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: 'mobile-360', use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 780 } } },
    { name: 'tablet-768', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'desktop-1280', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: [
    // Nachgebildetes Supabase ohne Service-Role-Schlüssel: Login-Mails und Anfragen bleiben aus,
    // angemeldete Ansichten des Kundenbereichs sind testbar (functions/kundenbereich/projektuebersicht.md AK-9)
    {
      command: `node tests/e2e/fixtures/fake-supabase.mjs ${FAKE_SUPABASE_PORT}`,
      url: `http://localhost:${FAKE_SUPABASE_PORT}`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run build && npm run start -- -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: { SUPABASE_URL: `http://localhost:${FAKE_SUPABASE_PORT}`, SUPABASE_ANON_KEY: 'test-anon' },
    },
  ],
});
