const {
  uploadToCloudinary
} = require('../../helpers/uploadToCloudDinary.js')
const Chat = require('../../models/chat.model.js')
const User = require('../../models/user.model.js')

module.exports = async (res) => {
  // !socket.io
  _io.once('connection', (socket) => {
    //! Nguoi dung gui yeu cau ket ban
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

      //! lấy độ dài acceptFriends của B
      const infoUserB = await User.findOne({
        _id: userId
      }).lean()

      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', {
        userId,
        lengthAcceptFriends
      })

      //! lấy thông tin của A trả về cho B
      const infoUserA = await User.findOne({
        _id: myUserId
      }).select("id avatar fullName").lean()
      socket.broadcast.emit('SERVER_RETURN_INFO_ACCEPT_FRIEND', {
        userId,
        infoUserA
      })
    })
    //! Nguoi dung huy yeu cau ket ban
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
      //! lấy độ dài acceptFriends của B
      const infoUserB = await User.findOne({
        _id: userId
      }).lean()

      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', {
        userId,
        lengthAcceptFriends
      })

      //! lấy userId của A để trả về cho B khi A huỷ kết bạn 
      const infoUserA = await User.findOne({
        _id: myUserId
      }).select("id fullName avatar").lean()
      socket.broadcast.emit('SERVER_RETURN_USER_ID_CANCEL_FRIEND', {
        userId,
        userIdA: myUserId,
        infoUserA
      })
    })

    //! Nguoi dung tu choi ket ban
    socket.on('CLIENT_REFUSE_FRIEND', async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId) //id cua B
      // console.log(userId) //id cua A

      //? xoá id của A trong acceptFriends của B
      await User.findOneAndUpdate({
        _id: myUserId
      }, {
        $pull: {
          acceptFriends: userId
        }
      })

      //? xoá id của B trong requestFriends của A
      await User.findOneAndUpdate({
        _id: userId
      }, {
        $pull: {
          requestFriends: myUserId
        }
      })
    })

    //! Nguoi dung chap nhan ket ban (A gửi lời mời cho B, B chấp nhận lời mời của A)
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(myUserId) // Id của B
      // console.log(userId); // Id của A


      //? Thêm {user_id, room_chat_id} của A vào friendsList của B
      //? Xóa id của A trong acceptFriends của B
      const existUserAInB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId
      });

      if (existUserAInB) {
        await User.updateOne({
          _id: myUserId
        }, {
          $push: {
            friendList: {
              user_id: userId,
              room_chat_id: ""
            }
          },
          $pull: {
            acceptFriends: userId
          }
        });
      }


      //? Thêm {user_id, room_chat_id} của B vào friendsList của A
      //? Xóa id của B trong requestFriends của A
      const existUserBInA = await User.findOne({
        _id: userId,
        requestFriends: myUserId
      });

      if (existUserBInA) {
        await User.updateOne({
          _id: userId
        }, {
          $push: {
            friendList: {
              user_id: myUserId,
              room_chat_id: ""
            }
          },
          $pull: {
            requestFriends: myUserId
          }
        });
      }

      // //? return về thông tin của B cho A để add vào danh sách bạn bè của A
      // const myUserInfo = await User.findOne({
      //   _id: myUserId
      // }).select("id fullName avatar").lean();
      // socket.broadcast.emit('SERVER_RETURN_INFO_USER_ACCEPTED_FRIEND', {
      //   userId,
      //   infoUserB: myUserInfo
      // })
    });

    // ! Nguoi dung xoa ban be
    socket.on("CLIENT_DELETE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // console.log(myUserId) // Id của A
      // console.log(userId); // Id của B

      const unfriendCountDown = setTimeout(async () => {
        //? Xoá id của A trong friendsList của B
        await User.findOneAndUpdate({
          _id: myUserId
        }, {
          $pull: {
            friendList: {
              user_id: userId
            }
          }
        });

        //? Xoá id của B trong friendsList của A
        await User.findOneAndUpdate({
          _id: userId
        }, {
          $pull: {
            friendList: {
              user_id: myUserId
            }
          }
        });
        //! xoá A trong danh sách bạn bè của B khi A huỷ kết bạn
        socket.broadcast.emit('SERVER_RETURN_USER_ID_DELETE_FRIEND', {
          userId,
          userIdA: myUserId
        })
      }, 5000)
      let cnt = 0;
      socket.on('CLIENT_UNDO_DELETE_FRIEND', function undo (id) {
        if (id === userId) {
          clearTimeout(unfriendCountDown)
        }
        socket.off('CLIENT_UNDO_DELETE_FRIEND', undo)
      })

    })
  })
  // !end socket.io
}