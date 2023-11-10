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
  let friendList = []
  if (myUser.friendList && myUser.friendList.length > 0) {
    friendList = myUser.friendList.map(friend => friend.user_id)
  }

  const users = await User.find({
    // _id: { $ne: userId },
    _id: {
      $nin: [...requestFriends, ...acceptFriends, ...friendList, userId]
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

// GET /users/friends
module.exports.friends = async (req, res, next) => {
  // !socket.io
  usersSocket(res)
  // !end socket.io

  const userId = res.locals.user.id
  const myUser = await User.findOne({
    _id: userId
  }).lean()

  const friendList = myUser.friendList || []
  const friendListId = friendList.map(item => item.user_id)

  const users = await User.find({
    _id: {
      $in: friendListId
    },
    status: 'active',
    deleted: false
  }).select('id avatar fullName statusOnline')

  users.forEach(user => {
    const infoUser = friendList.find(item => item.user_id.toString() === user.id.toString())
    user.roomChatId = infoUser.room_chat_id
  })

  res.render('client/pages/users/friends', {
    pageTitle: 'Danh sách bạn bè',
    users
  })
}