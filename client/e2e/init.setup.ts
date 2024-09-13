import { expect, test } from '@playwright/test';
import { login } from './helpers/login';

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

test('Admin logs in', async ({ page }) => {
  const storageFile = 'playwright/.auth/admin.json';
  await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  await expect(page.locator('h1')).toContainText(`Welcome ${ADMIN_EMAIL}!`);
  await page.context().storageState({ path: storageFile });
});
