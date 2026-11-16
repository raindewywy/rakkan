const { test, expect } = require('@playwright/test');
const { login, makeReading } = require('./helpers');

test('UI 2: a prediction shows only the chosen category', async ({ page }) => {
  await login(page);
  await makeReading(page, 'finance');

  const cards = await page.locator('.result-card').count();
  expect(cards, `Expected 1 result card but got ${cards}`).toBe(1);

  const category = await page.locator('.result-card').getAttribute('data-category');
  expect(category, `Expected the result of "finance" but got "${category}"`).toBe('finance');
});

test('UI 3: the new reading appears in the history', async ({ page }) => {
  await login(page);
  await makeReading(page, 'career');

  await page.goto('/history');

  const rows = await page.locator('.history-table tbody tr').count();
  expect(rows, `Expected 1 history row but got ${rows}`).toBe(1);

  const category = await page.locator('.history-table tbody tr').first().getAttribute('data-category');
  expect(category, `Expected the history row to be "career" but got "${category}"`).toBe('career');
});

test('UI 4: search and filter find the right readings', async ({ page }) => {
  await login(page);
  await makeReading(page, 'love');
  await makeReading(page, 'finance');

  // Search: the category name is part of what is searched.
  await page.goto('/history');
  await page.fill('#q', 'finance');
  await page.click('.search button[type="submit"]');
  const searchRows = await page.locator('.history-table tbody tr').count();
  expect(searchRows, `Expected 1 row after searching "finance" but got ${searchRows}`).toBe(1);

  // Filter: pick one category in the dropdown.
  await page.goto('/history');
  await page.selectOption('#category', 'love');
  await page.click('.filter button[type="submit"]');
  const filterRows = await page.locator('.history-table tbody tr').count();
  expect(filterRows, `Expected 1 row after filtering "love" but got ${filterRows}`).toBe(1);
  const category = await page.locator('.history-table tbody tr').first().getAttribute('data-category');
  expect(category, `Expected the filtered row to be "love" but got "${category}"`).toBe('love');
});
