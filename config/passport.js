const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

/**
 * Converts a Google profile into the small object we keep in the session.
 * @param {object} profile - Profile returned by Google.
 * @returns {{id: string, displayName: string, email: string, photo: string}}
 */
function profileToUser(profile) {
  return {
    id: profile.id,
    displayName: profile.displayName,
    email: (profile.emails && profile.emails[0] && profile.emails[0].value) || '',
    photo: (profile.photos && profile.photos[0] && profile.photos[0].value) || ''
  };
}

/**
 * Registers the Google OAuth 2.0 strategy and the session (de)serializers.
 * @param {object} passport - The passport singleton.
 * @param {object} env - Settings with `google.clientID`, `google.clientSecret`, `google.callbackURL`.
 * @returns {boolean} true when Google login is configured, false when credentials are missing.
 */
function configurePassport(passport, env) {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((stored, done) => done(null, stored));

  const { clientID, clientSecret, callbackURL } = env.google;
  if (!clientID || !clientSecret) {
    return false;
  }

  passport.use(
    new GoogleStrategy({ clientID, clientSecret, callbackURL }, (accessToken, refreshToken, profile, done) => {
      done(null, profileToUser(profile));
    })
  );
  return true;
}

module.exports = { configurePassport };
