
/**
 * GET / - landing page with the Google login button.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 */
function index(req, res) {
  let stats = null;
  res.render('home', { title: 'Home', styles: ['/css/home.css'], stats });
}

module.exports = { index };
