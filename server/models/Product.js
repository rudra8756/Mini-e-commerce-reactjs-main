const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  category: String,
  brand: String,
  rating: Number,
  discountPercentage: Number,
  thumbnail: String
});

module.exports = mongoose.model("Product", productSchema);
