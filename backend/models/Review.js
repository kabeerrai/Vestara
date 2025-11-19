const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  productId: String,
  name: String,
  rating: Number,
  review: String,
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);
