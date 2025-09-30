import { expect, test } from '@playwright/test';
import { login } from './helpers/login';

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

test('Admin logs in', async ({ page }) => {
  const storageFile = 'playwright/.auth/admin.json';
  await login({
    email: ADMIN_EMAIL as string,
    password: ADMIN_PASSWORD as string,
    page
  });
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h1')).toContainText(`Welcome ${ADMIN_EMAIL}!`);
  await page.context().storageState({ path: storageFile });
});
