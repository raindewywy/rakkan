
/**
 * The reading history of all users, kept in memory (same pattern as the course scaffolds).
 * Each user only ever sees their own readings.
 * @class
 */
class PredictionHistory {
  constructor() {
    this.entries = [];
  }



  // ----- sorting (ticket 14) -----

  // ----- search (ticket 16) -----

  // ----- filter by category (ticket 19) -----

  // ----- remove (ticket 20) -----

  // ----- statistics (ticket 21) -----
}

/** The single history shared by the whole app. */
const sharedHistory = new PredictionHistory();

module.exports = { PredictionHistory, sharedHistory };
