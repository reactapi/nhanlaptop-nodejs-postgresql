const staffModel = require('../model/Staff')
const helper = require('../helper')
const bcrypt = require('bcrypt');
const { transporter } = require('../config/nodemailer')

class StaffController {

    async handleCreateStaff(req, res) {

        try {

            const { email, fullName } = req.body


            const user = await staffModel.findByEmail(email)

            if (user) {
                req.flash('error', 'Thêm nhân viên thất bại! Email đã tồn tại.')
                return res.redirect('/nhanlaptop-admin/staff')
            } else {
                
                try {
                    const newUserId = helper.randomString(10)
                    const password = helper.randomString(10)
                    const hashPassword = await bcrypt.hash(password, 10)
                 
                    const result = await staffModel.create({
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
                    
                    req.flash('success', 'Thêm nhân viên hành công!')
                    return res.redirect('/nhanlaptop-admin/staff')
    
                } catch (error) {
                    console.log(error)
                    req.flash('error', 'Thêm nhân viên thất bại!')
                    return res.redirect('/nhanlaptop-admin/staff')
                }
    
            }
         
            
        } catch (error) {
            req.flash('error', 'Thêm nhân viên thất bại!')
            return res.redirect('/nhanlaptop-admin/staff')
        }

    }

    async handleUpdateAccountStatus(req, res) {
        try {

            const { id } = req.params
            const { status } = req.body
            const result = await staffModel.updateStatus({id, status})

            const  { error } = result
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

module.exports = new StaffController;


