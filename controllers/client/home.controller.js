const Product = require('../../models/product.model.js')

const productsHelper = require('../../helpers/product.js')

// [GET] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6)

    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    res.render("./client/pages/home/index.pug", {
        pageTitle: 'Trang chủ',
        productsFeatured: newProductsFeatured
    });
}