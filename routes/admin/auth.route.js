const express = require('express')
const router = express.Router();
const loginMiddleware = require('../../middlewares/admin/login.middleware.js')

const controller = require('../../controllers/admin/auth.controller.js')

router.get('/login', loginMiddleware.checkTokenExist, controller.login)

router.post('/login', controller.loginPost)

router.get('/logout', controller.logout)

module.exports = router