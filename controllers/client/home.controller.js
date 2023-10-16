const Product = require('../../models/product.model.js')

const productsHelper = require('../../helpers/product.js')

// [GET] /
module.exports.index = async (req, res) => {
    //! danh sach noi bat
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6)

    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    //! danh sach sp moi
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6)

    const newProductsNew = productsHelper.priceNewProducts(productsNew)

    res.render("./client/pages/home/index.pug", {
        pageTitle: 'Trang chủ',
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}