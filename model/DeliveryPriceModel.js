const express = require("express");
const mongoose = require("mongoose");
const PriceShema = new mongoose.Schema({
  vendor: { type: "String", unique: true },
  DeliveryFee: (type = "String"),
  ServiceFee: (type = "String"),
});
const DeliveryPriceModel = mongoose.model("DeliveryPriceModel", PriceShema);
module.exports = DeliveryPriceModel;
