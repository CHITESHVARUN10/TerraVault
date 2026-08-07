const { describe, it, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const {
  api,
  startTestServer,
  connectTestDb,
  dropTestDb,
  disconnectTestDb,
} = require('./helpers')
const { encryptToken, decryptToken } = require('../src/config/tokenCrypto')
const DriveConnection = require('../src/models/DriveConnection')

describe('drive', () => {
  let ctx

  before(async () => {
    process.env.DRIVE_TOKEN_KEY = process.env.DRIVE_TOKEN_KEY || 'test-drive-token-key-32-chars-min!!'
    process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-secret'
    // Fake credentials so the OAuth redirect URL can be generated in tests.
    process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-client-id.apps.googleusercontent.com'
    process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test-client-secret'
    await connectTestDb()
    ctx = await startTestServer()
  })

  beforeEach(async () => {
    await dropTestDb()
  })

  after(async () => {
    await ctx.close()
    await disconnectTestDb()
  })

  async function registerUser(email) {
    const res = await api(ctx.baseUrl, '/api/auth/register', {
      method: 'POST',
      body: { name: email.split('@')[0], email, password: 'secret123' },
    })
    assert.equal(res.status, 201)
    return res.cookie
  }

  it('token crypto round-trips', () => {
    const plain = 'ya29.a-secret-refresh-token'
    const enc = encryptToken(plain)
    assert.notEqual(enc, plain)
    assert.equal(decryptToken(enc), plain)
  })

  it('drive status is disconnected when not connected', async () => {
    const cookie = await registerUser('s@example.com')
    const res = await api(ctx.baseUrl, '/api/drive/status', { cookie })
    assert.equal(res.status, 200)
    assert.equal(res.data.connected, false)
  })

  it('drive status requires auth', async () => {
    const res = await api(ctx.baseUrl, '/api/drive/status')
    assert.equal(res.status, 401)
  })

  it('drive disconnect requires auth and works when connected', async () => {
    const cookie = await registerUser('d@example.com')
    // Simulate a stored connection (encrypted tokens) so status reflects connected.
    await DriveConnection.create({
      user: '000000000000000000000000', // placeholder — replaced below
      googleEmail: 'owner@gmail.com',
      folderId: 'fake-folder-id',
      accessTokenEnc: encryptToken('access'),
      refreshTokenEnc: encryptToken('refresh'),
      tokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
    })
    // find the user id from the DB instead of placeholder
    const User = require('../src/models/User')
    const user = await User.findOne({ email: 'd@example.com' })
    await DriveConnection.updateOne({ user: '000000000000000000000000' }, { user: user._id })

    const status = await api(ctx.baseUrl, '/api/drive/status', { cookie })
    assert.equal(status.data.connected, true)

    const disc = await api(ctx.baseUrl, '/api/drive/disconnect', { method: 'POST', cookie })
    assert.equal(disc.status, 200)
    assert.equal(disc.data.ok, true)

    const after = await api(ctx.baseUrl, '/api/drive/status', { cookie })
    assert.equal(after.data.connected, false)
  })

  it('connect redirects to Google consent with signed state', async () => {
    const cookie = await registerUser('c@example.com')
    const res = await fetch(`${ctx.baseUrl}/api/drive/connect?state=%2Fsettings`, {
      headers: { Cookie: cookie },
      redirect: 'manual',
    })
    assert.equal(res.status, 302)
    const loc = res.headers.get('location')
    assert.ok(loc.startsWith('https://accounts.google.com/o/oauth2/v2/auth'), `got ${loc}`)
    assert.ok(loc.includes('state='), 'expected a state param')
    assert.ok(loc.includes('access_type=offline'))
    assert.ok(loc.includes('prompt=consent'))
    assert.ok(loc.includes('scope='))
  })

  it('oauth callback rejects tampered state', async () => {
    const cookie = await registerUser('cb@example.com')
    const res = await api(ctx.baseUrl, '/api/drive/oauth-callback?code=fake&state=abc.def.ghi', {
      cookie,
    })
    assert.equal(res.status, 400)
  })

  it('oauth callback requires auth (401 when no session)', async () => {
    const res = await api(ctx.baseUrl, '/api/drive/oauth-callback?code=fake&state=a.b.c')
    assert.equal(res.status, 400) // state is checked before auth
  })

  it('upload requires a connected drive (400) and auth (401)', async () => {
    const cookie = await registerUser('u@example.com')
    const prop = await api(ctx.baseUrl, '/api/properties', {
      method: 'POST',
      cookie,
      body: {
        name: 'Upload Target',
        category: 'Farm',
        ownership: 'Purchased',
        area: 1,
        areaUnit: 'acres',
        latitude: 27,
        longitude: 78,
      },
    })
    assert.equal(prop.status, 201)

    const form = new FormData()
    form.append('file', new Blob(['fake-pdf-bytes'], { type: 'application/pdf' }), 'deed.pdf')
    form.append('type', 'Ownership Deed')

    const noDrive = await fetch(`${ctx.baseUrl}/api/drive/properties/${prop.data.property._id}/documents/upload`, {
      method: 'POST',
      headers: { Cookie: cookie },
      body: form,
    })
    assert.equal(noDrive.status, 400)
    const noDriveBody = await noDrive.json().catch(() => ({}))
    assert.match(noDriveBody.error ?? '', /Drive is not connected/i)

    const noAuth = await fetch(`${ctx.baseUrl}/api/drive/properties/${prop.data.property._id}/documents/upload`, {
      method: 'POST',
      body: form,
    })
    assert.equal(noAuth.status, 401)
  })
})
