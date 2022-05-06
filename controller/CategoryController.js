const  categoryModel = require('../model/Category')

class CategoryController {

    async handleAddCategory(req, res) {
        try {

            const { name, categorySlug, parentId } = req.body

            const result = await categoryModel.create({
                name, categorySlug, parentId
            })
            return res.redirect('/nhanlaptop-admin/category')
            

        } catch (error) {
            return res.redirect('back')
        }
    }

    async handleUpdateCategory(req, res) {
        try {

            const { categoryId, name, categorySlug } = req.body

            let parentId = req.body.parentId ? req.body.parentId : 0

            const result = await categoryModel.update({
                categoryId, name, categorySlug, parentId
            })
            
            return res.redirect('/nhanlaptop-admin/category')

        } catch (error) {
            res.render('pages/404')
        }
    }

    async getCategoryById(req, res) {
        try {

            const { id } = req.params

            const result = await categoryModel.findById(id)

            return res.json({
                status: 'success',
                data: result
            })
            

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

    async handleDeleteById(req, res) {
        try {

            const { id } = req.params
            const resultDelete = await categoryModel.deleteById(id)

            res.json({
                status: 'success',
            })

        } catch (error) {
            res.json({
                status: 'error',
                error
            })
        }
    }

   
}

module.exports = new CategoryController;


