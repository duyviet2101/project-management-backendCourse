const User = require('../../models/user.model.js')
const ForgotPassword = require('../../models/forgot-password.model.js')

const md5 = require('md5')

const generateHelper = require('../../helpers/generate.js')

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

// GET /user/login
module.exports.login = async (req, res) => {

  res.render('client/pages/user/login', {
    pageTitle: 'Đăng nhập tài khoản'
  })
}

// POST /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if (!user) {
    req.flash('error', 'Email không tồn tại!')
    res.redirect('back')
    return
  }

  if (md5(password) !== user.password) {
    req.flash('error', 'Sai mật khẩu!')
    res.redirect('back')
    return
  }

  if (user.status === "inactive") {
    req.flash('error', 'Tài khoản bị khoá!')
    res.redirect('back')
    return
  }

  res.cookie('tokenUser', user.tokenUser)

  res.redirect('/')
}

// GET /user/logout
module.exports.logout = (req, res, next) => {
  res.clearCookie('tokenUser')

  res.redirect('/')
}


// GET /user/password/forgot
module.exports.forgotPassword = (req, res, next) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu"
  })
}


// POST /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if (!user) {
    req.flash('error', 'Email không tồn tại!')
    res.redirect('back')
    return
  }

  // ? Việc 1: tạo mã otp và lưu thông tin yêu cầu vào 1 collection
  const otp = generateHelper.generateRandomNumber(8)
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  };

  const forgot = await ForgotPassword.create(objectForgotPassword)

  // ? Việc 2: gửi mã OTP qua email của user


  res.redirect(`/user/password/otp?email=${email}`)
}

// GET /user/password/otp
module.exports.otpPassword = (req, res, next) => {
  const email = req.query.email

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email
  })
}

// POST /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })
  
  if (!result) {
    req.flash('error', "Mã OTP không hợp lệ")
    res.redirect('back')
    return
  }

  const user = await User.findOne({
    email: email
  })

  res.cookie('tokenUser', user.tokenUser)
  
  res.redirect('/user/password/reset')
}