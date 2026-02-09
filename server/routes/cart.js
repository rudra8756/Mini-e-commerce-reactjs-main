const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity
} = require("../controllers/cartController");

// Add to cart
router.post("/", addToCart);

// Get cart
router.get("/", getCart);

// Remove item from cart
router.delete("/:id", removeFromCart);

// Update quantity
router.put("/:id", updateQuantity);

module.exports = router;
