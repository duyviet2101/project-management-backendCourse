const Role = require("../../models/role.model");
const Account = require('../../models/account.model.js')

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  for (const record of records) {
    const userCreate = await Account.findOne({
      _id: record.createdBy.account_id
    })
    if (userCreate) {
      record.createdBy.accountFullName = userCreate.fullName
    }

    const userUpdateId = record.updatedBy.slice(-1)[0].account_id
    if (userUpdateId) {
      const userUpdate = await Account.findOne({
        _id: userUpdateId
      })
      if (userUpdate) {
        record.updatedBy.slice(-1)[0].accountFullName = userUpdate.fullName
      }
    }
  }

  res.render("admin/pages/roles/index", {
    pageTitle: "Danh sách nhóm quyền",
    records: records
  });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo mới nhóm quyền",
  });
}

// [POST] /admin/roles/createPost
module.exports.createPost = async (req, res) => {
  const createdBy = {
    account_id: res.locals.user.id
  }

  const record = await Role.create({
    ...req.body,
    createdBy
  })

  req.flash("success", "Thêm nhóm quyền thành công");

  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Role.findOne({
      _id: id,
      deleted: false
    });

    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      data: data
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id
  }

  await Role.updateOne({
    _id: id
  }, {
    ...req.body,
    $push: {
      updatedBy: updatedBy
    }
  });

  req.flash("success", "Cập nhật nhóm quyền thành công");

  res.redirect("back");
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records
  });
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);

  const updatedBy = {
    account_id: res.locals.user.id
  }

  for (const item of permissions) {
    await Role.updateOne({
      _id: item.id
    }, {
      permissions: item.permissions
    });
  }

  req.flash("success", "Cập nhật phân quyền thành công!");

  res.redirect("back");
}

// GET /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id

  const roleData = await Role.findOne({
    deleted: false,
    _id: id
  })

  //! get info create and update
  const userCreate = await Account.findOne({
    _id: roleData.createdBy.account_id
  })
  if (userCreate) {
    roleData.createdBy.accountFullName = userCreate.fullName
  }

  if (roleData.updatedBy.length > 0) {
    const userUpdate = await Account.findOne({
      _id: roleData.updatedBy.slice(-1)[0].account_id
    })
    if (userUpdate) {
      roleData.updatedBy.slice(-1)[0].accountFullName = userUpdate.fullName
    }
  }

  res.render('admin/pages/roles/detail', {
    pageTitle: "Chi tiết nhóm quyền",
    roleData
  })
}

//DELETE /admin/roles/delete/:id
module.exports.delete = async (req, res, next) => {
  const id = req.params.id

  const deletedBy = {
    account_id: res.locals.user.id,
    deletedAt: Date.now()
  }

  await Role.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedBy: deletedBy
  })

  req.flash('success', 'Xoá nhóm quyền thành công!')
  res.redirect('back')
}