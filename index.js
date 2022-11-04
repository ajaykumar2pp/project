const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const passport = require("passport");
const path = require('path');
const flash = require('express-flash')
const session = require('express-session')
const app = express();


// *******************    Set Template Engine  ***********************************//
// app.use(expressLayout)
app.set("view engine","ejs")
app.set('views', path.join(__dirname, 'views'))
console.log(app.get("view engine"))

// ***************************   Database Connection   *******************************//
const {connectMonggose} = require('./app/database/db');
connectMonggose();

//***************************** Session config    **********************************//
app.use(session({
    secret:  'myplacementcell',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))



// ******************************  Passport  config   *************************************//
const passportInit = require('./app/passport/passport')
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

// *************************    Assets    ****************************************//
const publicPath = path.join(__dirname,"public");
app.use(express.static(publicPath));
app.use(express.static(__dirname + '/public'));
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// *******************************   Routes  *************************************//
require('./routes/web')(app)



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`My server start on this port ${PORT}`)
})

