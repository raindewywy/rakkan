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
    this.id = id;
    this.userId = userId;
    this.category = category;
    this.birthDate = birthDate;
    this.result = result;
    this.createdAt = createdAt;
  }



}

module.exports = { Prediction };
