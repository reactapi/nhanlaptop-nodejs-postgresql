const {queryDatabase} = require('../model/database');
const productModel = require('../model/Product')
const orderModel = require('../model/Order')
const helper = require('../helper');
const { cloudinary, uploadToCloudinary, deleteCloudinary } = require('../config/cloudinary')


class ProductController {
    
    async handleFilterProduct (req, res) {
        try {
            const {category, cpu, ram, brand, sort, hardDriveSize } = req.query
        
            let page = req.query.page ? parseInt(req.query.page) : 1
            let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 4

            let sql = ` select * from product, laptop_specification
                        where laptop_specification.product_id = product.product_id`

            if (category) {
                let categoryFilter = category.join(',')
                sql += ` and product.category_id IN (${categoryFilter})`
            }

            if (cpu) {
                let cpuFilter = cpu.join("','")
                sql += ` and cpu IN ('${cpuFilter}')`
            }
            
            if (ram) {
                let ramFilter = ram.join("','")
                sql += ` and ram IN (${ramFilter})`
            }

            if (brand) {
                let brandFilter = brand.join(',')
                sql += ` and brand IN (${brandFilter})`
            }

            if (hardDriveSize) {
                let hardDriveSizeFilter = hardDriveSize.join("','")
                sql += ` and hard_drive_size IN ('${hardDriveSizeFilter}')`
            }

            if (sort) {
                if (sort == 'new') {
                    sql += ` order by created_at desc`
                } else if (sort == 'discount') {
                    sql += ` order by discount desc`
                } else if (sort == 'price-asc') {
                    sql += ` order by price asc`
                } else if (sort == 'price-desc') {
                    sql += ` order by price desc`
                }
            }

            const data = await queryDatabase(sql)
            const countData = data.length
            const totalPage = Math.ceil(countData / pageSize)

            const start = (page - 1) * pageSize
            sql += ` limit ${pageSize} offset ${start}`

            const result = await queryDatabase(sql)
            
            res.json({
                data: result,
                totalPage: totalPage,
            })
        } catch (error) {
            console.log(error)
            res.json({
                error
            })
        }
    }

    async getAllCpu(req, res) {
        const sql = `select distinct cpu from laptop_specification`
        const data = await queryDatabase(sql)
        if (data.length > 0) {
            res.json({
                message: 'success',
                data: data
            })
        } else {
            res.json({
                message: 'not found',
                data: []
            })
        }
    }


    async getAllRam(req, res) {
        const sql = `select distinct ram from laptop_specification`
        const data = await queryDatabase(sql)
        if (data.length > 0) {
            res.json({
                message: 'success',
                data: data
            })
        } else {
            res.json({
                message: 'not found',
                data: []
            })
        }
    }

    async showLaptopById(req, res) {

        try {
            let user = ''
            if (req.user) {
                user = req.user
            } 

            const productSlug = req.params.slug
            
            const product = await productModel.findLaptopBySlug(productSlug)

            const productId = product.product_id

            const dataReview = await productModel.findReviewByProductId(productId)

            const relatedProduct = await productModel.findRelatedLaptop({
                brand: product['brand'],
                category: product['category_id'],
                cpu: product['cpu'],
                ram: product['ram'],
                id: productId
            })

            res.render('pages/product-laptop', {
                user,
                product: product, 
                dataReview: dataReview,
                relatedProduct: relatedProduct,
                helper: helper, 
                // description: `Laptop ${product['name']}, CPU ${product['cpu']}, Card màn hành ${product['graphics']}, Ổ cứng ${product['hard_drive_size']}`
            })

        } catch (error) {
            console.log(error)
            res.render('pages/404')
        }
    }

    async showAccessoriesById(req, res) {

        try {
            let user = ''
            if (req.user) {
                user = req.user
            } 

            const productSlug = req.params.slug
            
            const product = await productModel.findAccessoriesBySlug(productSlug)

            const productId = product.product_id

            const dataReview = await productModel.findReviewByProductId(productId)

            const relatedProduct = await productModel.findRelatedAccessories({
                brand: product['brand'],
                category: product['category_id'],
                id: productId
            })

            res.render('pages/product-lpk', {
                user,
                product: product, 
                dataReview: dataReview,
                relatedProduct: relatedProduct,
                helper: helper, 
            })

        } catch (error) {
            console.log(error)
            res.render('pages/404')
        }
    }

