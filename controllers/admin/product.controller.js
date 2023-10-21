const Product = require('../../models/product.model.js')
const ProductCategory = require('../../models/product-category.model.js')
const Account = require('../../models/account.model.js')

const filterStatusHelper = require('../../helpers/filterStatus.js');
const searchHelper = require('../../helpers/search.js')
const paginationHelper = require('../../helpers/pagination.js')
const systemConfig = require('../../config/system.js')
const createTree = require('../../helpers/createTree.js')

// [GET] /admin/products
module.exports.index = async (req, res) => {

    //!filterStatus
    const filterStatus = filterStatusHelper(req.query);
    //!search
    const objectSearch = searchHelper(req.query);

    let find = {
        deleted: false,
    };

    //! status
    if (req.query.status) {
        find.status = req.query.status;
    };

    //! search
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    };

    //! Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 4
    };
    const countProduct = await Product.count(find);
    const objectPagination = paginationHelper(initPagination, req.query, countProduct);
    //! end pagination

    //! sort

    let sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = 'desc'
    }

    //! end sort

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .sort(sort);

    for (const product of products) {
        const userCreated = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if (userCreated) {
            product.createdBy.accountFullName = userCreated.fullName
        }

        const userUpdatedId = product.updatedBy.slice(-1)[0]
        if (userUpdatedId) {
            const userUpdated = await Account.findOne({
                _id: product.updatedBy.slice(-1)[0].account_id
            })
            if (userUpdated) {
                product.updatedBy.slice(-1)[0].accountFullName = userUpdated.fullName
            }
        }

    }

    if (products.length > 0 || countProduct == 0) {
        res.render("./admin/pages/products/index.pug", {
            pageTitle: 'Danh sách sản phẩm',
            products: products,
            filterStatus: filterStatus,
            keyword: objectSearch.keyword,
            pagination: objectPagination
        });
    } else {
        let stringQuery = "";

        for (const key in req.query) {
            if (key != "page") {
                stringQuery += `&${key}=${req.query[key]}`
            }
        }
        const href = `${req.baseUrl}?page=1${stringQuery}`
        res.redirect(href)
    }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({
        _id: id
    }, {
        status: status,
        $push: {
            updatedBy: updatedBy
        }
    })

    req.flash('success', 'Cập nhật trạng thái thành công!')
    res.redirect('back')
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: type,
                $push: {
                    updatedBy: updatedBy
                }

            });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`)
            break;
        case "delete-all":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            });
            req.flash('success', `Xoá thành công ${ids.length} sản phẩm!`)
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split('-');
                await Product.updateOne({
                    _id: id
                }, {
                    position: position,
                    $push: {
                        updatedBy: updatedBy
                    }
                });
            }
            req.flash('success', `Thay đổi vị trí ${ids.length} sản phẩm thành công!`)
            break;
    }

    res.redirect('back')
}


// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    req.flash('success', `Xoá sản phẩm thành công!`)
    res.redirect('back')
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTree(records)

    res.render('admin/pages/products/create', {
        pageTitle: 'Tạo mới sản phẩm',
        records: newRecords
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    const countProduct = await Product.countDocuments();

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = req.body.position ? parseInt(req.body.position) : countProduct + 1;
    req.body.createdBy = {
        account_id: res.locals.user.id
    }


    const product = new Product(req.body);
    await product.save();

    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

// [GEt] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false
        })
        let find = {
            deleted: false
        }

        const records = await ProductCategory.find(find)

        const newRecords = createTree(records)

        // console.log(product)

        res.render('admin/pages/products/edit', {
            pageTitle: "Chỉnh sửa sản phẩm",
            product,
            records: newRecords
        })
    } catch (error) {
        req.flash("error", "Không tồn tại sản phẩm!")
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file && req.file.filename) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }


    await Product.updateOne({
        _id: id
    }, {
        ...req.body,
        $push: {
            updatedBy: updatedBy
        }
    })
    // console.log(req.body)
    req.flash("success", "Cập nhật sản phẩm thành công")
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

// [GEt] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false
        })

        //! get info create and update
        const userCreate = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if (userCreate) {
            product.createdBy.accountFullName = userCreate.fullName
        }

        if (product.updatedBy.length > 0) {
            const userUpdate = await Account.findOne({
                _id: product.updatedBy.slice(-1)[0].account_id
            })
            if (userUpdate) {
                product.updatedBy.slice(-1)[0].accountFullName = userUpdate.fullName
            }
        }

        res.render('admin/pages/products/detail', {
            pageTitle: "Chi tiết sản phẩm",
            product
        })
    } catch (error) {
        req.flash("error", "Không tồn tại sản phẩm!")
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}