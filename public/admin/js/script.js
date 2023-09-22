//! button status
const buttonsStatus = document.querySelectorAll('[button-status]')
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute('button-status');

            if (status != "") {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    })
}
//! end button status


//! search form

const formSearch = document.querySelector('#form-search')
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = e.target.elements.keyword.value;

        if (value != "") {
            url.searchParams.set("keyword", value);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    })
}

//! end search form

//!pagination

const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');

            url.searchParams.set('page', page);

            window.location.href = url.href;
        })
    })
}

//!end pagination

//! change status

const buttonsChangeStatus = document.querySelectorAll('[button-change-status]');
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');

            const statusChange = statusCurrent == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}` + '?_method=PATCH';
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}

//! end change status


//! check box multi

const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        inputsId.forEach(input => {
            input.checked = inputCheckAll.checked;
        });
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;

            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });

    //*nếu click vào ảnh thì cũng tick vào checkbox
    const imgProducts = checkboxMulti.querySelectorAll("img[img-product]");
    imgProducts.forEach(img => {
        img.addEventListener("click", () => {
            const checkbox = img.closest("tr").querySelector("input[name='id']");
            checkbox.click();
        })
    })
}

//! end check box multi


//! form change multi

const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        //*confirm delete-all
        if (typeChange == 'delete-all') {
            const isConfirm = confirm('Bạn có chắc muốn xoá những bản ghi này không ?');
            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;

                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;

                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(", ");

            console.log(ids)
            formChangeMulti.submit();
        } else {
            alert("Chọn ít nhất một bản ghi");
        }
    })
}

//! end form change multi

//! delete one

const buttonsDelete = document.querySelectorAll('[button-delete]');
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector('#form-delete-item');
    const path = formDeleteItem.getAttribute('data-path');

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có chắc muốn xoá bản ghi này không ?");

            if (confirmDelete) {
                const id = button.getAttribute('data-id');
                const action = path + `/${id}` + '?_method=DELETE';
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
}

//! end delete one


//! show alert

const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })
}

//! end show alert

//! sharp delete one

const buttonsSharpDelete = document.querySelectorAll('[button-sharp-delete]');
if (buttonsSharpDelete.length > 0) {
    const formSharpDeleteItem = document.querySelector('#form-sharp-delete-item');
    const path = formSharpDeleteItem.getAttribute('data-path');

    buttonsSharpDelete.forEach(button => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có chắc muốn xoá vĩnh viễn bản ghi này không ?");

            if (confirmDelete) {
                const id = button.getAttribute('data-id');
                const action = path + `/${id}` + '?_method=DELETE';
                formSharpDeleteItem.action = action;
                console.log(action)
                formSharpDeleteItem.submit();
            }
        })
    })
}

//! end sharp delete one

//! restore one

const buttonsRestore = document.querySelectorAll('[button-restore]');
if (buttonsRestore.length > 0) {
    const formRestoreItem = document.querySelector('#form-restore-item');
    const path = formRestoreItem.getAttribute('data-path');

    buttonsRestore.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute('data-id');
            const action = path + `/${id}` + '?_method=PATCH';
            formRestoreItem.action = action;
            console.log(action)
            formRestoreItem.submit();
        })
    })
}

//! end restore one


//! trash form change multi

const formTrashChangeMulti = document.querySelector("[form-trash-change-multi]");
if (formTrashChangeMulti) {
    formTrashChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        //*confirm hard-delete-all
        if (typeChange == 'sharp-delete-all') {
            const isConfirm = confirm('Bạn có chắc muốn xoá vĩnh viễn những bản ghi này không ?');
            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formTrashChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            });

            inputIds.value = ids.join(", ");

            console.log(ids)
            formTrashChangeMulti.submit();
        } else {
            alert("Chọn ít nhất một bản ghi");
        }
    })
}

//! end trash form change multi