/**
 * Logs the browser in through the test-only route (Google blocks bots).
 * Every call uses a new email, so each test has its own empty history.
 * @param {import('@playwright/test').Page} page - The Playwright page.
 * @param {string} [name='Playwright User'] - Name shown in the header.
 * @returns {Promise<string>} The email that was used.
 */
async function login(page, name = 'Playwright User') {
  const email = `pw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  await page.request.post('/auth/test-login', { form: { name, email } });
  return email;
}

/**
 * Fills the predict form and waits for the result page.
 * @param {import('@playwright/test').Page} page - The Playwright page.
 * @param {string} category - love, career, finance, education or life.
 */
async function makeReading(page, category) {
  await page.goto('/predict');
  await page.locator('label.category-card', { has: page.locator(`input[value="${category}"]`) }).click();
  await page.fill('input[name="day"]', '17');
  await page.fill('input[name="month"]', '5');
  await page.fill('input[name="year"]', '1999');
  await page.click('#predict-form button[type="submit"]');
  await page.waitForURL(/\/result\//);
}

module.exports = { login, makeReading };
