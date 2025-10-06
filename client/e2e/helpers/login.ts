import { Page } from 'playwright';

type Params = {
  email: string,
  password: string,
  page: Page
}

export async function login(params: Params): Promise<void> {
  const { email, page, password } = params;

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Sign in with email ID' })
    .fill(email, { timeout: 1000 }); // Simulate user typing
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Account logo Studion5.' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Password' })
    .fill(password, { timeout: 1200 });
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Continue' }).click();
  return;
}
