const mongoose = require('mongoose')

/**
 * Per-user Google Drive OAuth connection. Tokens are encrypted at rest
 * with AES-256-GCM (key from DRIVE_TOKEN_KEY). Only the account email and
 * a drive folder id live here — never property data.
 */
const driveConnectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    googleEmail: { type: String, required: true, trim: true },
    folderId: { type: String, required: true }, // root "Property Vault" folder
    accessTokenEnc: { type: String, required: true },
    refreshTokenEnc: { type: String, required: true },
    tokenExpiry: { type: Date, required: true },
    connectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model('DriveConnection', driveConnectionSchema)
