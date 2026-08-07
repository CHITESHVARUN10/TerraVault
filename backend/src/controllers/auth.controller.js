const signature = require('cookie-signature')
const cookieLib = require('cookie')
const passport = require('../config/passport')
const { registerUser, toProfile } = require('../services/auth.service')

/**
 * Build the signed connect.sid cookie header explicitly. express-session
 * normally emits Set-Cookie on the response "finish" event, but that
 * emission can be lost with certain middleware stacks, so after an explicit
 * save we set the header ourselves. The value must be signed exactly like
 * express-session does ("s:<id>.<hmac>") or the session won't be restored
 * on the next request.
 */
function sessionCookieHeader(req) {
  const c = req.session.cookie
  const secret = req.app.locals.sessionSecret
  const signed = `s:${signature.sign(req.session.id, secret)}`
  const serialized = cookieLib.serialize('connect.sid', signed, {
    path: c.path,
    httpOnly: c.httpOnly,
    sameSite: c.sameSite,
    secure: c.secure,
    expires: c.expires,
    maxAge: c.maxAge,
  })
  return serialized
}

/**
 * POST /api/auth/register
 * Create the account and establish a session (req.login), then flush the
 * session and set the cookie explicitly before responding.
 */
async function register(req, res, next) {
  try {
    const result = await registerUser(req.body)
    if (!result.ok) {
      res.status(result.status).json({ error: result.error })
      return
    }
    req.login(result.user, (err) => {
      if (err) return next(err)
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr)
        res.setHeader('Set-Cookie', sessionCookieHeader(req, req.session.cookie.secret))
        res.status(201).json({ user: toProfile(result.user) })
      })
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 * Passport local strategy verifies credentials, then establishes a session.
 */
function login(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      res.status(401).json({ error: info?.message ?? 'Invalid credentials.' })
      return
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr)
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr)
        res.setHeader('Set-Cookie', sessionCookieHeader(req, req.session.cookie.secret))
        res.json({ user: toProfile(user) })
      })
    })
  })(req, res, next)
}

/** POST /api/auth/logout — destroy the server-side session, clear the cookie. */
function logout(req, res) {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.json({ ok: true })
    })
  })
}

/** GET /api/auth/me — profile of the current session user (requireAuth applied). */
function me(req, res) {
  res.json({ user: toProfile(req.user) })
}

module.exports = { register, login, logout, me }
