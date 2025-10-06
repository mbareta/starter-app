import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('Check navbar item elements', async ({page}) => {
  await test.step('Verify the logo display', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator("//img[@src='/logo.png']")).toBeVisible();
    await expect(page.locator("//a[contains(text(),'Home')]")).toBeVisible();
    await expect(page.locator("//a[contains(text(),'Courses')]")).toBeVisible();
  });

  await test.step('Verify the user avatar and email display', async () => {
    await page.goto('/')
    await expect(page.locator(`//img[@alt="user's profile picture"]`))
      .toBeVisible();
    const email = page.locator(`
      //div[@class="navbar-item has-dropdown is-hoverable"]
      //div[contains(text(),"${process.env.ADMIN_EMAIL}")]`
    );
    await expect(email).toBeVisible();
  });

  await test.step('Verify toggle and log out buttons display', async () => {
    await page.hover("//div[@class='navbar-item has-dropdown is-hoverable']");
    await expect(page.locator('text=Toggle theme')).toBeVisible();
    await expect(page.locator('text=Log Out')).toBeVisible();
  });
});
