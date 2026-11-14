/**
 * Lets the request continue only when the user is logged in.
 * @param {object} req - Express request.
 * @param {object} res - Express response.
 * @param {Function} next - Next middleware.
 */
function requireLogin(req, res, next) {
  if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('Please log in first');
}

module.exports = requireLogin;
