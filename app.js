const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { configurePassport } = require('./config/passport');
const env = require('./config/env');
const { createSessionOptions } = require('./config/session');

/**
 * The Express application. It is exported (not started here) so that
 * server.js can listen on a port and Jest/supertest can import it.
 */
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
if (env.isProduction) {
  app.set('trust proxy', 1);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session(createSessionOptions(env)));
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
