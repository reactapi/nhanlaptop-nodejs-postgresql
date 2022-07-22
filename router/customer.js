const express = require('express')
const router = express.Router()
const { isValidCustomer } = require('../middleware/index')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const { handleErrorUploadImage } = require('../config/multer')

const customerController = require('../controller/CustomerController')


router.get('/:customerId', isValidCustomer, customerController.index)
router.get('/:customerId/myorder', isValidCustomer, customerController.showMyOrder)
router.get('/:customerId/doi-mat-khau', 
        isValidCustomer, 
        csrfProtection, 
        customerController.getChangePassword)

router.post('/:customerId/profile', isValidCustomer, customerController.updateProfile)

router.get('/:customerId/avatar', 
        isValidCustomer, 
        customerController.getUpdateAvatar)

router.post('/:customerId/avatar', 
        isValidCustomer, 
        handleErrorUploadImage('avatar'),
        customerController.postUpdateAvatar)


module.exports = router;
