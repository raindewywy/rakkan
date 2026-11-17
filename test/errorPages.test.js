process.env.GOOGLE_CLIENT_ID = '';
process.env.GOOGLE_CLIENT_SECRET = '';

const request = require('supertest');
const app = require('../app');

describe('error pages', () => {
  test('an unknown URL answers 404 with a friendly page', async () => {
    const res = await request(app).get('/this-page-does-not-exist');

    expect(res.statusCode).toBe(404);
    expect(res.text).toContain('<h1>404</h1>');
  });
});
