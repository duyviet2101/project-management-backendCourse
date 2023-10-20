const Cart = require('../../models/cart.model.js')
const Product = require('../../models/product.model.js')
const Order = require('../../models/order.model.js')


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


//[post] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId
  const userInfo = req.body

  const cart = await Cart.findOne({
    _id: cartId
  })

  let products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity
    }

    const productInfo = await Product.findOne({
      _id: product.product_id
    })

    objectProduct.price = productInfo.price
    objectProduct.discountPercentage = productInfo.discountPercentage

    products.push(objectProduct)
  }

  const objectOrder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products
  }

  const order = await Order.create(objectOrder)

  await cart.updateOne({products: []})

  res.redirect(`/checkout/success/${order.id}`)
}

// GET /checkout/success/:orderId
module.exports.success = async (req, res, next) => {
  const orderId = req.params.orderId
  const order = await Order.findOne({_id: orderId}).lean()

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select('title thumbnail')

    product.productInfo = productInfo

    product.priceNew = productsHelper.priceNewProduct(product)

    product.totalPrice = product.priceNew * product.quantity
  }

  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)

  res.render('client/pages/checkout/success', {
    pageTitle: "Đặt hàng thành công",
    order
  })
}