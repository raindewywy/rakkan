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

  test('?q= keeps only the readings that match the keyword', async () => {
    const { agent, userId } = await loginAgent(app);
    seed(userId, 'Sunrise of hope', 2);
    seed(userId, 'Save more money', 3, 'finance');

    const res = await agent.get('/history').query({ q: '  sUnRiSe  ' }).expect(200);

    expect(res.text).toContain('Sunrise of hope');
    expect(res.text).not.toContain('Save more money');
    expect(res.text.match(/<tr data-category=/g)).toHaveLength(1);

    const unfiltered = await agent.get('/history').query({ q: '   ' }).expect(200);

    expect(unfiltered.text.match(/<tr data-category=/g)).toHaveLength(2);
  });

  test('?q= with no match shows the no-results state and a reset link', async () => {
    const { agent, userId } = await loginAgent(app);
    seed(userId, 'Sunrise of hope', 2);

    const res = await agent.get('/history').query({ q: 'zodiac', category: 'love' }).expect(200);

    expect(res.text).toContain('class="empty');
    expect(res.text).toContain('ไม่พบประวัติที่ตรงกับ “zodiac”');
    expect(res.text).toContain('href="/history?category=love"');
    expect(res.text).not.toContain('ยังไม่มีประวัติการดูดวง');
    expect(res.text).not.toContain('Sunrise of hope');
    expect(res.text.match(/<tr data-category=/g) || []).toHaveLength(0);
  });
});
