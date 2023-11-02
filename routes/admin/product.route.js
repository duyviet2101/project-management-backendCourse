const express = require("express")
const router = express.Router();

//!config multer
const multer = require('multer');
// const storageMulterHelper = require('../../helpers/storageMulter.js');
// const storage = storageMulterHelper();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js')


const upload = multer();
//!end config multer

const validate = require('../../validates/admin/product.validate.js')

const controller = require('../../controllers/admin/product.controller')

router.get("/", controller.index)

router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti)

router.delete("/delete/:id", controller.deleteItem)

router.get("/create", controller.create)

router.post("/create",
    upload.single('thumbnail'),
    validate.createPost,
    uploadCloud.upload,
    controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch("/edit/:id",
    upload.single('thumbnail'),
    validate.createPost,
    uploadCloud.upload,
    controller.editPatch
)

router.get('/detail/:id', controller.detail)

module.exports = router