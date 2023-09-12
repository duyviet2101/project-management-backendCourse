const productRoutes = require("./product.route");
const homeRoutes = require("./home.route")

module.exports = (app) => {
    app.use("/", homeRoutes)
    (req, res) => {
        res.render("./client/pages/home/index.pug");
    }
    app.use("/products", productRoutes)
}