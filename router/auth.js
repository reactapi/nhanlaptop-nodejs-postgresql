const express = require('express')
const router = express.Router()

const authController = require('../controller/AuthController')
const customerController = require('../controller/CustomerController')

router.get('/register', authController.getRegister)
router.get('/login', authController.getLogin)
router.get('/logout', authController.logout)

router.get('/forgot-password', authController.getForgotPassword)
router.post('/forgot-password', authController.handleForgotPassword)

router.get('/reset-password/:code', authController.getResetPassword)
router.post('/reset-password', customerController.handleResetPassword)



module.exports = router;
