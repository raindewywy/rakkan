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

// Unknown URLs and unexpected errors get a friendly page instead of a raw stack trace.
app.use((req, res) => {
  const tr = res.locals.tr || ((th, en) => en);
  res.status(404).render('error', { title: 'Not found', code: 404, message: tr('ไม่พบหน้าที่ต้องการ', 'Page not found') });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const tr = res.locals.tr || ((th, en) => en);
  res.status(500).render('error', {
    title: 'Error',
    code: 500,
    message: tr('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์', 'Something went wrong on the server')
  });
});

module.exports = app;
