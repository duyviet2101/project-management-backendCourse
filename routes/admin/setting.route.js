const express = require('express')
const router = express.Router()
//!config multer
const multer = require('multer');
// const storageMulterHelper = require('../../helpers/storageMulter.js');
// const storage = storageMulterHelper();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js')
const upload = multer();
//!end config multer

const controller = require('../../controllers/admin/setting.controller')

router.get('/general', controller.general)

router.patch(
  '/general',
  upload.single('logo'),
  uploadCloud.upload, 
  controller.generalPatch
)

module.exports = router