const Product = require('../../models/product.model.js')
const ProductCategory = require('../../models/product-category.model.js')

const productsHelper = require('../../helpers/product.js')

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
            deleted: false,
            status: "active"
        })
        .sort({
            position: 'desc'
        });

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


// [GET] /products/:SlugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slugCategory
    })

    const getSubCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false,
        });

        let allSub = [...subs];

        for (const sub of subs) {
            const childs = await getSubCategory(sub.id);
            allSub = allSub.concat(childs);
        }

        return allSub;
    }

    const listSubCategory = await getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
            deleted: false,
            status: "active",
            product_category_id: {$in: [category.id, ...listSubCategoryId]}
        })
        .sort({
            position: 'desc'
        });

    const newProducts = productsHelper.priceNewProducts(products)

    res.render("./client/pages/products/index.pug", {
        pageTitle: `${category.title}`,
        products: newProducts
    });
}