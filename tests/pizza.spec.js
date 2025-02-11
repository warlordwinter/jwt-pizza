import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('buy pizza with login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByText('The web\'s best pizza', { exact: true }).click();
  await expect(page.getByLabel('Global').locator('span')).toContainText('JWT Pizza');
  await page.getByText('The web\'s best pizza', { exact: true }).click();
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
});

