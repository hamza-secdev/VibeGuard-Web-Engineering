/**
 * Global error handler.
 * Sends consistent JSON responses for any unhandled errors.
 */
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    // Only expose stack traces in development (safer for production)
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}

module.exports = errorMiddleware
