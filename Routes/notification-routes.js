const express = require ('express')
const router = express.Router();
const { authenticate } = require('../Helper/token');

const controller = require('../Controller/notification-controller')
router.get('/', authenticate, controller.getnotify)
router.post('/mark-read', authenticate,controller.postnotify)



module.exports = router 
