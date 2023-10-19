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

    res.render(`${prefixAdmin}/pages/products-category/create`, {
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


// GET /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id

    const data = await ProductCategory.findOne({
        _id: id,
        deleted: false
    })
    const records = await ProductCategory.find({
        deleted: false
    })

    const newRecords = createTree(records)

    res.render(`${prefixAdmin}/pages/products-category/edit`,{
        data,
        records: newRecords
    })
}


// PATCh /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id

    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({
        _id: id
    }, req.body)
    res.redirect(`/${prefixAdmin}/products-category`)
}

// [GEt] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const productCategory = await ProductCategory.findOne({
            _id: id,
            deleted: false
        }).lean()

        const records = await ProductCategory.find({
            deleted: false
        })

        //! get parents of productCategory
        let parents = []
        let parentId = productCategory.parent_id
        while (parentId) {
            const parent = records.find(item => item.id === parentId)
            parents.push(parent)
            parentId = parent.parent_id
        }
        parents.reverse()
        productCategory.parents = parents



        res.render('admin/pages/products-category/detail', {
            pageTitle: "Chi tiết danh mục",
            productCategory
        })
    } catch (error) {
        console.log(error)
        req.flash("error", "Không tồn tại!")
        res.redirect(`/${prefixAdmin}/products-category`);
    }
}