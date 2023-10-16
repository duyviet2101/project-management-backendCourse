const Product = require('../../models/product.model.js')

const productsHelper = require('../../helpers/product.js')

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: false,
        status: "active"
    })
    .sort({position: 'desc'});

    const newProducts = productsHelper.priceNewProducts(products)
    
    res.render("./client/pages/products/index.pug", {
        pageTitle: 'Danh sách sản phẩm',
        products: newProducts
    });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;

        const product = await Product.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        })
        if (!product)
            return res.redirect('back')
        // console.log(product)
        res.render("client/pages/products/detail", {
            pageTitle: 'Chi tiết sản phẩm',
            product
        });
    } catch (error) {
        res.redirect("/")
    }
    
}
