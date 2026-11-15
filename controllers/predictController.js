const env = require('../config/env');
const { Prediction, CATEGORIES, CATEGORY_INFO } = require('../models/Prediction');


/**
 * Data every render of the predict form needs.
 * @param {object} [extra] - Values that replace the defaults.
 * @returns {object} View model.
 */
function formModel(extra = {}) {
  return Object.assign(
    {
      title: 'Predict',
      styles: ['/css/predict.css'],
      scripts: ['/js/birthdate.js'],
      categories: CATEGORIES,
      categoryInfo: CATEGORY_INFO,
      // The "processing" animation is skipped in tests so UI tests stay fast.
      processingMs: env.isTest ? 0 : 2400,
      errors: [],
      values: { category: '', day: '', month: '', year: '' }
    },
    extra
  );
}

/**
 * GET /predict - category cards and the birth date form.
 */
function showForm(req, res) {
  res.render('predict', formModel());
}



module.exports = { showForm };
