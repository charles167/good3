const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderStatus: {
    type: Boolean, // Corrected from "boolean" to Boolean
    default: false,
  },
  name: {
    type: String, // Corrected from "string" to String
  },
  phoneNumber: {
    type: String,
  },
  gender: {
    type: String,
  },
  totalPrice: {
    type: String, // If this is a monetary value, you might want to use Number
  },
  Address: {
    type: String,
  },
  PackPrice: {
    type: String, // Consider using Number if it's a price value
  },
  orderId: {
    type: String,
  },
  image: {
    type: String,
  },
  cartItems: [
    {
      type: Object, // Or a more specific schema for cart items if needed
    },
  ],
  Vendor: {
    type: String,
  },
  Date: {
    type: Date, // Corrected from "Date" to Date type
    default: Date.now,
  },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
