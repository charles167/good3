const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String },
    Email: { type: String },
    Date: { type: String },
    show: { type: Boolean, default: false },
    Content: { type: String },
  },
  { timestamps: true }
);
const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
