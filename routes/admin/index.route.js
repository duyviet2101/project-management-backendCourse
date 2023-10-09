const dashboardRoute = require("./dashboard.route.js");
const productRoute = require("./product.route.js");
const productsCategoryRoute = require("./product-category.route.js");
const trashRoute = require('./trash.route.js')
const roleRoutes = require("./role.route");
const accountRoutes = require('./account.route.js')
const authRoutes = require('./auth.route.js')

const systemConfig = require('../../config/system.js')

module.exports = (app) => {
    const PATH_ADMIN = '/' + systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard', dashboardRoute)
    app.use(PATH_ADMIN + '/products', productRoute)
    app.use(PATH_ADMIN + '/products-category', productsCategoryRoute)
    app.use(PATH_ADMIN + '/products/trash', trashRoute)
    app.use(PATH_ADMIN + "/roles", roleRoutes);
    app.use(PATH_ADMIN + "/accounts", accountRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
}