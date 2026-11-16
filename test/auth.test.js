// Make sure the Google credentials of a developer's .env do not change these tests.
process.env.GOOGLE_CLIENT_ID = '';
process.env.GOOGLE_CLIENT_SECRET = '';

const express = require('express');
const request = require('supertest');
const requireLogin = require('../middleware/requireLogin');
const app = require('../app');
const { loginAgent } = require('./helpers/loginAgent');

describe('requireLogin', () => {
  test('redirects guests to the home page', async () => {
    const mini = express();
    mini.get('/secret', requireLogin, (req, res) => res.send('secret'));

    const res = await request(mini).get('/secret');

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/');
  });

  test('lets logged in users through', async () => {
    const mini = express();
    mini.use((req, res, next) => {
      req.isAuthenticated = () => true;
      next();
    });
    mini.get('/secret', requireLogin, (req, res) => res.send('secret'));

    const res = await request(mini).get('/secret');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('secret');
  });
});

describe('auth routes', () => {
  test('GET /auth/google answers 503 when Google credentials are not configured', async () => {
    const res = await request(app).get('/auth/google');

    expect(res.statusCode).toBe(503);
    expect(res.text).toContain('GOOGLE_CLIENT_ID');
  });

  test('POST /auth/test-login starts a session', async () => {
    const res = await request(app).post('/auth/test-login').type('form').send({ name: 'Luna', email: 'luna@example.com' });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/');
    expect(res.headers['set-cookie'].join(';')).toContain('astra.sid');
  });

  test('POST /logout ends the session and goes back to the home page', async () => {
    const { agent } = await loginAgent(app);

    const res = await agent.post('/logout');

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/');
    expect(res.headers['set-cookie'].join(';')).toMatch(/astra\.sid=;/);
  });
});
