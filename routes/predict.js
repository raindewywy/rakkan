const express = require('express');
const requireLogin = require('../middleware/requireLogin');
const predictController = require('../controllers/predictController');

const router = express.Router();

router.get('/predict', requireLogin, predictController.showForm);
router.post('/predict', requireLogin, predictController.submit);
router.get('/result/:id', requireLogin, predictController.showResult);

module.exports = router;
