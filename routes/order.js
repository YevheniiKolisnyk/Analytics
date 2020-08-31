const {Router} = require('express')
const router = Router()
const passport = require('passport')
const controller = require('../controllers/order')

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)

module.exports = router
