const { prefixAdmin } = require('../../config/system.js')
const createTree = require('../../helpers/createTree.js')
const ProductCategory = require('../../models/product-category.model.js')

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTree(records)

    res.render('admin/pages/products-category/index', {
        pageTitle: 'Danh mục sản phẩm',
        records: newRecords
    })
}

// GET /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }


    //! check this

    const records = await ProductCategory.find(find)

    const newRecords = createTree(records)

    res.render('admin/pages/products-category/create', {
        pageTitle: 'Tạo danh mục sản phẩm',
        records: newRecords
    })
}

// POST /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (!req.body.position) {
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const produtCategory = new ProductCategory(req.body);
    await produtCategory.save()

    res.redirect(`/${prefixAdmin}/products-category`)
}