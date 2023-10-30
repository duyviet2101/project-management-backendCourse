const Account = require('../../models/account.model.js')
const md5 = require('md5')
const { prefixAdmin } = require('../../config/system.js')


// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    res.redirect(`/${prefixAdmin}/dashboard`)
    return
  }
  res.render('admin/pages/auth/login', {
    pageTitle: "Đăng nhập"
  })
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false
  })

  if (!user) {
    req.flash('error', "Email không tồn tại!")
    res.redirect("back")
    return
  }

  if (md5(password) != user.password) {
    req.flash('error', "Sai mật khẩu!")
    res.redirect("back")
    return
  }

  if (user.status == "inactive") {
    req.flash('error', "Tài khoản bị khoá!")
    res.redirect("back")
    return
  }

  const expiresTime = 1000 * 60 * 60 * 24;

  res.cookie("token", user.token, {
    expires: new Date(Date.now() + expiresTime)
  })
  res.redirect(`/${prefixAdmin}/dashboard`)
}


// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie('token')
  res.redirect(`/${prefixAdmin}/auth/login`)
}