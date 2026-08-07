const { Router } = require('express')
const multer = require('multer')
const { requireAuth } = require('../middleware/auth')
const {
  connect,
  oauthCallback,
  status,
  disconnectDrive,
  uploadDocument,
} = require('../controllers/drive.controller')

const router = Router()

// GET /api/drive/connect is mounted BEFORE requireAuth so the OAuth
// redirect works even though the callback re-checks the session.
router.get('/connect', connect)
router.get('/oauth-callback', oauthCallback)

router.use(requireAuth)

router.get('/status', status)
router.post('/disconnect', disconnectDrive)

// Multipart upload — memory storage, 25 MB cap.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } })
router.post('/properties/:id/documents/upload', upload.single('file'), uploadDocument)

module.exports = router
