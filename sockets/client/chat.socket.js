const {uploadToCloudinary} = require('../../helpers/uploadToCloudDinary.js')
const Chat = require('../../models/chat.model.js')
const User = require('../../models/user.model.js')

module.exports = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName
  const roomChatId = req.params.roomChatId

  // !socket.io
  _io.once('connection', (socket) => {
    socket.join(roomChatId)
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
        room_chat_id: roomChatId
      })

      // tra data ve client
      _io.to(roomChatId).emit('SERVER_RETURN_MESSAGE', {
        userId,
        fullName,
        content : data.content,
        images : images
      })
    });

    socket.on('CLIENT_SEND_TYPING', (type) => {
      socket.broadcast.to(roomChatId).emit('SERVER_RETURN_TYPING', {
        userId,
        fullName,
        type
      })
    })
  });
  // !end socket.io
}