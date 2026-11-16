const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');

test('UI 1: after login the home page shows the name of the user', async ({ page }) => {
  await login(page, 'Luna Tester');
  await page.goto('/');

  const actual = (await page.locator('.user-name').first().textContent()).trim();
  const expected = 'Luna Tester';
  expect(actual, `Expected user name "${expected}" in the header but got "${actual}"`).toBe(expected);
});
