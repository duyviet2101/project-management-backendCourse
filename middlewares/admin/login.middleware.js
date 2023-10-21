const {prefixAdmin} = require('../../config/system.js')

module.exports.checkTokenExist = async (req, res, next) => {
  if (req.cookies.token) {
    res.redirect(`/${prefixAdmin}/dashboard`)
    return
  }

  next()
}