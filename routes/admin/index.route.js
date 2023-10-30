const dashboardRoute = require("./dashboard.route.js");
const productRoute = require("./product.route.js");
const productsCategoryRoute = require("./product-category.route.js");
const trashRoute = require('./trash.route.js')
const roleRoutes = require("./role.route");
const accountRoutes = require('./account.route.js')
const authRoutes = require('./auth.route.js')
const myAccountRoutes = require('./my-account.route.js')
const postsCategoryRoutes = require('./posts-category.route.js')
const postsRoutes = require('./post.route.js')
const settingRoutes = require('./setting.route.js')

const authController = require('../../controllers/admin/auth.controller.js')
const authMiddleware = require('../../middlewares/admin/auth.middleware.js')


const systemConfig = require('../../config/system.js')

module.exports = (app) => {
    const PATH_ADMIN = '/' + systemConfig.prefixAdmin;

    app.get(PATH_ADMIN + '/', authController.login)
    app.use(PATH_ADMIN + '/dashboard',authMiddleware.requireAuth, dashboardRoute)
    app.use(PATH_ADMIN + '/products',authMiddleware.requireAuth, productRoute)
    app.use(PATH_ADMIN + '/products-category', authMiddleware.requireAuth, productsCategoryRoute)
    app.use(PATH_ADMIN + '/products/trash', authMiddleware.requireAuth, trashRoute)
    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
    app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoutes)
    app.use(PATH_ADMIN + "/posts-category", authMiddleware.requireAuth, postsCategoryRoutes)
    app.use(PATH_ADMIN + "/posts", authMiddleware.requireAuth, postsRoutes)
    app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoutes)
}