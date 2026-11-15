const { CATEGORIES, CATEGORY_INFO } = require('../models/Prediction');
const { getZodiac } = require('./zodiac');
const { LEVEL_ADVICE, hashText, buildDetails } = require('./readingData');

const LEVELS = ['high', 'medium', 'low'];

/**
 * Turns the single horoscope text of the API into one reading per category.
 * Sentence i of the text is used for category i, the level is picked from the text itself.
 * @param {string} sign - Zodiac sign, e.g. 'leo'.
 * @param {string} text - Horoscope text returned by the API.
 * @param {'th'|'en'} lang - Language of the labels.
 * @returns {object} Map of category to reading.
 */
function mapApiTextToCategories(sign, text, lang) {
  const language = lang === 'th' ? 'th' : 'en';
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const signName = sign.charAt(0).toUpperCase() + sign.slice(1);
  const results = {};
  CATEGORIES.forEach((category, index) => {
    const level = LEVELS[hashText(`${text}:${category}`) % LEVELS.length];
    results[category] = {
      level,
      headline: `${signName} · ${CATEGORY_INFO[category][language]}`,
      description: sentences[index % sentences.length],
      details: buildDetails(category, level, language),
      advice: LEVEL_ADVICE[level][language],
      source: 'api'
    };
  });
  return results;
}

/**
 * Creates the predictor. The horoscope client is injected so tests can mock it.
 * @param {object} options
 * @param {{isConfigured: function(): boolean, getDailyHoroscope: function(string): Promise<string>}} options.client
 * @param {function(string, Error): void} [options.onFallback] - Called when the API fails.
 * @returns {{predictAll: function(string, string): Promise<{sign: string, source: string, results: object}>}}
 */
function createPredictor({ client, onFallback = () => {} }) {
  return {
    /**
     * Builds a reading for all five categories from a birth date.
     * @param {string} birthDate - YYYY-MM-DD.
     * @param {'th'|'en'} [lang='en'] - Language of the text.
     * @returns {Promise<{sign: string, source: 'api'|'local', results: object}>}
     */
    async predictAll(birthDate, lang = 'en') {
      const sign = getZodiac(birthDate);
      const text = await client.getDailyHoroscope(sign);
      return { sign, source: 'api', results: mapApiTextToCategories(sign, text, lang) };
    }
  };
}

module.exports = { createPredictor, mapApiTextToCategories };
