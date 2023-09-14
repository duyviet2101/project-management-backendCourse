require('dotenv').config();
const express = require("express");
const database = require('./config/database')

database.connect()

const systemConfig = require("./config/system.js")

const route = require("./routes/client/index.route")
const routeAdmin = require('./routes/admin/index.route.js')

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

//! define app local vars
app.locals.prefixAdmin = systemConfig.prefixAdmin


// Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening on http://127.0.0.1:${port}`)
})