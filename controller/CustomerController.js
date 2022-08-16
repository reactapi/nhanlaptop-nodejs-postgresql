const customerModel = require('../model/Customer')
const orderModel = require('../model/Order')
const helper = require('../helper');
const bcrypt = require('bcrypt')
const { cloudinary, uploadToCloudinary } = require('../config/cloudinary')
const { transporter } = require('../config/nodemailer')

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
                success: req.flash('success'),
                error: req.flash('error'),
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

    async handleVerifyAccount(req, res) {
        try {
            const { userId, fullName, email } = req.user

            const customer = await customerModel.findById(userId)

            if (customer.status === 1) {
                req.flash('success', 
                `Tài khoản của bạn đã được xác minh!`)
                return res.redirect(`/customer/${userId}`) 
            }

            const code =  helper.randomString(50)
            const result = await customerModel.updateCodeToVerify({
                code: code,
                customerId: userId
            })

            const { error } = result

            if (!error) {
                const link = `${process.env.URL_SERVER}/customer/verify/${code}`
                const resultSendMail = await transporter.sendMail({
                    from: '"NHANLAPTOP" <project.php.nhncomputer@gmail.com>',
                    to: email,
                    subject: `[NHANLAPTOP] Xác minh tài khoản của bạn`,
                    html: ` <h2>Xin chào bạn ${fullName},</h2>
                            <p>Bạn vui lòng nhấp vào đường dẫn bên dưới để xác minh tài khoản của bạn.</p>
                            <a href="${link}"><h3>Đặt lại mật khẩu</h3></a>
                            <p>Trân trọng,</p>
                            <p><b>NHANLAPTOP</b></p>`
                })

                req.flash('success', 
                `Một email đã được gửi đến ${email}. Vui lòng mở email và làm theo hướng dẫn để xác minh!.`)
                return res.redirect('back') 
            }
            

        } catch (error) {
            console.log('err', error)
            req.flash('error', 'Có lỗi xảy ra!')
            return res.redirect('back') 
        }
    }


    async handleActiveAccountStatus(req, res) {
        try {
            const { code } = req.params
            const user = await customerModel.verifyCode({code: code})

            if (user) {
                const result = await customerModel.updateStatus({
                    status: 1,
                    customerId: user.customer_id
                })
                req.flash('success', 'Xác minh tài khoản thành công!')
                return res.redirect(`/customer/${user.customer_id}`) 
            }
            return res.json({message: "Code không hợp lệ"})

        } catch (error) {
            console.log('err', error)
            return res.json({message: "Code không hợp lệ"})
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

            const user = await customerModel.verifyCode({code: code})
            
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

            const result = await customerModel.findById(userId)

            const { avatar, public_id } = result

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


