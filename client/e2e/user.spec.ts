import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('Smoke test', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h1'))
    .toContainText(`Welcome ${process.env.ADMIN_EMAIL}!`);
});
