import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
};
