const mongoose = require('mongoose')
const Property = require('../models/Property')

const { DOCUMENT_TYPES } = Property

/**
 * Mirror property metadata into the owner's Drive as property.json.
 * Lazily required to avoid a circular dependency (drive.service imports
 * Property from the model, not this module). No-op when Drive isn't
 * connected; failures are logged, never fatal.
 */
function syncMetadataToDrive(property) {
  const { writePropertyMetadata } = require('./drive.service')
  return writePropertyMetadata(property)
}

const CATEGORIES = [
  'Agricultural Land',
  'Residential Plot',
  'Commercial Property',
  'Open Land',
  'Farm',
  'Industrial Land',
  'Other',
]

const OWNERSHIPS = ['Purchased', 'Inherited', 'Gifted', 'Trust', 'Court Transfer']

const AREA_UNITS = ['acres', 'hectares', 'sqft', 'sqm', 'guntha', 'bigha']

/** Validate create/update payload; returns { ok, error? } */
function validatePropertyInput(body, { partial = false } = {}) {
  const err = (message) => ({ ok: false, error: message })

  const isDefined = (v) => v !== undefined && v !== null && v !== ''

  if (!partial || isDefined(body.name)) {
    if (!String(body.name ?? '').trim()) return err('Please enter a property name.')
  }
  if (!partial || isDefined(body.category)) {
    if (!CATEGORIES.includes(body.category)) return err('Please choose a valid category.')
  }
  if (!partial || isDefined(body.ownership)) {
    if (!OWNERSHIPS.includes(body.ownership)) return err('Please choose a valid ownership type.')
  }
  if (!partial || isDefined(body.area)) {
    const area = Number(body.area)
    if (!Number.isFinite(area) || area < 0) return err('Area must be a non-negative number.')
  }
  if (!partial || isDefined(body.areaUnit)) {
    if (!AREA_UNITS.includes(body.areaUnit)) return err('Please choose a valid area unit.')
  }
  if (!partial || isDefined(body.latitude)) {
    const lat = Number(body.latitude)
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return err('Latitude must be between -90 and 90.')
  }
  if (!partial || isDefined(body.longitude)) {
    const lng = Number(body.longitude)
    if (!Number.isFinite(lng) || lng < -180 || lng > 180)
      return err('Longitude must be between -180 and 180.')
  }
  return { ok: true }
}

/** List a user's properties, newest first. */
async function listProperties(ownerId) {
  return Property.find({ owner: ownerId }).sort({ createdAt: -1 })
}

/** Fetch one property only if owned by the user. */
async function getOwnedProperty(ownerId, propertyId) {
  if (!mongoose.Types.ObjectId.isValid(propertyId)) return null
  return Property.findOne({ _id: propertyId, owner: ownerId })
}

/** Create a property. Input is pre-validated. */
async function createProperty(ownerId, body) {
  const property = await Property.create({ owner: ownerId, ...body })
  syncMetadataToDrive(property).catch((err) =>
    console.error('[drive] metadata sync failed on create:', err.message),
  )
  return property
}

/** Update allowed fields only; returns the updated doc or null if not owned. */
async function updateOwnedProperty(ownerId, propertyId, body) {
  const property = await getOwnedProperty(ownerId, propertyId)
  if (!property) return null

  const allowed = [
    'name',
    'category',
    'ownership',
    'purchaseDate',
    'purchasePrice',
    'area',
    'areaUnit',
    'marketValue',
    'previousOwner',
    'notes',
    'latitude',
    'longitude',
  ]
  for (const key of allowed) {
    if (body[key] !== undefined) property[key] = body[key]
  }
  await property.save()
  syncMetadataToDrive(property).catch((err) =>
    console.error('[drive] metadata sync failed on update:', err.message),
  )
  return property
}

/** Delete a property; returns true if it existed and was owned. */
async function deleteOwnedProperty(ownerId, propertyId) {
  const property = await getOwnedProperty(ownerId, propertyId)
  if (!property) return false
  await property.deleteOne()
  return true
}

/**
 * Add a document to a property. Returns { ok: true, property } or
 * { ok: false, status, error }.
 */
async function addDocument(ownerId, propertyId, body) {
  const property = await getOwnedProperty(ownerId, propertyId)
  if (!property) return { ok: false, status: 404, error: 'Property not found.' }

  const name = String(body.name ?? '').trim()
  if (!name) return { ok: false, status: 400, error: 'Please enter a document name.' }
  if (!DOCUMENT_TYPES.includes(body.type))
    return { ok: false, status: 400, error: 'Please choose a valid document type.' }

  property.documents.push({
    name,
    type: body.type,
    size: String(body.size ?? ''),
    driveFileId: String(body.driveFileId ?? ''),
  })
  await property.save()
  return { ok: true, property }
}

/** Remove a document from a property. */
async function removeDocument(ownerId, propertyId, documentId) {
  const property = await getOwnedProperty(ownerId, propertyId)
  if (!property) return { ok: false, status: 404, error: 'Property not found.' }

  const doc = property.documents.id(documentId)
  if (!doc) return { ok: false, status: 404, error: 'Document not found.' }
  doc.deleteOne()
  await property.save()
  return { ok: true, property }
}

/**
 * Add a visit to a property. Returns { ok: true, property } or
 * { ok: false, status, error }.
 */
async function addVisit(ownerId, propertyId, body) {
  const property = await getOwnedProperty(ownerId, propertyId)
  if (!property) return { ok: false, status: 404, error: 'Property not found.' }

  const date = String(body.date ?? '').trim()
  if (!date) return { ok: false, status: 400, error: 'Please enter a visit date.' }

  const lat = Number(body.latitude)
  const lng = Number(body.longitude)
  if (!Number.isFinite(lat) || lat < -90 || lat > 90)
    return { ok: false, status: 400, error: 'Latitude must be between -90 and 90.' }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180)
    return { ok: false, status: 400, error: 'Longitude must be between -180 and 180.' }

  property.visits.push({
    date,
    note: String(body.note ?? '').trim(),
    latitude: lat,
    longitude: lng,
  })
  await property.save()
  return { ok: true, property }
}

/** Remove a visit from a property. */
async function removeVisit(ownerId, propertyId, visitId) {
  const property = await getOwnedProperty(ownerId, propertyId)
  if (!property) return { ok: false, status: 404, error: 'Property not found.' }

  const visit = property.visits.id(visitId)
  if (!visit) return { ok: false, status: 404, error: 'Visit not found.' }
  visit.deleteOne()
  await property.save()
  return { ok: true, property }
}

module.exports = {
  validatePropertyInput,
  listProperties,
  getOwnedProperty,
  createProperty,
  updateOwnedProperty,
  deleteOwnedProperty,
  addDocument,
  removeDocument,
  addVisit,
  removeVisit,
}
