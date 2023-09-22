const express = require('express')
const router = express.Router()

const controller = require('../../controllers/admin/trash.controller.js')

router.get('/', controller.index)

router.delete('/sharp-delete/:id', controller.sharpDeleteItem)

router.patch('/restore/:id', controller.restoreItem)

router.patch('/change-multi', controller.changeMulti)


module.exports = router