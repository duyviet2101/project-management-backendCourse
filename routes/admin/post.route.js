const express = require("express")
const router = express.Router();

//!config multer
const multer = require('multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js')
const upload = multer();
//!end config multer

const controller = require('../../controllers/admin/post.controller')
const validate = require('../../validates/admin/post.validate.js')


router.get('/', controller.index)

router.get('/create', controller.create)

router.post(
  '/create',
  upload.single('thumbnail'),
  validate.createPost,
  uploadCloud.upload,
  controller.createPost
)

router.patch('/change-multi', controller.changeMulti)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.get('/detail/:id', controller.detail)

router.get('/edit/:id', controller.edit)

router.patch(
  '/edit/:id', 
  upload.single('thumbnail'),
  validate.createPost,
  uploadCloud.upload,
  controller.editPatch
)

router.delete('/delete/:id', controller.deleteItem)

module.exports = router