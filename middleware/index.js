const jwt = require('jsonwebtoken')
const {queryDatabase} = require('../model/database')
const customerModel = require('../model/Customer')


async function getAccountLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token

        const data = jwt.verify(token, process.env.JWT_SECRET);

        let user = null

        const customer = await customerModel.findById(data.userId)
        if (customer) {
            user = {
                userId: customer['customer_id'],
                fullName: customer['full_name'],
                email: customer['email'],
                role: customer['role'],
                avatar: customer['avatar'],
                status: customer['status'],
            }
        } else {
            sql = `select * from administrator where user_id = $1`
            const admin = await queryDatabase(sql, [data.userId])
            if (admin.length > 0) {
                user = {
                    userId: admin[0]['user_id'],
                    fullName: admin[0]['full_name'],
                    email: admin[0]['email'],
                    role: admin[0]['role']
                }
            }
        }
        req.user = user
        next()
        
    } catch (error) {
        req.user = null
        next()
    }
    
}

async function isValidCustomer(req, res, next) {
    try {
        const customerId = req.params.customerId
        const { userId, role } = req.user
            
        if (userId === customerId && role == 0) {
            next()
        } else {
            res.redirect('/')
        }
        
    } catch (error) {
        res.redirect('/')
    }
}

async function isValidCustomerApi(req, res, next) {
    try {
        const customerId = req.params.customerId
        const { userId } = req.user

        if (userId === customerId) {
            next()
        } else {
            return res.json({
                status: 'error',
                message: 'Bạn không đủ quyền truy cập!'
            })
        }
        
    } catch (error) {
        res.json({
            status: 'error',
            message: 'Bạn không đủ quyền truy cập!'
        })
    }
}

// async function isValidStaff(req, res, next) {
//     try {
//         const userIdParams = req.params.userId
//         const { userId, role } = req.user
            
//         if (userIdParams === userId && role == 2) {
//             next()
//         } else {
//             res.redirect('/')
//         }
        
//     } catch (error) {
//         res.redirect('/')
//     }
// }


async function isStaffApi(req, res, next) {
    try {
        const { user } = req
        const { role } = user

        if (role >= 2) {
            next()
        } else {
            return res.json({
                status: 'error',
                message: 'Bạn không đủ quyền truy cập!'
            })
        }

        
    } catch (error) {
        res.json({
            status: 'error',
            message: 'Bạn không đủ quyền truy cập!'
        })
    }
}


async function isStaff(req, res, next) {
    try {
        const { user } = req
        const { role } = user
        if (role >= 2) {
            next()
        } else {
            return res.render('pages/403')
        }

        
    } catch (error) {
        res.render('pages/403')
    }
}


async function isAdminApi(req, res, next) {
    try {
        const { user } = req
        const { role } = user

        if (role >= 3) {
            next()
        } else {
            return res.json({
                status: 'error',
                message: 'Bạn không đủ quyền truy cập!'
            })
        }

        
    } catch (error) {
        res.json({
            status: 'error',
            message: 'Bạn không đủ quyền truy cập!'
        })
    }
}

async function isAdmin(req, res, next) {
    try {
        const { user } = req
        const { role } = user

        if (role >= 3) {
            next()
        } else {
            return res.render('pages/403')
        }

        
    } catch (error) {
        res.render('pages/403')
    }
}

module.exports = {
    getAccountLoggedIn,
    isValidCustomer,
    isValidCustomerApi,
    // isValidStaff,
    isStaffApi,
    isStaff,
    isAdminApi,
    isAdmin
}