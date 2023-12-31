require('dotenv').config();
const express = require("express");
const methodOverride = require('method-override');
const database = require('./config/database')
const bodyPraser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const morgan = require('morgan')
const path = require('path')
const moment = require('moment')
const {Server} = require('socket.io')
const http = require('http')


database.connect()

const systemConfig = require("./config/system.js")

const route = require("./routes/client/index.route")
const routeAdmin = require('./routes/admin/index.route.js')

const app = express();
const port = process.env.PORT;
//!config tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//! config morgan
app.use(morgan('dev'));

//! config view
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//! config method override
app.use(methodOverride('_method'))

//! config static file
app.use(express.static(`${__dirname}/public`));

//! config socket.io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

//! config express flash
app.use(cookieParser('...'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//! define app local vars
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment

//! config ulr encoded
app.use(bodyPraser.urlencoded({extended: true}))

// Routes
route(app);
routeAdmin(app);
// app.use((err, req, res, next) => {
//     if (err) {
//         res.render("client/pages/errors/404", {
//             pageTitle: "404 Not Found",
//         })
//     }
// })
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
      pageTitle: "404 Not Found",
    });
  });
  

server.listen(port, () => {
    console.log(`App listening on http://127.0.0.1:${port}`)
})