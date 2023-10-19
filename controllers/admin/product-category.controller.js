const { prefixAdmin } = require('../../config/system.js')
const createTree = require('../../helpers/createTree.js')
const ProductCategory = require('../../models/product-category.model.js')
const Product = require('../../models/product.model.js')
const Account = require('../../models/account.model.js')

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    for (const record of records) {
        const userCreate = await Account.findOne({
            _id: record.createdBy.account_id
        })
        if (userCreate) {
            record.createdBy.accountFullName = userCreate.fullName
        }

        const userUpdateId = record.updatedBy.slice(-1)[0]
        if (userUpdateId) {
            const userUpdate = await Account.findOne({
                _id: record.updatedBy.slice(-1)[0].account_id
            })
            if (userUpdate) {
                record.updatedBy.slice(-1)[0].accountFullName = userUpdate.fullName
            }
        }
    }

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

    const createdBy = {
        account_id: res.locals.user.id,
    }
    req.body.createdBy = createdBy

    const produtCategory = new ProductCategory(req.body);
    await produtCategory.save()

    req.flash('success', "Tạo danh mục thành công!")
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

    const updatedBy = {
        account_id: res.locals.user.id
    }

    await ProductCategory.updateOne({
        _id: id
    }, {
        ...req.body,
        $push: {updatedBy: updatedBy}
    })
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

// DELETE /admin/products-category/delete/:id
module.exports.delete = async (req, res, next) => {
    const id = req.params.id

    await ProductCategory.updateOne(
        {
            _id: id
        },
        {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        }
    )

    await ProductCategory.updateMany(
        {
            parent_id: id
        },
        {
            parent_id: ""
        }
    )

    await Product.updateMany(
        {
            product_category_id: id
        },
        {
            product_category_id: ""
        }
    )

    req.flash('success', 'Xoá danh mục thành công!')
    res.redirect('back')
}