    async showLaptopFilter(req, res) {
        try {
            let user = ''
            if (req.user) {
                user = req.user
            } 
            
            const { q, brand } = req.query

            let categoryActiveId
            let brandActiveId
            if (q) {
                let sqlGetCategoryActive = `select distinct category.id, category.name
                                            from category
                                            where category.slug = $1`
                const categoryActive = await queryDatabase(sqlGetCategoryActive, [q])
                categoryActiveId = categoryActive[0]['id']
            }

            if (brand) {
                let sqlGetBrandActive = `select distinct brand.id
                                        from brand
                                        where brand.slug = $1`
                const brandActive = await queryDatabase(sqlGetBrandActive, [brand])
                brandActiveId = brandActive[0]['id']
            }

            // get category
            const sqlGetCategory = `select distinct category.id, category.name
                                    from product, category
                                    where category.id = product.category_id
                                    and product.product_type = 1`
            const dataCategory = await queryDatabase(sqlGetCategory)
        
            // get brand
            const sqlGetBrand =    `select distinct brand.id, brand.name from brand, product
                                    where brand.id = product.brand
                                    and product.product_type = 1`
            const dataBrand = await queryDatabase(sqlGetBrand)

            // get cpu
            const sqlGetCpu =   `select distinct cpu from laptop_specification order by cpu`      
            const dataCpu   = await queryDatabase(sqlGetCpu)

            // get ram
            const sqlGetRam =   `select distinct ram from laptop_specification order by ram`      
            const dataRam   = await queryDatabase(sqlGetRam)

            const sqlGetHardDrive = `select distinct hard_drive_size 
                                    from laptop_specification order by hard_drive_size`
            const dataHardDrive = await queryDatabase(sqlGetHardDrive)

            res.render('pages/filter', {
                user,
                dataCategory,
                dataBrand,
                dataCpu,
                dataRam,
                dataHardDrive,
                categoryActiveId,
                brandActiveId,
                helper
            })

        } catch (error) {
            console.log(error)
            res.render('pages/404')
        }
    }

