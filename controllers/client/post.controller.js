const Post = require('../../models/post.model.js')
const PostCategory = require('../../models/posts-category.model.js')
const Product = require('../../models/product.model.js')

// GET /posts
module.exports.index = async (req, res) => {
  const posts = await Post.find({
    deleted: false,
    status: "active"
  }).sort({
    position: 'desc'
  })

  res.render('client/pages/posts/index', {
    pageTitle: 'Danh sách bài viết',
    posts
  })

}

// GET /posts/detail/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug

  const post = await Post.findOne({
    slug: slug,
    deleted: false,
    status: 'active'
  }).lean()

  post.category = await PostCategory.findOne({
    _id: post.post_category_id
  }).lean()

  res.render('client/pages/posts/detail', {
    pageTitle: post.title,
    post
  })
}

// GET /posts/:slugCategory
module.exports.category = async (req, res) => {
  const category = await PostCategory.findOne({
    deleted: false,
    status: 'active',
    slug: req.params.slugCategory
  })

  const getSubCategory = async (parentId) => {
    const subs = await PostCategory.find({
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

  const posts = await Post.find({
    deleted: false,
    status: 'active',
    post_category_id: {$in: [category.id, ...listSubCategoryId]}
  }).sort({
    position: 'desc'
  })

  res.render('client/pages/posts/index', {
    pageTitle: category.title,
    posts
  })
}