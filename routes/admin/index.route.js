const dashboardRoute = require("./dashboard.route.js");

const systemConfig = require('../../config/system.js')

module.exports = (app) => {
    const PATH_ADMIN = '/' + systemConfig;

    app.use(PATH_ADMIN + '/dashboard', dashboardRoute)
}