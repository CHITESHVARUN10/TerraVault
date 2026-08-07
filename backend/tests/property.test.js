const { describe, it, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const {
  api,
  startTestServer,
  connectTestDb,
  dropTestDb,
  disconnectTestDb,
} = require('./helpers')

describe('properties', () => {
  let ctx

  const VALID = {
    name: 'Riverside Plot',
    category: 'Agricultural Land',
    ownership: 'Purchased',
    area: 2.5,
    areaUnit: 'acres',
    latitude: 28.6129,
    longitude: 77.2295,
  }

  async function registerUser(email) {
    const res = await api(ctx.baseUrl, '/api/auth/register', {
      method: 'POST',
      body: { name: email.split('@')[0], email, password: 'secret123' },
    })
    assert.equal(res.status, 201)
    assert.ok(res.cookie, 'expected a session cookie')
    return res.cookie
  }

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

  it('requires auth', async () => {
    const list = await api(ctx.baseUrl, '/api/properties')
    assert.equal(list.status, 401)
  })

  it('create + list + get + update + delete lifecycle', async () => {
    const cookie = await registerUser('a@example.com')

    const created = await api(ctx.baseUrl, '/api/properties', {
      method: 'POST',
      cookie,
      body: VALID,
    })
    assert.equal(created.status, 201)
    const prop = created.data.property
    assert.equal(prop.name, 'Riverside Plot')
    assert.ok(prop.owner, 'expected an owner reference')

    const list = await api(ctx.baseUrl, '/api/properties', { cookie })
    assert.equal(list.status, 200)
    assert.equal(list.data.properties.length, 1)

    const one = await api(ctx.baseUrl, `/api/properties/${prop._id}`, { cookie })
    assert.equal(one.status, 200)
    assert.equal(one.data.property.name, 'Riverside Plot')

    const updated = await api(ctx.baseUrl, `/api/properties/${prop._id}`, {
      method: 'PATCH',
      cookie,
      body: { marketValue: 2500000, notes: 'Good soil' },
    })
    assert.equal(updated.status, 200)
    assert.equal(updated.data.property.marketValue, 2500000)
    assert.equal(updated.data.property.notes, 'Good soil')

    const del = await api(ctx.baseUrl, `/api/properties/${prop._id}`, {
      method: 'DELETE',
      cookie,
    })
    assert.equal(del.status, 204)

    const gone = await api(ctx.baseUrl, `/api/properties/${prop._id}`, { cookie })
    assert.equal(gone.status, 404)
  })

  it('validates input (400 on bad category / missing area / bad coords)', async () => {
    const cookie = await registerUser('v@example.com')

    const badCat = await api(ctx.baseUrl, '/api/properties', {
      method: 'POST',
      cookie,
      body: { ...VALID, category: 'Moon' },
    })
    assert.equal(badCat.status, 400)

    const noArea = await api(ctx.baseUrl, '/api/properties', {
      method: 'POST',
      cookie,
      body: { ...VALID, area: undefined },
    })
    assert.equal(noArea.status, 400)

    const badLat = await api(ctx.baseUrl, '/api/properties', {
      method: 'POST',
      cookie,
      body: { ...VALID, latitude: 200 },
    })
    assert.equal(badLat.status, 400)
  })

  it('users cannot see or touch each other properties (404)', async () => {
    const cookieA = await registerUser('a@example.com')
    const cookieB = await registerUser('b@example.com')

    const created = await api(ctx.baseUrl, '/api/properties', {
      method: 'POST',
      cookie: cookieA,
      body: VALID,
    })
    const prop = created.data.property

    const listB = await api(ctx.baseUrl, '/api/properties', { cookie: cookieB })
    assert.equal(listB.data.properties.length, 0)

    const getB = await api(ctx.baseUrl, `/api/properties/${prop._id}`, { cookie: cookieB })
    assert.equal(getB.status, 404)

    const patchB = await api(ctx.baseUrl, `/api/properties/${prop._id}`, {
      method: 'PATCH',
      cookie: cookieB,
      body: { name: 'Hacked' },
    })
    assert.equal(patchB.status, 404)

    const delB = await api(ctx.baseUrl, `/api/properties/${prop._id}`, {
      method: 'DELETE',
      cookie: cookieB,
    })
    assert.equal(delB.status, 404)
  })

  it('404 for invalid object id', async () => {
    const cookie = await registerUser('x@example.com')
    const res = await api(ctx.baseUrl, '/api/properties/not-an-id', { cookie })
    assert.equal(res.status, 404)
  })
})
