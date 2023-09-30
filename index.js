require('dotenv').config();
const express = require("express");
const methodOverride = require('method-override');
const database = require('./config/database')
const bodyPraser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')

database.connect()

const systemConfig = require("./config/system.js")

const route = require("./routes/client/index.route")
const routeAdmin = require('./routes/admin/index.route.js')

const app = express();
const port = process.env.PORT;
//! config view
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//! config method override
app.use(methodOverride('_method'))

//! config static file
app.use(express.static(`${__dirname}/public`));

//! config express flash
app.use(cookieParser('...'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//! define app local vars
app.locals.prefixAdmin = systemConfig.prefixAdmin

//! config ulr encoded
app.use(bodyPraser.urlencoded({extended: true}))

// Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening on http://127.0.0.1:${port}`)
})