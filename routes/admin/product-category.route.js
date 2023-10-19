const express = require("express")
const router = express.Router();

//!config multer
const multer = require('multer');
// const storageMulterHelper = require('../../helpers/storageMulter.js');
// const storage = storageMulterHelper();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js')


const upload = multer();
//!end config multer

const controller = require('../../controllers/admin/product-category.controller.js')

router.get("/", controller.index)

router.get("/create", controller.create)

router.post("/create",
    upload.single('thumbnail'),
    uploadCloud,
    controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloud,
    controller.editPatch
)

router.get('/detail/:id', controller.detail)

router.delete('/delete/:id', controller.delete)

router.patch('/change-status/:status/:id', controller.changeStatus)

module.exports = router