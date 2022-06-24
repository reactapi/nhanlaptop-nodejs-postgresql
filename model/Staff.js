const { queryDatabase } = require('./database')

class Staff {

    async create(data) {
        try {

            const { userId, email, fullName, hashPassword, role } = data

            const sql = `insert into administrator(user_id, email, full_name, password, role) values($1, $2, $3 , $4, $5)`
            const result = await queryDatabase(sql, [userId, email, fullName, hashPassword, role])

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

            const sql = `select count(*) as count from administrator where role = 2`
            const result = await queryDatabase(sql)

            return result[0]['count']
        } catch (error) {
            return {
                error
            }
        }
    }

    async getAll({page = 1, pageSize = 5}) {
        try {

            const start = (page - 1) * pageSize

            const sql = `select * from administrator where role = 2 limit $1 offset $2`
            const result =  await queryDatabase(sql, [pageSize, start])
            return result
            
        } catch (error) {
            return {
                error
            }
        }
    }

    async findById(id) {
        try {

            let sql = `select * from administrator where user_id = $1`
            const user = await queryDatabase(sql, [id])
            return user[0]

        } catch (error) {
            return {
                error
            }
        }
    }


    async findByEmail(email) {
        try {

            let sql = `select * from administrator where email = $1`
            const user = await queryDatabase(sql, [email])
            return user[0]

        } catch (error) {
            return {
                error
            }
        }
    }

    async deleteById(id) {
        try {

            const sql = `delete from administrator where user_id = $1`
            const result = await queryDatabase(sql, [id])

            return id

        } catch (error) {
            return {
                error
            }
        }
    }

    

}

module.exports = new Staff