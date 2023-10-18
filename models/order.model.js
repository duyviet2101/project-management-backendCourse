const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  cart_id: String,
  userInfo: {
    fullName: String,
    phone: String,
    address: String
  },
  products: [
    {
      product_id: String,
      quantity: Number,
      price: Number,
      discountPercentage: Number,
    }
  ]
}, {
  timestamps: true
})

const order = mongoose.model("order", orderSchema, "orders")

module.exports = order