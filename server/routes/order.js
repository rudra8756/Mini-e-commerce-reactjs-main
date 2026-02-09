const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} = require("../controllers/orderController");

// Place new order
router.post("/", placeOrder);

// Get user's orders
router.get("/", getUserOrders);

// Get order by ID
router.get("/:id", getOrderById);

// Update order status (admin)
router.put("/:id/status", updateOrderStatus);

module.exports = router;
