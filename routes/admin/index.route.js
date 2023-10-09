const dashboardRoute = require("./dashboard.route.js");
const productRoute = require("./product.route.js");
const productsCategoryRoute = require("./product-category.route.js");
const trashRoute = require('./trash.route.js')
const roleRoutes = require("./role.route");
const accountRoutes = require('./account.route.js')
const authRoutes = require('./auth.route.js')
const authMiddleware = require('../../middlewares/admin/auth.middleware.js')

const systemConfig = require('../../config/system.js')

module.exports = (app) => {
    const PATH_ADMIN = '/' + systemConfig.prefixAdmin;


    app.use(PATH_ADMIN + '/dashboard',authMiddleware.requireAuth, dashboardRoute)
    app.use(PATH_ADMIN + '/products',authMiddleware.requireAuth, productRoute)
    app.use(PATH_ADMIN + '/products-category', authMiddleware.requireAuth, productsCategoryRoute)
    app.use(PATH_ADMIN + '/products/trash', authMiddleware.requireAuth, trashRoute)
    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
}