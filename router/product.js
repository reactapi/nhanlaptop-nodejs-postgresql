const express = require('express')
const router = express.Router()

const productController = require('../controller/ProductController')


router.get('/phu-kien/:slug', productController.showAccessoriesById)
router.get('/laptop-may-tinh-xach-tay/:slug', productController.showLaptopById)
router.get('/laptop-may-tinh-xach-tay', productController.showLaptopFilter)

module.exports = router;
