const {prefixAdmin} = require('../../config/system.js')
const Account = require('../../models/account.model.js')

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`/${prefixAdmin}/auth/login`)
    return
  }

  const user = await Account.findOne({
    token: req.cookies.token
  })
  if (!user) {
    res.redirect(`/${prefixAdmin}/auth/login`)
    return
  }

  next()
}