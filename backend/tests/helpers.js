const mongoose = require('mongoose')
const { createApp } = require('../src/app')

/** Boot the app in-process on an ephemeral port with the memory session store. */
async function startTestServer(opts = {}) {
  const app = createApp({ sessionStore: 'memory', ...opts })
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s))
  })
  const { port } = server.address()
  return {
    server,
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  }
}

async function connectTestDb() {
  const uri = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/terravault_test'
  await mongoose.connect(uri)
}

async function dropTestDb() {
  await mongoose.connection.dropDatabase()
}

async function disconnectTestDb() {
  await mongoose.disconnect()
}

/**
 * Cookie-aware fetch helper. Returns { status, data, cookie, raw }.
 * `cookie` is the first Set-Cookie value (e.g. connect.sid=...) when present.
 */
async function api(baseUrl, route, { method = 'GET', body, cookie } = {}) {
  const res = await fetch(baseUrl + route, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  const setCookie = res.headers.get('set-cookie')
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  return {
    status: res.status,
    data,
    cookie: setCookie ? setCookie.split(';')[0] : undefined,
    raw: text,
  }
}

module.exports = {
  startTestServer,
  connectTestDb,
  dropTestDb,
  disconnectTestDb,
  api,
}
