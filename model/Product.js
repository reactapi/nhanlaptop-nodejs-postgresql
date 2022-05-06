const { queryDatabase }  = require('./database')

class Product {

    async create(data) {
        try {
            const date = new Date()
            const createdAt = date.toISOString().slice(0, 10) + " " + date.toLocaleTimeString('en-GB')

            const { productId, productType, category, brand, productName, productSlug, productPrice, productDiscount,
                productStatus, secure_url, public_id } = data

            const sqlInsertProduct = `insert into product values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
            const result1 = await queryDatabase(sqlInsertProduct, [productId, 
            productType, productSlug, category, productName, brand, secure_url, public_id, 
            productPrice, productDiscount, createdAt, productStatus ])

            if (productType == 1) {
                const { productCpu, productCpuDetail, productHardDrive, productHardDriveDetail,
                    productRam, productGraphics, productScreen, productWeight } = data

                const sql = `insert into laptop_specification(product_id, cpu, cpu_detail, 
                            ram, hard_drive_size, hard_drive_desc, graphics, screen, weight)
                            values($1, $2, $3, $4, $5, $6, $7, $8, $9)`
                const result2 = await queryDatabase(sql, [productId, productCpu, productCpuDetail,
                productRam, productHardDrive, productHardDriveDetail, productGraphics, productScreen, productWeight])
                
                return data
            } else {
                const { description, info } = data
                const sql = `insert into accessories_info(product_id, description, info)
                            values($1, $2, $3)`
                const result2 = await queryDatabase(sql, [productId, description, info])
                return data
            }
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async addReview(data) {
        try {

            const { productId, content } = data

            const sql = `insert into product_review values($1, $2)`
            const result = await queryDatabase(sql, [productId, content])
                
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

            const sql = `select product.*,  category.name as category_name from product, category
                        where product.category_id = category.id
                        order by created_at desc
                        limit $1 offset $2`
            const result =  await queryDatabase(sql, [pageSize, start])
            return result
        } catch (error) {
            return {
                error
            }
        }
    }

    async getCount() {
        try {

            const sql = `select count(*) as count from product`
            const result = await queryDatabase(sql)

            return result[0]['count']
        } catch (error) {
            return {
                error
            }
        }
    }

    async getTypeOfProductById(id) {
        try {

            const sql = `select product_type.id as id, product_type.name as name 
                        from product, product_type
                        where product.product_type = product_type.id
                        and product_id = $1`
            const result = await queryDatabase(sql, [id])

            return result[0]
        } catch (error) {
            return {
                error
            }
        }
    }



    async update(data) {
        try {

            const { productId, productType, category, brand, productName, productSlug, productPrice, productDiscount,
                productStatus } = data

            const sqlUpdateProduct = `update product set category_id = $1, name = $2, slug = $3, 
                                        brand = $4, price = $5, discount = $6, status = $7
                                        where product_id = $8`

            const result1 = await queryDatabase(sqlUpdateProduct, [category, productName,
            productSlug, brand, productPrice, productDiscount, productStatus, productId])

           
            if (productType == 1) {
                const { productCpu, productCpuDetail, productHardDrive, productHardDriveDetail,
                    productRam, productGraphics, productScreen, productWeight } = data

                    const sqlUpdateSpec = `update laptop_specification
                    set cpu = $1 , cpu_detail = $2, ram = $3, hard_drive_size = $4, hard_drive_desc = $5, 
                    graphics = $6, screen = $7, weight = $8 where product_id = $9`
    
                    const result2 = await queryDatabase(sqlUpdateSpec, [productCpu, productCpuDetail,
                    productRam, productHardDrive, productHardDriveDetail, productGraphics, productScreen,
                    productWeight, productId])
                
                return data
            } else {
                const  { description } = data
                const sqlUpdateInfo = `update accessories_info
                set description = $1 where product_id = $2`
                const result2 = await queryDatabase(sqlUpdateInfo, [description, productId])
            }
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async updateThumbnail(data) {
        try {

            const { secureUrl, publicId, productId } = data

            const sql = `update product set thumbnail = $1, public_id = $2
                                where product_id = $3`
            const result = await queryDatabase(sql, [secureUrl,
            publicId, productId]) 
                
            return data
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async updateReview(data) {
        try {

            const { productId, content } = data

            const sql = `update product_review set content = $1 where product_id = $2`

            const result = await queryDatabase(sql, [content, productId])

            return data
        } catch (error) {
            console.log(error)
            return {
                error
            }
        }
        
    }

    async findLaptopBySlug(slug) {
        try {
            const sql = `select * from product, laptop_specification
                    where laptop_specification.product_id = product.product_id 
                    and product.slug = $1`
            const result = await queryDatabase(sql, [slug])
            return result[0]
        } catch (error) {
            return {
                error
            }
        }
        
    }

    async findAccessoriesBySlug(slug) {
        try {
            const sql = `select * from product, accessories_info
                    where accessories_info.product_id = product.product_id 
                    and product.slug = $1`
            const result = await queryDatabase(sql, [slug])
            return result[0]
        } catch (error) {
            return {
                error
            }
        }
        
    }

    async findProductById(id) {
        try {

            const dataProductType = await this.getTypeOfProductById(id)
            if (!dataProductType) return null
            const { id: productType } = dataProductType
            let sql = ``
            if (productType === 1) {
                sql = `   select * from product, laptop_specification 
                        where laptop_specification.product_id = product.product_id 
                        and product.product_id = $1`
            } else {
                sql = `   select * from product, accessories_info 
                        where accessories_info.product_id = product.product_id 
                        and product.product_id = $1`
                
            }

            const result = await queryDatabase(sql, [id])
            return result[0]

        } catch (error) {
            return {
                error
            }
        }
    }

    async findProductBySlug(slug) {
        try {

            const sql = `select * from product where slug = $1`

            const result = await queryDatabase(sql, [slug])
            return result[0]

        } catch (error) {
            return {
                error
            }
        }
    }

    async findRelatedLaptop({id, brand, category, ram, cpu}) {
        try {
            const sql = `select * from product, laptop_specification 
                    where (brand = $1 or product.category_id = $2
                    or ram in($3) or cpu in($4)) 
                    and laptop_specification.product_id = product.product_id
                    and product.product_id != $5
                   `
            const result = await queryDatabase(sql, [brand, category, ram, cpu, id])
            return result
        } catch (error) {
            return {
                error
            }
        }
    }

    async findRelatedAccessories({id, brand, category}) {
        try {
            const sql = `select * from product, accessories_info 
                    where (brand = $1 or product.category_id = $2 or product_type = 2) 
                    and accessories_info.product_id = product.product_id
                    and product.product_id != $3`
            const result = await queryDatabase(sql, [brand, category, id])
            return result
        } catch (error) {
            return {
                error
            }
        }
    }

    async findReviewByProductId(id) {
        try {

            const sql = `select * from product_review where product_id = $1`
            const result = await queryDatabase(sql, [id])
            return result[0]

        } catch (error) {
            return {
                error
            }
        }
    }

    async deleteById(id) {
        try {

            const sql1  = `delete from laptop_specification where product_id = $1`
            const result1 = await queryDatabase(sql1, [id])

            const sql2 = `delete from product_review where product_id = $1`
            const result2 = await queryDatabase(sql2, [id])

            const sql3 = `delete from product where product_id = $1`
            const result3 = await queryDatabase(sql3, [id])

            return id

        } catch (error) {
            return {
                error
            }
        }
    }

}

module.exports = new Product