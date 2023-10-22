const Post = require('../../models/post.model.js')
const PostCategory = require('../../models/posts-category.model.js')

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
    deleted: false
  }).lean()

  post.category = await PostCategory.findOne({
    _id: post.post_category_id
  }).lean()

  res.render('client/pages/posts/detail', {
    pageTitle: post.title,
    post
  })
}