const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { sharedUsers } = require('../models/User');


/**
 * Registers the Google OAuth 2.0 strategy and the session (de)serializers.
 * @param {object} passport - The passport singleton.
 * @param {object} env - Settings with `google.clientID`, `google.clientSecret`, `google.callbackURL`.
 * @returns {boolean} true when Google login is configured, false when credentials are missing.
 */
function configurePassport(passport, env) {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, sharedUsers.findById(id) || false));

  const { clientID, clientSecret, callbackURL } = env.google;
  if (!clientID || !clientSecret) {
    return false;
  }

  passport.use(
    new GoogleStrategy({ clientID, clientSecret, callbackURL }, (accessToken, refreshToken, profile, done) => {
      done(null, sharedUsers.findOrCreate(profile));
    })
  );
  return true;
}

module.exports = { configurePassport };
