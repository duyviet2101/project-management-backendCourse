const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const Post = require("../../models/post.model");
const PostCategory = require("../../models/posts-category.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        categoryPost: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        post: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    statistic.categoryProduct.total = await ProductCategory.count({
        deleted: false
    });

    statistic.categoryProduct.active = await ProductCategory.count({
        status: "active",
        deleted: false
    });

    statistic.categoryProduct.inactive = await ProductCategory.count({
        status: "inactive",
        deleted: false
    });

    statistic.product.total = await Product.count({
        deleted: false
    })

    statistic.product.active = await Product.count({
        deleted: false,
        status: "active"
    })

    statistic.product.inactive = await Product.count({
        deleted: false,
        status: "inactive"
    })

    statistic.account.total = await Account.count({
        deleted: false
    })

    statistic.account.active = await Account.count({
        deleted: false,
        status: "active"
    })

    statistic.account.inactive = await Account.count({
        deleted: false,
        status: "inactive"
    })

    statistic.user.total = await User.count({
        deleted: false
    })

    statistic.user.active = await User.count({
        deleted: false,
        status: "active"
    })

    statistic.user.inactive = await User.count({
        deleted: false,
        status: "inactive"
    })

    statistic.post.total = await Post.count({
        deleted: false
    })

    statistic.post.active = await Post.count({
        deleted: false,
        status: "active"
    })

    statistic.post.inactive = await Post.count({
        deleted: false,
        status: "inactive"
    })

    statistic.categoryPost.total = await PostCategory.count({
        deleted: false
    })

    statistic.categoryPost.active = await PostCategory.count({
        deleted: false,
        status: "active"
    })

    statistic.categoryPost.inactive = await PostCategory.count({
        deleted: false,
        status: "inactive"
    })

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Tổng quan",
        statistic: statistic
    });
}