import { Page } from '@playwright/test';

export async function login(
  page: Page, email: string, password: string): Promise<void> {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
};
