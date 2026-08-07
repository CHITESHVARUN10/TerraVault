const { describe, it, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const {
  api,
  startTestServer,
  connectTestDb,
  dropTestDb,
  disconnectTestDb,
} = require('./helpers')

describe('auth', () => {
  let ctx

  before(async () => {
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

  it('registers, sets a session cookie, and /me returns the profile', async () => {
    const reg = await api(ctx.baseUrl, '/api/auth/register', {
      method: 'POST',
      body: { name: 'Test User', email: 't@example.com', password: 'secret123' },
    })
    assert.equal(reg.status, 201)
    assert.ok(reg.cookie, 'expected a session cookie')
    assert.ok(reg.cookie.startsWith('connect.sid='), 'cookie should be connect.sid')
    assert.equal(reg.data.user.name, 'Test User')
    assert.equal(reg.data.user.email, 't@example.com')
    assert.equal(reg.data.user.plan, 'Free')

    const me = await api(ctx.baseUrl, '/api/auth/me', { cookie: reg.cookie })
    assert.equal(me.status, 200)
    assert.equal(me.data.user.email, 't@example.com')
  })

  it('rejects duplicate email with 409', async () => {
    const body = { name: 'A', email: 'dup@example.com', password: 'secret123' }
    const first = await api(ctx.baseUrl, '/api/auth/register', { method: 'POST', body })
    assert.equal(first.status, 201)

    const dup = await api(ctx.baseUrl, '/api/auth/register', { method: 'POST', body })
    assert.equal(dup.status, 409)
    assert.match(dup.data.error, /already exists/)
  })

  it('rejects invalid input with 400', async () => {
    const bad = await api(ctx.baseUrl, '/api/auth/register', {
      method: 'POST',
      body: { name: '', email: 'nope', password: '123' },
    })
    assert.equal(bad.status, 400)
  })

  it('login fails with wrong password (401), succeeds with correct one', async () => {
    const body = { name: 'Login', email: 'l@example.com', password: 'secret123' }
    await api(ctx.baseUrl, '/api/auth/register', { method: 'POST', body })

    const bad = await api(ctx.baseUrl, '/api/auth/login', {
      method: 'POST',
      body: { email: 'l@example.com', password: 'wrong' },
    })
    assert.equal(bad.status, 401)

    const ok = await api(ctx.baseUrl, '/api/auth/login', {
      method: 'POST',
      body: { email: 'l@example.com', password: 'secret123' },
    })
    assert.equal(ok.status, 200)
    assert.ok(ok.cookie, 'expected a session cookie')
  })

  it('logout destroys the session; /me then returns 401', async () => {
    const reg = await api(ctx.baseUrl, '/api/auth/register', {
      method: 'POST',
      body: { name: 'Out', email: 'out@example.com', password: 'secret123' },
    })
    assert.ok(reg.cookie, 'expected a session cookie')

    const out = await api(ctx.baseUrl, '/api/auth/logout', {
      method: 'POST',
      cookie: reg.cookie,
    })
    assert.equal(out.status, 200)

    const me = await api(ctx.baseUrl, '/api/auth/me', { cookie: reg.cookie })
    assert.equal(me.status, 401)
  })

  it('/me without session returns 401', async () => {
    const me = await api(ctx.baseUrl, '/api/auth/me')
    assert.equal(me.status, 401)
  })
})
