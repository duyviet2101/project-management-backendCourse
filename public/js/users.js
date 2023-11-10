//! gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll('[btn-add-friend]');
if (listBtnAddFriend && listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add('add')

      const userId = button.getAttribute('btn-add-friend')
      
      socket.emit('CLIENT_ADD_FRIEND', userId)
    })
  })
}
//! end gửi yêu cầu kết bạn

// ! huỷ yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll('[btn-cancel-friend]');
if (listBtnCancelFriend && listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.remove('add')

      const userId = button.getAttribute('btn-cancel-friend')
      
      socket.emit('CLIENT_CANCEL_FRIEND', userId)
    })
  })
}
// ! end huỷ yêu cầu kết bạn

// ! từ chối yêu cầu kết bạn
const listBtnRefuseFriend = document.querySelectorAll('[btn-refuse-friend]');
if (listBtnRefuseFriend && listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add('refuse')

      const userId = button.getAttribute('btn-refuse-friend')
      
      socket.emit('CLIENT_REFUSE_FRIEND', userId)
    })
  })
}
// ! end từ chối yêu cầu kết bạn

// ! chấp nhận yêu cầu kết bạn
const listBtnAcceptFriend = document.querySelectorAll('[btn-accept-friend]');
if (listBtnAcceptFriend && listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add('accepted')

      const userId = button.getAttribute('btn-accept-friend')
      
      socket.emit('CLIENT_ACCEPT_FRIEND', userId)
    })
  })
}
// ! end chấp nhận yêu cầu kết bạn 

// ! xoá kết bạn

const undoDeleteFriend = (userId, button, index) => {
  if (listBtnUndoDeleteFriend[index]) {
    const btnUndo = listBtnUndoDeleteFriend[index]

    let sec = 5;
    btnUndo.innerHTML = `Hoàn tác (${sec})`
    const undoCountDown = setInterval(() => {
      sec--;
      if (sec >= 0) {
        btnUndo.innerHTML = `Hoàn tác (${sec})`
      } else {
        clearInterval(undoCountDown)
      }
    }, 1000)

    const unfriendCountDown = setTimeout(() => {
      btnUndo.setAttribute('disabled', 'disabled')
    }, 5000)

    let cnt = 0;
    btnUndo.addEventListener('click', function undo() {
      clearTimeout(unfriendCountDown)
      clearInterval(undoCountDown)
      button.closest('.box-user').classList.remove('deleted')
      socket.emit('CLIENT_UNDO_DELETE_FRIEND', userId)
      btnUndo.removeEventListener('click', undo)
      return;
    })
  }
}

const listBtnDeleteFriend = document.querySelectorAll('[btn-delete-friend]');
const listBtnUndoDeleteFriend = document.querySelectorAll('[btn-undo-delete-friend]');
if (listBtnDeleteFriend && listBtnDeleteFriend.length > 0) {
  listBtnDeleteFriend.forEach((button, index) => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add('deleted')
      const userId = button.getAttribute('btn-delete-friend')
      socket.emit('CLIENT_DELETE_FRIEND', userId)

      undoDeleteFriend(userId, button, index)
    })
  })
}
// ! end xoá kết bạn

//! SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUserAccept = document.querySelector(`[badge-user-accept]`)
  const userId = badgeUserAccept.getAttribute('badge-user-accept')
  
  if (userId === data.userId) {
    badgeUserAccept.innerHTML = data.lengthAcceptFriends
  }
})
//! END SERVER_RETURN_LENGTH_ACCEPT_FRIEND

//! SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on('SERVER_RETURN_INFO_ACCEPT_FRIEND', (data) => {
  //? TRANG LỜI MỜI KẾT BẠN
  const dataUsersAccept = document.querySelector(`[data-users-accept]`)
  if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute('data-users-accept')
  
    if (userId == data.userId) {
      //? vẽ user ra giao diện
      const newBoxUser = document.createElement('div')
      newBoxUser.classList.add('col-6')
      newBoxUser.setAttribute('user-id', data.infoUserA._id)
  
      newBoxUser.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="${data.infoUserA.avatar ? data.infoUserA.avatar : '/images/avatar.jpg'}" alt="${data.infoUserA.fullName}">
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
              <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.infoUserA._id}">Chấp nhận</button>
              <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="${data.infoUserA._id}">Xóa</button>
              <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="btn-deleted-friend" disabled="disabled">Đã xóa</button>
              <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="btn-accepted-friend" disabled="disabled">Đã chấp nhận</button>
            </div>
          </div>
        </div>
      `;
  
      dataUsersAccept.appendChild(newBoxUser)
      //? end vẽ user ra giao diện
  
      //? Xoá lời mời kết bạn
      const btnRefuseFriend = document.querySelector(`[btn-refuse-friend]`)
      btnRefuseFriend.addEventListener('click', () => {
        btnRefuseFriend.closest('.box-user').classList.add('refuse')
  
        const userId = btnRefuseFriend.getAttribute('btn-refuse-friend')
        
        socket.emit('CLIENT_REFUSE_FRIEND', userId)
      })
      //? END Xoá lời mời kết bạn
  
      //? Chấp nhận lời mời kết bạn
      const btnAcceptFriend = document.querySelector(`[btn-accept-friend]`)
      btnAcceptFriend.addEventListener('click', () => {
        btnAcceptFriend.closest('.box-user').classList.add('accepted')
  
        const userId = btnAcceptFriend.getAttribute('btn-accept-friend')
        
        socket.emit('CLIENT_ACCEPT_FRIEND', userId)
      }) 
      //? END Chấp nhận lời mời kết bạn
  
    }
  }
  //?HẾT TRANG LỜI MỜI KẾT BẠN

  //? TRANG DANH SÁCH NGƯỜI DÙNG
  const dataUsersNotFriend = document.querySelector(`[data-users-not-friend]`)
  if (dataUsersNotFriend) {
    const userId = dataUsersNotFriend.getAttribute('data-users-not-friend')
    if (userId == data.userId) {
      // ? xoá a khỏi danh sách của b
      const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`)
      if (boxUserRemove) {
        dataUsersNotFriend.removeChild(boxUserRemove)
      }
    }
  }
  //? HẾT TRANG DANH SÁCH NGƯỜI DÙNG
})
//! END SERVER_RETURN_INFO_ACCEPT_FRIEND

//! SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on('SERVER_RETURN_USER_ID_CANCEL_FRIEND', (data) => {
  //? trang lời mời kết bạn
  const dataUsersAccept = document.querySelector(`[data-users-accept]`)
  if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute('data-users-accept')

    if (userId == data.userId) {
      // ? xoá a khỏi danh sách của b
      const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`)
      if (boxUserRemove) {
        dataUsersAccept.removeChild(boxUserRemove)
      }
    }
  }
  //?hết trang lời mời kết bạn

  //? trang danh sách người dùng
  const dataUsersNotFriend = document.querySelector(`[data-users-not-friend]`)
  if (dataUsersNotFriend) {
    const userId = dataUsersNotFriend.getAttribute('data-users-not-friend')
    if (userId == data.userId) {
      //? vẽ user ra giao diện
      const newBoxUser = document.createElement('div')
      newBoxUser.classList.add('col-6')
      newBoxUser.setAttribute('user-id', data.infoUserA._id)
  
      newBoxUser.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="${data.infoUserA.avatar ? data.infoUserA.avatar : '/images/avatar.jpg'}" alt="${data.infoUserA.fullName}">
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
              <button class="btn btn-sm btn-primary mr-1" btn-add-friend="${data.infoUserA._id}">Kết bạn</button>
              <button class="btn btn-sm btn-secondary mr-1" btn-cancel-friend="${data.infoUserA._id}">Hủy</button>
            </div>
          </div>
        </div>
      `;
  
      dataUsersNotFriend.appendChild(newBoxUser)
      //? end vẽ user ra giao diện

      //? gửi lời mời
      const btnAddFriend = newBoxUser.querySelector(`[btn-add-friend]`)
      if (btnAddFriend) {
        btnAddFriend.addEventListener('click', () => {
          btnAddFriend.closest('.box-user').classList.add('add')
    
          const userId = btnAddFriend.getAttribute('btn-add-friend')
          
          socket.emit('CLIENT_ADD_FRIEND', userId)
        })
      }
      //? end gửi lời mời
      //? huỷ lời mời
      const btnCancelFriend = newBoxUser.querySelector(`[btn-cancel-friend]`)
      if (btnCancelFriend) {
        btnCancelFriend.addEventListener('click', () => {
          btnCancelFriend.closest('.box-user').classList.remove('add')
    
          const userId = btnCancelFriend.getAttribute('btn-cancel-friend')
          
          socket.emit('CLIENT_CANCEL_FRIEND', userId)
        })
      } 
      //? end huỷ lời mời 
    }
  }
  //? hết trang danh sách người dùng
})
//! END SERVER_RETURN_USER_ID_CANCEL_FRIEND

//! SERVER_RETURN_USER_ID_DELETE_FRIEND
socket.on('SERVER_RETURN_USER_ID_DELETE_FRIEND', (data) => {
  const dataUsersFriend = document.querySelector(`[data-users-friend]`)
  if (dataUsersFriend) {
    const userId = dataUsersFriend.getAttribute('data-users-friend')
    if (data.userId == userId) {
      //? Xoá a khỏi danh sách bạn bè của b
      const boxUserRemove = dataUsersFriend.querySelector(`[user-id="${data.userIdA}"]`)
      if (boxUserRemove) {
        dataUsersFriend.removeChild(boxUserRemove)
      }
    }
  }
})
//! END SERVER_RETURN_USER_ID_DELETE_FRIEND

//! SERVER_RETURN_INFO_USER_ACCEPTED_FRIEND
socket.on('SERVER_RETURN_INFO_USER_ACCEPTED_FRIEND', (data) => {
  console.log(data)
})
//! END SERVER_RETURN_INFO_USER_ACCEPTED_FRIEND

//! SERVER_RETURN_USER_ONLINE
socket.on('SERVER_RETURN_USER_ONLINE', (userId) => {
  const dataUsersFriend = document.querySelector(`[data-users-friend]`)
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`)
    if (boxUser) {
      boxUser.querySelector('[status]').setAttribute('status', 'online');
    }
  }
})
//! END SERVER_RETURN_USER_ONLINE

//! SERVER_RETURN_USER_OFFLINE
socket.on('SERVER_RETURN_USER_OFFLINE', (userId) => {
  const dataUsersFriend = document.querySelector(`[data-users-friend]`)
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`)
    if (boxUser) {
      boxUser.querySelector('[status]').setAttribute('status', 'offline');
    }
  }
})
//! END SERVER_RETURN_USER_OFFLINE