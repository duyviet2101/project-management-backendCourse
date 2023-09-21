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
if (buttonsChangeStatus) {
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


    //*click vào dòng thfi tự động tick ô checkbox
    // const rows = checkboxMulti.querySelectorAll("tbody>tr");
    // rows.forEach(row => {
    //     const clickZone
    //     row.addEventListener('click', () => {
    //         const inputCheckbox = row.querySelector("input[name='id']");
    //         console.log(inputCheckbox)
    //     })
    // })
}

//! end check box multi


//! form change multi

const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");


            inputsChecked.forEach(input => {
                ids.push(input.value);
            });

            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Chọn ít nhất một bản ghi");
        }
    })
}

//! end form change multi