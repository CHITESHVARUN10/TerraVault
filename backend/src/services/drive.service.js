const { google } = require('googleapis')
const DriveConnection = require('../models/DriveConnection')
const { getOAuthClient, DRIVE_SCOPES } = require('../config/google')
const { encryptToken, decryptToken } = require('../config/tokenCrypto')

const ROOT_FOLDER_NAME = 'Property Vault'
const METADATA_FILE = 'property.json'

/** Build a Drive client using the stored tokens for a user. */
async function driveClientForUser(userId) {
  const conn = await DriveConnection.findOne({ user: userId })
  if (!conn) return null
  return {
    conn,
    client: await buildDriveClient(conn),
  }
}

async function buildDriveClient(conn) {
  const oauth = getOAuthClient()
  oauth.setCredentials({
    access_token: decryptToken(conn.accessTokenEnc),
    refresh_token: decryptToken(conn.refreshTokenEnc),
    expiry_date: conn.tokenExpiry ? conn.tokenExpiry.getTime() : undefined,
  })
  // googleapis refreshes the access token automatically; persist the new one.
  oauth.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      conn.accessTokenEnc = encryptToken(tokens.access_token)
      conn.tokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : conn.tokenExpiry
      await conn.save()
    }
  })
  return google.drive({ version: 'v3', auth: oauth })
}

/** Exchange an OAuth code for tokens and store the connection. */
async function saveConnectionFromCode(userId, code) {
  const oauth = getOAuthClient()
  const { tokens } = await oauth.getToken(code)
  oauth.setCredentials(tokens)

  // Look up the Google account email.
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth })
  const { data } = await oauth2.userinfo.get()
  const googleEmail = data.email || ''

  // Create the root "Property Vault" folder in the user's Drive.
  const drive = google.drive({ version: 'v3', auth: oauth })
  const folder = await drive.files.create({
    requestBody: {
      name: ROOT_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  })

  await DriveConnection.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      googleEmail,
      folderId: folder.data.id,
      accessTokenEnc: encryptToken(tokens.access_token),
      refreshTokenEnc: encryptToken(tokens.refresh_token),
      tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(),
      connectedAt: new Date(),
    },
    { upsert: true, new: true },
  )
  return googleEmail
}

/** Public connection status (never exposes tokens). */
async function getStatus(userId) {
  const conn = await DriveConnection.findOne({ user: userId })
  if (!conn) return { connected: false }
  return {
    connected: true,
    email: conn.googleEmail,
    folderName: ROOT_FOLDER_NAME,
    connectedAt: conn.connectedAt,
  }
}

/** Remove the stored Drive connection (does not delete Drive files). */
async function disconnect(userId) {
  await DriveConnection.deleteOne({ user: userId })
}

/** Find-or-create a property folder inside the vault root. */
async function ensurePropertyFolder(drive, conn, propertyId) {
  const name = `property-${propertyId}`

  const query = `'${conn.folderId}' in parents and name = '${name}' and trashed = false`
  const existing = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
    spaces: 'drive',
  })
  if (existing.data.files.length > 0) return existing.data.files[0]

  const created = await drive.files.create({
    requestBody: { name, mimeType: 'application/vnd.google-apps.folder', parents: [conn.folderId] },
    fields: 'id',
  })
  return created.data
}

/** Write property.json metadata into a property folder. No-op if not connected. */
async function writePropertyMetadata(property) {
  const drive = await driveClientForUser(property.owner)
  if (!drive) return null
  const { conn, client } = drive
  const folder = await ensurePropertyFolder(client, conn, String(property._id))

  const metadata = {
    id: String(property._id),
    name: property.name,
    category: property.category,
    ownership: property.ownership,
    purchaseDate: property.purchaseDate || null,
    purchasePrice: property.purchasePrice || null,
    area: property.area,
    areaUnit: property.areaUnit,
    marketValue: property.marketValue || null,
    previousOwner: property.previousOwner || null,
    notes: property.notes || null,
    latitude: property.latitude,
    longitude: property.longitude,
    updatedAt: property.updatedAt ? property.updatedAt.toISOString() : new Date().toISOString(),
  }

  await client.files.create({
    requestBody: {
      name: METADATA_FILE,
      parents: [folder.id],
      mimeType: 'application/json',
    },
    media: { mimeType: 'application/json', body: JSON.stringify(metadata, null, 2) },
    fields: 'id',
  })
  return folder
}

/** Upload a document file to a property folder; returns the Drive file id. */
async function uploadDocumentFile(drive, conn, propertyId, { name, mimeType, body }) {
  const folder = await ensurePropertyFolder(drive, conn, propertyId)
  const file = await drive.files.create({
    requestBody: { name, parents: [folder.id] },
    media: { mimeType: mimeType || 'application/octet-stream', body },
    fields: 'id',
  })
  return file.data.id
}

/** Public read URL for a Drive file (requires auth when opened). */
function driveFileUrl(fileId) {
  return fileId ? `https://drive.google.com/file/d/${fileId}/view` : ''
}

module.exports = {
  driveClientForUser,
  saveConnectionFromCode,
  getStatus,
  disconnect,
  ensurePropertyFolder,
  writePropertyMetadata,
  uploadDocumentFile,
  driveFileUrl,
  ROOT_FOLDER_NAME,
}
