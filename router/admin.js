const express = require('express')
const router = express.Router()

const { handleErrorUploadImage } = require('../config/multer')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

// Middleware

const { isStaff, isAdmin } = require('../middleware/index')

// Controller

const adminController = require('../controller/AdminController')
const productController = require('../controller/ProductController')
const categoryController = require('../controller/CategoryController')
const staffController = require('../controller/StaffController')


router.get('/login', adminController.getLogin)
router.post('/login', adminController.postLogin)

router.get('/product', isStaff, adminController.showProductList)
router.get('/product/add', isStaff, csrfProtection, adminController.getAddProduct)

router.post('/product/add', 
        isStaff, 
        handleErrorUploadImage('thumbnail'), 
        csrfProtection,
        productController.handleAddProduct)

router.get('/product/update/thumbnail', isStaff, csrfProtection, adminController.getUpdateThumbnail)
router.post('/product/update/thumbnail', 
        isStaff, 
        handleErrorUploadImage('thumbnail'), 
        csrfProtection,
        productController.handleUpdateThumbnail)

router.get('/product/review', isStaff, csrfProtection, adminController.getAddAndUpdateReview)
router.post('/product/review/add', isStaff, csrfProtection, productController.handleAddReview)
router.post('/product/review/update', isStaff, csrfProtection, productController.handleUpdateReview)

router.get('/product/update/:productId', isStaff, csrfProtection, adminController.getUpdateProduct)
router.post('/product/update/:productId', isStaff, csrfProtection, productController.handleUpdateProduct)



router.get('/category', isStaff, adminController.showCategoryList)
router.get('/category/add', isStaff, adminController.getAddCategory)
router.post('/category/add', isStaff, categoryController.handleAddCategory)
router.post('/category/update', isStaff, categoryController.handleUpdateCategory)


router.get('/staff', isAdmin, adminController.showStaffList)
router.get('/staff/create', isAdmin, csrfProtection, adminController.getCreateStaff)
router.post('/staff/create', isAdmin, csrfProtection, staffController.handleCreateStaff)


router.get('/customer', isStaff, adminController.showCustomerList)

router.get('/order', isStaff, adminController.showOrderList)

router.get('/profile', isStaff, adminController.getProfile)

router.get('/doi-mat-khau', isStaff, csrfProtection, adminController.getChangePassword)

router.get('/', isStaff, adminController.index)
// router.get('/admin/upload', adminController.get)
// router.post('/admin/upload', handleErrorUploadImage('avatar'), adminController.post)

module.exports = router;

