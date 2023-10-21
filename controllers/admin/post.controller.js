const Post = require('../../models/post.model.js')
const PostsCategory = require('../../models/posts-category.model.js')
const Account = require('../../models/account.model.js')

const createTree = require('../../helpers/createTree.js')
const filterStatusHelper = require('../../helpers/filterStatus.js')
const searchHelper = require('../../helpers/search.js')
const paginationHelper = require('../../helpers/pagination.js')
const {
  prefixAdmin
} = require('../../config/system.js')

//[GET] /admin/posts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }

  //!filterStatus
  const filterStatus = filterStatusHelper(req.query);
  //!end filterStatus

  //!search
  const objectSearch = searchHelper(req.query)
  if (req.query.keyword) {
    find.title = objectSearch.regex
  }
  //!end search

  //! status
  if (req.query.status) {
    find.status = req.query.status
  }
  //! end status

  //! category
  const category = req.query.category
  const getSubCategory = async (parentId) => {
    const subs = await PostsCategory.find({
      parent_id: parentId,
      deleted: false,
    });
    let allSub = [...subs];
    for (const sub of subs) {
      const childs = await getSubCategory(sub.id);
      allSub = allSub.concat(childs);
    }
    return allSub;
  }

  const listSubCategory = await getSubCategory(category);
  const listSubCategoryId = listSubCategory.map(item => item.id);
  
  if (category) {
    find.post_category_id = {$in: [category, ...listSubCategoryId]}
  }
  //! end category

  //!pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 4
  }
  const countPost = await Post.count(find)
  const objectPagination = paginationHelper(initPagination, req.query, countPost)
  //!end pagination

  //!sort
  let sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = 'desc'
  }
  //!end sort

  const posts = await Post.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .sort(sort)

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
        _id: userUpdatedId.account_id
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

  if (posts.length > 0 || countPost === 0) {
    res.render('admin/pages/posts/index', {
      pageTitle: 'Danh sách bài viết',
      posts,
      filterStatus,
      keyword: objectSearch.keyword,
      postCategories: createTree(categories),
      category,
      pagination: objectPagination
    })
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

// PATCH /admin/posts/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type
  const ids = req.body.ids.split(", ")

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  switch (type) {
    case "active":
    case "inactive":
      await Post.updateMany({
        _id: {$in: ids}
      }, {
        status: type,
        $push: {
          updatedBy: updatedBy
        }
      })
      req.flash('success', `Cập nhật trạng thái ${ids.length} bài viết thành công`)
      break;
    case 'delete-all':
      await Post.updateMany({
        _id: {$in: ids}
      }, {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }
      })
      req.flash('success', `Xoá ${ids.length} bài viết thành công`)
      break;
    case "change-position": 
      for (const item of ids) {
        const [id, position] = item.split('-')
        await Post.updateOne({
          _id: id
        }, {
          position: position,
          $push: {
            updatedBy: updatedBy 
          }
        })
      }
      req.flash('success', `Thay đổi vị trí ${ids.length} bài viết thành công`)
      break;
    
  }

  res.redirect('back')
}