process.env.GOOGLE_CLIENT_ID = '';
process.env.GOOGLE_CLIENT_SECRET = '';

const request = require('supertest');
const app = require('../app');
const { sharedHistory } = require('../models/PredictionHistory');
const { loginAgent } = require('./helpers/loginAgent');
const { makePrediction } = require('./helpers/factories');

/** Puts a reading with the given headline in the history of a user. */
function seed(userId, headline, day, category = 'love') {
  const entry = makePrediction({ userId, category, createdAt: new Date(2026, 10, day) });
  entry.result.headline = headline;
  sharedHistory.add(entry);
  return entry;
}

beforeEach(() => sharedHistory.clear());
afterEach(() => sharedHistory.clear());

describe('GET /history', () => {
  test('returns 200 for a logged in user', async () => {
    const { agent } = await loginAgent(app);

    const res = await agent.get('/history').expect(200);

    expect(res.text).toContain('ประวัติการดูดวง');
  });
});
