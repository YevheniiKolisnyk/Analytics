const {Router} = require('express')
const router = Router()
const passport = require('passport')
const controller = require('../controllers/analytics')

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview)
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics)

module.exports = router
