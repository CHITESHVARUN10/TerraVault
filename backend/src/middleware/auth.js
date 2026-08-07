/** Guard for authenticated routes — 401 when there is no session. */
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ error: 'Not authenticated' })
}

module.exports = { requireAuth }
