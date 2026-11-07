/** The five fortune categories the user can choose from. */
const CATEGORIES = ['love', 'career', 'finance', 'education', 'life'];

/** Icon and bilingual label for each category (used by the views). */
const CATEGORY_INFO = {
  love: { icon: '♡', th: 'ความรัก', en: 'Love' },
  career: { icon: '◈', th: 'การงาน', en: 'Career' },
  finance: { icon: '◉', th: 'การเงิน', en: 'Finance' },
  education: { icon: '✧', th: 'การเรียน', en: 'Education' },
  life: { icon: '☉', th: 'ภาพรวมชีวิต', en: 'Life overview' }
};

/**
 * One saved reading.
 * @typedef {object} PredictionResult
 * @property {'high'|'medium'|'low'} level - Level badge shown on the result card.
 * @property {string} headline - Short title.
 * @property {string} description - Main text.
 * @property {Array<{title: string, text: string, score: number}>} details - Three detail cards.
 * @property {string} advice - Advice card text.
 */

/**
 * A prediction made by a user for one category.
 * @class
 */
class Prediction {
  /**
   * @param {string} id - Unique id of the reading.
   * @param {string} userId - Id of the user who owns the reading.
   * @param {string} category - One of CATEGORIES.
   * @param {string} birthDate - Birth date as YYYY-MM-DD.
   * @param {PredictionResult} result - The reading text.
   * @param {Date} [createdAt=new Date()] - When the reading was made.
   * @throws {RangeError} When the category is not one of CATEGORIES.
   */
  constructor(id, userId, category, birthDate, result, createdAt = new Date()) {
    if (!Prediction.isValidCategory(category)) {
      throw new RangeError(`Unknown category: ${category}`);
    }
    this.id = id;
    this.userId = userId;
    this.category = category;
    this.birthDate = birthDate;
    this.result = result;
    this.createdAt = createdAt;
  }

  /**
   * Checks whether a value is one of the five categories.
   * @param {string} category - Value to check.
   * @returns {boolean} true when valid.
   */
  static isValidCategory(category) {
    return CATEGORIES.includes(category);
  }


}

module.exports = { Prediction, CATEGORIES, CATEGORY_INFO };
