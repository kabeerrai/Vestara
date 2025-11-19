const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    default: "Uncategorized"
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);