/**
 * Loads the .env file and exposes typed settings for the whole app.
 * Secrets are read from environment variables only and are never hard-coded.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const isProduction = process.env.NODE_ENV === 'production';
// The test-login shortcut exists only for Jest/Playwright and never in production.
const isTest = !isProduction && (process.env.NODE_ENV === 'test' || process.env.E2E === '1');

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set when NODE_ENV=production');
}

module.exports = {
  isProduction,
  isTest,
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  sessionSecret: process.env.SESSION_SECRET || 'dev-only-secret',
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  },
  horoscopeApiUrl: process.env.HOROSCOPE_API_URL || ''
};
