const {
  validatePropertyInput,
  listProperties,
  getOwnedProperty,
  createProperty,
  updateOwnedProperty,
  deleteOwnedProperty,
  addDocument,
  removeDocument,
  addVisit: addVisitToProperty,
  removeVisit: removeVisitFromProperty,
} = require('../services/property.service')

/** GET /api/properties — list the current user's properties. */
async function list(req, res, next) {
  try {
    const properties = await listProperties(req.user.id)
    res.json({ properties })
  } catch (err) {
    next(err)
  }
}

/** POST /api/properties — create a property for the current user. */
async function create(req, res, next) {
  try {
    const check = validatePropertyInput(req.body)
    if (!check.ok) {
      res.status(400).json({ error: check.error })
      return
    }
    const property = await createProperty(req.user.id, req.body)
    res.status(201).json({ property })
  } catch (err) {
    next(err)
  }
}

/** GET /api/properties/:id — fetch one of the current user's properties. */
async function getOne(req, res, next) {
  try {
    const property = await getOwnedProperty(req.user.id, req.params.id)
    if (!property) {
      res.status(404).json({ error: 'Property not found.' })
      return
    }
    res.json({ property })
  } catch (err) {
    next(err)
  }
}

/** PATCH /api/properties/:id — partial update of the current user's property. */
async function update(req, res, next) {
  try {
    const check = validatePropertyInput(req.body, { partial: true })
    if (!check.ok) {
      res.status(400).json({ error: check.error })
      return
    }
    const property = await updateOwnedProperty(req.user.id, req.params.id, req.body)
    if (!property) {
      res.status(404).json({ error: 'Property not found.' })
      return
    }
    res.json({ property })
  } catch (err) {
    next(err)
  }
}

/** DELETE /api/properties/:id — remove the current user's property. */
async function remove(req, res, next) {
  try {
    const deleted = await deleteOwnedProperty(req.user.id, req.params.id)
    if (!deleted) {
      res.status(404).json({ error: 'Property not found.' })
      return
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

/** POST /api/properties/:id/documents — add a document. */
async function addDoc(req, res, next) {
  try {
    const result = await addDocument(req.user.id, req.params.id, req.body)
    if (!result.ok) {
      res.status(result.status).json({ error: result.error })
      return
    }
    res.status(201).json({ property: result.property })
  } catch (err) {
    next(err)
  }
}

/** DELETE /api/properties/:id/documents/:docId — remove a document. */
async function removeDoc(req, res, next) {
  try {
    const result = await removeDocument(req.user.id, req.params.id, req.params.docId)
    if (!result.ok) {
      res.status(result.status).json({ error: result.error })
      return
    }
    res.json({ property: result.property })
  } catch (err) {
    next(err)
  }
}

/** POST /api/properties/:id/visits — log a visit. */
async function addVisit(req, res, next) {
  try {
    const result = await addVisitToProperty(req.user.id, req.params.id, req.body)
    if (!result.ok) {
      res.status(result.status).json({ error: result.error })
      return
    }
    res.status(201).json({ property: result.property })
  } catch (err) {
    next(err)
  }
}

/** DELETE /api/properties/:id/visits/:visitId — remove a visit. */
async function removeVisit(req, res, next) {
  try {
    const result = await removeVisitFromProperty(req.user.id, req.params.id, req.params.visitId)
    if (!result.ok) {
      res.status(result.status).json({ error: result.error })
      return
    }
    res.json({ property: result.property })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, create, getOne, update, remove, addDoc, removeDoc, addVisit, removeVisit }
