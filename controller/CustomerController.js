const {queryDatabase} = require('../model/database');
const customerModel = require('../model/Customer')
const orderModel = require('../model/Order')
const helper = require('../helper');
const bcrypt = require('bcrypt')
const { cloudinary, uploadToCloudinary } = require('../services/cloudinary')


class CustomerController {

    async index (req, res) {

        try {

            const customer = req.user

            const { userId } = customer

            let dataAddress = await customerModel.getAllAddress(userId)

            if (dataAddress.length <= 0) {
                dataAddress = []
            }

            res.render('customer/index', {
                customer: customer, 
                address: dataAddress,
                helper: helper, 
            })
            
        } catch (error) {
            res.json({
                error
            })
        }

    }

    async updateProfile(req, res) {
        try {

            const { name } = req.body
            const { userId } = req.user

            const result = await customerModel.updateProfile({
                name, 
                customerId: userId
            })

            req.flash('success', 'Cập nhật thành công!')
            return res.redirect('back')
            
        } catch (error) {
            req.flash('error', 'Cập nhật thất bại!')
            return res.redirect('back')
        }
    }

    async addAddress(req, res) {
        try {

            const { address } = req.body
            const { userId } = req.user

            const result = await customerModel.addAddress({
                userId,
                address
            })

            res.status(201).json({
                status: 'success'     
            })
            
        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async updateAddress(req, res) {
        try {

            const { address } = req.body
            const { userId } = req.user
            const id = req.params.id


            const result = await customerModel.updateAddress({
                id,
                userId,
                address
            })

            res.status(200).json({
                status: 'success',
                id, 
                userId,
                address
            })
            
        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async deleteAddress(req, res) {
        try {

            const { userId } = req.user
            const id = req.params.id

            let result = await customerModel.deleteAddress({
                id,
                userId
            })

            res.status(200).json({
                status: 'success',
                id, 
                userId,
            })
            
        } catch (error) {
            console.log(error)
            res.json({
                status: 'error',
                error
            })
        }
    }

    async showMyOrder (req, res) {

        try {

            const customerId = req.params.customerId
            const customer = req.user


            const dataCart = await orderModel.getAllOrderByCustomer(customerId)

            res.render('customer/order', {
                customer,
                helper,
                dataCart
            })
            
        } catch (error) {
            res.json({
                error
            })
        }

    }

    async getChangePassword(req, res) {
        try {
            const customer = req.user

            res.render('customer/security', {
                customer,
                helper,
                csrfToken: req.csrfToken()
            })

        } catch (error) {
            res.json({
                error
            })
        }
    }

    
    async handleResetPassword (req, res) {
        try {
            const { code, password } = req.body

            const user = await customerModel.verifyCodeToResetPassword({code: code})
            
            if (user) {
                const hashPassword = await bcrypt.hash(password, 10)
                const result = await customerModel.resetPassword({
                    hashPassword: hashPassword,
                    customerId: user.customer_id
                })
                req.flash('success', 'Đổi mật khẩu thành công!')
                return res.redirect('/auth/login') 
            }

            req.flash('error', 'Code không hợp lệ!')
            return res.redirect('back') 
          
            
        } catch (error) {
            console.log('err', error)
            req.flash('error', 'Có lỗi xảy ra!')
            return res.redirect('back') 
        }
    }

    async changePasswordCustomer(req, res) {

        try {
            const user = req.user
            const { currentPassword, newPassword } = req.body

            const dataCustomer = await customerModel.findById(user.userId)

            if (dataCustomer) {
             
                const passwordInDatabase = dataCustomer['password']
                const checkPassword = await bcrypt.compare(currentPassword, passwordInDatabase)

                if (checkPassword) {
                    const hashPassword = await bcrypt.hash(newPassword, 10)
                
                    const result = await customerModel.updatePassword({
                        hashPassword: hashPassword,
                        customerId: user.userId
                    })

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
            console.log(error)
            return res.json({
                status: 'error',
                error
            })
        }

    }

    async getUpdateAvatar(req, res) {
        try {
            const customer = req.user

            res.render('customer/avatar', {
                customer,
                helper,
                success: req.flash('success'),
                error: req.flash('error')
            })

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async postUpdateAvatar(req, res) {

        try {
            const user = req.user

            const { userId } = user

            const sql = `select avatar, public_id from customer where customer_id = $1`

            const result = await queryDatabase(sql, [userId])

            const { avatar, public_id } = result[0]

            if (avatar && public_id) {
                // TH da co avatar, call xoa tren Cloudinary
                cloudinary.uploader.destroy(public_id, async function(err, result) {

                    if (err) return res.res.redirect('back')
                    const file = req.file
                    const uploadAvatar = await uploadToCloudinary(cloudinary, file.path, {folder: 'NHANLAPTOP'})
                    const secureUrl = uploadAvatar.secure_url
                    const publicId = uploadAvatar.public_id

                    if (secureUrl && publicId) {
                        const result1 = await customerModel.updateAvatar({
                            avatar: secureUrl,
                            publicId: publicId,
                            customerId: userId
                        })
                    }
                    req.flash('success', 'Cập nhật thành công!')
                    return res.redirect('back')
           
                })
            } else {
                // TH chua co avatar
                const file = req.file
                const uploadAvatar = await uploadToCloudinary(cloudinary, file.path, {folder: 'NHANLAPTOP'})
                const secureUrl = uploadAvatar.secure_url
                const publicId = uploadAvatar.public_id

                if (secureUrl && publicId) {
                    const result1 = await customerModel.updateAvatar({
                        avatar: secureUrl,
                        publicId: publicId,
                        customerId: userId
                    })
                }
                req.flash('success', 'Cập nhật thành công!')
                return res.redirect('back')

            }


        } catch (error) {

            console.log(error)
            req.flash('error', 'Cập nhật thất bại!')
            return res.redirect('back')
        }

    } 
   
}

module.exports = new CustomerController;


