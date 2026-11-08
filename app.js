const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { configurePassport } = require('./config/passport');
const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test' || process.env.E2E === '1',
  sessionSecret: process.env.SESSION_SECRET || 'dev-only-secret',
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  }
};

/**
 * The Express application. It is exported (not started here) so that
 * server.js can listen on a port and Jest/supertest can import it.
 */
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: env.sessionSecret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.locals.googleEnabled = configurePassport(passport, env);
app.locals.testLoginEnabled = env.isTest;

// Values every view can use: the logged in user, the language and a tr(th, en) helper.
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.lang = (req.session && req.session.lang) || 'th';
  res.locals.tr = (th, en) => (res.locals.lang === 'th' ? th : en);
  next();
});

// Every file in routes/ exports an express.Router and is mounted automatically.
const routesDir = path.join(__dirname, 'routes');
fs.readdirSync(routesDir)
  .filter((file) => file.endsWith('.js'))
  .sort()
  .forEach((file) => app.use(require(path.join(routesDir, file))));


module.exports = app;
