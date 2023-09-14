const Product = require('../../models/product.model.js')

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const products = await Product.find({});
    
    res.render("./admin/pages/products/index.pug", {
        pageTitle: 'Danh sách sản phẩm',
        products: products
    });
}

