const express = require('express')
const router = express.Router()

const homeController = require('../controller/HomeController')

router.get('/', homeController.index)
router.get('/tim-kiem', homeController.showSearchPage)
router.get('/gio-hang/thanh-toan', homeController.showCheckoutPage)
router.get('/gio-hang', homeController.showCartPage)

module.exports = router;
