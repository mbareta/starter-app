import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('Check Courses page load', async ({page}) => {
    await test.step('Navigate to the Courses page', async () => {
        await page.goto('/courses');
    }),

    await test.step('Verify the Courses page', async () => {
        await expect(page).toHaveURL('/courses');
        await expect(page.locator("//a[contains(text(), 'Courses')]")).toContainText('Courses')
    }),

    await test.step('Verify the titles', async () => {
        await expect(page.locator('h1')).toContainText('Welcome');
        await expect(page.locator("//h2[contains(text(), 'Choose from the list of courses.')]")).toContainText('Choose from the list of courses.');
        await expect(page.locator("//h2[contains(text(), 'Available Courses')]")).toContainText('Available Courses');
    });
});
