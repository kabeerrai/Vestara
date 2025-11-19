const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    zipCode: String,
    state: String,
    country: String,
  },

  paymentMethod: {
    type: String,
    default: "Cash on Delivery"
  },

  products: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  totalAmount: Number,

}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
