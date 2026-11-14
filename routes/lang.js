const express = require('express');

const router = express.Router();
const LANGUAGES = ['th', 'en'];

/**
 * Remembers the chosen language (th/en) in the session and goes back to the previous page.
 */
router.get('/lang/:code', (req, res) => {
  if (LANGUAGES.includes(req.params.code)) {
    req.session.lang = req.params.code;
  }
  let back = '/';
  try {
    const referer = new URL(req.get('Referer') || '');
    if (referer.host === req.get('Host')) {
      back = referer.pathname + referer.search;
    }
  } catch (err) {
    back = '/';
  }
  res.redirect(back);
});

module.exports = router;
