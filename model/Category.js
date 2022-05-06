const { queryDatabase }  = require('./database')

class Category {

    async create(data) {
        try {

            const { name, categorySlug, parentId } = data

            const sql = `insert into category(name, slug, parent_id) values($1, $2, $3)`
            const result = await queryDatabase(sql, [name, categorySlug, parentId])

            return data
            
        } catch (error) {
            console.log(error)
            return error
        }
        
    }

    async getCount() {
        try {

            const sql = `select count(*) as count from category`
            const result = await queryDatabase(sql)

            return result[0]['count']
        } catch (error) {
            return error
        }
    }

    async getAll({page = 1, pageSize = 3}) {
        try {

            const start = (page - 1) * pageSize


            const sql = `select * from category limit $1 offset $2`
          
            const result =  await queryDatabase(sql, [pageSize, start])
            return result
        } catch (error) {
            return error
        }
    }

    async update(data) {
        try {

            const { categoryId, name, categorySlug, parentId } = data

            const sql = `update category set name = $1, slug = $2, parent_id = $3 where id = $4`
            const result = await queryDatabase(sql, [name, categorySlug, parentId, categoryId])

            return data

        } catch (error) {
            console.log(error)
            return error
        }
        
    }

    async findById(id) {
        try {

            const sql = `select * from category where id = $1`
            const result = await queryDatabase(sql, [id])

            return result[0]

        } catch (error) {
            return error
        }
    }

    async deleteById(id) {
        try {

            const sql = `delete from category where id = $1`
            const result = await queryDatabase(sql, [id])

            return id

        } catch (error) {
            return error
        }
    }

}

module.exports = new Category