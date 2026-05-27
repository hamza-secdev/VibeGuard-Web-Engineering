/**
 * Wrap async route handlers so we don't need try/catch in every controller.
 * Any thrown error will be forwarded to Express error middleware via next(err).
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler
