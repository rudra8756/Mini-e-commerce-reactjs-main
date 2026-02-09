const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  wishlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wishlist",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }
});

module.exports = mongoose.model("WishlistItem", wishlistItemSchema);
