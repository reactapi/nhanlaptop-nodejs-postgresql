const express = require('express')
const router = express.Router()

const authController = require('../controller/AuthController')
const customerController = require('../controller/CustomerController')

router.get('/register', authController.getRegister)
router.get('/login', authController.getLogin)
router.get('/logout', authController.logout)

router.get('/reset-password', authController.getResetPassword)
router.post('/reset-password', customerController.handleResetPassword)



module.exports = router;
