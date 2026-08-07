const { describe, it, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const {
  api,
  startTestServer,
  connectTestDb,
  dropTestDb,
  disconnectTestDb,
} = require('./helpers')

describe('property documents & visits', () => {
  let ctx

  const VALID_PROPERTY = {
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

  async function createProperty(cookie, body = VALID_PROPERTY) {
    const res = await api(ctx.baseUrl, '/api/properties', { method: 'POST', cookie, body })
    assert.equal(res.status, 201)
    return res.data.property
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
    const res = await api(ctx.baseUrl, '/api/properties/000000000000000000000000/documents', {
      method: 'POST',
      body: { name: 'Deed.pdf', type: 'Ownership Deed' },
    })
    assert.equal(res.status, 401)
  })

  it('adds and removes a document', async () => {
    const cookie = await registerUser('a@example.com')
    const prop = await createProperty(cookie)

    const add = await api(ctx.baseUrl, `/api/properties/${prop._id}/documents`, {
      method: 'POST',
      cookie,
      body: { name: 'Deed_2004.pdf', type: 'Ownership Deed', size: '2.4 MB' },
    })
    assert.equal(add.status, 201)
    assert.equal(add.data.property.documents.length, 1)
    const doc = add.data.property.documents[0]
    assert.equal(doc.name, 'Deed_2004.pdf')
    assert.equal(doc.type, 'Ownership Deed')
    assert.ok(doc._id, 'expected a document id')

    const list = await api(ctx.baseUrl, `/api/properties/${prop._id}`, { cookie })
    assert.equal(list.data.property.documents.length, 1)

    const del = await api(ctx.baseUrl, `/api/properties/${prop._id}/documents/${doc._id}`, {
      method: 'DELETE',
      cookie,
    })
    assert.equal(del.status, 200)
    assert.equal(del.data.property.documents.length, 0)
  })

  it('validates document input (400 on bad type / missing name / bad doc id)', async () => {
    const cookie = await registerUser('v@example.com')
    const prop = await createProperty(cookie)

    const badType = await api(ctx.baseUrl, `/api/properties/${prop._id}/documents`, {
      method: 'POST',
      cookie,
      body: { name: 'x.pdf', type: 'Not A Real Type' },
    })
    assert.equal(badType.status, 400)

    const noName = await api(ctx.baseUrl, `/api/properties/${prop._id}/documents`, {
      method: 'POST',
      cookie,
      body: { name: '', type: 'Other' },
    })
    assert.equal(noName.status, 400)

    const badDocId = await api(ctx.baseUrl, `/api/properties/${prop._id}/documents/not-a-doc-id`, {
      method: 'DELETE',
      cookie,
    })
    assert.equal(badDocId.status, 404)
  })

  it('adds and removes a visit', async () => {
    const cookie = await registerUser('v2@example.com')
    const prop = await createProperty(cookie)

    const add = await api(ctx.baseUrl, `/api/properties/${prop._id}/visits`, {
      method: 'POST',
      cookie,
      body: { date: '2024-03-15', note: 'First survey', latitude: 27.1767, longitude: 78.0081 },
    })
    assert.equal(add.status, 201)
    assert.equal(add.data.property.visits.length, 1)
    const visit = add.data.property.visits[0]
    assert.equal(visit.note, 'First survey')
    assert.ok(visit._id, 'expected a visit id')

    const del = await api(ctx.baseUrl, `/api/properties/${prop._id}/visits/${visit._id}`, {
      method: 'DELETE',
      cookie,
    })
    assert.equal(del.status, 200)
    assert.equal(del.data.property.visits.length, 0)
  })

  it('validates visit input (400 on bad coords / missing date / bad visit id)', async () => {
    const cookie = await registerUser('v3@example.com')
    const prop = await createProperty(cookie)

    const badLat = await api(ctx.baseUrl, `/api/properties/${prop._id}/visits`, {
      method: 'POST',
      cookie,
      body: { date: '2024-03-15', latitude: 200, longitude: 78 },
    })
    assert.equal(badLat.status, 400)

    const noDate = await api(ctx.baseUrl, `/api/properties/${prop._id}/visits`, {
      method: 'POST',
      cookie,
      body: { date: '', latitude: 27, longitude: 78 },
    })
    assert.equal(noDate.status, 400)

    const badVisitId = await api(ctx.baseUrl, `/api/properties/${prop._id}/visits/not-a-visit-id`, {
      method: 'DELETE',
      cookie,
    })
    assert.equal(badVisitId.status, 404)
  })

  it('users cannot add documents or visits to others properties (404)', async () => {
    const cookieA = await registerUser('a@example.com')
    const cookieB = await registerUser('b@example.com')
    const propA = await createProperty(cookieA)

    const addDocB = await api(ctx.baseUrl, `/api/properties/${propA._id}/documents`, {
      method: 'POST',
      cookie: cookieB,
      body: { name: 'Hacked.pdf', type: 'Other' },
    })
    assert.equal(addDocB.status, 404)

    const addVisitB = await api(ctx.baseUrl, `/api/properties/${propA._id}/visits`, {
      method: 'POST',
      cookie: cookieB,
      body: { date: '2024-03-15', latitude: 27, longitude: 78 },
    })
    assert.equal(addVisitB.status, 404)
  })
})
