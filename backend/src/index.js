const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { createApp } = require('./app')
const { connectDb } = require('./config/db')

const PORT = Number(process.env.PORT || 4000)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/terravault'

async function main() {
  await connectDb(MONGODB_URI)
  const app = createApp()
  app.listen(PORT, () => {
    console.log(`[server] TerraVault backend listening on http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error('[server] failed to start:', err)
  process.exit(1)
})
