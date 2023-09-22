const Product = require('../../models/product.model.js')
const paginationHelper = require('../../helpers/pagination.js')
const searchHelper = require('../../helpers/search.js')


// [GET] /admin/products/trash
module.exports.index = async (req, res) => {
    let find = {
        deleted: true
    }
    const objectSearch = searchHelper(req.query)

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }

    let initPagination = {
        currentPage: 1,
        limitItems: 4
    };

    const countProduct = await Product.count(find);
    const objectPagination = paginationHelper(initPagination, req.query, countProduct);

    const products = await Product.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .sort({position: 'desc'});

    if (products.length == 0 && countProduct > 0) {
        let stringQuery = "";
        for (const key in req.query) {
            if (key != "page") {
                stringQuery += `&${key}=${req.query[key]}`
            }
        }
        const href = `${req.baseUrl}?page=1${stringQuery}`
        res.redirect(href)
    } else {
        res.render("./admin/pages/products/trash.pug", {
            pageTitle: 'Danh sách sản phẩm đã xoá',
            products: products,
            keyword: objectSearch.keyword,
            pagination: objectPagination
        });
    }

}

// DELETE /admin/products/trash/sharp-delete/:id
module.exports.sharpDeleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.deleteOne({_id: id});
    req.flash('success', `Xoá sản phẩm thành công!`)
    res.redirect('back')
}

// PATCH /admin/products/trash/restore/:id
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id}, {
        deleted: false,
        deletedAt: undefined
    })
    req.flash('success', `Khôi phục sản phẩm thành công!`)
    res.redirect('back')
}

// PATCH /admin/products/trash/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case "restore-all":
            await Product.updateMany({_id: {$in: ids}}, {
                deleted: false,
                deletedAt: undefined
            })
            req.flash('success', `Khôi phục ${ids.length} sản phẩm thành công!`)
            res.redirect('back');
            break;
        case "sharp-delete-all":
            await Product.deleteMany({_id: {$in: ids}})
            req.flash('success', `Xoá vĩnh viễn ${ids.length} sản phẩm thành công!`)
            res.redirect('back');
            break;
        default:
            res.redirect('back');
            break;
    }
}