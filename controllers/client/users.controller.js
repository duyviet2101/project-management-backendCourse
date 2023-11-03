const User = require('../../models/user.model.js')

// GET /users/not-friend
module.exports.notFriend = async (req, res, next) => {
  const userId = res.locals.user.id

  const users = await User.find({
    _id: { $ne: userId },
    status: 'active',
    deleted: false
  }).select('avatar fullName')

  res.render('client/pages/users/not-friend', {
    pageTitle: 'Danh sách người dùng',
    users
  })
}