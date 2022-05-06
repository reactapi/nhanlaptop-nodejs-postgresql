const customerModel = require('../model/Customer')
const helper = require('../helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
            helper
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

    getResetPassword (req, res) {
        let user = ''
        if (req.user) {
            return res.redirect('back')
        } 
        res.render('pages/reset-password', {
            user,
            helper,
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


