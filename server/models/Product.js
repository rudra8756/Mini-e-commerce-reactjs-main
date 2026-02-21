const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  discountedPrice: Number,
  category: String,
  brand: String,
  rating: Number,
  discountPercentage: Number,
  thumbnail: String,
  images: [String],
  description: String,
  stock: Number
});

module.exports = mongoose.model("Product", productSchema);
