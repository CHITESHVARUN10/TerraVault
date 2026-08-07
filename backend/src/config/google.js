const { google } = require('googleapis')

/** Build a Google OAuth2 client from env config. */
function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set for Drive integration')
  }
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/drive/oauth-callback'
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive.file']

module.exports = { getOAuthClient, DRIVE_SCOPES }
