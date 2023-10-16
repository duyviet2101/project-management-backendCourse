const Cart = require('../../models/cart.model.js')

module.exports.cartId =async (req, res, next) => {

  if (!req.cookies.cartId) {
    const cart = await Cart.create({})

    const expiresTime = 1000 * 60 * 60 * 24 * 365;

    console.log(cart)
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime)
    })
  } else {
    
  }

  next()
}