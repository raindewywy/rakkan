process.env.GOOGLE_CLIENT_ID = '';
process.env.GOOGLE_CLIENT_SECRET = '';

const request = require('supertest');
const app = require('../app');
const { sharedHistory } = require('../models/PredictionHistory');
const { loginAgent } = require('./helpers/loginAgent');
const { makePrediction } = require('./helpers/factories');

beforeEach(() => sharedHistory.clear());

describe('POST /history/:id/delete', () => {
  test('deletes the reading of the logged in user and goes back to the history', async () => {
    const { agent, userId } = await loginAgent(app);
    const entry = sharedHistory.add(makePrediction({ userId }));

    const res = await agent.post(`/history/${entry.id}/delete`);

    expect(res.statusCode).toBe(303);
    expect(res.headers.location).toBe('/history');
    expect(sharedHistory.getAll(userId)).toHaveLength(0);
  });

  test('answers 404 and keeps the reading of another user', async () => {
    const { agent } = await loginAgent(app, { email: 'me@example.com' });
    const entry = sharedHistory.add(makePrediction({ userId: 'test-other@example.com' }));

    const res = await agent.post(`/history/${entry.id}/delete`);

    expect(res.statusCode).toBe(404);
    expect(sharedHistory.getAll('test-other@example.com')).toHaveLength(1);
  });

  test('sends a guest back to the home page', async () => {
    const entry = sharedHistory.add(makePrediction({ userId: 'u1' }));

    const res = await request(app).post(`/history/${entry.id}/delete`);

    expect(res.statusCode).toBe(302);
    expect(sharedHistory.getAll('u1')).toHaveLength(1);
  });
});
