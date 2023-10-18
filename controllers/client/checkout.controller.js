const Cart = require('../../models/cart.model.js')
const Product = require('../../models/product.model.js')
const productsHelper = require('../../helpers/product.js')

//[get] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;

      const productInfo = await Product.findOne({
        _id: productId
      });

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }

  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);


  res.render('client/pages/checkout/index', {
    pageTitle: "Đặt hàng",
    cartDetail: cart
  })
}