/**
 * Builds the express-session options.
 * @param {object} env - Settings from config/env.js.
 * @returns {object} Options for `session()`.
 */
function createSessionOptions(env) {
  return {
    name: 'astra.sid',
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.cookieSecure,
      maxAge: 24 * 60 * 60 * 1000
    }
  };
}

module.exports = { createSessionOptions };
