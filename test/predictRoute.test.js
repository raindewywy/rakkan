// Keep the tests offline: no horoscope API, only the local readings.
process.env.HOROSCOPE_API_URL = '';
process.env.GOOGLE_CLIENT_ID = '';
process.env.GOOGLE_CLIENT_SECRET = '';

const request = require('supertest');
const app = require('../app');
const { sharedHistory } = require('../models/PredictionHistory');
const { loginAgent } = require('./helpers/loginAgent');

beforeEach(() => sharedHistory.clear());

describe('GET /predict', () => {
  test('sends guests back to the home page', async () => {
    const res = await request(app).get('/predict');

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/');
  });

  test('shows the five category cards to a logged in user', async () => {
    const { agent } = await loginAgent(app);

    const res = await agent.get('/predict');

    expect(res.statusCode).toBe(200);
    expect(res.text.match(/name="category"/g)).toHaveLength(5);
  });
});

describe('POST /predict', () => {
  test('shows an error and saves nothing when the form is empty', async () => {
    const { agent, userId } = await loginAgent(app);

    const res = await agent.post('/predict').type('form').send({});

    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('error-list');
    expect(sharedHistory.getAll(userId)).toHaveLength(0);
  });

  test('rejects a birth date in the future', async () => {
    const { agent, userId } = await loginAgent(app);

    const res = await agent.post('/predict').type('form').send({ category: 'love', day: '1', month: '1', year: '2999' });

    expect(res.statusCode).toBe(400);
    expect(sharedHistory.getAll(userId)).toHaveLength(0);
  });

  test('saves the reading and shows only the chosen category', async () => {
    const { agent, userId } = await loginAgent(app);

    const post = await agent.post('/predict').type('form').send({ category: 'finance', day: '17', month: '5', year: '1999' });

    expect(post.statusCode).toBe(303);
    expect(post.headers.location).toMatch(/^\/result\//);
    expect(sharedHistory.getAll(userId)).toHaveLength(1);

    const result = await agent.get(post.headers.location);

    expect(result.statusCode).toBe(200);
    expect(result.text).toContain('data-category="finance"');
    expect(result.text).not.toContain('data-category="love"');
    expect(result.text.match(/class="result-card"/g)).toHaveLength(1);
  });

  test('does not show a reading of another user', async () => {
    const owner = await loginAgent(app, { email: 'owner@example.com' });
    const other = await loginAgent(app, { email: 'other@example.com' });
    const post = await owner.agent.post('/predict').type('form').send({ category: 'life', day: '3', month: '3', year: '2000' });

    const res = await other.agent.get(post.headers.location);

    expect(res.statusCode).toBe(404);
  });
});
