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
  const dataUsersAccept = document.querySelector(`[data-users-accept]`)
  const userId = dataUsersAccept.getAttribute('data-users-accept')

  if (userId == data.userId) {
    //? vẽ user ra giao diện
    const newBoxUser = document.createElement('div')
    newBoxUser.classList.add('col-6')

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
})
//! END SERVER_RETURN_INFO_ACCEPT_FRIEND