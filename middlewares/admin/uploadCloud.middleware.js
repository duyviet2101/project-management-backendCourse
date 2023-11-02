const {uploadToCloudinary} = require('../../helpers/uploadToCloudDinary.js')

module.exports.upload = async function (req, res, next) {
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer)
        req.body[req.file.fieldname] = result
    }
    next()
}