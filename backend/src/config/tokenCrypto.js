const crypto = require('crypto')

const ALGO = 'aes-256-gcm'

function key() {
  const k = process.env.DRIVE_TOKEN_KEY
  if (!k || k.length < 32) {
    throw new Error('DRIVE_TOKEN_KEY must be set to a string of at least 32 characters')
  }
  return crypto.createHash('sha256').update(k).digest()
}

/** Encrypt a plaintext token: iv.ciphertext.authTag (base64url). */
function encryptToken(plaintext) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGO, key(), iv)
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('base64url')}.${ciphertext.toString('base64url')}.${authTag.toString('base64url')}`
}

/** Decrypt a token produced by encryptToken. */
function decryptToken(payload) {
  const [ivB64, ctB64, tagB64] = String(payload).split('.')
  if (!ivB64 || !ctB64 || !tagB64) throw new Error('Malformed encrypted token')
  const decipher = crypto.createDecipheriv(ALGO, key(), Buffer.from(ivB64, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'))
  const plain = Buffer.concat([decipher.update(Buffer.from(ctB64, 'base64url')), decipher.final()])
  return plain.toString('utf8')
}

module.exports = { encryptToken, decryptToken }
