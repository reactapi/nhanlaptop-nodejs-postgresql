const customerModel = require('../model/Customer')
const helper = require('../helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { transporter } = require('../services/nodemailer')

class AuthController {

    getRegister (req, res) {
        let user = ''
        if (req.user) {
            return res.redirect('back')
        } 
        res.render('pages/register', {
            user,
            helper
        })
    }

    async postRegister (req, res) {
        const { email, name, password } = req.body
        
        const customer = await customerModel.findByEmail(email)
        
        if (customer) {
            return res.json({
                status: 'error',
            })
        } else {
            
            try {
                const hashPassword = await bcrypt.hash(password, 10)
                const customerId = helper.randomString(10)
             
                const result = await customerModel.create({
                    customerId,
                    email,
                    name,
                    hashPassword
                })
                
                res.status(201).json({
                    status: 'success'     
                })

            } catch (error) {
                res.json({
                    status: 'error',
                    message: error
                })
            }

        }
    }

    getLogin (req, res) {
        let user = ''
        if (req.user) {
            return res.redirect('back')
        } 
        res.render('pages/login', {
            user,
            helper,
            success: req.flash('success'),
            error: req.flash('error')
        })
    }

    async postLogin (req, res) {
        try {
            const { email, password } = req.body

            const customer = await customerModel.findByEmail(email)
            
            if (customer) {
                const customerId = customer['customer_id']
                const passwordInDatabase = customer['password']
                const checkPassword = await bcrypt.compare(password, passwordInDatabase)

                if (checkPassword) {
                    const accessToken = jwt.sign({ userId: customerId }, process.env.JWT_SECRET, { expiresIn: '1h' })
                    res.cookie("token", accessToken, {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60,
                    });
                    return res.json({
                        status: 'success'
                    })
                } else {
                    return res.json({
                        status: 'error',
                        message: 'Tài khoản hoặc mật khẩu không đúng!'
                    })   
                }
            } else {
                return res.json({
                    status: 'error',
                    message: 'Tài khoản hoặc mật khẩu không đúng!'
                })  
            }
            
        } catch (error) {
            res.json({
                status: 'error',
                message: error
            })
        }
      
       
    }

    getForgotPassword (req, res) {
        let user = ''
        if (req.user) {
            return res.redirect('back')
        } 
        res.render('pages/forgot-password', {
            user,
            helper,
            success: req.flash('success'),
            error: req.flash('error')
        })
    }

    async handleForgotPassword(req, res) {

        try {
            const { email } = req.body

            const customer = await customerModel.findByEmail(email)
            
            if (customer) {
                const customerId = customer['customer_id']
                const code =  helper.randomString(50)

                const result = await customerModel.updateCodeToResetPassword({
                    code: code,
                    customerId: customerId
                })

                const  { error } = result

                if (!error) {

                    const link = `${process.env.URL_SERVER}/auth/reset-password/${code}`

                    const resultSendMail = await transporter.sendMail({
                        from: '"NHANLAPTOP" <project.php.nhncomputer@gmail.com>',
                        to: email,
                        subject: `[NHANLAPTOP] Hãy đặt lại mật khẩu tài khoản của bạn`,
                        html: ` <h2>Xin chào bạn ${customer.full_name},</h2>
                                <p>Chúng tôi biết rằng bạn đã mất mật khẩu NHANLAPTOP của mình.</p>
                                <p>
                                    Nhưng đừng lo lắng, bạn có thể truy cập link sau để đặt lại mật khẩu của mình:
                                </p>
                                <a href="${link}"><h3>Đặt lại mật khẩu</h3></a>
                                <p>Trân trọng,</p>
                                <p><b>NHANLAPTOP</b></p>`
                    })

                    req.flash('success', `Hãy kiếm tra email để nhận được link đặt lại mật khẩu.
                                            Có thể mất một vài phút, kiểm tra cả trong thư mục spam`)
                    return res.redirect('back') 

                }


            } else {
                req.flash('error', 'Tài khoản không tồn tại!')
                return res.redirect('back') 
            }
            
        } catch (error) {
            console.log('err', error)
            req.flash('error', 'Có lỗi xảy ra!')
            return res.redirect('back') 
        }

    }

    getResetPassword (req, res) {
        let user = ''
        if (req.user) {
            return res.redirect('back')
        } 
        const { code } = req.params

        res.render('pages/reset-password', {
            user,
            helper,
            code,
            success: req.flash('success'),
            error: req.flash('error')
        })
    }


    logout(req, res) {
        const token = req.cookies.token

        if (token) {
            res.clearCookie('token')
            return res.redirect('/auth/login')
        }
        return res.redirect('/auth/login')
    }

    
   
}

module.exports = new AuthController;


