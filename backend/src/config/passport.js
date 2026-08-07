const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

// Passport local strategy: verify email + password against the DB.
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.trim().toLowerCase() })
        if (!user) return done(null, false, { message: 'No account found for this email.' })
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return done(null, false, { message: 'Incorrect password. Please try again.' })
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    },
  ),
)

// Serialize the user id into the session.
passport.serializeUser((user, done) => done(null, user.id))

// Deserialize the user from the session on every request.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user ?? false)
  } catch (err) {
    done(err)
  }
})

module.exports = passport
