
const express = require ('express')
const router = express.Router();
const controller = require('../Controller/item-controller')
const { authenticate, authorize } = require('../Helper/token');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.get('/getitem',controller.getallitems)
router.get('/getitem/:id',controller.getitemid)
router.post('/additem', authenticate, authorize(['admin', 'user']), upload.single('image'),controller.postitem)
router.put('/putitem/:id', authenticate, authorize(['admin', 'user']),controller.putitem)
router.delete('/delete/:id', authenticate, authorize(['admin', 'user']), controller.deleteitem)

module.exports = router 

