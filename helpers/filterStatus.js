module.exports = (query) => {
    //! tạo mảng gồm thông tin 3 nút bấm
    let filterStatus = [
        {
            name: "Tất cả",
            status:"",
            class: ""
        },
        {
            name: "Hoạt động",
            status:"active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    if (query.status) {
        const index = filterStatus.findIndex((item) => {
            return item.status == query.status;
        })

        filterStatus[index].class = "active"
    } else {
        const index = filterStatus.findIndex((item) => {
            return item.status == "";
        })

        filterStatus[0].class = "active"
    }
    return filterStatus
}