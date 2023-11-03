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