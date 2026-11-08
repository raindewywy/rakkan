const express = require('express');
const passport = require('passport');

const router = express.Router();

/**
 * Stops the request with 503 when Google credentials are missing from .env.
 */
function requireGoogleConfigured(req, res, next) {
  if (req.app.locals.googleEnabled) {
    return next();
  }
  return res
    .status(503)
    .send('Google login is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
}

router.get(
  '/auth/google',
  requireGoogleConfigured,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  requireGoogleConfigured,
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

/**
 * Test-only login used by Jest and Playwright (Google blocks bots).
 * It is disabled unless NODE_ENV=test or E2E=1, and never in production.
 */
router.post('/auth/test-login', (req, res, next) => {
  if (!req.app.locals.testLoginEnabled) {
    return res.status(404).send('Not found');
  }
  const name = String(req.body.name || 'Test User');
  const email = String(req.body.email || 'tester@example.com');
  const user = { id: `test-${email}`, displayName: name, email, photo: '' };
  return req.login(user, (err) => (err ? next(err) : res.redirect('/')));
});


module.exports = router;
