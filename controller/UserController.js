const {queryDatabase} = require('../model/database')
const userModel = require('../model/User')
const helper = require('../helper')
const bcrypt = require('bcrypt');
const { transporter } = require('../services/nodemailer')

class UserController {

    async index(req, res) {

        try {
            const user = req.user

            res.render('user/index', {
                user: user, 
                helper: helper, 
            })
            
        } catch (error) {
            res.json({
                error
            })
        }

    }


    async handleCreateUser(req, res) {

        try {

            const { email, fullName } = req.body

            console.log('controller', {email, fullName})

            const user = await userModel.findByEmail(email)

            if (user) {
                req.flash('error', 'Thêm User thất bại! Email đã tồn tại.')
                return res.redirect('/nhanlaptop-admin/user')
            } else {
                
                try {
                    const newUserId = helper.randomString(10)
                    const password = helper.randomString(10)
                    const hashPassword = await bcrypt.hash(password, 10)
                 
                    const result = await userModel.create({
                        userId: newUserId,
                        email,
                        fullName,
                        hashPassword,
                        role: 2
                    })

                    const resultSendMail = await transporter.sendMail({
                        from: '"NHAN LAPTOP" <project.php.nhncomputer@gmail.com>',
                        to: email,
                        subject: 'Thông tin tài khoản của bạn',
                        html: ` <p>Xin chào,</p>
                                <p>Bạn vừa được cấp tài khoản quyền nhân viên tại NHAN LAPTOP</p>
                                <p>Để đăng nhập, hãy sử dụng thông tin tài khoản dưới đây:</p>
                                <p><b>Tài khoản</b>: <i>${email}</i></p>
                                <p><b>Mật khẩu</b>: <i>${password}</i></p>
                                <p>Trân trọng,</p>
                                <p><b>NHAN LAPTOP</b></p>`
                    })

                    console.log(resultSendMail)
                    
                    req.flash('success', 'Thêm User hành công!')
                    return res.redirect('/nhanlaptop-admin/user')
    
                } catch (error) {
                    console.log(error)
                    req.flash('error', 'Thêm User thất bại!')
                    return res.redirect('/nhanlaptop-admin/user')
                }
    
            }
         
            
        } catch (error) {
            req.flash('error', 'Thêm sản phẩm thất bại!')
            return res.redirect('/nhanlaptop-admin/product')
        }

    }

    async showUserList(req, res) {
        try {
            const user = req.user


            const sql = `select * from administrator`
            const data =  await queryDatabase(sql)

            res.render('admin/user/user-list', {
                user,
                helper,
                data,
            })
            

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async handleDeleteById(req, res) {
        try {

            const { id } = req.params
            const resultDelete = await userModel.deleteById(id)

            const  { error } = resultDelete
            if (!error) {
                return  res.json({
                    status: 'success',
                })
            } else {
                return res.json({
                    status: 'error',
                })
            }

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }
   
}

module.exports = new UserController;


