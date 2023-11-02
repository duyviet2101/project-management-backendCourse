const Chat = require('../../models/chat.model.js')
const User = require('../../models/user.model.js')
const {uploadToCloudinary} = require('../../helpers/uploadToCloudDinary.js')

// GET /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName

  // !socket.io
  _io.once('connection', (socket) => {
    socket.on('CLIENT_SEND_MESSAGE', async (data) => {
      // console.log(data.images) images la 1 array buffer

      let images = []

      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer)
        images.push(link)
      }
      
      // luu vao database
      const chat = await Chat.create({
        user_id: userId,
        content: data.content,
        images: images,
      })

      // tra data ve client
      _io.emit('SERVER_RETURN_MESSAGE', {
        userId,
        fullName,
        content : data.content,
        images : images
      })
    });

    socket.on('CLIENT_SEND_TYPING', (type) => {
      socket.broadcast.emit('SERVER_RETURN_TYPING', {
        userId,
        fullName,
        type
      })
    })
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