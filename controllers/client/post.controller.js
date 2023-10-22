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