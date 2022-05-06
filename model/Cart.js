const { queryDatabase }  = require('./database')

class Cart {

    async create(data) {
        try {

            const date = new Date()
            const createdAt = date.toISOString().slice(0, 10) + " " + date.toLocaleTimeString('en-GB')

            const { cartId, userId, fullName, phoneNumber, email, fullAddress, total, payMethod, cart } = data

            const sql = `insert into cart(cart_id, customer_id, full_name, phone_number, email, address, created_at, total, pay_method, status) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
            const result1 = await queryDatabase(sql, [cartId, userId, fullName, phoneNumber, email, fullAddress, createdAt, total, payMethod, 0])

            const products = JSON.parse(cart)

            products.forEach(async (product) => {
                // let product = products[i]
                let totalItem = product.quantity * product.productPrice
                let sql2 = `insert into cart_detail values($1, $2, $3, $4)`
                let result2 = await queryDatabase(sql2, [cartId, product.productId, product.quantity, totalItem])
            })

            return data
            
        } catch (error) {
            console.log(error)
            return error
        }
        
    }

    async getAll({page = 1, pageSize = 5}) {
        try {

            const start = (page - 1) * pageSize

            const sql = `select * from cart order by created_at desc limit $1 offset $2`
            const result =  await queryDatabase(sql, [pageSize, start])
            return result
            
        } catch (error) {
            return error
        }
    }

    async getCount() {
        try {

            const sql = `select count(*) as count from cart`
            const result = await queryDatabase(sql)

            return result[0]['count']
        } catch (error) {
            return error
        }
    }

    async getRevenue() {
        try {

            const sql = `select sum(total) as total from cart where status = 3`
            const result = await queryDatabase(sql)

            return result[0]['total']
        } catch (error) {
            return error
        }
    }

    async getAllCartByCustomer(customerId) {
        try {

            const sql = `select * from cart where customer_id = $1 order by created_at desc`
            const result = await queryDatabase(sql, [customerId])

            return result
        } catch (error) {
            return error
        }
    }

    async updateStatus(data) {
        try {

            const { id, status } = data

            const sql = `update cart set status = $1 where cart_id = $2`
            const result = await queryDatabase(sql, [status, id])

            return data

        } catch (error) {
            console.log(error)
            return error
        }
        
    }

    async findByIdAndCustomerId({id, customerId}) {
        try {

            const sql = ` select *, cart_detail.total as total_item , cart.total as total_cart
                            from cart_detail, product, cart
                            where cart.cart_id = $1
                            and cart_detail.product_id = product.product_id
                            and cart.cart_id = cart_detail.cart_id
                            and cart.customer_id = $2`
            const result = await queryDatabase(sql, [id, customerId])

            return result

        } catch (error) {
            return error
        }
    }

    async findById(id) {
        try {

            const sql = `   select *, cart_detail.total as total_item from cart_detail, product, cart
                            where cart.cart_id = $1
                            and cart_detail.product_id = product.product_id
                            and cart.cart_id = cart_detail.cart_id`
            const result = await queryDatabase(sql, [id])

            return result

        } catch (error) {
            return error
        }
    }

    async deleteById(id) {
        // Chua xong
        try {

            const sql = `delete from category where id = $1`
            const result = await queryDatabase(sql, [id])

            return id

        } catch (error) {
            return error
        }
    }

    // Dashboard

    async getRevenueLifeTime() {
        try {

            const sql = ` select sum(total) as total, DATE(created_at) as date from cart 
                        where status = 3
                        GROUP by DATE(created_at)`
            const result = await queryDatabase(sql)

            return result

        } catch (error) {
            return error
        }
    }

    async findBestSellerProduct({limit = 4}) {
        try {

            const sql = ` select product.product_id, product.name, count(*) as count from product, cart_detail
                        where product.product_id = cart_detail.product_id
                        GROUP by product.product_id, product.name
                        order by count(*) desc
                        limit $1`
            const result = await queryDatabase(sql, [limit])

            return result

        } catch (error) {
            return error
        }
    }

}

module.exports = new Cart