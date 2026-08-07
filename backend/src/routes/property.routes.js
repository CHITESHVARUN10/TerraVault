const { Router } = require('express')
const {
  list,
  create,
  getOne,
  update,
  remove,
  addDoc,
  removeDoc,
  addVisit,
  removeVisit,
} = require('../controllers/property.controller')
const { requireAuth } = require('../middleware/auth')

const router = Router()

router.use(requireAuth)

router.get('/', list)
router.post('/', create)
router.get('/:id', getOne)
router.patch('/:id', update)
router.delete('/:id', remove)
router.post('/:id/documents', addDoc)
router.delete('/:id/documents/:docId', removeDoc)
router.post('/:id/visits', addVisit)
router.delete('/:id/visits/:visitId', removeVisit)

module.exports = router
