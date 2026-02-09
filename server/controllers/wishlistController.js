const Wishlist = require("../models/Wishlist");
const WishlistItem = require("../models/WishlistItem");

// ================= ADD TO WISHLIST =================
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = "guest"; // For demo purposes

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId });
      await wishlist.save();
    }

    const existingItem = await WishlistItem.findOne({ wishlistId: wishlist._id, productId });

    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const wishlistItem = new WishlistItem({ wishlistId: wishlist._id, productId });
    await wishlistItem.save();

    const wishlistItems = await WishlistItem.find({ wishlistId: wishlist._id }).populate("productId");
    res.json({ ...wishlist.toObject(), products: wishlistItems.map(item => item.productId) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET WISHLIST =================
exports.getWishlist = async (req, res) => {
  try {
    const userId = "guest"; // For demo purposes
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.json({ products: [] });
    }

    const wishlistItems = await WishlistItem.find({ wishlistId: wishlist._id }).populate("productId");
    res.json({ ...wishlist.toObject(), products: wishlistItems.map(item => item.productId) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REMOVE FROM WISHLIST =================
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = "guest"; // For demo purposes
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    await WishlistItem.findOneAndDelete({ wishlistId: wishlist._id, productId: req.params.id });

    const wishlistItems = await WishlistItem.find({ wishlistId: wishlist._id }).populate("productId");
    res.json({ ...wishlist.toObject(), products: wishlistItems.map(item => item.productId) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
