const { test, expect } = require('@playwright/test');
const { login, makeReading } = require('./helpers');

test('UI 5: deleting a reading removes it from the history', async ({ page }) => {
  await login(page);
  await makeReading(page, 'education');
  await page.goto('/history');

  const before = await page.locator('.history-table tbody tr').count();
  expect(before, `Expected 1 row before deleting but got ${before}`).toBe(1);

  await page.locator('.history-table tbody tr button[type="submit"]').first().click();
  await page.waitForURL(/\/history$/);

  const after = await page.locator('.history-table tbody tr').count();
  expect(after, `Expected 0 rows after deleting but got ${after}`).toBe(0);

  const emptyState = await page.locator('.empty').isVisible();
  expect(emptyState, 'Expected the empty state to be visible after deleting the only reading').toBe(true);
});
