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

  test('redirects a guest to the home page', async () => {
    seed('test-someone-else@example.com', 'Private reading', 4);

    const res = await request(app).get('/history').expect(302).expect('Location', '/');

    expect(res.text).not.toContain('Private reading');
  });

  test('never shows the readings of another user', async () => {
    const { agent, userId } = await loginAgent(app, { email: 'me@example.com' });
    const other = await loginAgent(app, { email: 'someone-else@example.com' });
    seed(userId, 'My reading', 2);
    seed(other.userId, 'Private reading', 4);

    const res = await agent.get('/history').expect(200);

    expect(res.text).toContain('My reading');
    expect(res.text).not.toContain('Private reading');
    expect(res.text.match(/<tr data-category=/g)).toHaveLength(1);

    const searched = await agent.get('/history').query({ q: 'private' }).expect(200);

    expect(searched.text).not.toContain('Private reading');
    expect(searched.text.match(/<tr data-category=/g) || []).toHaveLength(0);

    const otherRes = await other.agent.get('/history').expect(200);

    expect(otherRes.text).toContain('Private reading');
    expect(otherRes.text).not.toContain('My reading');
    expect(otherRes.text.match(/<tr data-category=/g)).toHaveLength(1);
  });

  test('lists the readings newest first with one table row each', async () => {
    const { agent, userId } = await loginAgent(app);
    seed(userId, 'Oldest reading', 1);
    seed(userId, 'Newest reading', 9);
    seed(userId, 'Middle reading', 5);

    const res = await agent.get('/history').expect(200);

    const tbody = res.text.match(/<tbody>([\s\S]*?)<\/tbody>/);
    expect(tbody).not.toBeNull();
    expect(tbody[1].match(/<tr\b/g)).toHaveLength(3);

    const newest = tbody[1].indexOf('Newest reading');
    const middle = tbody[1].indexOf('Middle reading');
    const oldest = tbody[1].indexOf('Oldest reading');
    expect(newest).toBeGreaterThanOrEqual(0);
    expect(middle).toBeGreaterThanOrEqual(0);
    expect(oldest).toBeGreaterThanOrEqual(0);
    expect(newest).toBeLessThan(middle);
    expect(middle).toBeLessThan(oldest);
  });
});
