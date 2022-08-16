const express = require('express')
const router = express.Router()

const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
// Controller
const authController = require('../controller/AuthController')
const productController = require('../controller/ProductController')
const customerController = require('../controller/CustomerController')
const orderController = require('../controller/OrderController')
const categoryController = require('../controller/CategoryController')
const staffController = require('../controller/StaffController')
const adminController = require('../controller/AdminController')

// Middleware
const { isStaffApi, isAdminApi, isValidCustomerApi } = require('../middleware/index')

router.get('/product/live-search', productController.handleLiveSearch)
router.get('/product/:productId/check', productController.checkExistsProductId)
router.get('/product/:productId/is-ordered', productController.checkIsOrdered)
router.get('/product/:slug/check-slug', productController.checkExistsProductSlug)
router.get('/product/:productId/review', isStaffApi, productController.handleGetReviewOfProduct)
router.get('/product/:productId', productController.handleGetProductById)

router.delete('/product/:productId', isAdminApi, productController.handleDeleteProductById)


router.get('/category/:id', isStaffApi, categoryController.getCategoryById)
router.delete('/category/:id', isAdminApi, categoryController.handleDeleteById)

router.post('/auth/register', authController.postRegister)
router.post('/auth/login', authController.postLogin)

router.get('/laptop/cpu', productController.getAllCpu)
router.get('/laptop/ram', productController.getAllRam)
router.get('/laptop/filter', productController.handleFilterProduct)


router.put('/customer/profile', customerController.updateProfile)

router.post('/customer/address', customerController.addAddress)
router.put('/customer/address/:id', customerController.updateAddress)
router.delete('/customer/address/:id', customerController.deleteAddress)


router.get('/order/revenue/getChart', isStaffApi, orderController.getRevenueLifeTime)
router.get('/order/bestseller/getChart', isStaffApi, orderController.getBestSeller)
router.get('/order/count-order/getChart', isStaffApi, orderController.getCountOrderLifeTime)

router.put('/order/:id/status', isStaffApi, orderController.updateStatusOrder)
router.get('/order/:id', orderController.getOrderById)
router.get('/order', isStaffApi, orderController.getAllOrder)    
router.post('/order', orderController.createOrder)  


router.put('/user/:id/status', isAdminApi, staffController.handleUpdateAccountStatus)



router.put('/user/change-password', isStaffApi, csrfProtection, adminController.changePasswordUser)
router.put('/customer/:customerId/change-password', 
        isValidCustomerApi, 
        csrfProtection, 
        customerController.changePasswordCustomer)

module.exports = router;
