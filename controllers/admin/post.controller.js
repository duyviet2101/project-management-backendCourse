const Post = require('../../models/post.model.js')
const PostsCategory = require('../../models/posts-category.model.js')
const Account = require('../../models/account.model.js')

const createTree = require('../../helpers/createTree.js')
const {prefixAdmin} = require('../../config/system.js')

//[GET] /admin/posts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }

  const posts = await Post.find(find)

  //! get update, create user infor
  for (const post of posts) {
    const userCreated = await Account.findOne({
      _id: post.createdBy.account_id
    })
    if (userCreated) {
      post.createdBy.accountFullName = userCreated.fullName
    }

    const userUpdatedId = post.updatedBy.slice(-1)[0]
    if (userUpdatedId) {
      const userUpdated = await Account.findOne({
        _id: userUpdatedId
      })
      if (userUpdated) {
        post.updatedBy.slice(-1)[0].accountFullName = userUpdated.fullName
      }
    }
  }
  //! end get update, create user infor

  //!get info post_category_title

  const categories = await PostsCategory.find({
    deleted: false
  })

  for (const post of posts) {
    if (post.post_category_id) {
      const category = await PostsCategory.findOne({
        _id: post.post_category_id
      })

      if (category) {
        post.post_category_title = category.title
      }
    }
  }

  //!end get info post_category_title

  res.render('admin/pages/posts/index', {
    pageTitle: 'Danh sách bài viết',
    posts
  })
}


// GET /admin/posts/create
module.exports.create = async (req, res) => {

  const records = await PostsCategory.find({
    deleted: false
  })

  res.render('admin/pages/posts/create', {
    pageTitle: 'Thêm bài viết',
    records: createTree(records)
  })
}

// POST /admin/posts/create
module.exports.createPost = async (req, res) => {

  if (!req.body.position) {
    const countPosts = await Post.countDocuments({
      deleted: false
    })

    req.body.position = countPosts + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  const createdBy = {
    account_id: res.locals.user.id,
    createdAt: Date.now()
  }

  req.body.createdBy = createdBy
  
  await Post.create(req.body)

  req.flash('success', 'Tạo bài viết thành công!')
  res.redirect(`/${prefixAdmin}/posts`)

}