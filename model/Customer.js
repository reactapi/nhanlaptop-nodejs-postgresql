const { queryDatabase }  = require('./database')

class Customer {

    async create(data) {
        try {

            const { customerId, email, name, hashPassword } = data

            let sql = `insert into customer(customer_id, email, full_name, password) values($1, $2, $3, $4)`
            const result = await queryDatabase(sql, [customerId, email, name, hashPassword])

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async getCount() {
        try {

            const sql = `select count(*) as count from customer`
            const result = await queryDatabase(sql)

            return result[0]['count']
        } catch (error) {
            return {
                error
            }
        }
    }

    async addAddress(data) {
        try {

            const { userId, address } = data

            const sql = `insert into address(customer_id, address) values($1, $2)`

            const result = await queryDatabase(sql, [userId, address])

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async getAll({page = 1, pageSize = 5}) {
        try {

            const start = (page - 1) * pageSize

            const sql = `select * from customer limit $1 offset $2`
            const result =  await queryDatabase(sql, [pageSize, start])
            return result
            
        } catch (error) {
            return {
                error
            }
        }
    }

    async getAllAddress(customerId) {
        try {


            const sql = `select * from customer, address 
            where customer.customer_id = address.customer_id and customer.customer_id = $1`

            const result = await queryDatabase(sql, [customerId])
            return result
        } catch (error) {
            return {
                error
            }
        }
    }

    async updateAddress(data) {
        try {

            const { id, userId, address } = data

            const sql = `update address set address = $1 where id = $2 and customer_id = $3`

            const result = await queryDatabase(sql, [address, id, userId])

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async updatePassword(data) {
        try {

            const { hashPassword, customerId } = data

            const sql = `update customer set password = $1 where customer_id = $2`
            const result = await queryDatabase(sql, [hashPassword, customerId])

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async resetPassword(data) {
        try {

            const { hashPassword, customerId } = data

            const sql = `update customer set password = $1, code_verify = '' where customer_id = $2`
            const result = await queryDatabase(sql, [hashPassword, customerId])

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async updateCodeToVerify(data) {
        try {

            const { code, customerId } = data

            const sql = `update customer set code_verify = $1 where customer_id = $2`
            const result = await queryDatabase(sql, [code, customerId])

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async verifyCode(data) {
        try {

            const { code } = data

            const sql = `select * from customer where code_verify = $1`
            const result = await queryDatabase(sql, [code])
            return result[0]
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async updateAvatar(data) {
        try {

            const { avatar, publicId, customerId } = data

            const sqlUpdate = `update customer set avatar = $1, public_id = $2
                                where customer_id = $3`
            const result1 = await queryDatabase(sqlUpdate, [avatar,
                publicId, customerId]) 

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async updateProfile(data) {
        try {

            const { name, customerId } = data

            const sqlUpdate = `update customer set full_name = $1
                                where customer_id = $2`
            const result1 = await queryDatabase(sqlUpdate, [name, customerId]) 

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async updateStatus(data) {
        try {

            const { customerId, status } = data

            const sqlUpdate = `update customer set code_verify = '', status = $1
                                where customer_id = $2`
            const result1 = await queryDatabase(sqlUpdate, [status, customerId]) 

            return data
            
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async findById(id) {
        try {

            let sql = `select * from customer where customer_id = $1`
            const customer = await queryDatabase(sql, [id])
            return customer[0]

        } catch (error) {
            return {
                error
            }
        }
    }


    async findByEmail(email) {
        try {

            let sql = `select * from customer where email = $1`
            const customer = await queryDatabase(sql, [email])
            return customer[0]

        } catch (error) {
            return {
                error
            }
        }
    }

    async deleteById(id) {
        try {

            const sql = `delete from customer where id = $1`
            const result = await queryDatabase(sql, [id])

            return id

        } catch (error) {
            return {
                error
            }
        }
    }

    async deleteAddress(data) {
        try {

            const { id, userId } = data

            const sql = `delete from address where id = $1 and customer_id = $2`

            const result = await queryDatabase(sql, [id, userId])

            return data

        } catch (error) {
            return {
                error
            }
        }
    }

}

module.exports = new Customer