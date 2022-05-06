const express = require('express')
const router = express.Router()

const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
// Controller
const authController = require('../controller/AuthController')
const productController = require('../controller/ProductController')
const customerController = require('../controller/CustomerController')
const cartController = require('../controller/CartController')
const categoryController = require('../controller/CategoryController')
const userController = require('../controller/UserController')

// Middleware
const { isStaffApi, isAdminApi, isValidCustomerApi } = require('../middleware/index')
const adminController = require('../controller/AdminController')

router.get('/product/live-search', productController.handleLiveSearch)
router.get('/product/:productId/check', productController.checkExistsProductId)
router.get('/product/:slug/check-slug', productController.checkExistsProductSlug)
router.get('/product/:productId/review', isStaffApi, productController.handleGetReviewOfProduct)
router.get('/product/:productId', productController.handleGetProductById)

router.delete('/product/:productId', isStaffApi, productController.handleDeleteProductById)


router.get('/category/:id', isStaffApi, categoryController.getCategoryById)
router.delete('/category/:id', isStaffApi, categoryController.handleDeleteById)

router.post('/auth/register', authController.postRegister)
router.post('/auth/login', authController.postLogin)

router.get('/laptop/cpu', productController.getAllCpu)
router.get('/laptop/ram', productController.getAllRam)
router.get('/laptop/filter', productController.handleFilterProduct)

router.post('/customer/address', customerController.addAddress)
router.put('/customer/address/:id', customerController.updateAddress)
router.delete('/customer/address/:id', customerController.deleteAddress)


router.get('/cart/revenue/getChart', isStaffApi, cartController.getRevenueForChart)
router.get('/cart/bestseller/getChart', isStaffApi, cartController.getBestSellerForChart)
router.get('/cart/getChart', isStaffApi, cartController.getCartForChart)

router.put('/cart/:id/status', isStaffApi, cartController.updateStatusCart)
router.get('/cart/:id', cartController.getCartById)
router.get('/cart', isStaffApi, cartController.getCart)    
router.post('/cart', cartController.addCart)  


router.delete('/user/:id', isAdminApi, userController.handleDeleteById)



router.put('/user/change-password', isStaffApi, csrfProtection, adminController.changePasswordUser)
router.put('/customer/:customerId/change-password', 
        isValidCustomerApi, 
        csrfProtection, 
        customerController.changePasswordCustomer)

module.exports = router;
