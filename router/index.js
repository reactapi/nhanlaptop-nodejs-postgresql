
const apiRouter = require('./api')
const homeRouter = require('./home.js')
const productRouter = require('./product.js')
const authRouter = require('./auth')
const customerRouter = require('./customer')
const adminRouter = require('./admin')
const userRouter = require('./user.js')

function route(app) {
    
    app.use('/api/v1', apiRouter)
    app.use('/customer', customerRouter)
    app.use('/user', userRouter)
    app.use('/san-pham', productRouter)
    app.use('/auth', authRouter)
    app.use('/', homeRouter)
    app.use('/nhanlaptop-admin', adminRouter)

    app.use('*', function(req, res) {
        res.render('pages/404')
    })
   
}

module.exports = route;