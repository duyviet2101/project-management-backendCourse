const Cart = require('../../models/cart.model.js')
const Product = require('../../models/product.model.js')

const productHelper = require('../../helpers/product.js')

// [POST] /cart/add/:productId
module.exports.addPost =async (req, res, next) => {
  const cartId = req.cookies.cartId
  const productId = req.params.productId
  const quantity = parseInt(req.body.quantity)

  const cart = await Cart.findOne({
    _id: cartId
  })

  const existProductInCart = cart.products.find(item => item.product_id == productId);

  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity
    await Cart.updateOne(
      {
        _id: cartId,
        'products.product_id': productId
      },
      {
        'products.$.quantity': newQuantity
      }
    )
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!")
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity
    }
  
    const product = await Cart.updateOne({
      _id: cartId
    }, {
      $push: {products: objectCart}
    })
  
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!")
  }

  res.redirect("back")
}


//[GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId

  const cart = await Cart.findById({
    _id: cartId
  }).lean()

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;

      const productInfo = await Product.findOne({
        _id: productId
      }).lean()

      productInfo.priceNew = productHelper.priceNewProduct(productInfo)

      item.productInfo = productInfo

      item.totalPrice = item.quantity * productInfo.priceNew
    }
  }

  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

  res.render('client/pages/cart/index', {
    pageTitle: "Giỏ hàng",
    cartDetail: cart
  })
}