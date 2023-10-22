module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", `Tiêu đề không được để trống!`)
    res.redirect('back')
    return
  }

  if (req.body.title.length < 5) {
    req.flash("error", `Tiêu đề dài tối thiểu 5 kí tự!`)
    res.redirect('back')
    return
  }

  if (req.body.preview && req.body.preview.length > 0) {
    const countWords = req.body.preview.split(' ').length

    if (countWords > 30) {
      req.flash("error", `Preview không quá 30 từ!`)
      res.redirect('back')
      return
    }

    if (countWords < 10) {
      req.flash("error", `Preview tối thiểu 10 từ!`)
      res.redirect('back')
      return
    }
  }
  
  next()
}
