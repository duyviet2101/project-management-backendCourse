const md5 = require("md5");

const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  const records = await Account.find({
    deleted: false,
  });

  for (const record of records) {
    const role = await Role.findOne({ _id: record.role_id });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password);

  const record = new Account(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  if(req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    delete req.body.password;
  }

  await Account.updateOne({ _id: req.params.id }, req.body);

  res.redirect("back");
};

// PATCH /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id
  const status = req.params.status

  await Account.updateOne({
    _id: id
  }, {
    status: status
  })

  req.flash('success', 'Thay đổi trạng thái tài khoản thành công!')
  res.redirect('back')
}

// GET /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id
    const account = await Account.findOne({
      _id: id,
      deleted: false
    }).lean()

    const role = await Role.findOne({
      _id: account.role_id
    }).lean()

    account.role = role.title

    res.render('admin/pages/accounts/detail', {
      pageTitle: "Chi tiết tài khoản",
      account
  })
  } catch (error) {
    req.flash('error', 'Tài khoản không tồn tại!')
    res.redirect('back')
  }
}

// DELETE /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  await Account.updateOne({
    _id: id
  }, {
    deleted: true
  })

  req.flash('success', 'Xoá thành công!')
  res.redirect('back')
}