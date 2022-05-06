const {queryDatabase} = require('../model/database');
const cartModel = require('../model/Cart')
const helper = require('../helper');

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
            
            const data = await cartModel.findBestSellerProduct({limit: 4})
            
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
                        GROUP by DATE(created_at)`
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


