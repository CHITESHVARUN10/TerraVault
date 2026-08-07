const crypto = require('crypto')
const {
  driveClientForUser,
  saveConnectionFromCode,
  getStatus,
  disconnect,
  uploadDocumentFile,
  driveFileUrl,
} = require('../services/drive.service')
const { getOAuthClient, DRIVE_SCOPES } = require('../config/google')
const Property = require('../models/Property')

/**
 * GET /api/drive/connect?state=<frontend-route>
 * Redirect to Google's consent screen. `state` is an HMAC-signed payload
 * (random nonce + post-connect frontend redirect) to prevent CSRF on the
 * callback, since OAuth codes are exchanged server-side.
 */
function connect(req, res, next) {
  try {
    const oauth = getOAuthClient()
    const redirectTo = String(req.query.state || '/settings')
    const nonce = crypto.randomBytes(16).toString('hex')
    const signature = crypto
      .createHmac('sha256', process.env.SESSION_SECRET || 'dev-secret-change-me')
      .update(nonce + redirectTo)
      .digest('hex')
    const state = `${nonce}.${redirectTo}.${signature}`
    const url = oauth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: DRIVE_SCOPES,
      state,
    })
    res.redirect(url)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/drive/oauth-callback?code=...&state=...
 * Validate the signed state, exchange the code, store tokens, and redirect
 * the browser back to the frontend.
 */
async function oauthCallback(req, res, next) {
  try {
    const state = String(req.query.state || '')
    const parts = state.split('.')
    if (parts.length !== 3) {
      res.status(400).json({ error: 'Invalid OAuth state.' })
      return
    }
    const [nonce, redirectTo, signature] = parts
    const expected = crypto
      .createHmac('sha256', process.env.SESSION_SECRET || 'dev-secret-change-me')
      .update(nonce + redirectTo)
      .digest('hex')
    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expected)
    const valid =
      sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)
    if (!valid) {
      res.status(400).json({ error: 'Invalid OAuth state.' })
      return
    }

    const code = String(req.query.code || '')
    if (!code) {
      res.status(400).json({ error: 'Missing OAuth code.' })
      return
    }
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated. Please sign in and try again.' })
      return
    }

    const googleEmail = await saveConnectionFromCode(req.user.id, code)
    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
    res.redirect(`${clientOrigin}${redirectTo}?drive=connected&email=${encodeURIComponent(googleEmail)}`)
  } catch (err) {
    next(err)
  }
}

/** GET /api/drive/status — current Drive connection state. */
async function status(req, res, next) {
  try {
    res.json(await getStatus(req.user.id))
  } catch (err) {
    next(err)
  }
}

/** POST /api/drive/disconnect — forget the stored connection. */
async function disconnectDrive(req, res, next) {
  try {
    await disconnect(req.user.id)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/properties/:id/documents/upload
 * Multipart upload: `file` (the binary) + `type` (document category).
 * Stores the file in the property's Drive folder and records the Drive
 * file id on the document subdocument.
 */
async function uploadDocument(req, res, next) {
  try {
    const property = await Property.findOne({ _id: req.params.id, owner: req.user.id })
    if (!property) {
      res.status(404).json({ error: 'Property not found.' })
      return
    }

    const { file } = req
    if (!file) {
      res.status(400).json({ error: 'No file provided.' })
      return
    }

    const drive = await driveClientForUser(req.user.id)
    if (!drive) {
      res.status(400).json({ error: 'Google Drive is not connected. Connect it first.' })
      return
    }

    const driveFileId = await uploadDocumentFile(drive.client, drive.conn, String(property._id), {
      name: file.originalname,
      mimeType: file.mimetype,
      body: file.buffer,
    })

    const type = String(req.body.type || 'Other')
    const doc = property.documents.create({
      name: file.originalname,
      type,
      size: formatBytes(file.size),
      driveFileId,
    })
    property.documents.push(doc)
    await property.save()

    res.status(201).json({
      property,
      document: {
        id: String(doc._id),
        name: doc.name,
        type: doc.type,
        size: doc.size,
        driveFileId,
        url: driveFileUrl(driveFileId),
      },
    })
  } catch (err) {
    next(err)
  }
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`
}

module.exports = { connect, oauthCallback, status, disconnectDrive, uploadDocument }
