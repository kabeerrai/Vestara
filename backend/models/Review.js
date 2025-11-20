const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    default: "general"
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


module.exports = mongoose.models.Reviews || mongoose.model("Review", ReviewSchema);
