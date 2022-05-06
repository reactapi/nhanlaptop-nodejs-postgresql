const express = require('express')
const router = express.Router()
const { isValidUser } = require('../middleware/index')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

const userController = require('../controller/UserController')


router.get('/:userId', isValidUser, userController.index)



module.exports = router;
