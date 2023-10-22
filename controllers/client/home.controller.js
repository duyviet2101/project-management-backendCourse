const Product = require('../../models/product.model.js')
const Post = require('../../models/post.model.js')

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

    //! danh sach bai viet noi bat
    const postsFeatured = await Post.find({
        featured: "1",
        deleted: false,
        status: 'active'
    }).sort({position: 'desc'}).limit(6)
    //! danh sach bai viet moi
    const postsNew = await Post.find({
        deleted: false,
        status: 'active'
    }).sort({position: 'desc'}).limit(6)

    res.render("./client/pages/home/index.pug", {
        pageTitle: 'Trang chủ',
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew,
        postsFeatured,
        postsNew
    });
}