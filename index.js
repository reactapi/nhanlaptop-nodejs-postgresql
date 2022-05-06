const express = require('express')
const path = require('path');
require('dotenv').config()

const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const flash = require('connect-flash')
const { getAccountLoggedIn } = require('./middleware/index')


const app = express();



app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
  
    maxAge: 60 * 60 * 1000 
}))

app.use(cookieParser())


app.use(flash())

const route = require('./router');

app.use(getAccountLoggedIn)
route(app);

const PORT = process.env.PORT || 3000

app.listen(PORT, function() {
    console.log(`Running.... port ${PORT}`)
})