const {Router} = require('express')
const router = Router()
const controller = require('../controllers/auth')

router.post('/login', controller.login)
router.post('/register', controller.register)

module.exports = router
