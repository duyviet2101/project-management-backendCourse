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

// GET /users/request
module.exports.request = async (req, res, next) => {
  // !socket.io
  usersSocket(res)
  // !end socket.io

  const userId = res.locals.user.id
  const myUser = await User.findOne({
    _id: userId
  }).lean()
  const requestFriends = myUser.requestFriends || []
  const users = await User.find({
    _id: {
      $in: requestFriends
    },
    status: 'active',
    deleted: false
  }).select('id avatar fullName')

  res.render('client/pages/users/request', {
    pageTitle: 'Lời mời đã gửi',
    users
  })
}

// GET /users/accept
module.exports.accept = async (req, res, next) => {
  // !socket.io
  usersSocket(res)
  // !end socket.io

  const userId = res.locals.user.id
  const myUser = await User.findOne({
    _id: userId
  }).lean()
  const acceptFriends = myUser.acceptFriends || []
  const users = await User.find({
    _id: {
      $in: acceptFriends
    },
    status: 'active',
    deleted: false
  }).select('id avatar fullName')

  res.render('client/pages/users/accept', {
    pageTitle: 'Lời mời kết bạn',
    users
  })
}