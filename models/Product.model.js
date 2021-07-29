const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  ean: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  manufacturer: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl1: { type: String, required: false },
  imageUrl2: { type: String, required: false },
  imageUrl3: { type: String, required: false },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  actived: { type: Boolean, required: true },
  tax: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
