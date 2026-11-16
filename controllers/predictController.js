const env = require('../config/env');
const { Prediction, CATEGORIES, CATEGORY_INFO } = require('../models/Prediction');
const { validateBirthDate } = require('../services/birthDateValidator');
const { createPredictor } = require('../services/predictor');
const { createHoroscopeClient } = require('../services/horoscopeClient');

const predictor = createPredictor({
  client: createHoroscopeClient({ baseUrl: env.horoscopeApiUrl }),
  onFallback: (sign, err) => console.warn(`Horoscope API failed for ${sign}, using local readings: ${err.message}`)
});

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

/**
 * POST /predict - validates the form, then makes the reading.
 */
async function submit(req, res, next) {
  try {
    const values = {
      category: String(req.body.category || ''),
      day: String(req.body.day || ''),
      month: String(req.body.month || ''),
      year: String(req.body.year || '')
    };
    const errors = [];
    if (!Prediction.isValidCategory(values.category)) {
      errors.push(res.locals.tr('กรุณาเลือกหมวดที่ต้องการดูดวง', 'Please choose a category.'));
    }
    const check = validateBirthDate(values, new Date(), res.locals.lang);
    if (!check.valid) {
      errors.push(check.message);
    }
    if (errors.length > 0) {
      return res.status(400).render('predict', formModel({ errors, values }));
    }

    const predicted = await predictor.predictAll(check.date, res.locals.lang);
    return res.render('result', {
      title: 'Result',
      styles: ['/css/predict.css'],
      categoryInfo: CATEGORY_INFO,
      visible: [values.category],
      results: predicted.results,
      sign: predicted.sign,
      source: predicted.source,
      birthDate: check.date
    });
  } catch (err) {
    return next(err);
  }
}


module.exports = { showForm, submit };
