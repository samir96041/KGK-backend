const express = require('express')
const router = express.Router()
const controller = require('../Controller/bid-controller')
const {authenticate} = require('../Helper/token')

router.get('/:itemId/bid', controller.getitemid)
router.post('/:itemId/bid',authenticate, controller.postitemid)


module.exports= router
