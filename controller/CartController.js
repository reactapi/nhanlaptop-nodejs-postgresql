const {queryDatabase} = require('../model/database');
const cartModel = require('../model/Cart')
const helper = require('../helper');
const { transporter } = require('../services/nodemailer')

class CartController {

    async getRevenueForChart(req, res) {
        try {
            const data = await cartModel.getRevenueLifeTime()
            
            res.json({
                status: 'success',
                data
            })

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async getBestSellerForChart(req, res) {
        try {
            const { limit } = req.query
            const data = await cartModel.findBestSellerProduct({limit: limit})
            
            res.json({
                status: 'success',
                data
            })

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async getCartForChart(req, res) {
        try {
            
            let sql = `select count(*) as count, DATE(created_at) as date from cart 
                        GROUP by DATE(created_at)
                        ORDER BY DATE(created_at)`
            let data = await queryDatabase(sql)
            
            res.json({
                status: 'success',
                data
            })

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async getCart(req, res) {
        try {
            
            let user = ''
            if (req.user) {
                user = req.user
            } 

            let data = await cartModel.getAll()
            
            res.json({
                status: 'success',
                length: data.length,
                data
            })

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async getCartById(req, res) {
        try {
            
            const user = req.user

            const { id } = req.params

            let data = []
            if (user.role < 1) {
                
                data = await cartModel.findByIdAndCustomerId({
                    id: id,
                    customerId: user.userId
                })
                
            } else {
                data = await cartModel.findById(id)
            }

            
            res.json({
                status: 'success',
                data,
                totalCart: data[0]['totalCart'],
                statusCart: data[0]['status']
            })

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async addCart(req, res) {
        try {
            
            let user = ''
            if (req.user) {
                user = req.user
            } 

            const userId = user.userId

            const { fullName, phoneNumber, email, fullAddress, total, payMethod, cart } = req.body
            
            const cartId = helper.randomString(10)

            const result = await cartModel.create({
                cartId, userId, fullName, phoneNumber, email, fullAddress, total, payMethod, cart
            })

            

            const htmlProducts = JSON.parse(cart).map(product => {
                const totalItem = product.quantity * product.productPrice
                return `<div style="font-size: 16px">
                            <img style="width: 200px;" src="${product.productThumbnail}" alt="" />
                            <p>Tên sản phẩm: ${product.productName}</p>
                            <p>Số lượng: ${product.quantity}</p>
                            <p>Thành tiền: ${totalItem}</p>
                        </div>`
            })

            const resultSendMail = await transporter.sendMail({
                from: '"NHAN LAPTOP" <project.php.nhncomputer@gmail.com>',
                to: email,
                subject: `[NHAN LAPTOP] đã nhận đơn hàng ${cartId}`,
                html: ` <h3>Xin chào ${fullName},</h3>
                        <h3>Cảm ơn bạn đã đặt hàng tại NHAN LAPTOP</h3>
                        <h3>Đơn hàng được giao đến:</h3>
                        <p>Họ và tên: ${fullName}</p>
                        <p>Địa chỉ: ${fullAddress}</p>
                        <p>Điện thoại: ${phoneNumber}</p>
                        <p>Email: ${email}</p>
                        <h2>Kiện hàng</h2>
                        <div>${htmlProducts}</div>
                        <h2> Tổng giá trị đơn hàng: ${helper.formatPrice(total)} VNĐ</h2>
                        <p>Trân trọng,</p>
                        <p><b>NHAN LAPTOP</b></p>`
            })

            console.log(resultSendMail)
            
            res.json({
                status: 'success',
                result
            })

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async updateStatusCart(req, res) {
        try {
            
            const { id } = req.params

            const { status } = req.body

            const result = await cartModel.updateStatus({
                id,
                status
            })

            res.json({
                status: 'success',
                message: 'Thay đổi thành công!'
            })

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

   
}

module.exports = new CartController;


