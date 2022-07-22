const {queryDatabase} = require('../model/database')
const productModel = require('../model/Product')
const categoryModel = require('../model/Category')
const orderModel = require('../model/Order')
const customerModel = require('../model/Customer')
const staffModel = require('../model/Staff')
// const { cloudinary, uploadToCloudinary } = require('../config/cloudinary')
const helper = require('../helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const { pagination } = require('../helper')

class AdminController {

    async getLogin(req, res) {
        try {
            const user = req.user
            if (user) {
                if (user.role < 1) {
                    return res.redirect('back')
                } else {
                    return res.redirect('/nhanlaptop-admin')
                }

            } else {
                res.render('admin/login', {
                    success: req.flash('success'),
                    error: req.flash('error')
                })
            }


        } catch (error) {
            console.log(error)
            res.render('pages/404')
        }
    }

    async postLogin(req, res) {

        try {
            const { email, password } = req.body

            let sqlLogin = `select * from administrator where email = $1`
            const user = await queryDatabase(sqlLogin, [email])
            if (user.length > 0) {
                const userId = user[0]['user_id']
                const passwordInDatabase = user[0]['password']
                const checkPassword = await bcrypt.compare(password, passwordInDatabase)

                if (checkPassword) {
                    const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
                    res.cookie("token", accessToken, {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60,
                    });
                    return res.redirect('/nhanlaptop-admin')
                } else {
                    req.flash('error', 'Tài khoản hoặc mật khẩu không chính xác!')
                    return res.redirect('back') 
                }
            } else {
                req.flash('error', 'Tài khoản hoặc mật khẩu không chính xác!')
                return res.redirect('back') 
            }
            
        } catch (error) {
            console.log(error)
            res.json({
                status: 'error',
                message: error
            })
        }
    }

    async index(req, res) {
        try {
            const user = req.user

            const dataCountCustomer =  await customerModel.getCount()

            const dataCountOrder =  await orderModel.getCount()

            const dataCountProduct =  await productModel.getCount()

            const dataRevenue =  await orderModel.getRevenue()

            const revenue = Math.floor(dataRevenue / 1000000);

            res.render('admin/index', {
                user,
                dataCountCustomer,
                dataCountOrder,
                dataCountProduct,
                revenue,
                helper
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async showProductList(req, res) {
        try {
            const user = req.user

            let page = req.query.page ? parseInt(req.query.page) : 1

            if (page <= 0) page = 1

            const pageSize = 5


            const data =  await productModel.getAll({page, pageSize})

            const count = await productModel.getCount()

            const totalPage = Math.ceil(count / pageSize)

            res.render('admin/product/product-list', {
                user,
                helper,
                pagination: pagination(totalPage, page),
                data,
                totalPage,
                page,
                success: req.flash('success'),
                error: req.flash('error')
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async getAddProduct(req, res) {
        try {
            const user = req.user

            const sqlGetProductType = "select * from product_type";
            const dataProductType  = await queryDatabase(sqlGetProductType)

            const sqlGetCategory = "select * from category";
            const dataCategory  = await queryDatabase(sqlGetCategory)

            const sqlGetBrand = "select * from brand";
            const dataBrand  = await queryDatabase(sqlGetBrand)
            res.render('admin/product/product-add', {
                user,
                helper,
                dataProductType,
                dataCategory,
                dataBrand,
                csrfToken: req.csrfToken()
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async getUpdateProduct(req, res) {
        try {
            const user = req.user

            const { productId } = req.params


            const dataProductType = await productModel.getTypeOfProductById(productId)

            const dataProductInfo = await productModel.findProductById(productId)


            const sqlGetCategory = `select * from category`
            const dataCategory  = await queryDatabase(sqlGetCategory)

            const sqlGetBrand = `select * from brand`
            const dataBrand  = await queryDatabase(sqlGetBrand)
            
            res.render('admin/product/product-update', {
                user,
                helper,
                dataProductType,
                dataProductInfo,
                dataCategory,
                dataBrand,
                csrfToken: req.csrfToken()
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async getUpdateThumbnail(req, res) {
        try {
            const user = req.user

            res.render('admin/product/update-thumbnail', {
                user,
                helper,
                csrfToken: req.csrfToken()
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async showCategoryList(req, res) {
        try {
            const user = req.user

            const pageSize = 3
            let page = req.query.page ? parseInt(req.query.page) : 1

            if (page <= 0) page = 1

            const data =  await categoryModel.getAll({page, pageSize})
            

            const sqlgetCount = `select count(id) as total from category`

            const countResult = await queryDatabase(sqlgetCount)
            const count = countResult[0]['total']

            const totalPage = Math.ceil(count / pageSize)

            res.render('admin/category/category-list', {
                user,
                helper,
                pagination: pagination(totalPage, page),
                data,
                totalPage,
                page
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async getAddCategory(req, res) {
        try {
            const user = req.user

            const count = await categoryModel.getCount()

            const data = await categoryModel.getAll({page: 1, pageSize: count})

            res.render('admin/category/category-add', {
                user,
                helper,
                category: data
            })
            

        } catch (error) {
            console.log(error)
            res.json({
                error
            })
        }
    }

    async showOrderList(req, res) {
        try {
            const user = req.user

            const pageSize = 3
            let page = req.query.page ? parseInt(req.query.page) : 1

            if (page <= 0) page = 1

            const start = (page - 1) * pageSize


            const data =  await orderModel.getAll({page, pageSize})

            const count = await orderModel.getCount()

            const totalPage = Math.ceil(count / pageSize)

            res.render('admin/order/index', {
                user,
                helper,
                pagination: pagination(totalPage, page),
                data,
                totalPage,
                page
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }
    
    async getChangePassword(req, res) {
        try {
            const user = req.user

            res.render('admin/security/index', {
                user,
                helper,
                csrfToken: req.csrfToken()
            })

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async changePasswordUser(req, res) {
        
        try {
            const user = req.user
            const { currentPassword, newPassword } = req.body

            const sql = `select * from administrator where user_id = $1`
            const dataUser = await queryDatabase(sql, [user.userId])
            if (dataUser.length > 0) {
             
                const passwordInDatabase = dataUser[0]['password']
                const checkPassword = await bcrypt.compare(currentPassword, passwordInDatabase)
                if (checkPassword) {
                    const hashPassword = await bcrypt.hash(newPassword, 10)
                
                    const sqlUpdate = `update administrator set password = $1 where user_id = $2`
                    const result = await queryDatabase(sqlUpdate, [hashPassword, user.userId])

                    return res.json({
                        status: 'success'
                    })
                }
    
            }
            return res.json({
                status: 'error',
                message: 'Mật khẩu hiện tại không đúng!'
            })

        } catch (error) {
            return res.json({
                status: 'error',
                error
            })
        }

    }

    async getAddAndUpdateReview(req, res) {
        try {
            const user = req.user

            res.render('admin/product/review', {
                user,
                helper,
                csrfToken: req.csrfToken()
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async showCustomerList(req, res) {
        try {
            const user = req.user

            let page = req.query.page ? parseInt(req.query.page) : 1

            if (page <= 0) page = 1

            const pageSize = 5


            const data =  await customerModel.getAll({page, pageSize})

            const count = await customerModel.getCount()

            const totalPage = Math.ceil(count / pageSize)

            res.render('admin/customer/index', {
                user,
                helper,
                pagination: pagination(totalPage, page),
                data,
                totalPage,
                page
            })
            

        } catch (error) {
            console.log(error)
            res.json({
                error
            })
        }
    }

    async showStaffList(req, res) {
        try {
            const user = req.user

            let page = req.query.page ? parseInt(req.query.page) : 1

            if (page <= 0) page = 1

            const pageSize = 5


            const data =  await staffModel.getAll({page, pageSize})

            const count = await staffModel.getCount()

            const totalPage = Math.ceil(count / pageSize)

            res.render('admin/staff/index', {
                user,
                helper,
                pagination: pagination(totalPage, page),
                data,
                totalPage,
                page,
                success: req.flash('success'),
                error: req.flash('error')
            })
            

        } catch (error) {
            console.log(error)
            res.json({
                error
            })
        }
        
    }

    async getCreateStaff(req, res) {
        try {
            const user = req.user
           
            res.render('admin/staff/create', {
                user,
                helper,
                csrfToken: req.csrfToken()
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async getProfile(req, res) {

        try {
            const user = req.user

            res.render('admin/profile/index', {
                user: user, 
                helper: helper, 
            })
            
        } catch (error) {
            res.json({
                error
            })
        }

    }

   
}

module.exports = new AdminController;


