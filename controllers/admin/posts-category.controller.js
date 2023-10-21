const PostsCategory = require('../../models/posts-category.model.js')
const Account = require('../../models/account.model.js')

const {prefixAdmin} = require('../../config/system.js')
const createTree = require('../../helpers/createTree.js')

// GET /admin/posts-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await PostsCategory.find(find)

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

  res.render('admin/pages/posts-category/index', {
    pageTitle: 'Danh mục bài viết',
    records: newRecords
  })
}

// GET /admin/posts-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await PostsCategory.find(find)

  const newRecords = createTree(records)

  res.render('admin/pages/posts-category/create', {
    pageTitle: 'Tạo danh mục bài viết',
    records: newRecords
  })
}

// POST /admin/posts-category/create
module.exports.createPost = async (req, res) => {
  if (!req.body.position) {
    const countRecords = await PostsCategory.countDocuments();
    req.body.position = countRecords + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }

  const createdBy = {
    account_id: res.locals.user.id,
  }
  req.body.createdBy = createdBy

  const postsCategory = await PostsCategory.create(req.body)

  req.flash('success', "Tạo danh mục bài viết thành công")
  res.redirect(`/${prefixAdmin}/posts-category`)
}

// GET /admin/posts-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const postCategory = await PostsCategory.findOne({
      _id: req.params.id,
      deleted: false
    }).lean()

    const records = await PostsCategory.find({
      deleted: false
    })
  
    //! get parents of postCategory
    let parents = []
    let parentId = postCategory.parent_id
    while (parentId) {
      const parent = records.find(item => item.id === parentId)
      parents.push(parent)
      parentId = parent.parent_id
    }
    parents.reverse()
    postCategory.parents = parents

    //! get info create and update
    const userCreate = await Account.findOne({
      _id: postCategory.createdBy.account_id
    })
    if (userCreate) {
      postCategory.createdBy.accountFullName = userCreate.fullName
    }

    if (postCategory.updatedBy.length > 0) {
      const userUpdate = await Account.findOne({
        _id: postCategory.updatedBy.slice(-1)[0].account_id
      })
      if (userUpdate) {
        postCategory.updatedBy.slice(-1)[0].accountFullName = userUpdate.fullName
      }
    }
    
    res.render('admin/pages/posts-category/detail', {
      pageTitle: 'Chi tiết danh mục bài viết',
      postCategory
    })
  } catch (error) {
    console.log(error)
    req.flash("error", "Không tồn tại!")
    res.redirect(`/${prefixAdmin}/posts-category`);
  }
}