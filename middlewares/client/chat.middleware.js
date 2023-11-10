const roomChat = require('../../models/room-chat.model.js');

module.exports.isAccess = async (req, res, next) => {
  const userId = res.locals.user.id
  const roomChatId = req.params.roomChatId

  try {
    const isAccessRoomChat = await roomChat.findOne({
      _id: roomChatId,
      deleted: false,
      "users.user_id": userId
    }).lean()

    if (isAccessRoomChat) {
      next();
    } else {
      res.redirect('/');
    }
  } catch (error) {
    res.redirect('/');
  }

}