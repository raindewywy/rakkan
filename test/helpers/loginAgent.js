const request = require('supertest');

/**
 * Logs in through the test-only /auth/test-login route and returns an agent that keeps the session.
 * The route exists only when NODE_ENV=test or E2E=1 (Jest sets NODE_ENV=test).
 * @param {object} app - The Express app.
 * @param {{name?: string, email?: string}} [who] - Name and email of the fake user.
 * @returns {Promise<{agent: object, userId: string}>} The agent and the id of the logged in user.
 */
async function loginAgent(app, { name = 'Test User', email = 'tester@example.com' } = {}) {
  const agent = request.agent(app);
  await agent.post('/auth/test-login').type('form').send({ name, email }).expect(302);
  return { agent, userId: `test-${email}` };
}

module.exports = { loginAgent };
