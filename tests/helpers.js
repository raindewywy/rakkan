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


module.exports = { login };
