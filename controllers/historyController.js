const { CATEGORIES, CATEGORY_INFO } = require('../models/Prediction');
const { sharedHistory } = require('../models/PredictionHistory');

/**
 * GET /history - the logged in user's readings, newest first.
 * Optional query: q (search keyword) and category (filter).
 */
function list(req, res) {
  const userId = req.user.id;
  const q = String(req.query.q || '').trim();
  const category = String(req.query.category || '');
  let items = sharedHistory.sortByDate(userId);

  // ----- search (ticket 16) -----
  if (q) {
    const matches = new Set(sharedHistory.search(userId, q));
    items = items.filter((entry) => matches.has(entry));
  }

  // ----- filter by category (ticket 19) -----
  if (category) {
    const inCategory = new Set(sharedHistory.filterByCategory(userId, category));
    items = items.filter((entry) => inCategory.has(entry));
  }

  res.render('history', {
    title: 'History',
    styles: ['/css/history.css'],
    items,
    q,
    category,
    categories: CATEGORIES,
    categoryInfo: CATEGORY_INFO
  });
}

// ----- remove (ticket 20) -----
/**
 * POST /history/:id/delete - deletes one of the user's own readings.
 */
function remove(req, res) {
  if (!sharedHistory.remove(req.user.id, req.params.id)) {
    return res.status(404).send('Reading not found');
  }
  return res.redirect(303, '/history');
}

module.exports = { list, remove };
