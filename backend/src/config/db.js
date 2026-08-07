const mongoose = require('mongoose')

/** Connect to MongoDB, log lifecycle events. */
async function connectDb(uri) {
  mongoose.connection.on('connected', () => console.log('[db] connected to MongoDB'))
  mongoose.connection.on('error', (err) => console.error('[db] connection error:', err.message))
  mongoose.connection.on('disconnected', () => console.warn('[db] disconnected'))
  await mongoose.connect(uri)
}

async function disconnectDb() {
  await mongoose.disconnect()
}

module.exports = { connectDb, disconnectDb }
