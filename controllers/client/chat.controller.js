const Chat = require('../../models/chat.model.js')
const User = require('../../models/user.model.js')

// GET /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName

  // !socket.io
  _io.once('connection', (socket) => {
    socket.on('CLIENT_SEND_MESSAGE', async (content) => {
      // luu vao database
      const chat = await Chat.create({
        user_id: userId,
        content: content
      })

      // tra data ve client
      _io.emit('SERVER_RETURN_MESSAGE', {
        userId,
        fullName,
        content
      })
    });
  });
  // !end socket.io

  // !lay data in ra giao dien
  const chats = await Chat.find({
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