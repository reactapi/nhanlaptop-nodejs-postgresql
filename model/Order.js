const { queryDatabase }  = require('./database')

class Order {

    async create(data) {
        try {

            const date = new Date()
            const createdAt = date.toISOString().slice(0, 10) + " " + date.toLocaleTimeString('en-GB')

            const { orderId, userId, fullName, phoneNumber, email, fullAddress, total, payMethod, cart } = data

            const sql = `insert into tblorder(order_id, customer_id, full_name, phone_number, email, address, created_at, total, pay_method, status) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
            const result1 = await queryDatabase(sql, [orderId, userId, fullName, phoneNumber, email, fullAddress, createdAt, total, payMethod, 0])

            const products = JSON.parse(cart)

            products.forEach(async (product) => {
                // let product = products[i]
                let totalItem = product.quantity * product.productPrice
                let sql2 = `insert into order_detail values($1, $2, $3, $4)`
                let result2 = await queryDatabase(sql2, [orderId, product.productId, product.quantity, totalItem])
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

            const sql = `select * from tblorder order by created_at desc limit $1 offset $2`
            const result =  await queryDatabase(sql, [pageSize, start])
            return result
            
        } catch (error) {
            return error
        }
    }

    async getCount() {
        try {

            const sql = `select count(*) as count from tblorder`
            const result = await queryDatabase(sql)

            return result[0]['count']
        } catch (error) {
            return error
        }
    }

    async getRevenue() {
        try {

            const sql = `select sum(total) as total from tblorder where status = 3`
            const result = await queryDatabase(sql)

            return result[0]['total']
        } catch (error) {
            return error
        }
    }

    async getAllOrderByCustomer(customerId) {
        try {

            const sql = `select * from tblorder where customer_id = $1 order by created_at desc`
            const result = await queryDatabase(sql, [customerId])

            return result
        } catch (error) {
            return error
        }
    }

    async updateStatus(data) {
        try {

            const { id, status } = data

            const sql = `update tblorder set status = $1 where order_id = $2`
            const result = await queryDatabase(sql, [status, id])

            return data

        } catch (error) {
            console.log(error)
            return error
        }
        
    }

    async findByIdAndCustomerId({id, customerId}) {
        try {

            const sql = ` select *, order_detail.total as total_item , tblorder.total as total_order
                            from order_detail, product, tblorder
                            where tblorder.order_id = $1
                            and order_detail.product_id = product.product_id
                            and tblorder.order_id = order_detail.order_id
                            and tblorder.customer_id = $2`
            const result = await queryDatabase(sql, [id, customerId])
            return result

        } catch (error) {
            return error
        }
    }

    async findById(id) {
        try {

            const sql = `   select *, order_detail.total as total_item from order_detail, product, tblorder
                            where tblorder.order_id = $1
                            and order_detail.product_id = product.product_id
                            and tblorder.order_id = order_detail.order_id`
            const result = await queryDatabase(sql, [id])

            return result

        } catch (error) {
            return error
        }
    }

    async isOrdered(id) {
        try {

            const sql = `   select * from order_detail
                            where product_id = $1 `
            const result = await queryDatabase(sql, [id])

            return result && result.length > 0

        } catch (error) {
            return error
        }
    }

    // Dashboard

    async getRevenueLifeTime() {
        try {

            const sql = ` select sum(total) as total, DATE(created_at) as date from tblorder 
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

            const sql = `select product.product_id, product.name, sum(quantity) as count 
                        from tblorder, order_detail, product
                        where tblorder.order_id = order_detail.order_id
                        and order_detail.product_id = product.product_id
                        GROUP by product.product_id
                        order by sum(quantity)  desc
                        limit $1`
            const result = await queryDatabase(sql, [limit])

            return result

        } catch (error) {
            return error
        }
    }

}

module.exports = new Order