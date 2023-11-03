const {uploadToCloudinary} = require('../../helpers/uploadToCloudDinary.js')
const Chat = require('../../models/chat.model.js')
const User = require('../../models/user.model.js')

module.exports = async (res) => {
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
}