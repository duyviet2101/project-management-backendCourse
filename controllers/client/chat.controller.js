const Chat = require('../../models/chat.model.js')
const User = require('../../models/user.model.js')

const chatSocket = require('../../sockets/client/chat.socket.js')

// GET /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId

  // !socket
  chatSocket(req, res)
  // !end socket

  // !lay data in ra giao dien
  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false
  })
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select('fullName')

    chat.infoUser = infoUser
  }
  // !end lay data in ra giao dien



  res.render('client/pages/chat/index', {
    pageTitle: 'Chat',
    chats
  })
}