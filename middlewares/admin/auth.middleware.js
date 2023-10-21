const {prefixAdmin} = require('../../config/system.js')
const Account = require('../../models/account.model.js')
const Role = require('../../models/role.model.js')

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.clearCookie('token')
    res.redirect(`/${prefixAdmin}/auth/login`)
    return
  }

  const user = await Account.findOne({
    token: req.cookies.token
  })
  if (!user) {
    res.clearCookie('token')
    res.redirect(`/${prefixAdmin}/auth/login`)
    return
  }

  const role = await Role.findOne({
    _id: user.role_id,
  }).select('title permissions')

  res.locals.user = user
  res.locals.role = role
  next()
}