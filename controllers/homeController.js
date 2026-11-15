const { sharedUsers } = require('../models/User');
const { sharedHistory } = require('../models/PredictionHistory');

/**
 * GET / - landing page with the Google login button.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 */
function index(req, res) {
  let stats = null;
  if (req.user) {
    stats = {
      total: sharedUsers.getTotalReadings(req.user.id, sharedHistory),
      firstDate: sharedUsers.getFirstReadingDate(req.user.id, sharedHistory)
    };
  }
  res.render('home', { title: 'Home', styles: ['/css/home.css'], stats });
}

module.exports = { index };
