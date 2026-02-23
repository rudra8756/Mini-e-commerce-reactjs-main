const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: Number,
  category: { type: String, required: true },
  brand: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  discountPercentage: Number,
  thumbnail: String,
  images: [String],
  description: String,
  stock: { type: Number, default: 100 },
  reviews: [reviewSchema],
  highlights: [String],
  specifications: mongoose.Schema.Types.Mixed,
  size: [String],
  color: [String],
  seller: String,
  freeDelivery: { type: Boolean, default: false },
  deliveryTime: String,
  bankOffers: [String],
  exchangeOffer: String
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
