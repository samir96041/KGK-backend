const express = require ('express')
const router = express.Router();

const controller = require('../Controller/user-controller')

router.post('/register',controller.registration)
router.post('/login',controller.login)
router.get('/profile',controller.profile)
router.post('/request-password-reset',controller.passreset)
router.post('/reset-password/:token',controller.postpassword)


module.exports = router 
