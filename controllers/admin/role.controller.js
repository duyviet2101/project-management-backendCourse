const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

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

// [GET] /admin/roles/createPost
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  req.flash("success", "Thêm nhóm quyền thành công");
  
  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}