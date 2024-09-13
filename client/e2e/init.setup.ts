const { expect, test: setup } = require('@playwright/test');
const { login } = require('./helpers/login');

setup('Admin logs in', async ({ page }) => {
  await page.goto('/');
  // await expect(page.getByRole('heading')).toHaveText('Welcome !');
  // const storageFile = 'playwright/.auth/admin.json';
  // await login(page, 'admin@ntc.org', 'admin123');
  // await expect(page.getByRole('heading')).toHaveText('Welcome admin@ntc.org!');
  // await page.context().storageState({ path: storageFile });
});
