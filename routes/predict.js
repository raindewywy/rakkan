const express = require('express');
const requireLogin = require('../middleware/requireLogin');
const predictController = require('../controllers/predictController');

const router = express.Router();

router.get('/predict', requireLogin, predictController.showForm);

module.exports = router;
