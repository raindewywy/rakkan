
/**
 * The reading history of all users, kept in memory (same pattern as the course scaffolds).
 * Each user only ever sees their own readings.
 * @class
 */
class PredictionHistory {
  constructor() {
    this.byUser = new Map();
  }

  /**
   * Saves a reading into the history of its owner.
   * @param {{userId: string}} prediction - A Prediction (needs userId, id, category, result, createdAt).
   * @returns {object} The saved prediction.
   * @throws {TypeError} When the prediction has no userId.
   */
  add(prediction) {
    if (!prediction || !prediction.userId) {
      throw new TypeError('a prediction with a userId is required');
    }
    if (!this.byUser.has(prediction.userId)) {
      this.byUser.set(prediction.userId, []);
    }
    this.byUser.get(prediction.userId).push(prediction);
    return prediction;
  }

  /**
   * Returns the readings of one user in the order they were added.
   * @param {string} userId - Owner of the readings.
   * @returns {Array} A new array (changing it does not change the history).
   */
  getAll(userId) {
    return [...(this.byUser.get(userId) || [])];
  }

  /**
   * Finds one reading of a user by id.
   * @param {string} userId - Owner of the reading.
   * @param {string} id - Reading id.
   * @returns {object|null} The reading, or null when the user has no reading with that id.
   */
  getById(userId, id) {
    return this.getAll(userId).find((entry) => entry.id === id) || null;
  }

  /**
   * Removes every reading of every user (used by tests).
   */
  clear() {
    this.byUser.clear();
  }

  // ----- sorting (ticket 14) -----
  /**
   * Returns a user's readings sorted by date.
   * @param {string} userId - Owner of the readings.
   * @param {'desc'|'asc'} [order='desc'] - 'desc' = newest first (default), 'asc' = oldest first.
   * @returns {Array} A new sorted array; an empty array when the user has no readings.
   */
  sortByDate(userId, order = 'desc') {
    const entries = this.getAll(userId);
    if (entries.length === 0) {
      return [];
    }
    const direction = order === 'asc' ? 1 : -1;
    return entries.sort((a, b) => direction * (a.createdAt - b.createdAt));
  }

  // ----- search (ticket 16) -----

  // ----- filter by category (ticket 19) -----

  // ----- remove (ticket 20) -----

  // ----- statistics (ticket 21) -----
}

/** The single history shared by the whole app. */
const sharedHistory = new PredictionHistory();

module.exports = { PredictionHistory, sharedHistory };
