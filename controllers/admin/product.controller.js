const Product = require('../../models/product.model.js')
const filterStatusHelper = require('../../helpers/filterStatus.js');
const searchHelper = require('../../helpers/search.js')

// [GET] /admin/products
module.exports.index = async (req, res) => {

    //!filterStatus
    const filterStatus = filterStatusHelper(req.query);
    //!search
    const objectSearch = searchHelper(req.query);

    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }
    
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }

    const products = await Product.find(find);
    
    res.render("./admin/pages/products/index.pug", {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}

