const User = require('../../models/user.model.js')

const md5 = require('md5')

//GET /user/register
module.exports.register = async (req, res) => {
  res.render('client/pages/user/register', {
    pageTitle: "Đăng kí tài khoản"
  })
}

// POST /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  })
  if (existEmail) {
    req.flash('error', 'Email đã tồn tại!')
    res.redirect('back')
    return
  }

  req.body.password = md5(req.body.password)

  const user = await User.create(req.body)

  res.cookie('tokenUser', user.tokenUser)

  res.redirect('/')
}