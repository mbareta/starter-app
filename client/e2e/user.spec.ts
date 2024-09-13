
import { expect, test } from '@playwright/test';

// test.use({ storageState: 'playwright/.auth/admin.json' });

test('Smoke test', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toHaveText('Welcome');
});
