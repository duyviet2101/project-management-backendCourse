const ProductCategory = require('../../models/product-category.model.js');
const PostCategory = require('../../models/posts-category.model.js')

const createTree = require('../../helpers/createTree.js')


module.exports.category = async (req, res, next) => {
  //! category product
  const categoryProducts = await ProductCategory.find({
    deleted: false,
    status: "active"
  })

  const newCategoryProducts = createTree(categoryProducts)

  res.locals.layoutCategoryProducts = newCategoryProducts
  //! end category product

  //! category post
  const categoryPosts = await PostCategory.find({
    deleted: false,
    status: "active"
  })

  const newCategoryPosts = createTree(categoryPosts)

  res.locals.layoutCategoryPosts = newCategoryPosts
  //! end category post

  next();
}