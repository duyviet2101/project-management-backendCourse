const Product = require('../../models/product.model.js')

const filterStatusHelper = require('../../helpers/filterStatus.js');
const searchHelper = require('../../helpers/search.js')
const paginationHelper = require('../../helpers/pagination.js') 

// [GET] /admin/products
module.exports.index = async (req, res) => {

    //!filterStatus
    const filterStatus = filterStatusHelper(req.query);
    //!search
    const objectSearch = searchHelper(req.query);

    let find = {
        deleted: false,
    };

    //! status
    if (req.query.status) {
        find.status = req.query.status;
    };
    
    //! search
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    };

    //! Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 4
    };
    const countProduct = await Product.count(find);
    const objectPagination = paginationHelper(initPagination, req.query, countProduct);
    //! end pagination

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    
    res.render("./admin/pages/products/index.pug", {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id}, {status: status})
    
    res.redirect('back')
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: type});
            break;
        }

    res.redirect('back')
}


// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({_id: id}, { 
        deleted: true,
        deletedAt: new Date()
    });

    res.redirect('back')
}