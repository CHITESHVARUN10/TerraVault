/** 404 for unmatched routes. */
function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
}

/** Centralized error handler — logs, never leaks internals. */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)
  console.error('[error]', err)
  res.status(500).json({ error: 'Internal server error' })
}

module.exports = { notFound, errorHandler }
