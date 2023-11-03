const {
  uploadToCloudinary
} = require('../../helpers/uploadToCloudDinary.js')
const Chat = require('../../models/chat.model.js')
const User = require('../../models/user.model.js')

module.exports = async (res) => {
  // !socket.io
  _io.once('connection', (socket) => {
    // Nguoi dung gui yeu cau ket ban
    socket.on('CLIENT_ADD_FRIEND', async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId) //id cua user da dang nhap - A
      // console.log(userId) //id cua user muon ket ban - B

      //? thêm id của A vào acceptFriends của B
      const existUserAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      })
      if (!existUserAinB) {
        await User.findOneAndUpdate({
          _id: userId
        }, {
          $push: {
            acceptFriends: myUserId
          }
        })
      }
      //? thêm id của B vào requestFriends của A
      const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId
      })
      if (!existUserBinA) {
        await User.findOneAndUpdate({
          _id: myUserId
        }, {
          $push: {
            requestFriends: userId
          }
        })
      }
    })
    // Nguoi dung huy yeu cau ket ban
    socket.on('CLIENT_CANCEL_FRIEND', async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId) //id cua user da dang nhap - A
      // console.log(userId) //id cua user muon ket ban - B

      //? xoá id của A vào acceptFriends của B
      await User.findOneAndUpdate({
        _id: userId
      }, {
        $pull: {
          acceptFriends: myUserId
        }
      })

      //? xoá id của B vào requestFriends của A
      await User.findOneAndUpdate({
        _id: myUserId
      }, {
        $pull: {
          requestFriends: userId
        }
      })
    })
  })
  // !end socket.io
}