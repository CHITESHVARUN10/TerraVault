const bcrypt = require('bcryptjs')
const User = require('../models/User')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Public profile shape sent to the client (matches frontend UserProfile). */
function toProfile(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    initials: user.initials,
    joinedAt: user.joinedAt,
    plan: user.plan,
  }
}

/** Validate + create a new account. Password bcrypt-hashed with 12 rounds. */
async function registerUser(input = {}) {
  const name = String(input.name ?? '').trim()
  const email = String(input.email ?? '').trim().toLowerCase()
  const password = String(input.password ?? '')

  if (!name) return { ok: false, status: 400, error: 'Please enter your full name.' }
  if (!EMAIL_RE.test(email))
    return { ok: false, status: 400, error: 'Please enter a valid email address.' }
  if (password.length < 6)
    return { ok: false, status: 400, error: 'Password must be at least 6 characters.' }

  const existing = await User.findOne({ email })
  if (existing)
    return { ok: false, status: 409, error: 'An account with this email already exists.' }

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const user = await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    initials,
  })

  return { ok: true, user }
}

module.exports = { registerUser, toProfile }
