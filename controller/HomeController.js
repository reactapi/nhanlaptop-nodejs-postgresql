const {queryDatabase} = require('../model/database');
const customerModel = require('../model/Customer')
const productModel = require('../model/Product')
const helper = require('../helper');

class SiteController {
    // res.render('home');
    async index(req, res) {
        try {
            let user = ''
            if (req.user) {
                user = req.user
            } 

            // console.log(user)

            const sql = `select * from product, laptop_specification 
                        where laptop_specification.product_id = product.product_id
                        and product.product_type = 1 
                        order by created_at desc
                        limit 10 offset 0`
            const data = await queryDatabase(sql)
            res.render('pages/index', {
                user: user,
                data: data,
                helper: helper,
                description: 'Cửa hàng Laptop, máy tính xách tay, Laptop Gaming, Laptop Văn Phòng chính hãng chất lượng cao của nhiều thương hiệu lớn, giao hàng toàn quốc, bảo hành lâu dài'
            })

        } catch (error) {
            console.log(error)
        }
    }

    async showSearchPage(req, res) {
        try {
            let user = ''
            if (req.user) {
                user = req.user
            } 
            const { q } = req.query
            let keywordToArray = q.split(' ')
            let multileWord = keywordToArray.join('%')
            const paramSearch = `%${multileWord}%`
            const sql = ` select * from product
                        where product.name ilike $1`
            const result = await queryDatabase(sql, [paramSearch])
            let data = []
            for(let i = 0; i < result.length; i++) {
                const product = result[i]
                const result1 = await productModel.findProductById(product.product_id)
                data.push(result1)
            }
            res.render('pages/search', {
                user,
                data,
                helper,
                q,
            })
            
        } catch (error) {
            console.log(error)
            res.render('pages/404')
        }
    }

    async showCartPage(req, res) {
        try {
            let user = ''
            if (req.user) {
                user = req.user
            } 
            res.render('pages/cart', {
                user,
                helper
            })
            
        } catch (error) {
            console.log(error)
            res.render('pages/404')
        }
    }

    async showCheckoutPage(req, res) {
        try {
            let user = ''
            if (req.user) {
                user = req.user
                
                if (parseInt(user.status) === 0) {
                    req.flash('error', 'Tài khoản của bạn chưa được xác minh! Không thể đặt hàng!')
                    return res.redirect(`/customer/${user.userId}`)
                }

                const data = await customerModel.getAllAddress(user.userId)
                return res.render('pages/checkout', {
                    user,
                    address: data,
                    helper
                })
            } 
            return res.redirect(`/auth/login?goto=${process.env.URL_SERVER}/gio-hang/thanh-toan`)
            
        } catch (error) {
            console.log(error)
            res.render('pages/404')
        }
    }
}

module.exports = new SiteController;


