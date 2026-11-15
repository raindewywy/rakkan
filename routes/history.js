const express = require('express');
const requireLogin = require('../middleware/requireLogin');
const historyController = require('../controllers/historyController');

const router = express.Router();

router.get('/history', requireLogin, historyController.list);

// ----- delete (ticket 20) -----

module.exports = router;
