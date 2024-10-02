const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    image: { type: String },
    Pname: {
      type: "string",
    },
    vendor: {
      type: "string",
    },
    availability: {
      type: "string",
    },
    price: {
      type: "string",
    },
    category: {
      type: "string",
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("ProductDB", ProductSchema);
module.exports = ProductModel;
