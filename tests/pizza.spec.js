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

test('Franchise View', async ({ page }) => {await page.goto('http://localhost:5173/');
await page.getByRole('banner').click();
await page.locator('body').press('ControlOrMeta+-');
await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' })).toBeVisible();

await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
await expect(page.getByRole('main')).toContainText('If you are already a franchisee, pleaseloginusing your franchise accountCall now800-555-5555 Now is the time to get in on the JWT Pizza tsunami. The pizza sells itself. People cannot get enough. Setup your shop and let the pizza fly. Here are all the reasons why you should buy a franchise with JWT Pizza.Owning a franchise with JWT Pizza can be highly profitable. With our proven business model and strong brand recognition, you can expect to generate significant revenue. Our profit forecasts show consistent growth year after year, making it a lucrative investment opportunity.In addition to financial success, owning a franchise also allows you to make a positive impact on your community. By providing delicious pizzas and creating job opportunities, you contribute to the local economy and bring joy to people\'s lives. It\'s a rewarding experience that combines entrepreneurship with social responsibility. The following table shows a possible stream of income from your franchise.But it\'s not just about the money. By becoming a franchise owner, you become part of a community that is passionate about delivering exceptional pizzas and creating memorable experiences. You\'ll have the chance to build a team of dedicated employees who share your vision and work together to achieve greatness. And as your business grows, so does your impact on the local economy, creating jobs and bringing joy to countless pizza lovers.YearProfitCostsFranchise Fee202050 ₿400 ₿50 ₿2021150 ₿500 ₿50 ₿2022300 ₿600 ₿50 ₿Unleash Your PotentialAre you ready to embark on a journey towards unimaginable wealth? Owning a franchise with JWT Pizza is your ticket to financial success. With our proven business model and strong brand recognition, you have the opportunity to generate substantial revenue. Imagine the thrill of watching your profits soar year after year, as customers flock to your JWT Pizza, craving our mouthwatering creations.');

await expect(page.getByRole('banner')).toBeVisible();
});

test('About View', async ({ page }) => {await page.goto('http://localhost:5173/');

await page.getByRole('link', { name: 'About' }).click();
await page.getByRole('main').getByRole('img').first().click();
await page.getByText('At JWT Pizza, our amazing').click();
await page.locator('div').filter({ hasText: /^Anna$/ }).getByRole('img').click();
await expect(page.getByRole('main')).toContainText('The secret sauce');
await expect(page.getByText('FranchiseAboutHistory')).toBeVisible();
});

test('Contact View', async ({ page }) => {await page.goto('http://localhost:5173/');

await page.getByRole('link', { name: 'History' }).click();
await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');

await expect(page.getByRole('navigation', { name: 'Global' })).toBeVisible();
await page.getByText('Mama Rucci, my myIt all').click();

});

test('Register View', async ({ page }) => {
await page.goto('http://localhost:5173/');
await page.getByRole('link', { name: 'Register' }).click();
await expect(page.getByRole('textbox', { name: 'Full name' })).toBeEmpty();
await page.getByRole('textbox', { name: 'Email address' }).click();
await page.getByRole('textbox', { name: 'Password' }).click();
await page.getByRole('textbox', { name: 'Full name' }).click();
await page.getByRole('textbox', { name: 'Full name' }).click();
await page.getByRole('textbox', { name: 'Full name' }).fill('Yguy');
await page.getByRole('textbox', { name: 'Full name' }).press('Tab');
await page.getByRole('textbox', { name: 'Email address' }).fill('random');
await page.getByRole('textbox', { name: 'Password' }).click();
await page.getByRole('textbox', { name: 'Password' }).fill('password');
await page.getByRole('button', { name: 'Register' }).click();
await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - text: Email address
    - textbox "Full name"
    - img
    - textbox "Email address"
    - img
    - text: Password
    - textbox "Password": password
    - button:
      - img
    - img
    - button "Register"
    - text: Already have an account? Login instead.
    `);
await page.getByRole('textbox', { name: 'Email address' }).click();
await page.getByRole('textbox', { name: 'Email address' }).fill('123@gmail.com');
await expect(page.locator('form')).toContainText('Register');
await page.getByRole('button', { name: 'Register' }).click();
await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
await expect(page.getByRole('paragraph').filter({ hasText: 'Most amazing pizza experience' })).toBeVisible();
await page.locator('div').filter({ hasText: /^Most amazing pizza experience of my life\. — Megan Fox, Springville$/ }).first().click();
await page.getByRole('link', { name: 'Logout' }).click();
});

test('Login View', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('123@gmail.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
  await page.getByText('Pizza is an absolute delight').click();
  await expect(page.getByRole('main')).toContainText('Pizza is not just a food; it\'s an experience. The aroma of freshly baked pizza, the sight of melted cheese stretching with every bite, and the explosion of flavors in your mouth - it\'s a sensory journey like no other. At JWT Pizza, we believe in the power of pizza to bring people together. Our inviting atmosphere and warm hospitality make every visit a special occasion. Whether you\'re celebrating a birthday, anniversary, or simply craving a delicious meal, JWT Pizza is here to make your experience extraordinary. Join us and discover the magic of pizza at its finest.');
});

test('Admin View and franchise', async ({ page }) => {
await page.goto('http://localhost:5173/');
await page.getByRole('link', { name: 'Login' }).click();
await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
await page.getByRole('textbox', { name: 'Password' }).click();
await page.getByRole('textbox', { name: 'Password' }).fill('admin');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
await page.getByRole('button', { name: 'Order now' }).click();
await expect(page.locator('h2')).toContainText('Awesome is a click away');
await page.getByRole('combobox').selectOption('1');
await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
await page.getByRole('button', { name: 'Checkout' }).click();
await page.getByRole('button', { name: 'Pay now' }).click();
await page.getByRole('button', { name: 'Verify' }).click();
await page.getByRole('button', { name: 'Close' }).click();
// await page.getByRole('button', { name: 'Order more' }).click();

await page.getByRole('link', { name: 'Admin' }).click();
await page.getByRole('button', { name: 'Add Franchise' }).click();
await expect(page.getByLabel('Global')).toContainText('JWT Pizza');
await page.locator('div').filter({ hasText: 'Create franchiseWant to' }).nth(2).click();
await page.getByRole('textbox', { name: 'franchise name' }).click();
await page.getByRole('textbox', { name: 'franchise name' }).fill('BYU2');
await page.locator('div').filter({ hasText: 'Create franchiseWant to' }).nth(2).click();
await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('123@gmail.com');
await page.getByRole('button', { name: 'Create' }).click();
await page.getByRole('row', { name: 'BYU2 Yguy Close' }).getByRole('button').click();
// await expect(page.getByRole('main')).toContainText('Are you sure you want to close the BYU2 franchise? This will close all associated stores and cannot be restored. All outstanding revenue with not be refunded.');
await page.getByRole('button', { name: 'Close' }).click();
await page.getByRole('link', { name: 'Logout' }).click();
});