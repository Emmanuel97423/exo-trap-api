const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  id: { type: mongoose.Schema.ObjectId, ref:"Product" },
  ean: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  manufacturer: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  costPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  actived: { type: String, required: true },
  tax: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