    async handleLiveSearch(req, res) {
        try {
            const { keyword } = req.query
            let keywordToArray = keyword.split(' ')
            let multileWord = keywordToArray.join('%')
            const paramSearch = `%${multileWord}%`
            let sql = `select * from product 
                        where product.name ilike $1
                        limit 5`
            const data = await queryDatabase(sql, [paramSearch])
            res.json({
                status: 'success',
                data: data,
                keyword
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    async handleGetProductById(req, res) {
        try {

            const productId = req.params.productId
            const result = await productModel.findProductById(productId)
            if (result) {
                return  res.json({
                    status: 'success',
                    product: result, 
                })
            } else {
                return res.json({
                    status: 'error',
                    message: 'Sản phẩm không tồn tại!'
                })
            }

        } catch (error) {
            res.json({
                error
            })
        }
    }

    
    async handleGetReviewOfProduct(req, res) {
        try {

            const productId = req.params.productId
            const result = await productModel.findReviewByProductId(productId)

            if (result) {
                return  res.json({
                    status: 'success',
                    dataProductReview: result, 
                })
            } else {
                return  res.json({
                    status: 'success',
                    dataProductReview: null
                })
            }
         

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async handleAddReview(req, res) {
        try {

            const { productId, content } = req.body

            const result = await productModel.addReview({
                productId,
                content
            })

            req.flash('success', 'Thêm bài viết thành công!')
            return res.redirect('/nhanlaptop-admin/product')
            
        } catch (error) {
            req.flash('error', 'Thêm bài viết thất bại!')
            return res.redirect('/nhanlaptop-admin/product')
        }
    }

    async handleUpdateReview(req, res) {
        try {

            const { productId, content } = req.body

            const result = await productModel.updateReview({
                productId,
                content
            })

            req.flash('success', 'Chỉnh sửa viết thành công!')
            return res.redirect('/nhanlaptop-admin/product')
            
        } catch (error) {
            req.flash('error', 'Chỉnh sửa viết thất bại!')
            return res.redirect('/nhanlaptop-admin/product')
        }
    }

    async checkExistsProductId(req, res) {
        try {

            const productId = req.params.productId

            const result = await productModel.findProductById(productId)
            if (result) {
                return res.json({
                    status: 'success',
                    exists: true,
                    message: 'Sản phẩm đã tồn tại', 
                })
            } else {
                return res.json({
                    status: 'success',
                    exists: false,
                    message: 'Mã sản phẩm hợp lệ!', 
                })
            }

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async checkExistsProductSlug(req, res) {
        try {

            const slug = req.params.slug

            const result = await productModel.findProductBySlug(slug)
            if (result) {
                return res.json({
                    status: 'success',
                    exists: true,
                    message: 'Đường dẫn sản phẩm đã tồn tại', 
                })
            } else {
                return res.json({
                    status: 'success',
                    exists: false,
                    message: 'Đường dẫn sản phẩm hợp lệ!', 
                })
            }

        } catch (error) {
            res.json({
                error
            })
        }
    }


    async handleAddProduct(req, res) {

        try {
            const product = req.body

            const file = req.file
            const thumbnailCloudinary = await uploadToCloudinary(cloudinary, file.path, {folder: 'NHANLAPTOP'})
            
            const  { secure_url, public_id } = thumbnailCloudinary
            if (secure_url && public_id) {

                product.secure_url = secure_url
                product.public_id = public_id
           
            }

            const result = await productModel.create(product)

            const  { error } = result

            if (!error) {
                req.flash('success', 'Thêm sản phẩm thành công!')
                return res.redirect('/nhanlaptop-admin/product')
            } else {
                req.flash('error', 'Thêm sản phẩm thất bại!')
                return res.redirect('/nhanlaptop-admin/product')
            }

        } catch (error) {
            req.flash('error', 'Thêm sản phẩm thất bại!')
            return res.redirect('/nhanlaptop-admin/product')
        }

    }

    async handleUpdateProduct(req, res) {
        try {
           
            const product = req.body
          
            const result = await productModel.update(product)

            req.flash('success', 'Cập nhật thành công!')
            return res.redirect('/nhanlaptop-admin/product')
            
        } catch (error) {
            req.flash('error', 'Cập nhật thất bại!')
            return res.redirect('/nhanlaptop-admin/product')
        }
    }

    async handleUpdateThumbnail(req, res) {
        try {

            const { productId } = req.body

            const sql = `select product.thumbnail, product.public_id from product where product_id = $1`

            const result = await queryDatabase(sql, [productId])
            const { public_id } = result[0]

            if (public_id) {
                cloudinary.uploader.destroy(public_id, async function(err, result) {
                    if (err) return res.res.redirect('back')

                    const file = req.file
                    const thumbnail = await uploadToCloudinary(cloudinary, file.path, {folder: 'NHANLAPTOP'})
                    const secureUrl = thumbnail.secure_url
                    const publicId = thumbnail.public_id

                    if (secureUrl && publicId) {
                      
                        const result1 = await productModel.updateThumbnail({
                            secureUrl,
                            publicId, 
                            productId
                        })
                    }
                    req.flash('success', 'Cập nhật thành công!')
                    return res.redirect('/nhanlaptop-admin/product')
           
                })
            }
            
        } catch (error) {
            req.flash('error', 'Cập nhật thất bại!')
            return res.redirect('/nhanlaptop-admin/product')
        }
    }

    async checkIsOrdered(req, res) {
        try {

            const productId = req.params.productId

            const result = await orderModel.isOrdered(productId)
            return res.json({
                status: 'success',
                result: result,
                message: result ? "Sản phẩm đã được bán" : "Sản phẩm chưa được bán", 
            })

        } catch (error) {
            res.json({
                error
            })
        }
    }

    async handleDeleteProductById(req, res) {
        try {
            const { productId } = req.params
            const sql = `select product.public_id from product where product_id = $1`
            const result = await queryDatabase(sql, [productId])
            const { public_id } = result[0]
 
            const resultDelete = await productModel.deleteById(productId)
            const { error } = resultDelete
            if (!error) {
                if (public_id) {
                    const reusltCloudinary = await deleteCloudinary(cloudinary, public_id)
                    console.log(reusltCloudinary)
                }
    
                return res.json({
                    status: 'success',
                })
            } else {
                return res.json({
                    status: 'error',
                    error
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

module.exports = new ProductController;


