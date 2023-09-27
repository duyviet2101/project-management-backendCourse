const Product = require('../../models/product.model.js')

const filterStatusHelper = require('../../helpers/filterStatus.js');
const searchHelper = require('../../helpers/search.js')
const paginationHelper = require('../../helpers/pagination.js') 
const systemConfig = require('../../config/system.js')

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

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .sort({position: 'desc'});
    
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

    await Product.updateOne({ _id: id}, {status: status})
    
    req.flash('success', 'Cập nhật trạng thái thành công!')
    res.redirect('back')
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: type});
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`)
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}}, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash('success', `Xoá thành công ${ids.length} sản phẩm!`)
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split('-');
                await Product.updateOne({_id: id}, {position: position});
            }
            req.flash('success', `Thay đổi vị trí ${ids.length} sản phẩm thành công!`)
            break;
        }

    res.redirect('back')
}


// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({_id: id}, { 
        deleted: true,
        deletedAt: new Date()
    });
    req.flash('success', `Xoá sản phẩm thành công!`)
    res.redirect('back')
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products/create', {
        pageTitle: 'Tạo mới sản phẩm'
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    const countProduct = await Product.countDocuments();

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = req.body.position ? parseInt(req.body.position) : countProduct + 1;
    
    const product = new Product(req.body);
    await product.save();

    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}