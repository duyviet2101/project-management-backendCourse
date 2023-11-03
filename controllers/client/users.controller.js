const User = require('../../models/user.model.js')

const usersSocket = require('../../sockets/client/users.socket.js')

// GET /users/not-friend
module.exports.notFriend = async (req, res, next) => {
  // !socket.io
  usersSocket(res)
  // !end socket.io

  const userId = res.locals.user.id

  const myUser = await User.findOne({
    _id: userId
  }).lean()

  const requestFriends = myUser.requestFriends || []
  const acceptFriends = myUser.acceptFriends || []

  const users = await User.find({
    // _id: { $ne: userId },
    _id: {
      $nin: [...requestFriends, ...acceptFriends, userId]
    },
    status: 'active',
    deleted: false
  }).select('avatar fullName')

  res.render('client/pages/users/not-friend', {
    pageTitle: 'Danh sách người dùng',
    users
  })
}