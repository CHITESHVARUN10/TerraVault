const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('./config/passport')
const authRoutes = require('./routes/auth.routes')
const propertyRoutes = require('./routes/property.routes')
const driveRoutes = require('./routes/drive.routes')
const { notFound, errorHandler } = require('./middleware/error')

/**
 * Build the Express app. Kept separate from index.js so tests can boot it
 * in-process without binding a port.
 *
 * Options:
 * - sessionStore: 'memory' | 'mongo' (defaults to env SESSION_STORE, or memory)
 * - secret: session secret override
 */
function createApp(opts = {}) {
  const app = express()

  app.set('trust proxy', 1)

  app.use(express.json())

  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    }),
  )

  const useMemory =
    (opts.sessionStore || process.env.SESSION_STORE || 'memory') === 'memory'
  const store = useMemory
    ? new session.MemoryStore()
    : MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: mongoose.connection.name,
        autoRemove: 'native',
        ttl: 60 * 60 * 24 * 7, // 7 days
      })

  const sessionSecret = opts.secret || process.env.SESSION_SECRET || 'dev-secret-change-me'
  app.locals.sessionSecret = sessionSecret

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }),
  )

  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'terravault-backend' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/properties', propertyRoutes)
  app.use('/api/drive', driveRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = { createApp }
