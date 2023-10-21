const express = require("express")
const router = express.Router();

//!config multer
const multer = require('multer');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js')
const upload = multer();
//!end config multer

const controller = require('../../controllers/admin/post.controller')


router.get('/', controller.index)

router.get('/create', controller.create)

router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud,
  controller.createPost
)

router.patch('/change-multi', controller.changeMulti)

router.patch('/change-status/:status/:id', controller.changeStatus)


module.exports = router